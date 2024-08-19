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

async function fetchBackups(db: string): Promise<string[]> {
  const res = await api.get(`/backups/${db}`)
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

const result = useQuery({ queryKey: ['backup_dbs'], queryFn: fetchDbList })

const dbs = computed(() => {
  if (!result.isPending.value) {
    return result.data.value
  }
  return []
})

const backups = computedAsync(async () => {
  if (!currentDb.value) return []

  return await fetchBackups(currentDb.value)
  return []
}, [])
</script>
<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item :value="db" v-for="db in dbs" :key="db" @click="() => {
          currentDb = db
        }
        ">
        {{ db }}
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <div class="w-100 h-100">
    <div v-for="backup in backups" :key="backup" class="border-b-thin">
      <p class="py-3">{{ backup }}</p>
    </div>
  </div>
</template>

<style scoped></style>
