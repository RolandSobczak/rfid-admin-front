<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/api'
import { computedAsync } from '@vueuse/core'
import { useQuery } from '@tanstack/vue-query'

const currentLog = ref(null)
const logContainer = ref(null)
const logData = ref(null)

async function fetchDeploymentsList() {
  const res = await api.get('/deployments')
  if (res.status !== 200) {
    return Promise.reject(new Error('Oh no!'))
  }
  if (!currentLog.value && res.data.length > 0) {
    currentLog.value = res.data[0].name
    fetchLogs()
  }

  return res.data
}

const scrollToBottom = () => {
  if (logContainer.value) {
    logContainer.value.scrollTop = logContainer.value.scrollHeight
  }
}

onMounted(scrollToBottom)

const { data, isPending } = useQuery({
  queryKey: ['deployments'],
  queryFn: fetchDeploymentsList
})

const tenants = computed(() => {
  if (!isPending.value) {
    return data.value
  }
  return []
})

async function fetchLogs() {
  const res = await api.get(`/deployments/${currentLog.value}/logs`)
  if (res.status !== 200) {
    throw new Error('Request failed')
  }
  logData.value = res.data
}

onMounted(fetchLogs)
</script>
<template>
  <v-navigation-drawer permanent>
    <v-list class="h-100">
      <v-list-item :value="tenant.name" v-for="tenant in tenants" :key="tenant.name" @click="() => {
        logData = null
        currentLog = tenant.name
        fetchLogs()
      }
        " v-if="!isPending">
        <div>
          <div class="d-flex align-center justify-space-between">
            <h3 class="text-h6">{{ tenant.name }}</h3>
            <div :class="[tenant.ready ? 'bg-green' : 'bg-red', 'text-caption rounded-xl text-end']"
              style="height: 10px; width: 10px"></div>
          </div>
          <small>{{ tenant.containers[0].image }}</small>
        </div>
      </v-list-item>
      <div v-else class="d-flex justify-center align-center h-100 w-100">
        <v-progress-circular color="primary" indeterminate></v-progress-circular>
      </div>
    </v-list>
  </v-navigation-drawer>

  <div class="main-content">
    <code class="log-container" ref="logContainer" v-if="logData">{{ logData }}</code>
    <div v-else class="d-flex justify-center align-center h-100 w-100">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* Full viewport height */
  width: 100%;
  /* Full width */
  overflow: hidden;
  /* Prevents scrolling of the whole app */
}

.log-container {
  flex-grow: 1;
  overflow-y: auto;
  /* Enables scrolling within the logs */
  padding: 16px;
  /* Adds some padding for better readability */
  white-space: pre-wrap;
  /* Ensures that the text wraps properly */
  /* background-color: #f5f5f5; */
  /* Optional: a background color for contrast */
  border-radius: 4px;
  /* Optional: some border radius for better aesthetics */
  box-sizing: border-box;
  /* Ensures padding is included in the element's width/height */
}
</style>
