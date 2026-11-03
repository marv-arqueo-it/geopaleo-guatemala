
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

    if (registro.estadoVerificacion === "referencia_historica") {
      detalle.appendChild(elemento("p", "Referencia histórica documentada en una fuente secundaria. La identificación y ubicación requieren corroboración; no representa un hallazgo verificado.", "ficha-aviso"));
    }

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
    if (registro.control?.fechaReferenciaHistorica) campo(detalle, "Fecha de referencia histórica", registro.control.fechaReferenciaHistorica);

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

    seccion(detalle, "Galería y créditos");
    const imagenes = Array.isArray(registro.documentacion?.imagenes)
      ? registro.documentacion.imagenes : [];
    if (!imagenes.length) {
      detalle.appendChild(elemento("p", "No hay fotografías documentadas para este registro."));
    } else {
      const galeria = elemento("div", "", "ficha-galeria");
      imagenes.forEach(imagen => {
        if (!imagen || typeof imagen !== "object") return;
        // Solo archivos locales del proyecto; no cargar URLs arbitrarias.
        const ruta = imagen.archivo;
        if (typeof ruta !== "string" || !/^assets\/[a-zA-Z0-9/_-]+\.(webp|png|jpg|jpeg)$/i.test(ruta) || ruta.includes("..")) return;
        const figura = document.createElement("figure");
        const foto = document.createElement("img");
        foto.src = ruta;
        foto.alt = mostrar(imagen.descripcion);
        foto.loading = "lazy";
        const pie = document.createElement("figcaption");
        pie.textContent = [imagen.descripcion, imagen.autor && `Autor: ${imagen.autor}`,
          imagen.licencia && `Licencia: ${imagen.licencia}`,
          imagen.fuente && `Fuente: ${imagen.fuente}`].filter(Boolean).join(" · ");
        figura.append(foto, pie);
        galeria.appendChild(figura);
      });
      detalle.appendChild(galeria.childElementCount ? galeria :
        elemento("p", "No hay imágenes locales válidas."));
    }

    seccion(detalle, "Documentación científica");

    const referencias = Array.isArray(registro.documentacion?.referencias)
      ? registro.documentacion.referencias
      : [];

    if (referencias.length === 0) {
      detalle.appendChild(elemento("p", "Todavía no se han incorporado referencias científicas."));
    } else {
      const lista = elemento("ul", "", "ficha-referencias");
      referencias.forEach(ref => {
        const item = document.createElement("li");
        const titulo = typeof ref === "string" ? ref : (ref?.titulo || ref?.cita || "Referencia sin título");
        item.appendChild(elemento("strong", titulo));
        if (typeof ref === "object" && ref) {
          if (ref.autores || ref.anio) item.appendChild(elemento("p",
            [ref.autores, ref.anio].filter(Boolean).join(" · ")));
          if (ref.doi) item.appendChild(elemento("p", `DOI: ${ref.doi}`));
          if (typeof ref.url === "string") {
            try {
              const url = new URL(ref.url);
              if (url.protocol === "https:") {
                const enlace = elemento("a", "Consultar publicación ↗");
                enlace.href = url.href;
                enlace.target = "_blank";
                enlace.rel = "noopener noreferrer";
                item.appendChild(enlace);
              }
            } catch (_) { /* URL no válida: no se publica el enlace */ }
          }
        }
        lista.appendChild(item);
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

    const filtros = {
      texto: document.querySelector("#filtro-texto"),
      departamento: document.querySelector("#filtro-departamento"),
      municipio: document.querySelector("#filtro-municipio"),
      periodo: document.querySelector("#filtro-periodo"),
      grupo: document.querySelector("#filtro-grupo"),
      estado: document.querySelector("#filtro-estado")
    };
    const contador = document.querySelector("#catalogo-contador");
    const limpiar = document.querySelector("#filtro-limpiar");
    const nombreEstado = {
      demostrativo: "Demostrativo",
      referencia_historica: "Referencia histórica",
      verificado: "Verificado",
      pendiente: "Pendiente de verificación"
    };
    function opciones(select, valores, etiquetas = {}) {
      if (!select) return;
      [...new Set(valores.filter(v => typeof v === "string" && v.trim()))]
        .sort((a, b) => a.localeCompare(b, "es"))
        .forEach(valor => {
          const option = document.createElement("option");
          option.value = valor;
          option.textContent = etiquetas[valor] || valor;
          select.appendChild(option);
        });
    }
    opciones(filtros.departamento, registros.map(r => r.ubicacion?.departamento));
    opciones(filtros.municipio, registros.map(r => r.ubicacion?.municipio));
    opciones(filtros.periodo, registros.map(r => r.clasificacion?.periodoGeologico));
    opciones(filtros.grupo, registros.map(r => r.clasificacion?.grupo));
    opciones(filtros.estado, registros.map(r => r.estadoVerificacion), nombreEstado);
    function normalizar(valor) {
      return String(valor ?? "").normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "").toLocaleLowerCase("es");
    }
    function actualizarMunicipios() {
      if (!filtros.municipio) return;
      const anterior = filtros.municipio.value;
      const disponibles = registros.filter(r => !filtros.departamento?.value || r.ubicacion?.departamento === filtros.departamento.value).map(r => r.ubicacion?.municipio);
      filtros.municipio.replaceChildren(new Option("Todos", ""));
      opciones(filtros.municipio, disponibles);
      filtros.municipio.value = disponibles.includes(anterior) ? anterior : "";
    }
    function renderizar() {
      const consulta = normalizar(filtros.texto?.value.trim());
      const visibles = registros.filter(registro => {
        const texto = [
          registro.titulo, registro.descripcion, registro.id,
          registro.ubicacion?.departamento, registro.ubicacion?.municipio,
          registro.clasificacion?.grupo
        ].map(normalizar).join(" ");
        return (!consulta || texto.includes(consulta)) &&
          (!filtros.departamento?.value || registro.ubicacion?.departamento === filtros.departamento.value) &&
          (!filtros.municipio?.value || registro.ubicacion?.municipio === filtros.municipio.value) &&
          (!filtros.periodo?.value || registro.clasificacion?.periodoGeologico === filtros.periodo.value) &&
          (!filtros.grupo?.value || registro.clasificacion?.grupo === filtros.grupo.value) &&
          (!filtros.estado?.value || registro.estadoVerificacion === filtros.estado.value);
      });
      contenedor.replaceChildren();
      visibles.forEach(registro => contenedor.appendChild(crearTarjeta(registro)));
      if (!visibles.length) contenedor.appendChild(elemento("p", "No se encontraron registros con estos filtros."));
      if (contador) contador.textContent = `${visibles.length} de ${registros.length} registros`;
    }
    filtros.departamento?.addEventListener("change", () => { actualizarMunicipios(); renderizar(); });
    Object.entries(filtros).filter(([nombre]) => nombre !== "departamento").forEach(([,control]) => {
      control?.addEventListener("input", renderizar);
      control?.addEventListener("change", renderizar);
    });
    limpiar?.addEventListener("click", () => {
      Object.values(filtros).forEach(control => { if (control) control.value = ""; });
      actualizarMunicipios();
      renderizar();
    });
    const resumen = document.querySelector("#atlas-resumen");
    if (resumen) {
      const historicas = registros.filter(r => r.estadoVerificacion === "referencia_historica").length;
      const verificadas = registros.filter(r => r.estadoVerificacion === "verificado").length;
      const demo = registros.filter(r => r.estadoVerificacion === "demostrativo").length;
      for (const [numero, etiqueta] of [[registros.length, "Fichas del catálogo"], [historicas, "Referencias históricas"], [verificadas, "Hallazgos verificados"], [demo, "Fichas demostrativas"]]) {
        const tarjeta = document.createElement("div");
        const cifra = elemento("strong", String(numero));
        const descripcion = elemento("span", etiqueta);
        tarjeta.append(cifra, descripcion);
        resumen.appendChild(tarjeta);
      }
    }
    document.addEventListener("geopaleo:filtrar-departamento", evento => {
      const dep = evento.detail?.departamento;
      if (!dep || !filtros.departamento) return;
      const opcion = [...filtros.departamento.options].find(o => normalizar(o.value) === normalizar(dep));
      if (!opcion) return;
      filtros.departamento.value = opcion.value;
      actualizarMunicipios();
      renderizar();
      document.querySelector("#catalogo")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    actualizarMunicipios();
    renderizar();

  } catch (error) {
    console.error("Error del catálogo:", error);
    contenedor.replaceChildren();
    contenedor.appendChild(
      elemento("p", "No fue posible cargar el catálogo.")
    );
  }
});
