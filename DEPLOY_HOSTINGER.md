# Deploying to a Hostinger VPS (app + PostgreSQL on the same server)

The site runs as a small Docker Compose stack on one VPS:

| Service   | What it does                                                            |
| --------- | ----------------------------------------------------------------------- |
| `caddy`   | HTTPS (automatic Let's Encrypt certificate), reverse proxy, serves `/uploads` |
| `app`     | Next.js 16 standalone server on port 3000 (internal only)               |
| `db`      | PostgreSQL 17, data in the `pgdata` Docker volume, bound to `127.0.0.1` |
| `cron`    | Fires `/api/cron/appointment-reminders` daily at 09:00 (`CRON_TZ`)      |
| `migrate` | One-shot `prisma migrate deploy` / `prisma db seed` (profile `tools`)   |

Client-portal documents stay in Supabase Storage; blog images uploaded from
the admin panel are stored in the `uploads` volume and served by Caddy.

---

## 1. Order the VPS and point DNS at it

1. In hPanel buy a **KVM 2** (2 vCPU / 8 GB) or larger. KVM 1 (4 GB) works
   but `next build` is tight; if you pick it, add swap (step 2).
2. Operating system: choose **Ubuntu 24.04 with Docker** from the OS templates
   (under "Applications"). If you pick plain Ubuntu, install Docker in step 2.
3. Add an SSH key in hPanel → VPS → Settings → SSH keys.
4. In your DNS zone (Hostinger DNS or wherever the domain lives) create:
   - `A     @    <VPS IPv4>`
   - `A     www  <VPS IPv4>`
   - `AAAA` records too if hPanel shows an IPv6 address.

   Caddy will request the certificate on first start, so DNS must resolve to
   the VPS before you run the deploy.

## 2. Prepare the server (one time)

```bash
ssh root@<VPS IP>

# Updates + basic firewall
apt update && apt -y upgrade
ufw allow OpenSSH && ufw allow 80/tcp && ufw allow 443/tcp && ufw allow 443/udp
ufw --force enable

# Docker (skip if you used the "Ubuntu with Docker" template)
curl -fsSL https://get.docker.com | sh
docker compose version      # should print v2.x

# Swap (recommended on 4 GB plans)
fallocate -l 4G /swapfile && chmod 600 /swapfile && mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

## 3. Get the code onto the VPS

```bash
mkdir -p /opt && cd /opt
git clone https://github.com/alpeshbabu/sidecconsultH.git sidec
cd sidec
```

For a private repo, create a GitHub **deploy key** (`ssh-keygen -t ed25519`
on the VPS, add the public key under the repo's Settings → Deploy keys) and
clone over SSH instead.

## 4. Configure the environment

```bash
cp deploy/env.example .env
nano .env
```

Fill in every `CHANGE_ME`. Generate secrets with `openssl rand -base64 32`.
Things to get right:

- `SITE_DOMAIN` and the three URL variables (`AUTH_URL`, `NEXTAUTH_URL`,
  `NEXT_PUBLIC_APP_URL`) must all be your real domain with `https://`.
- `DATABASE_URL` must contain the same user / password / database as the
  `POSTGRES_*` lines and keep `@db:5432` as the host.
- `AUTH_TRUST_HOST=true` is required because the app sits behind Caddy.
- Copy `RESEND_*`, `OPENAI_API_KEY` and the `SUPABASE_*` values from your
  current Vercel project settings.

`.env` is git-ignored. Keep a copy somewhere safe.

## 5. First deploy

```bash
./deploy/deploy.sh --no-pull --seed
```

The script starts PostgreSQL, builds the migration image and applies all
Prisma migrations, seeds the admin user from `ADMIN_EMAIL` / `ADMIN_PASSWORD`,
builds the app image (this is the slow step, 5–10 minutes the first time),
then starts the app, Caddy and the cron container.

Check it:

```bash
docker compose ps                 # all services "running"/"healthy"
docker compose logs -f caddy      # watch the certificate being issued
curl -I https://<your domain>
```

Log in at `https://<your domain>/admin/login` with the admin credentials from
`.env`, then change the password from the profile page.

> **Skip `--seed` if you are importing your existing database** (next
> section). The seed resets the admin password and re-creates sample posts.

## 6. Move your existing data from Prisma Postgres

Your current data lives in Prisma Postgres (reached through Accelerate). Prisma
gives every database a direct TCP connection string: in
[console.prisma.io](https://console.prisma.io) open the project → Database →
**Connection strings → Direct connection** (starts with `postgres://`).

On the VPS:

```bash
cd /opt/sidec
set -a; source .env; set +a

# 1. Make sure the stack is stopped except the database
docker compose stop app cron

# 2. Dump from Prisma Postgres (pg_dump runs inside the db container)
docker compose exec -T db pg_dump "<DIRECT CONNECTION STRING>" \
  --no-owner --no-privileges --clean --if-exists > /tmp/prisma-postgres.sql

# 3. Load into the VPS database
docker compose exec -T db psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" < /tmp/prisma-postgres.sql

# 4. Confirm the migration history came across, then bring the app back
docker compose --profile tools run --rm migrate      # should say "No pending migrations"
docker compose up -d app cron
rm /tmp/prisma-postgres.sql
```

Blog images that were uploaded on Vercel were stored on its ephemeral disk and
are not recoverable from there; re-upload them from the admin panel if any are
missing.

## 7. Updating the site later

```bash
cd /opt/sidec && ./deploy/deploy.sh
```

That pulls `main`, applies any new migrations, rebuilds the image and
restarts the app with a few seconds of downtime. Roll back by checking out an
older commit and running `./deploy/deploy.sh --no-pull`.

## 8. Backups

`deploy/backup.sh` writes a compressed `pg_dump` and a tarball of uploaded
images to `/opt/sidec/backups/` and keeps 14 days. Schedule it:

```bash
crontab -e
# add:
30 2 * * * /opt/sidec/deploy/backup.sh >> /var/log/sidec-backup.log 2>&1
```

Also turn on Hostinger's own **VPS snapshots / weekly backups** in hPanel as a
second layer. To restore a dump, see the comment at the top of `backup.sh`.

## 9. Useful commands

```bash
docker compose logs -f app                    # application logs
docker compose exec db psql -U sidec -d sidec_consulting   # SQL shell
docker compose --profile tools run --rm migrate npx prisma studio --browser none  # then SSH-tunnel port 5555
docker compose restart app                    # restart only the app
docker compose down                           # stop everything (volumes are kept)
```

## 10. What changed in the code for this

- `lib/prisma-factory.ts` picks Prisma Accelerate when `DATABASE_URL` starts
  with `prisma+postgres://`, and the `@prisma/adapter-pg` driver adapter for a
  normal `postgresql://` URL. Local development keeps working unchanged.
- `next.config.ts` builds a standalone server bundle and traces the generated
  Prisma client (including its WASM engine) into it.
- `Dockerfile`, `docker-compose.yml`, `deploy/` hold the VPS stack; the
  `cron` container replaces the schedule that used to live in `vercel.json`.
