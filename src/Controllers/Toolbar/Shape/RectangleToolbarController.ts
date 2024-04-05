import AppCanvas from '../../../AppCanvas';
import Color from '../../../Base/Color';
import Vertex from '../../../Base/Vertex';
import Rectangle from '../../../Shapes/Rectangle';
import { degToRad, euclideanDistanceVtx, getAngle, hexToRgb, m3, radToDeg, rgbToHex } from '../../../utils';
import ShapeToolbarController from './ShapeToolbarController';

export default class RectangleToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    private widthSlider: HTMLInputElement;
    private lengthSlider: HTMLInputElement;
    private rotateSlider: HTMLInputElement;

    private rectangle: Rectangle;
    private initialRotationValue: number = 0;

    constructor(rectangle: Rectangle, appCanvas: AppCanvas){
        super(rectangle, appCanvas);
        this.rectangle = rectangle;

        // X Position
        this.posXSlider = this.createSlider('Position X', () => rectangle.center.x,1,appCanvas.width);
        this.registerSlider(this.posXSlider, (e) => {this.updatePosX(parseInt(this.posXSlider.value))})

        // Y Position
        this.posYSlider = this.createSlider('Position Y', () => rectangle.center.y,1,appCanvas.width);
        this.registerSlider(this.posYSlider, (e) => {this.updatePosY(parseInt(this.posYSlider.value))})

        this.lengthSlider = this.createSlider('Length', () => rectangle.length, 1, appCanvas.width);
        this.registerSlider(this.lengthSlider, (e) => {this.updateLength(parseInt(this.lengthSlider.value))})

        this.widthSlider = this.createSlider('Width', () => this.rectangle.width, 1, appCanvas.width);
        this.registerSlider(this.widthSlider, (e) => {this.updateWidth(parseInt(this.widthSlider.value))})

        this.rotateSlider = this.createSlider('Rotation', () => 0, -180, 180);
        this.registerSlider(this.rotateSlider, (e) => {this.handleRotationEnd})
        this.rotateSlider.addEventListener('mousedown', this.handleRotationStart.bind(this));
        this.rotateSlider.addEventListener('touchstart', this.handleRotationStart.bind(this));
        this.rotateSlider.addEventListener('mouseup', this.handleRotationEnd.bind(this));
        this.rotateSlider.addEventListener('touchend', this.handleRotationEnd.bind(this));
    }

    private updatePosX(newPosX:number){
        const diff = newPosX - this.rectangle.center.x;
        for (let i = 0; i < 4; i++) {
            this.rectangle.pointList[i].x += diff;
        }
        this.rectangle.recalculate();
        this.updateShape(this.rectangle);
    }

    private updatePosY(newPosY:number){
        const diff = newPosY - this.rectangle.center.y;
        for (let i = 0; i < 4; i++) {
            this.rectangle.pointList[i].y += diff;
        }
        this.rectangle.recalculate();
        this.updateShape(this.rectangle);
    }

    private updateLength(newLength:number){

        this.rectangle.angleInRadians = -this.rectangle.angleInRadians;
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();

        const currentLength = euclideanDistanceVtx(this.rectangle.pointList[0], this.rectangle.pointList[1]);
        
        const scaleFactor = newLength / currentLength;
        for(let i=1; i<4; i++){
            this.rectangle.pointList[i].x = this.rectangle.pointList[0].x + (this.rectangle.pointList[i].x - this.rectangle.pointList[0].x) * scaleFactor;
        }

        this.rectangle.angleInRadians = -this.rectangle.angleInRadians;
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();

        // this.rectangle.angleInRadians = 0;

        this.updateShape(this.rectangle);
    }

    private updateWidth(newWidth:number){
        this.rectangle.angleInRadians = -this.rectangle.angleInRadians;
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();

        const currentWidth = euclideanDistanceVtx(this.rectangle.pointList[1], this.rectangle.pointList[3]);
        
        const scaleFactor = newWidth / currentWidth;
        for(let i=1; i<4; i++){
            if (i != 1)
                this.rectangle.pointList[i].y = this.rectangle.pointList[1].y + (this.rectangle.pointList[i].y - this.rectangle.pointList[1].y) * scaleFactor;
        }
        this.rectangle.angleInRadians = -this.rectangle.angleInRadians;
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();
        // this.rectangle.angleInRadians = 0;
        this.updateShape(this.rectangle);
    }

    private handleRotationStart(e: Event) {
        this.initialRotationValue = parseInt(this.rotateSlider.value);
    }

    private handleRotationEnd(e: Event) {
        let finalRotationValue = parseInt(this.rotateSlider.value);
        let deltaRotation = finalRotationValue - this.initialRotationValue;
        this.updateRotation(this.initialRotationValue, deltaRotation);
    }

    private updateRotation(initialRotation: number, deltaRotation: number){
        this.rectangle.angleInRadians = degToRad(deltaRotation);
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();
        this.updateShape(this.rectangle);
    }

    updateVertex(idx: number, x: number, y: number): void{
        const movedVertex = this.rectangle.pointList[idx];
        const dx = x - movedVertex.x;
        const dy = y - movedVertex.y;

        movedVertex.x = x;
        movedVertex.y = y;
        const cwAdjacentIdx = this.rectangle.findCWAdjacent(idx);
        const ccwAdjacentIdx = this.rectangle.findCCWAdjacent(idx);

        if (idx % 2 === 0) {
            this.rectangle.pointList[cwAdjacentIdx].x += dx;
            this.rectangle.pointList[ccwAdjacentIdx].y += dy;
        } else {
            this.rectangle.pointList[cwAdjacentIdx].y += dy;
            this.rectangle.pointList[ccwAdjacentIdx].x += dx;
        }

        this.rectangle.recalculate()
       
        this.updateShape(this.rectangle);
    }
    
}