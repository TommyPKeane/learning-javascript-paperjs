export const KeyboardKey = class hstKeyboardKey {
  name = null;
  isHeld = null;
  wasPressed = null;
  wasReleased = null;
  enabled = false;

  constructor(name, enabled = false, keyDown = null, keyUp = null) {
    this.name = name;
    this.enabled = enabled;
    this.keyDown ??= keyDown;
    this.keyUp ??= keyUp;
    this.isHeld = false;
    this.wasPressed = false;
    this.wasReleased = false;
    return;
  }

  _validateEvent(event) {
    if (event.key !== this.name) {
      console.warn(`${this.name} Key was triggered by the ${event.key} Event:\n${event}`);
    } else {}
    return;
  }

  keyDown(event) {
    if (this.wasPressed) { // 2nd+ Event
      this.isHeld = true;
      this.wasPressed = false;
    } else { // 1st Event
      this.wasPressed = true;
    }
    this.wasReleased = false;
    return;
  }

  keyUp(event) {
    this.wasReleased = true;
    this.isHeld = false;
    this.wasPressed = false;
    return;
  }
}


export const InteractiveKeyboard = class hstInteractiveKeyboard {
  supportedKeys = null;
  keyboardKeys = {
    "Alt": new KeyboardKey("Alt"),
    "Control": new KeyboardKey("Control"),
    "Meta": new KeyboardKey("Meta"),
    "Shift": new KeyboardKey("Shift"),
    "CapsLock": new KeyboardKey("CapsLock"),
    "ArrowUp": new KeyboardKey("ArrowUp"),
    "ArrowRight": new KeyboardKey("ArrowRight"),
    "ArrowDown": new KeyboardKey("ArrowDown"),
    "ArrowLeft": new KeyboardKey("ArrowLeft"),
    " ": new KeyboardKey(" "),
    "Enter": new KeyboardKey("Enter"),
    "Return": new KeyboardKey("Return"),
    "Backspace": new KeyboardKey("Backspace"),
    "Delete": new KeyboardKey("Delete"),
    "Home": new KeyboardKey("Home"),
    "End": new KeyboardKey("End"),
    "PageUp": new KeyboardKey("PageUp"),
    "PageDown": new KeyboardKey("PageDown"),
    "Escape": new KeyboardKey("Escape"),
    "[": new KeyboardKey("["),
    "]": new KeyboardKey("]"),
    "\\": new KeyboardKey("\\"),
    "'": new KeyboardKey("'"),
    ";": new KeyboardKey(";"),
    "/": new KeyboardKey("/"),
    ".": new KeyboardKey("."),
    ",": new KeyboardKey(","),
    "`": new KeyboardKey("`"),
    "/": new KeyboardKey("/"),
    "*": new KeyboardKey("*"),
    "-": new KeyboardKey("-"),
    "+": new KeyboardKey("+"),
    "a": new KeyboardKey("a"),
    "b": new KeyboardKey("b"),
    "c": new KeyboardKey("c"),
    "d": new KeyboardKey("d"),
    "e": new KeyboardKey("e"),
    "f": new KeyboardKey("f"),
    "g": new KeyboardKey("g"),
    "h": new KeyboardKey("h"),
    "i": new KeyboardKey("i"),
    "j": new KeyboardKey("j"),
    "k": new KeyboardKey("k"),
    "l": new KeyboardKey("l"),
    "m": new KeyboardKey("m"),
    "n": new KeyboardKey("n"),
    "o": new KeyboardKey("o"),
    "p": new KeyboardKey("p"),
    "q": new KeyboardKey("q"),
    "r": new KeyboardKey("r"),
    "s": new KeyboardKey("s"),
    "t": new KeyboardKey("t"),
    "u": new KeyboardKey("u"),
    "v": new KeyboardKey("v"),
    "w": new KeyboardKey("w"),
    "x": new KeyboardKey("x"),
    "y": new KeyboardKey("y"),
    "z": new KeyboardKey("z"),
    "0": new KeyboardKey("0"),
    "1": new KeyboardKey("1"),
    "2": new KeyboardKey("2"),
    "3": new KeyboardKey("3"),
    "4": new KeyboardKey("4"),
    "5": new KeyboardKey("5"),
    "6": new KeyboardKey("6"),
    "7": new KeyboardKey("7"),
    "8": new KeyboardKey("8"),
    "9": new KeyboardKey("9"),
    "F1": new KeyboardKey("F1"),
    "F2": new KeyboardKey("F2"),
    "F3": new KeyboardKey("F3"),
    "F4": new KeyboardKey("F4"),
    "F5": new KeyboardKey("F5"),
    "F6": new KeyboardKey("F6"),
    "F7": new KeyboardKey("F7"),
    "F8": new KeyboardKey("F8"),
    "F9": new KeyboardKey("F9"),
    "F10": new KeyboardKey("F10"),
    "F11": new KeyboardKey("F11"),
    "F12": new KeyboardKey("F12"),
  };

  constructor (
    supportedKeys = [],
  ) {
    this.supportedKeys = supportedKeys;
    for (const key of this.supportedKeys) {
      this.keyboardKeys[key.name].enabled = true;
      this.keyboardKeys[key.name].keyUp = key.keyUp;
      this.keyboardKeys[key.name].keyDown = key.keyDown;
    }
    return;
  }

  handleKeyDown(event) {
    let trickleUp = true;
    for (const key of this.supportedKeys) {
      if (event.key === key.name) {
        this.keyboardKeys[event.key].keyDown(event);
      } else {}
    }
    return trickleUp;
  }

  handleKeyUp(event) {
    let trickleUp = true;
    for (const key of this.supportedKeys) {
      if (event.key === key.name) {
        this.keyboardKeys[event.key].keyUp(event);
      } else {}
    }
    return trickleUp;
  }

  handlePaperKeyDown(event) {
    let trickleUp = this.handleKeyDown(event.event);
    return trickleUp;
  }

  handlePaperKeyUp(event) {
    let trickleUp = this.handleKeyUp(event.event);
    return trickleUp;
  }
}
