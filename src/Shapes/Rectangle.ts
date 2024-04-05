import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";
import { degToRad, m3 } from "../utils";

export default class Rectangle extends BaseShape {
    
    length: number;
    width: number;
    initialPoint: number[];
    endPoint: number[];
    targetPoint: number[];


    constructor(id: string, color: Color, startX: number, startY: number, endX: number, endY: number, angleInRadians: number, scaleX: number = 1, scaleY: number = 1, transformation: number[] = m3.identity()) {
        super(5, id, color);
        
        const x1 = startX;
        const y1 = startY;
        const x2 = endX;
        const y2 = startY;
        const x3 = startX;
        const y3 = endY;
        const x4 = endX;
        const y4 = endY;

        this.transformationMatrix = transformation;

        this.angleInRadians = angleInRadians;
        this.scale = [scaleX, scaleY];
        this.initialPoint = [startX, startY, 1];
        this.endPoint = [endX, endY, 1];
        this.targetPoint = [0,0, 1];
        this.length = x2-x1;
        this.width = y3-y1;

        const centerX = (x1 + x4) / 2;
        const centerY = (y1 + y4) / 2;
        const center = new Vertex(centerX, centerY, color);
        this.center = center;

        this.pointList.push(new Vertex(x1, y1, color), new Vertex(x2, y2, color), new Vertex(x3, y3, color), new Vertex(x4, y4, color));
        this.bufferTransformationList = this.pointList;
    }

    override setTransformationMatrix(){
        super.setTransformationMatrix();

        // const point = [this.pointList[idx].x, this.pointList[idx].y, 1];
        this.endPoint = m3.multiply3x1(this.transformationMatrix, this.endPoint)
        this.initialPoint = m3.multiply3x1(this.transformationMatrix, this.initialPoint)
    
    }

    public updatePointListWithTransformation() {
        this.pointList.forEach((vertex, index) => {
            const vertexMatrix = [vertex.x, vertex.y, 1];
            const transformedVertex = m3.multiply3x1(this.transformationMatrix, vertexMatrix);
            this.pointList[index] = new Vertex(transformedVertex[0], transformedVertex[1], this.pointList[index].c);
        });

        this.recalculate();
    }

    public recalculate() {
        const length = Math.sqrt(Math.pow(this.pointList[1].x - this.pointList[0].x, 2) + Math.pow(this.pointList[1].y - this.pointList[0].y, 2));
        const width = Math.sqrt(Math.pow(this.pointList[3].x - this.pointList[1].x, 2) + Math.pow(this.pointList[3].y - this.pointList[1].y, 2));

        const centerX = (this.pointList[0].x + this.pointList[1].x + this.pointList[3].x + this.pointList[2].x) / 4;
        const centerY = (this.pointList[0].y + this.pointList[1].y + this.pointList[3].y + this.pointList[2].y) / 4;
    
        this.length = length;
        this.width = width;
        this.center = new Vertex(centerX, centerY, this.color);
    }

    public findOpposite(pointIdx: number){
        const opposite: { [key: number]: number } = { 0: 3, 1: 2, 2: 1, 3: 0 };
        return opposite[pointIdx];
    }

    public findCCWAdjacent(pointIdx: number){
        const ccwAdjacent: { [key: number]: number } = { 0: 2, 1: 0, 2: 3, 3: 1 };
        return ccwAdjacent[pointIdx];
    }

    public findCWAdjacent(pointIdx: number){
        const cwAdjacent: { [key: number]: number } = { 0: 1, 1: 3, 2: 0, 3: 2 };
        return cwAdjacent[pointIdx];
    }

}
