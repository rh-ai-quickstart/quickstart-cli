# Template Generation Alternatives

## Current Approach Issues
- Complex handlebars-style syntax (`{{#if features.api}}`)
- File naming patterns (`.api.tsx`)
- Whitespace cleanup complexity
- Error-prone regex processing

## Alternative Approaches

### 1. TypeScript Template Functions ⭐ (Recommended)
**What**: Use TypeScript functions that return template strings
**Pros**: 
- Type-safe
- IDE support (autocomplete, refactoring)
- Easy debugging
- Standard JavaScript/TypeScript
- No custom syntax to learn

**Example**:
```typescript
const generateComponent = (name: string, hasApi: boolean) => `
import React from 'react';
${hasApi ? `import { ApiService } from './services/api';` : ''}

export function ${name}() {
  return <div>Hello from ${name}</div>;
}
`;
```

### 2. React-Based Code Generation
**What**: Use actual React components to generate code via `renderToString`
**Pros**: 
- Leverages React knowledge
- Component composition
- Props for configuration

**Example**:
```typescript
function CodeTemplate({ projectName, features }: TemplateProps) {
  return (
    <>
      {`import React from 'react';`}
      {features.api && `import { ApiService } from './api';`}
      {`export function ${projectName}() { ... }`}
    </>
  );
}
```

### 3. Plop.js Integration
**What**: Use the popular Plop.js micro-generator framework
**Pros**: 
- Battle-tested
- Rich ecosystem
- Handlebars templates (but better handled)
- Interactive prompts built-in

**Example**:
```javascript
export default function (plop) {
  plop.setGenerator('component', {
    description: 'React component',
    prompts: [/* ... */],
    actions: [/* ... */]
  });
}
```

### 4. Template Literals with Conditional Blocks
**What**: Use tagged template literals for cleaner syntax
**Pros**: 
- Clean syntax
- TypeScript native
- Easy conditional logic

**Example**:
```typescript
const template = conditionalTemplate`
  import React from 'react';
  ${when('api')`import { ApiService } from './api';`}
  
  export function Component() {
    return (
      <div>
        ${when('api')`<ApiStatus />`}
      </div>
    );
  }
`;
```

### 5. AST Manipulation (Advanced)
**What**: Use TypeScript Compiler API to generate code
**Pros**: 
- Programmatic code generation
- Perfect TypeScript output
- Can analyze existing code

**Example**:
```typescript
import ts from 'typescript';

const sourceFile = ts.factory.createSourceFile(
  statements,
  ts.factory.createToken(ts.SyntaxKind.EndOfFileToken),
  ts.NodeFlags.None
);
```

### 6. JSON-Driven Templates
**What**: Define templates in JSON and render them
**Pros**: 
- Declarative
- Easy to version
- Can be edited by non-developers

**Example**:
```json
{
  "type": "react-component",
  "name": "{{componentName}}",
  "imports": {
    "conditional": {
      "api": "import { ApiService } from './api';"
    }
  }
}
```

## Comparison

| Approach | Learning Curve | Type Safety | IDE Support | Maintainability |
|----------|----------------|-------------|-------------|-----------------|
| TypeScript Functions | Low | ✅ | ✅ | ✅ |
| React Generation | Medium | ✅ | ✅ | ✅ |
| Plop.js | Medium | ❌ | ❌ | ✅ |
| Template Literals | Low | ✅ | ✅ | ✅ |
| AST Manipulation | High | ✅ | ✅ | ✅ |
| JSON Templates | Medium | ❌ | ❌ | ⚠️ |

## Recommendation

**Use TypeScript Template Functions** because:
1. Zero learning curve for TypeScript developers
2. Full IDE support (autocomplete, refactoring, debugging)
3. Type-safe configuration
4. Easy to test and maintain
5. No external dependencies
6. Standard JavaScript/TypeScript patterns

## Migration Strategy

1. **Phase 1**: Create parallel template functions for new features
2. **Phase 2**: Migrate existing templates one package at a time
3. **Phase 3**: Remove old template system and file processing complexity
4. **Phase 4**: Add additional features like ESLint/Prettier integration for generated code