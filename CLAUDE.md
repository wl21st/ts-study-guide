# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Makefile Targets (Recommended)
- **Help**: `make help` (lists all targets and descriptions)
- **Build**: `make build` (compiles TypeScript to `dist/`)
- **Clean**: `make clean` (removes `dist/`)
- **Check (Lint + Build)**: `make check`
- **Run (compiled)**: `make run` (automatically builds first)
- **Run (direct TS)**: `make dev` (runs `src/main.ts` via `tsx`)
- **Run with OpenTelemetry**: `make run-otel` (or `make run LOG_PROVIDER=otel`)
- **Run with Debug Logging**: `make run-debug`
- **Lint**: `make lint` / `make lint-fix`
- **Security Source Scan (SAST + Secrets)**: `make security-scan` (or `make security`)
- **Security Secrets Scan**: `make security-secrets`
- **Security Dependency Audit**: `make security-deps` / `make security-fix`
- **Full Security Suite**: `make security-all` (runs source scan, secret checks, and dependency audit)
- **Install Security Tools**: `make install-security`

### Direct NPM Commands
- **Build**: `npm run build` (compiles TypeScript to `dist/` with declarations and source maps)
- **Run (compiled)**: `node dist/main.js`
- **Run (direct TS)**: `npx tsx src/main.ts`
- **Run with OpenTelemetry backend**: `LOG_PROVIDER=otel node dist/main.js` (or `LOG_PROVIDER=otel npx tsx src/main.ts`)
- **Run with debug logging**: `LOG_LEVEL=debug LOG_PROVIDER=otel node dist/main.js`
- **Lint**: `npm run lint` (`eslint . --ext .ts,.js`)
- **Lint Auto-Fix**: `npm run lint:fix`
- **Security Source Scan**: `npm run security:source`
- **Security Secret Scan**: `npm run security:secrets`
- **Security Dependency Audit**: `npm run security:deps` (`npm audit`) / `npm run security:fix`
- **Security Tools Install**: `npm run security:tools-install`

*Note: No automated test framework is configured yet; `npm test` is currently stubbed.*

---

## Architecture & Code Structure

This is a single-package TypeScript study repository targeting Node.js with native ES Modules (`"type": "module"`).

### Core Components
- **`src/main.ts`**: Main entrypoint and comparison runner comparing logging behaviors between Winston and OpenTelemetry backends, as well as TypeScript language feature demos (e.g., `any` vs `unknown`).
- **`src/utils/logger_util.ts`**: Unified logger subsystem.
  - Defines the `LoggerInstance` interface (`info`, `warn`, `error`, `debug`).
  - Implements `WinstonLoggerInstance` (wrapping Winston loggers) and `OTelLoggerInstance` (custom structured log formatting with contextual attributes).
  - Provides the static `LoggerUtil` factory class that delegates creation based on `LOG_PROVIDER` env var (`winston` default, `otel` for OpenTelemetry) and manages lifecycle/shutdown.
- **`src/eo/user.ts`**: Domain model representing an Entity Object (`User`) using TypeScript parameter properties.
- **`src/utils/test_util.ts`**: Test data generator with static methods for creating single, batched, or criteria-filtered `User` fixtures.

---

## Key Conventions & Compiler Rules

1. **Explicit `.js` Extensions on Imports**:
   - `tsconfig.json` enforces `module: nodenext` and `verbatimModuleSyntax: true`.
   - All relative module imports in `.ts` files MUST include the `.js` extension (e.g., `import { User } from "./eo/user.js";`).

2. **Named Exports Only**:
   - ESLint flat configuration (`eslint.config.js`) enforces named exports via `no-restricted-syntax` targeting `ExportDefaultDeclaration` in `src/**`.
   - Avoid `export default`; always use named exports (e.g., `export { LoggerUtil };` or `export class User`).

3. **Strict Type Safety**:
   - `strict`, `noUncheckedIndexedAccess`, and `exactOptionalPropertyTypes` are enabled.
   - When accessing array indexes or record keys, always account for possible `undefined` return values.
