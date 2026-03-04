# Mail Server

Documentation for the mail server integration.

## Overview

The project uses [docker-mailserver](https://docker-mailserver.github.io/docker-mailserver/latest/) for email functionality. This enables agents to send and receive emails.

## Current Status

### Done

- **Docker container configured** — `mailserver` service in `docker/docker-compose.yml`
- **Send Mail tool created** — `server/n8n/workflows/tool-send-mail/`
- **Check Mail tool created** — `server/n8n/workflows/tool-check-mail/`
- **Agent factory integration** — `canSendMail`, `canCheckMail` flags with SMTP/IMAP credentials
- **Automatic mailbox creation** — `ensureMailbox()` creates accounts in `postfix-accounts.cf`
- **SMTP/IMAP credentials in n8n** — credentials passed via `AgentWorkflowFactory`

### Pending

- **Mark as read** — mark emails as read after processing (future)

## Configuration

### Environment Variables

Located in `docker/.env`:

```bash
## Mail Server (docker-mailserver)
# Send-only mode (no accounts required, no IMAP/POP3)
MAIL_SMTP_ONLY=1
# Allow sending from docker network without auth
MAIL_PERMIT_DOCKER=connected-networks

# Path to mailserver config directory
# Docker: /app/mailserver-config (default, mounted via docker-compose)
# Local: ./docker/mailserver/config
MAILSERVER_CONFIG_PATH=/app/mailserver-config

# Optional settings:
# MAIL_HOSTNAME=mail.example.com       # FQDN for the mail server
# MAIL_DOMAIN=example.com              # Primary mail domain
# MAIL_SSL_TYPE=letsencrypt            # SSL type: letsencrypt, manual, self-signed
# DEFAULT_RELAY_HOST=[mailhog]:1025    # Relay for dev (mailhog)
```

### Full Mode (Default)

With `MAIL_SMTP_ONLY=0`:
- Mail accounts required for sending/receiving
- Dovecot (IMAP/POP3) enabled
- Agents can send and check their mailbox

### Send-Only Mode

With `MAIL_SMTP_ONLY=1`:
- No mail accounts required
- Dovecot (IMAP/POP3) is disabled
- Container starts without user provisioning

### Network Access

To allow sending from docker containers and host machine, copy the sample config:

```bash
cd docker/mailserver
cp config/postfix-main.cf.sample config/postfix-main.cf
```

The sample allows all private networks (172.x, 192.168.x, 10.x). Adjust `mynetworks` in the file if needed.

### Docker Services

- **mailserver** — SMTP server (send-only by default)
- **mailhog** — Dev mail catcher (no auth, web UI at port 8025)

### Full Mode (with accounts)

To enable receiving mail (IMAP), set `MAIL_SMTP_ONLY=0` and create accounts:

```bash
cd docker
./mailserver/setup.sh email add user@example.com
```

## Agent Integration

### Factory Config

In `AgentFactoryConfig`:

```typescript
{
  canSendMail: true,
  canCheckMail: true,
  smtp: {
    credentialId: 'your-smtp-credential-id',
    credentialName: 'SMTP Credential Name',
    email: 'agent@domain.com',
    password: 'password',
  },
  imap: {
    credentialId: 'your-imap-credential-id',
    credentialName: 'IMAP Credential Name',
  },
}
```

## Automatic Mailbox Creation

When an agent has SMTP credentials with a password, `ensureMailbox()` automatically creates a mailbox account:

1. Agent config includes `smtp.password`
2. `createToolSendMail()` calls `ensureMailbox()`
3. Account is added to `postfix-accounts.cf`

Location: `server/n8n/workflows/tool-send-mail/mailboxManager.ts`

The path to config is controlled by `MAILSERVER_CONFIG_PATH` env var:
- **Docker**: `/app/mailserver-config` (mounted from `docker/mailserver/config`)
- **Local**: `./docker/mailserver/config`

## Files

- `docker/docker-compose.yml` — mailserver container config
- `docker/mailserver/config/` — postfix/dovecot configs (gitignored, use .sample)
- `docker/mailserver/config/postfix-accounts.cf` — email accounts (auto-generated)
- `docker/mailserver/setup.sh` — management script for accounts/DKIM
- `server/n8n/workflows/tool-send-mail/` — send mail workflow factory
- `server/n8n/workflows/tool-check-mail/` — check mail workflow factory
- `server/n8n/workflows/tool-send-mail/mailboxManager.ts` — automatic mailbox creation
- `server/n8n/workflows/agent-factory/tools/sendMail/` — send mail tool node
- `server/n8n/workflows/agent-factory/tools/checkMail/` — check mail tool node

## Next Steps

1. Create SMTP/IMAP credentials in n8n bootstrap (`server/n8n/bootstrap/`)
2. Test sending via mailhog (dev) or real mailserver (prod)
3. Add mark-as-read functionality (future)
