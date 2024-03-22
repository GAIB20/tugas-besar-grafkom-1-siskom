import AppCanvas from "../../../AppCanvas";
import Color from "../../../Base/Color";
import Line from "../../../Shapes/Line";
import { IShapeMakerController } from "./IShapeMakerController";

export default class LineMakerController implements IShapeMakerController {
    private appCanvas: AppCanvas;
    private origin: {x: number, y: number} | null = null;

    constructor(appCanvas: AppCanvas) {
        this.appCanvas = appCanvas;
    }

    handleClick(x: number, y: number): void {
        if (this.origin === null) {
            this.origin = {x, y};
        } else {
            const red = new Color(1, 0, 0);
            const id = this.appCanvas.generateIdFromTag('line');
            const line = new Line(id, red, this.origin.x, this.origin.y, x, y);
            this.appCanvas.addShape(line);
            this.origin = null;
        }
    }
}