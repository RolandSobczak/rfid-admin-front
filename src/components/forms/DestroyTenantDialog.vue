<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
const dialog = ref(false)
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query'

const { tenant_id } = defineProps<{ tenant_id: number }>()
const queryClient = new useQueryClient()
const isLoading = ref<boolean>(false)

async function deleteTenant(tenant_id: number) {
  const res = await api.delete(`/tenants/${tenant_id}`)
  if (res.status === 204) {
    onClose()
  }
}

const result = useQuery({ queryKey: ['tenants'] })
const { error, mutate, reset } = useMutation({
  mutationFn: deleteTenant,
  onSuccess: () => {
    queryClient.setQueryData(['tenants'], (oldData) => oldData.filter((t) => t.id !== tenant_id))
    onClose()
  },
  onSettled: () => {
    isLoading.value = false
  }
})

function onDelete() {
  isLoading.value = true
  mutate(tenant_id)
}

function onOpen() {
  dialog.value = true
}

function onClose() {
  dialog.value = false
}
</script>
<template>
  <div class="ps-4">
    <v-dialog v-model="dialog" max-width="600">
      <v-card prepend-icon="mdi-domain" title="Nowa organizacja">
        <v-card-text>
          <p>Czy napewno chcesz usunac tenant?</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text="Cofnij" variant="plain" @click="dialog = false"></v-btn>
          <v-btn color="red" text="Usuń" @click="onDelete" :loading="isLoading"></v-btn>
        </v-card-actions>
      </v-card>
      <template v-slot:activator="{ props }">
        <v-icon size="small" @click="onOpen"> mdi-delete </v-icon>
      </template>
    </v-dialog>
  </div>
</template>
