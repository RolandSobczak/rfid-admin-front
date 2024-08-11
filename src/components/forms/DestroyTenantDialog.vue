<script setup lang="ts">
import { ref } from "vue";

const dialog = ref(false);

const { tenant_id } = defineProps<{ tenant_id: number }>();

function onOpen() {
  dialog.value = true;
}

</script>
<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600">
      <v-card prepend-icon="mdi-domain" title="Nowa organizacja">
        <v-card-text>
          <p>Czy napewno chcesz usunac tenant?</p>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Cofnij" variant="plain" @click="dialog = false"></v-btn>

          <v-btn color="red" text="Usun" @click="dialog = false"></v-btn>
        </v-card-actions>
      </v-card>
      <template v-slot:activator="{ props }">
        <v-icon size="small" @click="onOpen">
          mdi-delete
        </v-icon>
      </template>
    </v-dialog>
  </div>
</template>
