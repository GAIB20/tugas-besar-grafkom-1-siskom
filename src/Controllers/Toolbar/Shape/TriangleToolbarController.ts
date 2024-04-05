import Square from "../../../Shapes/Square";
import AppCanvas from '../../../AppCanvas';
import BaseShape from '../../../Base/BaseShape';
import ShapeToolbarController from "./ShapeToolbarController";
import { degToRad, m3 } from "../../../utils";
import Triangle from "../../../Shapes/Triangle";


export default class TriangleToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    private lengthSlider: HTMLInputElement;
    private widthSlider: HTMLInputElement;
    private rotateSlider: HTMLInputElement;
    // private pointSlider: HTMLInputElement;

    private triangle: Triangle;

    constructor(triangle: Triangle, appCanvas: AppCanvas){
        super(triangle, appCanvas);
        this.triangle = triangle;

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
    }

    private updatePosX(newPosX:number){
        this.triangle.translation[0] = newPosX;
        this.updateShape(this.triangle);
    }

    private updatePosY(newPosY:number){
        this.triangle.translation[1] = newPosY;
        this.updateShape(this.triangle);
    }

    private updateLength(newSize:number){
        this.triangle.scale[0] = newSize/300;
        this.updateShape(this.triangle);
    }

    private updateWidth(newSize:number){
        this.triangle.scale[1] = newSize/300;
        this.updateShape(this.triangle);
    }

    private updateRotation(newRotation :number){
        this.triangle.angleInRadians = degToRad(newRotation);
        this.updateShape(this.triangle);
    }

    updateVertex(idx: number, x: number, y: number): void {
        const vertex = this.triangle.pointList[idx];
        const deltaX = x - vertex.x;
        const deltaY = y - vertex.y;

        const movementVector = [deltaX, deltaY, 1];
        // const inverseTransformationMatrix = m3.inverse(this.triangle.transformationMatrix);
        // if (!inverseTransformationMatrix) return;

        // const transformedMovement = m3.multiply3x1(inverseTransformationMatrix, movementVector);

        vertex.x += movementVector[0];
        vertex.y += movementVector[1];

        this.updateShape(this.triangle);
    }
}