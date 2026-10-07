import { createRouter, createWebHistory, type RouteComponent, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { site } from '@/config/site'

// Las rutas de /admin usan otro layout (meta.layout) y exigen cuenta de administración.
const admin = (
  path: string,
  name: string,
  title: string,
  view: () => Promise<RouteComponent>,
): RouteRecordRaw => ({
  path,
  name,
  component: view,
  meta: { title, requiresAuth: true, requiresAdmin: true, layout: 'admin' },
})

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/HomeView.vue'),
    meta: { title: site.name },
  },
  {
    path: '/tienda/:category?',
    name: 'Shop',
    component: () => import('@/views/ShopView.vue'),
    meta: { title: 'Tienda' },
  },
  {
    path: '/producto/:slug',
    name: 'Product',
    component: () => import('@/views/ProductView.vue'),
    meta: { title: 'Producto' },
  },
  {
    path: '/nosotros',
    name: 'About',
    component: () => import('@/views/AboutView.vue'),
    meta: { title: 'Nosotros' },
  },
  {
    path: '/carrito',
    name: 'Cart',
    component: () => import('@/views/CartView.vue'),
    meta: { title: 'Carrito' },
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/CheckoutView.vue'),
    meta: { title: 'Finalizar compra' },
  },
  {
    path: '/pago/respuesta',
    name: 'PaymentResponse',
    component: () => import('@/views/PaymentResponseView.vue'),
    meta: { title: 'Confirmando tu pago' },
  },
  {
    path: '/pago/reintentar',
    name: 'PaymentRetry',
    component: () => import('@/views/PaymentRetryView.vue'),
    meta: { title: 'Reintentar pago' },
  },
  {
    path: '/pedido/:orderNumber',
    name: 'Order',
    component: () => import('@/views/OrderView.vue'),
    meta: { title: 'Tu pedido' },
  },
  {
    path: '/mi-pedido',
    name: 'OrderLookup',
    component: () => import('@/views/OrderLookupView.vue'),
    meta: { title: 'Consultar pedido' },
  },
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: 'Ingresar', guestOnly: true, layout: 'bare' },
  },
  admin('/admin', 'AdminDashboard', 'Panel', () => import('@/views/admin/AdminDashboardView.vue')),
  admin('/admin/productos', 'AdminProducts', 'Productos', () => import('@/views/admin/AdminProductsView.vue')),
  admin('/admin/productos/nuevo', 'AdminProductNew', 'Nuevo producto', () => import('@/views/admin/AdminProductEditView.vue')),
  admin('/admin/productos/:id', 'AdminProductEdit', 'Editar producto', () => import('@/views/admin/AdminProductEditView.vue')),
  admin('/admin/categorias', 'AdminCategories', 'Categorías', () => import('@/views/admin/AdminCategoriesView.vue')),
  admin('/admin/pedidos', 'AdminOrders', 'Pedidos', () => import('@/views/admin/AdminOrdersView.vue')),
  admin('/admin/pedidos/:id', 'AdminOrderDetail', 'Pedido', () => import('@/views/admin/AdminOrderDetailView.vue')),
  admin('/admin/cupones', 'AdminCoupons', 'Cupones', () => import('@/views/admin/AdminCouponsView.vue')),
  admin('/admin/suscriptores', 'AdminSubscribers', 'Suscriptores', () => import('@/views/admin/AdminSubscribersView.vue')),
  admin('/admin/ajustes', 'AdminSettings', 'Ajustes', () => import('@/views/admin/AdminSettingsView.vue')),
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFoundView.vue'),
    meta: { title: 'Página no encontrada' },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Con "atrás" el navegador devuelve la posición guardada; con un hash se
  // baja a la sección; si no, arriba.
  scrollBehavior(to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return { left: 0, top: 0 }
  },
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (to.meta.requiresAuth || to.meta.guestOnly) {
    // La sesión se verifica contra el API una sola vez por carga.
    await userStore.restore()
  }

  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    return { name: 'AdminLogin', query: { next: to.fullPath }, replace: true }
  }

  if (to.meta.requiresAdmin && !userStore.isAdmin) {
    return { name: 'Home', replace: true }
  }

  if (to.meta.guestOnly && userStore.isAdmin) {
    return { name: 'AdminDashboard', replace: true }
  }
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title && title !== site.name ? `${title} — ${site.name}` : site.name
})

export default router
