<template>
  <el-card shadow="never" v-loading="cargando">
    <el-form ref="formularioCrearPersona" :model="persona" :rules="reglas" label-position="top">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="8">
          <el-form-item prop="tipo_documento" label="Tipo documento">
            <el-select v-model="persona.tipo_documento" placeholder="Seleccionar" style="width: 100%">
              <el-option
                v-for="item in tipodocumentos"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="nro_documento" label="Nro documento">
            <el-input v-model="persona.nro_documento" placeholder="Ejemplo: 12345678" maxlength="8" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="paterno" label="Apellido paterno">
            <el-input v-model="persona.paterno" placeholder="Ejemplo: Pérez" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="materno" label="Apellido materno">
            <el-input v-model="persona.materno" placeholder="Ejemplo: Rodríguez" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="nombres" label="Nombres">
            <el-input v-model="persona.nombres" placeholder="Ejemplo: Juan" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="direccion" label="Dirección">
            <el-input v-model="persona.direccion" placeholder="Ejemplo: Av. Pardo 123" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="telefono" label="Teléfono">
            <el-input v-model="persona.telefono" placeholder="Ejemplo: 987654321" maxlength="9" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="correo" label="Correo">
            <el-input v-model="persona.correo" placeholder="Ejemplo: juan.perez@email.com" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="10" type="flex" justify="end" class="mt-3">
        <el-button @click="cerrar('cancelado')">CANCELAR</el-button>
        <el-button type="primary" @click="enviarFormulario(formularioCrearPersona)">
          {{ persona.id > 0 ? 'ACTUALIZAR' : 'GUARDAR' }}
        </el-button>
      </el-row>
    </el-form>

  </el-card>
</template>

<script setup>
import Resource from '@/api/resource'
import { reactive, ref, watch, onMounted } from 'vue'
import { ElNotification } from 'element-plus'

const requestPersona = new Resource("administracion/personas")
const emit = defineEmits(['close'])
const cargando = ref(false)
const formularioCrearPersona = ref()

const persona = reactive({
  id: undefined,          // Correo Electrónico
  nombres: '',            // Nombres
  paterno: '',            // Apellido Paterno
  materno: '',            // Apellido Materno
  nro_documento: '',                // DNI
  direccion: '',          // Dirección
  telefono: '',           // Teléfono
  correo: ''              // Correo Electrónico
})

// Se debe obterner de la base de datos
const tipodocumentos = [
  { id: 'DNI', nombre: 'DNI' },
  { id: 'CE', nombre: 'CARNÉ EXTRANJERIA' },
]

const reglas = reactive({
  tipo_documento: [{ required: true, message: 'El campo Nombres es obligatorio', trigger: 'blur' }],
  nombres: [{ required: true, message: 'El campo Nombres es obligatorio', trigger: 'blur' }],
  paterno: [{ required: true, message: 'El campo Apellido Paterno es obligatorio', trigger: 'blur' }],
  materno: [{ required: true, message: 'El campo Apellido Materno es obligatorio', trigger: 'blur' }],
  nro_documento: [
    { required: true, message: 'El DNI es obligatorio', trigger: 'blur' },
    { pattern: /^[0-9]{8}$/, message: 'El DNI debe ser de 8 dígitos', trigger: 'blur' }
  ],
  // direccion: [{ required: true, message: 'La dirección es obligatoria', trigger: 'blur' }],
  // telefono: [
  //   { required: true, message: 'El teléfono es obligatorio', trigger: 'blur' },
  //   { pattern: /^[0-9]{9}$/, message: 'El número de teléfono debe tener 9 dígitos', trigger: 'blur' }
  // ],
  // correo: [
  //   { required: true, message: 'El correo electrónico es obligatorio', trigger: 'blur' },
  //   { type: 'email', message: 'El correo electrónico no es válido', trigger: 'blur' }
  // ]
})

const props = defineProps({
  idRegistro: {
    type: Number,
    required: true,
    default: -5
  }
})

watch(() => {
  return props.idRegistro;
}, (newValue, oldValue) => {
  // console.log(newValue, oldValue)
  if(newValue != oldValue && newValue != '' && newValue != null && newValue > 0) {
    cargarRegistroActualEditar()
  }
});

const cargarRegistroActualEditar = () => {
  if (props.idRegistro <= 0) return
  cargando.value = true
  requestPersona
    .get(props.idRegistro)
    .then((response) => {
      console.log(response)
      const { data } = response
      Object.assign(persona, data)
      // permission.value = data
      cargando.value = false
    })
    .catch((error) => {
      console.log(error)
      cargando.value = true
      ElNotification({
        type: 'error',
        title: 'Error al recuperar el registro',
        duration: 2000
      })
      close('canceled')
    })
}

onMounted(() => {
  cargarRegistroActualEditar()
  // console.log(props)
})

const enviarFormulario = async (formEl) => {
  console.log(persona)
  if (!formEl) return
  cargando.value = true
  await formEl.validate((valid) => {
    if (valid) {
      if (persona.id !== undefined && persona.id > 0) {
        submitEditForm()
      } else {
        submitAddForm()
      }
    } else {
      cargando.value = false
    }
  })
}

const submitAddForm = () => {
  requestPersona
    .store(persona) // Enviar los datos del formulario a la API
    .then((response) => {
      console.log(response)
      ElNotification({
        type: 'success',
        title: 'Registro creado con éxito',
        duration: 2000
      })
      cerrar('success')
      cargando.value = false
    })
    .catch((error) => {
      console.log(error)
      cargando.value = false
    })
}

const submitEditForm = () => {
  console.log(persona)
  requestPersona
    .update(persona.id, persona) // Enviar los datos del formulario a la API
    .then((response) => {
      console.log(response)
      ElNotification({
        type: 'success',
        title: 'Registro actualizado con éxito',
        duration: 2000
      })
      cerrar('success')
      cargando.value = false
    })
    .catch((error) => {
      console.log(error)
      cargando.value = false
    })
}

const reiniciarFormulario = () => {
  Object.assign(persona, reactive({
    id: undefined,
    nombres: '',
    paterno: '',
    materno: '',
    nro_documento: '',
    direccion: '',
    telefono: '',
    correo: ''
  }))

  formularioCrearPersona.value.resetFields()
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
