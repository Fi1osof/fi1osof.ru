export interface SmtpConfig {
  credentialId: string
  credentialName: string
  user: string
  password: string
  host: string
  port: number
  ssl?: boolean
  disableStartTls?: boolean
}

export interface ImapConfig {
  credentialId: string
  credentialName: string
  user: string
  password: string
  host: string
  port: number
  secure?: boolean
}

export interface AgentCredentials {
  agentName: string
  username: string
  password: string
  email?: string
  fullname?: string
  smtp?: SmtpConfig
  imap?: ImapConfig
}
