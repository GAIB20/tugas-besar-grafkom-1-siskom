import Color from "./Color";

export default class Vertex {
    x: number;
    y: number;
    c: Color;
    isSelected : boolean = false;
    
    constructor(x: number, y: number, c: Color, isSelected: boolean = false) {
        this.x = x;
        this.y = y;
        this.c = c;
        this.isSelected = isSelected;
    }
}