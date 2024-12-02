import AdminLayout from '@/layouts/adminLayout/adminLayout.vue'

const authRoutes = {
  path: '/autenticacion',
  component: AdminLayout,
  redirect: '/autenticacion/usuarios',
  name: 'Autenticacion',
  meta: {
    title: 'Autenticación',
    icon: 'hi-identification',
    noCache: true,
    // ,
    permissions: ['auth.permisos.listar', 'auth.roles.listar', 'auth.usuarios.listar']
  },
  children: [
    {
      path: 'miperfil',
      component: () => import('@/views/admin/auth/users/Profile.vue'),
      hidden: true,
      meta: { title: 'Mi perfil', noCache: true },
    },
    {
      path: 'permisos',
      component: () => import('@/views/admin/auth/permissions/PermissionsView.vue'),
      name: 'PermisosAuth',
      // meta: { title: 'Permisos', icon: 'md-playlistaddcheck-round', noCache: true, permissions: ['auth.permisos.listar'] }
      meta: { title: 'Permisos', noCache: true, permissions: ['auth.permisos.listar'] }
    },
    {
      path: 'roles',
      component: () => import('@/views/admin/auth/roles/RolesView.vue'),
      name: 'RolesAuth',
      meta: { title: 'Roles', noCache: true, permissions: ['auth.roles.listar'] }
      // meta: { title: 'Roles', icon: 'bi-person-lines-fill', noCache: true, permissions: ['auth.roles.listar'] }
    },
    {
      path: 'usuarios',
      component: () => import('@/views/admin/auth/users/UsersView.vue'),
      name: 'UsuariosAuth',
      // meta: { title: 'Usuarios', icon: 'hi-solid-users', noCache: true, permissions: ['auth.usuarios.listar'] }
      meta: { title: 'Usuarios', noCache: true, permissions: ['auth.usuarios.listar'] }
    }
  ]
}

export default authRoutes