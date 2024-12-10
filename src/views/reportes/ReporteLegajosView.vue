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
      <el-table-column label="Cargo" min-width="150">
        <template #default="scope">
            {{ scope.row.trabajador?.cargo?.nombre }}
        </template>
      </el-table-column>
      <el-table-column label="Estado" width="110px" prop="estado" />
      <el-table-column fixed="right" :align="'center'" width="150px">
        <template #header>
          <el-dropdown trigger="click" @command="handleCommandOpciones">
            <span class="el-dropdown-link">
              Opciones<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu ref="dropdown">
                <el-dropdown-item
                  :command="{ action: 'EXPORT' }"
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
                  :command="{ item: scope.row, action: 'ANEXO5' }"
                >
                  <span>
                    <v-icon name="la-database-solid" style="margin-right: 10px" />
                    Anexo 5
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
      <!-- <FormLegajos
        ref="refFormLegajos"
        :id-registro="idItemToEdit" 
        @close="handleCloseFormPersona"
      /> -->
    </el-dialog>

  </div>
</template>

<script setup>
import Resource from '@/api/resource'
import { ArrowDown } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { onMounted, reactive, ref } from 'vue'
import { calcularAnchoDialog } from '@/utils/responsive'

const personRequest = new Resource('administracion/legajos')
const exportResource = new Resource('exportar/legajos')
const anexosResource = new Resource('pdf/legajos-anexos')
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

const handleCommandOpciones = ({ action }) => {
  if (action === 'EXPORT') {
    exportarDatos()
  } else {
    ElNotification({ message: 'Esta acción no se reconoce', type: 'info' })
  }
}

const handleCommandAcciones = ({ item, action }) => {
  if (action == 'ANEXO5') {
    obtenerAnexo5(item.id, 'ANEXO5')
  } else {
    ElNotification({ message: 'Esta acción no se reconoce', type: 'info' })
  }
}

const obtenerAnexo5 = async (id, anexo) => {
  loading.value = true
  await anexosResource
    .list({
      id: id,
      anexo: anexo
    })
    .then((response) => {
      const { state, messge, data } = response
      if (state === 'success') {
        const link = document.createElement('a')
        link.href = data
        document.body.appendChild(link)
        link.click()
      } else {
        ElNotification({ message: messge })
      }
      loading.value = false
    })
    .catch(() => {
      ElNotification({ message: 'Se ha producido una excepción' })
      loading.value = false
    })
    .finally(() => { loading.value = false })
}

const exportarDatos = async () => {
  loading.value = true
  await exportResource
    .list(query)
    .then((response) => {
      const link = document.createElement('a')
      link.href = response
      document.body.appendChild(link)
      link.click()
      loading.value = false
    })
    .catch(() => {
      ElNotification({ message: 'Se ha producido una excepción' })
      loading.value = false
    })
    .finally(() => { loading.value = false })

}

const beforeCloseDFPersona = (done) => {
  idItemToEdit.value = -3
  // console.log(idItemToEdit.value)
  done()
}

</script>
