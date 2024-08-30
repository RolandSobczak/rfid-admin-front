import axios from 'axios';
import createAuthRefreshInterceptor from "axios-auth-refresh";
//import { useAuthStore } from '@/stores'
import router from "@/router"

//const auth = useAuthStore()
//
const REFRESH_TOKEN_ADDR_KEY = 'refresh-token'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
});

export const authAPI = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  timeout: import.meta.env.VITE_AUTH_API_TIMEOUT,
});

export const setAccessToken = (token: string): void => {
  authAPI.defaults.headers['Authorization'] = `Bearer ${token}`
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}

export async function fetchNewToken(refreshToken: string) {
  const res = await fetch(`${import.meta.env.VITE_AUTH_API_URL}/users/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` }
  })
  const resJson = await res.json()
  if (res.status == 200) {
    return resJson.token
  } else {
    throw new Error('Invalid token')
  }

}

export default api;


async function fetchCurrentUser() {
  const res = await authAPI.get('/users/current-user')
  if (res.status != 200) {
    throw new Error('Current user data fetch failed')
  }

  return res.data
}

const loadRefreshToken = (): string => {
  let refreshToken = localStorage.getItem(REFRESH_TOKEN_ADDR_KEY)
  if (!refreshToken) {
    refreshToken = sessionStorage.getItem(REFRESH_TOKEN_ADDR_KEY)
  }

  return refreshToken;
}

async function refresh(failedRequest: any) {

  const refreshToken = loadRefreshToken()
  if (!refreshToken) {
    router.push({ name: 'SignIn' })
    return Promise.reject()
  }

  try {
    const accessToken = await fetchNewToken(refreshToken)
  } catch {
    router.push({ name: 'SignIn' })
    return Promise.reject()
  }

  return fetchNewToken(refreshToken).then((newToken: string) => {
    failedRequest.response.config.headers.Authorization = "Bearer " + newToken;
    setAccessToken(newToken)
    return Promise.resolve()
  })
}

createAuthRefreshInterceptor(api, refresh, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});

createAuthRefreshInterceptor(authAPI, refresh, {
  statusCodes: [401],
  pauseInstanceWhileRefreshing: true,
});
