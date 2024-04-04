import BaseShape from "../Base/BaseShape";
import Color from "../Base/Color";
import Vertex from "../Base/Vertex";
import { degToRad, m3 } from "../utils";

export default class Rectangle extends BaseShape {
    translation: [number, number] = [0, 0];
    angleInRadians: number = 0;
    scale: [number, number] = [1, 1];
    length: number;
    width: number;
    initialPoint: number[];
    endPoint: number[];
    targetPoint: number[];


    constructor(id: string, color: Color, startX: number, startY: number, endX: number, endY: number, angleInRadians: number, scaleX: number = 1, scaleY: number = 1) {
        super(5, id, color);

        // const vecEnd = [endX, endY, 1];
        // const translateToInitialPoint = m3.translation(-startX, -startY)
        // const rotateReverse = m3.rotation(-angleInRadians)
        // const translateBack = m3.translation(startX, startY)
        // const resRotate = m3.multiply(rotateReverse,translateToInitialPoint);
        // const resBack = m3.multiply(translateBack, resRotate)

        // const resVecEnd = m3.multiply3x1(resBack, vecEnd)

        // endX = resVecEnd[0]
        // endY = resVecEnd[1]

        const x1 = startX;
        const y1 = startY;
        const x2 = endX;
        const y2 = startY;
        const x3 = startX;
        const y3 = endY;
        const x4 = endX;
        const y4 = endY;

        this.angleInRadians = angleInRadians;
        this.scale = [scaleX, scaleY];
        this.initialPoint = [startX, startY, 1];
        this.endPoint = [endX, endY, 1];
        this.targetPoint = [0,0, 1];
        this.length = x2-x1;
        this.width = x3-x2;

        const centerX = (x1 + x4) / 2;
        const centerY = (y1 + y4) / 2;
        const center = new Vertex(centerX, centerY, color);
        this.center = center;

        this.pointList.push(new Vertex(x1, y1, color), new Vertex(x2, y2, color), new Vertex(x3, y3, color), new Vertex(x4, y4, color));

        // console.log(`point 1: ${x1}, ${y1}`);
        // console.log(`point 2: ${x2}, ${y2}`);
        // console.log(`point 3: ${x3}, ${y3}`);
        // console.log(`point 3: ${x4}, ${y4}`);
        // console.log(`center: ${center.x}, ${center.y}`);
    }

    override setTransformationMatrix(){
        this.transformationMatrix = m3.identity()
        const translateToCenter = m3.translation(-this.center.x, -this.center.y);
        const rotation = m3.rotation(this.angleInRadians);
        let scaling = m3.scaling(this.scaleX, this.scaleY);
        let translateBack = m3.translation(this.center.x, this.center.y);
        const translate = m3.translation(this.translation[0], this.translation[1]);

        let resScale = m3.multiply(scaling, translateToCenter);
        let resRotate = m3.multiply(rotation,resScale);
        let resBack = m3.multiply(translateBack, resRotate);
        const resTranslate = m3.multiply(translate, resBack);
        this.transformationMatrix = resTranslate;

        // const point = [this.pointList[idx].x, this.pointList[idx].y, 1];
        this.endPoint = m3.multiply3x1(this.transformationMatrix, this.endPoint)
        this.initialPoint = m3.multiply3x1(this.transformationMatrix, this.initialPoint)
    
    }

    public override setVirtualTransformationMatrix(): void {
        // // TEST
        // console.log("initial", this.initialPoint);
        // const targetPointX = this.endPoint[0] + this.targetPoint[0];
        // const targetPointY = this.endPoint[1] + this.targetPoint[1];
        // console.log("endPoint X: ", this.endPoint[0]);
        // console.log("endPoint Y: ", this.endPoint[1]);
        // console.log("targetX: ", targetPointX);
        // console.log("targetY: ", targetPointY);

        // const translateToInitial = m3.translation(-this.initialPoint[0], -this.initialPoint[1]);
        // const rotateRevert = m3.rotation(-this.angleInRadians);

        // const resRotate = m3.multiply(rotateRevert, translateToInitial)
        // // const resTransBack = m3.multiply(translateBack, resRotate)

        // const rotatedTarget= m3.multiply3x1(resRotate, [targetPointX, targetPointY, 1]);
        // const rotatedEndPoint=m3.multiply3x1(resRotate, this.endPoint);
        // console.log("rotated target", rotatedTarget);
        // console.log("rotated endpoint", rotatedEndPoint);
        // // this.transformationMatrix = m3.multiply(resRotate, this.transformationMatrix)
        
        // const currentLength = rotatedEndPoint[0];
        // const currentWidth= rotatedEndPoint[1];

        // const updatedLength = currentLength + rotatedTarget[0] - rotatedEndPoint[0];
        // const updatedWidth = currentWidth + rotatedTarget[1] - rotatedEndPoint[1];


        // const scaleLength = updatedLength / currentLength;
        // const scaleWidth = updatedWidth / currentWidth;
        // console.log("scale length: ", scaleLength);
        // console.log("scale width: ", scaleWidth);
        
        // const scaling = m3.scaling(scaleLength, scaleWidth);
        // const rotateBack = m3.rotation(this.angleInRadians);
        // const translateBack = m3.translation(this.initialPoint[0], this.initialPoint[1]);

        // const resScale = m3.multiply(rotateBack, scaling);
        // const resBack = m3.multiply(translateBack, resScale);

        // const virtualTransformationMatrix = m3.multiply(resBack, resRotate);
        // this.transformationMatrix = m3.multiply(virtualTransformationMatrix, this.transformationMatrix);
        // console.log(this.transformationMatrix);
        
        // console.log("res: ", m3.multiply3x1(virtualTransformationMatrix, this.initialPoint))
    }

    // setTranslation(x: number, y: number) {
    //     this.translation = [x, y];
    // }

    // setRotation(angleInDegrees: number) {
    //     this.angleInRadians = degToRad(angleInDegrees);
    // }

    // setScale(scaleX: number, scaleY: number) {
    //     this.scale = [scaleX, scaleY];
    // }
}
