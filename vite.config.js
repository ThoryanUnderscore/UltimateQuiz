import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Remplace 'nom-de-ton-depot' par le nom exact de ton projet sur GitHub
  base: '/UltimateQuiz/', 
  plugins: [react()],
})
