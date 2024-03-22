import init from "./init";

const main = () => {
    const initRet = init();
    // if (!initRet) {
    //     console.error('Failed to initialize WebGL');
    //     return;
    // }

    // const {gl, colorBuffer, positionBuffer} = initRet;

    // const appCanvas = new AppCanvas(gl, positionBuffer, colorBuffer);
    // const line = new Line('line-1', 100, 100, 200, 200);
    // appCanvas.addShape(line);
};

main();
