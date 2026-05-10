import { test, expect } from '@playwright/test'

const PAGES = ['/']

for (const path of PAGES) {
  test(`no console / page errors on ${path}`, async ({ page }) => {
    const consoleErrors: string[] = []
    const pageErrors: string[] = []

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(`[console.error] ${msg.text()}`)
      }
    })

    page.on('pageerror', (err) => {
      pageErrors.push(
        `[pageerror] ${err.name}: ${err.message}\n${err.stack ?? ''}`,
      )
    })

    const response = await page.goto(path, { waitUntil: 'networkidle' })
    expect(response, 'no response').toBeTruthy()
    expect(response?.ok(), `bad status: ${response?.status()}`).toBeTruthy()

    // give the page a moment for late async errors
    await page.waitForTimeout(1000)

    const all = [...pageErrors, ...consoleErrors]
    if (all.length) {
      // eslint-disable-next-line no-console
      console.log(
        '\n--- Browser errors on ' + path + ' ---\n' + all.join('\n\n'),
      )
    }
    expect(all, 'browser reported errors').toEqual([])
  })
}
