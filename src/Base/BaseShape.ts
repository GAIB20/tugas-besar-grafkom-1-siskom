import { m3 } from "../utils";
import Color from "./Color";
import Vertex from "./Vertex";

export default abstract class BaseShape {

    pointList: Vertex[] = [];
    // initialVertex: Vertex;
    id: string;
    color: Color;
    glDrawType: number;
    center: Vertex;
    translation: [number, number] = [0, 0];
    angleInRadians: number = 0;
    scale: [number, number] = [1, 1];

    transformationMatrix: number[] = m3.identity();

    constructor(glDrawType: number, id: string, color: Color, center: Vertex = new Vertex(0, 0, color), rotation = 0, scaleX = 1, scaleY = 1) {
        this.glDrawType = glDrawType;
        this.id = id;
        this.color = color;
        this.center = center;
        this.angleInRadians = rotation;
        this.scale[0] = scaleX;
        this.scale[1] = scaleY;
    }

    public setTransformationMatrix(){
        this.transformationMatrix = m3.identity()
        const translateToCenter = m3.translation(-this.center.x, -this.center.y);
        const rotation = m3.rotation(this.angleInRadians);
        let scaling = m3.scaling(this.scale[0], this.scale[1]);
        let translateBack = m3.translation(this.center.x, this.center.y);
        const translate = m3.translation(this.translation[0], this.translation[1]);

        let resScale = m3.multiply(scaling, translateToCenter);
        let resRotate = m3.multiply(rotation,resScale);
        let resBack = m3.multiply(translateBack, resRotate);
        const resTranslate = m3.multiply(translate, resBack);
        this.transformationMatrix = resTranslate;
    }

    public setVirtualTransformationMatrix(){

    }
}