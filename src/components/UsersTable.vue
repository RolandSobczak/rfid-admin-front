<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { authAPI } from '@/api'
import UsersForm from '@/components/forms/UsersForm.vue'
import DestroyUserDialog from '@/components/forms/DestroyUserDialog.vue'
import TenantBackup from '@/components/TenantBackup'
import TenantRestart from '@/components/TenantRestart'
import { useQuery } from '@tanstack/vue-query'
import { useAuthStore } from '@/stores'

const auth = useAuthStore()

async function fetchUsersList() {
  const res = await authAPI.get('/users')
  if (res.status !== 200) {
    return Promise.reject(new Error('Oh no!'))
  }

  return res.data
}

const result = useQuery({
  queryKey: ['users'],
  queryFn: fetchUsersList
  // enabled: auth.isAuthenticated
})

const users = computed(() => {
  if (!result.isPending.value) {
    return result.data.value.map((t) => ({
      id: t.id,
      name: t.first_name + ' ' + t.last_name,
      email: t.email,
      tenant: t.tenant ? t.tenant.name : null,
      staffuser: t.is_staffuser,
      superuser: t.is_superuser
    }))
  }
})

const headers = ref([
  { title: 'Imie i Nazwisko', align: 'start', key: 'name' },
  { title: 'Email', align: 'start', key: 'email' },
  { title: 'Tenant', align: 'start', key: 'tenant' },
  { title: 'Superuser', align: 'start', key: 'superuser' },
  { title: 'Staffuser', align: 'start', key: 'staffuser' },
  { title: 'Akcje', align: 'end', key: 'actions' }
])
</script>
<template>
  <v-data-table :headers="headers" :items="users" item-value="name" class="h-auto">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Organizacje</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <UsersForm />
      </v-toolbar>
    </template>
    <template v-slot:item.superuser="{ item }">
      <div :class="[item.superuser ? 'bg-green' : 'bg-red', 'text-caption rounded-xl text-end']"
        style="height: 10px; width: 10px"></div>
    </template>
    <template v-slot:item.staffuser="{ item }">
      <div :class="[item.staffuser ? 'bg-green' : 'bg-red', 'text-caption rounded-xl text-end']"
        style="height: 10px; width: 10px"></div>
    </template>
    <template v-slot:item.actions="{ item }">
      <div class="d-flex align-center justify-end">
        <DestroyUserDialog :user-id="item.id" />
      </div>
    </template>
  </v-data-table>
</template>
