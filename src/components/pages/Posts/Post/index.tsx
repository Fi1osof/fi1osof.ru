import { useMemo } from 'react'
import { Page } from '../../_App/interfaces'
import { PostPageView } from './View'
import { PostPageProps } from './interfaces'
import { postPageGetInitialProps } from './postPageGetInitialProps'
import { PostStatus, usePostQuery } from 'src/gql/generated'
import { SeoHeaders } from 'src/components/seo/SeoHeaders'
import { JsonLd } from 'src/components/seo/JsonLd'
import { createBlogPosting } from 'src/components/seo/JsonLd/helpers'
import { createPostLink } from 'src/components/Link/Post'

export const PostPage: Page<PostPageProps> = ({ postId, siteOrigin }) => {
  const response = usePostQuery({
    skip: !postId,
    variables: {
      where: {
        id: postId,
      },
    },
  })

  const post = response.data?.object

  const searchable = post?.status === PostStatus.PUBLISHED ? true : false

  const blogPostingSchema = useMemo(() => {
    if (!post) {
      return null
    }

    return createBlogPosting({
      headline: post.title || '',
      description: post.description || undefined,
      datePublished: post.createdAt,
      dateModified: post.updatedAt,
      author: post.CreatedBy
        ? {
            '@type': 'Person',
            name: post.CreatedBy.fullname || post.CreatedBy.username || '',
          }
        : undefined,
    })
  }, [post])

  if (!post) {
    return null
  }

  return (
    <>
      <SeoHeaders
        title={post.title || 'Post'}
        description={post.description}
        noindex={!searchable}
        nofollow={!searchable}
        siteOrigin={siteOrigin}
        canonical={createPostLink(post)}
      />
      {blogPostingSchema && <JsonLd data={blogPostingSchema} />}
      <PostPageView post={post} />
    </>
  )
}

PostPage.getInitialProps = postPageGetInitialProps
