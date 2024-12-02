import { createRouter, createWebHistory } from 'vue-router'
import PublicLayout from '../layouts/publicLayout/publicLayout.vue'
import AdminLayout from '../layouts/adminLayout/adminLayout.vue'
import { useAuthStore } from '../stores/auth';
import getPageTitle from '../utils/get-page-title';
import { getToken } from '../utils/auth';
import authRoutes from './modules/auth';
import maestrosRoutes from './modules/maestros';
import adminRoutes from './modules/admin';

export const routes =  [
  {
    path: '/',
    component: PublicLayout,
    redirect: '/signin',
    hidden: true,
    meta: {
      title: 'Enlaces Publicos',
    },
    children: [
      {
        path: 'home',
        component: () => import('@/views/homeView.vue'),
        name: 'Home',
        meta: { title: 'Pagina Principal'}
      },
      {                     
        path: 'signin',
        name: 'SignIn',
        hidden: true,
        component: () => import('@/views/auth/signInView.vue'),
        meta: { title: 'Login'}
      },
      {
        path: 'about',
        name: 'about',
        component: () => import('@/views/aboutview.vue'),
        meta: { title: 'Acerca de nosotros'}
      }
    ],
  },
  {
    path: "/dashboard",
    component: AdminLayout,
    name: 'Dashboard',
    redirect: '/dashboard/index',
    meta: {
      title: 'Panel',
      icon: 'md-spacedashboard'
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/dashboard/dashboardView.vue'),
        name: 'Panel',
        meta: {title: 'Panel de control', icon: 'md-spacedashboard'}
      }
    ],
  },
  
];
export const asyncRoutes = [
  authRoutes,
  maestrosRoutes,
  adminRoutes,
  {
    path: '/:pathMatch(.*)*',
    name: "NotFound",
    component: () => import('@/views/error-pages/404.vue'),
    hidden: true,
  },
]

const initRouter = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})
const router = initRouter

export function resetRouter() {
  const newRouter = initRouter
  router.matcher = newRouter.matcher // reset router
}

const whiteList = ['/','/home','/about','/signin', '/404'] 

router.beforeEach(async (to, from, next) => {

  const authStore = useAuthStore();

  document.title = getPageTitle(to.meta.title)
  authStore.changePageCurrentInfo(to.meta)
    if(getToken()) {
      if(to.path == '/signin') {
        next('/dashboard');
      } else {
        if(authStore.getRoles && authStore.getRoles.length > 0) {
          next();
        } else {
          try{
            const { roles ,permissions} = await authStore.userInfo();
            // generate accessible routes map based on roles
            await authStore.generateRoutes(roles, permissions)

            // dynamically add accessible routes
            // router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
          } catch(error) {
            console.log(error);
            next(`/signin`);
          }
        }
      }
    } else {
      if (whiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/signin`);
      }
    }
});

// import '../permission' // permission control
export default router
