<template>
  <div class="common-layout">
    <el-container>
      <el-aside :width="widthLateral">
        <SideBar />
      </el-aside>
      <el-container style="padding: 0;">
        <AdminMainContent />
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import {
  // onMounted,
  // onBeforeUnmount,
  computed,
  // ref
} from 'vue';

import SideBar from './components/SideBar.vue'
import AdminMainContent from './components/AdminMainContent.vue'

import { useAppStore } from '../../stores/app';

const appStore = useAppStore()

const widthLateral = computed(() => {
  return appStore.widthSidebar
})
</script>
<style scoped>
</style>
