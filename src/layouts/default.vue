<script lang="ts" setup>
  import {useTheme} from 'vuetify';
  import router from '@/router'

  const theme = useTheme();

  function toggleTheme() {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
  }

  async function onNavigate(name: string) {
    await router.push({name})
  }

</script>
<template>
  <v-app :theme="theme">
    <v-layout class="rounded rounded-md">
      <v-app-bar title="RFIDIO Admin Panel" class="px-4">

        <v-btn :prepend-icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'" text="Toggle Theme" slim
          @click="toggleTheme"></v-btn>
      </v-app-bar>

      <v-navigation-drawer>
        <v-list>
          <v-list-item title="Organizacje" value="tenants"
            @click="async () => { await router.push({ name: 'tenants' }) }"></v-list-item>
          <v-list-item title="Logi" value="logs"
            @click="async () => { await router.push({ name: 'logs' }) }"></v-list-item>
          <v-list-item title="Użytkownicy" value="users"></v-list-item>
          <v-list-item title="Kopi zapasowe" value="backups"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="d-flex align-center justify-center my-2 mx-6" style="min-height: 300px;">
        <router-view />
      </v-main>
    </v-layout>

  </v-app>
</template>
