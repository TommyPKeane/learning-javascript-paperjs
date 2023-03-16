import { setupPaperCanvas } from "/modules/canvas-utils.js";

paper.install(window);

const mainCanvasId = "paper-canvas";
const mainCanvasElement = document.getElementById(mainCanvasId);
const mainPaperScope = new paper.PaperScope();
const mainPaperTool = new paper.Tool();
const uiElements = {};

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
}
let modifierKeyHeld = false;
let supportedKeyHeld = false;

const figCaptionElement = document.getElementById("paper-canvas-figcaption");


const anyModifierPressed = function hstAnyModifierPressed() {
  const pressed = (
    modifierKeys.alt.pressed
    || modifierKeys.ctrl.pressed
    || modifierKeys.meta.pressed
    || modifierKeys.shift.pressed
  );
  return pressed;
}


const anyModifierReleased = function hstAnyModifierReleased() {
  const released = (
    modifierKeys.alt.released
    || modifierKeys.ctrl.released
    || modifierKeys.meta.released
    || modifierKeys.shift.released
  );
  return released;
}


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

mainPaperTool.onKeyDown = function(event) {
  const keyLetter = event.key.toUpperCase();
  modifierKeys.alt.pressed = event.event.altKey;
  modifierKeys.ctrl.pressed = event.event.ctrlKey;
  modifierKeys.meta.pressed = event.event.metaKey;
  modifierKeys.shift.pressed = event.event.shiftKey;
  if (anyModifierPressed()) {
    modifierKeyHeld = (supportedKeyHeld ? false : true);  // Pressed
  } else {}
  let trickleUp = true;
  if (supportedLetters.includes(keyLetter) && !modifierKeyHeld) {
    supportedKeyHeld = true;
    if (keyboardKeys[keyLetter].enabled) {
      keyboardKeys[keyLetter].key.fillColor = selectedColor;
      trickleUp = false;
    } else {}
  } else {}
  return trickleUp;
}


mainPaperTool.onKeyUp = function(event) {
  const keyLetter = event.key.toUpperCase();
  if (event.event.altKey) {
    modifierKeys.alt.pressed = false;
    modifierKeys.alt.released = true;
  } else {}
  if (event.event.ctrlKey) {
    modifierKeys.ctrl.pressed = false;
    modifierKeys.ctrl.released = true;
  } else {}
  if (event.event.metaKey) {
    modifierKeys.meta.pressed = false;
    modifierKeys.meta.released = true;
  } else {}
  if (event.event.shiftKey) {
    modifierKeys.shift.pressed = false;
    modifierKeys.shift.released = true;
  } else {}
  if (anyModifierReleased()) {
    modifierKeyHeld = anyModifierPressed();  // Released
  } else {}
  let trickleUp = true;
  if (supportedLetters.includes(keyLetter) && !modifierKeyHeld) {
    supportedKeyHeld = false;
    if (keyboardKeys[keyLetter].enabled) {
      keyboardKeys[keyLetter].key.fillColor = defaultColor;
      trickleUp = false;
    } else {}
  } else {}
  return trickleUp;
}


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
