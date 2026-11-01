
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.querySelector("#catalogo-registros");
  const detalle = document.querySelector("#catalogo-detalle");

  if (!contenedor || !detalle) return;

  const mostrar = valor =>
    valor === null || valor === undefined || valor === ""
      ? "No documentado"
      : String(valor);

  function agregarCampo(padre, etiqueta, valor) {
    const fila = document.createElement("p");
    const titulo = document.createElement("strong");
    titulo.textContent = `${etiqueta}: `;
    fila.append(titulo, document.createTextNode(mostrar(valor)));
    padre.appendChild(fila);
  }

  function mostrarFicha(registro) {
    detalle.replaceChildren();

    const encabezado = document.createElement("h3");
    encabezado.textContent = registro.titulo;

    const estado = document.createElement("p");
    estado.className = "catalogo-estado";
    estado.textContent =
      `Estado: ${mostrar(registro.estadoVerificacion)}`;

    const aviso = document.createElement("p");
    aviso.textContent =
      "Este registro es demostrativo y no representa un hallazgo verificado.";

    detalle.append(encabezado, estado);

    if (registro.estadoVerificacion === "demostrativo") {
      detalle.appendChild(aviso);
    }

    agregarCampo(detalle, "Código", registro.id);
    agregarCampo(detalle, "Tipo", registro.tipoRegistro);
    agregarCampo(detalle, "Descripción", registro.descripcion);

    const clasificacion = document.createElement("h4");
    clasificacion.textContent = "Clasificación paleontológica";
    detalle.appendChild(clasificacion);

    agregarCampo(detalle, "Grupo", registro.clasificacion?.grupo);
    agregarCampo(detalle, "Taxón", registro.clasificacion?.taxon);
    agregarCampo(
      detalle,
      "Período geológico",
      registro.clasificacion?.periodoGeologico
    );

    const ubicacion = document.createElement("h4");
    ubicacion.textContent = "Ubicación";
    detalle.appendChild(ubicacion);

    agregarCampo(
      detalle,
      "Departamento",
      registro.ubicacion?.departamento
    );
    agregarCampo(
      detalle,
      "Municipio",
      registro.ubicacion?.municipio
    );
    agregarCampo(
      detalle,
      "Referencia general",
      registro.ubicacion?.descripcionGeneral
    );

    const fuentes = document.createElement("h4");
    fuentes.textContent = "Documentación científica";
    detalle.appendChild(fuentes);

    const referencias = registro.documentacion?.referencias ?? [];
    agregarCampo(
      detalle,
      "Referencias disponibles",
      referencias.length
    );
  }

  try {
    const respuesta = await fetch("data/catalogo.json");
    if (!respuesta.ok) throw new Error("Error al cargar el catálogo");

    const registros = await respuesta.json();
    if (!Array.isArray(registros)) {
      throw new Error("El catálogo debe ser un arreglo JSON");
    }

    contenedor.replaceChildren();

    if (registros.length === 0) {
      contenedor.textContent = "No hay registros disponibles.";
      return;
    }

    registros.forEach(registro => {
      const boton = document.createElement("button");
      boton.type = "button";
      boton.className = "catalogo-item";
      boton.textContent = registro.titulo;
      boton.addEventListener("click", () => mostrarFicha(registro));
      contenedor.appendChild(boton);
    });

    mostrarFicha(registros[0]);
  } catch (error) {
    console.error(error);
    contenedor.textContent =
      "No fue posible cargar el catálogo paleontológico.";
  }
});
