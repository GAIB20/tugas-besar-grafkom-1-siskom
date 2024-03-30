import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";
import { euclideanDistanceVtx } from "../utils";

export default class Line extends BaseShape {
    length: number;

    constructor(id: string, color: Color, startX: number, startY: number, endX: number, endY: number) {
        super(1, id, color);
        
        const origin = new Vertex(startX, startY);
        const end = new Vertex(endX, endY);

        this.length = euclideanDistanceVtx(
            origin,
            end
        );

        this.pointList.push(origin, end);
    }
}