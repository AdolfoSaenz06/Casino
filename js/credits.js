// Crear la cookie 'créditos' con valor 0 y duración de 1 año
function crearCreditos() {
  const valorInicial = 0;
  document.cookie = `Créditos=${valorInicial}; max-age=31536000; path=/`;
  document.getElementById("resultado").innerText = valorInicial;
}

// Leer la cookie 'créditos'
function leerCreditos() {
  const nombre = "Créditos=";
  const cookies = document.cookie.split(';');

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nombre) === 0) {
      const valor = c.substring(nombre.length);
      document.getElementById("resultado").innerText = valor;
      return;
    }
  }

  // Si no existe, la crea automáticamente
  crearCreditos();
}

// Ejecutar al cargar la página
document.addEventListener("DOMContentLoaded", function() {
  leerCreditos();
});

// Obtener el valor numérico actual de la cookie "Créditos"
function obtenerCreditos() {
  const nombre = "Créditos=";
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    let c = cookies[i].trim();
    if (c.indexOf(nombre) === 0) {
      return parseInt(c.substring(nombre.length)) || 0;
    }
  }

  // Si no existe, la crea
  crearCreditos();
  return 0;
}

// Actualizar la cookie "Créditos" con un nuevo valor
function actualizarCreditos(nuevoValor) {
  document.cookie = `Créditos=${nuevoValor}; max-age=31536000; path=/`;
  document.getElementById("resultado").innerText = nuevoValor;
}

// Función para añadir créditos y actualizar cookie y visualización
function añadirCreditos(cantidad) {
  let actuales = obtenerCreditos();
  let nuevos = actuales + cantidad;
  actualizarCreditos(nuevos);
  const mensaje = `Has comprado ${cantidad} créditos. Total ahora: ${nuevos}.`;
  const contenedorMensaje = document.getElementById("mensaje-credito");
  if (contenedorMensaje) {
    contenedorMensaje.textContent = mensaje;
  }
}