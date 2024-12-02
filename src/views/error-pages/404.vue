<template>
    <div class="not-found">
      <svg404 wdth="360"/>
      <p>¡Página no encontrada!</p>
      <p class="pt-4 pb-1">
        <el-button type="primary" plain @click="volverAtras">Volver</el-button>
      </p>
      <p class="mb-3 pt-0">
        <el-button type="primary" @click="goToDashboard">Ir al panel de control</el-button>
      </p>
    </div>
  </template>
  
  <script>
  import svg404 from '@/assets/img/page404.svg'; 

  export default {
    name: 'Error404Page',
    components: {
      svg404
    },
    methods: {
      volverAtras() {
        this.$router.go(-1); // Vuelve a la ruta anterior
      },
      goToDashboard() {
        this.$router.push('/dashboard'); // Vuelve a la ruta anterior
      },
    }
  }
  </script>
  
  <style scoped>
  .not-found {
    text-align: center;
    margin-top: 50px;
  }
  
  img {
    max-width: 100%;
    height: auto;
  }
  </style>
  