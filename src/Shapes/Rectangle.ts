import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";

export default class Rectangle extends BaseShape {

    constructor(id: string, color: Color, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, rotation = 0, scaleX = 1, scaleY = 1) {
        const centerX = (x1 + x3) / 2;
        const centerY = (y1 + y3) / 2;
        const center = new Vertex(centerX, centerY);
        
        const v1 = new Vertex(x1, y1);
        const v2 = new Vertex(x2, y2);
        const v3 = new Vertex(x3, y3);
        const v4 = new Vertex(x4, y4);        

        super(5, id, color, center, rotation, scaleX, scaleY);

        this.pointList.push(v1, v2, v3, v4);
    }
}
