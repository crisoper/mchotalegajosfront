<template>
  <div v-loading="loading">
    <el-card shadow="never" class="mb-3">
      <h2>Detalles de sección</h2>
    </el-card>
    <!-- <el-button @click="getSectionDetails(legajoId);">Recargar</el-button> -->
    <el-row :gutter="12">
      <el-col :xs="24" :sm="24" :md="24">
        <el-card v-if="dataLegajoSeccion" shadow="never">
          <template #header>
            <div class="card-header">
              <span>Información general</span>
            </div>
          </template>
          <table class="table-secciones-info">
            <tbody>
              <tr>
                <td class="bg-gray-200">Número</td>
                <td>{{ dataLegajoSeccion.numero }}</td>
              </tr>
              <tr>
                <td class="bg-gray-200">Trabajador</td>
                <td>{{ dataLegajoSeccion.persona?.nro_documento }} - {{ dataLegajoSeccion.persona?.nombre_completo }}</td>
              </tr>
              <tr>
                <td class="bg-gray-200">Área</td>
                <td>{{ dataLegajoSeccion.trabajador?.area?.nombre }}</td>
              </tr>
              <tr>
                <td class="bg-gray-200">Cargo</td>
                <td>{{ dataLegajoSeccion.trabajador?.cargo?.nombre }}</td>
              </tr>
              <tr>
                <td class="bg-gray-200">Régimen laboral</td>
                <td>{{ dataLegajoSeccion.trabajador?.regimenlaboral?.nombre }}</td>
              </tr>
              <tr>
                <td class="bg-gray-200">Estado</td>
                <td>{{ dataLegajoSeccion.estado }}</td>
              </tr>
            </tbody>
          </table>
        </el-card>
        <el-card v-else>
          <p>Cargando datos...</p>
        </el-card>
      </el-col>
    </el-row>
    <el-row :gutter="12" v-for="legajoseccion in dataLegajoSeccion.legajosecciones" :key="legajoseccion.id" class="mt-4">
      <el-col :xs="24" :sm="24" :md="24">
        <el-card shadow="never">
          <template #header>
            <div class="card-header">
              <span>{{ legajoseccion.seccion?.descripcion }}</span>
            </div>
          </template>
          <div>
            <table class="table-secciones">
              <tr class="bg-gray-200">
                <td>Documentos</td>
                <td class="w-24">Última actualización</td>
                <td class="w-24">Acciones</td>
                </tr>
            </table>
            <div v-for="(nivel2) in legajoseccion.seccioneslevel2" :key="nivel2.id">
              <table class="table-secciones">
                <tr :class="{'bg-gray-100' : nivel2.seccioneslevel3.length > 0}">
                  <td>{{ nivel2.seccion?.descripcion }}</td>
                  <td class="w-24">
                    {{ nivel2.infopersonal?.updated_es }}
                  </td>
                  <td class="w-24">
                    <el-button v-if="nivel2.seccioneslevel3.length == 0" type="primary" @click="agregarDocumento(nivel2, legajoseccion)">
                      Ver
                    </el-button>
                  </td>
                </tr>
                <tr v-for="(nivel3) in nivel2.seccioneslevel3" :key="nivel3.id">
                  <td>{{ nivel3.seccion?.descripcion }}</td>
                  <td class="w-24">
                    {{ nivel3.infopersonal?.updated_es }}
                  </td>
                  <td class="w-24">
                    <el-button type="primary" @click="agregarDocumento(nivel3, legajoseccion)">
                      Ver
                    </el-button>
                  </td>
                </tr>
              </table>
          </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- Diálogo de Form Legajo -->
    <el-dialog
      top="3vh"
      v-model="openDialogForm"
      :width="calcularAnchoDialog('94%', '98%')" 
      :before-close="beforeCloseDFPersona"
      :close-on-click-modal="false"
    >
      <!-- fullscreen -->
      <template #header>
        <h3>{{ titleForm }}</h3>
      </template>
      <component
        :is="currentComponent"
        ref="refFormLegajos"
        :id-legajo-seccion="idItemToEdit"
        :id-legajo="idLegajo"
        :text-seccion="textSeccion"
        @close="handleCloseFormLegajoSeccion"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, watch, ref, reactive, markRaw } from 'vue';
import { useRoute } from 'vue-router';
import Resource from '@/api/resource'
import { ElNotification } from 'element-plus'
import FormLegajosSeccion from '@/views/administracion/legajos/components/FormLegajosSeccion.vue'

import FormLegajosDesempenio from '@/views/administracion/legajos/components/FormLegajosDesempenio.vue'
import FormLegajosDesvinculacion from '@/views/administracion/legajos/components/FormLegajosDesvinculacion.vue'
import FormLegajosEstudios from '@/views/administracion/legajos/components/FormLegajosEstudios.vue'
import FormLegajosExperiencia from '@/views/administracion/legajos/components/FormLegajosExperiencia.vue'
import FormLegajosInfoPersonal from '@/views/administracion/legajos/components/FormLegajosInfoPersonal.vue'
import FormLegajosIncorporacion from '@/views/administracion/legajos/components/FormLegajosIncorporacion.vue'
import FormLegajosMovimientos from '@/views/administracion/legajos/components/FormLegajosMovimientos.vue'
import FormLegajosSst from '@/views/administracion/legajos/components/FormLegajosSst.vue'
import FormLegajosReconocimientos from '@/views/administracion/legajos/components/FormLegajosReconocimientos.vue'
import FormLegajosRellaborales from '@/views/administracion/legajos/components/FormLegajosRellaborales.vue'
import FormLegajosCompensaciones from '@/views/administracion/legajos/components/FormLegajosCompensaciones.vue'
import FormLegajosOtros from '@/views/administracion/legajos/components/FormLegajosOtros.vue'

import { calcularAnchoDialog } from '@/utils/responsive'

const seccionLegajoRequest = new Resource('administracion/legajo-secciones')
// const seccionRequest = new Resource('administracion/secciones')
const route = useRoute();
const loading = ref(false)
const openDialogForm = ref(false)
const legajoId = ref(0)
// const secciones = ref([])
const titleForm = ref('')
const idItemToEdit = ref(0)
const idLegajo = ref(-1)
const textSeccion = ref("")
const dataLegajoSeccion = reactive({
  id: undefined,
  descripcion: '',
  nivel: undefined,
  estado: true,
})
const currentComponent = ref(null); // Inicialmente está vacío
// Mapa de tablas a sus componentes
const componentsMap = {
  'legajos_infopersonal': markRaw(FormLegajosInfoPersonal),        // Personal
  'legajos_incorporacion': markRaw(FormLegajosIncorporacion),      // Personal
  'legajos_estudios': markRaw(FormLegajosEstudios),                // Estudios
  'legajos_experiencia': markRaw(FormLegajosExperiencia),          // Experiencia
  'legajos_movimientos': markRaw(FormLegajosMovimientos),          // Movimientos
  'legajos_compensaciones': markRaw(FormLegajosCompensaciones),    // Compensaciones
  'legajos_desempenio': markRaw(FormLegajosDesempenio),            // Desempeño
  'legajos_reconocimientos': markRaw(FormLegajosReconocimientos),  // Reconocimientos
  'legajos_rellaborales': markRaw(FormLegajosRellaborales),        // Relaciones laborales
  'legajos_sst': markRaw(FormLegajosSst),                          // SST (Seguridad y Salud en el Trabajo)
  'legajos_desvinculacion': markRaw(FormLegajosDesvinculacion),    // Desvinculación
  'legajos_otros': markRaw(FormLegajosOtros),                      // Otros
}

// Definir la función getSectionDetails antes de usarla en el watcher
const getSectionDetails = (id) => {
  loading.value = true
  seccionLegajoRequest
    .get(id)
    .then((response) => {
      const { message, state, data } = response
      if (state === 'success') {
        Object.assign(dataLegajoSeccion, data)
      } else {
        ElNotification({
          title: message,
          type: state
        })
      }
    })
    .catch((error) => console.log(error))
    .finally(() => loading.value = false)
}

onMounted(() => {
  // setTimeout(() => {
  //   getInitialData()
  // }, 100);
  // getSectionDetails(route.params.id);  // Esto se ejecutará una vez cuando el componente se monte
})

watch(
  () => route.params.id,
  (newId) => {
    legajoId.value = newId
    if (newId > 0) {
      getSectionDetails(newId);
      // Asegúrate de que la función esté definida antes de que se ejecute
    }
  },
  { immediate: true }  // Esto asegura que también se ejecute cuando el componente se monte
)

const agregarDocumento = (data, legajoseccion) => {
  console.log(data, legajoseccion)
  openDialogForm.value = true
  titleForm.value = legajoseccion.seccion?.descripcion
  idItemToEdit.value = data.id
  textSeccion.value = data.seccion?.descripcion
  idLegajo.value = Number(route.params.id)

  // Establecer el componente correspondiente según la tabla
  const tabla = legajoseccion.seccion?.tabla  // Asegúrate de que 'tabla' es el campo correcto que identifica la tabla
  if (componentsMap[tabla]) {
    currentComponent.value = componentsMap[tabla]
  } else {
    currentComponent.value = FormLegajosSeccion  // Default (por si no se encuentra una tabla válida)
  }
}

const beforeCloseDFPersona = (done) => {
  openDialogForm.value = false
  idItemToEdit.value = -4
  idLegajo.value = -4
  textSeccion.value = ''
  done()
}

const handleCloseFormLegajoSeccion = () => {
  openDialogForm.value = false
  idItemToEdit.value = -3
  idLegajo.value = -3
  textSeccion.value = ''
  getSectionDetails(route.params.id)
}

</script>

<style scoped>
  .bg-gray-100 {
    background-color: #f0f3f4; /* Color gris claro */
  }
  
  .bg-gray-200 {
    background-color: #e8eaeb; /* Color gris claro */
  }

  /* Anchos fijos para las columnas de ID y la última columna */
  th.w-24, td.w-24 {
    width: 110px;
    text-align: center !important;
  }
  
  /* Anchos fijos para las columnas de ID y la última columna */
  th.w-48, td.w-48 {
    width: 180px;
  }

  th:last-child, td:last-child {
    width: 100px;
  }
  
  .table-secciones {
    width: 100%;
    table-layout: fixed;
    border: 1px solid #e8eaeb;
    border-collapse: collapse;
    border-spacing: 0;
  }

  .table-secciones th, .table-secciones td {
    padding: 8px;
    text-align: left;
    border-left: 1px solid #ddd; /* Agrega una línea de separación */
    border-right: 1px solid #ddd; /* Agrega una línea de separación */
  }


  .table-secciones-info {
    width: 100%; /* Asegura que la tabla ocupe el 100% del ancho disponible */
    border-collapse: collapse; /* Elimina el espacio entre celdas */
  }

  .table-secciones-info td {
    padding: 8px; /* Ajusta el espacio interno de las celdas */
    border: 1px solid #ddd; /* Bordes suaves entre celdas, puedes ajustarlo */
  }

  /* Estilo para la primera columna */
  .table-secciones-info td:first-child {
    width: 210px; /* Fija el ancho de la primera columna a 100px */
  }

  /* La segunda columna ocupa el espacio restante */
  .table-secciones-info td:last-child {
    width: auto; /* Permite que la segunda columna ocupe el espacio restante */
  }

</style>
