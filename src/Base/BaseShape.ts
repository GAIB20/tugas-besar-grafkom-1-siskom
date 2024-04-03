import Color from "./Color";
import Vertex from "./Vertex";

export default abstract class BaseShape {
    translation: [number, number] = [0, 0];
    angleInRadians: number = 0;
    scale: [number, number] = [1, 1];

    pointList: Vertex[] = [];
    id: string;
    color: Color;
    glDrawType: number;
    center: Vertex;
    rotation: number;
    scaleX: number;
    scaleY: number;

    constructor(glDrawType: number, id: string, color: Color, center: Vertex = new Vertex(0, 0), rotation = 0, scaleX = 1, scaleY = 1) {
        this.glDrawType = glDrawType;
        this.id = id;
        this.color = color;
        this.center = center;
        this.rotation = rotation;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
}