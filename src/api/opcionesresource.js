import request from '@/utils/request'

/**
 * Simple RESTful resource class
 */
class OpcionesResource {
  load(model,query) { // corresponde al metodo o funcion index del controlador
    return request({
      url: '/opciones/' + model,
      method: 'get',
      params: query
    })
  }
}

export { OpcionesResource as default }
