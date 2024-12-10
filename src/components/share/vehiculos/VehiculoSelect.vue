<template>
  <el-card shadow="never" v-loading="loading">
    <div>
      <el-tabs v-model="activeName" class="demo-tabs">
        <el-tab-pane label="Lista de registros" name="first">
          <!-- Componente para buscar personas -->
          <el-row :gutter="12">
            <el-col :xs="24" :sm="24" :md="24" class="actions-component">
              <el-input
                v-model="listQuery.keyword"
                placeholder="Buscar por placa"
                @change="getLista"
                :clearable="true"
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
            header-row-class-name="table-header-custom"
            row-class-name="table-row-custom"
          >
            <el-table-column prop="index" label="#" width="80" header-:align="'center'" :align="'center'" />
            <el-table-column prop="full_name" min-width="200px" label="DESCRIPCION"/>
            <el-table-column fixed="right" :align="'center'" width="120px" label="Opciones">
              <template #default="scope">
                <div>
                  <v-icon name="BiArrowDownRightSquare" class="pointer" @click="selectItemRow(scope.row)" />
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
        </el-tab-pane>
        <el-tab-pane label="Agregar registro" name="second">
          <!-- Componente para agregar una nueva persona -->
           <FormVehiculo
            :id-registro="0"
            @closeform="procesCloseForm($event)"
          />
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-card>
</template>

<script setup>
import Resource from '@/api/resource'
import {
  reactive,
  ref,
  onMounted,
} from 'vue'
import FormVehiculo from '@/views/admin/vehiculos/components/FormVehiculo.vue';

const modelRequest = new Resource('listavehiculos')
const emit = defineEmits(['closeVehiculo'])

const loading = ref(false)
const items = ref([])
const total = ref(0)
const activeName = ref('first')
const listQuery = reactive({
  keyBuscar: '',
  page: 1,
  limit: 7
})

const getLista = () => {
  loading.value = true
  // console.log(props)
  const { page, limit } = listQuery
  modelRequest
    .list(listQuery)
    .then((response) => {
      const { data, meta } = response
      items.value = data
      items.value.forEach((element, index) => {
        element['index'] = (page - 1) * limit + index + 1
      })
      total.value = meta.total
      loading.value = false
    })
    .catch((error) => {
      console.log(error)
      loading.value = false
    })
}

onMounted(() => {
  getLista()
})

const selectItemRow = (row) => {
  // console.log(row)
  emit('closeVehiculo', {
    action: 'close',
    data: row
  })
}

const procesCloseForm = (datos) => {
  // console.log(datos)
  const {status, data} = datos
  activeName.value = 'first'
  if (status === 'success') {
    listQuery.keyword = data.nro_documento
    getLista()
  }
}
</script>
