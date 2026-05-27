# Traefik Configuration

## Structure

```
traefik/
├── traefik.yml              # Local development config (HTTP only)
├── traefik.prod.yml         # Production config (HTTPS + Let's Encrypt) - gitignored
├── traefik.prod.example.yml # Example for production config
├── dynamic/
│   ├── local/               # Dynamic routing for local development
│   │   └── app.yml
│   └── prod/                # Dynamic routing for production
│       └── app.yml
├── certs/                   # SSL certificates (gitignored)
├── logs/                    # Traefik logs (gitignored)
└── auth/                    # Auth files (gitignored)

../varnish/
├── default.vcl              # Varnish cache configuration
└── .gitignore
```

## Varnish Cache

Static assets (js, css, fonts, images) are cached via Varnish for better performance.

**Routing**: Traefik routes static files to Varnish using `PathRegexp`:
```yaml
static:
  rule: 'PathRegexp(`^.*\.(js|css|woff2?|ttf|eot|svg|ico|png|jpg|jpeg|gif|webp|avif)$`)'
  service: varnish
```

**Cache features**:
- 7-day TTL for static assets
- Per-host cache isolation (multi-domain support)
- Cookies stripped from static requests
- `X-Cache` header shows HIT/MISS status

**Disable caching** for specific files by setting `Cache-Control: no-store` in your app.

## Configuration

### Local Development

Uses `traefik.yml` by default (HTTP on port 80).

### Production

1. Copy example to create production config:
   ```bash
   cp traefik.prod.example.yml traefik.prod.yml
   ```

2. Edit `traefik.prod.yml` and set your email for Let's Encrypt:
   ```yaml
   certificatesResolvers:
     letsencrypt:
       acme:
         email: your-email@example.com
   ```

3. Create `acme.json` with correct permissions:
   ```bash
   touch certs/acme.json
   chmod 600 certs/acme.json
   ```

4. Set environment variables in `.env`:
   ```
   TRAEFIK_STATIC_CONFIG=./traefik/traefik.prod.yml
   TRAEFIK_DYNAMIC_DIR=./traefik/dynamic/prod
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `TRAEFIK_STATIC_CONFIG` | `./traefik/traefik.yml` | Path to static Traefik config |
| `TRAEFIK_DYNAMIC_DIR` | `./traefik/dynamic/local` | Directory with dynamic routing configs |
| `ACME_EMAIL` | - | Email for Let's Encrypt notifications |
