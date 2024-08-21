<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
const dialog = ref(false)
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query'

const { userId } = defineProps<{ userId: number }>()
const queryClient = new useQueryClient()

async function deleteUser(userId: number) {
  const res = await api.delete(`/users/${userId}`)
  if (res.status === 204) {
    onClose()
  }
}

const result = useQuery({ queryKey: ['users'] })
const { error, mutate, reset } = useMutation({
  mutationFn: deleteUser,
  onSuccess: () => {
    queryClient.setQueryData(['users'], (oldData) => oldData.filter((u) => u.id !== userId))
    onClose()
  }
})

function onDelete() {
  mutate(userId)
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
      <v-card prepend-icon="mdi-account" title="Usuń użytkownika">
        <v-card-text>
          <p>Czy napewno chcesz usunąć użytkownika?</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Cofnij" variant="plain" @click="onClose"></v-btn>

          <v-btn color="red" text="Usuń" @click="onDelete"></v-btn>
        </v-card-actions>
      </v-card>
      <template v-slot:activator="{ props }">
        <v-icon size="small" @click="onOpen"> mdi-delete </v-icon>
      </template>
    </v-dialog>
  </div>
</template>
