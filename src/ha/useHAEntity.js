import { useHA } from './HAProvider.jsx'

export function useHAEntity(entityId) {
  const { entities } = useHA() || { entities: {} }
  return entityId ? entities[entityId] : null
}
