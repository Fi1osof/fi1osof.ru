import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { Page } from '../../_App/interfaces'
import { useFileQuery } from 'src/gql/generated'
import { useAppContext } from 'src/components/AppContext'
import { useParams } from 'next/navigation'
import { FileView } from './View'

export const FilePage: Page = () => {
  const params = useParams()

  const id = typeof params.id === 'string' ? params.id : undefined

  const { user: currentUser } = useAppContext()

  const response = useFileQuery({
    skip: !currentUser?.sudo,
    variables: {
      where: {
        id,
      },
    },
  })

  const file = response.data?.file

  return (
    <>
      <SeoHeaders
        title={file?.name ?? 'File'}
        nofollow
        noindex
        canonical={undefined}
        siteOrigin={undefined}
      />

      {file && <FileView file={file} currentUser={currentUser} />}
    </>
  )
}
