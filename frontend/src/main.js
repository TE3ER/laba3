import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router'

import Reservation from './Reservation.vue'
const app = createApp(App)

const routes = [{ path: '/reservation', name: 'reservation', component: Reservation }]

const router = createRouter({
  history: createWebHistory(),
  routes,
})
app.use(router)

app.mount('#app')
