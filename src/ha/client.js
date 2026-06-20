import {
  createConnection,
  createLongLivedTokenAuth,
  subscribeEntities,
} from 'home-assistant-js-websocket'

const LS_URL = 'ha_url'
const LS_TOKEN = 'ha_token'

export function getSavedCredentials() {
  return {
    url: localStorage.getItem(LS_URL) || '',
    token: localStorage.getItem(LS_TOKEN) || '',
  }
}

export function saveCredentials(url, token) {
  localStorage.setItem(LS_URL, url.replace(/\/$/, ''))
  localStorage.setItem(LS_TOKEN, token)
}

export function clearCredentials() {
  localStorage.removeItem(LS_URL)
  localStorage.removeItem(LS_TOKEN)
}

export async function connect(url, token) {
  const wsUrl = url.replace(/^http/, 'ws')
  const auth = createLongLivedTokenAuth(wsUrl, token)
  const conn = await createConnection({ auth })
  return conn
}

export { subscribeEntities }
