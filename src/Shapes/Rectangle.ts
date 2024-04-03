import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";
import { degToRad } from "../utils";

export default class Rectangle extends BaseShape {
    translation: [number, number] = [100, 150];
    angleInRadians: number = 0;
    scale: [number, number] = [1, 1];
    length: number;
    width: number;

    constructor(id: string, color: Color, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, x4: number, y4: number, angleInRadians: number, scaleX: number = 1, scaleY: number = 1) {
        super(5, id, color);

        this.angleInRadians = angleInRadians;
        this.scale = [scaleX, scaleY];
        this.length = x2-x1;
        this.width = x3-x2;

        const centerX = (x1 + x4) / 2;
        const centerY = (y1 + y4) / 2;
        const center = new Vertex(centerX, centerY);
        this.center = center;

        this.pointList.push(new Vertex(x1, y1), new Vertex(x2, y2), new Vertex(x3, y3), new Vertex(x4, y4));

        // console.log(`point 1: ${x1}, ${y1}`);
        // console.log(`point 2: ${x2}, ${y2}`);
        // console.log(`point 3: ${x3}, ${y3}`);
        // console.log(`point 3: ${x4}, ${y4}`);
        // console.log(`center: ${center.x}, ${center.y}`);
    }

    setTranslation(x: number, y: number) {
        this.translation = [x, y];
    }

    setRotation(angleInDegrees: number) {
        const angleInRadians = degToRad(angleInDegrees);

        const rotationDifference = angleInRadians - this.angleInRadians;

        this.angleInRadians = angleInRadians;

        this.pointList = this.pointList.map(vertex => {
            let x = vertex.x - this.center.x;
            let y = vertex.y - this.center.y;

            const rotatedX = x * Math.cos(rotationDifference) - y * Math.sin(rotationDifference);
            const rotatedY = x * Math.sin(rotationDifference) + y * Math.cos(rotationDifference);

            x = rotatedX + this.center.x;
            y = rotatedY + this.center.y;

            return new Vertex(x, y);
        });
    }

    setScale(scaleX: number, scaleY: number) {
        this.scale = [scaleX, scaleY];
    }
}
