import AppCanvas from '../../../AppCanvas';
import Vertex from '../../../Base/Vertex';
import Rectangle from '../../../Shapes/Rectangle';
import { degToRad, euclideanDistanceVtx, getAngle, m3 } from '../../../utils';
import ShapeToolbarController from './ShapeToolbarController';

export default class RectangleToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    private widthSlider: HTMLInputElement;
    private lengthSlider: HTMLInputElement;
    private rotateSlider: HTMLInputElement;
    // private pointSlider: HTMLInputElement;

    private rectangle: Rectangle;

    constructor(rectangle: Rectangle, appCanvas: AppCanvas){
        super(rectangle, appCanvas);
        this.rectangle = rectangle;

        this.posXSlider = this.createSlider('Position X', () => parseInt(this.posXSlider.value),-0.5*appCanvas.width,0.5*appCanvas.width);
        this.registerSlider(this.posXSlider, (e) => {this.updatePosX(parseInt(this.posXSlider.value))})

        this.posYSlider = this.createSlider('Position Y', () => (parseInt(this.posYSlider.value)),-0.5*appCanvas.width,0.5*appCanvas.width);
        this.registerSlider(this.posYSlider, (e) => {this.updatePosY(parseInt(this.posYSlider.value))})

        this.lengthSlider = this.createSlider('Length', () => parseInt(this.lengthSlider.value), 150,450);
        this.registerSlider(this.lengthSlider, (e) => {this.updateLength(parseInt(this.lengthSlider.value))})

        this.widthSlider = this.createSlider('Width', () => parseInt(this.widthSlider.value), 150,450);
        this.registerSlider(this.widthSlider, (e) => {this.updateWidth(parseInt(this.widthSlider.value))})

        this.rotateSlider = this.createSlider('Rotation', () => parseInt(this.rotateSlider.value), -360, 360);
        this.registerSlider(this.rotateSlider, (e) => {this.updateRotation(parseInt(this.rotateSlider.value))})

        // this.pointSlider = this.createSlider('Point', () => parseInt(this.pointSlider.value), -100, 100);
        // this.registerSlider(this.pointSlider, (e) => {this.updatePointX(parseInt(this.pointSlider.value))})

    }

    private updatePosX(newPosX:number){
        this.rectangle.translation[0] = newPosX;
        this.updateShape(this.rectangle);
    }

    private updatePosY(newPosY:number){
        this.rectangle.translation[1] = newPosY;
        this.updateShape(this.rectangle);
    }

    private updateLength(newLength:number){
        this.rectangle.scaleX = newLength/300;
        this.updateShape(this.rectangle);
    }

    private updateWidth(newWidth:number){
        this.rectangle.scaleY = newWidth/300;
        this.updateShape(this.rectangle);
    }

    private updateRotation(newRotation :number){
        this.rectangle.angleInRadians = degToRad(newRotation);
        this.updateShape(this.rectangle);
    }

    // private updatePointX(newPointX: number){
    //     const newRec = new Rectangle(this.rectangle.id, this.rectangle.color, this.rectangle.initialPoint[0], this.rectangle.initialPoint[1], this.rectangle.endPoint[0] = newPointX, this.rectangle.endPoint[1], this.rectangle.angleInRadians)
    //     // this.rectangle.targetPoint[0] = newPointX;
    //     this.rectangle = newRec
    //     this.updateShape(this.rectangle);
    // }

    // private updatePoints(idx: number){
    //     const point = [this.rectangle.pointList[idx].x, this.rectangle.pointList[idx].y, 1];
    //     const res = m3.multiply3x1(this.rectangle.transformationMatrix, point)
    //     this.rectangle.pointList[idx].x = res[0];
    //     this.rectangle.pointList[idx].y = res[1];
    //     this.updateShape(this.rectangle);
    // }



    updateVertex(idx: number, x: number, y: number): void {
        // const diffy = y - this.rectangle.pointList[idx].y;
        // const diffx = x - this.rectangle.pointList[idx].x;

        // for (let i = 0; i < 4; i++) {
        //     if (i != idx) {
        //         this.rectangle.pointList[i].y += diffy;
        //         this.rectangle.pointList[i].x += diffx;
        //     }
        // }

        // this.rectangle.pointList[idx].x = x;
        // this.rectangle.pointList[idx].y = y;

        // // this.recalculateCenter();
        // this.updateShape(this.rectangle);
    }


    private currentAngle() {
        return getAngle(this.rectangle.pointList[0], this.rectangle.pointList[1]);
    }

    
}