<script lang="ts" setup>
  import {ref, computed, onMounted} from "vue";
  import api from "@/api";
  import {computedAsync} from '@vueuse/core'
  import {useQuery} from '@tanstack/vue-query';

  const currentLog = ref("auth");
  const logContainer = ref(null);

  async function fetchDeploymentsList() {
    const res = await api.get("/deployments");
    if (res.status !== 200) {
      return Promise.reject(new Error('Oh no!'))
    }

    return res.data;
  }

  const scrollToBottom = () => {
    if (logContainer.value) {
      logContainer.value.scrollTop = logContainer.value.scrollHeight;
    }
  };

  onMounted(scrollToBottom);

  const result = useQuery({queryKey: ['deployments'], queryFn: fetchDeploymentsList})

  const tenants = computed(() => {
    if (!result.isPending.value) {
      return result.data.value;
    }
    return [];
  });

  const logs = computedAsync(async () => {
    const res = await api.get(`/deployments/${currentLog.value}/logs`)
    if (res.status !== 200) {
      return ""
    }
    return res.data;
  }, null);

</script>
<template>
  <v-navigation-drawer permanent>
    <v-list>
      <v-list-item :title="tenant.name" :value="tenant.name" v-for="tenant in tenants" :key="tenant.name"
        @click="() => { currentLog = tenant.name }">
      </v-list-item>
    </v-list>
  </v-navigation-drawer>

  <div class="main-content">
    <code class="log-container" ref="logContainer">{{ logs }}</code>
  </div>
</template>

<style scoped>
  .main-content {
    display: flex;
    flex-direction: column;
    height: 93.5vh;
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
