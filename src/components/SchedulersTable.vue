<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'
import SchedulerForm from '@/components/forms/SchedulerForm.vue'
import DestroySchedulerDialog from '@/components/forms/DestroySchedulerDialog.vue'
import TenantBackup from '@/components/TenantBackup'
import TenantRestart from '@/components/TenantRestart'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores'

const auth = useAuthStore()

async function fetchTenantsList() {
  const res = await api.get('/backups/schedulers')
  if (res.status !== 200) {
    return Promise.reject(new Error('Oh no!'))
  }

  return res.data
}

const result = useQuery({
  queryKey: ['schedulers'],
  queryFn: fetchTenantsList
  //enabled: auth.isAuthenticated
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

const schedulers = computed(() => {
  if (!result.isPending.value) {
    return result.data.value.map((s) => {
      const [minute, hour, day_of_month, month, day_of_week] = s.schedule.split(' ')

      return {
        name: s.scheduler_name,
        db_name: s.db_name,
        minute,
        hour,
        day_of_month,
        month,
        day_of_week
      }
    })
  }
})

const headers = ref([
  { title: 'Name', align: 'start', key: 'name' },
  { title: 'Baza', align: 'start', key: 'db_name' },
  { title: 'Minuta', align: 'start', key: 'minute' },
  { title: 'Godzina', align: 'start', key: 'hour' },
  { title: 'Dzień miesiąca', align: 'start', key: 'day_of_month' },
  { title: 'Miesiąc', align: 'start', key: 'month' },
  { title: 'Dzień tygodnia', align: 'start', key: 'day_of_week' },
  { title: 'Akcje', align: 'end', key: 'actions' }
])
</script>
<template>
  <v-data-table :headers="headers" :items="schedulers" item-value="name" class="h-auto">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Zaplanowane akcje</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <SchedulerForm />
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
    <template v-slot:item.actions="{ item }">
      <div class="d-flex align-center justify-end">
        <DestroySchedulerDialog :scheduler_name="item.name" />
      </div>
    </template>
  </v-data-table>
</template>
