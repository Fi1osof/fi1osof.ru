import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { TaskEditForm } from '../Form'
import { useSearchParams } from 'next/navigation'

export const TaskCreatePage: Page = () => {
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

      <TaskEditForm
        task={undefined}
        cancelHandler={undefined}
        parentId={undefined}
        projectId={projectId}
      />
    </>
  )
}
