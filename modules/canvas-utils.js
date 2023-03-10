// Utility Methods for Paper.js related to HTML Canvas
//
// Copyright (c) Tommy P. Keane, 2023
// https://www.tommypkeane.com
// https://github.com/tommypkeane


export const setupPaperCanvas = function hstSetupPaperCanvas(paperScope, canvasId) {
  const canvas = document.getElementById(canvasId);
  paperScope.install(window);
  paperScope.setup(canvas);
  const canvasCoords = canvas.getBoundingClientRect();
  return canvasCoords;
}


/**
 * Convert Mouse Coordinates in a 2D Canvas to Reference Coordinates based-on a
 * given Center Point for the alternative Coordinate System.
 *
 * $$ x' = x - c $$
 *
 * @param {paper.Point} mousePoint Point in the 2D Canvas Coordinates.
 * @param {paper.Point} coordCenterPoint New Reference Coordinate System Center.
 *
 * @return {paper.Point} New Mouse Position (Point) with respect to the
 *     Coordinate Center Point.
 */
export const convertMousePointToReferenceCoordinates = function hstConvertMousePointToReferenceCoordinates(
  mousePoint,
  coordCenterPoint,
) {
  let convertedMousePoint = (
    mousePoint.subtract(coordCenterPoint)
  );
  convertedMousePoint.y = -convertedMousePoint.y;
  return convertedMousePoint;
}


/**
 * Determine the Cartesian Quadrant for the given Mouse Coordinates in the new
 * alternative/reference Coordinate System (relative to the new Center).
 *
 * $$ x' = x - c $$
 *
 * @param {paper.Point} mousePoint Point in the 2D Canvas Coordinates.
 * @param {paper.Point} coordCenterPoint New Reference Coordinate System Center.
 *
 * @return {Number} Quadrant of converted point with respect to new Coordinate
 *     System Center, per the `paper.Point.quadrant` conventions.
 */
export const getMousePointQuadrantInReferenceCoordinates = function hstGetMousePointQuadrantInReferenceCoordinates(
  mousePoint,
  coordCenterPoint,
) {
  let quadrant = null;
  const convertedMousePoint = convertMousePointToReferenceCoordinates(
    mousePoint,
    coordCenterPoint,
  );
  const xPositive = convertedMousePoint.x >= 0;
  const yPositive = convertedMousePoint.y >= 0;

  if (xPositive) {
    if (yPositive) {
      quadrant = 1; // +x, +y
    } else {
      quadrant = 4; // +x, -y
    }
  } else {
    if (yPositive) {
      quadrant = 2; // -x, +y
    } else {
      quadrant = 3; // -x, -y
    }
  }
  return quadrant;
}

/**
 * Determine the Cartesian Quadrant for the given Mouse Coordinates in the new
 * alternative/reference Coordinate System (relative to the new Center).
 *
 * sin(t) = (opp / hyp)
 * cos(t) = (adj / hyp)
 * tan(t) = (opp / adj)
 *
 * @param {paper.Point} initialMousePoint 2D Vector Initial Point in Canvas
 *     Coordinates.
 * @param {paper.Point} mousePoint finalMousePoint 2D Vector Initial Point in
 *     Canvas Coordinates.
 * @param {paper.Point} coordCenterPoint New Reference Coordinate System Center.
 *
 * @return {Number} Angle [deg] of the given Vector in Clockwise convention from
 *     the local-relative x-Axis per the new reference Coordinate System.
 */
export const getMouseVectorAngleInReferenceCoordinates = function hstGetMouseVectorAngleInReferenceCoordinates(
  initialMousePoint,
  finalMousePoint,
  coordCenterPoint,
) {
  let convertedAngle = null;
  const convertedInitialMousePoint = convertMousePointToReferenceCoordinates(
    initialMousePoint,
    coordCenterPoint,
  );
  const convertedFinalMousePoint = convertMousePointToReferenceCoordinates(
    finalMousePoint,
    coordCenterPoint,
  );
  const finalPointQuadrant = getMousePointQuadrantInReferenceCoordinates(
    finalMousePoint,
    initialMousePoint,
  );

  const adj = convertedFinalMousePoint.x - convertedInitialMousePoint.x;
  const opp = convertedFinalMousePoint.y - convertedInitialMousePoint.y;
  try {
    convertedAngle = Math.atan(opp / adj) * 180.0 / Math.PI;
    switch (finalPointQuadrant) {
      case 1:
        break;
      case 2:
      case 3:
        convertedAngle += 180;
        break;
      case 4:
        convertedAngle += 360;
        break;
      case null:
      default:
        break;
    }
  } catch {
    console.log(`Failed atan() for adj: ${adj}, opp: ${opp}`);
  }
  return convertedAngle;
}
