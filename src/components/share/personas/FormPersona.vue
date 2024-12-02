<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
  <el-card shadow="never" v-loading="loading">
    <el-form ref="createObject" :model="model" :rules="rules" label-position="top">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item prop="tipo_documento" label="Tipo documento">
            <el-select v-model="model.tipo_documento" placeholder="Seleccionar" style="width: 100%">
              <el-option
                v-for="item in tipodocumentos"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item prop="nro_documento" label="Nro documento" :error="errorNroDocumento">
            <el-input
              v-model="model.nro_documento"
              style="width: 100%"
              placeholder="Nro documento"
              class="input-with-select"
              @keydown.enter.prevent="buscarDatosDNI()"
            >
              <!-- @keydown.enter.prevent="submitForm(createObject)" -->
              <template #append>
                <el-button :icon="Search" @click="buscarDatosDNI()" />
              </template>
            </el-input>
            <!-- <span slot="error" style="color: red; font-size: 50%;">{{ errorNroDocumento }}</span> -->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item prop="paterno" label="Apellido paterno">
            <el-input
              v-model="model.paterno"
              placeholder="Apellido paterno"
              @keydown.enter.prevent="submitForm(createObject)"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item prop="materno" label="Apellido materno">
            <el-input
              v-model="model.materno"
              placeholder="Apellido materno"
              @keydown.enter.prevent="submitForm(createObject)"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item prop="nombres" label="Nombres">
            <el-input
              v-model="model.nombres"
              placeholder="Nombres"
              @keydown.enter.prevent="submitForm(createObject)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="Dirección" prop="direccion" class="input-readonly">
            <el-input
              v-model="model.direccion"
              placeholder="Domicilio"
              @keydown.enter.prevent="submitForm(createObject)"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="telefono" label="Teléfono">
            <el-input v-model="model.telefono" placeholder="Ejemplo: 987654321" maxlength="9" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item label="Correo" prop="correo" class="input-readonly">
            <el-input
              v-model="model.correo"
              placeholder="Email"
              @keydown.enter.prevent="submitForm(createObject)"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="end" class="mt-4">
        <el-button @click="close('canceled')">CANCELAR</el-button>
        <el-button type="primary" @click="submitForm(createObject)">GUARDAR</el-button>
      </el-row>
    </el-form>

    <el-dialog
      v-model="dialogFormTelefono"
      top="7vh"
      width="360px"
      draggable
    >
      <!-- :before-close="beforeCloseCreate" -->
      <template #header>
        <h3>{{ titleFormTelefono }}</h3>
      </template>
        <el-form ref="createTelefono" :model="modelTelefono" :rules="rulesTelefono" label-position="top">
          <el-row :gutter="12">
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item prop="operador_id" label="Operador">
                <el-select v-model="modelTelefono.operador_id" placeholder="Seleccionar" style="width: 100%">
                  <el-option
                    v-for="item in operadores"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item prop="tipo" label="Tipo">
                <el-select v-model="modelTelefono.tipo" placeholder="Seleccionar" style="width: 100%">
                  <el-option
                    v-for="item in tipoTelefonos"
                    :key="item.id"
                    :label="item.nombre"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item prop="num" label="Número">
                <el-input
                  v-model="modelTelefono.num"
                  style="width: 100%"
                  placeholder="Número"
                  class="input-with-select"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="10" type="flex" justify="end" class="mt-3">
            <el-button @click="closeFormTelefono()">CANCELAR</el-button>
            <el-button type="primary" @click="submitAgregarTelefono(createTelefono)">AGREGAR</el-button>
          </el-row>
        </el-form>
    </el-dialog>
  </el-card>
</template>

<script setup>
import Resource from '@/api/resource'
import { buscarPersonaDNI } from '@/api/searchapis'
import { ElNotification } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
// import { calcularAnchoDialog } from '@/utils/responsive'
// import { isNumber } from 'element-plus/es/utils/types.mjs';
import {
  reactive,
  ref,
  // watch,
  // onMounted,
  nextTick
} from 'vue'
// import formUbigeo from '@/components/share/ubigeos/buscarubigeo.vue'
// import { calcularAnchoDialog } from '@/utils/responsive'

const modelRequest = new Resource('administracion/personas')
const emit = defineEmits(['closeform'])
const loading = ref(false)
const dialogFormTelefono = ref(false)
// const dialogUbigeo = ref(false)
const titleFormTelefono = ref('')
const createObject = ref(null)
const createTelefono = ref(null)
const errorNroDocumento = ref(null)
const validationTriggered = ref(false)
const model = reactive({
  id: undefined,
  tipo_documento: '',
  nro_documento: '',
  paterno: '',
  materno: '',
  nombres: '',
  ubigeo: '',
  ubigeo_texto: '',
  direccion: '',
  telefono: '',
  correo: '',
  telefonos: [],
  activo: true
})

// Se debe obterner de la base de datos
const tipodocumentos = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'CE', nombre: 'CARNÉ EXTRANJERIA' },
]


// const tableData = [
//   { operador: 'Movistar', num: '969050774' },
//   { operador: 'Claro', num: '321456789' },
//   { operador: 'Enteo', num: '963852147' },
// ]

const operadores = [
  { id: 1, nombre: 'MOVISTAR' },
  { id: 2, nombre: 'CLARO' },
  { id: 3, nombre: 'BITEL' },
  { id: 4, nombre: 'ENTEL' },
  { id: 5, nombre: 'Otros' }
]

const tipoTelefonos = [
  { id: 'F', nombre: 'FIJO' },
  { id: 'C', nombre: 'CELULAR' },
]

// const props = defineProps({
//   idRegistro: {
//     type: Number,
//     required: true,
//     default: 0
//   }
// })

const validarNroDocumento = (rule, value, callback) => {
  if (validationTriggered.value) { // Verificar si se activó la validación
    if (value === '') {
      callback(new Error('El campo es obligatorio'));
    } else {
      if (model.tipo_documento === 1) {
        const regex = /^\d{8}$/;
        if (regex.test(value)) {
          errorNroDocumento.value = null; // Limpiar error si es válido
          callback();
        } else {
          callback(new Error('Ingrese un Nro. de documento válido'));
        }
      } else {
        callback();
      }
    }
  } else {
    callback(); // Si no se ha activado la validación, solo llamar al callback
  }
}

const validarNroTelefono = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('El campo es obligatorio'))
  } else {
    const regex = /^\d{9}$/
    if (regex.test(value)) {
      callback()
    } else {
      callback(new Error('Ingrese un teléfono válido'))
    }
  }
}

const rules = reactive({
  paterno: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  nombres: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  materno: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  tipo_documento: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  nro_documento: [{ validator: validarNroDocumento, trigger: 'blur' }]
  // activo: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }]
})

const rulesTelefono = reactive({
  operador_id: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  tipo: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  num: [{ validator: validarNroTelefono, trigger: 'blur' }]
  // activo: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }]
})

// watch(() => {
//   return props.idRegistro;
// }, (newValue, oldValue) => {
//   resetForm()
//   if(newValue != oldValue && newValue != '' && newValue != null && newValue > 0) {
//     console.log(newValue, oldValue)
//     cargarRegistro()
//   }
// });

// const cargarRegistro = () => {
//   if (isNumber(props.idRegistro) && props.idRegistro > 0) {
//     loading.value = true
//     console.log(props)
//     modelRequest
//       .get(props.idRegistro)
//       .then((response) => {
//         const { data } = response
//         Object.assign(model, data)
//         nextTick(() => {
//           console.log('Model', model)
//           loading.value = false
//         })
//       })
//       .catch((error) => {
//         console.log(error)
//         loading.value = true
//         ElNotification({
//           type: 'error',
//           title: 'Error al recuperar el registro',
//           duration: 2000
//         })
//         close('canceled')
//       })
//   }
// }

// onMounted(() => {
//   cargarRegistro()
// })

const submitForm = async (formEl) => {
  if (!formEl) return

  validationTriggered.value = true

  await formEl.validate((valid) => {
    if (valid) {
      if (model.id === undefined) {
        sendDataCreate()
      } else {
        sendDataUpdate()
      }
    } else {
      console.log('Formulario no válido')
    }
  })
}

const sendDataCreate = () => {
  loading.value = true
  modelRequest
    .store(model)
    // eslint-disable-next-line no-unused-vars
    .then((response) => {
      ElNotification({
        type: 'success',
        title: 'Registro creado',
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

const sendDataUpdate = () => {
  loading.value = true
  modelRequest
    .update(model.id, model)
    // eslint-disable-next-line no-unused-vars
    .then((response) => {
      ElNotification({
        type: 'success',
        title: 'Registro actualizado',
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

const resetForm = () => {
  Object.assign(
    model,
    reactive({
      id: undefined,
      tipo_documento: '',
      nro_documento: '',
      paterno: '',
      materno: '',
      nombres: '',
      ubigeo: '',
      ubigeo_texto: '',
      direccion: '',
      telefono: '',
      telefonos: [],
      correo: '',
      activo: true
    })
  )
}


const close = (status) => {
  // emit('close', status)
  emit('closeform', {
    action: 'close',
    status,
    data: model
  })

  resetForm()

}

const buscarDatosDNI = () => {
  validationTriggered.value = true
  console.log(model)
  const regex = /^\d{8}$/;
  if (model.tipo_documento === 'DNI' && !regex.test(model.nro_documento)) {
    errorNroDocumento.value = 'Ingrese un DNI válido (8 dígitos)';
    return; // No continuar si el formato no es válido
  }

  // alert('Obtener datos de la api ' + model.nro_documento)
  loading.value = true
  buscarPersonaDNI({
    tipo_documento: model.tipo_documento,
    nro_documento: model.nro_documento
  })
    .then((response) => {
      const { state, data, message } = response

      if (state === 'success') {
        model.paterno = data.paterno
        model.materno = data.materno
        model.nombres = data.nombre
        model.direccion = data.direccionReniec
        model.telefono = data.telefono
        model.correo = data.correo
        model.telefonos = data.telefonos
      } else {
        model.paterno = ''
        model.materno = ''
        model.nombres = ''
        model.direccion = ''
        model.telefono = ''
        model.correo = ''
        ElNotification({
          type: 'error',
          title: message,
          duration: 2000
        })
      }

      // model.id = data.id
      // Object.assign(model, sresponse)
      nextTick(() => {
        console.log('Model', model)
        loading.value = false
      })
    })
    .catch((err) => {
      loading.value = false
      console.log(err)
    })
    .finally(() => {
      loading.value = false
      console.log('Llamada finalizada')
    })
}

</script>
<style>
.el-table .warning-row {
  --el-table-tr-bg-color: var(--el-color-warning-light-9);
}
.el-table .success-row {
  --el-table-tr-bg-color: var(--el-color-success-light-9);
}
</style>
