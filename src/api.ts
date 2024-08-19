import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: import.meta.env.VITE_API_TIMEOUT,
  validateStatus: (status) => status < 500
});

export const authAPI = axios.create({
  baseURL: import.meta.env.VITE_AUTH_API_URL,
  timeout: import.meta.env.VITE_AUTH_API_TIMEOUT,
  validateStatus: (status) => status < 500
});

export const setAccessToken = (token: string): void => {
  authAPI.defaults.headers['Authorization'] = `Bearer ${token}`
  api.defaults.headers['Authorization'] = `Bearer ${token}`
}

export async function fetchNewToken(refreshToken: string) {
  const res = await fetch(`http://192.168.1.2/auth-api/v1/users/refresh`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` }
  })
  const resJson = await res.json()
  if (res.status == 200) {
    console.log({ newToken: resJson.token })
    return resJson.token
  } else {
    throw new Error('Invalid token')
  }

}

export default api;
