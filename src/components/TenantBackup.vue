<script lang="ts" setup>
import { ref } from 'vue'
import { setAccessToken } from '@/api'
import router from '@/router'
import api from '@/api'

const dialog = ref<boolean>(false)

const { tenantSlug } = defineProps<{
  tenantSlug: string
}>()

function onClose() {
  dialog.value = false
}

function onOpen() {
  dialog.value = true
}

async function createBackup() {
  console.log({ tenantSlug })
  const res = await api.post('/backups', { db_name: tenantSlug })
  if (res.status === 200) {
    onClose()
  }
}
</script>
<template>
  <div class="ps-4">
    <v-dialog max-width="500" v-model="dialog">
      <template v-slot:activator>
        <div @click="onOpen">
          <v-icon color="white" icon="mdi-cloud-upload" size="large"></v-icon>
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
