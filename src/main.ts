/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

const app = createApp(App)
app.use(VueQueryPlugin)
// export const queryClient = new QueryClient();

registerPlugins(app)

app.mount('#app')
