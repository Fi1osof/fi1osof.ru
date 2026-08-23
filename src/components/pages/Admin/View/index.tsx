import React from 'react'
import { AdminPageViewNavStyled, AdminPageViewStyled } from './styles'
import Link from 'next/link'

export const AdminPageView: React.FC = () => {
  return (
    <AdminPageViewStyled>
      <AdminPageViewNavStyled>
        <Link href={'/admin/search-agent'}>Search agent</Link>
      </AdminPageViewNavStyled>
    </AdminPageViewStyled>
  )
}
