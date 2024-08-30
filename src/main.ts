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

if (Array.prototype.equals)
  console.warn("Overriding existing Array.prototype.equals. Possible causes: New API defines the method, there's a framework conflict or you've got double inclusions in your code.");

Array.prototype.equals = function(array) {
  if (!array)
    return false;
  if (array === this)
    return true;
  if (this.length != array.length)
    return false;

  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] instanceof Array && array[i] instanceof Array) {
      if (!this[i].equals(array[i]))
        return false;
    }
    else if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
}

Array.prototype.unique = function <T, K>(this: T[], callback: (e: T) => K) {
  const check: K[] = []

  return this.filter(e => {
    const objId = callback(e)
    const existingId = check.indexOf(objId)
    if (existingId !== -1) return false

    check.push(objId)
    return true
  })
}

Object.defineProperty(Array.prototype, "equals", { enumerable: false });

const app = createApp(App)
app.use(VueQueryPlugin)

registerPlugins(app)

app.mount('#app')
