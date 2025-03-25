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
  <div class="p-6 max-w-7xl mx-auto">
    <h1 class="text-2xl font-semibold text-center mb-6">Список бронювань</h1>

    <router-link to="/reservation">
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 focus:outline-none mb-4 block mx-auto"
      >
        Додати нове бронювання
      </button>
    </router-link>

    <ul class="space-y-4">
      <li
        v-for="res in reservations"
        :key="res.reservationID"
        class="bg-white p-4 shadow-lg rounded-lg"
      >
        <div class="flex justify-between items-center">
          <span class="text-lg font-medium">
            Бронювання #{{ res.reservationID }} | Готель: {{ res.hotelID }} | Дата в'їзду:
            {{ res.checkin }}
          </span>
          <div class="flex space-x-2">
            <button
              @click="editReservation(res.reservationID)"
              class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 focus:outline-none"
            >
              Редагувати
            </button>
            <button
              @click="deleteReservation(res.reservationID)"
              class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none"
            >
              Видалити
            </button>
          </div>
        </div>
      </li>
    </ul>

    <div class="p-10 mb-14">
      <router-view></router-view>
    </div>
  </div>
</template>
