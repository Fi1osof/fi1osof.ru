'use client'

import type { WorldObject3d } from '../hooks/useWorldStore'
import { PlayerObject } from './PlayerObject'
import { NativeObject } from './NativeObject'

export enum WorldObjectComponent {
  Player = 'player',
}

interface WorldObjectProps {
  object: WorldObject3d
}

function getComponentType(object: WorldObject3d): WorldObjectComponent | null {
  const userData = object.userData as { type?: unknown } | undefined
  const type = userData?.type
  if (
    typeof type === 'string' &&
    Object.values(WorldObjectComponent).includes(type as WorldObjectComponent)
  ) {
    return type as WorldObjectComponent
  }
  return null
}

export const WorldObject: React.FC<WorldObjectProps> = ({ object }) => {
  const componentType = getComponentType(object)

  switch (componentType) {
    case WorldObjectComponent.Player:
      return <PlayerObject object={object} />
    default:
      return <NativeObject object={object} />
  }
}
