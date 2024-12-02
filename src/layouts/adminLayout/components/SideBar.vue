<template>
  <div :class="{ 'sidebar-hidden': isCollapse }" class="sidebar-container">
    <div>
      <div class="sidebar-header">
        <!-- :name="appStore.sidebarActive ? 'oi-sidebar-expand' : 'oi-sidebar-collapse'" -->
        <v-icon
          v-if="isSmallScreen"
          id="icon-close"
          :name="'fa-window-close'"
          style="color: white !important; right: 10px; position: fixed; cursor: pointer;"
          scale="1.25"
          @click="appStore.toggleSideBar()"
        />
        <div style="text-align: center;">
          <logowhite2 class="logoWhite2" />
        </div>
      </div>
      <div class="sidebar-body">
        <el-scrollbar style="height: 80vh">
          <el-menu default-active="/dashboard/index">
            <sidebar-item
              v-for="route in MenuItems"
              :key="route.path"
              :item="route"
              :base-path="route.path"
            />
          </el-menu>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import SidebarItem from './sidebarItem.vue'
import logowhite2 from '@/assets/img/logoWhite.svg'; 
import { useAppStore } from '../../../stores/app'

// const isCollapse = ref(true);
const isSmallScreen = ref(false)
const authStore = useAuthStore()
const appStore = useAppStore()

const MenuItems = computed(() => {
  return authStore.userAccessRoutes || []
})

const isCollapse = computed(() => {
  return appStore.sidebarActive
})

const checkScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 600

  // El menu debe mostrar u ocultarse responsivamente
  if (!appStore.sidebarActive) {
    if (isSmallScreen.value) {
      // appStore.sidebarActive = true
      appStore.widthSidebar = '0px'
    } else {
      // appStore.sidebarActive = false
      appStore.widthSidebar = '260px'
    }
  }
  

  // console.log('appStore.sidebarActive', appStore.sidebarActive)
  // console.log(isSmallScreen.value, window.innerWidth)
}

onMounted(() => {
  // Llama a la función para comprobar el tamaño de la pantalla una vez al cargar la página
  checkScreenSize()
  // Escucha el evento resize para ajustar la clase cuando cambie el tamaño de la pantalla
  window.addEventListener('resize', checkScreenSize)
})

onBeforeUnmount(() => {
  // Asegúrate de eliminar el evento de escucha cuando el componente se destruye
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style>
.sb-icon-close {
  display: none;
}

.sidebar-container {
  width: 260px !important;
  height: 100vh;
  background-color: var(--template-color-primary);
  transition: margin-left 0.3s ease;
  overflow: hidden;
  padding: 15px 0;
  display: block;
}

.sidebar-hidden {
  display: none;
}

.sidebar-header {
  display: flex;
  flex-direction: column;
}

.sidebar-image {
  margin: 0 auto 5px auto;
  padding: 0;
  width: 180px !important;
  height: auto !important;
}

.sidebar-body {
  padding: 10px 0;
}

.sidebar-body .el-menu{
  border-right: 1px solid #204a63;
}

#icon-close {
  display: none;
}

.logoWhite2 {
  max-width: 110px;
}

/* Media query para pantallas más pequeñas (por ejemplo, dispositivos móviles) */
@media screen and (max-width: 600px) {
  .sidebar-container {
    position: absolute;
    z-index: 9999;
    display: block;
    width: 260px; /* Ancho de menú en resoluciones pequeñas */
    transform: translateX(0);
    transition: transform 0.4s ease;
  }

  .sidebar-hidden {
    margin-left: -70vw; /* Oculta el sidebar hacia la izquierda en dispositivos móviles */
    transform: translateX(-100%);
  }
  #icon-close {
    display: block;
  }
}
</style>
