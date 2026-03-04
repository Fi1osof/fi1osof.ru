# Mail Server

Docker-mailserver configuration for the platform.

## Quick Start

1. Start the mailserver:
   ```bash
   docker compose up -d mailserver
   ```

2. Add an email account:
   ```bash
   ./mailserver/setup.sh email add user@example.com
   ```

3. Generate DKIM keys:
   ```bash
   ./mailserver/setup.sh config dkim
   ```

4. Configure DNS records (see below)

## Directory Structure

```
mailserver/
├── config/           # docker-mailserver config files
│   ├── postfix-accounts.cf   # Email accounts (auto-generated)
│   ├── postfix-virtual.cf    # Email aliases
│   └── opendkim/keys/        # DKIM keys per domain
├── mail-data/        # Maildir storage (gitignored)
├── mail-state/       # Service state (gitignored)
├── mail-logs/        # Mail logs (gitignored)
├── setup.sh          # Management script
└── README.md
```

## Commands

```bash
# Email accounts
./mailserver/setup.sh email add user@domain.com
./mailserver/setup.sh email del user@domain.com
./mailserver/setup.sh email list

# Aliases
./mailserver/setup.sh alias add alias@domain.com target@domain.com
./mailserver/setup.sh alias list

# DKIM
./mailserver/setup.sh config dkim
```

## DNS Records

For each domain, add these DNS records:

| Type | Name | Value |
|------|------|-------|
| MX | @ | mail.yourdomain.com (priority 10) |
| A | mail | YOUR_SERVER_IP |
| TXT | @ | v=spf1 mx -all |
| TXT | _dmarc | v=DMARC1; p=quarantine; rua=mailto:postmaster@yourdomain.com |
| TXT | mail._domainkey | (from DKIM key generation) |

## MODX Configuration

In MODX admin (System → System Settings):

| Setting | Value |
|---------|-------|
| `mail_use_smtp` | Yes |
| `mail_smtp_hosts` | mailserver |
| `mail_smtp_port` | 587 |
| `mail_smtp_user` | user@domain.com |
| `mail_smtp_pass` | (password) |

## Ports

| Port | Protocol | Description |
|------|----------|-------------|
| 25 | SMTP | Incoming mail (MX) |
| 465 | SMTPS | Outgoing (SSL) |
| 587 | SMTP | Outgoing (STARTTLS) |
| 143 | IMAP | Reading mail |
| 993 | IMAPS | Reading mail (SSL) |

Dev environment uses non-standard ports: 1025, 1465, 1587, 1143.
