#!/usr/bin/env bash
# Build and (re)deploy the stack on the VPS.
#
#   ./deploy/deploy.sh            # pull latest code, migrate, build, restart
#   ./deploy/deploy.sh --no-pull  # deploy the working tree as-is
#   ./deploy/deploy.sh --seed     # also run `prisma db seed` (first install)
#
# Order matters: `next build` prerenders pages that read from PostgreSQL, so the
# database must be up and migrated before the app image is built.
set -euo pipefail

cd "$(dirname "$0")/.."

PULL=1
SEED=0
for arg in "$@"; do
  case "$arg" in
    --no-pull) PULL=0 ;;
    --seed) SEED=1 ;;
    *) echo "unknown flag: $arg" >&2; exit 1 ;;
  esac
done

if [[ ! -f .env ]]; then
  echo "Missing .env - copy deploy/env.example to .env and fill it in." >&2
  exit 1
fi

# Load .env so DATABASE_URL etc. are available to this script.
set -a; source .env; set +a

# The image build runs on the host network, so point it at the published
# loopback port instead of the compose hostname `db`.
export BUILD_DATABASE_URL="${BUILD_DATABASE_URL:-${DATABASE_URL/@db:/@127.0.0.1:}}"

if [[ $PULL -eq 1 ]]; then
  echo "==> Pulling latest code"
  git pull --ff-only
fi

echo "==> Starting PostgreSQL"
docker compose up -d db
docker compose wait db 2>/dev/null || true
until docker compose exec -T db pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB" >/dev/null 2>&1; do
  sleep 2
done

echo "==> Applying database migrations"
docker compose --profile tools build migrate
docker compose --profile tools run --rm migrate

if [[ $SEED -eq 1 ]]; then
  echo "==> Seeding database"
  docker compose --profile tools run --rm migrate npx prisma db seed
fi

echo "==> Building application image"
docker compose build app

echo "==> Starting application, Caddy and cron"
docker compose up -d --remove-orphans app caddy cron

echo "==> Cleaning up old images"
docker image prune -f >/dev/null

echo
docker compose ps
echo
echo "Deployed. Follow logs with: docker compose logs -f app"
