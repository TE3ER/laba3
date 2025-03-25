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
  <div class="p-6 max-w-2xl mx-auto bg-white shadow-lg rounded-lg">
    <h2 class="text-2xl font-semibold text-center mb-6">
      {{ route.params.reservationID ? 'Оновити' : 'Створити' }} бронювання
    </h2>

    <form @submit.prevent="createOrUpdateReservation" class="space-y-4">
      <div class="flex flex-col">
        <label for="customerID" class="text-lg font-medium">Клієнт ID:</label>
        <input
          id="customerID"
          v-model="newReservation.customerID"
          required
          class="p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div class="flex flex-col">
        <label for="hotelID" class="text-lg font-medium">Готель ID:</label>
        <input
          id="hotelID"
          v-model="newReservation.hotelID"
          required
          class="p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div class="flex flex-col">
        <label for="checkin" class="text-lg font-medium">Дата в'їзду:</label>
        <input
          id="checkin"
          type="datetime-local"
          v-model="newReservation.checkin"
          required
          class="p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div class="flex flex-col">
        <label for="checkout" class="text-lg font-medium">Дата виїзду:</label>
        <input
          id="checkout"
          type="datetime-local"
          v-model="newReservation.checkout"
          required
          class="p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div class="flex flex-col">
        <label for="numberOfGuests" class="text-lg font-medium">Кількість гостей:</label>
        <input
          id="numberOfGuests"
          type="number"
          v-model="newReservation.numberOfGuests"
          min="1"
          required
          class="p-2 border border-gray-300 rounded-lg"
        />
      </div>

      <div class="flex flex-col">
        <label for="reservationComments" class="text-lg font-medium">Коментар:</label>
        <textarea
          id="reservationComments"
          v-model="newReservation.reservationComments"
          class="p-2 border border-gray-300 rounded-lg"
        ></textarea>
      </div>

      <button
        type="submit"
        class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
      >
        {{ route.params.reservationID ? 'Оновити' : 'Забронювати' }}
      </button>
    </form>
  </div>
</template>
