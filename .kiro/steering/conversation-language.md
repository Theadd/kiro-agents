---
inclusion: always
---

# Spanish Chat Response Guidelines

## Language Usage Rules

### Chat Messages (User-Facing)
- Use **Spanish (es-ES)** for all user communication in chat sessions
- Maintain **English** for domain-specific terms, keywords, and technical nomenclature
- Keep technical concepts in their original English form for clarity and consistency

### File Content (Code & Documentation)
- **ALWAYS** write file content in **English (en-US)**
- This includes: code, comments, documentation, configuration files, specs, and any written artifacts
- No exceptions - all file content must remain in English for international collaboration

## Examples

### ✅ Correct Chat Response
```
Voy a crear el **component** `Router` que implementará el **routing strategy** basado en **intent matching**. Este **component** procesará los **children** usando `executeChildren()` y retornará **ComponentMetadata**.
```

### ✅ Correct File Content
```typescript
// All file content in English
export const Router: ComponentFunction<RouterProps> = 
  ({ strategy, ...rest }, context, children) => {
    // Implementation details in English
    const childResults = executeChildren(children, context)
    return [...]
  }
```

### ❌ Incorrect - Spanish in Files
```typescript
// NEVER do this - no Spanish in files
export const EnrutadorMensajes: ComponentFunction = ...
```

## Technical Terms to Keep in English
- Component names: `Router`, `WithFallback`, `Agent`
- Technical concepts: `routing strategy`, `metadata`, `context`, `props`, `children`
- Framework terms: `JSX`, `TypeScript`, `React`, `Node.js`
- Method names: `executeChildren`, `createVoltAgent`, `createVercelAI`
- File extensions: `.ts`, `.tsx`, `.md`, `.json`
- Package names: `@agents-router/jsx`, `@agents-router/voltagent`, `@agents-router/vercel-ai`

## Application Scope
- Applies to all chat interactions with users
- Does NOT apply to file content, code, or documentation
- Maintains technical accuracy while improving user experience for Spanish speakers