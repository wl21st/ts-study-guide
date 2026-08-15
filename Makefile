.DEFAULT_GOAL := help

# ─── Variables ────────────────────────────────────────────────────────────────
LOG_PROVIDER ?= winston
LOG_LEVEL    ?= info

# ─── Phony Targets ────────────────────────────────────────────────────────────
.PHONY: help install install-security build clean lint lint-fix run dev run-otel run-debug \
        security security-scan security-source security-secrets security-deps security-all security-fix check all

# ─── Help Target (Self-Documenting) ───────────────────────────────────────────
help: ## Display this help message
	@echo "Available targets in this Makefile:"
	@echo ""
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Environment overrides:"
	@echo "  LOG_PROVIDER=otel|winston   (default: winston)"
	@echo "  LOG_LEVEL=debug|info|warn   (default: info)"

# ─── Dependency Management ────────────────────────────────────────────────────
install: ## Install package dependencies
	npm install

install-security: ## Install security source scanning tools (eslint-plugin-security, secretlint)
	npm run security:tools-install

# ─── Build & Clean ────────────────────────────────────────────────────────────
build: ## Compile TypeScript source to dist/
	npm run build

clean: ## Remove build artifacts (dist directory)
	rm -rf dist

# ─── Linting ──────────────────────────────────────────────────────────────────
lint: ## Run ESLint code and security checks
	npm run lint

lint-fix: ## Run ESLint and automatically fix fixable issues
	npm run lint:fix

# ─── Execution ────────────────────────────────────────────────────────────────
run: build ## Build and execute compiled code (dist/main.js)
	LOG_PROVIDER=$(LOG_PROVIDER) LOG_LEVEL=$(LOG_LEVEL) node dist/main.js

dev: ## Run TypeScript directly using tsx without pre-building
	LOG_PROVIDER=$(LOG_PROVIDER) LOG_LEVEL=$(LOG_LEVEL) npx tsx src/main.ts

run-otel: build ## Build and execute with OpenTelemetry logger backend
	LOG_PROVIDER=otel LOG_LEVEL=$(LOG_LEVEL) node dist/main.js

run-debug: build ## Build and execute with OpenTelemetry backend and debug log level
	LOG_PROVIDER=otel LOG_LEVEL=debug node dist/main.js

# ─── Security Scanning & Quality Checks ───────────────────────────────────────
security: security-scan ## Default security target: run source security scan

security-scan: ## Scan source code for security vulnerabilities (AST analysis) and leaked secrets
	@echo "==> Scanning source code for hardcoded secrets..."
	npm run security:secrets
	@echo "==> Scanning source code with AST security rules..."
	npx eslint src/ --ext .ts,.js

security-source: security-scan ## Alias for security-scan

security-secrets: ## Scan source code specifically for credentials and secrets
	npm run security:secrets

security-deps: ## Run npm dependency vulnerability audit
	npm run security:deps

security-all: security-scan security-deps ## Run all security checks (source scan + secrets + dependency audit)

security-fix: ## Run npm audit fix to resolve dependency vulnerabilities
	npm run security:fix

# ─── Meta Targets ─────────────────────────────────────────────────────────────
check: lint build ## Run both linter and TypeScript build checks

all: check security-scan run ## Run lint, build, security scan, and execute
