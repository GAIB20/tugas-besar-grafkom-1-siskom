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
        this.updateVertexPreserveRectangle(idx, x,y);
        // const centerX = (this.rectangle.initialPoint[0] + this.rectangle.endPoint[0]) / 2;
        // const centerY = (this.rectangle.initialPoint[1] + this.rectangle.endPoint[1]) / 2;
    
        // let translatedX = x - centerX;
        // let translatedY = y - centerY;
    
        // const angle = this.rectangle.angleInRadians; // Inverse rotation angle
        // const dx = translatedX * Math.cos(angle) - translatedY * Math.sin(angle);
        // const dy = translatedX * Math.sin(angle) + translatedY * Math.cos(angle);
    
        // const originalX = dx + centerX;
        // const originalY = dy + centerY;

        // const movementX = originalX - this.rectangle.pointList[idx].x;
        // const movementY = originalY - this.rectangle.pointList[idx].y;
        // // console.log("x:" , movementX);
        // // console.log("y:" ,movementY);
    
        // this.rectangle.pointList[idx].x += movementX;
        // this.rectangle.pointList[idx].y += movementY;

        // const adjacentVertices = [0, 1, 2, 3].filter(i => i !== idx && i !== this.rectangle.findOpposite(idx));

        // const pointList = this.rectangle.pointList;
        // const cwAdjacentIdx = this.rectangle.findCWAdjacent(idx);
        // const ccwAdjacentIdx = this.rectangle.findCCWAdjacent(idx);

        // const oppositeIdx = this.rectangle.findOpposite(idx);

        // const oppositePointX = pointList[oppositeIdx].x;
        // const oppositePointY = pointList[oppositeIdx].y;

        // // To avoid stuck
        // adjacentVertices.forEach(vertexIdx => {
        //     if (vertexIdx === cwAdjacentIdx || vertexIdx === ccwAdjacentIdx) {
        //         const vertexPoint = pointList[vertexIdx];

        //         if (vertexPoint.x === oppositePointX && vertexPoint.y === oppositePointY) {
        //             if (Math.abs(movementX) > Math.abs(movementY)) {
        //                 vertexPoint.x += movementX;
        //             } else {
        //                 vertexPoint.y += movementY;
        //             }
        //         } else {
        //             if (vertexPoint.x !== oppositePointX) {
        //                 vertexPoint.x += movementX;
        //             }
        //             if (vertexPoint.y !== oppositePointY) {
        //                 vertexPoint.y += movementY;
        //             }
        //         }
        //     }
        // });

        // this.rectangle.recalculate();
        this.updateShape(this.rectangle);
    }
    
    updateVertexPreserveRectangle(movedVertexIdx: number, newX: number, newY: number): void {
        const movedVertex = this.rectangle.pointList[movedVertexIdx];
        const dx = newX - movedVertex.x;
        const dy = newY - movedVertex.y;

        movedVertex.x = newX;
        movedVertex.y = newY;
        const ccwAdjacentIdx = this.rectangle.findCWAdjacent(movedVertexIdx);
        const cwAdjacentIdx = this.rectangle.findCCWAdjacent(movedVertexIdx);

        if (movedVertexIdx % 2 === 0) {
            this.rectangle.pointList[cwAdjacentIdx].x += dx;
            this.rectangle.pointList[ccwAdjacentIdx].y += dy;
        } else {
            this.rectangle.pointList[cwAdjacentIdx].y += dy;
            this.rectangle.pointList[ccwAdjacentIdx].x += dx;
        }
        this.rectangle.recalculate()
    }
}