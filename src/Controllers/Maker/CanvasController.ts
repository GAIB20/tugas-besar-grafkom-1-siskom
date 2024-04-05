import AppCanvas from '../../AppCanvas';
import CVPolygonMakerController from './Shape/CVPolygonMakerController';
import FanPolygonMakerController from './Shape/FanPolygonMakerController';
import { IShapeMakerController } from './Shape/IShapeMakerController';
import LineMakerController from './Shape/LineMakerController';
import RectangleMakerController from './Shape/RectangleMakerController';
import SquareMakerController from './Shape/SquareMakerController';

enum AVAIL_SHAPES {
    Line = 'Line',
    Rectangle = 'Rectangle',
    Square = 'Square',
    FanPoly = 'FanPoly',
    CVPoly = 'CVPoly',
}

export default class CanvasController {
    private _shapeController: IShapeMakerController;
    private canvasElmt: HTMLCanvasElement;
    private buttonContainer: HTMLDivElement;
    private colorPicker: HTMLInputElement;
    private appCanvas: AppCanvas;
    private setPolygonButton: HTMLButtonElement;
    toolbarOnClickCb: (() => void) | null = null;

    constructor(appCanvas: AppCanvas) {
        this.appCanvas = appCanvas;

        const canvasElmt = document.getElementById('c') as HTMLCanvasElement;
        const buttonContainer = document.getElementById(
            'shape-button-container'
        ) as HTMLDivElement;

        this.setPolygonButton = document.getElementById(
            'set-polygon'
        ) as HTMLButtonElement;

        this.canvasElmt = canvasElmt;
        this.buttonContainer = buttonContainer;

        this.setPolygonButton.classList.add('hidden');
        this._shapeController = new CVPolygonMakerController(appCanvas);

        this.colorPicker = document.getElementById(
            'shape-color-picker'
        ) as HTMLInputElement;

        this.canvasElmt.onclick = (e) => {
            const correctX = e.offsetX * window.devicePixelRatio;
            const correctY = e.offsetY * window.devicePixelRatio;
            this.shapeController?.handleClick(
                correctX,
                correctY,
                this.colorPicker.value
            );
            if (this.toolbarOnClickCb)
                this.toolbarOnClickCb()
        };
    }

    private get shapeController(): IShapeMakerController {
        return this._shapeController;
    }

    private set shapeController(v: IShapeMakerController) {
        this._shapeController = v;

        this.canvasElmt.onclick = (e) => {
            const correctX = e.offsetX * window.devicePixelRatio;
            const correctY = e.offsetY * window.devicePixelRatio;
            this.shapeController?.handleClick(
                correctX,
                correctY,
                this.colorPicker.value
            );
            if (this.toolbarOnClickCb)
                this.toolbarOnClickCb()
        };
    }

    private initController(shapeStr: AVAIL_SHAPES): IShapeMakerController {
        this.setPolygonButton.classList.add('hidden');
        switch (shapeStr) {
            case AVAIL_SHAPES.Line:
                return new LineMakerController(this.appCanvas);
            case AVAIL_SHAPES.Rectangle:
                return new RectangleMakerController(this.appCanvas);
            case AVAIL_SHAPES.Square:
                return new SquareMakerController(this.appCanvas);
            case AVAIL_SHAPES.FanPoly:
                return new FanPolygonMakerController(this.appCanvas);
            case AVAIL_SHAPES.CVPoly:
                return new CVPolygonMakerController(this.appCanvas);
            default:
                throw new Error('Incorrect shape string');
        }
    }

    editExistingFanPolygon(id: string) {
        this.shapeController = new FanPolygonMakerController(this.appCanvas);
        (this.shapeController as FanPolygonMakerController).setCurrentPolygon(id);
    }

    editExistingCVPolygon(id: string) {
        this.shapeController = new CVPolygonMakerController(this.appCanvas);
        (this.shapeController as CVPolygonMakerController).setCurrentPolygon(id);
    }

    start() {
        for (const shapeStr in AVAIL_SHAPES) {
            const button = document.createElement('button');
            button.classList.add('shape-button');
            button.textContent = shapeStr;
            button.onclick = () => {
                this.shapeController = this.initController(
                    shapeStr as AVAIL_SHAPES
                );
            };
            this.buttonContainer.appendChild(button);
        }
    }
}
