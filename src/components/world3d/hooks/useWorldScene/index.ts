import { useWorld3dSceneQuery } from 'src/gql/generated/world3dScene'
import type { WorldObject3d } from '../useWorldStore'

export type World3dSceneObject = WorldObject3d

export function useWorldScene() {
  const { data, loading, error, refetch } = useWorld3dSceneQuery({
    fetchPolicy: 'cache-and-network',
  })

  const root = (data?.response as World3dSceneObject | null) ?? null

  return {
    root,
    loading,
    error,
    refetch,
  }
}
