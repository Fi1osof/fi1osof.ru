const ROBOT_PATTERNS: [RegExp, string][] = [
  [/googlebot/i, 'Googlebot'],
  [/bingbot/i, 'Bingbot'],
  [/yandex/i, 'YandexBot'],
  [/baiduspider/i, 'Baiduspider'],
  [/duckduckbot/i, 'DuckDuckBot'],
  [/slurp/i, 'Yahoo'],
  [/facebookexternalhit/i, 'Facebook'],
  [/twitterbot/i, 'Twitter'],
  [/linkedinbot/i, 'LinkedIn'],
  [/telegrambot/i, 'Telegram'],
  [/whatsapp/i, 'WhatsApp'],
  [/applebot/i, 'Applebot'],
  [/semrushbot/i, 'SemrushBot'],
  [/ahrefsbot/i, 'AhrefsBot'],
  [/mj12bot/i, 'MJ12bot'],
  [/dotbot/i, 'DotBot'],
  [/petalbot/i, 'PetalBot'],
  [/gptbot/i, 'GPTBot'],
  [/claudebot/i, 'ClaudeBot'],
  [/bytespider/i, 'Bytespider'],
]

export function detectRobot(
  userAgent: string | null | undefined,
): string | null {
  if (!userAgent) {
    return null
  }

  for (const [pattern, name] of ROBOT_PATTERNS) {
    if (pattern.test(userAgent)) {
      return name
    }
  }

  return null
}
