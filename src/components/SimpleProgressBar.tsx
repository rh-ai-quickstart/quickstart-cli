import React from 'react';
import { Box, Text } from 'ink';

interface SimpleProgressBarProps {
  /** Progress percentage (0-100) */
  progress: number;
  /** Width of the progress bar */
  width?: number;
  /** Character to use for completed progress */
  fillChar?: string;
  /** Character to use for remaining progress */
  emptyChar?: string;
  /** Show percentage text */
  showPercentage?: boolean;
}

export function SimpleProgressBar({
  progress,
  width = 40,
  fillChar = '█',
  emptyChar = '░',
  showPercentage = true,
}: SimpleProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const filledWidth = Math.round((clampedProgress / 100) * width);
  const emptyWidth = width - filledWidth;

  const progressBar = fillChar.repeat(filledWidth) + emptyChar.repeat(emptyWidth);

  return (
    <Box flexDirection="row" alignItems="center">
      <Text color="green">{progressBar}</Text>
      {showPercentage && (
        <Box marginLeft={1}>
          <Text color="gray">{Math.round(clampedProgress)}%</Text>
        </Box>
      )}
    </Box>
  );
}
