import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import CRUDComposite from './components/composites/CRUDComposite.vue'
import './style.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.component('CRUDComposite', CRUDComposite)
app.mount('#app')
