<script lang="ts" setup>
import { onMounted } from 'vue'
import { useTheme } from 'vuetify'
import router from '@/router'
import { mdiAccount } from '@mdi/js'
import SignOut from '@/components/SignOut.vue'

const icons = { mdiAccount }
onMounted(() => {
  console.log(mdiAccount)
})

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
      <v-app-bar title="RFIDIO Admin Panel" class="px-6">
        <v-icon class="pe-4" color="white" icon="mdi-theme-light-dark" size="large" @click="toggleTheme"></v-icon>
        <SignOut />
      </v-app-bar>

      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Organizacje" value="tenants" @click="async () => {
              await router.push({ name: 'Home' })
            }
            "></v-list-item>
          <v-list-item title="Logi" value="logs" @click="async () => {
              await router.push({ name: 'Logs' })
            }
            "></v-list-item>
          <v-list-item title="Użytkownicy" value="users"></v-list-item>
          <v-list-item title="Kopie zapasowe" value="backups" @click="async () => {
              await router.push({ name: 'Backups' })
            }
            "></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="d-flex align-center justify-center my-2 mx-6" style="min-height: 300px">
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>
