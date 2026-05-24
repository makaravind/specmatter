import React from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  isActive: boolean;
}

export function SearchBar({ value, onChange, isActive }: SearchBarProps) {
  if (!isActive) return null;

  return (
    <Box>
      <Text color="yellow">Search: </Text>
      <TextInput value={value} onChange={onChange} />
    </Box>
  );
}
