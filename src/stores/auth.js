import { defineStore } from 'pinia'
import { csrf, signin, userInfo } from '../api/auth'
import { setToken, getToken, removeToken } from '../utils/auth'
import { logout, logoutAllSessions } from '@/api/auth'
import router, { asyncRoutes, routes, resetRouter } from '../router'
export const useAuthStore = defineStore('AuthStore', {
  state: () => ({
    token: getToken(),
    id: null,
    name: null,
    trabajador: null,
    email: null,
    avatar: null,
    roles: [],
    procesoActual: {id: null, anio:null, descripcion: ''},
    permissions: [],
    userAccessRoutes: [],
    currentPageInfo: {title: null, icon: null}
  }),
  getters: {
    getUser: (state) => state.trabajador,
    getRoles: (state) => state.roles,
    getPermissions: (state) => state.permissions,
    getCurrentPageInfo: (state) => state.currentPageInfo,
    validPermision: (state) => (param) => {
      // Lógica del getter usando el parámetro
      // console.log(state.permissions.includes(param))
      return state.permissions.includes(param)
    },
  },
  actions: {
    setToken(token) {
      this.token = token
    },
    async signIn(userCredentials) {
      // csrf cookie
      await csrf()
      return new Promise((resolve, reject) => {
        signin(userCredentials)
          .then((response) => {
            const { token } = response
            this.setToken(token)
            setToken(token)
            resolve()
          })
          .catch((error) => {
            reject(error)
          })
      })
    },
    async userInfo() {
      return new Promise((resolve, reject) => {
        userInfo()
          .then(async (response) => {
            const { data } = response
            if (!data) {
              reject('Ha surgido un error, inténtelo nuevamente')
            }

            
            // console.log(data)
            const { infouser, configdata} = data
            
            // console.log(configdata)
            const { id, name, email, trabajador ,avatar, roles, permissions } = infouser // Accede a roles y permissions desde data

            this.id = id
            this.name = name
            this.trabajador = trabajador
            this.email = email
            this.avatar = avatar
            this.roles = roles // Utiliza roles directamente desde data
            this.permissions = permissions // Utiliza permissions directamente desde data

            this.procesoActual = {
              id: configdata?.procesoactual?.id,
              anio: configdata?.procesoactual?.anio,
              descripcion: configdata?.procesoactual?.descripcion
            }

            // console.log(this.procesoActual)

            // this.generateRoutes(this.roles, this.permissions);
            resolve({roles,permissions});
          })
          .catch((error) => {
            this.resetSession()
            reject(error)
          })
      })
    },
    async logout(action) {
      return new Promise((resolve, reject) => {
        if (action == 'all') {
          logoutAllSessions()
            .then(() => {
              this.resetSession()
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
        } else {
          logout()
            .then(() => {
              this.resetSession()
              resolve()
            })
            .catch((error) => {
              reject(error)
            })
        }
      })
    },
    resetSession() {
      ;(this.token = null),
        (this.id = null),
        (this.name = null),
        (this.email = null),
        (this.avatar = null),
        (this.roles = []),
        (this.permissions = []),
        (this.userAccessRoutes = []),
        removeToken()
      resetRouter()
    },
    async generateRoutes(roles, permissions) {
      return new Promise((resolve) => {
        let accessedRoutes
        if (roles.includes('Administrador')) {
          accessedRoutes = asyncRoutes || []
        } else {
          accessedRoutes = defineUserAccessRoutes(asyncRoutes, roles, permissions)
        }

        this.userAccessRoutes = routes.concat(accessedRoutes)
        accessedRoutes.forEach((route) => {
          router.addRoute(route)
        })
        // resolve(this.userAccessRoutes)
        resolve()
      })
    },
    resetToken() {
      return new Promise((resolve) => {
        this.token = null
        this.roles = []
        removeToken()
        resolve()
      })
    },
    changePageCurrentInfo(info) {
      this.currentPageInfo = info
    }
  }
})

function defineUserAccessRoutes(routes, roles, permissions) {
  const userAccesRoutes = []

  routes.forEach((route) => {
    const tmp = { ...route }
    if (canAccess(roles, permissions, tmp)) {
      if (tmp.children) {
        tmp.children = defineUserAccessRoutes(tmp.children, roles, permissions)
      }
      userAccesRoutes.push(tmp)
    }
  })

  return userAccesRoutes
}

function canAccess(roles, permissions, route) {
  if (route.meta) {
    let hasRole = true
    let hasPermission = true
    if (route.meta.roles || route.meta.permissions) {
      hasRole = false
      hasPermission = false
      if (route.meta.roles) {
        hasRole = roles.some((role) => route.meta.roles.includes(role))
      }

      if (route.meta.permissions) {
        hasPermission = permissions.some((permission) =>
          route.meta.permissions.includes(permission)
        )
      }
    }
    return hasRole || hasPermission
  }

  // If no meta.roles/meta.permissions inputted - the route should be accessible
  return true
}
