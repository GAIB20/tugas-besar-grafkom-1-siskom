import AppCanvas from '../../../AppCanvas';
import Vertex from '../../../Base/Vertex';
import Rectangle from '../../../Shapes/Rectangle';
import { degToRad, euclideanDistanceVtx, getAngle, m3 } from '../../../utils';
import ShapeToolbarController from './ShapeToolbarController';

export default class RectangleToolbarController extends ShapeToolbarController {
    private posXSlider: HTMLInputElement;
    private posYSlider: HTMLInputElement;
    // private widthSlider: HTMLInputElement;
    private lengthSlider: HTMLInputElement;
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
        this.lengthSlider = this.createSlider('Length', () => rectangle.length, 1, appCanvas.width);
        this.registerSlider(this.lengthSlider, (e) => {this.updateRotation(parseInt(this.rotateSlider.value))})

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
        const angleInRadians = degToRad(newRot);
        const rotationDifference = angleInRadians - this.rectangle.angleInRadians;

        let matrix = m3.identity();
    
        matrix = m3.translate(matrix, -this.rectangle.center.x, -this.rectangle.center.y);
        matrix = m3.rotate(matrix, rotationDifference);
        matrix = m3.translate(matrix, this.rectangle.center.x, this.rectangle.center.y);

        this.rectangle.angleInRadians = angleInRadians;
        this.recalculateCenter()
        this.applyTransformationMatrixToRectangle(matrix);
 
        // this.updateShape(this.rectangle);
        // this.rectangle.setRotation(newRot);
        this.updateShape(this.rectangle);
    }

    private updateLength(newLength: number) {
        const currentLength = this.rectangle.length;
        const scaleFactor = newLength / currentLength;
        const currentScaleX = 1;
        const newScaleY = scaleFactor;
    
        let matrix = m3.identity();
    
        matrix = m3.translate(matrix, -this.rectangle.center.x, -this.rectangle.center.y);
        matrix = m3.scale(matrix, currentScaleX, newScaleY);
        matrix = m3.translate(matrix, this.rectangle.center.x, this.rectangle.center.y);
    
        this.applyTransformationMatrixToRectangle(matrix);
 
        this.updateShape(this.rectangle);
    }

    private applyTransformationMatrixToRectangle(matrix: number[]) {
        this.rectangle.pointList = this.rectangle.pointList.map(vertex => {
            const vertexHomogeneous = [vertex.x, vertex.y, 1];
    
            const transformedVertex = [
                matrix[0] * vertexHomogeneous[0] + matrix[3] * vertexHomogeneous[1] + matrix[6] * vertexHomogeneous[2],
                matrix[1] * vertexHomogeneous[0] + matrix[4] * vertexHomogeneous[1] + matrix[7] * vertexHomogeneous[2],
                matrix[2] * vertexHomogeneous[0] + matrix[5] * vertexHomogeneous[1] + matrix[8] * vertexHomogeneous[2]
            ];
            return new Vertex(transformedVertex[0], transformedVertex[1]);
        });
        this.recalculateRectangleProperties();
    }
    
    private recalculateRectangleProperties() {

    }
    

    
}