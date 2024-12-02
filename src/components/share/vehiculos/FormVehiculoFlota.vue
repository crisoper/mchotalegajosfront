<template>
  <el-card class="px-2" shadow="never" v-loading="loading">
    <el-form ref="createObject" :model="model" :rules="rules" label-position="top">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="placa" label="Placa">
            <template #label>
              <div v-if="model.vehiculo_id === undefined" style="display: flex; justify-content: space-between;">
                <span>Placa</span>
                <el-button
                  @click="openDialogVehiculoSelect()"
                  type="primary"
                  link
                  :underline="false"
                >
                  <template #icon>
                    <v-icon :name="'hi-plus'" />
                  </template>
                  <span class="text-muted">
                    Agregar
                  </span>
                </el-button>
              </div>
              <div v-else style="display: flex; justify-content: space-between;">
                <span>Placa</span>
                <el-button
                  @click="resetForm()"
                  type="danger"
                  link
                  :underline="false"
                >
                  <template #icon>
                    <v-icon :name="'io-close-outline'" class="text-danger" />
                  </template>
                  <span class="text-muted">
                    Quitar
                  </span>
                </el-button>
              </div>
            </template>
            <el-input
              v-model="model.placa"
              style="width: 100%"
              placeholder="Placa"
              class="input-with-select"
              :readonly="model.vehiculo_id !== undefined"
            >
              <template #append>
                <el-button :icon="Search" @click="searchVehiucloPlaca()" :disabled="model.id !== undefined" />
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="16">
          <el-form-item prop="vehiculo_descripcion" label="Descripción vehículo">
            <el-input v-model="model.vehiculo_descripcion" placeholder="Descripción vehículo" readonly />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="fecha_ingreso" label="Fecha ingreso">
            <el-date-picker
              v-model="model.fecha_ingreso"
              type="date"
              placeholder="Fecha ingreso"
              value-format="YYYY-MM-DD"
              format="DD-MM-YYYY"
            />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item prop="fecha_salida" label="Fecha salida">
            <el-date-picker
              v-model="model.fecha_salida"
              type="date"
              placeholder="Fecha salida"
              value-format="YYYY-MM-DD"
              format="DD-MM-YYYY"
            />
          </el-form-item>
        </el-col>
        <el-divider />
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <el-form-item label="Registro SOAT" prop="soat">
            <el-table
              ref="tableSoatRef"
              :data="model.soats"
              bordered
              striped
              style="width: 100%"
              @row-click="handleRowClick"
              :row-class-name="tableRowClassName"
              empty-text="Sin datos"
            >
              <!-- <el-table-column type="index" width="50" /> -->
              <el-table-column label="SOAT" prop="soat_name" min-width="120" />
              <el-table-column width="120" label="Fecha inicio" prop="fecha_inicio_es" />
              <el-table-column width="120" label="Fecha venc." prop="fecha_vencimiento_es" />
              <el-table-column label="Activo" prop="activo_texto" width="80" :align="'center'" />
              <el-table-column width="100" :align="'center'" fixed="right">
                <template #header>
                  <el-button
                    @click="agregarSoatVehiculo()"
                    type="primary"
                    link
                    :underline="false"
                    :disabled="model.vehiculo_id === undefined || model.vehiculo_id === ''"
                  >
                    <template #icon>
                      <v-icon :name="'hi-plus'" />
                    </template>
                    <span class="text-muted">
                      Agregar
                    </span>
                  </el-button>
                </template>
                <template #default="scope">
                  <el-button
                    v-if="scope.row.seleccionado"
                    type="primary"
                    size="small"
                    @click.stop="toggleSelection(scope.row)"
                  >
                    Actual
                  </el-button>
                  <el-button
                    v-else
                    size="small"
                    @click.stop="toggleSelection(scope.row)"
                  >
                    Actual
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
        <el-divider />
        <el-col :xs="24" :sm="24" :md="24" :lg="24">
          <el-form-item label="Registro inspección" prop="inspeccion">
            <el-table
              ref="tableInspeccionRef"
              :data="model.inspecciones"
              bordered
              striped
              style="width: 100%"
              @row-click="rowClickTableInspeccion"
              :row-class-name="tableRowClassName"
              empty-text="Sin datos"
            >
              <!-- <el-table-column type="index" width="50" /> -->
              <el-table-column min-width="120" label="Tipo" prop="tipo" />
              <el-table-column width="120" label="Código" prop="codigo" />
              <el-table-column width="105" label="Fecha" prop="fecha_es" />
              <el-table-column width="120" label="Nro ficha" prop="nro_ficha" />
              <el-table-column width="120" label="Nro holograma" prop="nro_holograma" />
              <el-table-column label="Activo" prop="activo_texto" width="80" :align="'center'" />
              <el-table-column width="100" :align="'center'" fixed="right">
                <template #header>
                  <el-button
                    @click="agregarInspeccion()"
                    type="primary"
                    link
                    :underline="false"
                    :disabled="model.vehiculo_id === undefined || model.vehiculo_id === ''"
                  >
                    <template #icon>
                      <v-icon :name="'hi-plus'" />
                    </template>
                    <span class="text-muted">
                      Agregar
                    </span>
                  </el-button>
                </template>
                <template #default="scope">
                  <el-button
                    v-if="scope.row.seleccionado"
                    type="primary"
                    size="small"
                    @click.stop="toggleSelectInspeccion(scope.row)"
                  >
                    Actual
                  </el-button>
                  <el-button
                    v-else
                    size="small"
                    @click.stop="toggleSelectInspeccion(scope.row)"
                  >
                    Actual
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12" :md="8" :lg="8">
          <el-form-item label="Activo">
            <el-switch
              v-model="model.activo"
              active-text="Si"
              inactive-text="No"
            />
          </el-form-item>
        </el-col>
      </el-row>
      
    </el-form>
    <el-row :gutter="10" type="flex" justify="end" class="mt-3">
      <el-button @click="close('canceled')">CANCELAR</el-button>
      <el-button v-if="model.id === undefined" type="primary" @click="submitForm(createObject)">GUARDAR</el-button>
      <el-button v-else type="primary" @click="submitForm(createObject)">ACTUALIZAR</el-button>
    </el-row>
    <el-dialog
      v-model="dialogVehiculoSelect"
      top="7vh"
      :width="calcularAnchoDialog('75%','88%')"
      draggable
    >
      <!-- :before-close="beforeCloseCreate" -->
      <template #header>
        <h3>Seleccionar vehículo</h3>
      </template>
        <VehiculoSelect
          ref="VehiculoSelectRef"
          @closeVehiculo="parentProcessVehiculoSelect($event)"
        />
    </el-dialog>
    <!-- Agregar SOATS al vehiculo, solo es visible si existe un vehiculo seleccinado -->
    <el-dialog
      v-model="dialogFormAddSoatVehiculo"
      top="7vh"
      :width="calcularAnchoDialog('72%','82%')"
      :before-close="beforeCloseFormSoatVehiculo"
    >
      <template #header>
        <h3>Registrar SOAT</h3>
      </template>
      <FormSoatVehiculo
        ref="FormSoatVehiculoRef"
        :id-soat-vehiculo="0"
        :id-vehiculo="vehiculo_id"
        @close="closeFormSoatVehiculo($event)"
      />
    </el-dialog>
    <el-dialog
      v-model="dialogFormInspeccionVehiculo"
      top="5vh"
      :width="calcularAnchoDialog('80%','92%')"
      :before-close="beforeCloseFormInspeccionVehiculo"
    >
      <template #header>
        <h3>Registrar inspección</h3>
      </template>
      <FormInspeccionVehiculo
        :id-soat-vehiculo="0"
        :id-vehiculo="vehiculo_id"
        @close="closeFormInspeccionVehiculo($event)"
      />
    </el-dialog>
  </el-card>
</template>

<script setup>
import Resource from '@/api/resource'
import { ElNotification, ElTable } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import { isNumber } from 'element-plus/es/utils/types.mjs'
import { reactive, ref, watch, onMounted, nextTick } from 'vue'
import { calcularAnchoDialog } from '@/utils/responsive'
import VehiculoSelect from '@/components/share/vehiculos/VehiculoSelect.vue'
import FormSoatVehiculo from '@/views/admin/vehiculos/components/FormSoatVehiculo.vue'
import FormInspeccionVehiculo from '@/views/admin/vehiculos/components/FormInspeccionVehiculo.vue'

const modelRequest = new Resource('administracion/empresasvehiculos')
const listaServiciosRequest = new Resource('listaservicios')
const consultaPlacaResource = new Resource('consultaplaca')
const emit = defineEmits(['close'])
const vehiculo_id = ref(0)
const loading = ref(false)
const dialogVehiculoSelect = ref(false)
const dialogFormAddSoatVehiculo = ref(false)
const dialogFormInspeccionVehiculo = ref(false)
const createObject = ref()
const tableSoatRef = ref(null)
const FormSoatVehiculoRef = ref(null)
const model = reactive({
  id: undefined,
  empresa_id: undefined,
  vehiculo_id: undefined,
  placa: '',
  estado: '',
  fecha_ingreso: '',
  fecha_salida: '',
  vehiculo_inspeccion_id: undefined,
  vehiculo_soat_id: undefined,
  vehiculo: '',
  soat: undefined,
  inspeccion: undefined,
  vehiculo_descripcion: '',
  soats: [],
  inspecciones: [],
  activo: true
})

const servicios = ref([])

// const validatePlaca = (rule, value, callback) => {
//   if (value === '') {
//     callback(new Error('Campo obligatorio'))
//   } else {
//     if (model.placa !== '') {
//       if (!createObject.value) return
//       createObject.value.validateField('placa')
//       console.log('Existe: createObject.value.validateField(placa)')
//     }
//     callback()
//   }
// }

const validatePlaca = (rule, value, callback) => {
  // Primero, manejar el caso de campo vacío
  if (value === '') {
    callback(new Error('Campo obligatorio'))
    return; // Salir de la función después de manejar el error
  }

  // Asegurarse de que se realice la validación solo si el modelo tiene una placa
  if (model.placa !== '' && createObject.value) {
    // Solo validar si es necesario
    if (!createObject.value.isValidating) { // Asegúrate de que `isValidating` sea una propiedad real
      createObject.value.isValidating = true; // Indicar que la validación está en curso
      createObject.value.validateField('placa').finally(() => {
        createObject.value.isValidating = false; // Restablecer el estado de validación
        callback(); // Llamar al callback después de la validación
      });
      return; // Salir para evitar llamadas adicionales al callback
    }
  }

  // Llamar al callback normalmente si todo está bien
  callback();
}

const props = defineProps({
  idRegistro: {
    type: Number,
    required: true,
    default: -4
  },
  idEmpresa: {
    type: Number,
    required: true,
    default: -4
  },
})

const rules = reactive({
  placa: [{ validator: validatePlaca, trigger: 'blur' }],
  vehiculo_descripcion: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  fecha_ingreso: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  soat: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  inspeccion: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }],
  activo: [{ required: true, message: 'Campo obligatorio', trigger: 'blur' }]
})

watch(() => {
  return props.idRegistro;
}, (newValue, oldValue) => {
  resetForm()
  if(newValue != oldValue && newValue != '' && newValue != null) {
    // console.log(newValue, oldValue)
    cargarRegistro()
  }
  console.log('Se ha ejecutado watch en FormVehiculoFlota: ', oldValue, newValue)
})

onMounted(() => {
  cargarRegistro()
  loadDataInicial()
})

const cargarRegistro = () => {
  // console.log('Obteniendo datos del registros empresa_vehiculo', props.idRegistro)
  if (isNumber(props.idRegistro) && props.idRegistro > 0) {
    model.id = props.idRegistro
    loading.value = true
    // console.log(props)
    modelRequest
      .get(props.idRegistro)
      .then((response) => {
        const { data, message, state } = response

        if (state === 'success') {
          model.empresa_id = data.empresa_id
          model.vehiculo_id = data.vehiculo_id
          model.placa = data.vehiculo?.placa
          model.estado = data.estado
          model.fecha_ingreso = data.fecha_ingreso
          model.fecha_salida = data.fecha_salida
          model.vehiculo_inspeccion_id = data.vehiculo_inspeccion_id
          model.vehiculo_soat_id = data.vehiculo_soat_id
          model.vehiculo = data.vehiculo
          model.soat = data.soat
          model.inspeccion = data.inspeccion
          model.vehiculo_descripcion = data.vehiculo?.full_name
          model.soats = data.vehiculo?.soats
          model.inspecciones = data.vehiculo?.inspecciones
          model.activo = data.activo

          if (data.soat !== null) {
            const soatEncontrado = model.soats.find(soat => soat.id === data.soat.id);
            if (soatEncontrado) {
              toggleSelection(soatEncontrado)
            }
          }
          
          if (data.inspeccion !== null) {
            const inspecionEncontrado = model.inspecciones.find(inspeccion => inspeccion.id === data.inspeccion.id);
            if (inspecionEncontrado) {
              toggleSelectInspeccion(inspecionEncontrado)
            }
          }

          nextTick(() => {
            console.log(model)
          })
        }
        else if(state === 'error') {
          ElNotification({
            type: 'error',
            title: message,
            duration: 2000
          })
        }

        nextTick(() => {
          loading.value = false
        })
      })
      .catch((error) => {
        console.log(error)
        loading.value = false
        ElNotification({
          type: 'error',
          title: 'Error al recuperar el registro',
          duration: 2000
        })
        close('canceled')
      })
  }
  else {
    // tabFormEmpresa.value = 'first'
    console.log('El identificador no es válido')
    // close('canceled')
  }
}

const submitForm = (formEl) => {
  console.log('submitForm called')
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      console.log('Form is valid')
      if (model.id === undefined) {
        console.log('Calling sendDataCreate')
        sendDataCreate()
      }
      else {
        console.log('Calling sendDataUpdate')
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
    const {message, state} = response
    if (state === 'success') {
      ElNotification({
        type: 'success',
        title: message
      })
      loading.value = false
      close('success')
    } else {
      ElNotification({
        type: 'error',
        title: message
      })
      loading.value = false
    }
  })
  .catch((error) => {
    loading.value = false
    console.log(error)
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
    loading.value = false
    close('success')
  })
  .catch((error) => {
    console.log(error)
    loading.value = false
  })
}

const resetForm = () => {
  Object.assign(model, reactive({
    id: props && props.idRegistro > 0 ? props.idRegistro : undefined,
    empresa_id: props ? props.idEmpresa : undefined,
    vehiculo_id: undefined,
    placa: '',
    estado: '',
    vehiculo: '',
    fecha_ingreso: '',
    fecha_salida: '',
    vehiculo_inspeccion_id: undefined,
    vehiculo_soat_id: undefined,
    soat: undefined,
    inspeccion: undefined,
    vehiculo_descripcion: '',
    soats: [],
    inspecciones: [],
    activo: true
  }));

  nextTick(() => {
    console.log(model)
  })
}

const close = (status) => {
  emit('close', status)
  // resetForm()
}

const searchVehiucloPlaca = () => {
  const placaTemporal = model.placa
  if(model.placa === '') { return }
  loading.value = true
  consultaPlacaResource
    .get(model.placa)
    .then((response) => {
      const { data, message, state } = response

      if (state === 'error') {
        // Reseteamos el formulario
        resetForm()

        // Mostramos notificacion
        ElNotification({
          type: 'error',
          title: message
        })
      } else {
        const { soats, inspecciones } = data
        // console.log(entidad, empresa, propietario)
        model.vehiculo_id = data.id
        model.vehiculo_descripcion = data.full_name
        model.soats = soats
        model.inspecciones = inspecciones
      }
      nextTick(() => {
        // console.log('Model', model)
        model.placa = placaTemporal
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

const loadDataInicial = () => {
  console.log('Cargando data inicial...')
  listaServiciosRequest
    .list({})
    .then((response) => {
      console.log(response)
      servicios.value = response.data
    })
    .catch((err) => {
      console.log(err)
    })
}

const agregarSoatVehiculo = () => {
  if (model.vehiculo_id > 0) {
    vehiculo_id.value = model.vehiculo_id
    dialogFormAddSoatVehiculo.value = true
    nextTick(() => {
      if (FormSoatVehiculoRef.value) {
        FormSoatVehiculoRef.value.funcExpuestaDesdeHijo()
      }
    })
  } else {
    console.log('Valor invalido model.vehiculo_id' + model.vehiculo_id)
  }
}

const agregarInspeccion = () => {
  if (model.vehiculo_id > 0) {
    vehiculo_id.value = model.vehiculo_id
    dialogFormInspeccionVehiculo.value = true
    nextTick(() => {
      if (FormInspeccionVehiculo.value) {
        FormInspeccionVehiculo.value.funcExpuestaDesdeHijo()
      }
    })
  } else {
    console.log('Valor invalido model.vehiculo_id' + model.vehiculo_id)
  }
}

const closeFormSoatVehiculo = () => {
  vehiculo_id.value = -10
  dialogFormAddSoatVehiculo.value = false
  searchVehiucloPlaca()
}

const beforeCloseFormSoatVehiculo = (done) => {
  vehiculo_id.value = -10
  done()
}

const closeFormInspeccionVehiculo = () => {
  vehiculo_id.value = -12
  dialogFormInspeccionVehiculo.value = false
  searchVehiucloPlaca()
}

const beforeCloseFormInspeccionVehiculo = (done) => {
  vehiculo_id.value = -12
  done()
}

const parentProcessVehiculoSelect = (event) => {
  dialogVehiculoSelect.value = false
  const { data } = event
  // console.log(data)
  model.vehiculo_id = data.id
  model.vehiculo_descripcion = data.full_name
  model.placa = data.placa
  model.soats = data.soats
  model.inspecciones = data.inspecciones
}

const openDialogVehiculoSelect = () => {
  dialogVehiculoSelect.value = true
  console.log('openDialogVehiculoSelect()')
}

const toggleSelection = (row) => {
  // Cambia el estado de `seleccionado` solo para la fila actual
  model.soats.forEach(item => {
    item.seleccionado = (item === row)
  })
  model.soat = row
  model.vehiculo_soat_id = row.id
}

const toggleSelectInspeccion = (row) => {
  // Cambia el estado de `seleccionado` solo para la fila actual
  model.inspecciones.forEach(item => {
    item.seleccionado = (item === row)
  })
  model.inspeccion = row
  model.vehiculo_inspeccion_id = row.id
}

const rowClickTableInspeccion = (row) => {
  // Evitar la propagación del evento de clic en la fila
  toggleSelectInspeccion(row)
}

const handleRowClick = (row) => {
  // Evitar la propagación del evento de clic en la fila
  toggleSelection(row)
}

const tableRowClassName = ({row}) => {
  if (row.seleccionado) {
    return 'selected-row'
  } else {
    return ''
  }
}
</script>
<style>
.el-table .selected-row {
  color: var(--el-color-primary-dark-2);
  font-weight: 600;
  --el-table-tr-bg-color: var(--el-color-primary-light-9);
}
</style>
