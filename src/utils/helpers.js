/**
 *
 * Todas las validaciones deben ser definidas aquí
 */
/**
 * @param {string} path
 * @returns {Array}
 */
export default function generarListaAnios() {
  let listaAnios = []
  const anioInicioSistema = 2023
  const aniosAdicionales = (new Date()).getFullYear() - anioInicioSistema + 1
  for (let i = anioInicioSistema; i <= anioInicioSistema + aniosAdicionales; i++) {
    listaAnios.push(
      {
        value: i,
        label: i
      }
    )
  }
  return listaAnios
}


export function getListaAniosFabricacion() {
  let listaAnios = []
  const anioInicioSistema = 1900
  const anioActual = (new Date()).getFullYear() + 1
  
  for (let i = anioActual; i >= anioInicioSistema; i--) {
    listaAnios.push(
      {
        value: i,
        label: i
      }
    )
  }
  
  return listaAnios
}

/**
 * @param {string} path
 * @returns {Array}
 */
export function getListaAniosFabricacionAsc() {
  let listaAnios = []
  const anioInicioSistema = 1900
  const aniosAdicionales = (new Date()).getFullYear() - anioInicioSistema + 1
  for (let i = anioInicioSistema; i <= anioInicioSistema + aniosAdicionales; i++) {
    listaAnios.push(
      {
        value: i,
        label: i
      }
    )
  }
  return listaAnios
}



export function obtenerFechaActual() {
  const ahora = new Date();
  let mes = (ahora.getMonth() + 1).toString(); // Obtener el mes (se suma 1 porque los meses van de 0 a 11)
  let dia = ahora.getDate().toString(); // Obtener el día del mes
  const anio = ahora.getFullYear().toString(); // Obtener el año

  // Ajustar el formato para que el mes y el día tengan dos dígitos
  if (mes.length < 2) {
      mes = '0' + mes;
  }
  if (dia.length < 2) {
      dia = '0' + dia;
  }

  // Construir la fecha en el formato YYYY-MM-DD
  const fechaFormateada = `${anio}-${mes}-${dia}`;
  return fechaFormateada;
}


