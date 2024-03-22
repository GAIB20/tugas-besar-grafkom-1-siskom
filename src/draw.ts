import { initBuffers } from './buffer';

let nothing = false;
let drawLine = false;
let drawSquare = false;
let drawRectangle = false;
let resizing = false;
let drawPolygon = false;
let vertexPolygon: number[] = [];

let vertexBuffer: WebGLBuffer | null = null;
let colorBuffer: WebGLBuffer | null = null;

let numVerticesToDraw = 0; 
let clickedVertices: number[] = []; 

export const initDrawObject = (object: string, numVertices?: number) => {
    switch (object) {
        case "line":
            nothing = false;
            drawLine = true;
            drawSquare = false;
            drawRectangle = false;
            drawPolygon = false;
            resizing = false;
            break;
        case "square":
            nothing = false;
            drawLine = false;
            drawSquare = true;
            drawRectangle = false;
            drawPolygon = false;
            resizing = false;
            break;
        case "rectangle":
            nothing = false;
            drawLine = false;
            drawSquare = false;
            drawRectangle = true;
            drawPolygon = false;
            resizing = false;
            break;
        case "polygon":
            nothing = false;
            drawLine = false;
            drawSquare = false;
            drawRectangle = false;
            drawPolygon = true;
            resizing = false;
            numVerticesToDraw = numVertices || 3; 
            clickedVertices = []; 
            break;
        case "resize":
            nothing = false;
            drawLine = false;
            drawSquare = false;
            drawRectangle = false;
            drawPolygon = false;
            resizing = true;
            break;
    }
    return object;
};

export const drawLineImpl = (gl: WebGLRenderingContext, startX: number, startY: number, endX: number, endY: number, color: number[]) => {
  const vertices = [
      startX, startY,
      endX, endY
  ];
  console.log("Drawing line with vertices:", vertices);
  console.log("Drawing line with color:", color);

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  if (!vertexBuffer ) {
      console.error("Vertex is not initialized");
      return;
  }
  if (colorBuffer){
    console.error("color buffer is not initialized")
    return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  if (gl.getError() !== gl.NO_ERROR) {
      console.error("Failed to bind vertex buffer");
      return;
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  if (gl.getError() !== gl.NO_ERROR) {
      console.error("Failed to bind color buffer");
      return;
  }

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);

  gl.drawArrays(gl.LINES, 0, 2);
  
  console.log("Drawn line.");
};

export const drawSquareImpl = (gl: WebGLRenderingContext, startX: number, startY: number, endX: number, endY: number) => {
    const halfWidth = (endX - startX) / 2;
    const halfHeight = (endY - startY) / 2;
    const vertices = [
        startX, startY,
        startX + halfWidth, startY,
        startX + halfWidth, startY + halfHeight,
        startX, startY + halfHeight
    ];
    console.log("Drawing square with vertices:", vertices); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    console.log("Drawn square."); 
  };

export const drawRectangleImpl = (gl: WebGLRenderingContext, startX: number, startY: number, endX: number, endY: number) => {
    const vertices = [
      startX, startY,
      endX, startY,
      endX, endY,
      startX, endY
  ];
  console.log("Drawing rectangle with vertices:", vertices); 
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  gl.drawArrays(gl.TRIANGLE_FAN, 0, 4);
  console.log("Drawn rectangle."); 
  };

export const drawPolygonImpl = (gl: WebGLRenderingContext, vertices: number[]) => {
    console.log("Drawing polygon with vertices:", vertices); 
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINE_LOOP, 0, vertices.length / 2);
    console.log("Drawn polygon."); 
  };

  export const drawObject = (
    gl: WebGLRenderingContext,
    shaderProgram: WebGLProgram | null,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) => {
    if (!shaderProgram) {
      console.error("Shader program is not initialized");
      return;
    }
  
    gl.useProgram(shaderProgram);
  
    if (drawLine) {
      //  mouse click coordinates
      drawLineImpl(gl, startX, startY, endX, endY, [1.0, 0.0, 0.0]);
    } else if (drawSquare) {
      drawSquareImpl(gl, startX, startY, endX, endY);
    } else if (drawRectangle) {
      drawRectangleImpl(gl, startX, startY, endX, endY);
    } else if (drawPolygon) {
      if (clickedVertices.length < numVerticesToDraw) {
        clickedVertices.push(startX, startY);
        if (clickedVertices.length === numVerticesToDraw * 2) {
          drawPolygonImpl(gl, clickedVertices);
        }
      }
    } else {
      console.error("Invalid draw mode");
      return;
    }
  
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 3;
    gl.drawArrays(primitiveType, offset, count);
  };

  export function getMousePosition(
    canvas: HTMLCanvasElement,
    event: MouseEvent
  ): MousePosition {
    var rect = canvas.getBoundingClientRect();
    return {
      x: ((event.clientX - rect.left) / canvas.width) * 2 - 1,
      y: -((event.clientY - rect.top) / canvas.height) * 2 + 1,
    };
  }

export interface MousePosition {
  x: number;
  y: number;
}

