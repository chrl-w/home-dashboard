import {
  getAuth,
  createConnection,
  subscribeEntities,
} from 'home-assistant-js-websocket'

const LS_URL = 'ha_url'
const LS_TOKENS = 'ha_tokens'

export function getSavedUrl() {
  return localStorage.getItem(LS_URL) || ''
}

export function saveUrl(url) {
  localStorage.setItem(LS_URL, url.replace(/\/$/, ''))
}

export function clearAuth() {
  localStorage.removeItem(LS_URL)
  localStorage.removeItem(LS_TOKENS)
}

function saveTokens(tokens) {
  if (tokens) localStorage.setItem(LS_TOKENS, JSON.stringify(tokens))
  else localStorage.removeItem(LS_TOKENS)
}

function loadTokens() {
  const t = localStorage.getItem(LS_TOKENS)
  return t ? JSON.parse(t) : null
}

export async function connectWithOAuth(hassUrl) {
  const auth = await getAuth({
    hassUrl,
    saveTokens,
    loadTokens,
  })
  // Clean up OAuth params from URL without a page reload
  if (window.location.search.includes('code=')) {
    window.history.replaceState(null, '', window.location.pathname)
  }
  const conn = await createConnection({ auth })
  return conn
}

export { subscribeEntities }
