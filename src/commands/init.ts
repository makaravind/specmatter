import { writeIndex } from '../core/indexer.js';

export async function runInit(): Promise<void> {
  const root = process.cwd();
  const index = await writeIndex(root);
  console.log(`Indexed ${index.count} spec file(s) → .specmatter/index.json`);
}
