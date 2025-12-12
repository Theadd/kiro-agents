# Pruebas Sistemáticas para Identificar el Problema

## Estado Actual

Hemos realizado los siguientes cambios al Power `kiro-protocols`:

✅ **Cambios aplicados:**
1. Añadido campo `version: "1.0.0"` al POWER.md (igual que el antiguo)
2. Removido archivos extra: USAGE.md, .gitkeep
3. Mantenido: POWER.md, mcp.json, icon-placeholder.svg, steering/

✅ **Powers disponibles para testing:**
1. `powers/kiro-agents-test/` - Copia exacta del antiguo (control positivo)
2. `powers/kiro-protocols/` - El nuevo con ajustes
3. `powers/git-best-practices/` - Ejemplo simple

## Plan de Pruebas

### Test 1: Power Antiguo en Nueva Ubicación (Control Positivo)

**Objetivo:** Verificar si el problema es la ubicación `powers/` vs `power/`

**Power:** `powers/kiro-agents-test/`

**Pasos:**
1. En Kiro IDE: Powers panel → Add Repository
2. Tipo: Local Directory
3. Path: `C:\Users\Admin\dev\adhd-ai-assistant\voltagent-ai-adhd\ai-agents\powers\kiro-agents-test`
4. Click Install

**Resultado esperado:** ✅ Debería funcionar (es copia exacta del antiguo)

**Si falla:** El problema es la estructura `powers/` multi-power

**Si funciona:** El problema es el contenido del nuevo Power

---

### Test 2: Power Nuevo con Ajustes

**Objetivo:** Verificar si los ajustes resolvieron el problema

**Power:** `powers/kiro-protocols/`

**Pasos:**
1. En Kiro IDE: Powers panel → Add Repository
2. Tipo: Local Directory
3. Path: `C:\Users\Admin\dev\adhd-ai-assistant\voltagent-ai-adhd\ai-agents\powers\kiro-protocols`
4. Click Install

**Resultado esperado:** ✅ Debería funcionar ahora

**Si falla:** Necesitamos más investigación (ver Test 3)

**Si funciona:** 🎉 Problema resuelto! Los ajustes funcionaron

---

### Test 3: Power Ejemplo Simple

**Objetivo:** Verificar si un Power mínimo funciona

**Power:** `powers/git-best-practices/`

**Estructura:**
```
powers/git-best-practices/
├── POWER.md (con frontmatter completo)
└── (sin mcp.json, sin steering/)
```

**Pasos:**
1. Primero, añadir campos faltantes al POWER.md
2. En Kiro IDE: Powers panel → Add Repository
3. Tipo: Local Directory
4. Path: `C:\Users\Admin\dev\adhd-ai-assistant\voltagent-ai-adhd\ai-agents\powers\git-best-practices`
5. Click Install

**Resultado esperado:** Depende de requisitos de Kiro

**Si funciona:** Kiro acepta Powers sin mcp.json ni steering/

**Si falla:** Kiro requiere mcp.json y/o steering/

---

## Análisis de Resultados

### Escenario A: Test 1 FALLA

**Conclusión:** Kiro IDE no soporta estructura `powers/` multi-power

**Solución:**
- Crear repositorio separado para cada Power
- O mantener un Power por repositorio en root

**Acción:**
```bash
# Crear repo separado para kiro-protocols
mkdir ../kiro-protocols-power
cp -r powers/kiro-protocols/* ../kiro-protocols-power/
cd ../kiro-protocols-power
git init
git add .
git commit -m "Initial commit"
# Push a GitHub y probar desde allí
```

---

### Escenario B: Test 1 FUNCIONA, Test 2 FALLA

**Conclusión:** El contenido del nuevo Power tiene problemas

**Diferencias a investigar:**
1. ❌ Menos archivos en steering/ (5 vs 15)
2. ❌ No tiene agents.md, aliases.md, modes.md en steering/
3. ❌ No tiene subdirectorios interactions/, modes/ en steering/
4. ✅ Tiene icon-placeholder.svg (el antiguo no)

**Solución A - Añadir archivos mínimos:**
```bash
# Copiar estructura de directorios del antiguo
mkdir powers/kiro-protocols/steering/interactions
mkdir powers/kiro-protocols/steering/modes

# Crear archivos dummy o copiar del antiguo
cp power/steering/agents.md powers/kiro-protocols/steering/
cp power/steering/aliases.md powers/kiro-protocols/steering/
# etc...
```

**Solución B - Remover icon-placeholder.svg:**
```bash
rm powers/kiro-protocols/icon-placeholder.svg
```

---

### Escenario C: Test 1 y 2 FUNCIONAN

**Conclusión:** 🎉 Problema resuelto!

**Causa:** Uno o más de estos cambios:
- Añadir campo `version`
- Remover USAGE.md y .gitkeep
- Ambos

**Documentar:** Actualizar guías con requisitos reales de Kiro

---

### Escenario D: Test 3 FALLA

**Conclusión:** Kiro requiere mcp.json y/o steering/

**Acción:** Añadir a git-best-practices:
```bash
# Añadir mcp.json vacío
echo '{"mcpServers":{}}' > powers/git-best-practices/mcp.json

# Crear steering/ con un archivo dummy
mkdir powers/git-best-practices/steering
echo '# Placeholder' > powers/git-best-practices/steering/README.md
```

---

## Información de Debugging

### Logs de Kiro IDE

**Ubicación posible de logs:**
- `~/.kiro/logs/`
- Consola de desarrollador en Kiro IDE (si es Electron)
- Output panel en Kiro IDE

**Buscar:**
- Mensajes de error más detallados
- Stack traces
- Qué archivo específicamente falla al parsear

### Comparación Byte a Byte

Si todo falla, comparar archivos byte a byte:

```powershell
# Comparar POWER.md
$old = [System.IO.File]::ReadAllBytes("power\POWER.md")
$new = [System.IO.File]::ReadAllBytes("powers\kiro-protocols\POWER.md")

# Buscar diferencias en encoding, BOM, line endings
```

### Validación Manual de YAML

```bash
# Instalar yq si no lo tienes
# Validar frontmatter
yq eval powers/kiro-protocols/POWER.md
```

---

## Próximos Pasos Según Resultados

### Si TODOS los tests fallan:
1. Verificar que el Power antiguo (`power/`) aún funciona
2. Revisar si hubo actualización de Kiro IDE que cambió requisitos
3. Buscar documentación oficial de Kiro sobre Powers
4. Contactar soporte de Kiro o comunidad

### Si ALGUNOS tests funcionan:
1. Identificar patrón de qué funciona y qué no
2. Aplicar soluciones específicas del escenario
3. Documentar requisitos reales de Kiro

### Si TODO funciona:
1. 🎉 Celebrar
2. Documentar qué cambios fueron necesarios
3. Actualizar build pipeline para incluir esos requisitos
4. Actualizar guías y documentación

---

## Checklist de Ejecución

Marca cada test conforme lo ejecutes:

- [ ] Test 1: kiro-agents-test (control positivo)
  - Resultado: _______________
  - Notas: _______________

- [ ] Test 2: kiro-protocols (con ajustes)
  - Resultado: _______________
  - Notas: _______________

- [ ] Test 3: git-best-practices (mínimo)
  - Resultado: _______________
  - Notas: _______________

- [ ] Revisar logs de Kiro IDE
  - Ubicación: _______________
  - Errores encontrados: _______________

- [ ] Escenario identificado: _______________

- [ ] Solución aplicada: _______________

- [ ] Verificación final: _______________

---

## Resumen de Cambios Realizados

```diff
powers/kiro-protocols/POWER.md:
+ version: "1.0.0"

powers/kiro-protocols/:
- USAGE.md (removido)
- .gitkeep (removido)

powers/:
+ kiro-agents-test/ (añadido para testing)
```

**Validación:**
```bash
$ bun run validate:powers
✅ kiro-agents-test - Valid
✅ kiro-protocols - Valid
✅ git-best-practices - Valid (con warning de icon)
```

---

**Ejecuta los tests en orden y documenta los resultados. Esto nos dará información precisa sobre qué requiere Kiro IDE.**
