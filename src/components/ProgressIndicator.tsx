import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { SimpleProgressBar } from './SimpleProgressBar.js';

interface ProgressIndicatorProps {
  /** Current progress percentage (0-100) */
  progress: number;
  /** Current step label */
  label: string;
  /** Current step number */
  currentStep?: number;
  /** Total number of steps */
  totalSteps?: number;
  /** Whether the operation is complete */
  isComplete?: boolean;
  /** Width of the progress bar */
  width?: number;
  /** Show estimated time remaining */
  estimatedTimeRemaining?: string;
}

export function ProgressIndicator({
  progress,
  label,
  currentStep,
  totalSteps,
  isComplete = false,
  width = 50,
  estimatedTimeRemaining,
}: ProgressIndicatorProps) {
  return (
    <Box flexDirection="column">
      {/* Current Step */}
      <Box flexDirection="row" marginBottom={1}>
        {!isComplete && <Spinner type="dots" />}
        {isComplete && <Text color="green">✅</Text>}
        <Box marginLeft={1}>
          <Text>{label}</Text>
        </Box>
      </Box>

      {/* Progress Bar */}
      <Box flexDirection="column" marginBottom={1}>
        <Box marginBottom={1}>
          <SimpleProgressBar progress={progress} width={width} showPercentage={false} />
        </Box>

        <Box flexDirection="row" justifyContent="space-between">
          <Box>
            {currentStep && totalSteps && (
              <Text color="gray">
                Step {currentStep} of {totalSteps}
              </Text>
            )}
          </Box>
          <Box flexDirection="row">
            {estimatedTimeRemaining && !isComplete && (
              <Box marginRight={2}>
                <Text color="gray">~{estimatedTimeRemaining} remaining</Text>
              </Box>
            )}
            <Text color="gray">{Math.round(progress)}%</Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

interface SimpleProgressProps {
  /** Progress label */
  label: string;
  /** Whether to show spinner */
  spinning?: boolean;
}

export function SimpleProgress({ label, spinning = true }: SimpleProgressProps) {
  return (
    <Box flexDirection="row" marginBottom={1}>
      {spinning && <Spinner type="dots" />}
      <Box marginLeft={spinning ? 1 : 0}>
        <Text>{label}</Text>
      </Box>
    </Box>
  );
}
