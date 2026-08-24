import { LexiconDict } from 'src/Fi1osofRu/Lexicon'

export const chatLexicon: LexiconDict = {
  en: {
    chat: {
      welcomeTitle: 'Hello! How can I help?',
      welcomeText: 'Ask anything',
      placeholder: 'Type your message...',
    },
    error: {
      unknown: 'Unknown error',
      somethingWentWrong: 'Sorry, something went wrong. Please try again.',
    },
  },
  ru: {
    chat: {
      welcomeTitle: 'Привет! Чем могу помочь?',
      welcomeText: 'Спросите что угодно',
      placeholder: 'Введите ваше сообщение...',
    },
    error: {
      unknown: 'Неизвестная ошибка',
      somethingWentWrong: 'Извините, что-то пошло не так. Попробуйте снова.',
    },
  },
  vi: {
    chat: {
      welcomeTitle: 'Xin chào! Tôi có thể giúp gì?',
      welcomeText: 'Hỏi bất cứ điều gì',
      placeholder: 'Nhập tin nhắn của bạn...',
    },
    error: {
      unknown: 'Lỗi không xác định',
      somethingWentWrong: 'Xin lỗi, đã xảy ra lỗi. Vui lòng thử lại.',
    },
  },
}
