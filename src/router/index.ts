import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import {
  Cpu,
  House,
} from '@element-plus/icons-vue';
// import FocusMode from '../view/options/focus-mode.vue';

import Layout from '../view/options/layouts/index.vue';
import SiteSettings from '../view/options/site-settings.vue';
import BlockPage from '../view/options/block-page.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    component: Layout,
    redirect: '/site-settings',
    children: [
      {
        path: '/site-settings',
        name: 'SiteSettings',
        component: SiteSettings,
        meta: {
          title: 'Site Settings',
          icon: House,
        },
      },
      {
        path: '/focus-mode',
        name: 'FocusMode',
        meta: {
          title: 'Focus Mode',
          icon: Cpu,
        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../view/options/focus-mode.vue'),
      },
    ],

  },
  {
    path: '/block-page',
    component: BlockPage,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
