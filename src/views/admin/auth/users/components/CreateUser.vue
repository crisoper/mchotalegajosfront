<template>
  <el-form
    ref="formRefUser"
    :model="formData"
    :rules="reglasValidacion"
    label-width="120px"
    class="demo-form"
    label-position="top"
  >
    <div v-loading="loadingData" class="p-3"> 
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Email" prop="email">
            <el-input ref="emailField" v-model="formData.email" placeholder="Email" />
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item label="Rol" prop="role_id">
            <el-select v-model="formData.role_id" placeholder="Rol" style="width: 100%">
              <el-option
                v-for="rol in roles"
                :key="rol.id"
                :label="rol.name"
                :value="rol.id"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :xs="24" :sm="12" :md="8">
          <el-form-item v-if="formData.id === undefined" label="Clave" prop="password">
            <el-input v-model="formData.password" placeholder="Clave" />
          </el-form-item>
          <el-form-item v-else label="Nueva clave" prop="password">
            <el-input v-model="formData.password" placeholder="Clave" />
            <span class="text-muted small">Dejar en blanco si no desea cambiar</span>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="12" type="flex" class="row-bg mt-4" justify="end">
        <el-button v-if="formData.id === undefined" @click="resetForm('formRefUser')">Cancelar</el-button>
        <el-button type="primary" @click="submitForm('formRefUser')">
          {{ formData.id === undefined ? 'Guardar' : 'Actualizar' }}
        </el-button>
      </el-row>
    </div>
  </el-form>
</template>

<script>
import { ElNotification } from 'element-plus'
import RoleRequest from '@/api/auth/role'
import UserRequest from '@/api/auth/usuario'
const roleRequest = new RoleRequest()
const userRequest = new UserRequest()
export default {
  name: 'FormUser',
  components: {},
  props: {
    itemid: {
      type: Number,
      default: () => {
        return 0
      }
    }
  },
  data() {
    const validatePasswordUpdate = (rule, value, callback) => {
      // console.log(this.formData)
      if (this.formData.id === undefined) {
        if (!value) {
          callback(new Error('El campo es requerido'));
        } else {
          callback();
        }
      } else {
        callback();
      }
    }
    return {
      loadingData: false,
      createUserForm: '',
      tiposDocIdentidad: [],
      roles: [],
      dialogBuscarPersona: false,
      formData: {
        id: undefined,
        persona_email: undefined,
        persona_nro_doc_identidad: undefined,
        persona_nombre_completo: undefined,
        id_persona: undefined,
        email: undefined,
        role_id: undefined,
        password: undefined
      },
      reglasValidacion: {
        persona_nombre_completo: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
        persona_nro_doc_identidad: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
        email: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
        role_id: [{ required: true, message: 'Campo requerido', trigger: 'blur' }],
        password: [{ validator: validatePasswordUpdate, trigger: 'blur' }],
      },
    }
  },
  watch: {
    itemid: function(newV, oldV) {
      // console.log(newV, oldV)
      this.setCrearOUpdate(newV, oldV)
    }
  },
  computed: {},
  created() {
    this.fetchRoles()
  },
  methods: {
    async fetchRoles() {
      await roleRequest.all()
        .then((response) => {
          console.log(response)
          this.roles = response.data
        })
        .catch((error) => {
          console.log(error)
          ElNotification({
            type: 'error',
            title: 'Error al precargar data del formulario',
            duration: 2000
          })
          close('canceled')
        })
    },
    setCrearOUpdate() {
      console.log('Create User' + this.itemid)
      this.$nextTick(() => {
        if (this.itemid > 0) {
          this.item_id = this.itemid
          this.getDataUpdate()
        } else {
          this.item_id = undefined
          this.handleCreate()
        }
        this.resetForm('formRefUser')
        this.resetModel()
      })
    },
    handleCreate() {
      console.log('Open form create, set focus')
      // this.$refs['inputFocusCreate'].focus()
    },
    getDataUpdate() {
      // this.$refs['inputFocusCreate'].focus()
      this.resetModel()
      this.loadingData = true
      userRequest
      .get(this.item_id)
      .then((response) => {
        const { data } = response
        this.formData = {...data}
        this.loadingData = false
      })
      .catch(() => {
        this.loadingData = false
      })
    },
    submitForm() {
      this.$refs['formRefUser'].validate((valid) => {
        if (valid) {
          if (this.formData.id === undefined) {
            this.saveCreateNewForm()
          } else {
            this.saveEditForm()
          }
        } else {
          return false
        }
      })
    },
    saveCreateNewForm() {
      this.loadingData = true
      userRequest
        .store(this.formData)
        .then((response) => {
          const {state, message} = response
          this.$message({
            type: state,
            message
          })
          this.loadingData = false
          this.close('success')
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    saveEditForm() {
      this.loadingData = true
      userRequest
        .update(this.item_id, this.formData)
        .then((response) => {
          const {state, message} = response
          this.$message({
            type: state,
            message
          })
          this.loadingData = false
          this.close('success')
        })
        .catch(() => {
          this.loadingData = false
        })
    },
    close(status) { 
      if (this.createUserForm) {
        this.createUserForm.resetFields()
      }
      this.$emit('closeChild', status)
    },
    searchAsociacion() {
      this.dialogBuscarPersona = true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    resetModel() {
      this.formData = {
        id: this.itemid === 'create' ? undefined : this.itemid,
        persona_email: undefined,
        persona_nro_doc_identidad: undefined,
        persona_nombre_completo: undefined,
        id_persona: undefined,
        email: undefined,
        role_id: undefined,
        password: undefined
      }
    },
    parentProcessEmitPersona(data) {
      console.log(data)
      this.formData.id_persona = data.id
      this.formData.persona_nro_doc_identidad = data.nro_doc_identidad
      this.formData.persona_nombre_completo = data.nombre_completo
      this.formData.persona_email = data.email
      this.formData.email = data.email
      this.formData.password = data.nro_doc_identidad
      this.dialogBuscarPersona = false
      this.$refs['emailField'].focus()
    }
  }
}
</script>
