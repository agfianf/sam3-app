# Getting Started with AnnotateANU

Complete guide to understanding and running AnnotateANU v2.0 with Turborepo.

---

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [Understanding Turborepo](#-understanding-turborepo)
- [How to Run the Project](#-how-to-run-the-project)
- [What Happened to Makefile?](#-what-happened-to-makefile)
- [Complete Command Reference](#-complete-command-reference)
- [Development Workflows](#-development-workflows)
- [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

**Just want to start developing right now?**

```bash
# Option A: Docker (Recommended - Easiest)
make docker-up
# Visit http://localhost:5173 (Frontend)
# Visit http://localhost:8000/docs (API)

# Option B: Local Development
make backend-run          # Terminal 1 - Backend API
cd apps/web && npm run dev  # Terminal 2 - Frontend
```

**That's it!** You can start developing without learning Turborepo. Everything still works the same way!

---

## 🤔 Understanding Turborepo

### What is Turborepo?

**Turborepo is a build system for monorepos.** Think of it as a **smart task runner** that:

1. ✅ **Runs tasks in parallel** - Can build/test multiple packages at the same time
2. 🚀 **Caches results** - If nothing changed, it skips rebuilding (30-70% faster)
3. 📦 **Manages dependencies** - Knows which packages depend on each other
4. 🎯 **Orchestrates workspaces** - Runs commands across all apps/packages

### Why We're Using It?

#### Before Turborepo (Old Structure)

```
sam3-app/
├── backend/    # Python - independent
├── frontend/   # React - independent
```

**Problems:**
- Frontend and backend were completely separate
- No code sharing between them
- TypeScript types duplicated in frontend
- Had to run commands separately
- Hard to add new services

#### After Turborepo (New Structure)

```
sam3-app/
├── apps/
│   ├── web/              # React app
│   └── api-inference/    # Python API
├── packages/
│   ├── shared-types/     # Shared TypeScript types ⭐
│   └── tsconfig/         # Shared configs ⭐
```

**Benefits:**
- ✅ **Frontend and backend share TypeScript types** (no duplication!)
- ✅ **Turborepo builds shared-types first, then web** (automatic dependency order)
- ✅ **30-70% faster builds** with caching
- ✅ **Type-safe API contracts** between frontend and backend
- ✅ **Ready to add more services** (api-core, workers, etc.)
- ✅ **Better developer experience** with parallel builds

### Real Example: The Shared Types Benefit

**Before** (Duplicated types):
```typescript
// backend/schemas/sam3.py
class SAM3Response:
    num_objects: int
    boxes: List[List[float]]
    scores: List[float]

// frontend/src/types/annotations.ts
interface SAM3Response {
  num_objects: number
  boxes: number[][]
  scores: number[]
}
// ❌ If backend changes, frontend breaks silently!
```

**After** (Shared types):
```typescript
// packages/shared-types/src/index.ts
export interface SAM3Response {
  num_objects: number
  boxes: number[][]
  scores: number[]
}

// apps/web/src/lib/sam3-client.ts
import type { SAM3Response } from '@sam3/shared-types'
// ✅ Single source of truth!
// ✅ TypeScript catches breaking changes immediately!
```

---

## 🏃 How to Run the Project?

You have **3 ways** to run AnnotateANU. Choose what works best for you:

### Method 1: Docker (Recommended - Easiest) 🐳

This is **exactly the same as before!** Nothing changed for Docker users.

```bash
# Development mode (hot-reload enabled)
make docker-up

# View logs
make docker-logs

# Stop services
make docker-down
```

**What happens:**
- Backend runs on http://localhost:8000
- Frontend runs on http://localhost:5173
- Turborepo is NOT involved - Docker handles everything
- Hot-reload works for both frontend and backend

**When to use:**
- ✅ First time setup
- ✅ You want everything to "just work"
- ✅ You want GPU acceleration (nvidia-docker)
- ✅ You don't want to install Python/Node locally

---

### Method 2: Turborepo Commands (For Multiple Apps) ⚡

Use this when you want to run **multiple packages/apps** together locally (without Docker).

```bash
# 1. Install all dependencies (run once)
npm install

# 2. Build all packages (shared-types, then web)
npm run build

# 3. Run development mode for all packages
npm run dev

# 4. Lint all TypeScript packages
npm run lint

# 5. Run tests across all packages
npm run test
```

**What happens when you run `npm run build`:**
```
npm run build
      ↓
Turborepo starts
      ↓
1. ✅ Builds packages/shared-types/ (TypeScript → JavaScript)
2. ✅ Builds apps/web/ (uses compiled shared-types)
3. ⏭️  Skips apps/api-inference/ (Python, no JS build needed)
      ↓
Result: All TypeScript packages built in dependency order
```

**Second build is cached:**
```bash
npm run build
# 🚀 FULL TURBO - Everything cached!
# Completed in 0.2s (was 8s before)
```

**When to use:**
- ✅ You're working on shared-types + web together
- ✅ You want to see Turborepo's speed benefits
- ✅ You're preparing for production build
- ✅ You're running CI/CD pipelines

---

### Method 3: Individual Commands (Same as Before!) 🛠️

Run each service individually - **this still works exactly as before!**

**Terminal 1 - Backend:**
```bash
make backend-run
# or manually:
cd apps/api-inference
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Terminal 2 - Frontend:**
```bash
make frontend-dev
# or manually:
cd apps/web
npm run dev
```

**Terminal 3 - Shared Types (watch mode):**
```bash
cd packages/shared-types
npm run dev  # TypeScript compiler in watch mode
```

**When to use:**
- ✅ You're only working on frontend OR backend
- ✅ You want fine-grained control
- ✅ You're debugging a specific service
- ✅ You prefer traditional development workflow

---

## 📋 What Happened to Makefile?

**The Makefile is still there and works exactly the same!** We just **added** new commands.

### Original Commands (Still Work ✅)

All these commands work **exactly as before:**

| Command | What It Does | Status |
|---------|--------------|--------|
| `make docker-up` | Start Docker dev environment | ✅ Same |
| `make docker-down` | Stop Docker services | ✅ Same |
| `make backend-run` | Run backend locally | ✅ Same |
| `make backend-test` | Run backend tests | ✅ Same |
| `make backend-lint` | Lint backend code | ✅ Same |
| `make frontend-dev` | Run frontend dev server | ✅ Same |
| `make frontend-build` | Build frontend for production | ✅ Same |
| `make install` | Install all dependencies | ✅ Enhanced |
| `make clean` | Clean cache and build files | ✅ Enhanced |

### New Commands Added 🆕

| Command | What It Does | When to Use |
|---------|--------------|-------------|
| `make docker-up-solo` | Start SOLO mode (minimal) | Local-first deployment |
| `make docker-up-team` | Start TEAM mode (full stack) | Collaborative features |
| `make turbo-build` | Build all packages with Turborepo | Production builds |
| `make turbo-dev` | Run all packages in dev mode | Multi-package development |
| `make turbo-lint` | Lint all TypeScript packages | Code quality checks |

**Summary: Nothing was removed, only added!** Your existing workflow continues to work.

---

## 📖 Complete Command Reference

### Development Commands

```bash
# Docker-based development (Recommended)
make docker-up              # Start dev environment (hot-reload)
make docker-down            # Stop services
make docker-logs            # View all logs
make docker-logs service=backend   # View specific service logs
make docker-build           # Rebuild Docker images
make docker-restart         # Restart all services
make docker-shell service=backend  # Open shell in container

# Local development (without Docker)
make backend-run            # Run backend on http://localhost:8000
make frontend-dev           # Run frontend on http://localhost:5173

# Dependencies
make install                # Install all dependencies
make backend-install        # Install backend dependencies (Python/uv)
make frontend-install       # Install frontend dependencies (npm)

# Cleanup
make clean                  # Clean all cache and build files
```

### Turborepo Commands

```bash
# Build & Development
npm run build              # Build all packages with caching
npm run dev                # Run all packages in development mode
npm run lint               # Lint all TypeScript packages
npm run test               # Run all tests
npm run clean              # Clean build artifacts

# Or via Makefile
make turbo-build           # Same as npm run build
make turbo-dev             # Same as npm run dev
make turbo-lint            # Same as npm run lint
```

### Deployment Modes

```bash
# SOLO Mode (Minimal - Local-first)
make docker-up-solo        # Start SOLO mode
make docker-down-solo      # Stop SOLO mode
# Services: Backend (8000), Frontend (3000)
# Storage: IndexedDB only
# Auth: Disabled

# TEAM Mode (Full Stack - Collaborative)
make docker-up-team        # Start TEAM mode
make docker-down-team      # Stop TEAM mode
# Services: Traefik, Backend, Frontend, PostgreSQL, MinIO, Redis, Workers
# Storage: PostgreSQL + MinIO
# Auth: Enabled
```

### Package-Specific Commands

```bash
# Shared Types
cd packages/shared-types
npm run build              # Compile TypeScript
npm run dev                # Watch mode (recompile on change)
npm run clean              # Remove dist/
npm run lint               # Type check

# Web App
cd apps/web
npm run dev                # Vite dev server (port 5173)
npm run build              # Production build
npm run lint               # ESLint check
npm run preview            # Preview production build

# API Inference (Backend)
cd apps/api-inference
uv run uvicorn app.main:app --reload  # Development server
uv run pytest src/tests/   # Run tests
uv run ruff check src/     # Lint
uv run ruff format src/    # Format code
```

---

## 💼 Development Workflows

### Workflow 1: Quick Development Session (Docker)

**Best for:** Daily development, quick iterations

```bash
# 1. Start everything
make docker-up

# 2. Edit code
# - Frontend: apps/web/src/
# - Backend: apps/api-inference/src/
# Changes auto-reload! ✨

# 3. View logs if needed
make docker-logs

# 4. Stop when done
make docker-down
```

**Pros:**
- ✅ Fastest to get started
- ✅ Everything configured correctly
- ✅ GPU acceleration works
- ✅ No dependency issues

---

### Workflow 2: Frontend Development (Local)

**Best for:** Working only on frontend, faster iteration

```bash
# Terminal 1 - Backend (Docker or local)
make docker-up  # or make backend-run

# Terminal 2 - Frontend (local)
cd apps/web
npm run dev

# Terminal 3 - Shared types (watch mode)
cd packages/shared-types
npm run dev

# Edit code in apps/web/src/
# Changes reflected immediately in browser
```

**Pros:**
- ✅ Faster frontend hot-reload
- ✅ Better TypeScript IDE support
- ✅ Can use browser DevTools

---

### Workflow 3: Working with Shared Types

**Best for:** Changing API contracts, updating types

```bash
# 1. Edit shared types
vim packages/shared-types/src/index.ts

# 2. Rebuild shared types
cd packages/shared-types
npm run build

# 3. Frontend will automatically pick up changes
cd apps/web
npm run dev

# TypeScript will immediately show errors if types don't match!
```

**Pros:**
- ✅ Type safety between frontend and backend
- ✅ Catch breaking changes immediately
- ✅ IDE autocomplete works

---

### Workflow 4: Full Stack Development

**Best for:** Working on features that touch both frontend and backend

```bash
# Terminal 1 - Backend
make backend-run

# Terminal 2 - Frontend
cd apps/web && npm run dev

# Terminal 3 - Shared types (watch)
cd packages/shared-types && npm run dev

# Edit any code, everything reloads automatically
```

---

### Workflow 5: Production Build & Testing

**Best for:** Preparing for deployment, CI/CD

```bash
# 1. Clean everything
make clean

# 2. Install fresh dependencies
npm install

# 3. Build all packages (Turborepo kicks in!)
npm run build

# 4. Run linting
npm run lint

# 5. Run tests (when implemented)
npm run test

# 6. Test production build
cd apps/web
npm run preview  # Preview production build locally
```

---

## 🔑 Key Concepts

### Repository Structure

```
sam3-app/                    # Root of Turborepo workspace
│
├── apps/                    # Applications (deployable services)
│   ├── web/                 # React frontend
│   └── api-inference/       # FastAPI backend
│
├── packages/                # Shared packages (libraries)
│   ├── shared-types/        # TypeScript types (used by web)
│   └── tsconfig/            # TypeScript configs
│
├── docker/                  # Docker deployment configs
├── docs/                    # Documentation
├── tools/                   # CLI tools and scripts
│
├── package.json             # Root workspace config
├── turbo.json              # Turborepo pipeline config
├── docker-compose.yml      # Docker orchestration
└── Makefile                # Development commands
```

### Workspace Dependencies

```
Dependency Graph:

@sam3/shared-types (TypeScript types)
        ↓
@sam3/web (React app)
        ↓ (uses types from shared-types)
    Frontend

@sam3/api-inference (FastAPI)
        ↓ (Python, independent)
    Backend
```

**Key Points:**
- `shared-types` must be built BEFORE `web`
- Turborepo handles this automatically
- Backend is independent (Python)

### Turborepo Caching

**First build:**
```bash
npm run build
# Building @sam3/shared-types... 2.3s
# Building @sam3/web... 5.8s
# Total: 8.1s
```

**Second build (no changes):**
```bash
npm run build
# @sam3/shared-types: cache hit ⚡
# @sam3/web: cache hit ⚡
# Total: 0.2s (40x faster!)
```

**What gets cached:**
- TypeScript compilation results
- Build outputs (dist/)
- Lint results
- Test results

---

## 🐛 Troubleshooting

### Issue: "npm run build" fails with TypeScript errors

**Solution:**
```bash
# 1. Clean everything
make clean

# 2. Reinstall dependencies
npm install

# 3. Build shared types first
cd packages/shared-types
npm run build

# 4. Build web
cd ../apps/web
npm run build
```

---

### Issue: Docker fails to start

**Solution:**
```bash
# Check Docker is running
docker --version

# View detailed logs
make docker-logs

# Rebuild images
make docker-build
make docker-up
```

---

### Issue: Frontend can't import from @sam3/shared-types

**Solution:**
```bash
# 1. Build shared types
cd packages/shared-types
npm run build

# 2. Verify dist/ was created
ls -la dist/

# 3. Reinstall workspace dependencies
cd ../..
npm install

# 4. Check import in apps/web
cd apps/web
npm ls @sam3/shared-types
# Should show: @sam3/shared-types@0.0.0 -> ../../packages/shared-types
```

---

### Issue: Turborepo cache is stale

**Solution:**
```bash
# Clear Turborepo cache
rm -rf .turbo

# Clear all build artifacts
make clean

# Rebuild
npm run build
```

---

### Issue: Port already in use

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or change port in docker-compose.yml
```

---

## 💡 Tips & Best Practices

### 1. Use Docker for Daily Development

```bash
# Simplest workflow
make docker-up
# Code, test, debug
make docker-down
```

**Why:** Everything configured, GPU works, no dependency issues.

---

### 2. Run Turborepo Builds Before Commits

```bash
# Before committing
npm run build     # Ensure everything builds
npm run lint      # Check code quality
git commit -m "..."
```

**Why:** Catches TypeScript errors and build failures early.

---

### 3. Keep Shared Types Updated

When you change API responses:

```bash
# 1. Update backend schema (apps/api-inference/src/app/schemas/)
# 2. Update shared types (packages/shared-types/src/index.ts)
# 3. Rebuild shared types
cd packages/shared-types && npm run build
# 4. Frontend will show TypeScript errors if incompatible!
```

**Why:** Type safety prevents runtime errors.

---

### 4. Use Watch Mode for Shared Types

```bash
# Terminal 1 - Shared types watch mode
cd packages/shared-types
npm run dev

# Terminal 2 - Frontend dev
cd apps/web
npm run dev

# Edit shared types, frontend rebuilds automatically!
```

---

### 5. Leverage Makefile for Common Tasks

```bash
make docker-up        # Instead of: docker-compose -f docker/...
make backend-run      # Instead of: cd apps/api-inference && uv run...
make frontend-dev     # Instead of: cd apps/web && npm run dev
```

**Why:** Shorter commands, easier to remember.

---

## 📚 Next Steps

1. **Start Development:** Run `make docker-up` and start coding!
2. **Read Architecture Docs:** See [docs/architecture/](./architecture/)
3. **API Documentation:** See [docs/api-specs/](./api-specs/)
4. **Deployment Guide:** See [docker/README.md](../docker/README.md)
5. **BYOM Integration:** See [docs/byom-integration-guide/](./byom-integration-guide/)

---

## 🤝 Need Help?

- 📖 Read the [main README](../README.md)
- 🐛 Report issues on [GitHub Issues](https://github.com/agfianf/annotate-anu/issues)
- 💬 Check [CLAUDE.md](../CLAUDE.md) for AI development guidelines

---

**Happy Coding! 🚀**
