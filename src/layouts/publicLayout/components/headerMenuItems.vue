<template>
  <div class="header-menu-items">
    <div class="child-list">
      <router-link v-for="item in visibleItems" :key="item.name" :to="item.path" class="visible-item">{{ item.name }}</router-link>
    </div>
    <div class="overflow-menu">
      <v-icon  v-show="hiddenItems.length > 0" :name="overflowMenuVisible?'io-caret-up-outline':'io-caret-down-outline'" scale="2" @click="toggleOverflowMenu" />
      <div v-show="overflowMenuVisible" class="menu-items" @click="toggleOverflowMenu">
        <router-link v-for="item in hiddenItems" :key="item.name" :to="item.path" class="hidden-item" >{{ item.name }}</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { MenuItems } from '@/utils/publicMenuItems'
export default {
  name: 'HeaderMenuItems',
  data() {
    return {
      visibleItems: MenuItems.visible,
      hiddenItems: MenuItems.hidden,
      overflowMenuVisible: false
    }
  },
  methods: {
    toggleOverflowMenu() {
      this.overflowMenuVisible = !this.overflowMenuVisible
    }
  }
}
</script>

<style scoped>
.header-menu-items {
  display: flex;
  max-height: 40vh;
  overflow-y: hidden;
}

.child-list {
     /* Estilos para los hijos dentro de la lista principal */
     display: flex;
     justify-content: end;
     padding: 0;
  }

  .visible-item {
    display: flex;
    align-items: center; /* Centra verticalmente */
    justify-content: center; /* Centra horizontalmente */
    padding: 0 8px;
    height: 9vh;
    font-size: 20px;
    color: var(--el-fill-color-dark);
  }
  .hidden-item {
    display: flex;
    align-items: center; /* Centra verticalmente */
    justify-content: start; /* Centra horizontalmente */
    margin: 0;
    padding: 10px 10px;
    height: 3vh;
    font-size: 20px;
    color: var(--el-fill-color-dark);
  }
  .visible-item:hover {
    background-color: #ebebeb2d;
  }
  .hidden-item:hover {
    background-color: #ebebeb2d;
  }

.overflow-menu {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--el-fill-color-dark);
}

.menu-items {
  position: absolute;
  z-index: 9999;
  top: 9vh;
  right: 10vw;
  display: flex;
  flex-direction: column;
  width: 15vw;
  padding: 8px;
  background: var(--template-color-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}
</style>
