# Stage 1: Builder
FROM node:22-alpine AS builder

WORKDIR /app

# Enable corepack for Yarn 4
RUN corepack enable

# Copy workspace configuration
COPY package.json yarn.lock .yarnrc.yml ./

# Copy all workspace package.json files (required for yarn install --immutable)
COPY shared/package.json ./shared/
COPY frontend/package.json ./frontend/
COPY backend/package.json ./backend/

# Install dependencies
RUN yarn install --immutable

# Copy source code
COPY shared/ ./shared/
COPY frontend/ ./frontend/

# Build shared package first, then frontend
RUN yarn workspace @unclocked-app/shared build && \
    yarn workspace frontend build

# Stage 2: Production with nginx
FROM nginx:alpine AS production

# Copy nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from builder
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
