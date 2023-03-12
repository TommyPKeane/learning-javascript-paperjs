import { setupPaperCanvas } from "/modules/canvas-utils.js";

paper.install(window);

const mainCanvasId = "paper-canvas";
const mainCanvasElement = document.getElementById(mainCanvasId);
const mainPaperScope = new paper.PaperScope();
const mainPaperTool = null;
const uiElements = {};


document.addEventListener(
  "DOMContentLoaded",
  () => {
    const canvasCoords = setupPaperCanvas(mainPaperScope, mainCanvasId);
    mainPaperScope.activate();

    const shapeMargin = 15;

    const circleRadius = canvasCoords.width / 25;
    const circleCenter = [
      canvasCoords.width - circleRadius - shapeMargin,
      circleRadius + shapeMargin,
    ];

    uiElements["circle"] = new paper.Path.Circle(
      {
        center: circleCenter,
        radius: circleRadius,
        fillColor: "#AABBAA",
        strokeWidth: 3,
        strokeColor: "#77AA77",
      }
    );

    const squareHalfWidth = canvasCoords.width / 25;
    const squareWidth = (2 * squareHalfWidth);
    const squareCenter = [
      circleCenter[0],
      circleCenter[1] + circleRadius + (2 * shapeMargin) + squareHalfWidth,
    ];
    const squareTopLeft = [
      squareCenter[0] - squareHalfWidth,
      squareCenter[1] - squareHalfWidth,
    ];

    uiElements["square"] = new paper.Path.Rectangle(
      {
        point: squareTopLeft,
        size: new paper.Size(squareWidth, squareWidth),
        fillColor: "#BBAAAA",
        strokeWidth: 3,
        strokeColor: "#AA7777",
      }
    );

    const triangleRadius = canvasCoords.width / 25;
    const triangleCenter = [
      squareCenter[0],
      squareCenter[1] + squareHalfWidth + (2 * shapeMargin) + triangleRadius,
    ];

    uiElements["triangle"] = new paper.Path.RegularPolygon(
      {
        center: triangleCenter,
        radius: triangleRadius,
        sides: 3,
        fillColor: "#AAAABB",
        strokeWidth: 3,
        strokeColor: "#7777AA",
      }
    );

    const pentagonRadius = canvasCoords.width / 25;
    const pentagonCenter = [
      triangleCenter[0],
      triangleCenter[1] + triangleRadius + (2 * shapeMargin) + pentagonRadius,
    ];

    uiElements["pentagon"] = new paper.Path.RegularPolygon(
      {
        center: pentagonCenter,
        radius: pentagonRadius,
        sides: 5,
        fillColor: "#AAAABB",
        strokeWidth: 3,
        strokeColor: "#AA77AA",
      }
    );
    return;
  },
);
