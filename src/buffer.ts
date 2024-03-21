let vertexBuffer: WebGLBuffer | null = null;
let colorBuffer: WebGLBuffer | null = null;
let coordinatesLocation: number = -1;
let colorLocation: number = -1;

export const initBuffers = (gl: WebGLRenderingContext) => {
    vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.error("Failed to create vertex buffer");
        return;
    }

    colorBuffer = gl.createBuffer();
    if (!colorBuffer) {
        console.error("Failed to create color buffer");
        return;
    }

    const colorData = [
        1.0, 0.0, 0.0,  // Red
        0.0, 1.0, 0.0,  // Green
        0.0, 0.0, 1.0   // Blue
    ];

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

    const error = gl.getError();
    if (error !== gl.NO_ERROR) {
        console.error("WebGL error during buffer initialization:", error);
    }
    
    console.log("Buffers initialized successfully");
};


export const bindBuffers = (gl: WebGLRenderingContext, shaderProgram: WebGLProgram | null) => {
    if (!shaderProgram) {
        console.error("Shader program is not initialized");
        return;
    }
    gl.useProgram(shaderProgram);

    coordinatesLocation = gl.getAttribLocation(shaderProgram, "a_position"); 
    colorLocation = gl.getAttribLocation(shaderProgram, "a_color"); 

    console.log("Coordinates Location:", coordinatesLocation);
    console.log("Color Location:", colorLocation);

    if (coordinatesLocation === -1 || colorLocation === -1) {
        console.error("Attribute locations not found in shader program");
        return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.vertexAttribPointer(coordinatesLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coordinatesLocation);

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(colorLocation);
};

export const createShader = (
    gl: WebGLRenderingContext,
    type: number,
    source: string
) => {
    const shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (!success) {
            console.error("Shader compilation failed:", gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    return null;
};

export const createProgram = (
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
        if (!success) {
            console.error("Program linking failed:", gl.getProgramInfoLog(program));
            gl.deleteProgram(program);
            return null;
        }
        return program;
    }
    return null;
};

