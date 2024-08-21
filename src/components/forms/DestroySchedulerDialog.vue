<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
const dialog = ref(false)
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query'

const { scheduler_name } = defineProps<{ scheduler_name: string }>()
const queryClient = new useQueryClient()

async function deleteTenant(schduler_name: string) {
  const res = await api.delete(`/backups/schedulers/${scheduler_name}`)
  if (res.status === 204) {
    onClose()
  }
}

const result = useQuery({ queryKey: ['schedulers'] })
const { error, mutate, reset } = useMutation({
  mutationFn: deleteTenant,
  onSuccess: () => {
    queryClient.setQueryData(['schedulers'], (oldData) =>
      oldData.filter((t) => t.scheduler_name !== scheduler_name)
    )
    onClose()
  }
})

function onDelete() {
  mutate(scheduler_name)
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
      <v-card prepend-icon="mdi-clock" title="Usuń akcje">
        <v-card-text>
          <p>Czy napewno chcesz usunac akcje?</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Cofnij" variant="plain" @click="dialog = false"></v-btn>

          <v-btn color="red" text="Usun" @click="onDelete"></v-btn>
        </v-card-actions>
      </v-card>
      <template v-slot:activator="{ props }">
        <v-icon size="small" @click="onOpen"> mdi-delete </v-icon>
      </template>
    </v-dialog>
  </div>
</template>
