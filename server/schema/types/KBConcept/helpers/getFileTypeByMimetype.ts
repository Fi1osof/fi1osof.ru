export const getFileTypeByMimetype = (mimetype: string): string | null => {
  const mime = mimetype.toLowerCase()

  switch (true) {
    case mime.startsWith('image/'):
      return 'file:image'
    case mime.startsWith('video/'):
      return 'file:video'
    case mime.startsWith('audio/'):
      return 'file:audio'
    case mime === 'application/pdf':
      return 'file:pdf'
    case [
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.oasis.opendocument.text',
      'application/vnd.oasis.opendocument.spreadsheet',
      'application/vnd.oasis.opendocument.presentation',
      'application/rtf',
      'text/rtf',
    ].includes(mime):
      return 'file:document'
    case [
      'application/zip',
      'application/x-zip-compressed',
      'application/x-rar-compressed',
      'application/x-7z-compressed',
      'application/x-tar',
      'application/gzip',
      'application/x-gzip',
      'application/x-bzip2',
      'application/x-bzip',
      'application/x-zip',
      'application/vnd.rar',
    ].includes(mime):
      return 'file:archive'
    case [
      'application/javascript',
      'application/json',
      'application/xml',
      'application/x-sh',
      'application/x-httpd-php',
      'application/x-yaml',
      'text/x-python',
      'text/x-c',
      'text/x-c++',
      'text/x-java-source',
      'text/x-script',
      'text/css',
      'text/html',
      'text/javascript',
      'text/xml',
    ].includes(mime):
      return 'file:code'
    case mime.startsWith('text/'):
      return 'file:text'
    default:
      return 'file:unknown'
  }
}
