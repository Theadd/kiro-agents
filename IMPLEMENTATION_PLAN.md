# Plan de Implementación: Nuevo Sistema de Powers

## Problema Actual

El Power `kiro-protocols` falla al cargarse en Kiro IDE con el error:
```
[No valid power found in the repository. Please ensure the repository contains a valid POWER.md file with proper frontmatter.]
```

## Análisis de Causas

### 1. Campo `version` inválido en POWER.md antiguo
- El `power/POWER.md` tiene `version: "1.7.0"` 
- Según power-builder, solo existen 5 campos: `name`, `displayName`, `description`, `keywords`, `author`
- Kiro IDE rechaza POWER.md con campos desconocidos

### 2. Estructura de directorios desactualizada
- Build pipeline actual: `scripts/build.ts` → `power/` (singular, obsoleto)
- Nuevo sistema: `scripts/build-powers.ts` → `powers/` (plural, correcto)
- No hay integración entre ambos sistemas

### 3. Falta mcp.json en Knowledge Base Powers
- `kiro-protocols` es Knowledge Base Power (solo documentación)
- No necesita mcp.json según power-builder
- Pero Kiro IDE podría requerirlo (vacío) para validación

### 4. Workflow de GitHub desactualizado
- `.github/workflows/validate-pr.yml` protege `power/` (obsoleto)
- Debería proteger `powers/*/steering/` (nuevo)
- Ya tiene check para `power/` pero con warning, no error

## Solución Propuesta

### Fase 1: Limpieza y Corrección Inmediata

#### 1.1. Corregir POWER.md del antiguo power
```yaml
# power/POWER.md - REMOVER campo version
---
name: "kiro-agents"
displayName: "Kiro Agents & Modes System"
description: "Advanced AI agent system with specialized agents, mode switching, strict mode, and interactive workflows for Kiro IDE"
keywords: ["agent", "agents", "mode", "modes", "vibe", "spec", "strict", "workflow", "kiro-master", "chit-chat", "interactive"]
author: "R. Beltran"
# version: "1.7.0"  ← ELIMINAR ESTA LÍNEA
---
```

#### 1.2. Añadir mcp.json vacío a kiro-protocols
```json
// powers/kiro-protocols/mcp.json
{
  "mcpServers": {}
}
```

#### 1.3. Actualizar workflow de GitHub
```yaml
# .github/workflows/validate-pr.yml
# Cambiar warning a error para power/ obsoleto
# Añadir protección para powers/*/steering/
```

### Fase 2: Reestructuración del Build Pipeline

#### 2.1. Crear nuevo build pipeline unificado
```typescript
// scripts/build-unified.ts
// - Construye AMBOS: npm package Y powers
// - Usa misma configuración de substituciones
// - Valida antes de construir
```

#### 2.2. Integrar build-powers.ts en build principal
```typescript
// scripts/build.ts
// Añadir paso: "Build Powers" después de npm/power builds
// Ejecuta build-powers.ts automáticamente
```

#### 2.3. Actualizar package.json scripts
```json
{
  "scripts": {
    "build": "bun run scripts/build-unified.ts npm",
    "build:power": "bun run scripts/build-unified.ts power",
    "build:powers": "bun run scripts/build-unified.ts powers",
    "build:all": "bun run scripts/build-unified.ts all"
  }
}
```

### Fase 3: Migración Completa

#### 3.1. Deprecar directorio power/ antiguo
- Mover contenido a `powers/kiro-agents/`
- Mantener `power/` con README de deprecación
- Actualizar documentación

#### 3.2. Actualizar referencias en código
- `src/config.ts` y `src/kiro/config.ts`
- Paths de steering files
- Documentación en steering files

#### 3.3. Crear estructura para futuros Powers
```
powers/
├── kiro-agents/          # Power principal (migrado de power/)
│   ├── POWER.md
│   ├── mcp.json
│   └── steering/
├── kiro-protocols/       # Power de protocolos (nuevo)
│   ├── POWER.md
│   ├── mcp.json (vacío)
│   └── steering/
└── [future-powers]/      # Espacio para más Powers
```

### Fase 4: Mejoras Adicionales

#### 4.1. Sistema de iconos
- Investigar cómo Kiro IDE carga iconos
- Crear iconos PNG 512x512 para cada Power
- Documentar proceso de creación de iconos

#### 4.2. Instruction Alias mejorado
- Implementar carga dinámica de protocols vía kiroPowers
- Reemplazar File References por kiroPowers.readSteering
- Ejemplo:
```markdown
<alias>
  <trigger>/protocol {name}</trigger>
  <definition>
1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with steeringFile="{name}.md"
3. Follow protocol steps
  </definition>
</alias>
```

#### 4.3. Validación automática en CI/CD
```yaml
# .github/workflows/validate-pr.yml
- name: Validate Powers
  run: bun run validate:powers
```

## Orden de Implementación

### Prioridad ALTA (Resolver error inmediato)
1. ✅ Remover campo `version` de `power/POWER.md`
2. ✅ Añadir `mcp.json` vacío a `powers/kiro-protocols/`
3. ✅ Probar carga en Kiro IDE

### Prioridad MEDIA (Reestructuración)
4. Crear `scripts/build-unified.ts`
5. Integrar build-powers en build principal
6. Actualizar workflow de GitHub
7. Migrar `power/` a `powers/kiro-agents/`

### Prioridad BAJA (Mejoras)
8. Investigar sistema de iconos
9. Implementar Instruction Alias con kiroPowers
10. Documentar proceso completo

## Notas Importantes

### Sobre el campo `version`
- **NO es un campo válido** según power-builder
- Kiro IDE usa versión del repositorio Git (tags)
- Remover de todos los POWER.md

### Sobre mcp.json
- Knowledge Base Powers **pueden** tener mcp.json vacío
- No es obligatorio según power-builder
- Pero Kiro IDE podría requerirlo para validación
- Solución: incluir siempre mcp.json (vacío si no hay servers)

### Sobre la estructura powers/
- Permite múltiples Powers en un repositorio
- Cada Power es independiente
- Mejor organización y escalabilidad
- Alineado con power-builder documentation

## Próximos Pasos

1. Implementar correcciones de Prioridad ALTA
2. Probar en Kiro IDE
3. Si funciona, proceder con Prioridad MEDIA
4. Documentar proceso en CONTRIBUTING.md
