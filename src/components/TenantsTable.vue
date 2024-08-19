<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'
import NewTenantDialog from '@/components/forms/NewTenantDialog.vue'
import DestroyTenantDialog from '@/components/forms/DestroyTenantDialog.vue'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores'

const auth = useAuthStore()

async function fetchTenantsList() {
  const res = await api.get('/tenants')
  if (res.status !== 200) {
    return Promise.reject(new Error('Oh no!'))
  }

  return res.data
}

const result = useQuery({
  queryKey: ['tenants'],
  queryFn: fetchTenantsList,
  enabled: auth.isAuthenticated
})

function resolveType(tenant_type: string): string {
  switch (tenant_type) {
    case 'hotel':
      return 'Hotel'
    case 'warehouse':
      return 'Sklep'
    default:
      return tenant_type
  }
}

const tenants = computed(() => {
  if (!result.isPending.value) {
    return result.data.value.map((t) => ({
      id: t.id,
      name: t.name,
      email: t.owner.email,
      created_at: t.created_at,
      type: resolveType(t.type),
      healthy: t.healthy
    }))
  }
})

const headers = ref([
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Root email', align: 'start', key: 'email' },
  { title: 'Utworzono', align: 'start', key: 'created_at' },
  { title: 'Typ', align: 'start', key: 'type' },
  { title: 'Zdrowy', align: 'start', key: 'healthy' },
  { title: 'Akcje', align: 'end', key: 'actions' }
])
</script>
<template>
  <v-data-table :headers="headers" :items="tenants" item-value="name" class="h-auto">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Organizacje</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <NewTenantDialog />
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.healthy="{ item }">
      <div :class="[item.healthy ? 'bg-green' : 'bg-red', 'text-caption rounded-xl text-end']"
        style="height: 10px; width: 10px"></div>
    </template>
    <template v-slot:item.actions="{ item }">
      <DestroyTenantDialog :tenant_id="item.id" />
    </template>
  </v-data-table>
</template>
