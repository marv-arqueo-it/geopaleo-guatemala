
document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.querySelector("#catalogo-registros");
  const modal = document.querySelector("#catalogo-modal");
  const detalle = document.querySelector("#catalogo-detalle");
  const tituloModal = document.querySelector("#catalogo-modal-titulo");
  const cerrar = document.querySelector("#catalogo-cerrar");

  if (!contenedor || !modal || !detalle || !tituloModal || !cerrar) {
    console.error("Faltan elementos del catálogo.");
    return;
  }

  const mostrar = valor =>
    valor === null || valor === undefined || valor === ""
      ? "No documentado"
      : String(valor);

  function elemento(etiqueta, texto, clase = "") {
    const nodo = document.createElement(etiqueta);
    nodo.textContent = texto;
    if (clase) nodo.className = clase;
    return nodo;
  }

  function campo(padre, etiqueta, valor) {
    const fila = elemento("p", "", "ficha-campo");
    const nombre = elemento("strong", `${etiqueta}: `);
    fila.append(nombre, document.createTextNode(mostrar(valor)));
    padre.appendChild(fila);
  }

  function seccion(padre, titulo) {
    padre.appendChild(elemento("h3", titulo, "ficha-subtitulo"));
  }

  function abrirFicha(registro) {
    detalle.replaceChildren();

    tituloModal.textContent = mostrar(registro.titulo);

    const estado = elemento(
      "span",
      mostrar(registro.estadoVerificacion),
      "catalogo-etiqueta"
    );

    detalle.appendChild(estado);

    if (registro.estadoVerificacion === "demostrativo") {
      detalle.appendChild(elemento(
        "p",
        "Este registro es demostrativo. No representa un hallazgo verificado.",
        "ficha-aviso"
      ));
    }

    detalle.appendChild(elemento(
      "p",
      mostrar(registro.descripcion),
      "ficha-descripcion"
    ));

    seccion(detalle, "Identificación");
    campo(detalle, "Código", registro.id);
    campo(detalle, "Tipo de registro", registro.tipoRegistro);

    seccion(detalle, "Clasificación paleontológica");
    campo(detalle, "Grupo", registro.clasificacion?.grupo);
    campo(detalle, "Taxón", registro.clasificacion?.taxon);
    campo(
      detalle,
      "Período geológico",
      registro.clasificacion?.periodoGeologico
    );
    campo(
      detalle,
      "Antigüedad estimada",
      registro.clasificacion?.antiguedadEstimada
    );

    seccion(detalle, "Ubicación general");
    campo(detalle, "Departamento", registro.ubicacion?.departamento);
    campo(detalle, "Municipio", registro.ubicacion?.municipio);
    campo(
      detalle,
      "Referencia",
      registro.ubicacion?.descripcionGeneral
    );

    seccion(detalle, "Documentación científica");

    const referencias = Array.isArray(registro.documentacion?.referencias)
      ? registro.documentacion.referencias
      : [];

    if (referencias.length === 0) {
      detalle.appendChild(elemento(
        "p",
        "Todavía no se han incorporado referencias científicas."
      ));
    } else {
      const lista = document.createElement("ul");
      referencias.forEach(ref => {
        const texto = typeof ref === "string"
          ? ref
          : ref?.titulo || ref?.cita || "Referencia sin título";
        lista.appendChild(elemento("li", texto));
      });
      detalle.appendChild(lista);
    }

    seccion(detalle, "Control del registro");
    campo(
      detalle,
      "Institución fuente",
      registro.control?.institucionFuente
    );
    campo(
      detalle,
      "Responsable de revisión",
      registro.control?.responsableRevision
    );
    campo(
      detalle,
      "Última actualización",
      registro.control?.fechaActualizacion
    );

    modal.showModal();
  }

  function crearTarjeta(registro) {
    const tarjeta = document.createElement("button");
    tarjeta.type = "button";
    tarjeta.className = "catalogo-tarjeta";

    const cabecera = elemento("div", "", "catalogo-tarjeta-top");
    const icono = elemento("span", "◈", "catalogo-icono");
    icono.setAttribute("aria-hidden", "true");

    const estado = elemento(
      "span",
      mostrar(registro.estadoVerificacion),
      "catalogo-etiqueta"
    );

    cabecera.append(icono, estado);

    const titulo = elemento(
      "h3",
      mostrar(registro.titulo),
      "catalogo-tarjeta-titulo"
    );

    const descripcion = elemento(
      "p",
      mostrar(registro.descripcion),
      "catalogo-tarjeta-descripcion"
    );

    const grupo = mostrar(registro.clasificacion?.grupo);
    const periodo = mostrar(registro.clasificacion?.periodoGeologico);

    const datos = elemento(
      "p",
      `${grupo} · ${periodo}`,
      "catalogo-tarjeta-datos"
    );

    const pie = elemento("div", "", "catalogo-tarjeta-pie");
    pie.append(
      elemento("small", mostrar(registro.id)),
      elemento("span", "Ver ficha ↗")
    );

    tarjeta.append(cabecera, titulo, descripcion, datos, pie);

    tarjeta.addEventListener("click", () => abrirFicha(registro));
    return tarjeta;
  }

  cerrar.addEventListener("click", () => modal.close());

  modal.addEventListener("click", evento => {
    if (evento.target === modal) modal.close();
  });

  try {
    const respuesta = await fetch("data/catalogo.json");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el catálogo.");
    }

    const registros = await respuesta.json();

    if (!Array.isArray(registros)) {
      throw new Error("El catálogo no contiene un arreglo JSON.");
    }

    contenedor.replaceChildren();

    if (registros.length === 0) {
      contenedor.appendChild(
        elemento("p", "No hay registros disponibles.")
      );
      return;
    }

    registros.forEach(registro => {
      contenedor.appendChild(crearTarjeta(registro));
    });

  } catch (error) {
    console.error("Error del catálogo:", error);
    contenedor.replaceChildren();
    contenedor.appendChild(
      elemento("p", "No fue posible cargar el catálogo.")
    );
  }
});
