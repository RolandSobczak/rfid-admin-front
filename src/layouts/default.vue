<script lang="ts" setup>
import { onMounted } from 'vue'
import { useTheme } from 'vuetify'
import router from '@/router'
import {
  mdiAccount,
  mdiDomain,
  mdiFileDocumentOutline,
  mdilAccount,
  mdiBackupRestore,
  mdiWrenchClock
} from '@mdi/js'
import SignOut from '@/components/SignOut.vue'
import ProfileCard from '@/components/ProfileCard.vue'
import HeaderCard from '@/components/HeaderCard.vue'

const icons = {
  tenants: mdiDomain,
  users: mdiAccount,
  logs: mdiFileDocumentOutline,
  schedulers: mdiWrenchClock,
  backups: mdiBackupRestore
}

const theme = useTheme()

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

async function onNavigate(name: string) {
  await router.push({ name })
}
</script>
<template>
  <v-app :theme="theme" max-height="100vh" :style="{ overflow: 'hidden' }">
    <v-layout class="rounded rounded-md">
      <v-navigation-drawer expand-on-hover rail>
        <div class="d-flex flex-column justify-center h-100" :style="{ overflow: 'hidden' }">
          <HeaderCard />
          <v-list class="flex-grow-1">
            <v-list-item prepend-icon="mdi-domain" title="Organizacje" value="tenants" @click="async () => {
                await router.push({ name: 'Home' })
              }
              "></v-list-item>
            <v-list-item prepend-icon="mdi-file-document-outline" title="Logi" value="logs" @click="async () => {
                await router.push({ name: 'Logs' })
              }
              "></v-list-item>
            <v-list-item prepend-icon="mdi-account" title="Użytkownicy" value="users" @click="async () => {
                await router.push({ name: 'Users' })
              }
              "></v-list-item>
            <v-list-item prepend-icon="mdi-backup-restore" title="Kopie zapasowe" value="backups" @click="async () => {
                await router.push({ name: 'Backups' })
              }
              "></v-list-item>
            <v-list-item prepend-icon="mdi-wrench-clock" title="Zaplanowane akcje" value="schedulers" @click="async () => {
                await router.push({ name: 'Schedulers' })
              }
              "></v-list-item>
          </v-list>
          <ProfileCard />
        </div>
      </v-navigation-drawer>

      <v-main class="d-flex flex-column align-center justify-center" style="min-height: 300px">
        <router-view />
      </v-main>
    </v-layout>
  </v-app>
</template>
