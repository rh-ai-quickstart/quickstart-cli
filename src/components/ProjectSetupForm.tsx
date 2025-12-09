import React, { useState } from 'react';
import { Box, Text, Spacer, useInput } from 'ink';
import TextInput from 'ink-text-input';
import SelectInput from 'ink-select-input';
import { z } from 'zod';
import { ProjectConfig, PACKAGES, PackageManager } from '../types/features.js';

interface ProjectSetupFormProps {
  initialName?: string;
  initialDescription?: string;
  cliFeatures?: Record<string, boolean>; // Feature flags from CLI args
  onSubmit: (config: ProjectConfig) => void;
  onCancel: () => void;
}

const projectNameSchema = z
  .string()
  .min(2, 'Project name must be at least 2 characters')
  .max(50, 'Project name must be less than 50 characters')
  .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, and hyphens allowed')
  .refine(
    (name) => !name.startsWith('-') && !name.endsWith('-'),
    'Cannot start or end with hyphen'
  );

type FormStep = 'name' | 'description' | 'packageManager' | 'packages' | 'confirm';

interface FormData {
  name: string;
  description?: string;
  packageManager: PackageManager;
  features: Record<string, boolean>;
}

export function ProjectSetupForm({
  initialName,
  initialDescription,
  cliFeatures,
  onSubmit,
  onCancel,
}: ProjectSetupFormProps) {
  const [step, setStep] = useState<FormStep>(
    initialName && initialDescription && cliFeatures
      ? 'confirm'
      : initialName && initialDescription
      ? 'packageManager'
      : initialName && cliFeatures
      ? 'description'
      : initialName
      ? 'description'
      : 'name'
  );
  const [formData, setFormData] = useState<FormData>({
    name: initialName || '',
    description: initialDescription || '',
    packageManager: 'pnpm', // Default to pnpm (recommended)
    features:
      cliFeatures ||
      PACKAGES.reduce(
        (acc, pkg) => ({
          ...acc,
          [pkg.id]: pkg.defaultEnabled,
        }),
        {}
      ),
  });

  const [nameInput, setNameInput] = useState(initialName || '');
  const [descriptionInput, setDescriptionInput] = useState(initialDescription || '');
  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);

  const validateName = (name: string): string | null => {
    try {
      projectNameSchema.parse(name.trim().toLowerCase());
      return null;
    } catch (error) {
      if (error instanceof z.ZodError) {
        return error.errors[0].message;
      }
      return 'Invalid project name';
    }
  };

  const packageChoices = PACKAGES.map((pkg) => ({
    label: `${formData.features[pkg.id] ? '✓' : '○'} ${pkg.name} - ${pkg.description}`,
    value: pkg.id,
  }));

  useInput((input, key) => {
    if (key.escape) {
      onCancel();
      return;
    }

    if (step === 'packages') {
      if (input === ' ') {
        const selectedPackage = PACKAGES[selectedPackageIndex];
        setFormData({
          ...formData,
          features: {
            ...formData.features,
            [selectedPackage.id]: !formData.features[selectedPackage.id],
          },
        });
      } else if (key.upArrow) {
        setSelectedPackageIndex(Math.max(0, selectedPackageIndex - 1));
      } else if (key.downArrow) {
        setSelectedPackageIndex(Math.min(PACKAGES.length - 1, selectedPackageIndex + 1));
      } else if (key.return) {
        setStep('confirm');
      }
    } else if (step === 'confirm') {
      if (input === 'y' || key.return) {
        onSubmit({
          name: formData.name,
          description: formData.description || undefined,
          packageManager: formData.packageManager,
          features: formData.features,
        });
      } else if (input === 'n') {
        setStep('name');
      } else if (input === 'e') {
        setStep('packages');
      }
    }
  });

  const renderHeader = () => (
    <Box flexDirection="column" marginBottom={1}>
      <Text color="cyan" bold>
        Create AI QuickStart Project
      </Text>
      <Text color="gray">
        Use arrow keys to navigate • Space to select • Enter to continue • Esc to cancel
      </Text>
    </Box>
  );

  const renderNameStep = () => (
    <Box flexDirection="column">
      {renderHeader()}
      <Box flexDirection="column" marginBottom={1}>
        <Text>Project Name:</Text>
        <TextInput
          value={nameInput}
          onChange={(value) => {
            setNameInput(value);
            const error = validateName(value);
            setNameError(error);
          }}
          onSubmit={(value) => {
            const cleanName = value.trim().toLowerCase();
            const error = validateName(cleanName);
            if (!error) {
              setFormData({ ...formData, name: cleanName });
              setStep(
                initialDescription && cliFeatures
                  ? 'confirm'
                  : initialDescription
                  ? 'packageManager'
                  : 'description'
              );
            }
          }}
          placeholder="my-awesome-app"
        />
        {nameError && <Text color="red">⚠ {nameError}</Text>}
      </Box>
    </Box>
  );

  const renderDescriptionStep = () => (
    <Box flexDirection="column">
      {renderHeader()}
      <Box flexDirection="column" marginBottom={1}>
        <Text>Project Description (optional):</Text>
        <TextInput
          value={descriptionInput}
          onChange={setDescriptionInput}
          onSubmit={(value) => {
            setFormData({ ...formData, description: value.trim() });
            setStep(cliFeatures ? 'confirm' : 'packageManager');
          }}
          placeholder="A cool AI-powered application"
        />
        <Text color="gray">Press Enter to continue</Text>
      </Box>
    </Box>
  );

  const renderPackageManagerStep = () => {
    const packageManagers = [
      {
        value: 'pnpm' as PackageManager,
        label: 'pnpm (Recommended)',
        description: 'Fast, disk space efficient, great for monorepos',
      },
      {
        value: 'yarn' as PackageManager,
        label: 'Yarn',
        description: 'Fast, reliable, and secure dependency management',
      },
      {
        value: 'npm' as PackageManager,
        label: 'npm',
        description: 'Default Node.js package manager',
      },
    ];

    return (
      <Box flexDirection="column">
        {renderHeader()}
        <Box flexDirection="column" marginBottom={1}>
          <Text>Choose Package Manager:</Text>
          <Box marginTop={1}>
            <SelectInput
              items={packageManagers.map((pm) => ({
                label: pm.label,
                value: pm.value,
              }))}
              onSelect={(item) => {
                setFormData({ ...formData, packageManager: item.value });
                setStep(cliFeatures ? 'confirm' : 'packages');
              }}
              initialIndex={packageManagers.findIndex((pm) => pm.value === formData.packageManager)}
            />
          </Box>
          <Box marginTop={1} flexDirection="column">
            {packageManagers.map((pm) => (
              <Text key={pm.value} color="gray" dimColor>
                {pm.value}: {pm.description}
              </Text>
            ))}
          </Box>
        </Box>
      </Box>
    );
  };

  const renderPackagesStep = () => (
    <Box flexDirection="column">
      {renderHeader()}
      <Box flexDirection="column" marginBottom={1}>
        <Text>Select Packages:</Text>
        <Box flexDirection="column" marginTop={1}>
          {PACKAGES.map((pkg, index) => (
            <Box key={pkg.id} flexDirection="row">
              <Text color={index === selectedPackageIndex ? 'cyan' : 'white'}>
                {index === selectedPackageIndex ? '❯ ' : '  '}
                {formData.features[pkg.id] ? '✓' : '○'} {pkg.name}
              </Text>
              <Text color="gray"> - {pkg.description}</Text>
            </Box>
          ))}
        </Box>
        <Box marginTop={1}>
          <Text color="gray">Space to toggle • Enter when done</Text>
        </Box>
      </Box>
    </Box>
  );

  const renderConfirmStep = () => {
    const selectedPackages = PACKAGES.filter((pkg) => formData.features[pkg.id]);

    return (
      <Box flexDirection="column">
        {renderHeader()}
        <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
          <Text color="cyan" bold>
            📋 Configuration Summary
          </Text>
          <Spacer />
          <Text>
            📁 Project:{' '}
            <Text color="white" bold>
              {formData.name}
            </Text>
          </Text>
          {formData.description && (
            <Text>
              📝 Description: <Text color="gray">{formData.description}</Text>
            </Text>
          )}
          <Spacer />
          <Text>
            📦 Package Manager:{' '}
            <Text color="white" bold>
              {formData.packageManager}
            </Text>
          </Text>
          <Spacer />
          <Text color="cyan">📦 Selected Packages:</Text>
          {selectedPackages.map((pkg) => (
            <Text key={pkg.id}> ✓ {pkg.name}</Text>
          ))}
          <Spacer />
          <Text>
            📁 Output: <Text color="gray">./{formData.name}</Text>
          </Text>
        </Box>

        <Box marginTop={1}>
          <Text>
            <Text color="green">y</Text>es to create •<Text color="red">n</Text>o to restart •
            <Text color="yellow">e</Text>dit packages
          </Text>
        </Box>
      </Box>
    );
  };

  if (step === 'name') return renderNameStep();
  if (step === 'description') return renderDescriptionStep();
  if (step === 'packageManager') return renderPackageManagerStep();
  if (step === 'packages') return renderPackagesStep();
  if (step === 'confirm') return renderConfirmStep();

  return null;
}
