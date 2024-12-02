// src/composables/useSearchPersona.js
// import { ref } from 'vue'
import Resource from '@/api/resource'
import { reactive, ref, watch, onMounted, nextTick } from 'vue'
import { ElNotification } from 'element-plus'

// Crea una instancia del recurso
const consultaDNIRequest = new Resource('consultadni')

const useSearchPersona = () => {
//   const loadingData = ref(false)

  const searchPersona = async (nro_documento) => {
    const regex = /^\d{8}$/
    if (!regex.test(nro_documento)) {
      ElNotification({
        type: 'error',
        title: 'Número de documento inválido',
        duration: 2000
      })
      return null
    }

    // loadingData.value = true
    try {
      const response = await consultaDNIRequest.get(nro_documento)
      const { state, data, message } = response

    //   console.log('Persona', data)

      if (state === 'success') {
        return {
            id: data.id || '',
            ape_paterno: data.paterno || '',
            ape_materno: data.materno || '',
            nombres: data.nombre || '',
            nombre_completo: data.nombre_completo || '',
            domicilio: data.direccionReniec || '',
            telefono: data.telefono || '',
            email: data.correo || '',
            telefonos: data.telefonos || []
        }
      } else {
        ElNotification({
          type: 'error',
          title: message || 'Error al consultar el DNI',
          duration: 2000
        })
        return null
      }
    } catch (err) {
      console.error(err)
      ElNotification({
        type: 'error',
        title: 'Error al consultar el DNI',
        duration: 2000
      })
      return null
    }
  }

  return {
    searchPersona
  }
}

export default useSearchPersona
