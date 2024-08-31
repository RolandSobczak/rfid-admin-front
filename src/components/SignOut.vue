<script lang="ts" setup>
import { ref } from 'vue'
import { setAccessToken } from '@/api'
import router from '@/router'

const REFRESH_TOKEN_ADDR_KEY = 'refresh-token'

const dialog = ref<boolean>(false)

function onClose() {
  dialog.value = false
}

function onOpen() {
  dialog.value = true
}

async function signOut() {
  await setAccessToken(null)
  localStorage.removeItem(REFRESH_TOKEN_ADDR_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_ADDR_KEY)
  await router.push({ name: 'SignIn' })
}
</script>
<template>
  <v-dialog max-width="500" v-model="dialog">
    <template v-slot:activator>
      <v-btn append-icon="mdi-exit-run" variant="outlined" @click="onOpen"> Wylgouj </v-btn>
    </template>

    <template v-slot:default>
      <v-card title="Sesja">
        <v-card-text>
          <p>Czy napewno chcesz się wylogować</p>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Wstecz" @click="onClose"></v-btn>
          <v-btn text="Wyloguj" @click="signOut"></v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>
