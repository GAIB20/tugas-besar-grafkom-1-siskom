import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";
import { euclideanDistanceVtx } from "../utils";

export default class Line extends BaseShape {
    length: number;

    constructor(id: string, color: Color, startX: number, startY: number, endX: number, endY: number, rotation = 0, scaleX = 1, scaleY = 1) {
        const centerX = (startX + endX) / 2;
        const centerY = (startY + endY) / 2;
        const center = new Vertex(centerX, centerY, color);
        super(1, id, color, center, rotation, scaleX, scaleY);
        
        const origin = new Vertex(startX, startY, color);
        const end = new Vertex(endX, endY, color);

        this.length = euclideanDistanceVtx(
            origin,
            end
        );

        this.pointList.push(origin, end);
    }
}