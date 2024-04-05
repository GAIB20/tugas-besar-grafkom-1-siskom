import AppCanvas from '../../../AppCanvas';
import FanPolygon from '../../../Shapes/FanPolygon';
import { degToRad, getAngle } from '../../../utils';
import ShapeToolbarController from './ShapeToolbarController';

export default class FanPolygonToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    private scaleSlider: HTMLInputElement;

    private DEFAULT_SCALE = 50;

    private currentScale: number = 50;
    private fanPoly: FanPolygon;

    constructor(fanPoly: FanPolygon, appCanvas: AppCanvas) {
        super(fanPoly, appCanvas);

        this.fanPoly = fanPoly;

        this.posXSlider = this.createSlider(
            'Position X',
            () => fanPoly.pointList[0].x,
            1,
            appCanvas.width
        );
        this.registerSlider(this.posXSlider, () => {
            this.updatePosX(parseInt(this.posXSlider.value));
        });

        this.posYSlider = this.createSlider(
            'Position Y',
            () => fanPoly.pointList[0].y,
            1,
            appCanvas.height
        );
        this.registerSlider(this.posYSlider, () => {
            this.updatePosY(parseInt(this.posYSlider.value));
        });

        this.scaleSlider = this.createSlider(
            'Scale',
            this.getCurrentScale.bind(this),
            1,
            100
        );
        this.registerSlider(this.scaleSlider, () => {
            this.updateScale(parseInt(this.scaleSlider.value));
        });
    }

    private updatePosX(newPosX: number) {
        const diff = newPosX - this.fanPoly.pointList[0].x;
        this.fanPoly.pointList = this.fanPoly.pointList.map((vtx) => {
            vtx.x += diff;
            return vtx;
        });
        this.fanPoly.recalc();
        this.updateShape(this.fanPoly);
    }

    private updatePosY(newPosY: number) {
        const diff = newPosY - this.fanPoly.pointList[0].y;
        this.fanPoly.pointList = this.fanPoly.pointList.map((vtx, idx) => {
            vtx.y += diff;
            return vtx;
        });
        this.fanPoly.recalc();
        this.updateShape(this.fanPoly);
    }

    private getCurrentScale() {
        return this.currentScale;
    }

    private updateScale(newScale: number) {
        this.currentScale = newScale;
        this.fanPoly.pointList = this.fanPoly.pointList.map((vtx, idx) => {
            const rad = degToRad(getAngle(this.fanPoly.center, vtx));
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            vtx.x =
                this.fanPoly.center.x +
                cos *
                    this.fanPoly.lenList[idx] *
                    (newScale / this.DEFAULT_SCALE);
            vtx.y =
                this.fanPoly.center.y -
                sin *
                    this.fanPoly.lenList[idx] *
                    (newScale / this.DEFAULT_SCALE);

            return vtx;
        });
        this.updateShape(this.fanPoly);
    }

    updateVertex(idx: number, x: number, y: number): void {
        this.fanPoly.pointList[idx].x = x;
        this.fanPoly.pointList[idx].y = y;
        this.fanPoly.recalc();

        this.updateShape(this.fanPoly);
    }
}
