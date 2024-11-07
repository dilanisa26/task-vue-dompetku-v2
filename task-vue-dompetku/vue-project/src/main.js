import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css'
// Import Bootstrap Icons
import 'bootstrap-icons/font/bootstrap-icons.css'
// const vuetify = createVuetify({
//     components,
//     directives,
//     icons: {
//       defaultSet: 'mdi',
//       aliases,
//       sets: {
//         mdi,
//       },
//     },
//   })

const app = createApp(App)
// app.use(vuetify)
app.use(createPinia())
app.use(router)

app.mount('#app')