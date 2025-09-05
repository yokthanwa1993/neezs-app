# Stage 1: Build the application
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Install pnpm
RUN npm install -g pnpm

# Copy dependency definition files (workspace-aware)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages ./packages

# Install dependencies using workspace lockfile
RUN pnpm install --frozen-lockfile || pnpm install --no-frozen-lockfile

# Copy the rest of the source code
COPY . .

# Build the Next.js application
RUN pnpm run build

# Stage 2: Create the production image
FROM node:20-alpine
WORKDIR /usr/src/app

# Install pnpm in production stage
RUN npm install -g pnpm

# Copy built code and dependencies from the builder stage
COPY --from=builder /usr/src/app/.next ./.next
COPY --from=builder /usr/src/app/public ./public
COPY --from=builder /usr/src/app/package.json ./package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the application
CMD [ "pnpm", "start" ]
