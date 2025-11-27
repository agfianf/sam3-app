# Getting Started with AnnotateANU

Complete guide to running AnnotateANU - a simple monorepo with FastAPI backend and React frontend.

---

## 📚 Table of Contents

- [Quick Start](#-quick-start)
- [How to Run the Project](#-how-to-run-the-project)
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

**That's it!** Docker handles orchestration. Makefile provides simple commands for common tasks.

---

## 🎯 How to Run the Project

### Method 1: Docker Compose (Recommended) 🐳

**Best for:** Most development scenarios, especially if you want both services running together.

```bash
make docker-up
```

**What happens:**
1. Docker builds both backend and frontend containers
2. Backend starts at http://localhost:8000
3. Frontend starts at http://localhost:5173
4. Both services can communicate via Docker network

**Key points:**
- Docker handles everything
- Hot-reload enabled for both services
- Clean isolated environment

**View logs:**
```bash
make docker-logs                    # All services
make docker-logs service=backend    # Just backend
make docker-logs service=frontend   # Just frontend
```

**Stop services:**
```bash
make docker-down
```

---

### Method 2: Local Development (For Individual Services) 💻

**Best for:** When you want to run just one service locally, or prefer local development tools.

#### Backend Only

```bash
cd apps/api-inference
cp .env.example .env         # Add your HF_TOKEN
make backend-install         # Install dependencies (run from root)
make backend-run             # Run backend (run from root)
```

Backend runs at http://localhost:8000

#### Frontend Only

```bash
cd apps/web
npm install
npm run dev
```

Frontend runs at http://localhost:5173

---

## 📖 Complete Command Reference

### Docker Commands

| Command | Description | When to use |
|---------|-------------|-------------|
| `make docker-up` | Start all services | Daily development |
| `make docker-down` | Stop all services | End of work session |
| `make docker-build` | Rebuild images | After Dockerfile changes |
| `make docker-logs` | View all logs | Debugging |
| `make docker-logs service=backend` | View backend logs | Backend debugging |
| `make docker-restart service=backend` | Restart backend | After config changes |
| `make docker-shell service=backend` | Open shell in container | Inspect container |

### Backend Commands

| Command | Description | When to use |
|---------|-------------|-------------|
| `make backend-install` | Install Python dependencies | After git pull |
| `make backend-run` | Run FastAPI locally | Local development |
| `make backend-test` | Run pytest | Testing |
| `make backend-lint` | Lint Python code | Code quality |
| `make backend-format` | Format Python code | Before commit |

### Frontend Commands

| Command | Description | When to use |
|---------|-------------|-------------|
| `make frontend-install` | Install npm dependencies | After git pull |
| `make frontend-dev` | Run Vite dev server | Local development |
| `make frontend-build` | Build for production | Production builds |

### General Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| `make install` | Install all dependencies (backend + frontend) |
| `make clean` | Clean cache and build files |

---

## 🔄 Development Workflows

### Daily Development

```bash
# Start your day
make docker-up

# Work on code...
# (Changes auto-reload)

# End of day
make docker-down
```

### After Pulling Changes

```bash
# If package.json or pyproject.toml changed
make install

# Rebuild Docker images if Dockerfiles changed
make docker-build
make docker-up
```

### Backend Development

```bash
# Make changes to Python code
make backend-format    # Format code
make backend-lint      # Check for issues
make backend-test      # Run tests

# Restart backend to see changes (if using Docker)
make docker-restart service=backend
```

### Frontend Development

```bash
cd apps/web

# Make changes to React code
npm run lint          # Check for issues
npm run build         # Test production build

# Changes auto-reload in dev mode
```

---

## 🐛 Troubleshooting

### Backend won't start

**Error: "Could not authenticate with HuggingFace"**
```bash
# Solution: Add HF_TOKEN to .env file
cp apps/api-inference/.env.example apps/api-inference/.env
# Edit .env and add: HF_TOKEN=hf_your_token_here
```

**Error: "Model download failed"**
```bash
# Solution: Check HuggingFace access
1. Visit https://huggingface.co/facebook/sam3
2. Request access (if not approved)
3. Generate new token at https://huggingface.co/settings/tokens
```

### Frontend won't connect to backend

**Error: "Network error" in browser console**
```bash
# Solution: Check backend is running
curl http://localhost:8000/api/v1/sam3/health

# If not running, start backend
make docker-up
# OR
make backend-run
```

### Docker issues

**Error: "port already allocated"**
```bash
# Solution: Stop existing containers
make docker-down
docker ps -a              # Check for other containers
docker stop <container>   # Stop conflicting container
```

**Error: "Cannot connect to Docker daemon"**
```bash
# Solution: Start Docker
sudo systemctl start docker   # Linux
# OR open Docker Desktop        # Mac/Windows
```

### Module not found errors

**Error: "Module not found" in frontend**
```bash
# Solution: Reinstall dependencies
cd apps/web
rm -rf node_modules package-lock.json
npm install
```

**Error: "Import error" in backend**
```bash
# Solution: Sync dependencies
cd apps/api-inference
uv sync
```

---

## 🎓 Key Concepts

### Project Structure

```
sam3-app/
├── apps/
│   ├── web/                 # React frontend (independent)
│   └── api-inference/       # FastAPI backend (independent)
├── docker-compose.yml       # Orchestrates both services
├── Makefile                 # Development commands
└── README.md
```

### How Services Communicate

- **Frontend → Backend**: HTTP requests to `http://localhost:8000`
- **Docker Network**: Services use container names for internal communication
- **Local Dev**: Services use localhost with port numbers

### Environment Variables

**Backend (.env in apps/api-inference/)**
- `HF_TOKEN` - HuggingFace authentication (required)
- `SAM3_DEVICE` - CUDA/CPU selection (auto/cuda/cpu)
- `MAX_IMAGE_SIZE_MB` - Image upload limit

**Frontend (.env in apps/web/)**
- `VITE_API_URL` - Backend URL (default: http://localhost:8000)

---

## 💡 Tips

1. **Use Docker for most development** - It's the easiest way to run both services
2. **Check logs often** - `make docker-logs` helps debug issues
3. **Restart after config changes** - `make docker-restart service=backend`
4. **Keep dependencies updated** - Run `make install` after pulling changes
5. **Format before committing** - `make backend-format` for Python code

---

## 📚 Additional Resources

- [CLAUDE.md](../CLAUDE.md) - Technical architecture details for AI assistants
- [README.md](../README.md) - Project overview and features
- [API Documentation](http://localhost:8000/docs) - Interactive API docs (when backend running)
