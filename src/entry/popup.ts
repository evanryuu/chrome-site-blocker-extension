import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import VueCountdown from '@chenfengyuan/vue-countdown';

import App from '../view/popup.vue';

import 'element-plus/dist/index.css';
import '@/styles/index.css';

const app = createApp(App);

app.component(VueCountdown.name!, VueCountdown);
app.use(ElementPlus);
app.mount('#app');
