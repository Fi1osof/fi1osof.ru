import type React from 'react'
import { Fragment } from 'react'
import {
  BreadcrumbsStyled,
  BreadcrumbsItemStyled,
  BreadcrumbsSepStyled,
} from './styles'
import type { BreadcrumbsProps } from './types'
import Link from 'next/link'

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  // onNavigate,
  ...other
}) => (
  <BreadcrumbsStyled {...other}>
    {items.map((item, i) => (
      <Fragment key={item.id}>
        {i > 0 && <BreadcrumbsSepStyled>/</BreadcrumbsSepStyled>}
        <BreadcrumbsItemStyled
          href={item.href}
          as={item.href ? Link : 'span'}
          $clickable={Boolean(item.href)}
          // onClick={(e) => {
          //   if (item.href && onNavigate) {
          //     e.preventDefault()
          //     onNavigate(item)
          //   }
          // }}
        >
          {item.label}
        </BreadcrumbsItemStyled>
      </Fragment>
    ))}
  </BreadcrumbsStyled>
)
