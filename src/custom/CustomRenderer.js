import inherits from "inherits";
import BaseRenderer from "diagram-js/lib/draw/BaseRenderer";

import { append as svgAppend, create as svgCreate } from "tiny-svg";

const HIGH_PRIORITY = 1500;

export default function CustomRenderer(eventBus, bpmnRenderer) {
  BaseRenderer.call(this, eventBus, HIGH_PRIORITY);

  this.bpmnRenderer = bpmnRenderer;

  this.canRender = function (element) {
    //return element.type === 'elmi:CustomTask' || element.type === 'elmi:SpecialTask';
    return !element.labelTarget;
  };

  this.drawShape = function (parentNode, element) {
    if (element.type === "elmi:CustomTask") {
      const rect = svgCreate("rect");

      // Imposta l'attributo dell'elemento SVG
      rect.setAttribute("width", element.width);
      rect.setAttribute("height", element.height);
      rect.setAttribute("stroke", "black");
      rect.setAttribute("fill", "white");
      rect.setAttribute("stroke-width", 2);

      svgAppend(parentNode, rect);

      return rect;
    }

    if (element.type === "elmi:SpecialTask") {
      const rect = svgCreate("rect");

      // Imposta l'attributo dell'elemento SVG
      rect.setAttribute("width", element.width);
      rect.setAttribute("height", element.height);
      rect.setAttribute("stroke", "red");
      rect.setAttribute("fill", "white");
      rect.setAttribute("stroke-width", 5);

      svgAppend(parentNode, rect);

      return rect;
    }
  };

  this.getShapePath = function (shape) {
    // Restituisci il percorso per il quadrato
    const { x, y, width, height } = shape;
    return [
      ["M", x, y],
      ["l", width, 0],
      ["l", 0, height],
      ["l", -width, 0],
      ["z"]
    ];
  };
}

inherits(CustomRenderer, BaseRenderer);

CustomRenderer.$inject = ["eventBus", "bpmnRenderer"];
