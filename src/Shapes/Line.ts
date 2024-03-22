import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";

export default class Line extends BaseShape {
    constructor(id: string, color: Color, startX: number, startY: number, endX: number, endY: number) {
        super(1, id, color);
        
        const origin = new Vertex(startX, startY);
        const end = new Vertex(endX, endY);

        this.pointList.push(origin, end);
    }
}