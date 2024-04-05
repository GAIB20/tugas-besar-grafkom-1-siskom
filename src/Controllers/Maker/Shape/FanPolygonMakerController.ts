import AppCanvas from '../../../AppCanvas';
import Color from '../../../Base/Color';
import Vertex from '../../../Base/Vertex';
import FanPolygon from '../../../Shapes/FanPolygon';
import { hexToRgb } from '../../../utils';
import { IShapeMakerController } from './IShapeMakerController';

export default class FanPolygonMakerController
    implements IShapeMakerController
{
    private appCanvas: AppCanvas;
    private origin: Vertex | null = null;
    private currentPoly: FanPolygon | null = null;
    private setPolygonButton: HTMLButtonElement;

    constructor(appCanvas: AppCanvas) {
        this.appCanvas = appCanvas;

        this.setPolygonButton = document.getElementById(
            'set-polygon'
        ) as HTMLButtonElement;
        this.setPolygonButton.classList.remove('hidden');

        this.setPolygonButton.onclick = (e) => {
            e.preventDefault();
            if (
                this.origin !== null &&
                this.currentPoly !== null &&
                this.currentPoly.pointList.length > 2
            ) {
                this.currentPoly = null;
                this.origin = null;
            }
        };
    }

    handleClick(x: number, y: number, hex: string): void {
        const { r, g, b } = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
        const color = new Color(r / 255, g / 255, b / 255);

        if (this.origin === null) {
            this.origin = new Vertex(x, y, color);
        } else if (this.origin !== null && this.currentPoly === null) {
            const newVertex = new Vertex(x, y, color);
            const id = this.appCanvas.generateIdFromTag('polyfan');

            this.currentPoly = new FanPolygon(id, color, [this.origin, newVertex]);
            this.appCanvas.addShape(this.currentPoly);
        } else {
            const newVertex = new Vertex(x, y, color);
            if (this.currentPoly) {
                this.currentPoly.addVertex(newVertex);
                this.appCanvas.editShape(this.currentPoly);
            }
        }
    }
}
