<template>
  <div style="width: 100% !important;">
    <el-header class="header-custom">
      <div style="display: flex; background-color: white;">
        <div style="width: 50px; padding-left: 15px; padding-top: 15px;">
          <v-icon
            :name="appStore.sidebarActive ? 'oi-sidebar-expand' : 'oi-sidebar-collapse'"
            style="color: var(--el-text-color-primary); cursor: pointer;"
            scale="1.45"
            @click="appStore.toggleSideBar()"
          />
        </div>
        <div style="flex: 1;">
          <el-row style="background-color: white;" class="pt-3 pb-1 pl-3">
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <div>
                <div>
                  <v-icon v-if="PageInfo.icon" :name="PageInfo.icon" style="margin-right: 15px; float: left;" scale="1.5" />
                  <h4 v-if="appStore.isPhone">{{ PageInfo.title || 'MUNICAJ' }}</h4>
                  <h2 v-else>{{ PageInfo.title || 'MUNICAJ' }}</h2>
                </div>
                <!-- <div>
                  <h5 class="font-weight-600">Proceso actual: {{ procesoActual.descripcion }}</h5>
                </div> -->
              </div>
            </el-col>
            <el-col :xs="24" :sm="12" :md="12" :lg="12">
              <sidebar-user />
            </el-col>
          </el-row>
        </div>
      </div>
    </el-header>
    <el-main class="main-custom">
      <el-scrollbar max-height="calc(100vh-120px)">
        <div class="admin-main-container-body">
          <el-card class="mb-3">
            <RouterView />
          </el-card>
        </div>
      </el-scrollbar>
    </el-main>
  </div>
  <!-- <div class="admin-main-container">
  </div> -->
</template>

<script setup>
import { computed } from 'vue'
import { useAppStore } from '../../../stores/app'
import { useAuthStore } from '../../../stores/auth'
import SidebarUser from './SidebarUser.vue'

const authStore = useAuthStore()
const appStore = useAppStore()
// const procesoActual = authStore.procesoActual
const PageInfo = computed(() => {
  return authStore.getCurrentPageInfo
})
</script>

<style scoped>
.header-custom {
  padding: 0 !important;
}

.main-custom {
  position: relative;
  top: 20px;
  padding: 0 !important;
  padding-left: 10px !important;
  padding-right: 10 !important;
}

.admin-main-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  padding: 0px 0 15px 0;
  color: var(--el-text-color-primary);
  transition: margin-left 0.3s ease;
}

.admin-main-container-body {
  /* background-color: red; */
  width: 100%;
  /* background-color: aqua; */
  height: calc(100vh - 130px);
  padding: 5px 15px 10px 10px;
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
