<template>
  <el-row>
    <el-col :xs="24" :sm="16" :md="10" :lg="8" class="center">
      <el-tabs v-model="activeTab" class="demo-tabs mt-3">
        <el-tab-pane label="Datos de la cuenta" name="first">
          <user-card />
        </el-tab-pane>
        <el-tab-pane label="Cambiar clave" name="second">
          <account />
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import UserCard from './components/UserCard.vue'
import Account from './components/Account.vue'

export default {
  name: 'SideBar',
  components: {
    UserCard,
    Account
  },
  data() {
    return {
      activeTab: 'first'
    }
  },
  computed: {},
  mounted() {},
  created() {},
  methods: {}
}
</script>
<style>
.center {
  margin: 0 auto;
}
.box-card {
  width: 100%;
}
</style>