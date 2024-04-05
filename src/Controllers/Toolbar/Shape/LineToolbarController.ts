import AppCanvas from '../../../AppCanvas';
import Line from '../../../Shapes/Line';
import { degToRad, euclideanDistanceVtx, getAngle } from '../../../utils';
import { ShapeToolbarController } from './ShapeToolbarController';

export default class LineToolbarController extends ShapeToolbarController {
    private lengthSlider: HTMLInputElement;

    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    private rotateSlider: HTMLInputElement;

    private line: Line;

    constructor(line: Line, appCanvas: AppCanvas) {
        super(line, appCanvas);

        this.line = line;

        const diagonal = Math.sqrt(
            appCanvas.width * appCanvas.width +
                appCanvas.height * appCanvas.height
        );
        this.lengthSlider = this.createSlider(
            'Length',
            () => line.length,
            1,
            diagonal
        );
        this.registerSlider(this.lengthSlider, (e) => {
            this.updateLength(parseInt(this.lengthSlider.value));
        });

        this.posXSlider = this.createSlider(
            'Position X',
            () => line.pointList[0].x,
            1,
            appCanvas.width
        );
        this.registerSlider(this.posXSlider, (e) => {
            this.updatePosX(parseInt(this.posXSlider.value));
        });

        this.posYSlider = this.createSlider(
            'Position Y',
            () => line.pointList[0].y,
            1,
            appCanvas.height
        );
        this.registerSlider(this.posYSlider, (e) => {
            this.updatePosY(parseInt(this.posYSlider.value));
        });

        this.rotateSlider = this.createSlider('Rotation', this.currentAngle.bind(this), 0, 360);
        this.registerSlider(this.rotateSlider, (e) => {
            this.updateRotation(parseInt(this.rotateSlider.value));
        });
    }

    private updateLength(newLen: number) {
        const lineLen = euclideanDistanceVtx(
            this.line.pointList[0],
            this.line.pointList[1]
        );
        const cos =
            (this.line.pointList[1].x - this.line.pointList[0].x) / lineLen;
        const sin =
            (this.line.pointList[1].y - this.line.pointList[0].y) / lineLen;
        this.line.pointList[1].x = newLen * cos + this.line.pointList[0].x;
        this.line.pointList[1].y = newLen * sin + this.line.pointList[0].y;

        this.line.length = newLen;

        this.updateShape(this.line);
    }

    private updatePosX(newPosX: number) {
        const diff = this.line.pointList[1].x - this.line.pointList[0].x;
        this.line.pointList[0].x = newPosX;
        this.line.pointList[1].x = newPosX + diff;
        this.updateShape(this.line);
    }

    private updatePosY(newPosY: number) {
        const diff = this.line.pointList[1].y - this.line.pointList[0].y;
        this.line.pointList[0].y = newPosY;
        this.line.pointList[1].y = newPosY + diff;
        this.updateShape(this.line);
    }

    private currentAngle() {
        return getAngle(this.line.pointList[0], this.line.pointList[1]);
    }

    private updateRotation(newRot: number) {
        const rad = degToRad(newRot);
        const cos = Math.cos(rad);
        const sin = Math.sin(rad);

        this.line.pointList[1].x =
            this.line.pointList[0].x + cos * this.line.length;
        this.line.pointList[1].y =
            this.line.pointList[0].y - sin * this.line.length;

        this.updateShape(this.line);
    }

    updateVertex(idx: number, x: number, y: number): void {
        this.line.pointList[idx].x = x;
        this.line.pointList[idx].y = y;

        this.line.length = euclideanDistanceVtx(
            this.line.pointList[0],
            this.line.pointList[1]
        );

        this.updateShape(this.line);
    }

    customVertexToolbar(): void {}
}
