import { setupPaperCanvas } from "/modules/canvas-utils.js";

paper.install(window);

const mainCanvasId = "paper-canvas";
const mainCanvasElement = document.getElementById(mainCanvasId);
const mainPaperScope = new paper.PaperScope();
const mainPaperTool = null;
const uiElements = {};

let lastRun = 0;


document.addEventListener(
  "DOMContentLoaded",
  () => {
    const canvasCoords = setupPaperCanvas(mainPaperScope, mainCanvasId);
    mainPaperScope.activate();

    const numRaindrops = 500;
    uiElements["raindrops"] = [];

    for (const i of [...Array(numRaindrops + 1).keys()]) {
      const tempCenter = [
        i * (canvasCoords.width / numRaindrops),
        0,
      ];

      uiElements["raindrops"].push(
        new paper.Path.Circle(
          {
            center: tempCenter,
            radius: 3,
            fillColor: "#3333AA",
            strokeWidth: 3,
            strokeColor: "#333377",
          }
        )
      );
    }

    function onFrame(event) {
      if (event.time - lastRun >= 2) {
        lastRun = event.time;
        console.log(lastRun, event)
        for (const obj of uiElements["raindrops"]) {
          obj.tween(
            {
              "position.y": 0,
            },
            {
              "position.y": canvasCoords.height,
            },
            {
              "duration": 2000 - (2000 * Math.random()),
              "easing": "easeInQuint",
              "start": true,
            },
          );
        }
      } else {}
      return;
    }

    paper.view.onFrame = onFrame;

    return;
  },
);
