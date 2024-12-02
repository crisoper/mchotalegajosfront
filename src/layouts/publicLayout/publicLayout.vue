<template>
    <div>
        <header-content />
        <main-content />
    </div>
</template>

<script>
import MainContent from './components/mainContent.vue'
import HeaderContent from './components/headerContent.vue'
export default {
    name: "PublicLayout",
    components:{HeaderContent, MainContent}
}
</script>