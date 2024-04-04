import Square from "../../../Shapes/Square";
import AppCanvas from '../../../AppCanvas';
import BaseShape from '../../../Base/BaseShape';
import ShapeToolbarController from "./ShapeToolbarController";
import { degToRad } from "../../../utils";


export default class SquareToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    private sizeSlider: HTMLInputElement;
    private rotateSlider: HTMLInputElement;
    // private pointSlider: HTMLInputElement;

    private square: Square;

    constructor(square: Square, appCanvas: AppCanvas){
        super(square, appCanvas);
        this.square = square;

        this.posXSlider = this.createSlider('Position X', () => parseInt(this.posXSlider.value),-0.5*appCanvas.width,0.5*appCanvas.width);
        this.registerSlider(this.posXSlider, (e) => {this.updatePosX(parseInt(this.posXSlider.value))})

        this.posYSlider = this.createSlider('Position Y', () => (parseInt(this.posYSlider.value)),-0.5*appCanvas.width,0.5*appCanvas.width);
        this.registerSlider(this.posYSlider, (e) => {this.updatePosY(parseInt(this.posYSlider.value))})

        this.sizeSlider = this.createSlider('Size', () => parseInt(this.sizeSlider.value), 150,450);
        this.registerSlider(this.sizeSlider, (e) => {this.updateSize(parseInt(this.sizeSlider.value))})

        this.rotateSlider = this.createSlider('Rotation', () => parseInt(this.rotateSlider.value), -360, 360);
        this.registerSlider(this.rotateSlider, (e) => {this.updateRotation(parseInt(this.rotateSlider.value))})


    }

    private updatePosX(newPosX:number){
        this.square.translation[0] = newPosX;
        this.updateShape(this.square);
    }

    private updatePosY(newPosY:number){
        this.square.translation[1] = newPosY;
        this.updateShape(this.square);
    }

    private updateSize(newSize:number){
        this.square.scale[0] = newSize/300;
        this.square.scale[1] = newSize/300;
        this.updateShape(this.square);
    }

    private updateRotation(newRotation :number){
        this.square.angleInRadians = degToRad(newRotation);
        this.updateShape(this.square);
    }

    updateVertex(idx: number, x: number, y: number): void {
        
    }
}