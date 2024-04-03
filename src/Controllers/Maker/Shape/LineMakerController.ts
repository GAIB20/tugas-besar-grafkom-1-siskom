import AppCanvas from "../../../AppCanvas";
import Color from "../../../Base/Color";
import Line from "../../../Shapes/Line";
import { hexToRgb } from "../../../utils";
import { IShapeMakerController } from "./IShapeMakerController";

export default class LineMakerController implements IShapeMakerController {
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
            const id = this.appCanvas.generateIdFromTag('line');
            const line = new Line(id, color, this.origin.x, this.origin.y, x, y);
            this.appCanvas.addShape(line);
            this.origin = null;
        }
    }
}