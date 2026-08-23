import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { TaskEditForm } from '../Form'

export const TaskCreatePage: Page = () => {
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
      />
    </>
  )
}
