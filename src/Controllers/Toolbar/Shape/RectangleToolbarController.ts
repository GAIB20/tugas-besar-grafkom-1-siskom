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
        this.rectangle.scale[0] = newLength/300;
        this.updateShape(this.rectangle);
    }

    private updateWidth(newWidth:number){
        this.rectangle.scale[1] = newWidth/300;
        this.updateShape(this.rectangle);
    }

    private updateRotation(newRotation :number){
        this.rectangle.angleInRadians = degToRad(newRotation);
        console.log("rotation: ", newRotation);
        this.updateShape(this.rectangle);
    }

    updateVertex(idx: number, x: number, y: number): void{
            // Center of the rectangle
            const centerX = (this.rectangle.initialPoint[0] + this.rectangle.endPoint[0]) / 2;
            const centerY = (this.rectangle.initialPoint[1] + this.rectangle.endPoint[1]) / 2;
        
            let translatedX = x - centerX;
            let translatedY = y - centerY;
        
            const angle = -this.rectangle.angleInRadians; // Inverse rotation angle
            const dx = translatedX * Math.cos(angle) - translatedY * Math.sin(angle);
            console.log(dx);
            const dy = translatedX * Math.sin(angle) + translatedY * Math.cos(angle);
        
            const originalX = dx + centerX;
            const originalY = dy + centerY;

            const movementX = originalX - this.rectangle.pointList[idx].x;
            const movementY = originalY - this.rectangle.pointList[idx].y;
        
            this.rectangle.pointList[idx].x += movementX;
            this.rectangle.pointList[idx].y += movementY;
        
            const ccwIdx = this.rectangle.findCCWAdjacent(idx);
            const cwIdx = this.rectangle.findCWAdjacent(idx);
            const opposite = this.rectangle.findOpposite(idx);

            this.rectangle.pointList[ccwIdx].x += movementX;
            // this.rectangle.pointList[ccwIdx].y += movementY;
            // this.rectangle.pointList[cwIdx].x += movementX;
            this.rectangle.pointList[cwIdx].y += movementY;

            // console.log("idx", idx);
            // console.log("ccw:" , ccwIdx);
            // console.log("cw" , cwIdx)

            // const newRect = new Rectangle(
            //     this.rectangle.id,
            //     this.rectangle.color,
            //     this.rectangle.pointList[opposite].x,
            //     this.rectangle.pointList[opposite].y,
            //     this.rectangle.pointList[idx].x,
            //     this.rectangle.pointList[idx].y,
            //     0,
            //     1,
            //     1,
            //     m3.identity()
            // )
        
            // this.rectangle = newRect;

            this.updateShape(this.rectangle);
        }
        
    

    public updateVertexTest(idx: number, x: number, y: number): void {
            // Center of the rectangle
            const centerX = (this.rectangle.initialPoint[0] + this.rectangle.endPoint[0]) / 2;
            const centerY = (this.rectangle.initialPoint[1] + this.rectangle.endPoint[1]) / 2;
        
            let translatedX = x - centerX;
            let translatedY = y - centerY;
        
            const angle = -this.rectangle.angleInRadians; // Inverse rotation angle
            const dx = translatedX * Math.cos(angle) - translatedY * Math.sin(angle);
            console.log(dx);
            const dy = translatedX * Math.sin(angle) + translatedY * Math.cos(angle);
        
            const originalX = dx + centerX;
            const originalY = dy + centerY;

            const movementX = originalX - this.rectangle.pointList[idx].x;
            const movementY = originalY - this.rectangle.pointList[idx].y;
        
            this.rectangle.pointList[idx].x += movementX;
            this.rectangle.pointList[idx].y += movementY;
        
            const ccwIdx = this.rectangle.findCCWAdjacent(idx);
            const cwIdx = this.rectangle.findCWAdjacent(idx);

            this.rectangle.pointList[ccwIdx].x += movementX;
            this.rectangle.pointList[ccwIdx].y += movementY;
            this.rectangle.pointList[cwIdx].x += movementX;
            this.rectangle.pointList[cwIdx].y += movementY;

            console.log("idx", idx);
            console.log("ccw:" , ccwIdx);
            console.log("cw" , cwIdx)
        
            this.updateShape(this.rectangle);
    }

}