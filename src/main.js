import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import Avatar from "primevue/avatar";
import Menubar from "primevue/menubar";
import PrimeVue from 'primevue/config';
import Badge from "primevue/badge";
import Aura from '@primevue/themes/aura';
import 'primeicons/primeicons.css'


const app = createApp(App)

app.use(PrimeVue, {
    ripple: true, theme: {
        preset: Aura, options: {
            prefix: 'p',
            darkModeSelector: 'system',
            cssLayer: false
        }
    }
});

app.component('pv-avatar', Avatar)
    .component('pv-menubar', Menubar)
    .component('pv-badge', Badge)

app.mount('#app')
