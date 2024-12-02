<template>
  <el-card shadow="never" v-loading="loading">
    <el-form ref="createObject" :model="model" :rules="rules" label-position="top">
      <el-form-item prop="nombre" label="Nombre">
        <el-input v-model="model.nombre" placeholder="Nombre" @keydown.enter.prevent="submitForm(createObject)"/>
      </el-form-item>
      <el-form-item label="Activo">
        <el-switch
          v-model="model.activo"
          active-text="Si"
          inactive-text="No"
        />
      </el-form-item>
    </el-form>
    <el-row :gutter="10" type="flex" justify="end" class="mt-3">
      <el-button @click="close('canceled')">CANCELAR</el-button>
      <el-button type="primary" @click="submitForm(createObject)">GUARDAR</el-button>
    </el-row>
  </el-card>
</template>

<script setup>
import Resource from '@/api/resource'
import { reactive, ref, watch, onMounted, nextTick } from 'vue'
import { ElNotification } from 'element-plus'
import { isNumber } from 'element-plus/es/utils/types.mjs';

const modelRequest = new Resource('administracion/cargos')
const emit = defineEmits(['close'])
const loading = ref(false)
const createObject = ref()
const model = reactive({
  id: undefined,
  nombre: '',
  activo: true,
})

const props = defineProps({
  idRegistro: {
    type: Number,
    required: true,
    default: 0 
  }
})

const rules = reactive({
  nombre: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  activo: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }]
})

watch(() => {
  return props.idRegistro;
}, (newValue, oldValue) => {
  resetForm()
  if(newValue != oldValue && newValue != '' && newValue != null && newValue > 0) {
    console.log(newValue, oldValue)
    cargarRegistro()
  }
});


const cargarRegistro = () => {
  if (isNumber(props.idRegistro) && props.idRegistro > 0) {
    loading.value = true
    console.log(props)
    modelRequest
      .get(props.idRegistro)
      .then((response) => {
        const { data } = response
        Object.assign(model, data)
        nextTick(() => {
          console.log('Model', model)
          loading.value = false
        })
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
}

onMounted(() => {
  cargarRegistro()
})

const submitForm = async (formEl) => {
  if (!formEl) return
  // console.log(model)
  // return
  await formEl.validate((valid) => {
    if (valid) {
      if (model.id === undefined) {
        sendDataCreate()
      }
      else {
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
  Object.assign(model, reactive({
    id: undefined,
    nombre: '',
    activo: true,
  }));
}

const close = (status) => {
  emit('close', status)
  resetForm()
}
</script>
