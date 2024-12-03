<template>
  <div>Bienvenido {{ UserInfo }}</div>
</template>

<script>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
export default {
  name: 'DashboardView',
  setup() {
    const authStore = useAuthStore();
    const UserInfo = computed(() => authStore.getUser);
    const router = useRouter();
    // Verificar si el usuario está autenticado y redirigir
    onMounted(() => {
      console.log(authStore)
      router.push({ name: 'AdministracionLegajos' });
    });

    return {
        UserInfo,
    };
  }
}
</script>
