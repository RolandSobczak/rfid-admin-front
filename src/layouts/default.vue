<script lang="ts" setup>
import { useTheme } from 'vuetify';

const theme = useTheme();

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark';
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
          <v-list-item title="Navigation drawer"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-main class="d-flex align-center justify-center my-2 mx-6" style="min-height: 300px;">
        <router-view />
      </v-main>
    </v-layout>

  </v-app>
</template>
