// Coordinate Systems Utilities for Paper.js related to HTML Canvas
//
// Copyright (c) Tommy P. Keane, 2023
// https://www.tommypkeane.com
// https://github.com/tommypkeane


// Coordinates Enum
export const COORDINATES = {
  GLOBAL: 0,
  LOCAL: 1,
}

const allCoordinatesEnums = Object.entries(COORDINATES).map(
  (keyValuePair) => {
    return keyValuePair[0];
  },
)
const allCoordinatesEnumValues = Object.entries(COORDINATES).map(
  (keyValuePair) => {
    return keyValuePair[1];
  },
)


export const CoordinateSystem = class hstCoordinateSystem {
  #kind = null;
  #axes = {
    "x": null,
    "y": null,
  };
  #center = {
    "point": null,
    "circle": null,
  };
  center = null;

  #updateCoordinatesCenter(coordinatesCenter, attrs) {
    this.#center.point = new Point(coordinatesCenter);
    this.center = this.#center.point;
    this.#center.circle = new Path.Circle(
      {
        "center": this.#center.point,
        "radius": attrs?.centerRadius ?? 3,
        "fillColor": attrs?.fillColor ?? "#A4141B",
        "strokeWidth": attrs?.strokeWidth ?? 1,
        "strokeColor": attrs?.strokeColor ?? "#E4141B",
      }
    );
    return;
  }

  #updateCoordinatesAxisX(canvasBounds, attrs) {
    this.#axes.x = new Path.Line(
      {
        "from": new Point([-1, this.#center.point.y]),
        "to": (
          this.#kind == COORDINATES.GLOBAL
          ? new Point([canvasBounds.width + 1, this.#center.point.y])
          : (
            this.#kind == COORDINATES.LOCAL
            ? new Point([canvasBounds.width + 1, this.#center.point.y])
            : undefined
          )
        ),
        "strokeWidth": attrs?.strokeWidth ?? 1,
        "strokeColor": attrs?.strokeColor ?? "#E4141B",
        "dashArray": attrs?.dashArray ?? [7, 3],
      }
    );
    return;
  }

  #updateCoordinatesAxisY(canvasBounds, attrs) {
    this.#axes.y = new Path.Line(
      {
        "from": new Point([this.#center.point.x, -1]),
        "to": (
          this.#kind == COORDINATES.GLOBAL
          ? new Point([this.#center.point.x, canvasBounds.height + 1])
          : (
            this.#kind == COORDINATES.LOCAL
            ? new Point([this.#center.point.x, canvasBounds.height + 1])
            : undefined
          )
        ),
        "strokeWidth": attrs?.strokeWidth ?? 1,
        "strokeColor": attrs?.strokeColor ?? "#E4141B",
        "dashArray": attrs?.dashArray ?? [7, 3],
      }
    );
    return;
  }

  constructor(kind, params, attrs) {
    if (allCoordinatesEnums.includes(kind)) {
      this.#kind = COORDINATES[kind];
    } else if (allCoordinatesEnumValues.includes(kind)) {
      this.#kind = kind;
    } else {}

    const isLocal = (this.#kind === COORDINATES.LOCAL);
    attrs = attrs || {};

    this.#updateCoordinatesCenter(params.coordinatesCenter, attrs);
    this.#updateCoordinatesAxisX(params.canvasBounds, attrs);
    this.#updateCoordinatesAxisY(params.canvasBounds, attrs);
    return;
  }

  clearDrawing() {
    if (this.#axes === null || this.#axes === undefined) {}
    else {
      this.#axes.x.remove();
      this.#axes.x = null;
      this.#axes.y.remove();
      this.#axes.y = null;
      this.#center.point = null;
      this.#center.circle.remove();
      this.#center.circle = null;
      this.center = null;
    }
    return;
  }
}
