<template>
  <el-card class="mt-3 mb-4" shadow="never">
    <el-form
      ref="formRefUser"
      :model="userModel"
      :rules="reglasValidacion"
      class="demo-form"
      label-position="top"
    >
      <div v-loading="loadingData" class="p-3">
        <el-row :gutter="1">
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="Rol" prop="rol_name">
              <el-input v-model="userModel.rol_name" readonly />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="Email" prop="email">
              <el-input v-model="userModel.email" readonly />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="Clave" prop="password">
              <el-input v-model="userModel.password" placeholder="Clave" />
            </el-form-item>
          </el-col>
          <el-col :xs="24" :sm="24" :md="24">
            <el-form-item label="Confirmar clave" prop="password_confirm">
              <el-input v-model="userModel.password_confirm" placeholder="Confirmar clave" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row type="flex" class="row-bg mt-3" justify="end">
          <el-button type="primary" @click="submitForm('formRefUser')">
            Actualizar
          </el-button>
        </el-row>
      </div>
    </el-form>
  </el-card>
</template>

<script>
import Resource from '@/api/resource'
const userResource = new Resource('miperfil')

export default {
  name: 'AcoountUserView',
  components: {},
  data() {
    const validatePassConfirm = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('El campo es requerido'));
      } else if (value !== this.userModel.password) {
        callback(new Error('Las claves no son iguales'));
      } else {
        callback();
      }
    }
    return {
      loadingData: false,
      userModel: {
        id: '',
        email: '',
        name: '',
        persona_dni: '',
        persona_full_name: '',
        rol_name: '',
        roles: [],
        password: undefined,
        password_confirm: undefined
      },
      reglasValidacion: {
        rol_name: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
        password: [ { required: true, trigger: 'blur', message: 'Campo requerido' }],
        password_confirm: [ { validator: validatePassConfirm, trigger: 'blur' }],
      }
    }
  },
  computed: {},
  created() {
    this.getDatosUsuario()
  },
  methods: {
    async getDatosUsuario() {
      await userResource
        .list({})
        .then((response) => {
          const { data } = response
          this.userModel = {...data }
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    submitForm(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          this.saveEditForm()
        } else {
          return false
        }
      })
    },
    saveEditForm() {
      this.loadingData = true
      userResource
        .update(this.userModel.id, this.userModel)
        .then((response) => {
          const {state, message} = response
          this.$message({
            type: state,
            message
          })
          this.loadingData = false
        })
        .catch(() => {
          this.loadingData = false
        })
    }
  }
}
</script>
<style>
.text-left {
  text-align: left !important;
}
</style>