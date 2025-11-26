# Stage 1: Development (Monorepo-aware)
FROM node:20 AS development

WORKDIR /workspace

RUN apt-get update && apt-get install -y \
    git \
    curl \
    ca-certificates \
    libsndfile1 \
    && rm -rf /var/lib/apt/lists/*

# Copy root package.json and workspace config
COPY package*.json ./

# Copy workspace packages
COPY packages ./packages

# Copy app package.json
COPY apps/web/package*.json ./apps/web/

# Install all workspace dependencies from root
RUN npm install

WORKDIR /workspace/apps/web

# Expose Vite dev server port
EXPOSE 5173

# Start dev server (will be overridden by docker-compose command)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# Stage 2: Build the application (Monorepo-aware)
FROM node:20 AS builder

WORKDIR /workspace

# Copy root package.json and workspace config
COPY package*.json ./

# Copy workspace packages
COPY packages ./packages

# Copy app files
COPY apps/web ./apps/web

# Install all workspace dependencies from root
RUN npm ci

WORKDIR /workspace/apps/web

# Build the application
RUN npm run build

# Stage 3: Production - Serve with Nginx
FROM nginx:alpine AS production

# Copy built files from builder
COPY --from=builder /workspace/apps/web/dist /usr/share/nginx/html

# Copy nginx configuration (if it exists in the web app)
# COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
