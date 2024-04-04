import AppCanvas from './AppCanvas';
import Color from './Base/Color';
import CanvasController from './Controllers/Maker/CanvasController';
import ToolbarController from './Controllers/Toolbar/ToolbarController';
import Line from './Shapes/Line';
import init from './init';

const main = () => {
    const initRet = init();
    if (!initRet) {
        console.error('Failed to initialize WebGL');
        return;
    }

    const { gl, program, colorBuffer, positionBuffer } = initRet;

    const appCanvas = new AppCanvas(gl, program, positionBuffer, colorBuffer);
    
    const canvasController = new CanvasController(appCanvas);
    canvasController.start();
    
    new ToolbarController(appCanvas);

    const red = new Color(255, 0, 200)
    // const triangle = new Triangle('tri-1', red, 50, 50, 20, 500, 200, 100);
    // appCanvas.addShape(triangle);

    // const line = new Line('line-1', red, 100, 100, 300, 100);
    // const line2 = new Line('line-2', red, 100, 100, 100, 300);

    // appCanvas.addShape(line);
    // appCanvas.addShape(line2);
};

main();
