import BaseShape from './Base/BaseShape';

export default class AppCanvas {
    private gl: WebGLRenderingContext;
    private positionBuffer: WebGLBuffer;
    private colorBuffer: WebGLBuffer;

    private _shapes: Record<string, BaseShape> = {};

    constructor(
        gl: WebGLRenderingContext,
        positionBuffer: WebGLBuffer,
        colorBuffer: WebGLBuffer
    ) {
        this.gl = gl;
        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;

        this.render();
    }

    private render() {
        const gl = this.gl;
        const positionBuffer = this.positionBuffer;
        const colorBuffer = this.colorBuffer;

        Object.values(this.shapes).forEach((shape) => {
            const positions = shape.pointList.flatMap((point) => [
                point.x,
                point.y,
            ]);

            const baseColorVect = [shape.color.r, shape.color.g, shape.color.b];
            let colors: number[] = [];
            for (let i = 0; i < shape.pointList.length; i++) {
                colors = colors.concat(baseColorVect);
            }

            // Bind color data
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(colors),
                gl.STATIC_DRAW
            );

            // Bind position data
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(
                gl.ARRAY_BUFFER,
                new Float32Array(positions),
                gl.STATIC_DRAW
            );

            gl.drawArrays(shape.glDrawType, 0, 3);
        });
    }

    public get shapes(): Record<string, BaseShape> {
        return this._shapes;
    }

    public set shapes(v: Record<string, BaseShape>) {
        this._shapes = v;
        this.render();
    }

    public generateIdFromTag(tag: string) {
        const withSameTag = Object.keys(this.shapes).filter((id) => id.startsWith(tag + '-'));
        return `${tag}-${withSameTag.length + 1}`
    }

    public addShape(shape: BaseShape) {
        if (shape.id in Object.keys(this.shapes)) {
            console.error('Shape ID already used');
            return;
        }

        const newShapes = { ...this.shapes };
        newShapes[shape.id] = shape;
        this.shapes = newShapes;
    }
}
