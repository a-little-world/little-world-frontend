import { access, cp, mkdir, readdir } from 'node:fs/promises';
import path from 'node:path';

const target = process.argv[2];

if (target !== 'esm' && target !== 'cjs') {
  throw new Error('Usage: node scripts/copy-assets.mjs <esm|cjs>');
}

const rootDir = process.cwd();
const srcDir = path.join(rootDir, 'src');
const outDir = path.join(rootDir, 'dist', target);

const copyCssRecursive = async dirPath => {
  const entries = await readdir(dirPath, { withFileTypes: true });

  await Promise.all(
    entries.map(async entry => {
      const sourcePath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await copyCssRecursive(sourcePath);
        return;
      }

      if (!entry.name.endsWith('.css')) {
        return;
      }

      const relativePath = path.relative(srcDir, sourcePath);
      const destinationPath = path.join(outDir, relativePath);

      await mkdir(path.dirname(destinationPath), { recursive: true });
      await cp(sourcePath, destinationPath);
    }),
  );
};

const copyDirIfPresent = async dirName => {
  const sourcePath = path.join(srcDir, dirName);

  try {
    await access(sourcePath);
    await cp(sourcePath, path.join(outDir, dirName), {
      recursive: true,
      force: true,
    });
  } catch {
    return;
  }
};

await mkdir(outDir, { recursive: true });
await copyCssRecursive(srcDir);
await Promise.all([copyDirIfPresent('images'), copyDirIfPresent('locale')]);
