import { setupPaperCanvas } from "/modules/canvas-utils.js";
import { InteractiveKeyboard } from "/modules/keyboard.js";

paper.install(window);

const mainCanvasId = "paper-canvas";
const mainCanvasElement = document.getElementById(mainCanvasId);
const mainPaperScope = new paper.PaperScope();
const mainPaperTool = new paper.Tool();
const uiElements = {};
const mainKeyboard = new InteractiveKeyboard(
  [
    {
      "name": "q",
      "keyUp": (event) => {},
      "keyDown": (event) => {},
    },
    {
      "name": "w",
      "keyUp": (event) => {},
      "keyDown": (event) => { console.log(event) },
    },
    {
      "name": "e",
      "keyUp": (event) => {},
      "keyDown": (event) => {},
    },
    {
      "name": "r",
      "keyUp": (event) => {},
      "keyDown": (event) => {},
    },
    {
      "name": "t",
      "keyUp": (event) => {},
      "keyDown": (event) => {},
    },
    {
      "name": "y",
      "keyUp": (event) => {},
      "keyDown": (event) => {},
    },
  ],
);

const defaultKeyWidth = 50;
const keyboardKeys = {};
const defaultColor = "#B2BEB5";
const selectedColor = "#CCCEC5";
const supportedLetters = ["Q", "W", "E", "R", "T", "Y"];
const KeyStates = {
  "SELECTED": true,
  "UNSELECTED": false,
}
const modifierKeys = {
  "alt": {
    "pressed": false,
    "released": false,
  },
  "ctrl": {
    "pressed": false,
    "released": false,
  },
  "meta": {
    "pressed": false,
    "released": false,
  },
  "shift": {
    "pressed": false,
    "released": false,
  },
  "space": {
    "pressed": false,
    "released": false,
  },
}
let modifierKeyHeld = false;
let supportedKeyHeld = false;

const figCaptionElement = document.getElementById("paper-canvas-figcaption");


let fps = 0;
let eventFrameTick = 0;

function onFrame(event) {
  if ((eventFrameTick % 10) == 0) {
    fps = 1.0 / event.delta;
    eventFrameTick = 0;
  } else {}
  figCaptionElement.innerHTML = `Running at ${fps.toFixed(2)} [fps]`;
  eventFrameTick += 1;
  return;
}

mainPaperTool.on("keydown", mainKeyboard.handlePaperKeyDown.bind(mainKeyboard));
mainPaperTool.on("keyup", mainKeyboard.handlePaperKeyUp.bind(mainKeyboard));


const createKeyboardKeyShape = function hstCreateKeyboardKeyShape(
  topLeftPoint,
  keyLetter,
  keyWidth = defaultKeyWidth,
) {
  const keyHalfWidth = keyWidth / 2;
  return {
    "enabled": KeyStates.SELECTED,
    "key": new paper.Path.Rectangle(
      {
        point: topLeftPoint,
        size: new paper.Size(keyWidth, keyWidth),
        fillColor: defaultColor,
        strokeWidth: 2,
        strokeColor: "#82BEB5",
      }
    ),
    "letter": new PointText(
      {
        point: [
          topLeftPoint[0] + keyHalfWidth - 8,
          topLeftPoint[1] + keyHalfWidth + 6,
        ],
        content: keyLetter,
        fillColor: "black",
        fontFamily: "Courier New",
        fontWeight: "bold",
        fontSize: 25,
      }
    ),
  };
}


const handlerDomContentLoaded = function hstHandlerDomContentLoaded() {
  const canvasCoords = setupPaperCanvas(mainPaperScope, mainCanvasId);
  mainPaperScope.activate();
  paper.view.onFrame = onFrame;

  keyboardKeys["Q"] = createKeyboardKeyShape([50, 50], "Q");
  keyboardKeys["W"] = createKeyboardKeyShape([50 + 1 * (defaultKeyWidth + 10), 50], "W");
  keyboardKeys["E"] = createKeyboardKeyShape([50 + 2 * (defaultKeyWidth + 10), 50], "E");
  keyboardKeys["R"] = createKeyboardKeyShape([50 + 3 * (defaultKeyWidth + 10), 50], "R");
  keyboardKeys["T"] = createKeyboardKeyShape([50 + 4 * (defaultKeyWidth + 10), 50], "T");
  keyboardKeys["Y"] = createKeyboardKeyShape([50 + 5 * (defaultKeyWidth + 10), 50], "Y");
  return;
}


document.addEventListener(
  "DOMContentLoaded",
  handlerDomContentLoaded,
);
