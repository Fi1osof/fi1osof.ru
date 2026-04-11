import Head from 'next/head'
import { SchemaType } from './types'
import { useMemo } from 'react'

interface JsonLdProps {
  data: SchemaType | SchemaType[]
}

const escapeJsonLd = (json: string): string => {
  return json.replace(/<\/script/gi, '<\\/script')
}

export const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
  const schemas = useMemo<React.ReactNode[]>(() => {
    const schemas = Array.isArray(data) ? data : [data]

    return schemas.map((schema, index) => (
      <Head
        // eslint-disable-next-line react/no-array-index-key
        key={index}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: escapeJsonLd(JSON.stringify(schema)),
          }}
        />
      </Head>
    ))
  }, [data])

  return schemas
}
