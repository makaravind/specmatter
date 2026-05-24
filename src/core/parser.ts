import { readFile, stat } from 'node:fs/promises';
import { relative } from 'node:path';
import matter from 'gray-matter';
import type { SpecEntry, SpecFrontmatter } from './types.js';

export async function parseSpecFile(filePath: string, root: string): Promise<SpecEntry> {
  const raw = await readFile(filePath, 'utf-8');
  const { data, content } = matter(raw);
  const fileStats = await stat(filePath);

  return {
    path: relative(root, filePath),
    frontmatter: data as SpecFrontmatter,
    content: content.trim(),
    stats: {
      size: fileStats.size,
      modified: fileStats.mtime.toISOString(),
    },
  };
}
