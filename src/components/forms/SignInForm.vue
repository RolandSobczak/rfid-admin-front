<script setup lang="ts">
import { ref } from 'vue'
import { authAPI, setAccessToken } from '@/api'
import { useField, useForm } from 'vee-validate'
import router from '@/router'
import { useAuthStore } from '@/stores'

const dialog = ref(false)
const auth = useAuthStore()

function onOpen() {
  dialog.value = true
}

function onClose() {
  dialog.value = false
}

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    email(value) {
      if (/^[a-zA-Z0-9.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

      return 'Must be a valid e-mail.'
    },
    password(value) {
      return true
    }
  }
})
const email = useField('email')
const password = useField('password')
const rememberMe = useField('rememberMe')

async function fetchToken(input_email: string, input_password: string) {
  const res = await authAPI.post('/users/token', {
    username: input_email,
    password: input_password
  })
  if (res.status != 200) {
    email.setErrors(['Nieprawidłowy email lub hasło'])
    password.setErrors(['Nieprawidłowy email lub hasło'])
    throw new Error('Invalid credentials')
  }
  if (!res.data.user.is_staffuser) {
    email.setErrors(['Wymagane konto administratora'])
    password.setErrors(['Wymagane konto administratora'])
    throw new Error('Invalid credentials')
  }
  return res.data
}

async function fetchCurrentUser() {
  const res = await authAPI.get('/users/current-user')
  if (res.status != 200) {
    throw new Error('Current user data fetch failed')
  }

  return res.data
}

const submit = handleSubmit(async (values) => {
  const res = await fetchToken(values.email, values.password)
  setAccessToken(res.token)
  auth.setRefreshToken(res.refresh_token, values.rememberMe)

  const currentUser = await fetchCurrentUser()
  auth.setUserData(currentUser)

  await router.push({ name: 'Home' })
})
</script>
<template>
  <div class="pa-4 text-center w-50 h-50">
    <v-card title="Logowanie">
      <form @submit.prevent="submit">
        <v-card-text>
          <v-row dense>
            <v-col cols="12" md="12" sm="12">
              <v-text-field label="Email" required v-model="email.value.value" :counter="32"
                :error-messages="email.errorMessage.value"></v-text-field>
            </v-col>
            <v-col cols="12" md="12" sm="12">
              <v-text-field label="Hasło" persistent-hint required v-model="password.value.value" type="password"
                :counter="32" :error-messages="password.errorMessage.value"></v-text-field>
            </v-col>
            <v-col>
              <v-checkbox label="Zapamiętaj mnie" v-model="rememberMe.value.value"></v-checkbox>
            </v-col>
          </v-row>
          <v-btn full class="w-100 mt-2" color="primary" text="Zaloguj" variant="tonal" type="submit"></v-btn>
        </v-card-text>
      </form>
    </v-card>
  </div>
</template>
