import AppCanvas from '../../AppCanvas';
import { IShapeMakerController } from './Shape/IShapeMakerController';
import LineMakerController from './Shape/LineMakerController';
import RectangleMakerController from './Shape/RectangleMakerController';
import SquareMakerController from './Shape/SquareMakerController';

enum AVAIL_SHAPES {
    Line = "Line",
    Rectangle = "Rectangle",
    Square = "Square"
}

export default class CanvasController {
    private _shapeController: IShapeMakerController;
    private canvasElmt: HTMLCanvasElement;
    private buttonContainer: HTMLDivElement;
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

        this.canvasElmt.onclick = (e) => {
            const rect = this.canvasElmt.getBoundingClientRect();
            const scaleX = this.canvasElmt.width / rect.width;
            const scaleY = this.canvasElmt.height / rect.height;

            const correctX = (e.clientX - rect.left) * scaleX;
            const correctY = (e.clientY - rect.top) * scaleY;
            console.log(canvasElmt.width, canvasElmt.height);
            console.log(canvasElmt.getBoundingClientRect().width, canvasElmt.getBoundingClientRect().height);
         
            this.shapeController?.handleClick(correctX, correctY);
        };
    }

    private get shapeController(): IShapeMakerController {
        return this._shapeController;
    }

    private set shapeController(v: IShapeMakerController) {
        this._shapeController = v;

        this.canvasElmt.onclick = (e) => {
            const rect = this.canvasElmt.getBoundingClientRect();
            const scaleX = this.canvasElmt.width / rect.width;
            const scaleY = this.canvasElmt.height / rect.height;

            const correctX = (e.clientX - rect.left) * scaleX; 
            const correctY = (e.clientY - rect.top) * scaleY;


            console.log("a ", this.canvasElmt.width, this.canvasElmt.height);

            console.log("b", this.canvasElmt.getBoundingClientRect().width, this.canvasElmt.getBoundingClientRect().height);

            this.shapeController?.handleClick(correctX, correctY);
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
                this.shapeController = this.initController(shapeStr as AVAIL_SHAPES);
            };
            this.buttonContainer.appendChild(button);
        }
    }

}
