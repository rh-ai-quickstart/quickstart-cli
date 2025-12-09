import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { ProgressIndicator } from './ProgressIndicator.js';
import { ProjectConfig } from '../types/features.js';
import { ProjectGenerator } from '../generators/index.js';
import * as path from 'path';

interface ProjectGenerationProps {
  config: ProjectConfig;
  outputDir: string;
  skipDependencies?: boolean;
  onComplete: (outputPath: string) => void;
  onError: (error: string) => void;
}

const STEP_LABELS = [
  'Project directory',
  'Root configuration',
  'UI package',
  'API package',
  'Database package',
  'Dependencies',
  'Git repository',
];

export function ProjectGenerationSimple({
  config,
  outputDir,
  skipDependencies = false,
  onComplete,
  onError,
}: ProjectGenerationProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const [totalSteps, setTotalSteps] = useState(STEP_LABELS.length);

  useEffect(() => {
    generateProject();
  }, []);

  const generateProject = async () => {
    try {
      const projectOutputDir = path.join(outputDir, config.name);

      // Create generator instance
      const generator = new ProjectGenerator(projectOutputDir, config, { skipDependencies });
      const generatorIterator = generator.generateProject();

      // Process generator steps one by one with delays
      const processNextStep = async () => {
        const { value: step, done } = await generatorIterator.next();

        if (!done && step) {
          const progressPercent = (step.currentStep / step.totalSteps) * 100;
          setProgress(progressPercent);
          setCurrentStepIndex(step.currentStep - 1);
          setCurrentFile(step.message);
          setTotalSteps(step.totalSteps);

          // Continue to next step after a delay
          setTimeout(processNextStep, 200);
        } else {
          // Generation complete
          setProgress(100);
          setIsComplete(true);
          setCurrentFile('Complete!');

          setTimeout(() => {
            onComplete(projectOutputDir);
          }, 500);
        }
      };

      // Start processing
      processNextStep();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      onError(errorMessage);
    }
  };

  const currentStepLabel = STEP_LABELS[currentStepIndex] || currentFile;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Box flexDirection="column" marginBottom={2}>
        <Text color="cyan" bold>
          🔧 Generating Project: {config.name}
        </Text>
      </Box>
      <ProgressIndicator
        progress={progress}
        label={currentStepLabel || 'Processing...'}
        currentStep={currentStepIndex + 1}
        totalSteps={totalSteps}
        isComplete={isComplete}
        width={50}
      />

      {!isComplete && (
        <Text color="gray">This may take a few moments depending on the selected packages...</Text>
      )}

      {isComplete && <Text color="green">🎉 Project generation complete!</Text>}
    </Box>
  );
}
