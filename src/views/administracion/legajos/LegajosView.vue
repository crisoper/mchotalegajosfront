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
      <el-table-column type="index" label="#" width="70" />
      <el-table-column prop="numero" label="Número" width="100" />
      <el-table-column label="Doc. identidad" width="130">
        <template #default="scope">
            {{ scope.row.persona?.nro_documento }}
        </template>
      </el-table-column>
      <el-table-column label="Trabajador" min-width="150">
        <template #default="scope">
            {{ scope.row.persona?.nombre_completo }}
        </template>
      </el-table-column>
      <el-table-column label="Unidad orgánica" min-width="150">
        <template #default="scope">
            {{ scope.row.trabajador?.area?.nombre }}
        </template>
      </el-table-column>
      <el-table-column prop="cargo" label="Cargo" min-width="150">
        <template #default="scope">
            {{ scope.row.trabajador?.cargo?.nombre }}
        </template>
      </el-table-column>
      <el-table-column prop="cargo" label="F. vinculación" width="140">
        <template #default="scope">
            {{ scope.row.trabajador?.fecha_vinculacion_es }}
        </template>
      </el-table-column>
      <el-table-column prop="cargo" label="F. desvinculación" width="140">
        <template #default="scope">
            {{ scope.row.trabajador?.fecha_desvinculacion_es }}
        </template>
      </el-table-column>
      <el-table-column fixed="right" :align="'center'" width="150px">
        <template #header>
          <el-dropdown trigger="click" @command="handleCommandOpciones">
            <span class="el-dropdown-link">
              Opciones<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu ref="dropdown">
                <el-dropdown-item
                  :command="{ action: 'ADD' }"
                  :disabled="isActionDisabled('administracion.legajos.crear')"
                >
                  <span>
                    <v-icon name="hi-plus" style="margin-right: 10px" />
                    Agregar
                  </span>
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{ action: 'EXPORT' }"
                  :disabled="isActionDisabled('administracion.legajos.exportar')"
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
                  :disabled="isActionDisabled('administracion.legajos.actualizar')"
                >
                  <span>
                    <v-icon name="md-edit-round" style="margin-right: 10px" />
                    Editar
                  </span>
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{ item: scope.row, action: 'INFOSECCIONES' }"
                  :disabled="isActionDisabled('administracion.legajos.infosecciones')"
                >
                  <span>
                    <v-icon name="la-database-solid" style="margin-right: 10px" />
                    Secciones
                  </span>
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{ item: scope.row, action: 'DELETE' }"
                  :disabled="isActionDisabled('administracion.legajos.eliminar')"
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

    <!-- Diálogo de Form Legajo -->
    <el-dialog
      top="3vh"
      v-model="openDialogFormPersona"
      :width="calcularAnchoDialog('94%', '98%')" 
      :before-close="beforeCloseDFPersona"
    >
      <!-- fullscreen -->
      <template #header>
        <h3>{{ titleForm }}</h3>
      </template>
      <FormLegajos
        ref="refFormLegajos"
        :id-registro="idItemToEdit" 
        @close="handleCloseFormPersona"
      />
    </el-dialog>

  </div>
</template>

<script setup>
import Resource from '@/api/resource'
import { ArrowDown, Delete } from '@element-plus/icons-vue'
import FormLegajos from './components/FormLegajos.vue'
// import EditPerson from './components/EditPersona.vue'
// import ExportPerson from './components/ExportPerson.vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { nextTick, onMounted, reactive, ref, markRaw } from 'vue'
import { calcularAnchoDialog } from '@/utils/responsive'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const personRequest = new Resource('administracion/legajos')
const authStore = useAuthStore()
const validPermision = authStore.validPermision
const loading = ref(false)
const openDialogFormPersona = ref(false)
const tableData = ref([])
const total = ref(0)
const titleForm = ref('')
const query = reactive({
  keyword: '',
  limit: 10,
  page: 1
})
const idItemToEdit = ref(-2)
const refFormLegajos = ref(null)  // Usar ref() para acceder al componente hijo
const router = useRouter();

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
  titleForm.value = 'Registrar legajo'
  idItemToEdit.value = -7
  nextTick(() => {
    openDialogFormPersona.value = true
    reiniciarFormularioHijo()
  })
}

const editItem = (id) => {
  reiniciarFormularioHijo()
  titleForm.value = 'Modificar legajo'
  idItemToEdit.value = -7
  nextTick(() => {
    idItemToEdit.value = id
    openDialogFormPersona.value = true
  })
}

const deleteItem = (item) => {
  const msg = `
  ¿Seguro que desea eliminar el registro?<br /><br />
  ${item.persona?.nro_documento} ${item.persona?.nombre_completo}
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
      personRequest
        .destroy(item.id)
        .then((response) => {
          const { message, state } = response
          if (state === 'success') {
            getLista()
          }
          ElNotification({
            title: message,
            type: state
          })
        })
        .catch((error) => console.log(error))
    })
    .catch((error) => {
      console.log(error)
    })
}

const handleCloseFormPersona = (status) => {
  if (status == 'success') getLista()
  openDialogFormPersona.value = false
  idItemToEdit.value = -10
}

const handleCommandOpciones = ({ action }) => {
  if (action === 'ADD' && validPermision('administracion.legajos.crear')) {
    addItem()
  } else if (action === 'EXPORT' && validPermision('administracion.legajos.exportar')) {
    this.exportarDatos()
  } else {
    ElNotification({ message: 'Usted no tiene permiso para realizar esta acción', type: 'info' })
  }
}

const handleCommandAcciones = ({ item, action }) => {
  if (action == 'EDIT' && validPermision('administracion.legajos.actualizar')) {
    editItem(item.id)
  } else if (action == 'DELETE' && validPermision('administracion.legajos.eliminar')) {
    deleteItem(item)
  } else if (action == 'INFOSECCIONES' && validPermision('administracion.legajos.infosecciones')) {
    router.push({ 
      name: 'AdminLegajosSecciones',
      params: { id: item.id }
    }).catch(err => {
      console.error('Error al navegar:', err);
    })
  }
}

const beforeCloseDFPersona = (done) => {
  idItemToEdit.value = -3
  // console.log(idItemToEdit.value)
  done()
}

const isActionDisabled = (action) => {
  return !validPermision(action.toLowerCase())
}


const reiniciarFormularioHijo = () => {
  // Acceder al método reiniciarFormulario a través de la referencia
  if (refFormLegajos.value) {
    // console.log('Ejecutando función definida en componente hijo')
    // refFormLegajos.value.expuestaDesdeFormPersona()
  }
}
</script>
