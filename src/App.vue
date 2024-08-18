<template>
  <v-app>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
<script lang="ts" setup>
import { onBeforeMount } from 'vue'
import { fetchNewToken, setAccessToken } from '@/api'
import { useAuthStore } from '@/stores'
import router from '@/router'

const auth = useAuthStore()

async function startup() {
  const refreshToken = auth.loadRefreshToken()
  if (!refreshToken) {
    await router.push({ name: 'SignIn' })
  }

  try {
    const accessToken = await fetchNewToken(refreshToken)
    console.log({ accessToken })
    setAccessToken(accessToken)
  } catch {
    await router.push({ name: 'SignIn' })
  }
}

onBeforeMount(startup)
</script>
