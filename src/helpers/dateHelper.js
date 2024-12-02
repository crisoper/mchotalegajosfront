// dateHelper.js

export const getFechaActual = () => {
  const fechaActual = new Date()
  const anio = fechaActual.getFullYear()
  const mes = String(fechaActual.getMonth() + 1).padStart(2, '0')
  const dia = String(fechaActual.getDate()).padStart(2, '0')

  return `${anio}/${mes}/${dia}`
}

export const getAnioActual = () => {
  return new Date().getFullYear()
}

export const getPrimerDiaMesActual = () => {
  const fecha = new Date()
  return `${fecha.getFullYear()}/${String(fecha.getMonth() + 1).padStart(2, '0')}/01`
}

export const getUltimoDiaMesActual = () => {
  const fecha = new Date()
  const ultimoDia = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0).getDate()
  return `${fecha.getFullYear()}/${String(fecha.getMonth() + 1).padStart(2, '0')}/${String(
    ultimoDia
  ).padStart(2, '0')}`
}

export const getPrimerDiaEneroAnioActual = () => {
  const anio = new Date().getFullYear()
  return `${anio}/01/01`
}

export const getUltimoDiaDiciembreAnioActual = () => {
  const anio = new Date().getFullYear()
  return `${anio}/12/31`
}

export const getFechaConAnioMas = () => {
  const fechaActual = new Date()
  const anio = fechaActual.getFullYear() + 1 // Sumar 1 al año actual
  const mes = String(fechaActual.getMonth() + 1).padStart(2, '0') // Obtener el mes actual
  const dia = String(fechaActual.getDate()).padStart(2, '0') // Obtener el día actual

  return `${anio}/${mes}/${dia}`
}
