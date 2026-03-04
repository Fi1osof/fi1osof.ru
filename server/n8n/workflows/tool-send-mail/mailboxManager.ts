import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { execSync } from 'child_process'

const ACCOUNTS_FILE = 'postfix-accounts.cf'

function generateDovecotHash(password: string): string {
  const salt = crypto
    .randomBytes(12)
    .toString('base64')
    .replace(/[+/=]/g, '')
    .slice(0, 16)
  const hash = execSync(`openssl passwd -6 -salt '${salt}' '${password}'`, {
    encoding: 'utf-8',
  }).trim()
  return `{SHA512-CRYPT}${hash}`
}

export interface MailboxConfig {
  email: string
  password: string
}

export async function ensureMailbox(config: MailboxConfig): Promise<boolean> {
  const configPath = process.env.MAILSERVER_CONFIG_PATH
  if (!configPath) {
    console.warn(
      '[mailbox] MAILSERVER_CONFIG_PATH not set, skipping mailbox creation',
    )
    return false
  }

  const accountsPath = path.join(configPath, ACCOUNTS_FILE)

  if (!fs.existsSync(configPath)) {
    return false
  }

  let accounts = ''
  if (fs.existsSync(accountsPath)) {
    accounts = fs.readFileSync(accountsPath, 'utf-8')
  }

  const lines = accounts.split('\n').filter((line) => line.trim())
  const existingLine = lines.find((line) => line.startsWith(`${config.email}|`))

  if (existingLine) {
    return true
  }

  const hash = generateDovecotHash(config.password)
  const newLine = `${config.email}|${hash}`

  lines.push(newLine)
  fs.writeFileSync(accountsPath, lines.join('\n') + '\n')

  return true
}

export async function ensureMailboxes(configs: MailboxConfig[]): Promise<void> {
  for (const config of configs) {
    await ensureMailbox(config)
  }
}
