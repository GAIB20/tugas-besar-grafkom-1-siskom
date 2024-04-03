import { m3 } from "./utils";

const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string
) => {
    const shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success) return shader;

        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
};

const createProgram = (
    gl: WebGLRenderingContext,
    vtxShd: WebGLShader,
    frgShd: WebGLShader
) => {
    const program = gl.createProgram();
    if (program) {
        gl.attachShader(program, vtxShd);
        gl.attachShader(program, frgShd);
        gl.linkProgram(program);
        const success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) return program;

        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
};

const init = () => {
    const canvas = document.getElementById('c') as HTMLCanvasElement;
    const gl = canvas.getContext('webgl');

    if (!gl) {
        alert('Your browser does not support webGL');
        return;
    }

    // ===========================================
    // Initialize shaders and programs
    // ===========================================
    const vtxShaderSource = (
        document.getElementById('vertex-shader-2d') as HTMLScriptElement
    ).text;
    const fragShaderSource = (
        document.getElementById('fragment-shader-2d') as HTMLScriptElement
    ).text;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vtxShaderSource);
    const fragmentShader = createShader(
        gl,
        gl.FRAGMENT_SHADER,
        fragShaderSource
    );
    if (!vertexShader || !fragmentShader) return;

    const program = createProgram(gl, vertexShader, fragmentShader);
    if (!program) return;

    const dpr = window.devicePixelRatio;
    const {width, height} = canvas.getBoundingClientRect();
    const displayWidth  = Math.round(width * dpr);
    const displayHeight = Math.round(height * dpr);

    const needResize =
        gl.canvas.width != displayWidth || gl.canvas.height != displayHeight;

    if (needResize) {
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
    }

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    // ===========================================
    // Enable & initialize uniforms and attributes
    // ===========================================
    // Resolution
    const resolutionUniformLocation = gl.getUniformLocation(
        program,
        'u_resolution'
    );
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);

    // Color
    const colorBuffer = gl.createBuffer();
    if (!colorBuffer) {
        console.error('Failed to create color buffer');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);

    // Position
    const positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
        console.error('Failed to create position buffer');
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    const positionAttributeLocation = gl.getAttribLocation(
        program,
        'a_position'
    );
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

    // Do not remove comments, used for sanity check
    // ============================
    // Set the values of the buffer
    // ============================

    // const colors = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0];
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

    // const positions = [100, 50, 20, 10, 500, 500];
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    // ====
    // Draw
    // ====
    // gl.drawArrays(gl.TRIANGLES, 0, 3);

    return {
        positionBuffer,
        program,
        colorBuffer,
        gl,
    };
};

export default init;
