<script lang="ts" setup>
import { ref } from 'vue'
import { setAccessToken } from '@/api'
import router from '@/router'

const dialog = ref<boolean>(false)

function onClose() {
  dialog.value = false
}

function onOpen() {
  dialog.value = true
}

async function createBackup() { }
</script>
<template>
  <div class="ps-4">
    <v-dialog max-width="500" v-model="dialog">
      <template v-slot:activator>
        <div @click="onOpen">
          <v-icon color="white" icon="mdi-restart" size="large"></v-icon>
        </div>
      </template>

      <template v-slot:default>
        <v-card title="Sesja">
          <v-card-text>
            <p>Czy napewno chcesz utowrzyć kopie zapasową?</p>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Wstecz" @click="onClose"></v-btn>
            <v-btn text="Utwórz" @click="createBackup"></v-btn>
          </v-card-actions>
        </v-card>
      </template>
    </v-dialog>
  </div>
</template>
