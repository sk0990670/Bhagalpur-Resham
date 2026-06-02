# ══════════════════════════════════════════════════════════════
# Bhagalpur Resham – Frontend Dockerfile (React + Vite)
# Multi-stage: deps → builder → production (nginx)
# ══════════════════════════════════════════════════════════════

# ── Stage 1: Dependency cache ─────────────────────────────────
FROM node:20-alpine AS deps
LABEL stage=deps

WORKDIR /app

# Install only prod-relevant system deps for native modules
RUN apk add --no-cache libc6-compat

# Copy lockfile first for Docker layer cache
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline

# ── Stage 2: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder
LABEL stage=builder

WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Inject build-time env vars (safe – only public VITE_ vars end up in bundle)
ARG VITE_API_BASE_URL=http://localhost:5000/api
ARG VITE_RAZORPAY_KEY_ID=""
ARG VITE_APP_ENV=production

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_RAZORPAY_KEY_ID=$VITE_RAZORPAY_KEY_ID \
    VITE_APP_ENV=$VITE_APP_ENV

RUN npm run build

# ── Stage 3: Production – nginx ───────────────────────────────
FROM nginx:1.27-alpine AS production
LABEL maintainer="Bhagalpur Resham <dev@bhagalpurresham.com>"
LABEL org.opencontainers.image.title="Bhagalpur Resham Frontend"
LABEL org.opencontainers.image.version="1.0.0"

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx SPA config (handles client-side routing)
COPY nginx/spa.conf /etc/nginx/conf.d/default.conf

# Non-root user for security
RUN addgroup -g 1001 -S nginx-group && \
    chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:80/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
