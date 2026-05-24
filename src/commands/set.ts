import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import matter from 'gray-matter';
import { indexExists, getIndexPath } from '../utils/paths.js';
import type { SpecIndex } from '../core/types.js';

export async function runSet(specPath: string, key: string, value: string): Promise<void> {
  const target = resolve(specPath);

  if (!existsSync(target)) {
    console.error(`File not found: ${target}`);
    process.exit(1);
  }

  const raw = await readFile(target, 'utf-8');
  const { data, content } = matter(raw);
  data[key] = value;
  const updated = matter.stringify(content, data);
  await writeFile(target, updated);

  const root = process.cwd();
  if (indexExists(root)) {
    const indexRaw = await readFile(getIndexPath(root), 'utf-8');
    const index: SpecIndex = JSON.parse(indexRaw);
    const relativePath = target.replace(index.root + '/', '');
    const entry = index.entries.find((e) => e.path === relativePath);
    if (entry) {
      entry.frontmatter[key] = value;
      await writeFile(getIndexPath(root), JSON.stringify(index, null, 2));
    }
  }

  console.log(`Set ${key} to "${value}" in ${specPath}`);
}
