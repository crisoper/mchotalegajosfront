<template>
  <div class="mt-4" v-loading="loadingData">
    <el-form :model="modelUbigeo" label-position="top" style="width: 100%">
      <el-row :gutter="12">
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="Buscar por código">
            <el-input
              ref="txtBuscar"
              v-model="keyBuscar"
              style="width: 100%"
              placeholder="Buscar ubigeo"
              @keyup.enter="buscarUbigeo"
            >
              <template #append>
                <el-button @click="buscarUbigeo">
                  <template #icon>
                    <v-icon :name="'bi-search'" />
                  </template>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="Departamento">
            <el-select
              :filterable="true"
              v-model="modelUbigeo.departamento_id"
              placeholder="Departamento"
              clearable
              @change="changeDepartamento()"
              class="mb-2"
              style="width: 100%"
            >
              <el-option
                v-for="item in lDepartamentos"
                :key="item.id"
                :label="item.nombre_es"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="Provincia">
            <el-select
              :filterable="true"
              v-model="modelUbigeo.provincia_id"
              placeholder="Provincia"
              clearable
              @change="changeProvincia()"
              class="mb-2"
              style="width: 100%"
            >
              <el-option
                v-for="item in lProvincias"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="24" :md="24">
          <el-form-item label="Distrito">
            <el-select
              :filterable="true"
              v-model="modelUbigeo.distrito_id"
              placeholder="Distrito"
              clearable
              @change="changeDistritos()"
              class="mb-2"
              style="width: 100%"
            >
              <el-option
                v-for="item in lDistritos"
                :key="item.id"
                :label="item.nombre"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import Resource from '@/api/resource'
import { ElMessage } from 'element-plus'
const departamentosResource = new Resource('ubigeos/lista/departamentos')
const listaProvinciasResource = new Resource('ubigeos/lista/provincias')
const listDistritosResource = new Resource('ubigeos/lista/distritos')
const ubigeoResource = new Resource('ubigeos/buscarporcodigo')

export default {
  name: 'BuscarUbigeoView',
  components: {},
  emits: ['emitUbigeo'],
  data() {
    return {
      lDepartamentos: [],
      lCCPP: [],
      lProvincias: [],
      lDistritos: [],
      modelUbigeo: {
        departamento_id: undefined,
        departamento: undefined,
        provincia_id: undefined,
        provincia: undefined,
        distrito_id: undefined,
        distrito: undefined,
        ccpp_id: undefined
      },
      loadingData: false,
      keyBuscar: ''
    }
  },
  computed: {},
  mounted() {},
  created() {
    this.resetModel()
    this.getDepartamentos()
  },
  methods: {
    resetModel() {
      this.modelUbigeo = {
        departamento_id: undefined,
        departamento: undefined,
        provincia_id: undefined,
        provincia: undefined,
        distrito_id: undefined,
        distrito: undefined,
        ccpp_id: undefined
      }
      setTimeout(() => {
        this.keyBuscar = ''
        this.$refs['txtBuscar'].focus()
      }, 500)
    },
    async getDepartamentos() {
      this.loadingData = true
      await departamentosResource
        .list(this.modelUbigeo)
        .then((response) => {
          const { data } = response
          this.lDepartamentos = data
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    async getProvincias() {
      this.loadingData = true
      await listaProvinciasResource
        .list(this.modelUbigeo)
        .then((response) => {
          const { data } = response
          this.lProvincias = data
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    async getDistritos() {
      this.loadingData = true
      await listDistritosResource
        .list(this.modelUbigeo)
        .then((response) => {
          const { data } = response
          this.lDistritos = data
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    changeProvincia() {
      this.modelUbigeo.distrito_id = undefined
      this.modelUbigeo.ccpp_id = undefined
      this.lDistritos = []
      this.lCCPP = []
      this.getDistritos()
    },
    changeDepartamento() {
      this.modelUbigeo.provincia_id = undefined
      this.lProvincias = []
      this.getProvincias()
    },
    changeDistritos() {
      this.modelUbigeo.departamento = this.lDepartamentos.find(
        (objeto) => objeto.id === this.modelUbigeo.departamento_id
      )
      this.modelUbigeo.provincia = this.lProvincias.find(
        (objeto) => objeto.id === this.modelUbigeo.provincia_id
      )
      this.modelUbigeo.distrito = this.lDistritos.find(
        (objeto) => objeto.id === this.modelUbigeo.distrito_id
      )
      this.handleEmitData()
    },
    handleEmitData() {
      // console.log(this.modelUbigeo)
      this.$emit('emitUbigeo', this.modelUbigeo)
    },
    buscarUbigeo() {
      this.resetModel()
      this.loadingData = true
      ubigeoResource
        .list({
          keyBuscar: this.keyBuscar
        })
        .then((response) => {
          const { state, message, distrito, provincias, distritos } = response
          console.log(state, message, distrito, provincias, distritos)

          if (state === 'success') {
            this.lProvincias = provincias
            this.lDistritos = distritos
            this.modelUbigeo.departamento_id = distrito?.provincia?.departamento?.id
            this.modelUbigeo.provincia_id = distrito?.provincia?.id
            this.modelUbigeo.distrito_id = distrito?.id

            this.$nextTick(() => {
              this.changeDistritos()
            })
          } else {
            ElMessage.error(message)
          }

          this.loadingData = false
        })
        .catch((err) => {
          this.loadingData = false
          console.log(err)
        })
        .finally(() => {
          this.loadingData = false
        })
    }
  }
}
</script>
