import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { useSearchParams } from 'next/navigation'
import { TaskEditFormFi1osofRu } from '../Form'

export const TaskCreatePageFi1osofRu: Page = () => {
  const params = useSearchParams()

  const projectId = params.get('projectId')

  return (
    <>
      <SeoHeaders
        title="Create task"
        noindex
        nofollow
        canonical={undefined}
        siteOrigin={undefined}
      />

      <TaskEditFormFi1osofRu
        task={undefined}
        cancelHandler={undefined}
        parentId={undefined}
        projectId={projectId}
      />
    </>
  )
}
