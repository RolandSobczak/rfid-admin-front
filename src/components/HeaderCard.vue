<script setup lang="ts"></script>
<template>
  <div>
    <div :style="{ height: '3.45rem' }" class="d-flex align-center ml-2 py-3">
      <v-icon size="36px">
        <v-img alt="Avatar" src="/public/icon.svg"></v-img>
      </v-icon>
      <div class="ml-3 d-flex flex-column align-start justify-center">
        <p class="text-subtitle-1" :style="{ lineHeight: '1.2rem' }">RFIDIO</p>
        <span class="text-caption" :style="{ lineHeight: '.8rem' }">Admin Panel</span>
      </div>
    </div>
    <v-divider class="mt-2"></v-divider>
  </div>
</template>
