<script lang="ts" setup>
import { useTheme } from 'vuetify'
import router from '@/router'

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

async function onNavigate(name: string) {
  await router.push({ name })
}
</script>
<template>
  <v-app :theme="theme">
    <v-layout class="rounded rounded-md">
      <v-main class="d-flex align-center justify-center my-2 mx-6" style="min-height: 300px">
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>
