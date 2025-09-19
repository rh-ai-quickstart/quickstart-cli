/**
 * Tests for ProjectGenerationSimple component
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import React from 'react';
import { render } from 'ink-testing-library';
import { ProjectGenerationSimple } from '../ProjectGenerationSimple.js';
import { DEFAULT_TEST_CONFIG } from '../../__tests__/utils/test-helpers.js';

// Mock the ProjectGenerator
vi.mock('../../generators/index.js', () => ({
  ProjectGenerator: vi.fn().mockImplementation(() => ({
    generateProject: vi.fn().mockImplementation(function* () {
      yield { step: 'foundation', message: 'Creating project structure...' };
      yield { step: 'ui', message: 'Setting up UI package...' };
      yield { step: 'api', message: 'Setting up API package...' };
      yield { step: 'db', message: 'Setting up database package...' };
      yield { step: 'install', message: 'Installing dependencies...' };
      yield { step: 'git', message: 'Initializing git repository...' };
      return { success: true };
    }),
  })),
}));

describe('ProjectGenerationSimple', () => {
  const defaultProps = {
    config: DEFAULT_TEST_CONFIG,
    outputDir: '/tmp/test-project',
    onComplete: vi.fn(),
    onError: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should show generation starting message', () => {
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} />);

      const output = lastFrame();
      expect(output).toContain('🔧 Generating Project');
      expect(output).toContain(DEFAULT_TEST_CONFIG.name);
    });

    it('should display progress information', () => {
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} />);

      const output = lastFrame();
      expect(output).toMatch(/Processing|Project directory|This may take a few moments/);
    });
  });

  describe('generation progress', () => {
    it('should show initial generation state', () => {
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} />);

      const output = lastFrame();
      expect(output).toMatch(/Project directory|Processing|Generating/);
    });

    it('should show step information', () => {
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} />);

      const output = lastFrame();
      expect(output).toMatch(/Project directory|Root configuration|UI package|API package/);
    });

    it('should show progress indication', () => {
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} />);

      const output = lastFrame();
      expect(output).toMatch(/Step \d+ of \d+|\d+%|Processing/); // Step counter, percentage, or processing indicator
    });
  });

  describe('completion handling', () => {
    it('should attempt project generation', () => {
      const onComplete = vi.fn();
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} onComplete={onComplete} />);

      // Should show that generation has started
      const output = lastFrame();
      expect(output).toContain('🔧 Generating Project');
    });

    it('should show helpful messages during generation', () => {
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} />);

      const output = lastFrame();
      expect(output).toMatch(/This may take a few moments|Processing/);
    });
  });

  describe('error handling', () => {
    it('should initialize generation component', () => {
      const onError = vi.fn();
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} onError={onError} />);

      // Should show the generation interface
      const output = lastFrame();
      expect(output).toContain('🔧 Generating Project');
    });
  });

  describe('different configurations', () => {
    it('should handle different project configurations', () => {
      const configUiOnly = {
        ...DEFAULT_TEST_CONFIG,
        features: { ui: true, api: false, db: false },
      };

      const { lastFrame } = render(
        <ProjectGenerationSimple {...defaultProps} config={configUiOnly} />
      );

      // Should show generation for the specific config
      const output = lastFrame();
      expect(output).toContain('🔧 Generating Project');
      expect(output).toContain(configUiOnly.name);
    });

    it('should handle full-stack configuration', () => {
      const fullStackConfig = {
        ...DEFAULT_TEST_CONFIG,
        features: { ui: true, api: true, db: true },
      };

      const { lastFrame } = render(
        <ProjectGenerationSimple {...defaultProps} config={fullStackConfig} />
      );

      const output = lastFrame();
      expect(output).toContain('🔧 Generating Project');
      expect(output).toContain(fullStackConfig.name);
    });
  });

  describe('visual elements', () => {
    it('should display generation header with emoji', () => {
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} />);

      const output = lastFrame();
      expect(output).toContain('🔧 Generating Project');
    });

    it('should show helpful information text', () => {
      const { lastFrame } = render(<ProjectGenerationSimple {...defaultProps} />);

      const output = lastFrame();
      expect(output).toMatch(/This may take a few moments|Processing/);
    });
  });
});
