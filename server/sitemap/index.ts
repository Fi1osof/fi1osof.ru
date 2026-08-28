import {
  KBConcept,
  KBConceptVisibility,
  Prisma,
  UserStatus,
} from '@prisma/client'
import { Request, Response } from 'express'
import { prismaClient } from 'server/prisma'
import { buildPostWhere } from 'server/schema/types/Post/helpers/buildPostWhere'
import { buildUserWhere } from 'server/schema/types/User/helpers/buildUserWhere'
import { createConceptLink } from 'src/components/Link/Concept'
import { getLocaleFromRequest } from 'server/helpers/getLocaleFromRequest'
import { LOCALE_CODES as allLocales } from 'src/Fi1osofRu/components/LocaleSwitcher/interfaces'
import { createTaskLink } from 'src/components/Link/Task'

const intLocales = allLocales.toSorted((a, b) => {
  if (a === b) {
    return 0
  }
  if (b === 'ru') {
    return +1
  }
  if (a === 'ru') {
    return -1
  }

  return a.charCodeAt(0) - b.charCodeAt(0)
})

const getLocalePrefix = (locale: string): string => {
  return locale !== 'ru' ? `/${locale}` : ''
}

const generateHreflangLinks = (
  siteOrigin: string,
  url: string,
  defaultLocale: string,
): string => {
  let links = ''
  const defaultPrefix = getLocalePrefix(defaultLocale)

  links += `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteOrigin}${defaultPrefix}${url}" />\n`
  for (const code of intLocales) {
    const prefix = getLocalePrefix(code)
    links += `    <xhtml:link rel="alternate" hreflang="${code}" href="${siteOrigin}${prefix}${url}" />\n`
  }

  return links
}

function prepareLatsMod(value: string | Date) {
  return new Date(value).toISOString()
}

const generateUrlBlocks = (
  siteOrigin: string,
  item: UrlItem,
  priority: number,
): string => {
  let xml = ''
  for (const localeCode of intLocales) {
    const locPrefix = getLocalePrefix(localeCode)

    xml += '  <url>\n'
    xml += `    <loc>${siteOrigin}${locPrefix}${item.url}</loc>\n`
    xml += `    <lastmod>${prepareLatsMod(item.updatedAt)}</lastmod>\n`
    xml += `    <priority>${priority}</priority>\n`
    xml += generateHreflangLinks(siteOrigin, item.url, 'ru')
    xml += '  </url>\n'
  }
  return xml
}

export enum SitemapSection {
  index = '/sitemap.xml',
  main = '/sitemap/main.xml',
  concepts = '/sitemap/concepts.xml',
  projects = '/sitemap/projects.xml',
  tasks = '/sitemap/tasks.xml',
  worklogs = '/sitemap/worklogs.xml',

  posts = '/sitemap/posts.xml',
  users = '/sitemap/users.xml',
}

async function getKbConcepts(): Promise<UrlItem[]> {
  const concepts = await prismaClient.$queryRaw<
    Pick<KBConcept, 'id' | 'uri' | 'updatedAt'>[]
  >`
    SELECT id, uri, "updatedAt" FROM "KBConcept" 
    WHERE visibility = ${Prisma.raw(`'${KBConceptVisibility.public}'`)} AND "en" IS NOT NULL AND uri IS NOT NULL
    ORDER BY "updatedAt" DESC
  `

  return concepts
    .filter((n) => !!n.uri)
    .map((n) => ({
      updatedAt: new Date(n.updatedAt).toISOString(),
      url: createConceptLink(n),
    }))
}

type UrlItem = {
  url: string
  updatedAt: Date | string
}

type SitemapGeneratorProps = {
  siteOrigin: string
}

const generateSitemapXML = (
  items: UrlItem[],
  {
    siteOrigin,
    priority = 0.9,
  }: SitemapGeneratorProps & {
    priority?: number
    locale?: string
  },
): string => {
  const isInternational = true

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"'
  if (isInternational) {
    xml += ' xmlns:xhtml="http://www.w3.org/1999/xhtml"'
  }
  xml += '>\n'

  items.forEach((item) => {
    if (isInternational) {
      xml += generateUrlBlocks(siteOrigin, item, priority)
    } else {
      xml += '  <url>\n'
      xml += `    <loc>${siteOrigin}${item.url}</loc>\n`
      xml += `    <lastmod>${prepareLatsMod(item.updatedAt)}</lastmod>\n`
      xml += `    <priority>${priority}</priority>\n`
      xml += '  </url>\n'
    }
  })

  xml += '</urlset>'
  return xml
}

const generateSitemapIndex = async ({
  siteOrigin,
}: SitemapGeneratorProps): Promise<string> => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    <sitemap>
        <loc>${siteOrigin}/sitemap/main.xml</loc>
    </sitemap>
    <sitemap>
        <loc>${siteOrigin}${SitemapSection.concepts}</loc>
    </sitemap>
    <sitemap>
        <loc>${siteOrigin}${SitemapSection.projects}</loc>
    </sitemap>
    <sitemap>
        <loc>${siteOrigin}${SitemapSection.tasks}</loc>
    </sitemap>
    <sitemap>
        <loc>${siteOrigin}${SitemapSection.worklogs}</loc>
    </sitemap>
</sitemapindex>`
}

const generateSitemapMain = async (
  props: SitemapGeneratorProps,
): Promise<string> => {
  const now = new Date()
  const dayOfWeek = now.getDay()
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1
  const monday = new Date(now)
  monday.setDate(now.getDate() - diffToMonday)

  const xmlData: UrlItem[] = [
    {
      url: `/`,
      updatedAt: monday.toISOString().split('T')[0],
    },
    {
      url: `/concepts`,
      updatedAt: monday.toISOString().split('T')[0],
    },
    {
      url: `/projects`,
      updatedAt: monday.toISOString().split('T')[0],
    },
    {
      url: `/tasks`,
      updatedAt: monday.toISOString().split('T')[0],
    },
    {
      url: `/worklogs`,
      updatedAt: monday.toISOString().split('T')[0],
    },
    {
      url: `/about`,
      updatedAt: monday.toISOString().split('T')[0],
    },
  ]

  return generateSitemapXML(xmlData, props)
}

const generateSitemapConcepts = async (
  props: SitemapGeneratorProps,
): Promise<string> => {
  const xmlData: UrlItem[] = await getKbConcepts()

  return generateSitemapXML(xmlData, props)
}

const generateSitemapProjects = async (
  props: SitemapGeneratorProps,
): Promise<string> => {
  const xmlData: UrlItem[] = await prismaClient.project
    .findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })
    .then((r) => {
      return r.map<UrlItem>((n) => {
        return {
          ...n,
          url: `/projects/${n.id}`,
        }
      })
    })

  return generateSitemapXML(xmlData, props)
}

const generateSitemapTasks = async (
  props: SitemapGeneratorProps,
): Promise<string> => {
  const xmlData: UrlItem[] = await prismaClient.task
    .findMany({
      orderBy: {
        updatedAt: 'desc',
      },
    })
    .then((r) => {
      return r.map<UrlItem>((n) => {
        return {
          ...n,
          url: createTaskLink(n),
        }
      })
    })

  return generateSitemapXML(xmlData, props)
}

const generateSitemapWorkLogs = async (
  props: SitemapGeneratorProps,
): Promise<string> => {
  const xmlData: UrlItem[] = await prismaClient.taskWorkLog
    .findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })
    .then((r) => {
      return r.map<UrlItem>((n) => {
        return {
          ...n,
          url: `/worklogs/${n.id}`,
          updatedAt: n.createdAt,
        }
      })
    })

  return generateSitemapXML(xmlData, props)
}

const postsWhere = buildPostWhere(
  {
    status: 'published',
  },
  undefined,
)

export const generateSitemapPosts = async (
  props: SitemapGeneratorProps,
): Promise<string> => {
  const posts = await prismaClient.post.findMany({
    where: postsWhere,
    orderBy: {
      createdAt: 'asc',
    },
  })

  const xmlData: UrlItem[] = posts.map((n) => {
    const { id, updatedAt } = n

    const uri = `/posts/${id}`

    return {
      url: `/${(uri ?? '').replaceAll(/^\/+|\/+$/g, '')}`,
      updatedAt: updatedAt.toISOString(),
    }
  })

  return generateSitemapXML(xmlData, props)
}

const usersWhere = buildUserWhere(
  {
    status: UserStatus.active,
  },
  undefined,
)

export const generateSitemapUsers = async (
  props: SitemapGeneratorProps,
): Promise<string> => {
  const posts = await prismaClient.user.findMany({
    where: usersWhere,
    orderBy: {
      createdAt: 'asc',
    },
  })

  const xmlData: UrlItem[] = posts.map((n) => {
    const { id, updatedAt } = n

    const uri = `/users/${id}`

    return {
      url: `/${(uri ?? '').replaceAll(/^\/+|\/+$/g, '')}`,
      updatedAt: updatedAt.toISOString(),
    }
  })

  return generateSitemapXML(xmlData, props)
}

export const generateSitemap = async (req: Request, res: Response) => {
  const locale = getLocaleFromRequest(req)

  res.header('Content-Type', 'application/xml')

  const siteOrigin = `${req.protocol}://${req.headers.host}`

  const props = { siteOrigin, locale }

  switch (req.url) {
    case SitemapSection.concepts:
      res.send(await generateSitemapConcepts(props))
      break

    case SitemapSection.projects:
      res.send(await generateSitemapProjects(props))
      break

    case SitemapSection.tasks:
      res.send(await generateSitemapTasks(props))
      break

    case SitemapSection.worklogs:
      res.send(await generateSitemapWorkLogs(props))
      break

    case SitemapSection.index:
      res.send(await generateSitemapIndex(props))
      break
    case SitemapSection.main:
      res.send(await generateSitemapMain(props))
      break
    case SitemapSection.posts:
      res.send(await generateSitemapPosts({ siteOrigin }))
      break
    case SitemapSection.users:
      res.send(await generateSitemapUsers({ siteOrigin }))
      break
    default:
      res.status(404).send('Not found')
  }
}
