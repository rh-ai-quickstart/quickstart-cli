/**
 * Unit tests for name normalization utilities
 */

import { describe, it, expect } from 'vitest';
import { normalizeName, normalizeServiceName, normalizeVolumeName } from '../../../generators/utils/name-normalize.js';

describe('name-normalize', () => {
  describe('normalizeName', () => {
    it('should convert to lowercase', () => {
      expect(normalizeName('MyProject')).toBe('myproject');
      expect(normalizeName('MY-PROJECT')).toBe('my-project');
    });

    it('should replace spaces with hyphens', () => {
      expect(normalizeName('My Project')).toBe('my-project');
      expect(normalizeName('My  Project')).toBe('my-project'); // Multiple spaces
    });

    it('should replace underscores with hyphens', () => {
      expect(normalizeName('my_project')).toBe('my-project');
      expect(normalizeName('my__project')).toBe('my-project'); // Multiple underscores
    });

    it('should normalize multiple hyphens to single hyphen', () => {
      expect(normalizeName('my---project')).toBe('my-project');
      expect(normalizeName('my--project')).toBe('my-project');
    });

    it('should remove leading and trailing hyphens', () => {
      expect(normalizeName('-my-project')).toBe('my-project');
      expect(normalizeName('my-project-')).toBe('my-project');
      expect(normalizeName('-my-project-')).toBe('my-project');
    });

    it('should handle mixed separators', () => {
      expect(normalizeName('My Project_Name')).toBe('my-project-name');
      expect(normalizeName('My-Project Name')).toBe('my-project-name');
    });

    it('should trim whitespace', () => {
      expect(normalizeName('  my-project  ')).toBe('my-project');
      expect(normalizeName('\tmy-project\n')).toBe('my-project');
    });

    it('should handle already normalized names', () => {
      expect(normalizeName('my-project')).toBe('my-project');
      expect(normalizeName('myproject')).toBe('myproject');
    });
  });

  describe('normalizeServiceName', () => {
    it('should format as [project-name]-[package]', () => {
      expect(normalizeServiceName('MyProject', 'db')).toBe('myproject-db');
      expect(normalizeServiceName('my-project', 'api')).toBe('my-project-api');
      expect(normalizeServiceName('My Project', 'ui')).toBe('my-project-ui');
    });

    it('should handle spaces in project name', () => {
      expect(normalizeServiceName('My Chatbot', 'db')).toBe('my-chatbot-db');
      expect(normalizeServiceName('My Awesome App', 'api')).toBe('my-awesome-app-api');
    });

    it('should handle special characters', () => {
      expect(normalizeServiceName('My_Project', 'db')).toBe('my-project-db');
      expect(normalizeServiceName('My---Project', 'ui')).toBe('my-project-ui');
    });

    it('should handle package names with hyphens', () => {
      expect(normalizeServiceName('MyProject', 'my-package')).toBe('myproject-my-package');
    });
  });

  describe('normalizeVolumeName', () => {
    it('should format as [project_name]_[volume_name]', () => {
      expect(normalizeVolumeName('MyProject', 'postgres_data')).toBe('myproject_postgres_data');
      expect(normalizeVolumeName('my-project', 'redis_cache')).toBe('my-project_redis_cache');
    });

    it('should handle spaces in project name', () => {
      expect(normalizeVolumeName('My Chatbot', 'postgres_data')).toBe('my-chatbot_postgres_data');
    });

    it('should use underscore separator between project and volume', () => {
      expect(normalizeVolumeName('myproject', 'data')).toBe('myproject_data');
    });
  });
});

