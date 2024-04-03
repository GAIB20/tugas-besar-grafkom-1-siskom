import AppCanvas from '../../AppCanvas';
import { IShapeMakerController } from './Shape/IShapeMakerController';
import LineMakerController from './Shape/LineMakerController';
import RectangleMakerController from './Shape/RectangleMakerController';
import SquareMakerController from './Shape/SquareMakerController';

enum AVAIL_SHAPES {
    Line = 'Line',
    Rectangle = 'Rectangle',
    Square = 'Square',
}

export default class CanvasController {
    private _shapeController: IShapeMakerController;
    private canvasElmt: HTMLCanvasElement;
    private buttonContainer: HTMLDivElement;
    private colorPicker: HTMLInputElement;
    private appCanvas: AppCanvas;

    constructor(appCanvas: AppCanvas) {
        this.appCanvas = appCanvas;

        const canvasElmt = document.getElementById('c') as HTMLCanvasElement;
        const buttonContainer = document.getElementById(
            'shape-button-container'
        ) as HTMLDivElement;

        this.canvasElmt = canvasElmt;
        this.buttonContainer = buttonContainer;

        this._shapeController = new LineMakerController(appCanvas);

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
            this.shapeController?.handleClick(correctX, correctY ,this.colorPicker.value);
        };
    }

    private initController(shapeStr: AVAIL_SHAPES): IShapeMakerController {
        switch (shapeStr) {
            case AVAIL_SHAPES.Line:
                return new LineMakerController(this.appCanvas);
            case AVAIL_SHAPES.Rectangle:
                return new RectangleMakerController(this.appCanvas);
            case AVAIL_SHAPES.Square:
                return new SquareMakerController(this.appCanvas);
            default:
                throw new Error('Incorrect shape string');
        }
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
