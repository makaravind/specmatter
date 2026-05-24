import { join } from 'node:path';
import { existsSync } from 'node:fs';

const SPECMATTER_DIR = '.specmatter';
const INDEX_FILE = 'index.json';

export function getSpecmatterDir(root: string): string {
  return join(root, SPECMATTER_DIR);
}

export function getIndexPath(root: string): string {
  return join(root, SPECMATTER_DIR, INDEX_FILE);
}

export function indexExists(root: string): boolean {
  return existsSync(getIndexPath(root));
}
