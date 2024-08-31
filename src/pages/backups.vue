<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import { computedAsync } from '@vueuse/core'
import { useQuery } from '@tanstack/vue-query'

const currentDb = ref(null)
const logContainer = ref(null)

async function fetchDbList(): Promise<string[]> {
  const res = await api.get('/backups')
  if (res.status !== 200) {
    return Promise.reject(new Error('Oh no!'))
  }

  if (res.data.length > 0) currentDb.value = res.data[0]
  return res.data
}

async function fetchBackups(): Promise<string[]> {
  const res = await api.get(`/backups/${currentDb.value}`)
  if (res.status !== 200) {
    return Promise.reject(new Error('Oh no!'))
  }

  return res.data
}

const scrollToBottom = () => {
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
}

onMounted(scrollToBottom)

const { data, isPending } = useQuery({ queryKey: ['backup_dbs'], queryFn: fetchDbList })

const { data: backups, isPending: backupsPending } = useQuery({
  queryKey: ['backups'],
  queryFn: fetchBackups
})

const dbs = computed(() => {
  if (!isPending.value) {
    return data.value
  }
  return []
})
</script>
<template>
  <v-navigation-drawer>
    <v-list>
      <v-skeleton-loader type="list-item-three-line" v-if="isPending"></v-skeleton-loader>
      <v-list-item :value="db" v-else v-for="db in dbs" :key="db" @click="() => {
          currentDb = db
        }
        ">
        {{ db }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <div class="w-100 h-100">
    <v-card class="mx-auto w-100 h-100" :loading="false">
      <template v-if="backupsPending">
        <v-skeleton-loader type="list-item-two-line"></v-skeleton-loader>
      </template>
      <v-card-title :style="{ height: '3.9rem' }" v-if="!backupsPending">
        Dostępne kopie zapasowe
      </v-card-title>
      <v-divider></v-divider>
      <template v-if="!backupsPending">
        <v-virtual-scroll max-height="100vh" height="100%" :items="backups">
          <template v-slot:default="{ item }">
            <div class="border-b-thin">
              <p class="pl-3 py-3">{{ item }}</p>
            </div>
          </template>
        </v-virtual-scroll>
      </template>
      <template v-else>
        <v-list>
          <v-list-item>
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
          </v-list-item>
          <v-list-item>
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
          </v-list-item>
          <v-list-item>
            <v-skeleton-loader type="list-item"></v-skeleton-loader>
          </v-list-item>
        </v-list>
      </template>
    </v-card>
  </div>
</template>
