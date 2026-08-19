# Multi-Stage Production Dockerfile for Sanjeevani Hospital Backend

# ---- Stage 1: Build ----
FROM node:20-alpine AS builder

WORKDIR /app

# Install build dependencies
COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Copy application source
COPY tsconfig*.json nest-cli.json ./
COPY src ./src/

# Generate Prisma client and build NestJS
RUN npx prisma generate
RUN npm run build

# Prune dev dependencies for lean production container
RUN npm prune --production

# ---- Stage 2: Production Runtime ----
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Install curl for docker healthcheck
RUN apk add --no-cache curl

# Create unprivileged user for security compliance
USER node

# Copy built artifacts and production dependencies
COPY --chown=node:node --from=builder /app/package*.json ./
COPY --chown=node:node --from=builder /app/node_modules ./node_modules
COPY --chown=node:node --from=builder /app/dist ./dist
COPY --chown=node:node --from=builder /app/prisma ./prisma

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "dist/main"]
