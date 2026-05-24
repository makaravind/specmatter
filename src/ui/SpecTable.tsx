import React from 'react';
import { Box, Text } from 'ink';
import type { SpecEntry } from '../core/types.js';

interface SpecTableProps {
  entries: SpecEntry[];
  selectedIndex: number;
}

const COL = { title: 30, owner: 15, status: 12, version: 8, jiraid: 12 };

function truncate(str: string, len: number): string {
  if (str.length <= len) return str.padEnd(len);
  return str.slice(0, len - 1) + '…';
}

function HeaderRow() {
  return (
    <Box>
      <Text bold color="cyan">{truncate('TITLE', COL.title)}</Text>
      <Text bold color="cyan">{truncate('OWNER', COL.owner)}</Text>
      <Text bold color="cyan">{truncate('STATUS', COL.status)}</Text>
      <Text bold color="cyan">{truncate('VER', COL.version)}</Text>
      <Text bold color="cyan">{truncate('JIRA', COL.jiraid)}</Text>
    </Box>
  );
}

export function SpecTable({ entries, selectedIndex }: SpecTableProps) {
  if (entries.length === 0) {
    return <Text dimColor>No specs found.</Text>;
  }

  return (
    <Box flexDirection="column">
      <HeaderRow />
      {entries.map((entry, i) => {
        const selected = i === selectedIndex;
        const fm = entry.frontmatter;
        return (
          <Box key={entry.path}>
            <Text color={selected ? 'green' : undefined} bold={selected}>
              {selected ? '▶ ' : '  '}
              {truncate(fm.title || entry.path, COL.title)}
              {truncate(fm.owner || '-', COL.owner)}
              {truncate(fm.status || '-', COL.status)}
              {truncate(fm.version || '-', COL.version)}
              {truncate(fm.jiraid || '-', COL.jiraid)}
            </Text>
          </Box>
        );
      })}
    </Box>
  );
}
