import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { SimpleProgress } from './ProgressIndicator.js';

interface LoadingOperationProps {
  /** Operation name */
  operation: string;
  /** Estimated duration in milliseconds */
  duration?: number;
  /** Callback when operation completes */
  onComplete: () => void;
  /** Callback if operation fails */
  onError?: (error: string) => void;
}

export function LoadingOperation({
  operation,
  duration = 2000,
  onComplete,
  onError,
}: LoadingOperationProps) {
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsComplete(true);
      onComplete();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onComplete]);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <SimpleProgress
        label={isComplete ? `✅ ${operation} complete!` : `⏳ ${operation}...`}
        spinning={!isComplete}
      />

      {!isComplete && <Text color="gray">Please wait while we {operation.toLowerCase()}...</Text>}
    </Box>
  );
}
