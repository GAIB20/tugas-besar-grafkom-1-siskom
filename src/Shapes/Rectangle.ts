import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";

export default class Rectangle extends BaseShape {
    public center: {x: number, y:number}

    constructor(id: string, color: Color, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number) {
        super(5 ,id, color);
        
        const v1 = new Vertex(x1, y1);
        const v2 = new Vertex(x2, y2);
        const v3 = new Vertex(x3, y3);
        const v4 = new Vertex(x4, y4);

        this.center = {x: (v1.x+v3.x)/2, y: (v1.y+v3.y)/2};

        this.pointList.push(v1, v2, v3, v4);
    }
}