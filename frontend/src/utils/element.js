
import rough from 'roughjs';
import { ARROW_LENGTH, TOOL_ITEMS } from "../../constants";
import { getArrowHeadsCoordinates } from './math';
import getStroke from 'perfect-freehand/getStroke';
const gen = rough.generator()
export const createelement = (id, x1, y1, x2, y2, { type, stroke, fill, size }) => {
    const element = {
        id,
        x1,
        y1,
        x2,
        y2,
        type,
        stroke,
        fill,
        size
    };

    const options = {
        seed: id + 1,
        fill: "solid"
    };

    if (stroke) {
        options.stroke = stroke;
    }
    if (fill) {
        options.fill = fill;
    }
    if (size) {
        options.strokeWidth = size;
    }

    switch (type) {
        case TOOL_ITEMS.BRUSH: {
           const brush={
            id,
            points: [{ x: x1, y: y1 }],
            path: new Path2D(getSvgPathFromStroke(getStroke([{ x: x1, y: y1 }]))),
            type,
            stroke
           };
           return brush
        }
        case TOOL_ITEMS.LINE: {
            element.roughElement = gen.line(x1, y1, x2, y2, options);
            return element;
        }
        case TOOL_ITEMS.RECTANGLE: {
            element.roughElement = gen.rectangle(x1, y1, x2 - x1, y2 - y1, options);
            return element;
        }
        case TOOL_ITEMS.CIRCLE: {
            element.roughElement = gen.circle(x1, y1, 2 * Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2), options);
            return element;
        }
        case TOOL_ITEMS.ARROW: {
            const { x3, y3, x4, y4 } = getArrowHeadsCoordinates(
                x1, y1, x2, y2, ARROW_LENGTH
            );
            const points = [
                [x1, y1], [x2, y2], [x3, y3], [x2, y2], [x4, y4]
            ];
            element.roughElement = gen.linearPath(points, options);
            return element;
        }
        case TOOL_ITEMS.TEXT:{
            element.text=""
            return element
        }
        default:{
            throw new Error(`Type not recognised: ${type}`);
        }
    }

}


export const isPointNearElement = (element, pointX, pointY) => {
    const { x1, y1, x2, y2, type } = element;
    const context = document.getElementById("canvas").getContext("2d");
    switch (type) {
      case TOOL_ITEMS.LINE:
      case TOOL_ITEMS.ARROW:
        return isPointCloseToLine(x1, y1, x2, y2, pointX, pointY);
      case TOOL_ITEMS.RECTANGLE:
      case TOOL_ITEMS.CIRCLE:
        return (
          isPointCloseToLine(x1, y1, x2, y1, pointX, pointY) ||
          isPointCloseToLine(x2, y1, x2, y2, pointX, pointY) ||
          isPointCloseToLine(x2, y2, x1, y2, pointX, pointY) ||
          isPointCloseToLine(x1, y2, x1, y1, pointX, pointY)
        );
      case TOOL_ITEMS.BRUSH:
        const elPath = new Path2D(getSvgPathFromStroke(getStroke(element.points)));
        return context.isPointInPath(elPath, pointX, pointY);
      case TOOL_ITEMS.TEXT:
        context.font = `${element.size}px Caveat`;
        context.fillStyle = element.stroke;
        const textWidth = context.measureText(element.text).width;
        const textHeight = parseInt(element.size);
        context.restore();
        return (
          isPointCloseToLine(x1, y1, x1 + textWidth, y1, pointX, pointY) ||
          isPointCloseToLine(
            x1 + textWidth,
            y1,
            x1 + textWidth,
            y1 + textHeight,
            pointX,
            pointY
          ) ||
          isPointCloseToLine(
            x1 + textWidth,
            y1 + textHeight,
            x1,
            y1 + textHeight,
            pointX,
            pointY
          ) ||
          isPointCloseToLine(x1, y1 + textHeight, x1, y1, pointX, pointY)
        );
      default:
        throw new Error("Type not recognized");
    }
  };

  
export const getSvgPathFromStroke = (stroke) => {
    if (!stroke.length) return "";
  
    const d = stroke.reduce(
      (acc, [x0, y0], i, arr) => {
        const [x1, y1] = arr[(i + 1) % arr.length];
        acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
        return acc;
      },
      ["M", ...stroke[0], "Q"]
    );
  
    d.push("Z");
    return d.join(" ");
  };