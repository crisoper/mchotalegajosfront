<template>
  <div v-loading="loadingData">
    <el-row :gutter="12">
      <el-col :xs="24" :sm="24" :md="24" class="actions-component">
        <el-input
          v-model="listQuery.keyword"
          placeholder="Buscar por placa"
          @change="getLista"
        >
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
    <el-table
      :data="items"
      :border="true"
      :stripe="true"
      style="width: 100%; margin-top: 15px !important;"
      empty-text="Sin datos"
      header-row-class-name="table-header-custom"
      row-class-name="table-row-custom"
    >
      <el-table-column prop="index" label="#" width="80" header-:align="'center'" :align="'center'" />
      <el-table-column prop="vehiculo_full_name" label="VEHICULO"/>
      <el-table-column :align="'center'" width="115px" prop="fecha_ingreso_es" label="F. INGRESO"/>
      <el-table-column :align="'center'" width="115px" prop="fecha_salida_es" label="F. SALIDA"/>
      <el-table-column :align="'center'" width="90px" prop="activo_texto" label="ACTIVO"/>
      <el-table-column fixed="right" :align="'center'" width="130px">
        <template #header>
          <el-dropdown trigger="click" @command="handleActionsOpciones">
            <span class="el-dropdown-link">
              Opciones<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu ref="dropdown">
                <el-dropdown-item
                  :command="{ action: 'ADD' }"
                  :disabled="isActionDisabled('transportes.admin.empresa.crear')"
                >
                  <span>
                    <v-icon name="hi-plus" style="margin-right: 10px" />
                    Agregar
                  </span>
                </el-dropdown-item>
                <el-dropdown-item
                  :command="{ action: 'EXPORT' }"
                  :disabled="isActionDisabled('transportes.admin.empresa.exportar')"
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
        <template #default="scope">
          <div>
            <el-dropdown trigger="click" @command="handleRowActions">
              <span class="el-dropdown-link">
                Acciones<el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    :command="{ item: scope.row, action: 'EDIT' }"
                    :disabled="isActionDisabled('transportes.admin.empresa.actualizar')"
                  >
                    <span>
                      <v-icon name="md-edit-round" style="margin-right: 10px" />
                      Editar
                    </span>
                  </el-dropdown-item>
                  <el-dropdown-item
                    :command="{ item: scope.row, action: 'DELETE' }"
                    :disabled="isActionDisabled('transportes.admin.empresa.eliminar')"
                  >
                    <span>
                      <v-icon name="md-delete" style="margin-right: 10px" />
                      Eliminar
                    </span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-divider />
    <el-row type="flex" justify="end" class="my-3">
      <el-pagination
        
        v-model:current-page="listQuery.page"
        v-model:page-size="listQuery.limit"
        :total="total"
        :page-sizes="[10, 15, 25, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        background
        @size-change="getLista"
        @current-change="getLista"
      />
    </el-row>
    <el-dialog
      v-model="openDialogCreate"
      top="5vh"
      :width="calcularAnchoDialog('80%','90%')"
      :before-close="beforeCloseCreate"
    >
      <template #header>
        <h3>{{ titleForm }}</h3>
      </template>
      <FormVehiculoFlota
        :id-registro="item_id"
        :id-empresa="empresa_id"
        @close="closeFormVehiculoFlota($event)"
      />
    </el-dialog>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import {
  ArrowDown
} from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'
import { calcularAnchoDialog } from '@/utils/responsive'
import { useAuthStore } from "@/stores/auth";
import { nextTick } from 'vue'
import FormVehiculoFlota from '@/components/share/vehiculos/FormVehiculoFlota.vue';
const dataResource = new Resource('administracion/empresasvehiculos')
const exportResource = new Resource('administracion/exportar/empresasvehiculos')
const authStore = useAuthStore()
const validPermision = authStore.validPermision

export default {
  name: 'FlotaView',
  components: { 
    ArrowDown,
    FormVehiculoFlota
  },
  props: {
    idEmpresa: {
      type: Number,
      required: true,
      default: -7
    }
  },
  data() {
    return {
      items: [],
      item_id: -1,
      empresa_id: -1,
      total: 0,
      listQuery: {
        page: 1,
        limit: 10,
        empresa_id: undefined,
        keyBuscar: ''
      },
      action_text: 'create',
      editedItem: { id: 0, name: '' },
      dialogVisible: false,
      loadingData: false,
      openDialogCreate: false,
      openDialogEdit: false,
      loading: false,
      titleForm: 'Agregar registro',
      calcularAnchoDialog,
      tabFormEmpresa: 'first', // Valor inicial del tab en el FormEmpresa
    }
  },
  watch: {
    idEmpresa(newValue, oldValue) {
      if (newValue > 0) {
        this.empresa_id = newValue
        this.listQuery.empresa_id = newValue
        console.log('this.empresa_id FlotaView@watch ', this.empresa_id)
      } else {
        console.log('Error al cambiar el valor de id_empresa')
      }
      console.log(`Se ha ejecutado watch en FlotaView ${oldValue} a ${newValue}`);
    }
  },
  computed: {},
  mounted() {},
  created() {
    this.getLista()
  },
  methods: {
    async getLista() {
      const { limit, page } = this.listQuery
      this.loadingData = true
      await dataResource.list(this.listQuery)
      .then((response) => {
        const { data, meta } = response
        this.items = data
        this.items.forEach((element, index) => {
          element['index'] = (page - 1) * limit + index + 1
        })
        this.total = meta.total
        this.loadingData = false
      })
      .catch(() => {
        this.loadingData = false
      })
    },
    handleSearch() {
      this.listQuery.page = 1
      this.getLista()
    },
    addItem() {
      // console.log('Agregar registro')
      this.titleForm = 'Agregar registro'
      this.openDialogCreate = true
      this.$nextTick(() => {
        this.item_id = 0
      })
    },
    editItem(item) {
      // console.log('Modificar registro')
      this.titleForm = 'Modificar registro'
      this.openDialogCreate = true;
      this.$nextTick(() => {
        this.item_id = item.id
        // this.tabFormEmpresa = 'first'
      })
    },
    deleteItem(row) {
      const msg = `
      ¿Seguro que desea eliminar el registro?<br /><br />
      ${row.vehiculo_full_name}
      `
      ElMessageBox.confirm(
        msg,
        'Atención',
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: 'Si, eliminar',
          cancelButtonText: 'Cancelar',
          type: 'warning',
        }
      )
        .then(() => {
          this.handleDelteItem(row.id)      
        })
        .catch(() => {
          ElMessage('Operación cancelada!')
        })
    },
    handleDelteItem(id) {
      this.loadingData = true
      dataResource
      .destroy(id)
      .then((response) => {
        const {state, message} = response
        this.$message({
          type: state,
          message
        })
        this.loadingData = false
        this.handleSearch()
      })
      .catch(() => {
        this.loadingData = false
      })
    },
    handleCloseCreate(event) {
      console.log(event)
      this.openDialogCreate = false
      nextTick(() => {
        if (event === 'success') {
          this.getLista()
        }
        
        this.tabFormEmpresa = 'first'
        this.item_id = -1 * (Math.floor(Math.random() * (100 - 10 + 1)) + 10)
        console.log(this.tabFormEmpresa)
      })
    },
    beforeCloseCreate(done) {
      this.item_id = -1 * (Math.floor(Math.random() * (100 - 10 + 1)) + 10)
      this.tabFormEmpresa = 'first'
      console.log(this.tabFormEmpresa)
      console.log('Cerrando ventana', this.item_id)
      // nextTick(() => {
      // })
      done()
    },
    handleRowActions(commandData) {
      const { item, action } = commandData
      if (action === 'EDIT' && validPermision('transportes.admin.empresa.actualizar')) {
        this.editItem(item)
      } else if (action === 'DELETE' && validPermision('transportes.admin.empresa.eliminar')) {
        this.deleteItem(item)
      } else {
        ElNotification({ message: 'Usted no tiene permiso para realizar esta acción', type: 'info' })
      }
    },
    handleActionsOpciones(command) {
      const { action } = command
      if (action === 'ADD' && validPermision('transportes.admin.empresa.crear')) {
        this.addItem()
      } else if (action === 'EXPORT' && validPermision('transportes.admin.empresa.exportar')) {
        this.exportarDatos()
      } else {
        ElNotification({message: 'Usted no tiene permiso para realizar esta acción', type: 'info' })
      }
    },
    isActionDisabled(action) {
      return !validPermision(action.toLowerCase());
    },
    closeFormVehiculoFlota(event) {
      console.log(event)
      if (event === 'success') {
        this.item_id = -6
        this.openDialogCreate = false
        this.getLista()
      } else if (event === 'canceled') {
        this.item_id = -6
        this.openDialogCreate = false
      }
    },
    exportarDatos() {
      this.loadingData = true
      exportResource
        .exportar(this.listQuery)
        .then((response) => {
          this.loadingData = false
          const link = document.createElement('a')
          link.href = response
          document.body.appendChild(link)
          link.click()
        })
        .catch(() => {
          this.loadingData = false
        })
        .finally(() => {
          this.loadingData = false
        })
    }
  }
}
</script>
