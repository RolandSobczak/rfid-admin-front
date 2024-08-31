<script lang="ts" setup>
import { computed } from 'vue'
import { useQuery } from '@tanstack/vue-query'
import { authAPI } from '@/api'
import router from '@/router'

async function fetchCurrentUser() {
  const res = await authAPI.get('/users/current-user')
  if (res.status !== 200) {
    return Promise.reject(new Error('Oh no!'))
  }

  return res.data
}

const { isPending, data: user } = useQuery({
  queryKey: ['currentUser'],
  queryFn: fetchCurrentUser
})

const name = computed(() => {
  if (isPending.value) return ''
  return user.value.first_name + ' ' + user.value.last_name
})

const initials = computed(() => {
  if (isPending.value) return ''
  return user.value.first_name[0] + user.value.last_name[0]
})

function logout() { }
</script>
<template>
  <v-card class="mx-auto flex-column d-flex justify-center align-center py-6" min-width="400" max-width="600">
    <v-card-title>
      <div class="w-100 flex-column d-flex justify-center align-center mb-2">
        <v-avatar size="70" color="bg-secondary">
          {{ initials }}
        </v-avatar>
        <p class="mt-2">{{ name }}</p>
      </div>
    </v-card-title>
    <v-btn append-icon="mdi-exit-run" variant="outlined"> Wylgouj </v-btn>
  </v-card>
</template>
