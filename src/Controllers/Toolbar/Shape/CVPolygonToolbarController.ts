import AppCanvas from '../../../AppCanvas';
import CVPolygon from '../../../Shapes/CVPolygon';
import { degToRad, getAngle } from '../../../utils';
import CanvasController from '../../Maker/CanvasController';
import { ShapeToolbarController } from './ShapeToolbarController';

export default class CVPolygonToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    private scaleSlider: HTMLInputElement;

    private DEFAULT_SCALE = 50;

    private currentScale: number = 50;
    private cvPoly: CVPolygon;
    private canvasController: CanvasController;

    constructor(
        fanPoly: CVPolygon,
        appCanvas: AppCanvas,
        canvasController: CanvasController
    ) {
        super(fanPoly, appCanvas);
        this.canvasController = canvasController;
        this.canvasController.toolbarOnClickCb = this.initVertexToolbar.bind(this);

        this.cvPoly = fanPoly;

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

    customVertexToolbar() {
        const addVtxButton = this.createVertexButton('Add Vertex');
        addVtxButton.onclick = (e) => {
            e.preventDefault();
            this.canvasController.editExistingCVPolygon(this.cvPoly.id);
            this.initVertexToolbar();
        };

        const removeVtxButton = this.createVertexButton('Remove Vertex');
        removeVtxButton.onclick = (e) => {
            e.preventDefault();
            this.cvPoly.removeVertex(parseInt(this.selectedVertex));
            this.initVertexToolbar();
            this.updateShape(this.cvPoly);
        };
    }

    private createVertexButton(text: string): HTMLButtonElement {
        const button = document.createElement('button') as HTMLButtonElement;
        button.textContent = text;

        this.vertexContainer.appendChild(button);

        return button;
    }

    private updatePosX(newPosX: number) {
        const diff = newPosX - this.cvPoly.pointList[0].x;
        this.cvPoly.pointList = this.cvPoly.pointList.map((vtx) => {
            vtx.x += diff;
            return vtx;
        });
        this.cvPoly.recalc();
        this.updateShape(this.cvPoly);
    }

    private updatePosY(newPosY: number) {
        const diff = newPosY - this.cvPoly.pointList[0].y;
        this.cvPoly.pointList = this.cvPoly.pointList.map((vtx, idx) => {
            vtx.y += diff;
            return vtx;
        });
        this.cvPoly.recalc();
        this.updateShape(this.cvPoly);
    }

    private getCurrentScale() {
        return this.currentScale;
    }

    private updateScale(newScale: number) {
        this.currentScale = newScale;
        this.cvPoly.pointList = this.cvPoly.pointList.map((vtx, idx) => {
            const rad = degToRad(getAngle(this.cvPoly.center, vtx));
            const cos = Math.cos(rad);
            const sin = Math.sin(rad);

            vtx.x =
                this.cvPoly.center.x +
                cos *
                    this.cvPoly.lenList[idx] *
                    (newScale / this.DEFAULT_SCALE);
            vtx.y =
                this.cvPoly.center.y -
                sin *
                    this.cvPoly.lenList[idx] *
                    (newScale / this.DEFAULT_SCALE);

            return vtx;
        });
        this.updateShape(this.cvPoly);
    }

    updateVertex(idx: number, x: number, y: number): void {
        this.cvPoly.pointList[idx].x = x;
        this.cvPoly.pointList[idx].y = y;
        this.cvPoly.recalc();

        this.updateShape(this.cvPoly);
    }
}
