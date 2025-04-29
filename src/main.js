import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import * as iconSet from '@coreui/icons' // 👈 change ici !

import DocsComponents from '@/components/DocsComponents'
import DocsExample from '@/components/DocsExample'
import DocsIcons from '@/components/DocsIcons'
import '@fortawesome/fontawesome-free/css/all.min.css'


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.use(CoreuiVue)

app.provide('icons', iconSet) // 👈 et ici !
app.component('CIcon', CIcon)
app.component('DocsComponents', DocsComponents)
app.component('DocsExample', DocsExample)
app.component('DocsIcons', DocsIcons)

app.mount('#app')
