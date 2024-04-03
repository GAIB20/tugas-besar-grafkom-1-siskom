import AppCanvas from "../../../AppCanvas";
import Color from "../../../Base/Color";
import Square from "../../../Shapes/Square";
import { hexToRgb } from "../../../utils";
import { IShapeMakerController } from "./IShapeMakerController";

export default class SquareMakerController implements IShapeMakerController {
    private appCanvas: AppCanvas;
    private origin: {x: number, y: number} | null = null;

    constructor(appCanvas: AppCanvas) {
        this.appCanvas = appCanvas;
    }

    handleClick(x: number, y: number, hex: string): void {
        if (this.origin === null) {
            this.origin = {x, y};
        } else {
            const {r, g, b} = hexToRgb(hex) ?? {r: 0, g: 0, b: 0};
            const color = new Color(r/255, g/255, b/255);
            const id = this.appCanvas.generateIdFromTag('square');

            const v1 = {x: x, y: y};
            // console.log(`v1x: ${v1.x}, v1y: ${v1.y}`)

            const v2 = {x: this.origin.x - (y - this.origin.y), 
                y: this.origin.y + (x-this.origin.x)}
            // console.log(`v2x: ${v2.x}, v2y: ${v2.y}`)

            const v3 = {x: 2*this.origin.x - x, 
                y: 2*this.origin.y - y}
            // console.log(`v3x: ${v3.x}, v3y: ${v3.y}`)

            const v4 = {x: this.origin.x + (y - this.origin.y), 
                y: this.origin.y - (x-this.origin.x)}
            // console.log(`v4x: ${v4.x}, v4y: ${v4.y}`)

            const square = new Square(
                id, color, v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, v4.x, v4.y);
            this.appCanvas.addShape(square);
            this.origin = null;
        }
    }
}