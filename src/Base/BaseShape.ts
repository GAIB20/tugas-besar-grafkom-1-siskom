import Color from "./Color";
import Vertex from "./Vertex";

export default abstract class BaseShape {
    pointList: Vertex[] = [];
    id: string;
    color: Color;
    glDrawType: number

    constructor(glDrawType: number, id: string, color: Color) {
        this.glDrawType = glDrawType;
        this.id = id;
        this.color = color;
    }
}