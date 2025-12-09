import React, { useState } from 'react';
import { useApp } from 'ink';
import { z } from 'zod';
import { ProjectSetupForm } from './ProjectSetupForm.js';
import { ProjectGenerationSimple as ProjectGeneration } from './ProjectGenerationSimple.js';
import { SuccessMessage } from './SuccessMessage.js';
import { ErrorMessage } from './ErrorMessage.js';
import { ProjectConfig, PackageIdEnum, PACKAGES } from '../types/features.js';

const ArgsSchema = z.object({
  name: z.string().optional(),
  skipDependencies: z.boolean().default(false),
  outputDir: z.string().default(process.cwd()),
  // Package selection and description - derived from PACKAGES
  packages: z.array(PackageIdEnum()).optional(),
  description: z.string().optional(),
});

type Args = z.infer<typeof ArgsSchema>;

interface AppProps {
  args: Args;
}

type AppState = 'setup' | 'generating' | 'success' | 'error';

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
    ? PACKAGES.reduce(
        (acc, pkg) => ({
          ...acc,
          [pkg.id]: args.packages!.includes(pkg.id),
        }),
        {} as Record<string, boolean>
      )
    : isCI
    ? PACKAGES.reduce(
        (acc, pkg) => ({
          ...acc,
          [pkg.id]: pkg.id !== 'db', // Default to no db in CI
        }),
        {} as Record<string, boolean>
      )
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
    shouldAutoGenerate ? 'generating' : 'setup'
  );
  const [data, setData] = useState<AppData>(() => (autoConfig ? { config: autoConfig } : {}));

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
