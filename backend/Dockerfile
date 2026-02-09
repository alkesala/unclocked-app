# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack for Yarn 4
RUN corepack enable

# Copy workspace configuration
COPY package.json yarn.lock .yarnrc.yml ./

# Copy all workspace package.json files (required for yarn install --immutable)
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install dependencies
RUN yarn install --immutable

# Copy source code
COPY shared/ ./shared/
COPY backend/ ./backend/

# Build shared package first, then backend
RUN yarn workspace @unclocked-app/shared build && \
    yarn workspace backend build

# Stage 2: Production
FROM node:22-alpine AS production

WORKDIR /app

# Enable corepack for Yarn 4
RUN corepack enable

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy workspace configuration
COPY package.json yarn.lock .yarnrc.yml ./

# Copy all workspace package.json files
COPY shared/package.json ./shared/
COPY backend/package.json ./backend/
COPY frontend/package.json ./frontend/

# Install production dependencies only
RUN yarn workspaces focus backend --production

# Copy built artifacts
COPY --from=builder /app/shared/dist ./shared/dist
COPY --from=builder /app/backend/dist ./backend/dist

# Set ownership
RUN chown -R nodejs:nodejs /app

USER nodejs

WORKDIR /app/backend

EXPOSE 3001

CMD ["node", "dist/index.js"]
