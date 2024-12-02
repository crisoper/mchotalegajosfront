// import request from '@/utils/request'

import Resource from '../resource'

class UserRequest extends Resource {
  constructor() {
    super('auth/usuarios')
  }
}

export { UserRequest as default }