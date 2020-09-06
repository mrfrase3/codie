import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue'),
    meta: { isPublic: true, onlyPublic: true },
  },
  {
    path: '/users',
    name: 'Users',
    component: () => import(/* webpackChunkName: "users" */ '../views/Users.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const isPublic = to.matched.some((route) => !!route.meta.isPublic);
  const onlyPublic = to.matched.some((route) => !!route.meta.onlyPublic);
  if (to.path === '/logout') {
    // eslint-disable-next-line no-console
    return store.dispatch('auth/logout').then(() => next({ path: '/login' })).catch(console.error);
  }
  if (onlyPublic && store.state.auth.isLoggedIn) {
    return next({ path: '/' });
  }
  if (!isPublic && !store.state.auth.isLoggedIn) {
    return next({
      path: '/login',
      query: to.path === '/' ? {} : { followPath: to.path },
    });
  }
  return next();
});

export default router;
