// Module for Visualizations of Vectors
// Example Canvas: Coordinates in Canvas vs. Paper.js Coordinates
//
// Usage:
//  When importing from this module, the import statement needs to come after
//  the containing module calls this line:
//  `paper.install(window);`
//  Which also assumes that the HTML file has this line:
//  `<script type="text/javascript" src="/thirdparty/paper/paper-full.min.js"></script>`
//
// Utility Classes and Functions for Geometric Algebra concepts related to
// visualizing objects and elements in 2D and 3D `<canvas>` DOM elements.
//
// Note:
//  If you're mainly familiar with C, C++, or Python, you might expect that you
//  could clean-up this code to use Operator Overloading, but in the long long
//  long long long long looooOOOoooong list of ridiculously terrible things
//  about JavaScript, it turns out that there's no actual ability to do Operator
//  Overlaoding with currently standardized ECMAScript JavaScript (ES8/ES10).
//
// References:
// - https://2ality.com/2011/12/fake-operator-overloading.html
// - https://medium.com/engineered-publicis-sapient/javascript-es6-es7-es10-where-are-we-8ac044dfd964
//
// Copyright (c) Tommy P. Keane, 2022
// https://www.tommypkeane.com
// https://github.com/tommypkeane

import {
  convertMousePointToReferenceCoordinates,
  getMousePointQuadrantInReferenceCoordinates,
  getMouseVectorAngleInReferenceCoordinates,
} from "/projects/geometricalgebra/canvas-utils.js";


export const VectorStats = class hstVectorStats {
  #numDimensions = null;
  #volume = null;
  #projections = null;
  #globalAngle = null;

  update(initialPoint, finalPoint, numDimensions, globalCenter) {
    this.#numDimensions = numDimensions;
    this.#volume = finalPoint.subtract(initialPoint).length;
    this.#globalAngle = getMouseVectorAngleInReferenceCoordinates(initialPoint, finalPoint, globalCenter);
    return;
  }

  getNumDimensions() {
    return this.#numDimensions;
  }

  getVolume() {
    return this.#volume;
  }

  getGlobalAngle() {
    return this.#globalAngle;
  }
};


export const Vector2D = class hstVector2D {
  #stats = null;
  #vectorPath = null;
  #vectorPathAttrs = {
    "strokeWidth": 2,
    "strokeColor": "#E4141BFF",
  };
  #vectorPathBody = null;
  #vectorPathAngle = null;
  #vectorPathAngleLength = 15;
  #vectorPathHead = null;
  #vectorPointDiff = null;
  #vectorArrowHead = null;
  #vectorArrowHeadLength = 5;
  #globalCenter = null;
  #initialPoint = null;
  #finalPoint = null;
  #vector = null;
  #vectorAngle = null;
  #vectorPathAngleFrom = null;
  #vectorPathAngleThrough = null;
  #vectorPathAngleTo = null;
  #vectorPathIndicatorXLine = null;
  #vectorPathIndicatorYLine = null;
  #vectorComponentA = null;
  #vectorComponentB = null;
  #length = null;

  #updateVectorAngle() {
    this.#vector = this.#finalPoint.subtract(this.#globalCenter).subtract(
      this.#initialPoint.subtract(this.#globalCenter)
    );
    this.#vectorAngle = -this.#vector.angle;
    if (this.#vectorAngle % 360 != 0) {
      const from = this.#initialPoint.add(new Point(this.#vectorPathAngleLength, 0));
      const to =  this.#initialPoint.add(this.#vector.normalize(this.#vectorPathAngleLength));
      const through = to.rotate(this.#vectorAngle / 2, this.#initialPoint);
      this.#vectorPathAngle = new Path.Arc(
        {
          "from": from,
          "through": through,
          "to": to,
          "strokeWidth": 1,
          "strokeColor": "#3A3AA15C",
          "dashArray": [4, 2],
        },
      );
      this.#vectorPathAngleFrom = new Path.Circle(
        {
          "center": from,
          "radius": 2,
          "fillColor": "#E4141B",
          "strokeWidth": 1,
          "strokeColor": "#E4141B",
        }
      );
      this.#vectorPathAngleThrough = new Path.Circle(
        {
          "center": through,
          "radius": 2,
          "fillColor": "#74147B",
          "strokeWidth": 1,
          "strokeColor": "#74147B",
        }
      );
      this.#vectorPathAngleTo = new Path.Circle(
        {
          "center": to,
          "radius": 2,
          "fillColor": "#E4141B",
          "strokeWidth": 1,
          "strokeColor": "#E4141B",
        }
      );
    } else {}
    return;
  }

  constructor(globalCenter, initialPoint, finalPoint, attrs) {
    this.#globalCenter = globalCenter;
    this.#initialPoint = initialPoint;
    this.#finalPoint = finalPoint;
    if (attrs) {
      this.#vectorPathAttrs.strokeWidth ||= attrs?.strokeWidth;
      this.#vectorPathAttrs.strokeColor ||= attrs?.strokeColor;
      this.#vectorArrowHeadLength ||= attrs?.vectorArrowHeadLength;
    } else {}

    this.#vectorArrowHead = this.#initialPoint.normalize(this.#vectorArrowHeadLength);

    this.#vectorPathBody = new paper.Path.Line(this.#initialPoint, this.#finalPoint);
    this.#vectorPathHead = new paper.Path(
      [
        this.#finalPoint.add(this.#vectorArrowHead.rotate(135)),
        this.#finalPoint,
        this.#finalPoint.add(this.#vectorArrowHead.rotate(-135))
      ]
    );

    this.#updateVectorAngle();

    this.#vectorPath = new paper.Group(
      {
        "children": [
          this.#vectorPathBody,
          this.#vectorPathHead,
        ],
        "strokeWidth": this.#vectorPathAttrs.strokeWidth,
        "strokeColor": this.#vectorPathAttrs.strokeColor,
      }
    );

    this.#stats = new VectorStats();
    return;
  }

  clearDrawing() {
    if (this.#vectorPath === null || this.#vectorPath === undefined) {}
    else {
      if (this.#vectorPathAngle) {
        this.#vectorPathAngle.remove();
        this.#vectorPathAngle = null;
      } else {}
      if (this.#vectorPathAngleFrom) {
        this.#vectorPathAngleFrom.remove();
        this.#vectorPathAngleFrom = null;
      } else {}
      if (this.#vectorPathAngleThrough) {
        this.#vectorPathAngleThrough.remove();
        this.#vectorPathAngleThrough = null;
      } else {}
      if (this.#vectorPathAngleTo) {
        this.#vectorPathAngleTo.remove();
        this.#vectorPathAngleTo = null;
      } else {}
      this.#vectorPath.remove();
      this.#vectorPath = null;
    }
    this.hideComponents();
    return;
  }

  getStats() {
    return this.#stats;
  }

  updateVector(finalPoint, attrs) {
    this.#finalPoint = finalPoint;
    if (attrs) {
      this.#vectorPathAttrs["strokeWidth"] ||= attrs?.strokeWidth;
      this.#vectorPathAttrs["strokeColor"] ||= attrs?.strokeColor;
    } else {}

    this.clearDrawing();

    this.#vectorPointDiff = this.#finalPoint.subtract(this.#initialPoint);
    this.#vectorArrowHead = this.#vectorPointDiff.normalize(this.#vectorArrowHeadLength);

    this.#vectorPathBody = new paper.Path.Line(this.#initialPoint, this.#finalPoint);
    this.#vectorPathHead = new paper.Path(
      [
        this.#finalPoint.add(this.#vectorArrowHead.rotate(135)),
        this.#finalPoint,
        this.#finalPoint.add(this.#vectorArrowHead.rotate(-135))
      ]
    );

    this.#updateVectorAngle();

    this.#vectorPath = new paper.Group(
      {
        "children": [
          this.#vectorPathBody,
          this.#vectorPathHead,
        ],
        "strokeWidth": this.#vectorPathAttrs.strokeWidth,
        "strokeColor": this.#vectorPathAttrs.strokeColor,
      }
    );

    this.#stats.update(this.#initialPoint, this.#finalPoint, 2, this.#globalCenter);
    return;
  }

  hideComponents() {
    if (this.#vectorComponentA === null || this.#vectorComponentA === undefined) {}
    else {
      this.#vectorComponentA.remove();
    }
    if (this.#vectorComponentB === null || this.#vectorComponentB === undefined) {}
    else {
      this.#vectorComponentB.remove();
    }
    return;
  }

  showComponents(coordCenter) {
    this.hideComponents();
    this.#vectorComponentA = new Path.Line(
      {
        "from": coordCenter,
        "to": this.#initialPoint,
        "strokeWidth": 1,
        "strokeColor": "3AFA41BC",
        "dashArray": [12, 3],
      }
    );
    this.#vectorComponentB = new Path.Line(
      {
        "from": coordCenter,
        "to": this.#finalPoint,
        "strokeWidth": 1,
        "strokeColor": "#3A3AF1BC",
        "dashArray": [12, 3],
      }
    );
    return;
  }

  get length() {
    this.#length = this.#finalPoint.subtract(this.#initialPoint);
    return this.#length;
  }

  add(otherVector2D) {
    return this;
  }

  subtract(otherVector2D) {
    return this;
  }

  increment(otherVector2D) {
    return this;
  }

  dotProduct(otherVector2D) {
    return this;
  }

  crossProduct(otherVector2D) {
    return this;
  }

  applyOperator(op, otherVector2D) {
    let result = null;
    switch (op) {
      case "+":
        result = this.add(otherVector2D);
        break;
      case "-":
        result = this.subtract(otherVector2D);
        break;
      case "++":
        result = this.increment(otherVector2D);
        break;
      case ".":
      case ".*":
        result = this.dotProduct(otherVector2D);
        break;
      case "x":
      case "*":
        result = this.crossProduct(otherVector2D);
        break;
    }
    return result;
  }
};
