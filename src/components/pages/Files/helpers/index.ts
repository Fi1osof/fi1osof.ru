import { FilesConnectionQueryVariables } from 'src/gql/generated'

type getFilesConnectionQueryVariablesProps = {
  page: number
  take?: number
}

export function getFilesConnectionQueryVariables({
  page,
  take = 12,
  ...other
}: getFilesConnectionQueryVariablesProps): FilesConnectionQueryVariables {
  return {
    ...other,
    skip: (page - 1) * take,
    take,
  }
}
