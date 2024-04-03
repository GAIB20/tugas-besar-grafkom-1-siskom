import AppCanvas from '../../../AppCanvas';
import Rectangle from '../../../Shapes/Rectangle';
import { degToRad, euclideanDistanceVtx, getAngle } from '../../../utils';
import ShapeToolbarController from './ShapeToolbarController';

export default class RectangleToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    // private widthSlider: HTMLInputElement;
    // private lengthSlider: HTMLInputElement;
    private rotateSlider: HTMLInputElement;

    private rectangle: Rectangle;

    constructor(rectangle: Rectangle, appCanvas: AppCanvas){
        super(rectangle, appCanvas);
        this.rectangle = rectangle;

        // X Position
        this.posXSlider = this.createSlider('Position X', () => rectangle.center.x,1,appCanvas.width);
        this.registerSlider(this.posXSlider, (e) => {this.updatePosX(parseInt(this.posXSlider.value))})

        // Y Position
        this.posYSlider = this.createSlider('Position Y', () => rectangle.center.y,1,appCanvas.width);
        this.registerSlider(this.posYSlider, (e) => {this.updatePosY(parseInt(this.posYSlider.value))})

        // Rotation
        this.rotateSlider = this.createSlider('Rotation', this.currentAngle.bind(this), 0, 360);
        this.registerSlider(this.rotateSlider, (e) => {this.updateRotation(parseInt(this.rotateSlider.value))})

    }

    private updatePosX(newPosX:number){
        const diff = newPosX - this.rectangle.center.x;
        for (let i = 0; i < 4; i++) {
            this.rectangle.pointList[i].x += diff;
        }
        this.recalculateCenter();
        this.updateShape(this.rectangle);
    }

    private updatePosY(newPosY:number){
        const diff = newPosY - this.rectangle.center.y;
        for (let i = 0; i < 4; i++) {
            this.rectangle.pointList[i].y += diff;
        }
        this.recalculateCenter();
        this.updateShape(this.rectangle);
    }

    updateVertex(idx: number, x: number, y: number): void {
        const diffy = y - this.rectangle.pointList[idx].y;
        const diffx = x - this.rectangle.pointList[idx].x;

        for (let i = 0; i < 4; i++) {
            if (i != idx) {
                this.rectangle.pointList[i].y += diffy;
                this.rectangle.pointList[i].x += diffx;
            }
        }

        this.rectangle.pointList[idx].x = x;
        this.rectangle.pointList[idx].y = y;

        this.recalculateCenter();
        this.updateShape(this.rectangle);
    }
    
    private recalculateCenter(): void {
        let sumX = 0, sumY = 0;
        const vertices = this.rectangle.pointList;
        vertices.forEach(vertex => {
            sumX += vertex.x;
            sumY += vertex.y;
        });
        this.rectangle.center.x = sumX / vertices.length;
        this.rectangle.center.y = sumY / vertices.length;
    }

    private currentAngle() {
        return getAngle(this.rectangle.pointList[0], this.rectangle.pointList[1]);
    }

    private updateRotation(newRot: number){
        const rotRadians = newRot * Math.PI / 180;
        // Convert rotation difference to radians
    
        const centerX = this.rectangle.center.x;
        const centerY = this.rectangle.center.y;
    
        this.rectangle.pointList = this.rectangle.pointList.map(vertex => {
            const x = vertex.x - centerX;
            const y = vertex.y - centerY;
    
            // Apply rotation formula
            const newX = x * Math.cos(rotRadians) - y * Math.sin(rotRadians) + centerX;
            const newY = x * Math.sin(rotRadians) + y * Math.cos(rotRadians) + centerY;
    
            return { ...vertex, x: newX, y: newY }; // Assuming you can use a similar structure or class method to update vertices
        });
    
        // No need to recalculate the center since rotation doesn't affect it
        this.updateShape(this.rectangle); // Update the canvas with the new rectangle position
    }
}