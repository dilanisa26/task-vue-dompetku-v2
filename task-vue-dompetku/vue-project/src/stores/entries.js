// src/stores/entries.js
import { defineStore } from 'pinia'

export const useEntriesStore = defineStore('entries', {
  state: () => ({
    entries: JSON.parse(localStorage.getItem('entries')) || []
  }),
  actions: {
    // Function to add a new entry
    addEntry(entry) {
      this.entries.push(entry)
      this.saveToLocalStorage()
    },
    // Function to delete an entry by ID
    deleteEntry(id) {
      this.entries = this.entries.filter(entry => entry.id !== id)
      this.saveToLocalStorage()
    },
    // Function to clear all entries
    clearAllEntries() {
      if (window.confirm('Apakah Anda yakin ingin menghapus semua data?')) {
        this.entries = []
        this.saveToLocalStorage()
      }
    },
    // Function to save entries to localStorage
    saveToLocalStorage() {
      localStorage.setItem('entries', JSON.stringify(this.entries))
    }
  },
  getters: {
    totalEntries: (state) => state.entries.length,
    totalIncome: (state) => {
      return state.entries
        .filter(entry => entry.amount > 0)
        .reduce((sum, entry) => sum + entry.amount, 0)
    },
    totalExpense: (state) => {
      return state.entries
        .filter(entry => entry.amount < 0)
        .reduce((sum, entry) => sum + Math.abs(entry.amount), 0)
    },
    balance: (state) => {
      return state.totalIncome - state.totalExpense
    }
  }
})
