import AppCanvas from "./AppCanvas";
import Color from "./Base/Color";
import Line from "./Shapes/Line";
import Triangle from "./Shapes/Triangle";
import init from "./init";

const main = () => {
    const initRet = init();
    if (!initRet) {
        console.error('Failed to initialize WebGL');
        return;
    }

    const {gl, colorBuffer, positionBuffer} = initRet;

    const red = new Color(255, 0, 200)

    const appCanvas = new AppCanvas(gl, positionBuffer, colorBuffer);
    const triangle = new Triangle('tri-1', red, 50, 50, 20, 500, 200, 100);
    appCanvas.addShape(triangle);

    const line = new Line('line-1', red, 200, 100, 300, 100);
    appCanvas.addShape(line);
};

main();
