import xmlFormat from "xml-formatter";

export class UploadXmlButton {
  constructor(bpmnModeler, bottoni) {
    const uploadXmlButtonEl = document.createElement("input");
    uploadXmlButtonEl.type = "file";
    uploadXmlButtonEl.accept = ".xml, .bpmn";
    uploadXmlButtonEl.style.display = "none";
    uploadXmlButtonEl.addEventListener("change", () => {
      const fileReader = new FileReader();
      fileReader.readAsText(uploadXmlButtonEl.files[0], "UTF-8");
      fileReader.onload = (event) => {
        const xml = event.target.result;
        bpmnModeler.importXML(xml).catch((err) => {
          console.error(err);
        });
      };
    });
    const uploadXmlLabelEl = document.createElement("label");
    uploadXmlLabelEl.textContent = "Import XML";
    uploadXmlLabelEl.className = "panel";
    uploadXmlLabelEl.style.marginLeft = "5px";
    uploadXmlLabelEl.style.zIndex = "10";
    uploadXmlLabelEl.style.cursor = "pointer";
    uploadXmlLabelEl.addEventListener("click", () => {
      uploadXmlButtonEl.click();
    });
    bottoni.appendChild(uploadXmlButtonEl);
    bottoni.appendChild(uploadXmlLabelEl);
  }
}

export class DownloadXmlButton {
  constructor(bpmnModeler, bottoni) {
    const downloadXmlButtonEl = document.createElement("button");
    downloadXmlButtonEl.textContent = "Export XML";
    downloadXmlButtonEl.className = "panel";
    downloadXmlButtonEl.style.marginLeft = "5px";
    downloadXmlButtonEl.style.zIndex = "10";
    downloadXmlButtonEl.style.cursor = "pointer";
    downloadXmlButtonEl.addEventListener("click", () => {
      bpmnModeler.saveXML({ format: true }, (err, xml) => {
        if (err) {
          console.error(err);
          return;
        }
        const blob = new Blob([xml], { type: "application/xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagram.bpmn";
        a.click();
        URL.revokeObjectURL(url);
      });
    });
    bottoni.appendChild(downloadXmlButtonEl);
  }
}

export class DownloadSVGButton {
  constructor(bpmnModeler, bottoni) {
    const downloadSvgButtonEl = document.createElement("button");
    downloadSvgButtonEl.textContent = "Export SVG";
    downloadSvgButtonEl.className = "panel";
    downloadSvgButtonEl.style.marginLeft = "5px";
    downloadSvgButtonEl.style.zIndex = "10";
    downloadSvgButtonEl.style.cursor = "pointer";
    downloadSvgButtonEl.addEventListener("click", () => {
      bpmnModeler.saveSVG((err, svg) => {
        if (err) {
          console.error(err);
          return;
        }
        const blob = new Blob([svg], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "diagram.svg";
        a.click();
        URL.revokeObjectURL(url);
      });
    });
    bottoni.appendChild(downloadSvgButtonEl);
  }
}

export class EditXMLButton {
  constructor(bpmnModeler, bottoni) {
    const editXmlButtonEl = document.createElement("button");
    editXmlButtonEl.textContent = "Modifica XML";
    editXmlButtonEl.className = "panel";
    editXmlButtonEl.style.marginLeft = "5px";
    editXmlButtonEl.style.zIndex = "10";
    editXmlButtonEl.style.cursor = "pointer";
    editXmlButtonEl.addEventListener("click", () => {
      editXml();
    });
    bottoni.appendChild(editXmlButtonEl);
    async function editXml() {
      try {
        const result = await bpmnModeler.saveXML();
        const { xml } = result;
        const formattedXml = xml;

        const overlayEl = document.createElement("div");
        overlayEl.classList.add("fullscreen-overlay");

        const editXmlContainerEl = document.createElement("div");
        editXmlContainerEl.classList.add("fullscreen-xml-container");

        const titleEl = document.createElement("h2");
        titleEl.textContent = "Modifica XML";
        titleEl.style.margin = "10px";
        titleEl.style.fontSize = "24px";
        editXmlContainerEl.appendChild(titleEl);

        const xmlTextAreaEl = document.createElement("textarea");
        xmlTextAreaEl.textContent = formattedXml;
        xmlTextAreaEl.style.width = "100%";
        xmlTextAreaEl.style.height = "calc(100% - 100px)";
        xmlTextAreaEl.style.resize = "none";
        xmlTextAreaEl.style.fontSize = "16px";
        xmlTextAreaEl.style.fontFamily = "monospace";
        xmlTextAreaEl.style.padding = "10px";
        xmlTextAreaEl.style.boxSizing = "border-box";
        xmlTextAreaEl.style.border = "2px solid #ccc";
        xmlTextAreaEl.style.borderRadius = "5px";
        xmlTextAreaEl.style.marginTop = "10px";
        xmlTextAreaEl.style.marginBottom = "10px";
        editXmlContainerEl.appendChild(xmlTextAreaEl);

        const buttonContainerEl = document.createElement("div");
        buttonContainerEl.style.display = "flex";
        buttonContainerEl.style.justifyContent = "flex-end";
        buttonContainerEl.style.marginBottom = "10px";

        const saveButtonEl = document.createElement("button");
        saveButtonEl.textContent = "Salva";
        saveButtonEl.style.marginRight = "10px";
        saveButtonEl.style.padding = "10px 20px";
        saveButtonEl.style.background = "#4CAF50";
        saveButtonEl.style.color = "#fff";
        saveButtonEl.style.fontSize = "16px";
        saveButtonEl.style.border = "none";
        saveButtonEl.style.borderRadius = "5px";
        saveButtonEl.style.cursor = "pointer";
        saveButtonEl.addEventListener("click", () => {
          const editedXml = xmlTextAreaEl.value;
          bpmnModeler.importXML(editedXml, (err) => {
            if (err) {
              alert(
                "Errore nel salvataggio dell'XML, assicurati che il contenuto sia corretto!" +
                  err
              );
              return;
            }
            overlayEl.classList.add("hidden");
          });
        });
        buttonContainerEl.appendChild(saveButtonEl);

        const closeButtonEl = document.createElement("button");
        closeButtonEl.textContent = "Chiudi";
        closeButtonEl.style.padding = "10px 20px";
        closeButtonEl.style.fontSize = "16px";
        closeButtonEl.style.border = "2px solid #ccc";
        closeButtonEl.style.borderRadius = "5px";
        closeButtonEl.style.cursor = "pointer";
        closeButtonEl.addEventListener("click", () => {
          overlayEl.classList.add("hidden");
        });
        buttonContainerEl.appendChild(closeButtonEl);

        editXmlContainerEl.appendChild(buttonContainerEl);

        overlayEl.appendChild(editXmlContainerEl);
        document.body.appendChild(overlayEl);
      } catch (err) {
        console.log(err);
      }
    }
  }
}

export class ZoomButtons {
  constructor(bpmnModeler, containerEl, canvasEl, canvasEl2) {
    const zoomInButton = document.createElement("button");
    zoomInButton.innerHTML = "+";
    zoomInButton.addEventListener("click", function () {
      // aumenta il livello di zoom
      bpmnModeler.get("zoomScroll").zoom(0.1, {
        x: canvasEl.offsetWidth / 2,
        y: canvasEl.offsetHeight / 2
      });
      bpmnModeler.get("zoomScroll").zoom(0.1, {
        x: canvasEl2.offsetWidth / 2,
        y: canvasEl2.offsetHeight / 2
      });
    });

    const zoomOutButton = document.createElement("button");
    zoomOutButton.innerHTML = "-";
    zoomOutButton.addEventListener("click", function () {
      // diminuisci il livello di zoom
      bpmnModeler.get("zoomScroll").zoom(-0.1, {
        x: canvasEl.offsetWidth / 2,
        y: canvasEl.offsetHeight / 2
      });
      bpmnModeler.get("zoomScroll").zoom(-0.1, {
        x: canvasEl2.offsetWidth / 2,
        y: canvasEl2.offsetHeight / 2
      });
    });

    // aggiungi i bottoni alla pagina
    const buttonsContainer = document.createElement("div");
    buttonsContainer.setAttribute("id", "buttons-container");
    buttonsContainer.appendChild(zoomInButton);
    buttonsContainer.appendChild(zoomOutButton);
    document.body.insertBefore(buttonsContainer, containerEl);
  }
}
