import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { existsSync } from 'node:fs';
import matter from 'gray-matter';
import { writeIndex } from '../core/indexer.js';
import { indexExists } from '../utils/paths.js';

interface MakeOptions {
  title?: string;
  owner?: string;
  version?: string;
  status?: string;
  jiraid?: string;
  [key: string]: string | undefined;
}

export async function runMake(specPath: string, options: MakeOptions): Promise<void> {
  const target = resolve(specPath);

  if (!existsSync(target)) {
    console.error(`File not found: ${target}`);
    process.exit(1);
  }

  const raw = await readFile(target, 'utf-8');
  const { data, content } = matter(raw);

  if (Object.keys(data).length > 0) {
    console.error(`File already has frontmatter: ${specPath}`);
    process.exit(1);
  }

  const frontmatter: Record<string, string> = {
    title: options.title || '',
    owner: options.owner || '',
    version: options.version || '0.1.0',
    status: options.status || 'draft',
    jiraid: options.jiraid || '',
  };

  const updated = matter.stringify(content || raw, frontmatter);
  await writeFile(target, updated);

  const root = process.cwd();
  if (indexExists(root)) {
    await writeIndex(root);
  }

  console.log(`Added frontmatter to ${specPath}`);
}
