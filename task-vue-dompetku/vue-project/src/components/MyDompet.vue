<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const entries = ref([]) // Array untuk menyimpan transaksi
const description = ref('') // Model input "Keterangan"
const amount = ref('') // Model input "Jumlah Uang"
const category = ref('') // Model input untuk kategori
const errorMessage = ref('') // Variabel untuk pesan kesalahan

// Fungsi untuk memuat data dari localStorage saat komponen diinisialisasi
onMounted(() => {
  const savedEntries = localStorage.getItem('entries')
  if (savedEntries) {
    entries.value = JSON.parse(savedEntries)
  }
})

// Watcher untuk memperbarui localStorage setiap kali entries berubah
watch(entries, (newEntries) => {
  localStorage.setItem('entries', JSON.stringify(newEntries))
}, { deep: true })

// Fungsi untuk submit entri baru
const submitEntry = () => {
  if (!description.value || !amount.value || !category.value) {
    errorMessage.value = 'Harap mengisi semua field: Keterangan, Jumlah Uang, dan Kategori.'
    return // Hentikan eksekusi jika ada field kosong
  }
  
  // Reset pesan kesalahan jika validasi berhasil
  errorMessage.value = ''

  entries.value.push({
    id: Date.now(),
    description: description.value,
    amount: parseFloat(amount.value),
    category: category.value,
  })
  description.value = ''
  amount.value = ''
  category.value = ''
}

// Fungsi untuk menghapus entri tertentu
const deleteEntry = (id) => {
  entries.value = entries.value.filter(entry => entry.id !== id)
}

// Fungsi untuk menghapus semua entri dengan konfirmasi
const clearAllEntries = () => {
  if (window.confirm('Apakah Anda yakin ingin menghapus semua data?')) {
    entries.value = []
  }
}

// Komputasi untuk total data
const totalEntries = computed(() => entries.value.length)

// Komputasi untuk jumlah uang masuk
const totalIncome = computed(() => {
  return entries.value
    .filter(entry => entry.amount > 0)
    .reduce((sum, entry) => sum + entry.amount, 0)
})

// Komputasi untuk jumlah uang keluar
const totalExpense = computed(() => {
  return entries.value
    .filter(entry => entry.amount < 0)
    .reduce((sum, entry) => sum + Math.abs(entry.amount), 0)
})

// Komputasi untuk saldo total (surplus atau minus)
const balance = computed(() => totalIncome.value - totalExpense.value)
</script>

<template>
  <div class="arsip-dompetku">
    <h2>Dompetku</h2>
    <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div> <!-- Pesan kesalahan -->
    <div class="input-group">
      <label for="description">Keterangan Transaksi:</label>
      <input id="description" v-model="description" placeholder="Masukkan keterangan" />

      <label for="amount">Jumlah Uang (in/out):</label>
      <input id="amount" v-model="amount" type="number" placeholder="Masukkan jumlah uang" />

      <label for="category">Kategori:</label>
      <select id="category" v-model="category">
        <option value="" disabled selected>Pilih Kategori</option>
        <option value="Makanan">Makanan</option>
        <option value="Transport">Transport</option>
        <option value="Tabungan">Tabungan</option>
        <option value="Uang Bulanan">Uang Bulanan</option>
        <option value="Uang Masuk">Uang Masuk</option>
        <option value="Uang Keluar">Uang Keluar</option>
      </select>

      <button @click="submitEntry">Submit</button>
    </div>

    <div v-if="entries.length" class="entry-list">
      <h3>Daftar Transaksi</h3>
      <ul>
        <li v-for="entry in entries" :key="entry.id">
          <span>{{ entry.description }} ({{ entry.category }}) - Rp{{ entry.amount.toLocaleString() }}</span>
          <!-- Ganti tombol delete dengan ikon delete dari Bootstrap -->
          <button @click="deleteEntry(entry.id)" class="btn btn-link p-0">
            <i class="bi bi-trash text-danger"></i>
          </button>
        </li>
      </ul>
      <button @click="clearAllEntries" class="clear-button">Delete All</button>

      <div class="summary">
        <h3>Summary</h3>
        <p>Total Data: {{ totalEntries }}</p>
        <p>Jumlah Uang Masuk: Rp{{ totalIncome.toLocaleString() }}</p>
        <p>Jumlah Uang Keluar: Rp{{ totalExpense.toLocaleString() }}</p>
        <p>Total (Surplus/Minus): Rp{{ balance.toLocaleString() }}</p>
      </div>
    </div>
    <p v-else>Tidak ada transaksi</p>
  </div>
</template>

<style scoped>
.error-message {
  color: red;
  margin-bottom: 1rem;
  text-align: center;
}
.large-spacing {
  margin-bottom: 50px; /* Adjust as needed */
}

.arsip-dompetku {
  max-width: 600px;
  margin: 20px auto;
  padding: 1.5rem;
  background-color: #f5faff;
  border: 1px solid #d0e4f7;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  text-align: center;
  font-size: 2rem;
  color: #333;
  margin-bottom: 1rem;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  margin-bottom: 1.5rem;
}

label {
  font-weight: 600;
  color: #1a1a1a;
}

input, select {
  padding: 0.6rem;
  border: 1px solid #bcd4e6;
  border-radius: 6px;
  outline: none;
  transition: border 0.3s;
}

input:focus, select:focus {
  border-color: #3498db;
}

button {
  padding: 0.6rem;
  color: #fff;
  background-color: #3498db;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #2980b9;
}

.entry-list {
  margin-top: 1rem;
}

.entry-list h3 {
  text-align: center;
  color: #333;
  margin-bottom: 0.5rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid #ddd;
}

li span {
  color: #555;
}

/* Styling tombol delete dengan ikon */
li button {
  padding: 0.3rem 0.6rem;
  background-color: transparent;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  transition: background-color 0.3s;
}

li button:hover {
  background-color: #f5f5f5;
}

.clear-button {
  width: 100%;
  margin-top: 1rem;
  background-color: #e74c3c;
  color: #fff;
  font-weight: bold;
}

.clear-button:hover {
  background-color: #c0392b;
}

.summary {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #e9f7ef;
  border: 1px solid #d4edda;
  border-radius: 8px;
}

.summary p {
  margin: 0.5rem 0;
  color: #333;
}
</style>
