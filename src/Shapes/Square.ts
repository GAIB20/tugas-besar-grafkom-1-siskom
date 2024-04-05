import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";
import { euclideanDistanceVtx, m3 } from "../utils";

export default class Square extends BaseShape {
    size: number;
    v1 : Vertex;
    v2 : Vertex;
    v3 : Vertex;
    v4 : Vertex;

    constructor(id: string, color: Color, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, rotation = 0, scaleX = 1, scaleY = 1) {
        const centerX = (x1 + x3) / 2;
        const centerY = (y1 + y3) / 2;
        const center = new Vertex(centerX, centerY, color);
        
        super(6, id, color, center, rotation, scaleX, scaleY);
        
        this.v1 = new Vertex(x1, y1, color);
        this.v2 = new Vertex(x2, y2, color);
        this.v3 = new Vertex(x3, y3, color);
        this.v4 = new Vertex(x4, y4, color);
        this.size = euclideanDistanceVtx(this.v1, this.v3);

        this.pointList.push(this.v1, this.v2, this.v3, this.v4);
        this.bufferTransformationList = this.pointList;

        const deltaY = this.pointList[1].y - this.pointList[0].y;
        const deltaX = this.pointList[1].x - this.pointList[0].x;
        this.angleInRadians = Math.atan2(deltaY, deltaX);

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
        const size = Math.sqrt(Math.pow(this.pointList[3].x - this.pointList[1].x, 2) + Math.pow(this.pointList[3].y - this.pointList[1].y, 2));
        const centerX = (this.pointList[0].x + this.pointList[1].x + this.pointList[3].x + this.pointList[2].x) / 4;
        const centerY = (this.pointList[0].y + this.pointList[1].y + this.pointList[3].y + this.pointList[2].y) / 4;

        const deltaY = this.pointList[1].y - this.pointList[0].y;
        const deltaX = this.pointList[1].x - this.pointList[0].x;
        this.angleInRadians = Math.atan2(deltaY, deltaX);
        
        this.size = size;
        this.center = new Vertex(centerX, centerY, this.color);
    }
}
