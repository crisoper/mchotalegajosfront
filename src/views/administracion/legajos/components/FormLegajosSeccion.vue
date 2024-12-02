<template>
  <el-card shadow="never" v-loading="loading">
    <el-button @click="getInitialData()">Recargar</el-button>
    <el-form ref="refFormulario" :model="model" :rules="reglas" label-position="top">
      <el-row :gutter="12">
        <el-col :xs="24">
          <el-form-item
            label="Sección"
            prop="seccion"
          >
            <el-input
              ref="fieldSeccion"
              :rows="2"
              type="textarea"
              v-model="model.seccion"
              :readonly="true"
              placeholder="Sección"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="16" :md="16">
          <el-form-item prop="archivo" label="Archivo">
            <input type="file" @change="handleFileChange" ref="fileInput" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="8" :md="8">
          <el-form-item prop="fecha_documento" label="Fecha documento">
            <el-date-picker
              v-model="model.fecha_documento"
              type="date"
              placeholder="Seleccionar"
              style="width: 100%"
              format="DD/MM/YYYY"
              value-format="YYYY-MM-DD"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="end" class="mt-3">
        <el-button @click="close('cancelado')">CANCELAR</el-button>
        <el-button type="primary" @click="enviarFormulario(refFormulario)">
          {{ model.id > 0 ? 'ACTUALIZAR' : 'GUARDAR' }}
        </el-button>
      </el-row>
    </el-form>
    <!-- Diálogo de Form Legajo -->
    <el-dialog
      top="5vh"
      v-model="openDialogSelectPersona"
      :width="calcularAnchoDialog('88%', '96%')"
    >
      <template #header>
        <h3>{{ titleDialogSelectPersona }}</h3>
      </template>
      <SelectPersona ref="refFormLegajos" @close="handleCloseFormPersona" />
    </el-dialog>
  </el-card>
</template>

<script setup>
import Resource from '@/api/resource'
import { reactive, ref, watch, onMounted, nextTick } from 'vue'
import { ElNotification } from 'element-plus'
import SelectPersona from '@/components/share/personas/SelectPersona.vue'
import { calcularAnchoDialog } from '@/utils/responsive'

const resourceLegajo = new Resource('administracion/legajoseccion-detalle')
const resourceCargos = new Resource('listacargos')
const resourceAreas = new Resource('listaareas')
const resourceRegimenLaboral = new Resource('listaregimenlaboral')
const emit = defineEmits(['close'])
const loading = ref(false)
const openDialogSelectPersona = ref(false)
const refFormulario = ref(null)
const titleDialogSelectPersona = ref('')
const cargos = ref(null)
const areas = ref(null)
const regimenes = ref(null)
const selectedFile = ref(null)
const model = reactive({
  id: undefined,
  legajo_id: undefined,
  seccion_padre_id: undefined,
  seccion_id: undefined,
  seccion: '',
  nro_fila: undefined,
  fecha_documento: '',
  archivo_nombre: '',
  archivo_ruta: '',
  activo: true,
})

const reglas = reactive({
  fecha_documento: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }],
})

const props = defineProps({
  idSeccion: {
    type: Number,
    required: true,
    default: -90
  },
  idLegajo: {
    type: Number,
    required: true,
    default: -90
  },
  textSeccion: {
    type: String,
    required: true,
    default: ""
  }
})

onMounted(() => {
  getInitialData()
  establecerModoCrearEditar()
})

watch(
  () => {
    return props.idSeccion
  },
  (newValue, oldValue) => {
    console.log(newValue, oldValue)
    establecerModoCrearEditar()
  }
)

const getInitialData = async () => {
  console.log(props)
  loading.value = true
  await Promise.all([
    resourceCargos.list({}),
    resourceAreas.list({}),
    resourceRegimenLaboral.list({})
  ])
    .then((res) => {
      cargos.value = res[0].data && Array.isArray(res[0].data) ? res[0].data : []
      areas.value = res[1].data && Array.isArray(res[1].data) ? res[1].data : []
      regimenes.value = res[2].data && Array.isArray(res[2].data) ? res[2].data : []
    })
    .catch((error) => {
      console.log(error)
      loading.value = false
    })
    .finally(() => {
      loading.value = false
    })
}

const establecerModoCrearEditar = () => {
  nextTick(() => {
    setTimeout(() => {
      model.seccion = props.textSeccion
    }, 150)
    if (props.idSeccion > 0) {
      getDataEdit()
    } else {
      createData()
    }
  })
}

const createData = () => {
  reiniciarFormulario()
}

const getDataEdit = () => {
  reiniciarFormulario()
  if (props.idSeccion <= 0) return
  loading.value = true
  resourceLegajo
    .get(props.idSeccion)
    .then((response) => {
      console.log(response)
      const { data } = response
      Object.assign(model, data)
      model.persona_id = data.persona_id
      model.persona_nro_documento = data.persona?.nro_documento
      model.persona_nombre_completo = data.persona?.nombre_completo
      model.area_id = data.trabajador?.area_id
      model.cargo_id = data.trabajador?.cargo_id
      model.regimen_laboral_id = data.trabajador?.regimen_laboral_id
      model.fecha_vinculacion = data.trabajador?.fecha_vinculacion
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      loading.value = true
      ElNotification({
        type: 'error',
        title: 'Error al recuperar el registro',
        duration: 2000
      })
      close('canceled')
    })
}

const enviarFormulario = async (formEl) => {
  
  if (!selectedFile.value) {
    alert('Por favor, selecciona un archivo.')
    return
  }

  if (!formEl) return
  loading.value = true
  await formEl.validate((valid) => {
    if (valid) {
      if (model.id !== undefined && model.id > 0) {
        submitEditForm()
      } else {
        submitAddForm()
      }
    } else {
      loading.value = false
    }
  })
}

const submitAddForm = () => {
  const formData = new FormData()
  formData.append('archivo', selectedFile.value)
  formData.append("id", model.id)
  formData.append("legajo_id", props.idLegajo)
  formData.append("seccion_id", props.idSeccion)
  formData.append("fecha_documento", model.fecha_documento)
  formData.append("archivo_nombre", model.archivo_nombre)
  formData.append("archivo_ruta", model.archivo_ruta)

  resourceLegajo
    .store(formData) // Enviar los datos del formulario a la API
    .then((response) => {
      console.log(response)
      ElNotification({
        type: 'success',
        title: 'Registro creado con éxito',
        duration: 2000
      })
      loading.value = false
      close('success')
    })
    .catch((error) => {
      console.log(error)
      loading.value = false
    })
}

const submitEditForm = () => {
  resourceLegajo
    .update(model.id, model)
    .then((response) => {
      console.log(response)
      ElNotification({
        type: 'success',
        title: 'Registro actualizado con éxito',
        duration: 2000
      })
      close('success')
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      loading.value = false
    })
}

const reiniciarFormulario = () => {
  Object.assign(
    model,
    reactive({
      id: undefined,
      legajo_id: undefined,
      seccion_padre_id: undefined,
      seccion_id: undefined,
      seccion: '',
      nro_fila: undefined,
      fecha_documento: '',
      archivo_nombre: '',
      archivo_ruta: '',
      activo: true,
    })
  )
  // console.log(refFormulario)
  refFormulario.value.resetFields()
}

// Función para manejar el cambio de archivo
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const handleCloseFormPersona = (dataChild) => {
  console.log(dataChild)
  const { data } = dataChild
  model.persona_nro_documento = data.nro_documento
  model.persona_nombre_completo = data.nombre_completo
  model.persona_id = data.id
  // Object.assign(model, data);
  openDialogSelectPersona.value = false
}

const close = (estado) => {
  emit('close', estado)
  reiniciarFormulario()
}

const expuestaDesdeFormPersona = () => {
  console.log('Esta función esta definida en Form Persona')
  reiniciarFormulario()
}

// Exponer reiniciarFormulario al componente padre usando defineExpose
defineExpose({
  expuestaDesdeFormPersona
})
</script>
