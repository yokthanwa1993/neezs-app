# Stage 1: Build the React application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency definitions (workspace-aware)
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages ./packages

# Install dependencies (use workspace lockfile with fallback for CI drift)
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the static files
RUN pnpm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.25-alpine
WORKDIR /usr/share/nginx/html

# Remove default Nginx welcome page
RUN rm -rf ./*

# Copy static files from the builder stage
COPY --from=builder /usr/src/app/dist .

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
