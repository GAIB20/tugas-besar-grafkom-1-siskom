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

  const vtxShaderSource = (
    document.getElementById('vertex-shader-2d') as HTMLScriptElement
  ).text;
  const fragShaderSource = (
    document.getElementById('fragment-shader-2d') as HTMLScriptElement
  ).text;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vtxShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
  
  if (!vertexShader) return;
  if (!fragmentShader) return;

  const program = createProgram(gl, vertexShader, fragmentShader)
  if (!program) return

  const resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  const positionAttributeLocation = gl.getAttribLocation(program, "a_position")
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  const positions = [
    // X Y
    10, 20,
    80, 20,
    10, 30,
    10, 30,
    80, 20,
    80, 30,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.useProgram(program)
  
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
  gl.enableVertexAttribArray(positionAttributeLocation)

  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  let size = 2;
  let type = gl.FLOAT;
  let normalize = false;
  let stride = 0;
  let offset = 0;
  gl.vertexAttribPointer(
    positionAttributeLocation,
    size,
    type,
    normalize,
    stride,
    offset,
  );

  let primitiveType = gl.TRIANGLES;
  let count = 6;
  gl.drawArrays(primitiveType, offset, count);
};

init();
