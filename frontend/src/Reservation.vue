<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute, useRouter } from 'vue-router'

const newReservation = ref({
  customerID: '',
  hotelID: '',
  checkin: '',
  checkout: '',
  numberOfGuests: 1,
  reservationComments: '',
})

const route = useRoute()
const router = useRouter()

// Якщо ми редагуємо бронювання, завантажуємо його
onMounted(async () => {
  if (route.params.reservationID) {
    try {
      const response = await axios.get(
        `http://localhost:3000/reservations/${route.params.reservationID}`,
      )
      Object.assign(newReservation.value, response.data)
    } catch (error) {
      console.error('Помилка при завантаженні бронювання:', error)
    }
  }
})

const createOrUpdateReservation = async () => {
  try {
    // Перетворення дат у формат ISO перед відправленням
    newReservation.value.checkin = new Date(newReservation.value.checkin).toISOString()
    newReservation.value.checkout = new Date(newReservation.value.checkout).toISOString()

    if (route.params.reservationID) {
      await axios.put(
        `http://localhost:3000/reservations/${route.params.reservationID}`,
        newReservation.value,
      )
      alert('Бронювання оновлено!')
    } else {
      await axios.post('http://localhost:3000/reservations', newReservation.value)
      alert('Бронювання створено!')
    }
    router.push('/')
  } catch (error) {
    console.error('Помилка:', error)
  }
}
</script>

<template>
  <div>
    <h2>{{ route.params.reservationID ? 'Оновити' : 'Створити' }} бронювання</h2>
    <form @submit.prevent="createOrUpdateReservation">
      <label>Клієнт ID:</label>
      <input v-model="newReservation.customerID" required />

      <label>Готель ID:</label>
      <input v-model="newReservation.hotelID" required />

      <label>Дата в'їзду:</label>
      <input type="datetime-local" v-model="newReservation.checkin" required />

      <label>Дата виїзду:</label>
      <input type="datetime-local" v-model="newReservation.checkout" required />

      <label>Кількість гостей:</label>
      <input type="number" v-model="newReservation.numberOfGuests" min="1" required />

      <label>Коментар:</label>
      <textarea v-model="newReservation.reservationComments"></textarea>

      <button type="submit">{{ route.params.reservationID ? 'Оновити' : 'Забронювати' }}</button>
    </form>
  </div>
</template>
