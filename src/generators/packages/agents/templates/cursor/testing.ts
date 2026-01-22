import { AgentTemplateParams } from '../../generator.js';

export const generateCursorTesting = (params: AgentTemplateParams): string => {
  const { features } = params;

  return `---
description: "Testing patterns for UI (Vitest) and API (Pytest)"
globs: ["**/*.test.{ts,tsx}", "**/tests/**/*.py"]
---

# Testing Guidelines

## Test Frameworks

| Package | Framework | Location |
|---------|-----------|----------|
${features.ui ? `| UI | Vitest + React Testing Library | \`packages/ui/src/**/*.test.tsx\` |\n` : ''}${features.api ? `| API | Pytest | \`packages/api/tests/\` |\n` : ''}

## When to Add Tests

- Creating a component with user interactions or conditional logic
- Adding a new API endpoint
- Implementing business logic in hooks or utilities
- Fixing a bug (add regression test)
${features.ui ? `
## UI Testing (Vitest)

\`\`\`typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';

describe('Button', () => {
  it('calls onClick when clicked', async () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    await userEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledOnce();
  });
});
\`\`\`

### Commands

\`\`\`bash
pnpm --filter ui test         # Watch mode
pnpm --filter ui test:run     # Run once
\`\`\`
` : ''}
${features.api ? `
## API Testing (Pytest)

\`\`\`python
# Use fixtures from conftest.py
def test_create_user(client):
    response = client.post("/users/", json={
        "name": "Test",
        "email": "test@example.com"
    })
    assert response.status_code == 201

def test_health_check(health_response):
    assert len(health_response) >= 1
\`\`\`

### Commands

\`\`\`bash
pnpm --filter api test
uv run pytest -v
\`\`\`
` : ''}
## Running All Tests

\`\`\`bash
pnpm test    # All packages
make test    # Via Makefile
\`\`\`
`;
};
