<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'

const reservations = ref([])
const router = useRouter()

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/reservations')
    reservations.value = response.data
  } catch (error) {
    console.error('Error fetching reservations:', error)
  }
})

// Функція для видалення бронювання
const deleteReservation = async (reservationID) => {
  try {
    await axios.delete(`http://localhost:3000/reservations/${reservationID}`)
    reservations.value = reservations.value.filter((res) => res.reservationID !== reservationID)
    alert('Бронювання видалено!')
  } catch (error) {
    console.error('Помилка при видаленні бронювання:', error)
  }
}

// Функція для переходу на сторінку редагування бронювання
const editReservation = (reservationID) => {
  router.push(`/reservation/${reservationID}`)
}
</script>

<template>
  <div>
    <h1>Список бронювань</h1>
    <router-link to="/reservation">
      <button>Додати нове бронювання</button>
    </router-link>
    <ul>
      <li v-for="res in reservations" :key="res.reservationID">
        <div>
          Бронювання #{{ res.reservationID }} | Готель: {{ res.hotelID }} | Дата в'їзду:
          {{ res.checkin }}
          <button @click="editReservation(res.reservationID)">Редагувати</button>
          <button @click="deleteReservation(res.reservationID)">Видалити</button>
        </div>
      </li>
    </ul>
    <div class="p-10 mb-14">
      <router-view></router-view>
    </div>
  </div>
</template>
