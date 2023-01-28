import type { RouteRecordRaw } from 'vue-router';

/**
 * filter routes withou meta || meta.icon || meta.title
 */
export const filterRoutes = (routes: RouteRecordRaw[]) => {
  // 所有路由配置

  const res = routes.filter((route) => route.meta
    && route.meta.icon
    && route.meta.title);

  // eslint-disable-next-line no-restricted-syntax
  for (const route of res) {
    if (route.children && route.children.length > 0) {
      route.children = filterRoutes(route.children) || [];
    }
  }

  return res;
};
