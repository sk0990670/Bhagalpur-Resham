# ══════════════════════════════════════════════════════════════
# Bhagalpur Resham – Backend Dockerfile (Node.js + Express + TS)
# Multi-stage: deps → builder → production
# ══════════════════════════════════════════════════════════════

# ── Stage 1: Base with OS dependencies ───────────────────────
FROM node:20-alpine AS base
LABEL stage=base

RUN apk add --no-cache \
    dumb-init \
    curl \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001

WORKDIR /app

# ── Stage 2: Dependency installation ─────────────────────────
FROM base AS deps
LABEL stage=deps

COPY package.json package-lock.json* ./
# Install ALL deps (including dev) for build stage
RUN npm ci --prefer-offline

# ── Stage 3: TypeScript build ─────────────────────────────────
FROM base AS builder
LABEL stage=builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Compile TypeScript → JavaScript
RUN npm run build

# Remove dev dependencies after build
RUN npm ci --omit=dev --prefer-offline && \
    npm cache clean --force

# ── Stage 4: Production image ─────────────────────────────────
FROM base AS production
LABEL maintainer="Bhagalpur Resham <dev@bhagalpurresham.com>"
LABEL org.opencontainers.image.title="Bhagalpur Resham API"
LABEL org.opencontainers.image.version="1.0.0"

ENV NODE_ENV=production \
    PORT=5000

WORKDIR /app

# Copy only compiled JS + production node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./package.json

# Create logs directory with correct ownership
RUN mkdir -p logs && chown nodejs:nodejs logs

USER nodejs

EXPOSE 5000

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -fs http://localhost:5000/api/health || exit 1

# Use dumb-init to handle signals properly (no zombie processes)
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]

# ── Stage 5: Development (with hot-reload) ────────────────────
FROM base AS development
LABEL stage=development

ENV NODE_ENV=development

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

USER nodejs
EXPOSE 5000 9229

CMD ["npm", "run", "dev"]
