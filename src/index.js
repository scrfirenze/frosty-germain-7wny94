import Modeler from "bpmn-js/lib/Modeler";

import "bpmn-js/dist/assets/diagram-js.css";
import "bpmn-js/dist/assets/bpmn-js.css";
import "bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css";

import camundaModdlePackage from "camunda-bpmn-moddle/resources/camunda";

import elmiExtension from "./elmi.json";

import magicModdleDescriptor from "./magic.json";

import customModule from "./custom";

import "./styles.css";

import {
  BpmnPropertiesPanelModule,
  BpmnPropertiesProviderModule,
  CamundaPlatformPropertiesProviderModule,
  ElementTemplatesPropertiesProviderModule
} from "bpmn-js-properties-panel";

import diagram from "./diagram.bpmn";

const container = document.getElementById("container");
const bottoni = document.getElementById("hint");

const modeler = new Modeler({
  container,
  keyboard: {
    bindTo: document
  },
  additionalModules: [
    customModule,
    BpmnPropertiesPanelModule,
    BpmnPropertiesProviderModule,
    CamundaPlatformPropertiesProviderModule,
    ElementTemplatesPropertiesProviderModule
  ],
  moddleExtensions: {
    elmi: elmiExtension,
    camunda: camundaModdlePackage,
    magic: magicModdleDescriptor
  },
  propertiesPanel: {
    parent: "#properties-panel-container"
  }
});

//editXML button
const editXmlButtonEl = document.createElement("button");
editXmlButtonEl.textContent = "Edit XML";
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
    const result = await modeler.saveXML();
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
    saveButtonEl.textContent = "Save";
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
      modeler.importXML(editedXml, (err) => {
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
    closeButtonEl.textContent = "Close";
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

//import button
const uploadXmlButtonEl = document.createElement("input");
uploadXmlButtonEl.type = "file";
uploadXmlButtonEl.accept = ".xml, .bpmn";
uploadXmlButtonEl.style.display = "none";
uploadXmlButtonEl.addEventListener("change", () => {
  const fileReader = new FileReader();
  fileReader.readAsText(uploadXmlButtonEl.files[0], "UTF-8");
  fileReader.onload = (event) => {
    const xml = event.target.result;
    modeler.importXML(xml).catch((err) => {
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

modeler
  .importXML(diagram)
  .then(({ warnings }) => {
    if (warnings.length) {
      console.log(warnings);
    }

    const canvas = modeler.get("canvas");

    canvas.zoom("fit-viewport");
  })
  .catch((err) => {
    console.log(err);
  });
