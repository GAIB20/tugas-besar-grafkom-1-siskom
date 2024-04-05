import Color from "./Color";

export default class Vertex {
    x: number;
    y: number;
    c: Color;
    
    constructor(x: number, y: number, c: Color) {
        this.x = x;
        this.y = y;
        this.c = c;
    }
}