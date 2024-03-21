import { initDrawObject, drawObject, getMousePosition } from './draw';
import { initBuffers, bindBuffers, createShader, createProgram } from './buffer';

let startClick: { x: number; y: number } | null = null; 

let currentDrawMode: string | null = null; 

const init = () => {
  const canvas = document.getElementById('c') as HTMLCanvasElement;
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Your browser does not support webGL');
    return;
  }

  initBuffers(gl);

  const vtxShaderSource = (
    document.getElementById('vertex-shader-2d') as HTMLScriptElement
  ).text;
  const fragShaderSource = (
    document.getElementById('fragment-shader-2d') as HTMLScriptElement
  ).text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vtxShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);

  if (!vertexShader || !fragmentShader) return;

  const program = createProgram(gl, vertexShader, fragmentShader);
  if (!program) return;

  // Bind buffers
  bindBuffers(gl, program);

  // Event listeners
  const lineBtn = document.getElementById('line-btn');
  if (lineBtn) {
    lineBtn.addEventListener('click', () => {
      console.log('Line button clicked');
      currentDrawMode = 'line';
      initDrawObject(currentDrawMode);
    });
  }

  const squareBtn = document.getElementById('square-btn');
  if (squareBtn) {
    squareBtn.addEventListener('click', () => {
      currentDrawMode = 'square';
      initDrawObject(currentDrawMode);
    });
  }

  const rectangleBtn = document.getElementById('rectangle-btn');
  if (rectangleBtn) {
    rectangleBtn.addEventListener('click', () => {
      currentDrawMode = 'rectangle';
      initDrawObject(currentDrawMode);
    });
  }

  const polygonBtn = document.getElementById('polygon-btn');
  const verticesInput = document.getElementById('vertices-input') as HTMLInputElement;
  if (polygonBtn && verticesInput) {
    polygonBtn.addEventListener('click', () => {
      currentDrawMode = 'polygon';
      const numVertices = parseInt(verticesInput.value);
      initDrawObject(currentDrawMode, numVertices);
    });
  }

  canvas.addEventListener('click', (event: MouseEvent) => {
    if (currentDrawMode) {
      const mousePos = getMousePosition(canvas, event);

      if (!startClick) {
        startClick = mousePos;
      } else {
        drawObject(gl, program, startClick.x, startClick.y, mousePos.x, mousePos.y);
        startClick = null; 
      }
    }
  });
};

init();

