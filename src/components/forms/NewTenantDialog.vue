<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'
import { useField, useForm } from 'vee-validate'
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

const dialog = ref(false)
const isLoading = ref(false)

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
    name(value) {
      if (value && value.length < 4) {
        return 'Nazwa musi być dłuższa niż 4 znaki'
      }
      if (value && value.length > 32) {
        return 'Nazwa musi być krótsza niż 32 znaki'
      }
      return true
    },
    first_name(value) {
      if (value && value.length < 2) {
        return 'Imie musi być dłuższe niż 2 znaki'
      }
      if (value && value.length > 32) {
        return 'Imie musi być krótsze niż 32 znaki'
      }
      return true
    },
    last_name(value) {
      if (value && value.length < 2) {
        return 'Nazwisko musi być dłuższe niż 2 znaki'
      }
      if (value && value.length > 32) {
        return 'Nazwisko musi być krótsze niż 32 znaki'
      }
      return true
    },
    email(value) {
      if (/^[a-zA-Z0-9.-]+@[a-z.-]+\.[a-z]+$/i.test(value)) return true

      return 'Nieprawidłowy e-mail'
    },
    password(value, ctx) {
      if (value && value.length < 4) return 'Hasło musi być dłuższe niż 4 znaki'
      if (value && value.length > 32) return 'Hasło musi być krótsze niż 32 znaki'
      if (value !== ctx.form.confirm_password) return 'Hasła nie są identyczne'
      return true
    },
    confirm_password(value, ctx) {
      if (value && value.length < 4) return 'Hasło musi być dłuższe niż 4 znaki'
      if (value && value.length > 32) return 'Hasło musi być krótsze niż 32 znaki'
      if (value !== ctx.form.password) return 'Hasła nie są identyczne'

      return true
    },
    lang(value) {
      if (value) return true

      return 'Wybierz wartość'
    },
    tenant_type(value) {
      if (value) return true

      return 'Wybierz wartość'
    }
  }
})
const name = useField('name')
const first_name = useField('first_name')
const last_name = useField('last_name')
const email = useField('email')
const password = useField('password')
const confirm_password = useField('confirm_password')
const lang = useField('lang')
const tenant_type = useField('tenant_type')

function onOpen() {
  dialog.value = true
}

function onClose() {
  handleReset()
  dialog.value = false
  isLoading.value = false
}

function apiErrorHandler(e) {
  const status = e.response.status

  if (status === 422) {
    const data = e.response.data

    data.detail.detail.forEach((f) => {
      if (f.loc.equals(['body', 'tenant', 'name'])) {
        name.setErrors(['Nazwa tenantu musi być unikatowy'])
      }
      if (f.loc.equals(['body', 'email'])) {
        email.setErrors(['Email użytkownika musi być unikatowy'])
      }
    })
  }

  throw new Error(e)
}

async function deployTenant(tenant) {
  return await api
    .post('/tenants', tenant)
    .then((res) => res.data)
    .catch(apiErrorHandler)
}

const result = useQuery({ queryKey: ['tenants'] })
const queryClient = useQueryClient()
const { error, mutate, reset } = useMutation({
  mutationFn: deployTenant,
  onSuccess: (newTenant) => {
    queryClient.setQueryData(['tenants'], (oldData) => {
      const updatedData = oldData ? [...oldData, newTenant] : [newTenant]
      return updatedData
    })
    onClose()
  }
})

const submit = handleSubmit(async (values) => {
  isLoading.value = true
  const data = {
    email: values.email,
    password: values.password,
    first_name: values.first_name,
    last_name: values.last_name,
    tenant: {
      name: values.name
    }
  }
  if (values.tenant_type === 'Hotel') {
    data.tenant.type = 'hotel'
  } else if (values.tenant_type === 'Sklep') {
    data.tenant.type = 'warehouse'
  }

  if (values.lang === 'Polski') {
    data.tenant.lang = 'pl-PL'
  } else if (values.lang === 'Angielski') {
    data.tenant.lang = 'en-EN'
  }
  mutate(data)
  isLoading.value = false
})
</script>
<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <v-card prepend-icon="mdi-domain" title="Nowa organizacja">
        <form @submit.prevent="submit">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="6" sm="6">
                <v-text-field label="First name*" required v-model="first_name.value.value" :counter="32"
                  :error-messages="first_name.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="12" md="6" sm="6">
                <v-text-field label="Last name*" persistent-hint required v-model="last_name.value.value" :counter="32"
                  :error-messages="last_name.errorMessage.value"></v-text-field>
              </v-col>

              <v-col cols="12" md="12" sm="12">
                <v-text-field label="Email*" required v-model="email.value.value" :counter="32"
                  :error-messages="email.errorMessage.value"></v-text-field>
              </v-col>

              <v-col cols="12" md="12" sm="12">
                <v-text-field label="Password*" type="password" required v-model="password.value.value" :counter="32"
                  :error-messages="password.errorMessage.value"></v-text-field>
              </v-col>

              <v-col cols="12" md="12" sm="12">
                <v-text-field label="Confirm Password*" type="password" required v-model="confirm_password.value.value"
                  :counter="32" :error-messages="confirm_password.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-text-field label="Nazwa" required v-model="name.value.value" :counter="32"
                  :error-messages="name.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-select :items="['Polski', 'Angielski']" label="Jezyk" required v-model="lang.value.value"
                  :error-messages="lang.errorMessage.value"></v-select>
              </v-col>

              <v-col cols="12" sm="6">
                <v-select :items="['Hotel', 'Sklep']" label="Rodzaj organizacji" v-model="tenant_type.value.value"
                  :error-messages="tenant_type.errorMessage.value" required></v-select>
              </v-col>
            </v-row>
          </v-card-text>

          <v-divider></v-divider>

          <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Cofnij" variant="plain" @click="onClose"></v-btn>

            <v-btn color="primary" text="Dodaj" variant="tonal" type="submit" :loading="isLoading"></v-btn>
          </v-card-actions>
        </form>
      </v-card>
      <template v-slot:activator="{ props }">
        <v-btn class="mb-2" color="primary" dark v-bind="props"> Dodaj Tenant </v-btn>
      </template>
    </v-dialog>
  </div>
</template>
