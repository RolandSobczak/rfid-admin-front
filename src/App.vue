<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { fetchNewToken, setAccessToken, authAPI } from '@/api'
import { useAuthStore } from '@/stores'
import router from '@/router'

const auth = useAuthStore()

async function fetchCurrentUser() {
  const res = await authAPI.get('/users/current-user')
  if (res.status != 200) {
    throw new Error('Current user data fetch failed')
  }

  return res.data
}

async function startup() {
  const currentUser = await fetchCurrentUser()
  auth.setUserData(currentUser)

  //const refreshToken = auth.loadRefreshToken()
  //if (!refreshToken) {
  //  await router.push({ name: 'SignIn' })
  //}

  /*try {
    //const accessToken = await fetchNewToken(refreshToken)
    //setAccessToken(accessToken)

    const currentUser = await fetchCurrentUser()
    auth.setUserData(currentUser)
  } catch (e) {
    console.error(e)
    await router.push({ name: 'SignIn' })
  }*/
}

//onBeforeMount(startup)
</script>
