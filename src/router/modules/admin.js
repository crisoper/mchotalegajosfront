import AdminLayout from '@/layouts/adminLayout/adminLayout.vue'

const adminRoutes = {
  path: '/administracion',
  component: AdminLayout,
  redirect: '/administracion/personas',
  name: 'Administracion',
  meta: {
    title: 'Administración',
    icon: 'hi-identification',
    noCache: true,
    // ,
     permissions: [
      'administracion.personas.listar',
    ]
  },
  children: [
    {
      path: 'personas',
      component: () => import('@/views/administracion/personas/PersonaView.vue'),
      name: 'AdministracionPersonas',
      meta: { title: 'Personas', noCache: true },
    },
    {
      path: 'legajos',
      component: () => import('@/views/administracion/legajos/LegajosView.vue'),
      name: 'AdministracionLegajos',
      meta: { title: 'Legajos', noCache: true },
    },
    {
      path: 'legajos/secciones/:id',
      name: 'AdminLegajosSecciones',
      component: () => import('@/views/administracion/legajos/components/LegajosSecciones.vue'), // El componente que manejará esta ruta
      meta: { title: 'Legajo secciones', noCache: true },
      hidden: true,
      props: true, // Esto permite pasar los parámetros de ruta como props al componente
    }
  ]
}

export default adminRoutes