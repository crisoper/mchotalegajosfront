<template>
  <PdfApp
    style="height: 90vh"
    :pdf="linkPDF"
    :config="configPDFApp"
  />
</template>

<script setup>

import PdfApp from "vue3-pdf-app"
import "vue3-pdf-app/dist/icons/main.css"
import { ref, watch } from 'vue'

const configPDFApp = ref({
  toolbar: {
    toolbarViewerLeft: {
      findbar: true,
      previous: true,
      next: true,
      pageNumber: true,
    },
    toolbarViewerRight: {
      presentationMode: true,
      openFile: false,
      print: true,
      download: false,
      viewBookmark: false,
    },
    toolbarViewerMiddle: {
      zoomOut: true,
      zoomIn: true,
      scaleSelectContainer: true,
    },
  },
})

const linkPDF = ref("")

const props = defineProps({
  pdfLink: {
    type: String,
    required: true,
    default: 'http'
  }
})

watch(() => {
  return props.pdfLink;
}, (newValue, oldValue) => {
  if(newValue != oldValue && newValue != '') {
    console.log('Link pasado para su impresión')
    linkPDF.value = props.pdfLink
  }
});
</script>
