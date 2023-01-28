import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import VueCountdown from '@chenfengyuan/vue-countdown';

import router from '@/router';
import App from '../view/options.vue';

import 'element-plus/dist/index.css';
import '@/styles/index.css';

const app = createApp(App);

app.component(VueCountdown.name, VueCountdown);

app.use(ElementPlus);
app.use(router);
app.mount('#app');
