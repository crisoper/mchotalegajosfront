<template>
  <div class="svg-container" :style="svgStyle">
    <component :is="dynamicSvgComponent" class="svg-icon" />
  </div>
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  scale: {
    type: String,
    default: "1"
  }
});
const importSvgComponent = (name) => {
  return defineAsyncComponent(() =>
    import(`./svg/${name}.svg`)
      .then((module) => module.default)
      .catch((error) => {
        console.log('Cargando icono')
        console.log(name)
        console.error(`Error loading SVG: ${name}`, error);
        return null;
      })
  );
};

const dynamicSvgComponent = computed(() => importSvgComponent(props.name));

const svgStyle = computed(() => ({
  width: `calc( 1.5em *${parseFloat(props.scale)})`,
  // transform: `scale(${parseFloat(props.scale)})`,
  display: 'inline-block',
  verticalAlign: 'middle',
}));
</script>

<style scoped>
.svg-container {
  line-height: 0; /* Elimina el espacio extra alrededor del SVG */
}

.svg-icon {
  fill: currentColor; /* Asegura que el color se herede correctamente */
}
</style>