import React from 'react';
import { Box, Text } from 'ink';

interface StatusBarProps {
  isSearching: boolean;
  isReindexing: boolean;
}

export function StatusBar({ isSearching, isReindexing }: StatusBarProps) {
  if (isReindexing) {
    return (
      <Box>
        <Text color="yellow">Reindexing...</Text>
      </Box>
    );
  }

  return (
    <Box gap={2}>
      <Text dimColor>{isSearching ? '[Esc] Clear' : '[/] Search'}</Text>
      <Text dimColor>[r] Reindex</Text>
      <Text dimColor>[q] Quit</Text>
      <Text dimColor>[↑↓] Navigate</Text>
    </Box>
  );
}
