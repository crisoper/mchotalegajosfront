<template>
  <div class="header-container">
    <div>
      <logowhite class="logoWhite" />
    </div>
    <div class="color-white">
      <a class="link" href="https://www.gob.pe/municajamarca" target="_blank">
        <v-icon style="width: 18px; height: 18px; margin-right: 5px;" name="io-home-outline" />
        Página Principal
      </a>
    </div>
    <!-- <div> -->
    <!-- <header-menu-items v-if="!isMobile" /> -->
    <!-- <header-menu-items-mobile v-else /> -->
    <!-- </div> -->
  </div>
</template>

<script>
// import HeaderMenuItems from './headerMenuItems.vue'
// import HeaderMenuItemsMobile from './headerMenuItemsMobile.vue'
import logowhite from '@/assets/img/logoWhite.svg'; 
export default {
  name: 'HeaderContent',
  components: {
    // HeaderMenuItems,
    // HeaderMenuItemsMobile
    logowhite
  },
  data() {
    return{
      isMobile: false
    }
  },
  computed: {
    screenWidth() {
      return window.innerWidth
    },
  },
  methods: {
    handleResize() {
      this.isMobile = window.innerWidth < 1024;
    }
  },
  mounted() {
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    // Remover el evento de redimensionamiento cuando el componente se destruye
    window.removeEventListener('resize', this.handleResize);
  },
}
</script>
<style scope>
.header-container {
  width: 100vw;
  height: 7vh;
  padding: 0 10vw;
  background-color: var(--template-color-primary);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.link {
  color: #c1c3c7;
  font-size: 15px;
  display: flex;
  align-items: center;
}

.logoWhite {
  width: 50px;
}

@media (hover: hover) {
  .link:hover {
    color: white;
    background-color: transparent;
    /* background-color: #00bd7e33; */
  }
}
</style>
