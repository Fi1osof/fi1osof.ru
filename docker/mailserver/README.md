# Mail Server

Docker-mailserver configuration for the platform.

## Quick Start

1. Configure `.env`:
   ```bash
   MAIL_HOSTNAME=mail.example.com
   MAIL_DOMAIN=example.com
   # Dev: MAIL_RELAY_HOST=[mailhog]:1025
   # Prod: leave empty for direct delivery
   ```

2. Start the mailserver:
   ```bash
   docker compose up -d mailserver
   ```

3. Add an email account:
   ```bash
   ./mailserver/setup.sh email add user@example.com
   ```

4. Generate DKIM keys (requires account first):
   ```bash
   ./mailserver/setup.sh config dkim
   ```

5. Configure DNS records (see below)

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

# Test sending (inside container)
swaks --to test@example.com --from user@domain.com --server localhost:587 \
  --auth LOGIN --auth-user user@domain.com --auth-password 'password' \
  --header "Subject: Test" --body "Test message"

# Check mail queue
postqueue -p

# Clear mail queue
postsuper -d ALL
```

## DNS Records

For each domain, add these DNS records:

| Type | Name | Value |
|------|------|-------|
| MX | @ | mail.yourdomain.com (priority 10) |
| A | mail | YOUR_SERVER_IP |
| TXT | @ | v=spf1 mx ip4:SERVER_IP -all |
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

## Testing with Attachments

### Send Test Email

```bash
# Via mailserver (to IMAP)
./project/tasks/006--mailserver/scripts/send-test-mail.sh

# Directly to MailHog (for debugging)
./project/tasks/006--mailserver/scripts/send-to-mailhog.sh
```

### swaks Attachment Syntax

**Important:** Use `@` before file path to send file content:

```bash
# Wrong — sends path as text
swaks --attach /tmp/file.txt

# Correct — sends file content
swaks --attach @/tmp/file.txt
```

### Verify Email Content

```bash
# Check stored emails in mailbox
cat ./mailserver/mail-data/domain/user/cur/* | tail -30

# Decode base64 attachment
echo "BASE64_STRING" | base64 -d
```

## Troubleshooting

### Recipient address rejected

```
550 5.1.1 <user@domain>: Recipient address rejected: User unknown
```

**Cause:** `MAIL_HOSTNAME` equals `MAIL_DOMAIN`, causing Postfix conflict.

**Solution:** Use subdomain for hostname:
```bash
MAIL_HOSTNAME=mail.example.com
MAIL_DOMAIN=example.com
```

### Attachment contains path instead of data

**Symptom:** Saved attachment file contains `/tmp/filename.txt` instead of actual content.

**Cause:** swaks without `@` prefix sends path as text.

**Solution:** Add `@` before path: `--attach @/tmp/file.txt`

### n8n cannot read binary data

**Symptom:** `item.binary[key].data` returns `"filesystem-v2"` instead of content.

**Cause:** n8n stores binary data internally, not in the object.

**Solution:** Use n8n helper:
```javascript
const buffer = await this.helpers.getBinaryDataBuffer(itemIndex, binaryKey)
```
