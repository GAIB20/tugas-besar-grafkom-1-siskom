import AppCanvas from '../../AppCanvas';
import FanPolygon from '../../Shapes/FanPolygon';
import Line from '../../Shapes/Line';
import Rectangle from '../../Shapes/Rectangle';
import Square from '../../Shapes/Square';
import FanPolygonToolbarController from './Shape/FanPolygonToolbarController';
import LineToolbarController from './Shape/LineToolbarController';
import RectangleToolbarController from './Shape/RectangleToolbarController';
import IShapeToolbarController from './Shape/ShapeToolbarController';
import SquareToolbarController from './Shape/SquareToolbarController';

export default class ToolbarController {
    private appCanvas: AppCanvas;
    private toolbarContainer: HTMLDivElement;
    private itemPicker: HTMLSelectElement;
    private selectedId: string = '';

    private toolbarController: IShapeToolbarController | null = null;

    constructor(appCanvas: AppCanvas) {
        this.appCanvas = appCanvas;
        this.appCanvas.updateToolbar = this.updateShapeList.bind(this);

        this.toolbarContainer = document.getElementById(
            'toolbar-container'
        ) as HTMLDivElement;

        this.itemPicker = document.getElementById(
            'toolbar-item-picker'
        ) as HTMLSelectElement;

        this.itemPicker.onchange = (e) => {
            this.selectedId = this.itemPicker.value;
            const shape = this.appCanvas.shapes[this.itemPicker.value];
            this.clearToolbarElmt();

            if (shape instanceof Line) {
                this.toolbarController = new LineToolbarController(shape as Line, appCanvas);
            } else if (shape instanceof Rectangle) {
                this.toolbarController = new RectangleToolbarController(shape as Rectangle, appCanvas)
            } else if (shape instanceof Square) {
                this.toolbarController = new SquareToolbarController(shape as Square, appCanvas)
            } else if (shape instanceof FanPolygon) {
                this.toolbarController = new FanPolygonToolbarController(shape as FanPolygon, appCanvas)
            }
        };

        this.updateShapeList();
    }

    updateShapeList() {
        while (this.itemPicker.firstChild)
            this.itemPicker.removeChild(this.itemPicker.firstChild);
        
        const placeholder = document.createElement('option');
        placeholder.text = 'Choose an object';
        placeholder.value = '';
        this.itemPicker.appendChild(placeholder);

        Object.values(this.appCanvas.shapes).forEach((shape) => {
            const child = document.createElement('option');
            child.text = shape.id;
            child.value = shape.id;
            this.itemPicker.appendChild(child);
        });

        this.itemPicker.value = this.selectedId;

        if (!Object.keys(this.appCanvas.shapes).includes(this.selectedId)) {
            this.toolbarController = null;
            this.clearToolbarElmt();
        }
    }

    private clearToolbarElmt() {
        while (this.toolbarContainer.firstChild)
            this.toolbarContainer.removeChild(this.toolbarContainer.firstChild);
    }
}
