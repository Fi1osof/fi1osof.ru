import { Page } from 'src/components/pages/_App/interfaces'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { ProjectEditForm } from '../View/Form'

export const ProjectCreatePage: Page = () => {
  return (
    <>
      <SeoHeaders
        title="Создать проект"
        noindex
        nofollow
        canonical={undefined}
        siteOrigin={undefined}
      />

      <ProjectEditForm project={undefined} cancelHandler={undefined} />
    </>
  )
}
