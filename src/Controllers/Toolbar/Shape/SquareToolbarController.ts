import Square from "../../../Shapes/Square";
import AppCanvas from '../../../AppCanvas';
import BaseShape from '../../../Base/BaseShape';
import ShapeToolbarController from "./ShapeToolbarController";
import { degToRad, euclideanDistanceVtx, m3 } from "../../../utils";


export default class SquareToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    private sizeSlider: HTMLInputElement;
    private rotateSlider: HTMLInputElement;
    // private pointSlider: HTMLInputElement;
    private initialRotationValue: number = 0;

    private square: Square;

    constructor(square: Square, appCanvas: AppCanvas){
        super(square, appCanvas);
        this.square = square;

        this.posXSlider = this.createSlider('Position X', () => square.center.x,1,appCanvas.width);
        this.registerSlider(this.posXSlider, (e) => {this.updatePosX(parseInt(this.posXSlider.value))})

        this.posYSlider = this.createSlider('Position Y', () => square.center.y,1,appCanvas.width);
        this.registerSlider(this.posYSlider, (e) => {this.updatePosY(parseInt(this.posYSlider.value))})

        this.sizeSlider = this.createSlider('Size', () => square.size, 1, appCanvas.width);
        this.registerSlider(this.sizeSlider, (e) => {this.updateSize(parseInt(this.sizeSlider.value))})

        this.rotateSlider = this.createSlider('Rotation', () => 0, -180, 180);
        this.registerSlider(this.rotateSlider, (e) => {this.handleRotationEnd})
        this.rotateSlider.addEventListener('mousedown', this.handleRotationStart.bind(this));
        this.rotateSlider.addEventListener('touchstart', this.handleRotationStart.bind(this));
        this.rotateSlider.addEventListener('mouseup', this.handleRotationEnd.bind(this));
        this.rotateSlider.addEventListener('touchend', this.handleRotationEnd.bind(this));
    }

    private updatePosX(newPosX:number){
        const diff = newPosX - this.square.center.x;
        for (let i = 0; i < 4; i++) {
            this.square.pointList[i].x += diff;
        }
        this.square.recalculate();
        this.updateShape(this.square);
    }

    private updatePosY(newPosY:number){
        const diff = newPosY - this.square.center.y;
        for (let i = 0; i < 4; i++) {
            this.square.pointList[i].y += diff;
        }
        this.square.recalculate();
        this.updateShape(this.square);
    }

    private updateSize(newSize: number) {
        const halfNewSize = newSize / 2;
        const angle = this.square.angleInRadians;

        const offsets = [
            { x: -halfNewSize, y: -halfNewSize }, // Top left
            { x: halfNewSize, y: -halfNewSize },  // Top right
            { x: halfNewSize, y: halfNewSize },   // Bottom right
            { x: -halfNewSize, y: halfNewSize },  // Bottom left
        ];
    
        for (let i = 0; i < 4; i++) {
            const offset = offsets[i];
            this.square.pointList[i] = {
                x: this.square.center.x + offset.x * Math.cos(angle) - offset.y * Math.sin(angle),
                y: this.square.center.y + offset.x * Math.sin(angle) + offset.y * Math.cos(angle),
                c: this.square.pointList[i].c
            };
        }
    
        this.square.size = newSize;
        this.square.recalculate();
        this.updateShape(this.square);
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
        this.square.angleInRadians = degToRad(deltaRotation);
        this.square.setTransformationMatrix();
        this.square.updatePointListWithTransformation();
        this.updateShape(this.square);
    }

    updateVertex(idx: number, x: number, y: number): void {
        // const opposite = (idx+2)%4;
        // const newSquare = new Square(this.square.id, this.square.color, this.square.pointList[opposite].x, this.square.pointList[opposite].y,)
       
    }
}