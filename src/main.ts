import { createSSRApp } from "vue"
import App from "./App.vue"
import * as Pinia from "pinia"

export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.provide('API_URL', import.meta.env.VITE_API_URL)
  return {
    app,
    Pinia
  }
}
