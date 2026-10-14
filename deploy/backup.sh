#!/usr/bin/env bash
# Nightly PostgreSQL dump (+ uploaded blog images) with 14-day retention.
#
# Install on the VPS with:  crontab -e
#   30 2 * * * /opt/sidec/deploy/backup.sh >> /var/log/sidec-backup.log 2>&1
#
# Restore a dump:
#   gunzip -c backups/db-2026-10-12.sql.gz | docker compose exec -T db \
#     psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"
set -euo pipefail

cd "$(dirname "$0")/.."
set -a; source .env; set +a

KEEP_DAYS="${BACKUP_KEEP_DAYS:-14}"
STAMP="$(date +%F)"
mkdir -p backups

echo "[$(date -Is)] dumping database"
docker compose exec -T db pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" \
  --no-owner --no-privileges | gzip > "backups/db-${STAMP}.sql.gz"

echo "[$(date -Is)] archiving uploads"
docker run --rm -v sidec_uploads:/uploads:ro -v "$PWD/backups":/out alpine:3.20 \
  tar czf "/out/uploads-${STAMP}.tar.gz" -C /uploads . 2>/dev/null || true

find backups -type f -mtime +"$KEEP_DAYS" -delete
echo "[$(date -Is)] done: $(ls -1 backups | wc -l) files kept"
