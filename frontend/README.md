# SAM3 Annotation Platform - Frontend

React-based annotation platform for image labeling, inspired by T-REX Label and MakeSense.ai.

## Features

- **Local-First Architecture** - All data stored in your browser (IndexedDB), works offline, complete privacy
- **Manual Annotation Tools** - Rectangle, polygon, and point drawing with full editing capabilities
- **AI-Assisted Segmentation** - SAM3-powered text and bounding box prompts with three modes:
  - Single: Manual prompt submission
  - Auto-Apply: Automatic segmentation when switching images
  - Batch: Process multiple images at once
- **Smart Annotation Management** - Filter by type, sort by confidence, bulk operations (delete, relabel, visibility toggle)
- **Export Ready** - COCO JSON and YOLO format export
- **Keyboard Shortcuts** - Fast navigation and tool switching
- **Responsive Canvas** - Zoom, pan, and edit annotations with smooth Konva-based rendering

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** - Fast build tool and dev server
- **Konva** + **React-Konva** - Canvas manipulation for annotations
- **IndexedDB** - Local browser storage for images and annotations
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client for API calls
- **Lucide React** - Icon library

## Development

### Prerequisites

- Node.js 18+ and npm

### Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev

# Open http://localhost:5173
```

### Environment Variables

Create a `.env` file:

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000

# Environment
VITE_ENV=development
```

### Available Scripts

```bash
npm run dev          # Start dev server (port 5173)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Canvas.tsx       # Main annotation canvas
│   │   ├── Toolbar.tsx      # Tool selection sidebar
│   │   └── Sidebar.tsx      # Annotations list
│   ├── App.tsx              # Main application
│   ├── App.css
│   ├── index.css            # Tailwind directives
│   └── main.tsx             # Entry point
├── public/
├── Dockerfile               # Multi-stage build (Vite + Nginx)
├── nginx.conf               # Nginx configuration for production
├── package.json
├── vite.config.ts
└── tailwind.config.js
```

## How It Works

The platform uses a **local-first architecture** where all your data stays in your browser:

- **Images** - Stored as blobs in IndexedDB. Upload once, access anytime without re-uploading
- **Annotations** - Automatically saved to IndexedDB as you draw. Supports rectangles, polygons, and points with full metadata (confidence scores, timestamps, visibility)
- **Labels** - Color-coded categories stored locally with grouping support
- **Privacy** - No server-side storage. Your images and annotations never leave your browser unless you explicitly export them

**Benefits:**
- Work offline after initial load
- No file size limits from server
- Complete data privacy
- Instant save and load
- Export when you're ready (COCO JSON, YOLO formats)

## Annotation Tools

**Manual Tools:**
- **Select** - Select and modify existing annotations (drag, resize, delete)
- **Rectangle** - Draw bounding boxes
- **Polygon** - Draw custom polygon shapes
- **Point** - Add single point annotations

**AI-Assisted Tools:**
- **Text Prompt** - Describe what to segment (e.g., "person", "car"), SAM3 generates masks
- **Bounding Box Prompt** - Draw rough boxes, SAM3 refines into precise polygons

**Prompt Modes:**
- **Single** - Submit one prompt at a time
- **Auto-Apply** - Automatically segment when switching images (after first run)
- **Batch** - Process multiple selected images with the same prompt

**Management:**
- Filter annotations by type (manual/AI-generated)
- Sort by creation date or confidence score
- Bulk operations (delete, change label, toggle visibility)
- Low-confidence annotation cleanup

## Docker Deployment

The frontend is containerized using a multi-stage Docker build:

1. **Build stage**: Uses Node.js to build the Vite app
2. **Production stage**: Serves static files with Nginx

See root `docker-compose.yml` for full setup.

## API Integration

The frontend communicates with the SAM3 backend API:

- **Endpoint**: `/api/v1/sam3/inference/*`
- **Features**: Text prompts, bounding box inference, batch processing

## Future Enhancements

- CVAT integration for advanced labeling
- Pascal VOC export format
- Multi-user collaboration and cloud sync
- Annotation history and versioning with undo/redo beyond current session
- Video annotation support
- Custom model integration (bring your own segmentation model)

## References

- [T-REX Label](https://www.trexlabel.com/)
- [MakeSense.ai](https://www.makesense.ai/)
- [React Konva](https://konvajs.org/docs/react/)
- [Vite](https://vite.dev/)
