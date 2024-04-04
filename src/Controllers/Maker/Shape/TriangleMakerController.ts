import AppCanvas from "../../../AppCanvas";
import Color from "../../../Base/Color";
import Triangle from "../../../Shapes/Triangle";
import { hexToRgb } from "../../../utils";
import { IShapeMakerController } from "./IShapeMakerController";

export default class SquareMakerController implements IShapeMakerController {
    private appCanvas: AppCanvas;
    private pointOne: {x: number, y: number} | null = null;
    private pointTwo: {x: number, y: number} | null = null;

    constructor(appCanvas: AppCanvas) {
        this.appCanvas = appCanvas;
    }

    handleClick(x: number, y: number, hex: string): void {
        if (this.pointOne === null) {
            this.pointOne = {x, y};
        } else if (this.pointTwo === null) {
            this.pointTwo = {x, y};
        } else {
            const {r, g, b} = hexToRgb(hex) ?? {r: 0, g: 0, b: 0};
            const color = new Color(r/255, g/255, b/255);
            const id = this.appCanvas.generateIdFromTag('triangle');

            const v1 = {x: this.pointOne.x, y: this.pointOne.y};
            console.log(`v1x: ${v1.x}, v1y: ${v1.y}`)

            const v2 = {x: this.pointTwo.x, 
                y: this.pointTwo.y}
            console.log(`v2x: ${v2.x}, v2y: ${v2.y}`)

            const v3 = {x: x, y: y}
            console.log(`v3x: ${v3.x}, v3y: ${v3.y}`)

            const triangle = new Triangle(
                id, color, v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
            this.appCanvas.addShape(triangle);
            this.pointOne = null;
            this.pointTwo = null;
        }
    }
}