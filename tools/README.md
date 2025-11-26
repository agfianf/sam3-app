# AnnotateANU Tools

Command-line tools and scripts for AnnotateANU development and deployment.

## 📁 Directory Structure

```
tools/
├── cli/                # CLI tools for dataset management
├── scripts/            # Deployment and migration scripts
└── README.md           # This file
```

---

## 🛠️ CLI Tools (`cli/`)

**Purpose**: Command-line interface for dataset operations

**Planned Features**:
- Dataset import/export (COCO, YOLO, CVAT)
- Bulk annotation operations
- Model evaluation and benchmarking
- User management (Team mode)
- Database migrations
- Cache management

**Placeholder for future implementation**

### Example Usage (Planned)

```bash
# Import dataset
anu-cli import --format coco --input dataset.json --project my-project

# Export annotations
anu-cli export --format yolo --project my-project --output ./export

# Run model evaluation
anu-cli evaluate --model sam3 --dataset validation-set --metrics map,iou

# User management
anu-cli user add --email user@example.com --role annotator

# Database migration
anu-cli db migrate --version latest
```

---

## 📜 Scripts (`scripts/`)

**Purpose**: Automation scripts for deployment, migration, and maintenance

**Planned Scripts**:

### Deployment Scripts
- `deploy-solo.sh` - Deploy Solo mode to server
- `deploy-team.sh` - Deploy full Team mode stack
- `setup-gpu.sh` - Configure GPU support
- `backup.sh` - Backup database and object storage

### Migration Scripts
- `migrate-solo-to-team.sh` - Migrate from Solo to Team mode
- `migrate-cvat-data.sh` - Import data from CVAT
- `migrate-db-schema.sh` - Database schema migrations
- `sync-indexeddb-to-minio.sh` - Sync local data to Team storage

### Development Scripts
- `setup-dev-env.sh` - Initialize development environment
- `reset-db.sh` - Reset development database
- `seed-test-data.sh` - Seed database with test data
- `run-tests.sh` - Run all test suites

### Maintenance Scripts
- `cleanup-orphaned-files.sh` - Clean up unused files in MinIO
- `optimize-db.sh` - Vacuum and optimize PostgreSQL
- `clear-cache.sh` - Clear Redis cache
- `health-check.sh` - Check service health

---

## 🚀 Getting Started

### Development Setup

```bash
# Navigate to tools directory
cd tools

# Install CLI dependencies (when implemented)
cd cli
npm install  # or pip install -e .

# Make scripts executable
cd ../scripts
chmod +x *.sh
```

### Running Scripts

```bash
# Deployment
./scripts/deploy-solo.sh

# Migration
./scripts/migrate-solo-to-team.sh --backup

# Maintenance
./scripts/cleanup-orphaned-files.sh --dry-run
```

---

## 📝 Development Guidelines

### Creating New CLI Commands

1. Add command to `cli/commands/`
2. Register in `cli/main.py` or `cli/index.ts`
3. Add tests in `cli/tests/`
4. Update CLI help documentation
5. Add usage examples to this README

### Creating New Scripts

1. Create script in `scripts/` directory
2. Add shebang and set executable: `chmod +x script.sh`
3. Add usage documentation in script header
4. Add error handling and logging
5. Test in development environment
6. Update this README with usage example

### Script Template

```bash
#!/bin/bash
# script-name.sh - Brief description
#
# Usage: ./script-name.sh [options]
#
# Options:
#   --dry-run    Simulate without making changes
#   --help       Show this help message

set -e  # Exit on error
set -u  # Exit on undefined variable

# Script implementation...
```

---

## 🎯 Roadmap

**Phase 1 - CLI Foundation**
- [ ] CLI framework setup (Click/Typer or Commander)
- [ ] Configuration management
- [ ] Logging and error handling
- [ ] Basic dataset import/export

**Phase 2 - Deployment Scripts**
- [ ] Solo mode deployment
- [ ] Team mode deployment
- [ ] GPU setup automation
- [ ] Backup and restore

**Phase 3 - Migration Tools**
- [ ] Solo to Team migration
- [ ] CVAT data import
- [ ] Database schema migrations
- [ ] Data sync utilities

**Phase 4 - Advanced Features**
- [ ] Model evaluation CLI
- [ ] User management CLI
- [ ] Active learning pipeline CLI
- [ ] Monitoring and health checks

---

## 🤝 Contributing

When adding tools:

1. **CLI tools**: Use consistent argument naming and formatting
2. **Scripts**: Follow bash best practices (shellcheck)
3. **Documentation**: Update this README
4. **Testing**: Add integration tests where applicable
5. **Error handling**: Provide clear error messages
