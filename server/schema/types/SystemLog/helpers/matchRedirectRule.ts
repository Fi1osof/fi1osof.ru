import { RedirectRule } from '@prisma/client'

export function matchRedirectRule(
  path: string,
  rules: RedirectRule[],
): { rule: RedirectRule; redirectTo: string } | null {
  for (const rule of rules) {
    let match: RegExpMatchArray | null = null

    switch (rule.patternType) {
      case 'exact':
        if (path === rule.pattern) {
          return { rule, redirectTo: rule.replacement }
        }
        break

      case 'prefix':
        if (path.startsWith(rule.pattern)) {
          const suffix = path.slice(rule.pattern.length)
          return { rule, redirectTo: rule.replacement + suffix }
        }
        break

      case 'regex':
        {
          const regex = new RegExp(rule.pattern)
          match = path.match(regex)
          if (match) {
            let redirectTo = rule.replacement
            for (let i = 1; i < match.length; i++) {
              redirectTo = redirectTo.replace(
                new RegExp(`\\$${i}`, 'g'),
                match[i] || '',
              )
            }
            return { rule, redirectTo }
          }
        }
        break
    }
  }

  return null
}
