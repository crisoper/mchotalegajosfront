import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import './assets/main.css'
import './assets/variables.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'

import App from './App.vue'
import router from './router'
import Permision from './directives/permission'

// import { OhVueIcon, addIcons } from 'oh-vue-icons'
// import * as Icons from "oh-vue-icons/icons";

import SvgIcon from '@/components/SvgIcon/SvgIcon.vue'

// const AllIcons = Object.values({ ...Icons });
// addIcons(...AllIcons);


const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)

app.directive('permission', Permision);
app.component('v-icon', SvgIcon)
app.use(ElementPlus)

app.mount('#app')
