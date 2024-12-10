import AdminLayout from '@/layouts/adminLayout/adminLayout.vue'

const adminRoutes = {
  path: '/reportes',
  component: AdminLayout,
  redirect: '/reportes/legajos',
  name: 'Reportes',
  meta: {
    title: 'Reportes',
    icon: 'hi-identification',
    noCache: true,
     permissions: [
      'reportes.legajos.listar',
    ]
  },
  children: [
    {
      path: 'legajos',
      component: () => import('@/views/reportes/ReporteLegajosView.vue'),
      name: 'ReporteLegajos',
      meta: { title: 'Reporte Legajos', noCache: true },
    },
  ]
}

export default adminRoutes