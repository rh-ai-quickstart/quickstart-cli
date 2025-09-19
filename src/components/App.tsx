import React, { useState, useEffect } from 'react';
import { Box, Text, useApp } from 'ink';
import { z } from 'zod';
import BigText from 'ink-big-text';
import Gradient from 'ink-gradient';
import { ProjectSetupForm } from './ProjectSetupForm.js';
import { ProjectGenerationSimple as ProjectGeneration } from './ProjectGenerationSimple.js';
import { SuccessMessage } from './SuccessMessage.js';
import { ErrorMessage } from './ErrorMessage.js';
import { ProjectConfig } from '../types/features.js';

const ArgsSchema = z.object({
  name: z.string().optional(),
  skipDependencies: z.boolean().default(false),
  skipHeader: z.boolean().default(false),
  outputDir: z.string().default(process.cwd()),
  // Package selection and description
  packages: z.array(z.enum(['api', 'ui', 'db'])).optional(),
  description: z.string().optional(),
});

type Args = z.infer<typeof ArgsSchema>;

interface AppProps {
  args: Args;
}

type AppState = 'welcome' | 'setup' | 'generating' | 'success' | 'error';

interface AppData {
  config?: ProjectConfig;
  error?: string;
  outputPath?: string;
}

export function App({ args }: AppProps) {
  const { exit } = useApp();
  const isCI = process.env.CI === 'true';
  // Auto-generate if all required fields are provided or in CI
  const hasAllRequiredFields = args.name && args.packages;
  const shouldAutoGenerate = hasAllRequiredFields || isCI;

  const cliFeatures: ProjectConfig['features'] | undefined = args.packages
    ? {
        api: args.packages.includes('api'),
        ui: args.packages.includes('ui'),
        db: args.packages.includes('db'),
      }
    : isCI
    ? {
        api: true,
        ui: true,
        db: false, // Default to no db in CI
      }
    : undefined;

  const autoConfig: ProjectConfig | undefined = shouldAutoGenerate
    ? {
        name: (args.name || 'my-project').trim().toLowerCase(),
        description: args.description || 'Generated project',
        packageManager: 'pnpm',
        features: cliFeatures as ProjectConfig['features'],
      }
    : undefined;

  const [state, setState] = useState<AppState>(
    shouldAutoGenerate ? 'generating' : args.skipHeader ? 'setup' : 'welcome'
  );
  const [data, setData] = useState<AppData>(() => (autoConfig ? { config: autoConfig } : {}));

  useEffect(() => {
    if (!shouldAutoGenerate && !args.skipHeader) {
      // Show welcome screen briefly, then move to setup
      const timer = setTimeout(() => {
        setState('setup');
      }, 3000);

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [shouldAutoGenerate, args.skipHeader]);

  const handleConfigSubmit = (config: ProjectConfig) => {
    setData({ ...data, config });
    setState('generating');
  };

  const handleGenerationComplete = (outputPath: string) => {
    setData({ ...data, outputPath });
    setState('success');
  };

  const handleError = (error: string) => {
    setData({ ...data, error });
    setState('error');
  };

  const handleRestart = () => {
    setData({});
    setState('setup');
  };

  if (state === 'welcome') {
    return (
      <Box flexDirection="column" alignItems="center" justifyContent="center" height={10}>
        <Gradient name="rainbow">
          <BigText text="AI Kickstart" font="block" />
        </Gradient>
        <Text color="cyan">One-click AI-powered full-stack applications</Text>
      </Box>
    );
  }

  if (state === 'setup') {
    return (
      <ProjectSetupForm
        initialName={args.name}
        initialDescription={args.description}
        cliFeatures={cliFeatures}
        onSubmit={handleConfigSubmit}
        onCancel={() => exit()}
      />
    );
  }

  if (state === 'generating' && data.config) {
    return (
      <ProjectGeneration
        config={data.config}
        outputDir={args.outputDir}
        skipDependencies={args.skipDependencies}
        onComplete={handleGenerationComplete}
        onError={handleError}
      />
    );
  }

  if (state === 'success' && data.outputPath) {
    return (
      <SuccessMessage projectPath={data.outputPath} projectName={data.config?.name || 'project'} />
    );
  }

  if (state === 'error' && data.error) {
    return <ErrorMessage error={data.error} onRestart={handleRestart} onExit={() => exit()} />;
  }

  return null;
}
