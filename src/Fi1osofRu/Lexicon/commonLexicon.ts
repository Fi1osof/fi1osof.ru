import { LexiconDict } from './index'

export const commonLexicon: LexiconDict = {
  ru: {
    'error.http': 'Ошибка HTTP: {{status}}',
    'error.noResponseBody': 'Нет тела ответа',
    'error.inAgent': 'Ошибка в {{nodeName}}',
    'error.unknown': 'Неизвестная ошибка',
    'error.somethingWentWrong':
      'Извините, что-то пошло не так. Попробуйте снова.',
    'chat.title': 'Fi1osof AI',
    'chat.subtitle': '',
    'chat.status': 'Онлайн',
    read: 'Читать',
    availability: {
      available: 'доступен для новых задач',
      limited: 'ограниченно доступен',
      busy: 'полностью занят',
    },
  },
  en: {
    'error.http': 'HTTP Error: {{status}}',
    'error.noResponseBody': 'No response body',
    'error.inAgent': 'Error in {{nodeName}}',
    'error.unknown': 'Unknown error',
    'error.somethingWentWrong':
      'Sorry, something went wrong. Please try again.',
    'chat.title': 'Fi1osof AI',
    'chat.subtitle': '',
    'chat.status': 'Online',
    read: 'Read',
    availability: {
      available: 'available for new tasks',
      limited: 'limited availability',
      busy: 'fully booked',
    },
  },
  vi: {
    'error.http': 'Lỗi HTTP: {{status}}',
    'error.noResponseBody': 'Không có nội dung phản hồi',
    'error.inAgent': 'Lỗi trong {{nodeName}}',
    'error.unknown': 'Lỗi không xác định',
    'error.somethingWentWrong': 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.',
    'chat.title': 'Fi1osof AI',
    'chat.subtitle': '',
    'chat.status': 'Trực tuyến',
    read: 'Đọc',
    availability: {
      available: 'có sẵn cho nhiệm vụ mới',
      limited: 'khả dụng hạn chế',
      busy: 'đã đầy lịch',
    },
  },
}
