import { describe, expect, it } from 'vitest'
import { readStatisticsResponse } from '../../../../server/schema/types/Custom/Statistics/response'

const response = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status })

describe('statistics service response', () => {
  it('explains a rejected MessageRecipient token', async () => {
    await expect(
      readStatisticsResponse(
        response({
          errors: [
            {
              message: 'Valid MessageRecipient token required',
              extensions: { code: 'UNAUTHENTICATED' },
            },
          ],
          data: null,
        }),
      ),
    ).rejects.toMatchObject({
      message: expect.stringContaining('AGENTS_CENTER_TOKEN'),
      extensions: { code: 'STATISTICS_AUTHENTICATION_FAILED' },
    })
  })
  it('preserves the upstream error messages', async () => {
    await expect(
      readStatisticsResponse(
        response(
          { errors: [{ message: 'First error' }, { message: 'Second error' }] },
          400,
        ),
      ),
    ).rejects.toThrow('First error; Second error')
  })
  it('validates malformed errors and missing records', async () => {
    for (const body of [
      { errors: [null] },
      { errors: [{ message: 3 }] },
      { errors: 'failed' },
      { data: null },
    ]) {
      await expect(
        readStatisticsResponse(response(body)),
      ).rejects.toMatchObject({
        extensions: { code: 'STATISTICS_INVALID_RESPONSE' },
      })
    }
  })
  it('distinguishes HTTP and non-JSON responses', async () => {
    await expect(readStatisticsResponse(response({}, 503))).rejects.toThrow(
      'HTTP 503',
    )
    await expect(
      readStatisticsResponse(
        new Response('<html>Error</html>', { status: 502 }),
      ),
    ).rejects.toThrow('не в формате JSON (HTTP 502)')
  })
  it('accepts an empty errors array and a valid saved record', async () => {
    const record = {
      id: '1',
      rootId: null,
      sequence: '1',
      type: 'visitor.events',
      status: 'success',
      data: {},
      userId: 'site',
    }
    await expect(
      readStatisticsResponse(
        response({ errors: [], data: { recordStatistic: record } }),
      ),
    ).resolves.toEqual(record)
  })
})
