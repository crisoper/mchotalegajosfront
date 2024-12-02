<template>
  <el-card shadow="never" v-loading="loading">
    <!-- <el-button @click="getData()">Recargar</el-button> -->
    <el-card shadow="never">
      <h1 class="font-weight-600-semi">{{ textSeccion }}</h1>
    </el-card>
    <!-- Tabla de personas -->
    <el-table
      :data="detalle"
      :border="true"
      style="width: 100%; margin-top: 15px !important"
      header-row-class-name="table-header-custom"
      row-class-name="table-row-custom"
      empty-text="Sin datos"
    >
      <el-table-column type="index" label="#" width="65" />
      <el-table-column prop="archivo_descripcion" label="Archivo descripcion" min-width="150" />
      <el-table-column prop="folios" label="Folios" width="70" :align="'center'" />
      <el-table-column
        prop="fecha_documento_es"
        label="Fecha documento"
        width="160"
        :align="'center'"
      />
      <el-table-column label="Archivo" width="130" :align="'center'">
        <template #default="scope">
          <el-button
            v-if="scope.row.archivo_existe"
            @click="descargarDocumento(scope.row.archivo_link)"
            type="primary"
            plain
          >
            Descargar
          </el-button>
        </template>
      </el-table-column>
      <el-table-column :align="'center'" width="150px">
        <template #header>
          <el-dropdown trigger="click" @command="handleCommandOpciones">
            <span class="el-dropdown-link">
              Opciones<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu ref="dropdown">
                <el-dropdown-item
                  :command="{ action: 'ADD' }"
                  :disabled="isActionDisabled('administracion.personas.crear')"
                >
                  <span>
                    <v-icon name="hi-plus" style="margin-right: 10px" />
                    Agregar
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>

        <!-- Acciones por cada fila -->
        <template #default="scope">
          <el-dropdown trigger="click" @command="handleCommandAcciones">
            <span class="el-dropdown-link">
              Acciones<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :command="{ item: scope.row, action: 'EDIT' }"
                  :disabled="isActionDisabled('administracion.personas.actualizar')"
                >
                  <span>
                    <v-icon name="md-edit-round" style="margin-right: 10px" />
                    Editar
                  </span>
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{ item: scope.row, action: 'DELETE' }"
                  :disabled="isActionDisabled('administracion.personas.eliminar')"
                >
                  <span>
                    <v-icon name="md-delete" style="margin-right: 10px" />
                    Eliminar
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <el-divider />

    <!-- Paginación -->
    <el-row type="flex" justify="end" class="my-3">
      <el-pagination
        v-model:current-page="query.page"
        v-model:page-size="query.limit"
        :total="total"
        :page-sizes="[10, 15, 25, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="getData"
        @current-change="getData"
      />
    </el-row>
    <!-- Diálogo de Form Legajo -->
    <el-dialog
      top="5vh"
      v-model="openDialogForm"
      :width="calcularAnchoDialog('88%', '96%')"
      :befor-close="handleCloseFormPersona"
    >
      <template #header>
        <h3>{{ titleDialog }}</h3>
      </template>
      <el-card shadow="never" v-loading="loading">
        <el-form ref="refFormulario" :model="modelForm" :rules="reglas" label-position="top">
          <el-row :gutter="12">
            <el-col :xs="24">
              <el-form-item label="Sección" prop="seccion">
                <div class="el-form-item__content el-textarea__inner">
                  {{ model.seccion }}
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="12">
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item prop="archivo_descripcion" label="Archivo descripción">
                <el-input v-model="modelForm.archivo_descripcion" placeholder="Ejemplo: Copia DNI" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8" :md="8">
              <el-form-item prop="folios" label="Nro folios">
                <el-input-number v-model="modelForm.folios" :min="1" />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="8" :md="8">
              <el-form-item prop="fecha_documento" label="Fecha documento">
                <el-date-picker
                  v-model="modelForm.fecha_documento"
                  type="date"
                  placeholder="Seleccionar"
                  style="width: 100%"
                  format="DD/MM/YYYY"
                  value-format="YYYY-MM-DD"
                />
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <div v-if="modelForm.archivo_existe !== undefined && modelForm.archivo_existe === true">
                <el-link type="primary" :underline="false" @click="descargarDocumento(modelForm.archivo_link)">
                  Descargar archivo actual
                </el-link>
              </div>
              <el-form-item prop="archivo" label="Archivo">
                <input type="file" @change="handleFileChange" ref="fileInput" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" type="flex" justify="end" class="mt-3">
            <el-button @click="openDialogForm = false">CANCELAR</el-button>
            <el-button type="primary" @click="enviarFormulario(refFormulario)">
              {{ modelForm.id > 0 ? 'ACTUALIZAR' : 'GUARDAR' }}
            </el-button>
          </el-row>
        </el-form>
      </el-card>
    </el-dialog>
  </el-card>
</template>

<script setup>
import Resource from '@/api/resource'
import { reactive, ref, watch, onMounted, nextTick, markRaw } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { ArrowDown, Delete } from '@element-plus/icons-vue'
import { calcularAnchoDialog } from '@/utils/responsive'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const validPermision = authStore.validPermision

const resourceLegajo = new Resource('administracion/legajos_sst')
const emit = defineEmits(['close'])
const loading = ref(false)
const openDialogForm = ref(false)
const refFormulario = ref(null)
const query = reactive({
  keyword: '',
  limit: 10,
  page: 1
})
const total = ref(0)
const detalle = ref([])
const titleDialog = ref('')
const idItemToEdit = ref(-2)
const selectedFile = ref(null)
const fileInput = ref(null)
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
  activo: true
})

const modelForm = reactive({
  id: undefined,
  legajo_seccion_id: undefined,
  fila: undefined,
  folios: 1,
  fecha_documento: '',
  archivo_nombre: '',
  archivo_descripcion: '',
  archivo_ruta: '',
  activo: true
})

const reglas = reactive({
  fecha_documento: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }],
  archivo_descripcion: [{ required: true, message: 'El campo es obligatorio', trigger: 'change' }],
})

const props = defineProps({
  idLegajoSeccion: {
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
    default: ''
  }
})

onMounted(() => {
  getInitialData()
  establecerModoCrearEditar()
})

watch(
  () => {
    return props.idLegajoSeccion
  },
  (newValue, oldValue) => {
    console.log(newValue, oldValue)
    establecerModoCrearEditar()
  }
)

const getInitialData = async () => {
  console.log(props)
}

const establecerModoCrearEditar = () => {
  nextTick(() => {
    setTimeout(() => {
      model.seccion = props.textSeccion
    }, 150)
    if (props.idLegajoSeccion > 0) {
      getData()
    } else {
      close('error')
    }
  })
}

const getData = () => {
  reiniciarFormulario()
  if (props.idLegajoSeccion <= 0) return
  loading.value = true
  resourceLegajo
    .list({legajo_seccion_id: props.idLegajoSeccion})
    .then((response) => {
      console.log(response)
      const { data } = response
      detalle.value = data
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
  if (modelForm.id === undefined && !selectedFile.value) {
    alert('Por favor, selecciona un archivo.')
    return
  }

  if (!formEl) return
  loading.value = true
  await formEl.validate((valid) => {
    if (valid) {
      submitAddEditForm()
    } else {
      loading.value = false
    }
  })
}

const submitAddEditForm = () => {
  const formData = new FormData()
  formData.append('id', modelForm.id)
  formData.append('legajo_seccion_id', props.idLegajoSeccion)
  formData.append('legajo_id', props.idLegajo)
  formData.append('folios', modelForm.folios)
  formData.append('fecha_documento', modelForm.fecha_documento)
  formData.append('archivo', selectedFile.value)
  formData.append('archivo_nombre', modelForm.archivo_nombre)
  formData.append('archivo_descripcion', modelForm.archivo_descripcion)
  formData.append('archivo_ruta', modelForm.archivo_ruta)

  resourceLegajo
    .store(formData) // Enviar los datos del formulario a la API
    .then((response) => {
      // console.log(response)
      const { status, message } = response
      if (status === 'success') { 
        openDialogForm.value = false
        getData()
      }
      ElNotification({
          type: status,
          title: message,
          duration: 2000
        })
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
      seccion: model.seccion,
      nro_fila: undefined,
      fecha_documento: '',
      archivo_nombre: '',
      archivo_ruta: '',
      activo: true
    })
  )
  if (refFormulario.value != null) {
    refFormulario.value.resetFields()
  }
  // Limpiar el campo de archivo
  console.log('fileInput', fileInput)
  if (fileInput.value != null) {
    fileInput.value.value = ''
  }
  selectedFile.value = null
}

// Función para manejar el cambio de archivo
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
  }
}

const handleCloseFormPersona = (done) => {
  resetFieldForm()
  done()
}

const resetFieldForm = () => {
  Object.assign(
    modelForm,
    reactive({
      id: undefined,
      legajo_seccion_id: props.idLegajoSeccion,
      fila: undefined,
      folios: 1,
      fecha_documento: '',
      archivo_descripcion: '',
      archivo_nombre: '',
      archivo_ruta: '',
      activo: true
    })
  )

  refFormulario.value.resetFields()
}

const handleCommandOpciones = ({ action }) => {
  if (action === 'ADD' && validPermision('administracion.personas.crear')) {
    addItem()
  } else if (action === 'EXPORT' && validPermision('administracion.personas.exportar')) {
    this.exportarDatos()
  } else {
    ElNotification({ message: 'Usted no tiene permiso para realizar esta acción', type: 'info' })
  }
}

const addItem = () => {
  reiniciarFormulario()
  titleDialog.value = 'Registrar documento'
  idItemToEdit.value = -4
  nextTick(() => {
    openDialogForm.value = true
  })
}

const editItem = (id) => {
  reiniciarFormulario()
  titleDialog.value = 'Modificar documento'
  idItemToEdit.value = id
  openDialogForm.value = true

  // Obteniendo datos para edicion
  resourceLegajo
    .get(id) // Enviar los datos del formulario a la API
    .then((response) => {
      console.log(response)
      const { status, message, data } = response
      if (status === 'success') { 
        Object.assign(modelForm, data)
      } else {
        openDialogForm.value = false
        ElNotification({
          type: status,
          title: message,
          duration: 2000
        })
      }
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      loading.value = false
    })

}

const deleteItem = (item) => {
  const msg = `
    ¿Seguro que desea eliminar el registro?<br /><br />
    ${item.archivo_descripcion} - ${item.fecha_documento_es}
    `
    ElMessageBox.confirm(msg, 'Atención', {
      top: '5vh',
      icon: markRaw(Delete),
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      type: 'warning',
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        loading.value = false
        resourceLegajo
          .destroy(item.id)
          .then((response) => {
            const { status, message } = response
            if (status === 'success') {
              getData()  
            }
            ElNotification({
              title: message,
              type: status,
              duration: 2000
            })
            loading.value = false
          })
          .catch((error) => {
            console.log(error)
            loading.value = false
          })
      })
      .catch((error) => {
        console.log(error)
      })
}

const isActionDisabled = (action) => {
  return !validPermision(action.toLowerCase())
}

const handleCommandAcciones = ({ item, action }) => {
  if (action == 'EDIT' && validPermision('administracion.personas.actualizar')) {
    editItem(item.id)
  } else if (action == 'DELETE' && validPermision('administracion.personas.eliminar')) {
    deleteItem(item)
  }
}

const descargarDocumento = (url) => {
  const link = document.createElement('a')
  link.href = url
  document.body.appendChild(link)
  link.click()
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
