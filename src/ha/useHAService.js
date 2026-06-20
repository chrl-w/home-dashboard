import { useHA } from './HAProvider.jsx'

export function useHAService() {
  const { callService } = useHA() || {}
  return callService || (() => {})
}
