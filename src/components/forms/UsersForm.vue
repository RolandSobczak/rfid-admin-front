<script setup lang="ts">
import { ref } from 'vue'
import { authAPI } from '@/api'
import { useField, useForm } from 'vee-validate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

const dialog = ref(false)

function onOpen() {
  dialog.value = true
}

function onClose() {
  dialog.value = false
  handleReset()
}

const { handleSubmit, handleReset } = useForm({
  /*validationSchema: {
    name(value) {
      if (value) return true

      return 'Select an item.'
    },
    db(value) {
      if (value) return true

      return 'Select an item.'
    },
    minute(value) {
      if (value) return true

      return 'Select an item.'
    },
    hour(value) {
      if (value) return true

      return 'Select an item.'
    },
    dayOfMonth(value) {
      if (value) return true

      return 'Select an item.'
    },
    month(value) {
      if (value) return true

      return 'Select an item.'
    },
    dayOfWeek(value) {
      if (value) return true

      return 'Select an item.'
    }
  }*/
})
const email = useField('email')
const password = useField('password')
const firstName = useField('firstName')
const lastName = useField('lastName')
const superuser = useField('superuser')
const staffuser = useField('staffuser')

async function createAdmin(userId: number, staffuser: boolean, superuser: boolean) {
  const res = await authAPI.patch(`/users/${userId}/admin`, {
    is_staffuser: staffuser,
    is_superuser: superuser
  })
  return res.data
}

async function createUser(user) {
  const res = await authAPI.post('/users', user)
  if (user.staffuser || user.superuser) {
    const createdUser = await createAdmin(res.data.id, user.staffuser, user.superuser)
    return createdUser
  }
  return res.data
}

const queryClient = useQueryClient()
const { error, mutate, reset } = useMutation({
  mutationFn: createUser,
  onSuccess: (newUser) => {
    queryClient.setQueryData(['users'], (oldData) => {
      const updatedData = oldData ? [...oldData, newUser] : [newUser]
      return updatedData
    })
  }
})

const submit = handleSubmit(async (values) => {
  const data = {
    first_name: values.firstName,
    last_name: values.lastName,
    email: values.email,
    password: values.password,
    staffuser: values.staffuser,
    superuser: values.superuser
  }

  mutate(data)
  onClose()
})
</script>
<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <v-card prepend-icon="mdi-account" title="Nowy użytkownik">
        <form @submit.prevent="submit">
          <v-card-text>
            <v-row dense>
              <v-col cols="6" md="6" sm="12">
                <v-text-field label="Imie" required v-model="firstName.value.value" :counter="10"
                  :error-messages="firstName.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="6" md="6" sm="12">
                <v-text-field label="Nazwisko" persistent-hint required v-model="lastName.value.value" :counter="10"
                  :error-messages="lastName.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field label="Email" persistent-hint required v-model="email.value.value" :counter="10"
                  :error-messages="email.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field label="Hasło" persistent-hint required v-model="password.value.value" :counter="10"
                  :error-messages="password.errorMessage.value" type="password"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-checkbox label="super użytkownik" persistent-hint required v-model="superuser.value.value"
                  :counter="10" :error-messages="superuser.errorMessage.value"></v-checkbox>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-checkbox label="pracownik" persistent-hint required v-model="staffuser.value.value" :counter="10"
                  :error-messages="staffuser.errorMessage.value"></v-checkbox>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Cofnij" variant="plain" @click="onClose"></v-btn>

            <v-btn color="primary" text="Dodaj" variant="tonal" type="submit"></v-btn>
          </v-card-actions>
        </form>
      </v-card>
      <template v-slot:activator="{ props }">
        <v-btn class="mb-2" color="primary" dark v-bind="props">Dodaj użytkownika</v-btn>
      </template>
    </v-dialog>
  </div>
</template>
