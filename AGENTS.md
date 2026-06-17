# AGENTS.md

## Project Overview
A TypeScript study guide demonstrating logger implementation with dual backends (Winston and OpenTelemetry). Single-package project targeting Node.js with ES modules.

## Commands

**Build:** `npm run build` (tsc, outputs to `dist/`)

**Lint:** `npm run lint` (check) or `npm run lint:fix` (auto-fix)

**Security audit:** `npm run security` or `npm run security:fix`

No test suite configured; `npm test` is stubbed.

## Architecture

- **src/main.ts**: Entrypoint demonstrating both logger implementations
- **src/utils/logger_util.ts**: Unified logger factory supporting Winston or OpenTelemetry backends
- **src/eo/user.ts**: Simple domain model
- **src/utils/test_util.ts**: Test data generation

Logger provider is selected via `LOG_PROVIDER` env var (`"winston"` default, `"otel"` for OpenTelemetry).

## TypeScript Config

- **Strict mode** enabled (`strict: true`)
- **Module system**: ES modules (`"module": "nodenext"`, `"type": "module"` in package.json)
- **Output**: Declaration files + source maps enabled
- **Special settings**: `verbatimModuleSyntax`, `isolatedModules`, `noUncheckedSideEffectImports` for safe ES module compilation
- **Decorators** enabled (`experimentalDecorators`, `emitDecoratorMetadata`)
- **Index safety**: `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

## ESLint Configuration

Dual config system:
- `.eslintrc.json`: Legacy config (may be superseded; avoid editing)
- `eslint.config.js`: Flat config (new standard) – primary source of truth
- Rules: TypeScript recommended + custom warnings on `no-unused-vars` and `no-explicit-any`

When lint conflicts occur, check `eslint.config.js` first.

## Common Workflows

**Quick build-lint cycle:** `npm run build && npm run lint`

**Run program:** `node dist/main.js` (or `tsx src/main.ts` with tsx package)

**Switch logger backend:** `LOG_PROVIDER=otel node dist/main.js`

**Debug logging:** `LOG_LEVEL=debug LOG_PROVIDER=otel node dist/main.js`

## Import Notes

- All imports use `.js` extension (required by `verbatimModuleSyntax` + ES modules)
- TypeScript strips extensions; the compiled `.js` files must match source structure
- Example: `import X from "./utils/logger_util.js"` → compiles to `require("./utils/logger_util.js")`

## Key Pitfalls to Avoid

1. **Forget to rebuild after edits**: Always run `npm run build` before running code; source maps help but don't replace compilation
2. **Import path extensions**: Must use `.js` even in `.ts` files due to `verbatimModuleSyntax`
3. **Environment variables**: Logger provider selection depends on `LOG_PROVIDER` env var; default is Winston
4. **ESLint config**: `.eslintrc.json` and `eslint.config.js` coexist; prefer `eslint.config.js` for new rules
5. **No tests configured**: If adding tests, wire up a test runner (e.g., jest, vitest) and update npm scripts
