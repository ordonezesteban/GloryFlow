# AGENTS.md - GloryFlow

## Objetivo del Proyecto
GloryFlow es una aplicación de escritorio moderna para presentación de letras, Biblias y contenido multimedia en iglesias. Alternativa ligera a EasyWorship, Holyrics o ProPresenter con enfoque en UX minimalista, multi-pantalla y navegación rápida.

## Stack Tecnológico
- **Desktop**: Electron 33 + electron-vite
- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Estado**: Zustand
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **DB Local**: better-sqlite3
- **Íconos**: lucide-react
- **IPC**: Comunicación entre ventana Control y ventana Proyección

## Arquitectura
```
src/
├── main/        # Proceso principal de Electron (ventanas, IPC, DB, displays)
├── preload/     # Preload scripts para exponer APIs seguras
├── renderer/    # Frontend React (App, componentes, stores)
└── shared/      # Tipos, constantes y utilidades compartidas
```

## Estado Actual
- [x] Configuración base Electron + Vite + React + TypeScript + Tailwind
- [x] Layout de 3 columnas (Biblioteca / Escaleta / Control en Vivo)
- [x] Navegador bíblico por grilla (Libro -> Capítulo -> Versículo)
- [x] Ventana de Control y Ventana de Proyección
- [x] Sistema IPC para sincronización entre ventanas
- [x] Panel en vivo con BLACK / CLEAR / LOGO
- [x] Detección de monitores
- [ ] Funcionalidad bíblica real (con datos)
- [ ] Sistema de canciones (CRUD + secciones)
- [ ] Escaleta funcional con drag & drop
- [ ] Base de datos SQLite operativa
- [ ] Previsualización en tiempo real en panel control
- [ ] Envío de contenido a proyección funcional

## Reglas para el Agente

### Git & Commits
- **SIEMPRE** usar Conventional Commits: `feat:`, `fix:`, `chore:`, `refactor:`, `style:`, `docs:`, `test:`
- Hacer commits descriptivos después de cada hito funcional completo
- Verificar `git status` antes de commitear
- NO commitear tokens, credenciales o archivos sensibles
- Usar SSH con `github_personal` key cuando se requiera push: `GIT_SSH_COMMAND="ssh -i ~/.ssh/github_personal -o IdentitiesOnly=yes" git push`

### Desarrollo
- Trabajar SIEMPRE en el repo `/home/esteban/Documentos/proyectos/GloryFlow`
- Mantener código limpio, minimalista y coherente con el diseño oscuro actual
- Usar componentes reutilizables en `src/renderer/components/`
- Tipado estricto con TypeScript
- Seguir convenciones existentes de naming
- No agregar comentarios innecesarios
- **TENER ACCESO A INTERNET** cuando sea necesario para buscar documentación, APIs o dependencias

### Multi-Pantalla (IMPORTANTE)
- La ventana de proyección DEBE abrirse en el monitor externo/segundo monitor
- En este equipo Linux/X11 hay particularidades con el Window Manager
- Siempre verificar coordenadas con logs `[GLORYFLOW]`
- Priorizar funcionalidad sobre "perfecto" pero NO romper lo que ya funciona

### Testing
- Probar cambios con `DISPLAY=:1 npm run dev` en este entorno
- Verificar que ambas ventanas funcionen correctamente
- Comprobar sincronización IPC entre Control y Proyección

## Próximos Pasos Prioritarios
1. **Base de Datos SQLite** (`src/main/database/`) - Crear schema, conexión, migraciones
2. **Módulo Biblia** - Cargar versión Reina-Valera 1960, conectar con BibleGridNavigator, enviar versículos
3. **Módulo Canciones** - CRUD, secciones (verso/coro/puente), guardar en BD
4. **Escaleta** - Hacer funcional con drag & drop, persistir orden
5. **Envío a Proyección** - Conectar selección con IPC para mostrar en ventana Live
6. **Previsualización** - Mostrar lo que se envía en el LivePanel

## Comandos Útiles
```bash
# Desarrollo
DISPLAY=:1 npm run dev

# Build
npm run build

# Git con SSH personalizado
GIT_SSH_COMMAND="ssh -i ~/.ssh/github_personal -o IdentitiesOnly=yes" git add . && git commit -m "tipo: mensaje" && GIT_SSH_COMMAND="ssh -i ~/.ssh/github_personal -o IdentitiesOnly=yes" git push

# Ver estado
git status && git log --oneline -3
```

## Notas
- El usuario final NO necesita instalar Electron/Node (va embebido en el instalador)
- Funciona en Windows, Linux, macOS (Electron cross-platform)
- En Linux X11 pueden haber issues con multi-monitor pero se pueden solucionar
- Siempre leer este archivo al iniciar nueva sesión para entender el contexto completo
