export const isImageMimetype = (
  mimetype: string | null | undefined,
): boolean => {
  return mimetype?.startsWith('image/') ?? false
}

type IconComponent = React.FC

const PdfIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <path d="M10 12h4" />
    <path d="M10 16h4" />
  </svg>
)

const WordIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="16" y2="17" />
  </svg>
)

const ExcelIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <rect x="8" y="12" width="8" height="6" />
    <line x1="12" y1="12" x2="12" y2="18" />
    <line x1="8" y1="15" x2="16" y2="15" />
  </svg>
)

const PresentationIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <rect x="8" y="12" width="8" height="5" rx="1" />
  </svg>
)

const ArchiveIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 8v13H3V8" />
    <path d="M1 3h22v5H1z" />
    <path d="M10 12h4" />
  </svg>
)

const VideoIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polygon points="10 9 15 12 10 15 10 9" />
  </svg>
)

const AudioIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
)

const TextIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="8" y1="13" x2="16" y2="13" />
    <line x1="8" y1="17" x2="12" y2="17" />
  </svg>
)

const CodeIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

const DefaultFileIcon: IconComponent = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)

const getExtension = (path: string): string | null => {
  const match = path.match(/\.([a-zA-Z0-9]+)$/)
  return match ? match[1].toLowerCase() : null
}

const getFileIconByExtension = (ext: string | null): IconComponent | null => {
  if (!ext) {
    return null
  }

  const extensionMap: Record<string, IconComponent> = {
    pdf: PdfIcon,
    doc: WordIcon,
    docx: WordIcon,
    xls: ExcelIcon,
    xlsx: ExcelIcon,
    ppt: PresentationIcon,
    pptx: PresentationIcon,
    zip: ArchiveIcon,
    rar: ArchiveIcon,
    '7z': ArchiveIcon,
    gz: ArchiveIcon,
    tar: ArchiveIcon,
    mp4: VideoIcon,
    avi: VideoIcon,
    mkv: VideoIcon,
    mov: VideoIcon,
    webm: VideoIcon,
    mp3: AudioIcon,
    wav: AudioIcon,
    ogg: AudioIcon,
    flac: AudioIcon,
    txt: TextIcon,
    md: TextIcon,
    rtf: TextIcon,
    js: CodeIcon,
    ts: CodeIcon,
    jsx: CodeIcon,
    tsx: CodeIcon,
    json: CodeIcon,
    xml: CodeIcon,
    html: CodeIcon,
    css: CodeIcon,
    py: CodeIcon,
    sh: CodeIcon,
  }

  return extensionMap[ext] ?? null
}

export const getFileIcon = (
  mimetype: string | null | undefined,
  path?: string,
): IconComponent => {
  if (!mimetype || mimetype === 'application/octet-stream') {
    const ext = path ? getExtension(path) : null
    return getFileIconByExtension(ext) ?? DefaultFileIcon
  }

  if (mimetype === 'application/pdf') {
    return PdfIcon
  }

  if (
    mimetype === 'application/msword' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    return WordIcon
  }

  if (
    mimetype === 'application/vnd.ms-excel' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ) {
    return ExcelIcon
  }

  if (
    mimetype === 'application/vnd.ms-powerpoint' ||
    mimetype ===
      'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ) {
    return PresentationIcon
  }

  if (
    mimetype === 'application/zip' ||
    mimetype === 'application/x-rar-compressed' ||
    mimetype === 'application/x-7z-compressed' ||
    mimetype === 'application/gzip' ||
    mimetype === 'application/x-tar'
  ) {
    return ArchiveIcon
  }

  if (mimetype.startsWith('video/')) {
    return VideoIcon
  }

  if (mimetype.startsWith('audio/')) {
    return AudioIcon
  }

  if (mimetype.startsWith('text/')) {
    return TextIcon
  }

  if (
    mimetype === 'application/javascript' ||
    mimetype === 'application/json' ||
    mimetype === 'application/xml' ||
    mimetype === 'application/x-sh'
  ) {
    return CodeIcon
  }

  return DefaultFileIcon
}
