<template>
  <el-card shadow="never" v-loading="loading">
    <div>
      <!-- Componente para buscar personas -->
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="24" class="actions-component">
          <el-input
            v-model="listQuery.keyword"
            placeholder="Buscar por nombre"
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
        header-row-class-name="table-header-custom"
        row-class-name="table-row-custom"
      >
        <el-table-column prop="id" label="Id" width="80" header-:align="'center'" :align="'center'" />
        <el-table-column prop="codigo" label="Código" />
      </el-table>
      <el-divider />
      <el-row type="flex" justify="end" class="my-3">
        <el-pagination
          size="small"
          v-model:current-page="listQuery.page"
          v-model:page-size="listQuery.limit"
          :total="total"
          :page-sizes="[10, 15, 25, 50]"
          layout="prev, pager, next"
          background
          @size-change="getLista"
          @current-change="getLista"
        />
      </el-row>
    </div>
  </el-card>
</template>

<script setup>
import Resource from '@/api/resource'
import {
  reactive,
  ref,
  // watch,
  onMounted,
  // nextTick
} from 'vue'

const modelRequest = new Resource('listacodigosafiliacion')

const loading = ref(false)
const items = ref([])
const total = ref(0)
const listQuery = reactive({
  keyBuscar: '',
  page: 1,
  limit: 7
})


const getLista = () => {
  loading.value = true
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
</script>
