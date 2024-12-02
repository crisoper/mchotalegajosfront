import { defineStore } from "pinia";

export const useAppStore = defineStore('AppStore',{
    state: () => ({
        isPhone: false,
        sidebarActive: false,
        widthSidebar: '260px',
    }),
    actions: {
        checkDeviceType() {
            const userAgent = window.navigator.userAgent.toLowerCase();
            this.isPhone = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
            this.sidebarActive = !this.isPhone
            console.log(this.isPhone)
        },
        toggleSideBar() {
            this.sidebarActive = !this.sidebarActive
            if( window.innerWidth > 600 ) {
                if (this.sidebarActive) {
                    this.widthSidebar = '0px'
                } else {
                    this.widthSidebar = '260px'
                }
            }
            // console.log('this.sidebarActive', this.sidebarActive)
            // console.log(this.widthSidebar)
        }
    },
})