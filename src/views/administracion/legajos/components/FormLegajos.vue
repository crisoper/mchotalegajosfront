<template>
  <el-card shadow="never" v-loading="loading">
    <el-form ref="refFormulario" :model="model" :rules="reglas" label-position="top">
      <el-row :gutter="12">
        <el-col v-if="model.id === undefined" :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item label="Autogenerar número" prop="autogenerarnumero">
            <el-switch
              v-model="model.autogenerarnumero"
              class="ml-2"
              inline-prompt
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
              active-text="Autogenerar número"
              inactive-text="Ingresar manualmente"
              @change="changeAutogenerarNumero()"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="model.id === undefined" :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item
            label="Número"
            prop="numero"
            :class="{ 'input-readonly': model.autogenerarnumero }"
          >
            <el-input
              ref="fieldNumero"
              v-model="model.numero"
              placeholder="Número"
              :readonly="model.autogenerarnumero"
            />
          </el-form-item>
        </el-col>
        <el-col v-if="model.id !== undefined" :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item
            label="Número"
            prop="numero"
            :class="{ 'input-readonly': model.autogenerarnumero }"
          >
            <el-input
              ref="fieldNumero"
              v-model="model.numero"
              placeholder="Número"
              :readonly="model.id !== undefined"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="estado" label="Estado">
            <el-select
              v-model="model.estado"
              placeholder="Seleccionar"
              filterable
            >
              <el-option
                v-for="item in estados"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item prop="ubicacion" label="Ubicación">
            <el-input v-model="model.ubicacion" placeholder="Ubicación" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="8" :md="8">
          <el-form-item prop="persona_nro_documento" label="DNI">
            <template #label>
              <div style="display: flex; justify-content: space-between">
                <span>DNI</span>
                <el-button
                  v-if="model.id === undefined"
                  @click="handleOpenSelectPersona()"
                  type="primary"
                  link
                  :underline="false"
                >
                  <template #icon>
                    <v-icon :name="'bi-search'" />
                  </template>
                  <span class="text-muted"> Buscar </span>
                </el-button>
              </div>
            </template>
            <el-input
              v-model="model.persona_nro_documento"
              placeholder="Ejemplo: 12345678"
              readonly

            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="16" :md="16">
          <el-form-item prop="persona_nombre_completo" label="Nombres">
            <template #label>
              <div style="display: flex; justify-content: space-between">
                <span> Apellidos y nombres </span>
              </div>
            </template>
            <el-input
              v-model="model.persona_nombre_completo"
              placeholder="Ejemplo: Juan Pérez Rodríguez"
              readonly
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="area_id" label="Área">
            <el-select v-model="model.area_id" placeholder="Seleccionar área" filterable>
              <el-option
                v-for="item in areas"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="cargo_id" label="Cargo">
            <el-select v-model="model.cargo_id" placeholder="Seleccionar cargo" filterable>
              <el-option
                v-for="item in cargos"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="regimen_laboral_id" label="Regimen laboral">
            <el-select
              v-model="model.regimen_laboral_id"
              placeholder="Seleccionar régimen laboral"
              filterable
            >
              <el-option
                v-for="item in regimenes"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="fecha_vinculacion" label="Fecha vinculación">
            <el-date-picker
              v-model="model.fecha_vinculacion"
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
        <el-button @click="cerrar('cancelado')">CANCELAR</el-button>
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

const resourceLegajo = new Resource('administracion/legajos')
const resourceCargos = new Resource('listacargos')
const resourceAreas = new Resource('listaareas')
const resourceRegimenLaboral = new Resource('listaregimenlaboral')
const emit = defineEmits(['close'])
const loading = ref(false)
const openDialogSelectPersona = ref(false)
const refFormulario = ref(null)
const titleDialogSelectPersona = ref('')
const fieldNumero = ref(null)
const cargos = ref(null)
const areas = ref(null)
const regimenes = ref(null)
const estados = [
  { value: 'Activo', label: 'Activo' },
  { value: 'Pasivo', label: 'Pasivo' }
]
const model = reactive({
  id: undefined,
  autogenerarnumero: false,
  numero: '',
  persona_id: undefined,
  persona_nro_documento: '',
  persona_nombre_completo: '',
  area_id: null,
  cargo_id: null,
  regimen_laboral_id: null,
  fecha_vinculacion: null,
  estado: 'Activo',
  ubicacion: '',
})

const reglas = reactive({
  autogenerarnumero: [{ required: true, message: 'Este campo es obligatorio', trigger: 'change' }],
  numero: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
  persona_nro_documento: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
  persona_nombre_completo: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
  area_id: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
  cargo_id: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
  regimen_laboral_id: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
  fecha_vinculacion: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
  estado: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
  ubicacion: [{ required: true, message: 'Este campo es obligatorio', trigger: 'blur' }],
})

const props = defineProps({
  idRegistro: {
    type: Number,
    required: true,
    default: -90
  }
})

onMounted(() => {
  loadInitialData()
  establecerModoCrearEditar()
})

watch(
  () => {
    return props.idRegistro
  },
  (newValue, oldValue) => {
    console.log(newValue, oldValue)
    establecerModoCrearEditar()
  }
)

const loadInitialData = async () => {
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
    if (props.idRegistro > 0) {
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
  if (props.idRegistro <= 0) return
  loading.value = true
  resourceLegajo
    .get(props.idRegistro)
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
  console.log(model)
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
  resourceLegajo
    .store(model) // Enviar los datos del formulario a la API
    .then((response) => {
      console.log(response)
      ElNotification({
        type: 'success',
        title: 'Registro creado con éxito',
        duration: 2000
      })
      cerrar('success')
      loading.value = false
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
      cerrar('success')
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
      autogenerarnumero: false,
      numero: '',
      persona_id: undefined,
      persona_nro_documento: '',
      persona_nombre_completo: '',
      area_id: null,
      cargo_id: null,
      regimen_laboral_id: null,
      fecha_vinculacion: null,
      estado: 'Activo',
      ubicacion: '',
    })
  )
  // console.log(refFormulario)
  refFormulario.value.resetFields()
}

const handleOpenSelectPersona = () => {
  titleDialogSelectPersona.value = 'Buscar persona'
  openDialogSelectPersona.value = true
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

const changeAutogenerarNumero = () => {
  console.log(model)
  if (!model.autogenerarnumero) {
    nextTick(() => {
      const inputElement = fieldNumero.value?.$el.querySelector('input')
      if (inputElement) {
        model.numero = ''
        inputElement.focus()
      }
    })
  } else {
    model.numero = 'Autogenerado'
  }
}

const cerrar = (estado) => {
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
