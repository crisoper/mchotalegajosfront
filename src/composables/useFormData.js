// composables/useFormData.js

export function useFormData() {
  /**
   * Convierte un objeto en un FormData.
   * @param {Object} model - El objeto que se convertirá en FormData.
   * @returns {FormData} - El objeto FormData resultante.
   */
  const convertToFormData = (model) => {

    console.log('useFormData()', model)
    const formData = new FormData()

    const appendObjectToFormData = (data, parentKey = '') => {
      Object.keys(data).forEach((key) => {
        const value = data[key]
        const fullKey = parentKey ? `${parentKey}[${key}]` : key

        if (Array.isArray(value)) {
          // Si es un array, agrega cada elemento con un índice
          value.forEach((item, index) => {
            appendObjectToFormData(item, `${fullKey}[${index}]`)
          })
        } else if (value && typeof value === 'object' && !(value instanceof Date)) {
          // Si es un objeto, agrega sus propiedades
          appendObjectToFormData(value, fullKey)
        } else {
          // Caso base: agregar al FormData
          formData.append(fullKey, value)
        }
      })
    }

    appendObjectToFormData(model)

    return formData
  }

  return {
    convertToFormData
  }
}
