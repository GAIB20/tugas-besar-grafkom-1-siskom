import BaseShape from './Shapes/BaseShape';

export default class AppCanvas {
    gl: WebGLRenderingContext;
    positionBuffer: WebGLBuffer;
    colorBuffer: WebGLBuffer;

    private _shapes: Record<string, BaseShape> = {};

    constructor(
        gl: WebGLRenderingContext,
        positionBuffer: WebGLBuffer,
        colorBuffer: WebGLBuffer
    ) {
        this.gl = gl;
        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;

        this.render()
    }

    private render() {
        const gl = this.gl;
        const positionBuffer = this.positionBuffer;
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        
        Object.values(this.shapes).forEach((shape) => {
            // const positions = shape.pointList.flatMap((point) => [point.x, point.y]);
            // console.log(positions);

            // const positions = [
            //     100,100, 200,200,300,300
            // ]
            // gl.bufferData(
            //     gl.ARRAY_BUFFER,
            //     new Float32Array(positions),
            //     gl.STATIC_DRAW
            // );

            // gl.drawArrays(gl.TRIANGLES, 0, 3);
            // gl.drawArrays(gl.TRIANGLES, 0, shape.pointList.length);
        });
    }

    
    public get shapes() : Record<string, BaseShape> {
        return this._shapes;
    }
    
    public set shapes(v: Record<string, BaseShape>) {
        this._shapes = v;
        this.render();
    }
    
    public addShape(shape: BaseShape) {
        if (shape.id in Object.keys(this.shapes)) {
            console.error('Shape ID already used');
            return;
        }

        const newShapes = {...this.shapes};
        newShapes[shape.id] = shape;
        this.shapes = newShapes;
    }
}
