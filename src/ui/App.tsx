import React, { useState, useMemo } from 'react';
import { Box, Text, useInput, useApp } from 'ink';
import { exec } from 'node:child_process';
import { join } from 'node:path';
import type { SpecIndex, SpecEntry } from '../core/types.js';
import { writeIndex } from '../core/indexer.js';
import { SpecTable } from './SpecTable.js';
import { SearchBar } from './SearchBar.js';
import { StatusBar } from './StatusBar.js';

function openFile(filePath: string): void {
  const cmd = process.platform === 'win32' ? 'start ""' :
    process.platform === 'darwin' ? 'open' : 'xdg-open';
  exec(`${cmd} "${filePath}"`);
}

interface AppProps {
  index: SpecIndex;
}

export function App({ index }: AppProps) {
  const { exit } = useApp();
  const [entries, setEntries] = useState<SpecEntry[]>(index.entries);
  const [filter, setFilter] = useState('');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isSearching, setIsSearching] = useState(false);
  const [isReindexing, setIsReindexing] = useState(false);

  const filtered = useMemo(() => {
    if (!filter) return entries;
    const q = filter.toLowerCase();
    return entries.filter(
      (e) =>
        (e.frontmatter.title || '').toLowerCase().includes(q) ||
        (e.frontmatter.status || '').toLowerCase().includes(q)
    );
  }, [entries, filter]);

  useInput((input, key) => {
    if (isSearching) {
      if (key.escape) {
        setIsSearching(false);
        setFilter('');
        setSelectedIdx(0);
      }
      return;
    }

    if (input === '/') {
      setIsSearching(true);
      return;
    }
    if (input === 'q') {
      exit();
      return;
    }
    if (input === 'r' && !isReindexing) {
      setIsReindexing(true);
      writeIndex(index.root).then((newIndex) => {
        setEntries(newIndex.entries);
        setSelectedIdx(0);
        setIsReindexing(false);
      });
      return;
    }
    if (key.return && filtered.length > 0) {
      const entry = filtered[selectedIdx];
      openFile(join(index.root, entry.path));
      return;
    }
    if (key.upArrow) {
      setSelectedIdx((prev) => Math.max(0, prev - 1));
    }
    if (key.downArrow) {
      setSelectedIdx((prev) => Math.min(filtered.length - 1, prev + 1));
    }
  });

  return (
    <Box flexDirection="column" padding={1}>
      <Box justifyContent="space-between">
        <Text bold>specmatter</Text>
        <Text dimColor>[{filtered.length} specs]</Text>
      </Box>
      <SearchBar value={filter} onChange={setFilter} isActive={isSearching} />
      <Box marginY={1}>
        <SpecTable entries={filtered} selectedIndex={selectedIdx} />
      </Box>
      <StatusBar isSearching={isSearching} isReindexing={isReindexing} />
    </Box>
  );
}
