import { glob } from 'glob';
import { writeFile, mkdir } from 'node:fs/promises';
import { parseSpecFile } from './parser.js';
import { getSpecmatterDir, getIndexPath } from '../utils/paths.js';
import type { SpecIndex } from './types.js';

export async function findSpecFiles(root: string): Promise<string[]> {
  return glob('**/*.SPEC.md', { cwd: root, absolute: true, nodir: true });
}

export async function buildIndex(root: string): Promise<SpecIndex> {
  const files = await findSpecFiles(root);
  const entries = await Promise.all(
    files.map((file) => parseSpecFile(file, root))
  );

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    root,
    count: entries.length,
    entries,
  };
}

export async function writeIndex(root: string): Promise<SpecIndex> {
  const index = await buildIndex(root);
  const dir = getSpecmatterDir(root);
  await mkdir(dir, { recursive: true });
  await writeFile(getIndexPath(root), JSON.stringify(index, null, 2));
  return index;
}
