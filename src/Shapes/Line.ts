import BaseShape from "./BaseShape";
import Vertex from "./Vertex";

export default class Line extends BaseShape {
    constructor(id: string, startX: number, startY: number, endX: number, endY: number) {
        super(id);
        
        const origin = new Vertex(startX, startY);
        const end = new Vertex(endX, endY);

        this.pointList.push(origin, end);
    }
}