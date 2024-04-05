import AppCanvas from './AppCanvas';
import Color from './Base/Color';
import CanvasController from './Controllers/Maker/CanvasController';
import ToolbarController from './Controllers/Toolbar/ToolbarController';
import Line from './Shapes/Line';
import Rectangle from './Shapes/Rectangle';
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
    
    const rect = new Rectangle('rect-1', red, 0,0,10,20,0,1,1);
    rect.angleInRadians = - Math.PI / 4;
    // rect.targetPoint[0] = 5 * Math.sqrt(2);
    // rect.scaleX = 10;
    // rect.translation[0] = 500;
    // rect.translation[1] = 1000;
    // rect.setTransformationMatrix();
    appCanvas.addShape(rect);

    // const line = new Line('line-1', red, 100, 100, 100, 300);
    // const line2 = new Line('line-2', red, 100, 100, 300, 100);
    // appCanvas.addShape(line);
    // appCanvas.addShape(line2);
};

main();
