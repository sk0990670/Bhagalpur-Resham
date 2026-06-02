## ══════════════════════════════════════════════════════════════
## Makefile – Developer shortcuts for Docker operations
## Usage: make <command>
## ══════════════════════════════════════════════════════════════

.PHONY: help up down dev prod build logs ps clean nuke shell-backend shell-mongo seed

COMPOSE_PROD = docker compose -f docker-compose.yml
COMPOSE_DEV  = docker compose -f docker-compose.yml -f docker-compose.dev.yml
PROJECT      = bhagalpur-resham

## ── Help ─────────────────────────────────────────────────────
help:
	@echo ""
	@echo "  Bhagalpur Resham – Docker Commands"
	@echo "  ════════════════════════════════════"
	@echo "  make dev          Start development environment (HMR)"
	@echo "  make prod         Start production stack"
	@echo "  make down         Stop all containers"
	@echo "  make build        Rebuild all images"
	@echo "  make logs         Tail logs for all services"
	@echo "  make logs-api     Tail backend logs only"
	@echo "  make ps           Show running containers"
	@echo "  make shell-api    Open shell in backend container"
	@echo "  make shell-mongo  Open mongosh in MongoDB"
	@echo "  make clean        Remove containers + networks"
	@echo "  make nuke         Remove everything including volumes"
	@echo "  make seed         Run database seed script"
	@echo ""

## ── Development ──────────────────────────────────────────────
dev:
	$(COMPOSE_DEV) up --build

dev-d:
	$(COMPOSE_DEV) up --build -d

## ── Production ───────────────────────────────────────────────
prod:
	$(COMPOSE_PROD) up -d

prod-ssl:
	$(COMPOSE_PROD) --profile ssl up -d

build:
	$(COMPOSE_PROD) build --no-cache

build-dev:
	$(COMPOSE_DEV) build --no-cache

## ── Control ──────────────────────────────────────────────────
down:
	$(COMPOSE_PROD) down

down-dev:
	$(COMPOSE_DEV) down

restart:
	$(COMPOSE_PROD) restart

## ── Logs ─────────────────────────────────────────────────────
logs:
	$(COMPOSE_PROD) logs -f

logs-api:
	$(COMPOSE_PROD) logs -f backend

logs-nginx:
	$(COMPOSE_PROD) logs -f nginx

logs-db:
	$(COMPOSE_PROD) logs -f mongodb

## ── Status ───────────────────────────────────────────────────
ps:
	$(COMPOSE_PROD) ps

health:
	@docker inspect br-backend  --format='Backend:  {{.State.Health.Status}}' 2>/dev/null || echo "Backend not running"
	@docker inspect br-frontend --format='Frontend: {{.State.Health.Status}}' 2>/dev/null || echo "Frontend not running"
	@docker inspect br-mongodb  --format='MongoDB:  {{.State.Health.Status}}' 2>/dev/null || echo "MongoDB not running"
	@docker inspect br-redis    --format='Redis:    {{.State.Health.Status}}' 2>/dev/null || echo "Redis not running"

## ── Shells ───────────────────────────────────────────────────
shell-api:
	docker exec -it br-backend sh

shell-mongo:
	docker exec -it br-mongodb mongosh -u admin -p --authenticationDatabase admin

shell-redis:
	docker exec -it br-redis redis-cli -a $${REDIS_PASSWORD:-changeme}

## ── Database ─────────────────────────────────────────────────
seed:
	docker exec -it br-backend node dist/scripts/seed.js

## ── Cleanup ──────────────────────────────────────────────────
clean:
	$(COMPOSE_PROD) down --remove-orphans

nuke:
	$(COMPOSE_PROD) down --volumes --remove-orphans --rmi all
	@echo "⚠️  All containers, images and volumes removed."

## ── SSL Renewal ──────────────────────────────────────────────
ssl-init:
	docker run --rm -v br_certbot_certs:/etc/letsencrypt \
		-v br_certbot_www:/var/www/certbot \
		certbot/certbot certonly --webroot \
		-w /var/www/certbot \
		-d bhagalpurresham.com -d www.bhagalpurresham.com \
		--email admin@bhagalpurresham.com \
		--agree-tos --no-eff-email

ssl-renew:
	$(COMPOSE_PROD) --profile ssl run certbot certbot renew
