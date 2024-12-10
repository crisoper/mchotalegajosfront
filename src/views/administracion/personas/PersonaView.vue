<template>
  <div v-loading="loading">
    <!-- Filtro de búsqueda por nombre -->
    <el-row :gutter="12">
      <el-col :xs="24" :sm="24" :md="24" class="actions-component">
        <el-input v-model="query.keyword" placeholder="Buscar por nombre" @change="getLista">
          <template #append>
            <el-button @click="getLista">
              <template #icon>
                <v-icon name="hi-search" class="pointer" />
              </template>
            </el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!-- Tabla de personas -->
    <el-table
      :data="tableData"
      :border="true"
      style="width: 100%; margin-top: 15px !important"
      header-row-class-name="table-header-custom"
      row-class-name="table-row-custom"
    >
      <el-table-column type="index" label="#" width="65" />
      <el-table-column prop="nro_documento" label="DNI" width="110" />
      <el-table-column prop="nombre_completo" label="Nombre completo" min-width="150"  />
      <el-table-column prop="telefono" label="Teléfono" width="110" />
      <el-table-column prop="correo" label="Correo electrónico" width="220" />
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
                <el-dropdown-item
                  :command="{ action: 'EXPORT' }"
                  :disabled="isActionDisabled('administracion.personas.exportar')"
                >
                  <span>
                    <v-icon name="md-excel" style="margin-right: 10px" />
                    Exportar
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
        @size-change="getLista"
        @current-change="getLista"
      />
    </el-row>

    <!-- Diálogo de Form Persona -->
    <el-dialog
      top="5vh"
      v-model="openDialogFormPersona"
      :width="calcularAnchoDialog('75%', '98%')"
    >
      <template #header>
        <h3>{{ titleForm }}</h3>
      </template>
      <CreatePersona
        ref="formPersona"
        :id-registro="idItemToEdit" 
        @close="handleCloseFormPersona"
      />
    </el-dialog>
  </div>
</template>

<script setup>
import Resource from '@/api/resource'
import { ArrowDown, Delete } from '@element-plus/icons-vue'
import CreatePersona from './components/FormPersona.vue'
// import EditPerson from './components/EditPersona.vue'
// import ExportPerson from './components/ExportPerson.vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { nextTick, onMounted, reactive, ref, markRaw } from 'vue'
import { calcularAnchoDialog } from '@/utils/responsive'
import { useAuthStore } from '@/stores/auth'

const personRequest = new Resource('administracion/personas')
const authStore = useAuthStore()
const validPermision = authStore.validPermision
const loading = ref(false)
const openDialogFormPersona = ref(false)
const tableData = ref([])
const total = ref(0)
const titleForm = ref('')
const query = reactive({
  keyBuscar: '',
  limit: 10,
  page: 1
})
const idItemToEdit = ref(-2)
const formPersona = ref(null)  // Usar ref() para acceder al componente hijo

onMounted(() => {
  getLista()
})

const getLista = () => {
  loading.value = true
  personRequest
    .list(query)
    .then((response) => {
      const { data, meta } = response
      tableData.value = data
      total.value = meta.total
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      loading.value = false
    })
}

const addItem = () => {
  reiniciarFormularioHijo()
  titleForm.value = 'Registrar persona'
  idItemToEdit.value = -4
  nextTick(() => {
    openDialogFormPersona.value = true
  })
}

const editItem = (id) => {
  reiniciarFormularioHijo()
  titleForm.value = 'Modificar datos persona'
  idItemToEdit.value = id
  nextTick(() => {
    openDialogFormPersona.value = true
  })

  // this.$nextTick(() => {
  //   this.item_id = item.id
  // })
}

const handleCloseFormPersona = (status) => {
  if (status == 'success') getLista()
  openDialogFormPersona.value = false
  idItemToEdit.value = -10
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

const handleCommandAcciones = ({ item, action }) => {
  if (action == 'EDIT' && validPermision('administracion.personas.actualizar')) {
    editItem(item.id)
  } else if (action == 'DELETE' && validPermision('administracion.personas.eliminar')) {
    deleteItem(item)
  }
}

const deleteItem = (item) => {
  const msg = `
    ¿Seguro que desea eliminar el registro?<br /><br />
    ${item.nro_documento} - ${item.nombre_completo}
    `
    ElMessageBox.confirm(msg, 'Atención', {
      top: '5vh',
      icon: markRaw(Delete),
      confirmButtonText: 'Sí',
      cancelButtonText: 'Cancelar',
      type: 'warning',
      dangerouslyUseHTMLString: true
    })
      .then(() => {
        personRequest
          .destroy(item.id)
          .then((response) => {
            console.log(response)
            ElNotification({
              title: 'Persona eliminada',
              type: 'success',
              duration: 2000
            })
            getLista()
          })
          .catch((error) => console.log(error))
      })
      .catch((error) => {
        console.log(error)
      })
}

const isActionDisabled = (action) => {
  return !validPermision(action.toLowerCase())
}


const reiniciarFormularioHijo = () => {
  // Acceder al método reiniciarFormulario a través de la referencia
  if (formPersona.value) {
    // console.log('Ejecutando función definida en componente hijo')
    formPersona.value.expuestaDesdeFormPersona()
  }
}
</script>
