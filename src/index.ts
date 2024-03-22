<<<<<<< HEAD
import AppCanvas from './AppCanvas';
import CanvasController from './Controllers/Maker/CanvasController';
import init from './init';
=======
import AppCanvas from "./AppCanvas";
import Color from "./Base/Color";
import Line from "./Shapes/Line";
import Triangle from "./Shapes/Triangle";
import init from "./init";
>>>>>>> c071a52 (feat: shape class sctructure)

const main = () => {
    const initRet = init();
    if (!initRet) {
        console.error('Failed to initialize WebGL');
        return;
    }

<<<<<<< HEAD
    const { gl, colorBuffer, positionBuffer } = initRet;

    const appCanvas = new AppCanvas(gl, positionBuffer, colorBuffer);
    const canvasController = new CanvasController(appCanvas);
    canvasController.start();

    // const red = new Color(255, 0, 200)
    // const triangle = new Triangle('tri-1', red, 50, 50, 20, 500, 200, 100);
    // appCanvas.addShape(triangle);

    // const line = new Line('line-1', red, 200, 100, 300, 100);
    // appCanvas.addShape(line);
=======
    const {gl, colorBuffer, positionBuffer} = initRet;

    const red = new Color(255, 0, 200)

    const appCanvas = new AppCanvas(gl, positionBuffer, colorBuffer);
    const triangle = new Triangle('tri-1', red, 50, 50, 20, 500, 200, 100);
    appCanvas.addShape(triangle);

    const line = new Line('line-1', red, 200, 100, 300, 100);
    appCanvas.addShape(line);
>>>>>>> c071a52 (feat: shape class sctructure)
};

main();