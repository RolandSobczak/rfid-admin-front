<script setup lang="ts">
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

const title = computed(() => {
  if (isPending.value) return ''
  if (user.value.is_superuser) return 'super użytkownik'
  return 'administrator'
})

async function onClick() {
  await router.push({ name: 'CurrentUser' })
}
</script>
<template>
  <div @click="onClick">
    <v-divider></v-divider>
    <div :style="{ height: '3.9rem' }" class="d-flex align-center ml-2 py-3">
      <v-avatar color="surface-variant" v-if="!isPending"> RS </v-avatar>
      <v-avatar color="grey-darken-2" class="ms-1 me-5" icon="mdi-account" size="medium" v-else></v-avatar>
      <div class="ml-2 d-flex flex-column align-start justify-center">
        <p class="text-subtitle-1" :style="{ lineHeight: '1.2rem' }">{{ name }}</p>
        <span class="text-caption" :style="{ lineHeight: '.8rem' }">{{ title }}</span>
      </div>
    </div>
  </div>
</template>
