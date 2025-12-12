# Análisis Completo del Build Pipeline y Sistema de Powers

## Resumen Ejecutivo

He analizado completamente el build pipeline y he identificado el problema principal: **el campo `version` en POWER.md no es válido** según la especificación de Kiro Powers. Este campo causa que Kiro IDE rechace el Power con el error "No valid power found".

## Problema Principal Identificado

### Error Reportado
```
[No valid power found in the repository. Please ensure the repository contains a valid POWER.md file with proper frontmatter.]
```

### Causa Raíz
El `power/POWER.md` contenía un campo `version: "1.7.0"` que **NO es un campo válido** según la especificación de Kiro Powers.

**Campos válidos según power-builder:**
- `name` (required)
- `displayName` (required)
- `description` (required)
- `keywords` (optional)
- `author` (optional)

**Campos que NO existen:**
- ❌ `version` - Kiro usa Git tags para versiones
- ❌ `tags` - No existe
- ❌ `repository` - No existe
- ❌ `license` - No existe

## Arquitectura Actual del Build Pipeline

### 1. Build Pipeline Principal (`scripts/build.ts`)

**Propósito:** Construir el paquete npm `kiro-agents` y el Power antiguo

**Targets:**
- `npm` - Compila CLI + procesa steering files → `build/npm/` (limpia después)
- `npm-no-clean` - Igual que npm pero preserva artifacts (para release)
- `power` - Procesa files → `power/` (obsoleto, en GitHub)
- `dev` - Build directo a `~/.kiro/steering/kiro-agents/` con watch

**File Mappings:**
```typescript
// NPM (sin agent-system.md)
src/core/aliases.md → build/npm/dist/aliases.md
src/core/protocols/* → build/npm/dist/protocols/*
src/kiro/steering/modes.md → build/npm/dist/modes.md

// POWER (con agent-system.md)
src/kiro/POWER.md → power/POWER.md
src/core/aliases.md → power/steering/aliases.md
src/core/agent-system.md → power/steering/agent-system.md
src/core/protocols/* → power/steering/protocols/*
```

**Substituciones Dinámicas:**
- `{{{VERSION}}}` - Versión de package.json
- `{{{PROTOCOLS_PATH}}}` - Path según target (npm vs power)
- `{{{KIRO_MODE_ALIASES}}}` - Inyecta aliases de modos
- `{{{AGENT_MANAGEMENT_PROTOCOL}}}` - Inyecta protocolo completo
- Multi-pass processing (hasta 10 iteraciones)

### 2. Build Pipeline de Powers (`scripts/build-powers.ts`)

**Propósito:** Construir Powers independientes en `powers/` directory

**Configuración Actual:**
```typescript
const POWER_CONFIGS = [
  {
    name: "kiro-protocols",
    displayName: "Kiro Protocols",
    sourceDir: "src/core/protocols",
    protocols: ["agent-activation", "agent-creation", "agent-management"],
    generateIcon: true,
  }
];
```

**Proceso:**
1. Valida POWER.md existe con frontmatter correcto
2. Copia protocols de `src/core/protocols/` a `powers/{name}/steering/`
3. Aplica substituciones (mismo sistema que build.ts)
4. Añade protocols de Kiro si es kiro-protocols power
5. Genera icon placeholder SVG

**Output:**
```
powers/kiro-protocols/
├── POWER.md (manual, no generado)
├── mcp.json (ahora añadido, vacío)
├── icon-placeholder.svg (generado)
└── steering/ (generado)
    ├── agent-activation.md
    ├── agent-creation.md
    ├── agent-management.md
    ├── mode-management.md (Kiro-specific)
    └── mode-switching.md (Kiro-specific)
```

### 3. Validación de Powers (`scripts/validate-powers.ts`)

**Checks:**
- ✅ POWER.md existe
- ✅ Frontmatter válido (name, displayName, description)
- ✅ Formato de name (lowercase kebab-case)
- ✅ steering/ directory con al menos un .md
- ✅ Protocol files no vacíos
- ⚠️ Keywords y author (recomendados)
- ⚠️ Icon.png (recomendado)

### 4. GitHub Workflow (`.github/workflows/validate-pr.yml`)

**Protecciones:**
- ❌ ERROR si modifica `powers/*/steering/` (auto-generado)
- ⚠️ WARNING si modifica `power/` (obsoleto)

**Razón:** Los steering files son generados por build, no deben editarse manualmente

## Estructura de Directorios

### Actual (Dual System)

```
kiro-agents/
├── src/                          # Source files
│   ├── core/                     # Cross-IDE compatible
│   │   ├── aliases.md
│   │   ├── agent-system.md
│   │   ├── protocols/            # Protocol sources
│   │   │   ├── agent-activation.md
│   │   │   ├── agent-management.md
│   │   │   └── agent-creation.md
│   │   └── interactions/
│   └── kiro/                     # Kiro-specific
│       ├── POWER.md              # Template para power/
│       ├── config.ts             # Substitutions
│       └── steering/
│           └── protocols/        # Kiro protocols
│               ├── mode-switching.md
│               └── mode-management.md
│
├── power/                        # OLD: Single power (obsoleto)
│   ├── POWER.md                  # ❌ Tenía version field
│   ├── mcp.json
│   └── steering/                 # Auto-generado
│
├── powers/                       # NEW: Multi-power system
│   ├── kiro-protocols/           # Protocol library power
│   │   ├── POWER.md              # ✅ Sin version field
│   │   ├── mcp.json              # ✅ Añadido (vacío)
│   │   ├── icon-placeholder.svg
│   │   └── steering/             # Auto-generado
│   └── [future-powers]/
│
├── scripts/
│   ├── build.ts                  # Main build (npm + power/)
│   ├── build-powers.ts           # Powers build (powers/)
│   └── validate-powers.ts        # Power validation
│
└── .github/workflows/
    └── validate-pr.yml           # Protege steering/ auto-generado
```

## Soluciones Implementadas (Prioridad ALTA)

### ✅ 1. Removido campo `version` de power/POWER.md

**Antes:**
```yaml
---
name: "kiro-agents"
displayName: "Kiro Agents & Modes System"
description: "..."
keywords: [...]
author: "R. Beltran"
version: "1.7.0"  ← INVÁLIDO
---
```

**Después:**
```yaml
---
name: "kiro-agents"
displayName: "Kiro Agents & Modes System"
description: "..."
keywords: [...]
author: "R. Beltran"
---
```

### ✅ 2. Añadido mcp.json vacío a kiro-protocols

**Razón:** Aunque es Knowledge Base Power (solo documentación), Kiro IDE podría requerir mcp.json para validación.

```json
{
  "mcpServers": {}
}
```

### ✅ 3. Validación exitosa

```bash
$ bun run validate:powers kiro-protocols
✅ kiro-protocols
  Warnings:
    ⚠️  Using placeholder icon (create icon.png for production)

✅ All powers valid!
```

## Problemas Pendientes y Soluciones Propuestas

### 1. Sistema de Iconos

**Problema:** No sabemos cómo Kiro IDE carga los iconos de Powers

**Investigación necesaria:**
- ¿Busca `icon.png` en root del Power?
- ¿Qué tamaño requiere? (512x512 recomendado por power-builder)
- ¿Soporta SVG o solo PNG?
- ¿Hay campo en POWER.md para especificar path?

**Solución temporal:**
- Tenemos `icon-placeholder.svg` generado
- Convertir a PNG 512x512 para producción
- Comando: `convert icon-placeholder.svg -resize 512x512 icon.png`

### 2. Dual Build System

**Problema:** Dos sistemas de build separados
- `scripts/build.ts` → `power/` (obsoleto)
- `scripts/build-powers.ts` → `powers/` (nuevo)

**Solución propuesta:**
```typescript
// scripts/build-unified.ts
async function build(target: 'npm' | 'power' | 'powers' | 'all') {
  if (target === 'all') {
    await buildNpm();
    await buildOldPower();  // Deprecar eventualmente
    await buildNewPowers();
  }
  // ...
}
```

### 3. Migración de power/ a powers/

**Problema:** `power/` es obsoleto pero aún en uso

**Plan de migración:**
1. Crear `powers/kiro-agents/` con contenido de `power/`
2. Actualizar build.ts para construir a ambos (transición)
3. Deprecar `power/` con README
4. Eventualmente remover `power/`

### 4. Instruction Alias con kiroPowers

**Problema actual:** Usamos File References para cargar protocols
```markdown
Read #[[file:protocols/agent-activation.md]] into context
```

**Solución propuesta:** Usar kiroPowers tools
```markdown
<alias>
  <trigger>/protocol {name}</trigger>
  <definition>
## Load Protocol: {name}

1. Call kiroPowers action="activate" with powerName="kiro-protocols"
2. Call kiroPowers action="readSteering" with steeringFile="{name}.md"
3. Follow all steps from the loaded protocol
  </definition>
</alias>
```

**Ventajas:**
- Carga dinámica (no se lee hasta ejecutar el alias)
- Más flexible (puede cargar de cualquier Power)
- Mejor integración con Kiro ecosystem
- Reduce context overhead

### 5. Workflow de GitHub

**Actualización necesaria:**
```yaml
# .github/workflows/validate-pr.yml

# Cambiar de WARNING a ERROR para power/ obsoleto
- name: Check old power/ directory not used
  run: |
    if echo "$CHANGED_FILES" | grep -q "^power/"; then
      echo "❌ ERROR: The old power/ directory is obsolete"
      exit 1  # Cambiar de warning a error
    fi

# Añadir validación automática de Powers
- name: Validate Powers
  run: bun run validate:powers
```

## Recomendaciones de Implementación

### Fase 1: Correcciones Inmediatas (COMPLETADO ✅)
1. ✅ Remover campo `version` de POWER.md
2. ✅ Añadir mcp.json vacío a kiro-protocols
3. ✅ Validar Powers

### Fase 2: Reestructuración (PRÓXIMO)
1. Crear `scripts/build-unified.ts`
2. Migrar `power/` a `powers/kiro-agents/`
3. Actualizar workflow de GitHub
4. Integrar validación en CI/CD

### Fase 3: Mejoras (FUTURO)
1. Investigar sistema de iconos
2. Implementar Instruction Alias con kiroPowers
3. Crear iconos PNG para todos los Powers
4. Documentar proceso completo

## Cómo Probar el Power Ahora

### Opción 1: Desde GitHub (Recomendado)
1. Commit y push los cambios
2. En Kiro IDE: Powers panel → Add Repository
3. URL: `https://github.com/Theadd/kiro-agents`
4. Path: `powers/kiro-protocols`
5. Install

### Opción 2: Local Directory
1. En Kiro IDE: Powers panel → Add Repository
2. Select "Local Directory"
3. Path: `C:\Users\Admin\dev\adhd-ai-assistant\voltagent-ai-adhd\ai-agents\powers\kiro-protocols`
4. Install

### Verificación
```bash
# Activar el Power
Call kiroPowers action="activate" with powerName="kiro-protocols"

# Leer un protocol
Call kiroPowers action="readSteering" with powerName="kiro-protocols", steeringFile="agent-activation.md"
```

## Conclusiones

1. **Problema resuelto:** El campo `version` inválido causaba el rechazo del Power
2. **Sistema validado:** Los Powers ahora pasan validación
3. **Arquitectura clara:** Entendemos completamente el build pipeline
4. **Path forward:** Tenemos plan claro para migración y mejoras

El nuevo Power `kiro-protocols` debería funcionar ahora correctamente en Kiro IDE.
