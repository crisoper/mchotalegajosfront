// src/composables/useSearchPlaca.js
// import { ref } from 'vue'
import Resource from '@/api/resource'
import { reactive, ref, watch, onMounted, nextTick } from 'vue'
import { ElNotification } from 'element-plus'

// Crea una instancia del recurso
const consultaPlacaRequest = new Resource('consultaplaca')

const useSearchPlaca = () => {
//   const loadingData = ref(false)

  const searchPlaca = async (placa) => {

    if (placa.length <= 3) {
      ElNotification({
        type: 'error',
        title: 'Número de placa inválido',
        duration: 2000
      })
      return null
    }

    // loadingData.value = true
    try {
      const response = await consultaPlacaRequest.get(placa)
      const { state, data, message } = response

    //   console.log('Persona', data)

      if (state === 'success') {
        return {
          activo: data.activo || null,
          activo_texto: data.activo_texto || null,
          altura: data.altura || null,
          ancho: data.ancho || null,
          anio_fab: data.anio_fab || null,
          anio_fabricacion: data.anio_fabricacion || null,
          anio_modelo: data.anio_modelo || null,
          asientos: data.asientos || null,
          baja: data.baja || null,
          carga_util: data.carga_util || null,
          carroceria_id: data.carroceria_id || null,
          categoria_id: data.categoria_id || null,
          cilindrada: data.cilindrada || null,
          clase_id: data.clase_id || null,
          color: data.color || null,
          combustible_id: data.combustible_id || null,
          deuda: data.deuda || null,
          estadov: data.estadov || null,
          fecha_venc: data.fecha_venc || null,
          fechaexp_revtec: data.fechaexp_revtec || null,
          fechaven_revtec: data.fechaven_revtec || null,
          full_name: data.full_name || null,
          id: data.id || null,
          idestado: data.idestado || null,
          inspecciones: data.inspecciones || [],
          longitud: data.longitud || null,
          marca: data.marca || null,
          marca_id: data.marca_id || null,
          modelo: data.modelo || null,
          modelo_id: data.modelo_id || null,
          motor: data.motor || null,
          nro_asientos: data.nro_asientos || null,
          nro_ejes: data.nro_ejes || null,
          nro_puertas: data.nro_puertas || null,
          nro_revtec: data.nro_revtec || null,
          nro_ruedas: data.nro_ruedas || null,
          nropapeletas: data.nropapeletas || null,
          num_soat: data.num_soat || null,
          partida_registral: data.partida_registral || null,
          pasajeros: data.pasajeros || null,
          peso_bruto: data.peso_bruto || null,
          peso_neto: data.peso_neto || null,
          placa: data.placa || null,
          placa_ant: data.placa_ant || null,
          sane: data.sane || null,
          serie: data.serie || null,
          soats: data.soats || [],
          tarjeta_propiedad: data.tarjeta_propiedad || null,
          tiposoat_id: data.tiposoat_id || null,
          vin: data.vin || null,
        }
      } else {
        ElNotification({
          type: 'error',
          title: message || 'Error al consultar la Placa',
          duration: 2000
        })
        return null
      }
    } catch (err) {
      console.error(err)
      ElNotification({
        type: 'error',
        title: 'Error al consultar la Placa',
        duration: 2000
      })
      return null
    }
  }

  return {
    searchPlaca
  }
}

export default useSearchPlaca
