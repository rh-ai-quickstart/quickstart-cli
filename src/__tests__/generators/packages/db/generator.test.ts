/**
 * Integration tests for DB package generator
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DBPackageGenerator } from '../../../../generators/packages/db/generator.js';
import {
  createTempDir,
  cleanupTempDir,
  DEFAULT_TEST_CONFIG,
  assertFileExists,
  validatePythonSyntax,
} from '../../../utils/test-helpers.js';

describe('DBPackageGenerator', () => {
  let tempDir: string;
  let generator: DBPackageGenerator;

  beforeEach(async () => {
    tempDir = await createTempDir('db-generator-test-');
    generator = new DBPackageGenerator(tempDir, DEFAULT_TEST_CONFIG);
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe('generate()', () => {
    it('should create all expected files and directories', async () => {
      await generator.generate();

      const dbDir = path.join(tempDir, 'packages', 'db');

      // Check all expected files exist
      const expectedFiles = [
        'README.md',
        'package.json',
        'pyproject.toml',
        'alembic.ini',
        'src/__init__.py',
        'src/db/database.py',
        'alembic/env.py',
        'alembic/script.py.mako',
        'tests/__init__.py',
        'tests/test_database.py',
      ];

      for (const file of expectedFiles) {
        // Special case for empty __init__.py files
        if (file.endsWith('__init__.py')) {
          const filePath = path.join(dbDir, file);
          expect(await fs.pathExists(filePath)).toBe(true);
        } else {
          await assertFileExists(path.join(dbDir, file));
        }
      }

      // Check all expected directories exist
      const expectedDirs = ['src', 'alembic', 'alembic/versions', 'tests'];

      for (const dir of expectedDirs) {
        const dirPath = path.join(dbDir, dir);
        expect(await fs.pathExists(dirPath)).toBe(true);
      }
    });

    it('should generate package.json with correct scripts', async () => {
      await generator.generate();

      const packageJsonPath = path.join(tempDir, 'packages', 'db', 'package.json');
      await assertFileExists(packageJsonPath);

      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));

      expect(packageJson.name).toBe(`@${DEFAULT_TEST_CONFIG.name}/db`);
      const serviceName = `${DEFAULT_TEST_CONFIG.name.toLowerCase().replace(/[\s_-]+/g, '-')}-db`;
      expect(packageJson.scripts).toMatchObject({
        'db:start': `podman-compose -f ../../compose.yml up -d ${serviceName}`,
        'db:stop': `podman-compose -f ../../compose.yml down ${serviceName}`,
        'db:logs': `podman-compose -f ../../compose.yml logs -f ${serviceName}`,
        migrate: 'uv run alembic upgrade head',
        'migrate:down': 'uv run alembic downgrade -1',
        'migrate:new': 'uv run alembic revision --autogenerate',
        'migrate:history': 'uv run alembic history',
        'migrate:current': 'uv run alembic current',
        'install:deps': 'uv sync',
      });
    });

    it('should generate pyproject.toml with correct dependencies', async () => {
      await generator.generate();

      const pyprojectPath = path.join(tempDir, 'packages', 'db', 'pyproject.toml');
      await assertFileExists(pyprojectPath);

      const content = await fs.readFile(pyprojectPath, 'utf-8');

      // Check core dependencies
      expect(content).toContain('sqlalchemy>=2.0.0');
      expect(content).toContain('alembic>=1.13.0');
      expect(content).toContain('asyncpg>=0.29.0');
      expect(content).toContain('psycopg2-binary>=2.9.0');

      // Check dev dependencies
      expect(content).toContain('pytest>=7.4.0');
      expect(content).toContain('pytest-asyncio>=0.21.0');

      // Check project name and description
      expect(content).toContain(`name = "${DEFAULT_TEST_CONFIG.name}-db"`);
      expect(content).toContain(`description = "Database package for ${DEFAULT_TEST_CONFIG.name}"`);
    });

    it('should NOT generate compose.yml in db package (moved to root)', async () => {
      await generator.generate();

      const composePath = path.join(tempDir, 'packages', 'db', 'compose.yml');
      expect(await fs.pathExists(composePath)).toBe(false);
    });

    it('should generate database module with correct configuration', async () => {
      await generator.generate();

      const databasePath = path.join(tempDir, 'packages', 'db', 'src', 'db', 'database.py');
      await assertFileExists(databasePath);

      const content = await fs.readFile(databasePath, 'utf-8');

      // Check imports
      expect(content).toContain(
        'from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine'
      );
      expect(content).toContain('from sqlalchemy.ext.declarative import declarative_base');
      expect(content).toContain('from sqlalchemy.orm import sessionmaker');
      expect(content).toContain('from sqlalchemy import text');
      expect(content).toContain('from typing import Dict, Any');
      expect(content).toContain('import logging');

      // Check database URL
      expect(content).toContain(
        `postgresql+asyncpg://user:password@localhost:5432/${DEFAULT_TEST_CONFIG.name}`
      );

      // Check engine configuration
      expect(content).toContain('create_async_engine(DATABASE_URL, echo=True)');
      expect(content).toContain(
        'sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)'
      );

      // Check Base model
      expect(content).toContain('Base = declarative_base()');

      // Check DatabaseService class
      expect(content).toContain('class DatabaseService:');
      expect(content).toContain('async def health_check(self) -> Dict[str, Any]:');
      expect(content).toContain('async def get_session(self) -> AsyncSession:');
      expect(content).toContain('db_service = DatabaseService()');

      // Check dependency functions
      expect(content).toContain('async def get_db():');
      expect(content).toContain('async def get_db_service() -> DatabaseService:');
      expect(content).toContain('async with SessionLocal() as session:');
    });

    it('should generate Alembic configuration', async () => {
      await generator.generate();

      const alembicPath = path.join(tempDir, 'packages', 'db', 'alembic.ini');
      await assertFileExists(alembicPath);

      const content = await fs.readFile(alembicPath, 'utf-8');

      // Check script location
      expect(content).toContain('script_location = alembic');

      // Check database URL
      expect(content).toContain(
        `postgresql+asyncpg://user:password@localhost:5432/${DEFAULT_TEST_CONFIG.name}`
      );

      // Check version format
      expect(content).toContain('version_num_format = %04d');

      // Check logging configuration
      expect(content).toContain('[loggers]');
      expect(content).toContain('keys = root,sqlalchemy,alembic');
    });

    it('should generate Alembic environment file', async () => {
      await generator.generate();

      const envPath = path.join(tempDir, 'packages', 'db', 'alembic', 'env.py');
      await assertFileExists(envPath);

      const content = await fs.readFile(envPath, 'utf-8');

      // Check imports
      expect(content).toContain('from sqlalchemy import engine_from_config');
      expect(content).toContain('from alembic import context');

      // Check migration functions
      expect(content).toContain('def run_migrations_offline() -> None:');
      expect(content).toContain('def run_migrations_online() -> None:');

      // Check context configuration
      expect(content).toContain('context.configure(');
      expect(content).toContain('target_metadata=target_metadata');
    });

    it('should generate Alembic script template', async () => {
      await generator.generate();

      const scriptPath = path.join(tempDir, 'packages', 'db', 'alembic', 'script.py.mako');
      await assertFileExists(scriptPath);

      const content = await fs.readFile(scriptPath, 'utf-8');

      // Check template variables
      expect(content).toContain('${message}');
      expect(content).toContain('${up_revision}');
      expect(content).toContain('${down_revision | comma,n}');
      expect(content).toContain('${create_date}');

      // Check imports
      expect(content).toContain('from alembic import op');
      expect(content).toContain('import sqlalchemy as sa');

      // Check migration functions
      expect(content).toContain('def upgrade() -> None:');
      expect(content).toContain('def downgrade() -> None:');
    });

    it('should generate test file with database connection test', async () => {
      await generator.generate();

      const testPath = path.join(tempDir, 'packages', 'db', 'tests', 'test_database.py');
      await assertFileExists(testPath);

      const content = await fs.readFile(testPath, 'utf-8');

      // Check imports
      expect(content).toContain('import pytest');
      expect(content).toContain('from src.database import engine');

      // Check test function
      expect(content).toContain('@pytest.mark.asyncio');
      expect(content).toContain('async def test_database_connection():');
      expect(content).toContain('async with engine.begin() as conn:');
      expect(content).toContain('result = await conn.execute("SELECT 1")');
      expect(content).toContain('assert result.scalar() == 1');
    });

    it('should generate syntactically valid Python files', async () => {
      await generator.generate();

      const pythonFiles = ['src/db/database.py', 'alembic/env.py', 'tests/test_database.py'];

      for (const file of pythonFiles) {
        const filePath = path.join(tempDir, 'packages', 'db', file);
        const isValid = await validatePythonSyntax(filePath);
        expect(isValid).toBe(true);
      }
    });

    it('should generate README with comprehensive documentation', async () => {
      await generator.generate();

      const readmePath = path.join(tempDir, 'packages', 'db', 'README.md');
      await assertFileExists(readmePath);

      const content = await fs.readFile(readmePath, 'utf-8');

      // Check title and description
      expect(content).toContain(`# ${DEFAULT_TEST_CONFIG.name} Database`);
      expect(content).toContain(
        'PostgreSQL database setup with Podman Compose and Alembic migrations'
      );

      // Check features section
      expect(content).toContain('## Features');
      expect(content).toContain('PostgreSQL 16');
      expect(content).toContain('Podman Compose');
      expect(content).toContain('Alembic');

      // Check quick start section
      expect(content).toContain('## Quick Start');
      expect(content).toContain('pnpm db:start');

      // Check available scripts
      expect(content).toContain('## Available Scripts');
      expect(content).toContain('pnpm upgrade');
      expect(content).toContain('pnpm revision');

      // Check project structure
      expect(content).toContain('## Project Structure');
      expect(content).toContain('└── database.py');
      expect(content).toContain('├── versions/');

      // Check best practices
      expect(content).toContain('## Database Schema');
      expect(content).toContain('### Best Practices');
    });
  });

  describe('configuration variations', () => {
    it('should handle different project names correctly', async () => {
      const customConfig = {
        ...DEFAULT_TEST_CONFIG,
        name: 'my-custom-app',
      };

      generator = new DBPackageGenerator(tempDir, customConfig);
      await generator.generate();

      // Check package.json name
      const packageJsonPath = path.join(tempDir, 'packages', 'db', 'package.json');
      const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf-8'));
      expect(packageJson.name).toBe('@my-custom-app/db');

      // Check database URL in database.py
      const databasePath = path.join(tempDir, 'packages', 'db', 'src', 'db', 'database.py');
      const databaseContent = await fs.readFile(databasePath, 'utf-8');
      expect(databaseContent).toContain(
        'postgresql+asyncpg://user:password@localhost:5432/my-custom-app'
      );

      // Compose file should not exist in db package (moved to root)
      const composePath = path.join(tempDir, 'packages', 'db', 'compose.yml');
      expect(await fs.pathExists(composePath)).toBe(false);

      // Check Alembic configuration
      const alembicPath = path.join(tempDir, 'packages', 'db', 'alembic.ini');
      const alembicContent = await fs.readFile(alembicPath, 'utf-8');
      expect(alembicContent).toContain(
        'postgresql+asyncpg://user:password@localhost:5432/my-custom-app'
      );

      // Check README title
      const readmePath = path.join(tempDir, 'packages', 'db', 'README.md');
      const readmeContent = await fs.readFile(readmePath, 'utf-8');
      expect(readmeContent).toContain('# my-custom-app Database');
    });

    it('should handle different project descriptions correctly', async () => {
      const customConfig = {
        ...DEFAULT_TEST_CONFIG,
        description: 'A custom database application for testing',
      };

      generator = new DBPackageGenerator(tempDir, customConfig);
      await generator.generate();

      // Check pyproject.toml description
      const pyprojectPath = path.join(tempDir, 'packages', 'db', 'pyproject.toml');
      const pyprojectContent = await fs.readFile(pyprojectPath, 'utf-8');
      expect(pyprojectContent).toContain(
        `description = "Database package for ${DEFAULT_TEST_CONFIG.name}"`
      );
    });
  });

  describe('error handling', () => {
    it('should handle invalid output directory gracefully', async () => {
      // Test with invalid directory path
      const invalidGenerator = new DBPackageGenerator(
        '/invalid/path/that/does/not/exist',
        DEFAULT_TEST_CONFIG
      );

      try {
        await invalidGenerator.generate();
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toBeDefined();
      }
    });
  });
});
