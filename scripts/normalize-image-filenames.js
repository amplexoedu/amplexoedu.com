const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const imagesDir = path.join(rootDir, 'assets', 'images');
const dryRun = process.argv.includes('--dry-run');

const textFileExtensions = new Set(['.html', '.css', '.js', '.md', '.txt', '.json']);

const stemOverrides = new Map([
  ['tsg-criacao-de-sites-em-todo-brasil-site-seguro-clique-para-verificar', 'site-seguro-badge'],
  ['amplexo1', 'home-hero'],
  ['ample3', 'home-gallery-main'],
  ['ample4', 'home-gallery-alt'],
]);

function walkFiles(startDir, visitor) {
  const entries = fs.readdirSync(startDir, { withFileTypes: true });
  for (const entry of entries) {
    const absPath = path.join(startDir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === '.git' || entry.name === 'node_modules') {
        continue;
      }
      walkFiles(absPath, visitor);
      continue;
    }
    visitor(absPath);
  }
}

function toPosixPath(inputPath) {
  return inputPath.split(path.sep).join('/');
}

function relFromRoot(absPath) {
  return toPosixPath(path.relative(rootDir, absPath));
}

function applyPatternShortcuts(stem) {
  const whatsappPattern = /^whatsapp-image-(\d{4})-(\d{2})-(\d{2})-at-(\d{2})-(\d{2})-(\d{2})(?:-(\d+))?$/;
  const whatsappPtPattern = /^imagem-do-whatsapp-de-(\d{4})-(\d{2})-(\d{2})-a-s-(\d{2})-(\d{2})-(\d{2})(?:-[a-f0-9]{6,})?$/;
  const screenshotPattern = /^captura-de-tela-(\d{4})-(\d{2})-(\d{2})-(\d{6})$/;

  if (whatsappPattern.test(stem)) {
    return stem.replace(whatsappPattern, (_, year, month, day, hour, minute, second, index) => {
      const suffix = index ? `-${index}` : '';
      return `whatsapp-${year}${month}${day}-${hour}${minute}${second}${suffix}`;
    });
  }

  if (whatsappPtPattern.test(stem)) {
    return stem.replace(whatsappPtPattern, (_, year, month, day, hour, minute, second) => {
      return `whatsapp-${year}${month}${day}-${hour}${minute}${second}`;
    });
  }

  if (screenshotPattern.test(stem)) {
    return stem.replace(screenshotPattern, (_, year, month, day, time) => {
      return `screenshot-${year}${month}${day}-${time}`;
    });
  }

  return stem;
}

function normalizeStem(stem) {
  let value = stem.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const hashSuffixMatch = value.match(/-([A-Za-z0-9]{8,})$/);
  if (hashSuffixMatch) {
    const suffix = hashSuffixMatch[1];
    const hasLetters = /[A-Za-z]/.test(suffix);
    const hasDigits = /[0-9]/.test(suffix);
    const hasUppercase = /[A-Z]/.test(suffix);
    const isDimensionToken = /^\d+x\d+$/i.test(suffix);
    if (hasLetters && hasDigits && hasUppercase && !isDimensionToken) {
      value = value.slice(0, -(`-${suffix}`).length);
    }
  }

  value = value.toLowerCase();
  value = value.replace(/_/g, '-');
  value = value.replace(/\s+/g, '-');
  value = value.replace(/\./g, '-');
  value = value.replace(/-removebg-preview/g, '');
  value = value.replace(/-+/g, '-').replace(/^-|-$/g, '');
  value = applyPatternShortcuts(value);

  if (stemOverrides.has(value)) {
    value = stemOverrides.get(value);
  }

  return value;
}

function buildRenamePlan() {
  const imageFiles = [];

  walkFiles(imagesDir, (absPath) => {
    imageFiles.push(absPath);
  });

  imageFiles.sort((a, b) => relFromRoot(a).localeCompare(relFromRoot(b)));

  const usedTargets = new Set();
  const plan = [];

  for (const absPath of imageFiles) {
    const dir = path.dirname(absPath);
    const ext = path.extname(absPath).toLowerCase();
    const oldBase = path.basename(absPath, path.extname(absPath));
    let normalizedBase = normalizeStem(oldBase);

    if (!normalizedBase) {
      normalizedBase = 'image';
    }

    let candidateName = `${normalizedBase}${ext}`;
    let candidateAbsPath = path.join(dir, candidateName);

    if (usedTargets.has(candidateAbsPath)) {
      let suffix = 2;
      while (usedTargets.has(path.join(dir, `${normalizedBase}-${suffix}${ext}`))) {
        suffix += 1;
      }
      candidateName = `${normalizedBase}-${suffix}${ext}`;
      candidateAbsPath = path.join(dir, candidateName);
    }

    usedTargets.add(candidateAbsPath);

    if (path.basename(absPath) === candidateName) {
      continue;
    }

    plan.push({
      oldAbsPath: absPath,
      newAbsPath: candidateAbsPath,
      oldRelPath: relFromRoot(absPath),
      newRelPath: relFromRoot(candidateAbsPath),
    });
  }

  return plan;
}

function applyRenames(plan) {
  const tempPlan = [];

  for (let i = 0; i < plan.length; i += 1) {
    const step = plan[i];
    const tempAbsPath = `${step.oldAbsPath}.tmp-rename-${i}`;
    fs.renameSync(step.oldAbsPath, tempAbsPath);
    tempPlan.push({ ...step, tempAbsPath });
  }

  for (const step of tempPlan) {
    fs.renameSync(step.tempAbsPath, step.newAbsPath);
  }
}

function replacePathReferences(plan) {
  const replacements = new Map();
  for (const step of plan) {
    replacements.set(step.oldRelPath, step.newRelPath);
  }

  const updatedFiles = [];

  walkFiles(rootDir, (absPath) => {
    if (
      absPath.startsWith(imagesDir)
      || absPath.includes(`${path.sep}.git${path.sep}`)
      || absPath.includes(`${path.sep}node_modules${path.sep}`)
      || absPath.includes(`${path.sep}reports${path.sep}`)
    ) {
      return;
    }

    const ext = path.extname(absPath).toLowerCase();
    if (!textFileExtensions.has(ext)) {
      return;
    }

    const original = fs.readFileSync(absPath, 'utf8');
    let updated = original;

    for (const [fromPath, toPath] of replacements.entries()) {
      updated = updated.split(fromPath).join(toPath);
    }

    if (updated !== original) {
      updatedFiles.push(relFromRoot(absPath));
      if (!dryRun) {
        fs.writeFileSync(absPath, updated, 'utf8');
      }
    }
  });

  return updatedFiles;
}

function main() {
  if (!fs.existsSync(imagesDir)) {
    console.error('Directory not found:', imagesDir);
    process.exit(1);
  }

  const plan = buildRenamePlan();

  if (plan.length === 0) {
    console.log('No image files need renaming.');
    return;
  }

  console.log(`Planned renames: ${plan.length}`);
  for (const step of plan) {
    console.log(`- ${step.oldRelPath} -> ${step.newRelPath}`);
  }

  if (!dryRun) {
    applyRenames(plan);
  }

  const updatedFiles = replacePathReferences(plan);
  console.log(`Updated text files: ${updatedFiles.length}`);
  for (const filePath of updatedFiles) {
    console.log(`- ${filePath}`);
  }

  if (dryRun) {
    console.log('Dry run only. No files were changed.');
  } else {
    console.log('Renaming and reference update completed.');
  }
}

main();
