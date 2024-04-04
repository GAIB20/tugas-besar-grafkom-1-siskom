import BaseShape from './Base/BaseShape';
import { m3 } from './utils';

export default class AppCanvas {
    private program: WebGLProgram;
    private gl: WebGLRenderingContext;
    private positionBuffer: WebGLBuffer;
    private colorBuffer: WebGLBuffer;
    private _updateToolbar: (() => void) | null = null;

    private _shapes: Record<string, BaseShape> = {};

    width: number;
    height: number;

    constructor(
        gl: WebGLRenderingContext,
        program: WebGLProgram,
        positionBuffer: WebGLBuffer,
        colorBuffer: WebGLBuffer
    ) {
        this.gl = gl;
        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;
        this.program = program;

        this.width = gl.canvas.width;
        this.height = gl.canvas.height;

        this.render();
    }

    public render() {
        const gl = this.gl;
        const positionBuffer = this.positionBuffer;
        const colorBuffer = this.colorBuffer;

        Object.values(this.shapes).forEach((shape) => {
            const positions = shape.pointList.flatMap((point) => [
                point.x,
                point.y,
            ]);

            let colors: number[] = [];
            for (let i = 0; i < shape.pointList.length; i++) {
                colors.push(shape.pointList[i].c.r, shape.pointList[i].c.g, shape.pointList[i].c.b);
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

            if (!(this.positionBuffer instanceof WebGLBuffer)) {
                throw new Error("Position buffer is not a valid WebGLBuffer");
            }
            
            if (!(this.colorBuffer instanceof WebGLBuffer)) {
                throw new Error("Color buffer is not a valid WebGLBuffer");
            }

            // Set transformation matrix
            shape.setTransformationMatrix();
            shape.setVirtualTransformationMatrix();

            const matrixLocation = gl.getUniformLocation(this.program, "u_transformation");
            
            const matrix = new Float32Array(shape.transformationMatrix);
            gl.uniformMatrix3fv(matrixLocation, false, matrix);

            gl.drawArrays(shape.glDrawType, 0, shape.pointList.length);

        });
    }

    public get shapes(): Record<string, BaseShape> {
        return this._shapes;
    }

    private set shapes(v: Record<string, BaseShape>) {
        this._shapes = v;
        this.render();
        if (this._updateToolbar)
            this._updateToolbar.call(this);
    }

    public set updateToolbar(v : () => void) {
        this._updateToolbar = v;
    }

    public generateIdFromTag(tag: string) {
        const withSameTag = Object.keys(this.shapes).filter((id) => id.startsWith(tag + '-'));
        return `${tag}-${withSameTag.length + 1}`
    }

    public addShape(shape: BaseShape) {
        if (Object.keys(this.shapes).includes(shape.id)) {
            console.error('Shape ID already used');
            return;
        }

        const newShapes = { ...this.shapes };
        newShapes[shape.id] = shape;
        this.shapes = newShapes;
    }

    public editShape(newShape: BaseShape) {
        if (!Object.keys(this.shapes).includes(newShape.id)) {
            console.error('Shape ID not found');
            return;
        }

        const newShapes = { ...this.shapes };
        newShapes[newShape.id] = newShape;
        this.shapes = newShapes;
    }

    public deleteShape(newShape: BaseShape) {
        if (!Object.keys(this.shapes).includes(newShape.id)) {
            console.error('Shape ID not found');
            return;
        }

        const newShapes = { ...this.shapes };
        delete newShapes[newShape.id];
        this.shapes = newShapes;
    }
}
