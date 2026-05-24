import React from 'react';
import { render } from 'ink';
import { readFile } from 'node:fs/promises';
import { getIndexPath, indexExists } from '../utils/paths.js';
import type { SpecIndex } from '../core/types.js';
import { App } from '../ui/App.js';

export async function runDashboard(): Promise<void> {
  const root = process.cwd();

  if (!indexExists(root)) {
    console.error('No index found. Run `specmatter init` first.');
    process.exit(1);
  }

  const raw = await readFile(getIndexPath(root), 'utf-8');
  const index: SpecIndex = JSON.parse(raw);

  render(<App index={index} />);
}
