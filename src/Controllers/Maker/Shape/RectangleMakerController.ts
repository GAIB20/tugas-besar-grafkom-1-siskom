import AppCanvas from "../../../AppCanvas";
import Color from "../../../Base/Color";
import Rectangle from "../../../Shapes/Rectangle";
import { hexToRgb } from "../../../utils";
import { IShapeMakerController } from "./IShapeMakerController";

export default class RectangleMakerController implements IShapeMakerController {
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
            const id = this.appCanvas.generateIdFromTag('rectangle');
            const rectangle = new Rectangle(
                id, color, this.origin.x, this.origin.y,this.origin.x, y, x, this.origin.y, x, y,0,1,1);
            this.appCanvas.addShape(rectangle);
            this.origin = null;
        }
    }
}