import { GraphQLError } from 'graphql'

function serviceError(message: string, code: string) {
  return new GraphQLError(`Центр агентов: ${message}`, {
    extensions: { code },
  })
}

export async function readStatisticsResponse(response: Response) {
  let result: unknown
  try {
    result = await response.json()
  } catch {
    throw serviceError(
      `получен ответ не в формате JSON (HTTP ${response.status}).`,
      'STATISTICS_INVALID_RESPONSE',
    )
  }

  if (result && typeof result === 'object' && 'errors' in result) {
    if (!Array.isArray(result.errors)) {
      throw serviceError(
        'некорректный список ошибок в ответе.',
        'STATISTICS_INVALID_RESPONSE',
      )
    }
    if (result.errors.length) {
      const messages: string[] = []
      let authenticationError = false
      for (const error of result.errors) {
        if (
          !error ||
          typeof error !== 'object' ||
          !('message' in error) ||
          typeof error.message !== 'string' ||
          !error.message.trim()
        ) {
          throw serviceError(
            'получена ошибка без текстового описания.',
            'STATISTICS_INVALID_RESPONSE',
          )
        }
        messages.push(error.message.trim())
        if (
          error.message === 'Valid MessageRecipient token required' ||
          ('extensions' in error &&
            error.extensions &&
            typeof error.extensions === 'object' &&
            'code' in error.extensions &&
            error.extensions.code === 'UNAUTHENTICATED')
        ) {
          authenticationError = true
        }
      }
      if (authenticationError) {
        throw serviceError(
          'токен интеграции отклонён. Проверьте AGENTS_CENTER_TOKEN: нужен действующий токен типа MessageRecipient.',
          'STATISTICS_AUTHENTICATION_FAILED',
        )
      }
      throw serviceError(messages.join('; '), 'STATISTICS_UPSTREAM_ERROR')
    }
  }
  if (!response.ok) {
    throw serviceError(
      `запрос отклонён (HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}).`,
      'STATISTICS_HTTP_ERROR',
    )
  }
  if (
    !result ||
    typeof result !== 'object' ||
    !('data' in result) ||
    !result.data ||
    typeof result.data !== 'object' ||
    !('recordStatistic' in result.data)
  ) {
    throw serviceError(
      'в ответе отсутствует data.recordStatistic.',
      'STATISTICS_INVALID_RESPONSE',
    )
  }
  const record = result.data.recordStatistic
  if (
    !record ||
    typeof record !== 'object' ||
    !('id' in record) ||
    typeof record.id !== 'string' ||
    !('rootId' in record) ||
    (record.rootId !== null && typeof record.rootId !== 'string') ||
    !('sequence' in record) ||
    typeof record.sequence !== 'string' ||
    !('type' in record) ||
    typeof record.type !== 'string' ||
    !('status' in record) ||
    typeof record.status !== 'string' ||
    !('userId' in record) ||
    (record.userId !== null && typeof record.userId !== 'string') ||
    !('data' in record)
  ) {
    throw serviceError(
      'поля сохранённого события имеют некорректный формат.',
      'STATISTICS_INVALID_RESPONSE',
    )
  }
  return {
    id: record.id,
    rootId: record.rootId,
    sequence: record.sequence,
    type: record.type,
    status: record.status,
    data: record.data,
    userId: record.userId,
  }
}

export async function requestStatistics(endpoint: string, init: RequestInit) {
  let response: Response
  try {
    response = await fetch(endpoint, init)
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === 'TimeoutError' || error.name === 'AbortError')
    ) {
      throw serviceError(
        'превышено время ожидания ответа (5 секунд).',
        'STATISTICS_TIMEOUT',
      )
    }
    throw serviceError(
      'не удалось подключиться к сервису статистики.',
      'STATISTICS_CONNECTION_FAILED',
    )
  }
  return readStatisticsResponse(response)
}
