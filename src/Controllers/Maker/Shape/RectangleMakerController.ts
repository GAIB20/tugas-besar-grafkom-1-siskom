import AppCanvas from "../../../AppCanvas";
import Color from "../../../Base/Color";
import Line from "../../../Shapes/Line";
import Rectangle from "../../../Shapes/Rectangle";
import { IShapeMakerController } from "./IShapeMakerController";

export default class RectangleMakerController implements IShapeMakerController {
    private appCanvas: AppCanvas;
    private origin: {x: number, y: number} | null = null;

    constructor(appCanvas: AppCanvas) {
        this.appCanvas = appCanvas;
    }

    handleClick(x: number, y: number): void {
        if (this.origin === null) {
            this.origin = {x, y};
        } else {
            const black = new Color(0, 0, 0);
            const id = this.appCanvas.generateIdFromTag('rectangle');
            const rectangle = new Rectangle(
                id, black, this.origin.x, this.origin.y,this.origin.x, y, x, this.origin.y, x, y);
            this.appCanvas.addShape(rectangle);
            this.origin = null;
        }
    }
}