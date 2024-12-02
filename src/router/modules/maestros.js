import AdminLayout from '@/layouts/adminLayout/adminLayout.vue'

const maestrosRoutes = {
  path: '/maestros',
  component: AdminLayout,
  redirect: '/maestros/clases',
  name: 'Maestros',
  meta: {
    title: 'Maestros',
    icon: 'hi-identification',
    noCache: true,
     permissions: [
      'maestros.areas.listar',
      'maestros.cargos.listar',
      'maestros.regimenlaboral.listar',
    ]
  },
  children: [
    {
      path: 'areas',
      component: () => import('@/views/maestros/areas/AreasView.vue'),
      name: 'MaestrosAreas',
      meta: { title: 'Areas', noCache: true },
    },
    {
      path: 'cargos',
      component: () => import('@/views/maestros/cargos/CargosView.vue'),
      name: 'MaestrosCargos',
      meta: { title: 'Cargos', noCache: true },
    },
    {
      path: 'regimenlaboral',
      component: () => import('@/views/maestros/regimenlaboral/RegimenLaboralView.vue'),
      name: 'MaestrosRegimenLaboral',
      meta: { title: 'Regimen laboral', noCache: true },
    },
  ]
}

export default maestrosRoutes