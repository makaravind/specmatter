import { writeFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { existsSync } from 'node:fs';

const TEMPLATE = `---
title: ""
owner: ""
version: "0.1.0"
status: "draft"
jiraid: ""
---

# Spec Title

## Overview

## Requirements

## Design

`;

export async function runCreate(path: string): Promise<void> {
  const target = resolve(path);

  if (existsSync(target)) {
    console.error(`File already exists: ${target}`);
    process.exit(1);
  }

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, TEMPLATE);
  console.log(`Created spec file: ${target}`);
}
