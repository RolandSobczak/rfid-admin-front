<script setup lang="ts">
import { ref, computed } from 'vue'
import api from '@/api'
import { useField, useForm } from 'vee-validate'
import { useMutation, useQueryClient, useQuery } from '@tanstack/vue-query'

const dialog = ref(false)
const isLoading = ref(false)

function onOpen() {
  dialog.value = true
}

function onClose() {
  dialog.value = false
  isLoading.value = false
  handleReset()
}

const { handleSubmit, handleReset } = useForm({
  validationSchema: {
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
  }
})
const name = useField('name')
const db = useField('db')
const minute = useField('minute')
const hour = useField('hour')
const dayOfMonth = useField('dayOfMonth')
const month = useField('month')
const dayOfWeek = useField('dayOfWeek')

async function fetchDBList() {
  const res = await api.get('/backups/databases')
  if (res.status !== 200) {
    return Promise.reject(new Error('Oh no!'))
  }

  return res.data
}

const { data, isPending } = useQuery({
  queryKey: ['databases'],
  queryFn: fetchDBList
})

const databases = computed(() => {
  if (isPending.value) return []
  return data.value
})

function apiErrorHandler(e) {
  const status = e.response.status

  if (status === 422) {
    const data = e.response.data
    data.detail.forEach((f) => {
      if (f.loc.equals(['body', 'scheduler_name'])) {
        name.setErrors(['Nazwa akcji musi być unikatowa.'])
      }
    })
  }

  throw new Error(e)
}

async function createScheduler(scheduler) {
  return await api
    .post('/backups/schedulers', scheduler)
    .then((res) => res.data)
    .catch(apiErrorHandler)
}

const queryClient = useQueryClient()
const { error, mutate, reset } = useMutation({
  mutationFn: createScheduler,
  onSuccess: (newScheduler) => {
    queryClient.setQueryData(['schedulers'], (oldData) => {
      const updatedData = oldData ? [...oldData, newScheduler] : [newScheduler]
      return updatedData
    })
    onClose()
  }
})

const submit = handleSubmit(async (values) => {
  isLoading.value = true
  const data = {
    scheduler_name: values.name,
    app: values.db,
    schedule: `${values.minute} ${values.hour} ${values.dayOfMonth} ${values.month} ${values.dayOfWeek}`
  }

  mutate(data)
  isLoading.value = false
})
</script>
<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <v-card prepend-icon="mdi-clock" title="Nowa akcja">
        <form @submit.prevent="submit">
          <v-card-text>
            <v-row dense>
              <v-col cols="12" md="12" sm="12">
                <v-text-field label="Nazwa" required v-model="name.value.value" :counter="10"
                  :error-messages="name.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="12" md="12" sm="12">
                <v-select :items="databases" label="Baza" required v-model="db.value.value"
                  :error-messages="db.errorMessage.value"></v-select>
              </v-col>

              <v-col cols="2" md="2" sm="12">
                <v-text-field label="Minuta" required v-model="minute.value.value" :counter="10"
                  :error-messages="minute.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="2" md="2" sm="12">
                <v-text-field label="Godzina" type="text" required v-model="hour.value.value" :counter="10"
                  :error-messages="hour.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="3" md="3" sm="12">
                <v-text-field label="Dzień miesiąca" type="text" required v-model="dayOfMonth.value.value" :counter="10"
                  :error-messages="dayOfMonth.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="2" md="2" sm="12">
                <v-text-field label="Misiąc" type="text" required v-model="month.value.value" :counter="10"
                  :error-messages="month.errorMessage.value"></v-text-field>
              </v-col>
              <v-col cols="3" md="3" sm="12">
                <v-text-field label="Dzień tygodnia" type="text" required v-model="dayOfWeek.value.value" :counter="10"
                  :error-messages="dayOfWeek.errorMessage.value"></v-text-field>
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
        <v-btn class="mb-2" color="primary" dark v-bind="props"> Dodaj akcje </v-btn>
      </template>
    </v-dialog>
  </div>
</template>
