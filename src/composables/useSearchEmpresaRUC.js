// src/composables/useSearchEmpresaRUC.js
// import { ref } from 'vue'
import Resource from '@/api/resource'
import { reactive, ref, watch, onMounted, nextTick } from 'vue'
import { ElNotification } from 'element-plus'

// Crea una instancia del recurso
const consultaDNIRequest = new Resource('consultaruc')

const useSearchEmpresaRUC = () => {
//   const loadingData = ref(false)

  const searchEmpresa = async (ruc) => {

    const regex = /^\d{11}$/
    if (!regex.test(ruc)) {
      ElNotification({
        type: 'error',
        title: 'Número de RUC inválido',
        duration: 2000
      })
      return null
    }

    try {
      const response = await consultaDNIRequest.get(ruc)
      const { state, data, message } = response

    //   console.log('Persona', data)

      if (state === 'success') {
        const empresa = data.empresa || null
        return {
          id: empresa.id || null ,
          activo: empresa.activo || null ,
          activo_es: empresa.activo_es || null ,
          codigo: empresa.codigo || null ,
          email: empresa.email || null ,
          entidad_id: empresa.entidad_id || null ,
          estado: empresa.estado || null ,
          flota: empresa.flota || null ,
          nombre_comercial_es: empresa.nombre_comercial_es || null ,
          propietario_id: empresa.propietario_id || null ,
          razon_social_es: empresa.razon_social_es || null,
          resolucion: empresa.resolucion || null,
          ruc_es: empresa.ruc_es || null,
          servicio_id: empresa.servicio_id || null,
          telefono_id: empresa.telefono_id || null,
        }
      } else {
        ElNotification({
          type: 'error',
          title: message || 'Error al consultar el RUC',
          duration: 2000
        })
        return null
      }
    } catch (err) {
      console.error(err)
      ElNotification({
        type: 'error',
        title: 'Error al consultar el RUC',
        duration: 2000
      })
      return null
    }
  }

  return {
    searchEmpresa
  }
}

export default useSearchEmpresaRUC
