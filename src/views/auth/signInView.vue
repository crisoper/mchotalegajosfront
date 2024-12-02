<template>
  <div class="signInContainerCard">
    <el-card class="sign-in-card">
      <el-row style="justify-content: center; margin-bottom: 15px">
        <logologin  class="logoLogin" />
      </el-row>
      <el-row style="justify-content: center; margin-bottom: 15px">
        <h2 style="margin-top: 12px;">{{ appTitle }}</h2>
      </el-row>
      <el-row>
        <el-form ref="signInFormRef" :model="authForm" :rules="rules" label-position="top">
          <el-row :gutter="12">
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item prop="name">
                <el-input
                  class="input_login"
                  placeholder="Nro. Documento"
                  v-model="authForm.name"
                  @keydown.enter.prevent="signIn"
                >
                  <template #prefix><v-icon name="hi-solid-user" /></template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :xs="24" :sm="24" :md="24">
              <el-form-item prop="password">
                <el-input
                  class="input_login"
                  placeholder="Contraseña"
                  v-model="authForm.password"
                  type="password"
                  @keydown.enter.prevent="signIn"
                >
                  <template #prefix><v-icon name="ri-lock-password-fill" /></template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-row>
      <el-row type="flex" justify="center" style="margin-top: 3%; margin-bottom: 2%">
        <el-button
          style="width: 100%"
          v-loading.fullscreen.lock="loading"
          type="primary"
          @click="signIn"
          >Iniciar sesión</el-button
        >
        <br />
        <br />
        <small class="text-muted">© {{ entidadTitle }}</small>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth'
import 'element-plus/theme-chalk/display.css'
import logologin from '@/assets/img/logoLogin.svg'; 

const authStore = useAuthStore()
export default {
  name: 'SignInView',
  components: {
      logologin
    },
  data() {
    return {
      loading: false,
      appTitle: 'Sistema TUC',
      entidadTitle: 'Municipalidad Provincial de Cajamarca',
      authForm: {
        name: '44641743',
        password: '44641743'
      },
      rules: {
        name: [
          {
            required: true,
            message: 'Por favor ingrese su número de DNI',
            trigger: 'change'
          },
          { min: 8, message: 'El DNI debe tener 8 caracteres', trigger: 'blur' },
          { max: 8, message: 'El DNI debe tener 8 caracteres', trigger: 'blur' }
        ],
        password: [
          {
            required: true,
            message: 'Por favor ingrese su contraseña',
            trigger: 'change'
          }
        ]
      }
    }
  },
  watch: {
    // $route: {
    //   handler: function(route) {
    //     const query = route.query
    //     if (query) {
    //       this.redirect = query.redirect
    //     }
    //   },
    //   immediate: true
    // }
  },
  methods: {
    async signIn() {
      this.loading = true
      // console.log('Login credentials: ', this.email, ' ', this.password)
      this.$refs['signInFormRef'].validate((valid, fields) => {
        if (valid) {
          authStore
            .signIn(this.authForm)
            .then(() => {
              this.loading = true
              this.$router.push('/dashboard')
            })
            .catch((error) => {
              this.loading = false
              console.log(error)
            })
        } else {
          this.loading = false
          console.log('error submit!', fields)
        }
      })
    }
  }
}
</script>

<style scoped>
.text-muted {
  color: #9f9f9f;
}

.signInContainerCard {
  /* background-color: var(--template-color-primary); */
  display: flex;
  justify-content: center;
  color: #ffffff;
}

.sign-in-card {
  width: 360px !important;
  margin-top: 80px;
}

.sign-in-container {
  display: flex;
  width: 100vw;
  height: 91vh;
  justify-content: center;
  align-items: center;
}

#form-image {
  max-width: 60%;
}

.logoLogin {
  max-width: 210px;
}

@media (max-width: 640px) {
  .sign-in-card {
    /* background-color: yellow; */
    margin: 25px 5px auto 5px;
  }

  .sign-in-container {
    display: flex;
    width: 100vw;
    height: 91vh;
    justify-content: center;
    align-items: start;
  }

  #form-image {
    width: 75vw;
    border: 2p solid red;
  }
}
</style>
