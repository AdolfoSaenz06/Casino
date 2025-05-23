document.addEventListener("DOMContentLoaded", () => {
  const placeholder = document.getElementById("header-placeholder");

  if (placeholder) {
    fetch("header.html")
      .then(response => {
        if (!response.ok) throw new Error("No se pudo cargar el header");
        return response.text();
      })
      .then(data => {
        placeholder.innerHTML = data;

        // IMPORTANTE: Ejecutar créditos después de insertar el header
        if (typeof leerCreditos === "function") {
          leerCreditos(); // Ejecuta si credits.js ya está cargado
        } else {
          // Si aún no está cargado, lo carga dinámicamente
          const script = document.createElement("script");
          script.src = "js/credits.js";
          script.onload = () => leerCreditos();
          document.body.appendChild(script);
        }
      })
      .catch(error => {
        console.error("Error al cargar el header:", error);
      });
  }
});