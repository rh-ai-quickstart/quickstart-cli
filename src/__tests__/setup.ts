/**
 * Vitest test setup
 */
import { beforeEach, vi } from 'vitest';

// Increase timeout for file system operations
beforeEach(() => {
  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'info').mockImplementation(() => {});
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});

// Global test utilities
global.testTimeout = 30000;
