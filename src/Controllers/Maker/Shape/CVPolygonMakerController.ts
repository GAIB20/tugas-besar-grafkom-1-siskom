import AppCanvas from '../../../AppCanvas';
import Color from '../../../Base/Color';
import Vertex from '../../../Base/Vertex';
import CVPolygon from '../../../Shapes/CVPolygon';
import { hexToRgb } from '../../../utils';
import { IShapeMakerController } from './IShapeMakerController';

export default class CVPolygonMakerController
    implements IShapeMakerController
{
    private appCanvas: AppCanvas;
    private origin: Vertex | null = null;
    private secondPoint: Vertex | null = null;
    private currentPoly: CVPolygon | null = null;
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
                this.secondPoint !== null
            ) {
                this.currentPoly = null;
                this.secondPoint = null;
                this.origin = null;
            }
        };
    }

    setCurrentPolygon(id: string) {
        this.currentPoly = this.appCanvas.shapes[id] as CVPolygon;
        this.origin = this.currentPoly.pointList[0];
        this.secondPoint = this.currentPoly.pointList[1];
    }

    handleClick(x: number, y: number, hex: string): void {
        const { r, g, b } = hexToRgb(hex) ?? { r: 0, g: 0, b: 0 };
        const color = new Color(r / 255, g / 255, b / 255);

        if (this.origin === null) {
            console.log('origin set');
            
            this.origin = new Vertex(x, y, color);
        } else if (this.origin !== null && this.secondPoint === null) {
            console.log('second set');

            this.secondPoint = new Vertex(x, y, color);
        } else if (this.origin !== null && this.secondPoint !== null && this.currentPoly === null) {
            console.log('shape set');
            const newVertex = new Vertex(x, y, color);
            const id = this.appCanvas.generateIdFromTag('polycv');

            this.currentPoly = new CVPolygon(id, color, [this.origin, this.secondPoint, newVertex]);
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
