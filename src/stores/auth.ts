import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

const REFRESH_TOKEN_ADDR_KEY = 'refresh-token'

export const useAuthStore = defineStore('currentUser', () => {
  const data = ref(null);
  const userType = ref(null)

  const removeStorage = () => {
    localStorage.removeItem(REFRESH_TOKEN_ADDR_KEY)
    sessionStorage.removeItem(REFRESH_TOKEN_ADDR_KEY)
  }

  const setRefreshToken = (refreshToken: string, rememberMe: boolean) => {
    if (rememberMe) {
      localStorage.setItem(REFRESH_TOKEN_ADDR_KEY, refreshToken)
    } else {
      sessionStorage.setItem(REFRESH_TOKEN_ADDR_KEY, refreshToken)
    }
  }

  const isAuthenticated = computed((): boolean => {
    return data.value !== null
  })

  const setUserData = (user) => {
    data.value = user
  }

  const loadRefreshToken = (): string => {
    let refreshToken = localStorage.getItem(REFRESH_TOKEN_ADDR_KEY)
    if (!refreshToken) {
      refreshToken = sessionStorage.getItem(REFRESH_TOKEN_ADDR_KEY)
    }
    console.log("loadRefreshToken", refreshToken);

    return refreshToken;
  }

  return {
    data,
    isAuthenticated,
    removeStorage,
    setRefreshToken,
    userType,
    loadRefreshToken,
    setUserData,
  }
})
