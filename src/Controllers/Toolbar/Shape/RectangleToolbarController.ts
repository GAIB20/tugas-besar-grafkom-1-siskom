import AppCanvas from '../../../AppCanvas';
import Rectangle from '../../../Shapes/Rectangle';
import { degToRad, euclideanDistanceVtx, getAngle } from '../../../utils';
import ShapeToolbarController from './ShapeToolbarController';

export default class RectangleToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    // private widthSlider: HTMLInputElement;
    // private lengthSlider: HTMLInputElement;
    // private rotateSlider: HTMLInputElement;

    private rectangle: Rectangle;

    constructor(rectangle: Rectangle, appCanvas: AppCanvas){
        super(rectangle, appCanvas);
        this.rectangle = rectangle;

        // X Position
        this.posXSlider = this.createSlider('Position X', rectangle.center.x,1,appCanvas.width);
        this.registerSlider(this.posXSlider, (e) => {this.updatePosX(parseInt(this.posXSlider.value))})

        // Y Position
        this.posYSlider = this.createSlider('Position Y', rectangle.center.y,1,appCanvas.width);
        this.registerSlider(this.posYSlider, (e) => {this.updatePosY(parseInt(this.posYSlider.value))})

    }

    private updatePosX(newPosX:number){
        const diff = newPosX - this.rectangle.center.x;
        this.rectangle.center.x = newPosX;
        for (let i = 0; i < 4; i++) {
            this.rectangle.pointList[i].x = this.rectangle.pointList[i].x + diff;
        }
        this.updateShape(this.rectangle);
    }

    private updatePosY(newPosY:number){
        const diff = newPosY - this.rectangle.center.y;
        this.rectangle.center.y = newPosY;
        for (let i = 0; i < 4; i++) {
            this.rectangle.pointList[i].y = this.rectangle.pointList[i].y + diff;
        }
        this.updateShape(this.rectangle);
    }
}