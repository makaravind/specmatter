import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import matter from 'gray-matter';

export async function runGet(specPath: string, key: string): Promise<void> {
  const target = resolve(specPath);

  if (!existsSync(target)) {
    console.error(`File not found: ${target}`);
    process.exit(1);
  }

  const raw = await readFile(target, 'utf-8');
  const { data } = matter(raw);

  if (!(key in data)) {
    console.error(`Key "${key}" not found in ${specPath}`);
    process.exit(1);
  }

  console.log(data[key]);
}
