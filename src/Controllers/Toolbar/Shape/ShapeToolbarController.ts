import AppCanvas from "../../../AppCanvas";
import BaseShape from "../../../Base/BaseShape";

export default class ShapeToolbarController {
    private toolbarContainer: HTMLDivElement;
    private appCanvas: AppCanvas;
    private shape: BaseShape;

    constructor(shape: BaseShape, appCanvas: AppCanvas) {
        this.shape = shape;
        this.appCanvas = appCanvas;

        this.toolbarContainer = document.getElementById(
            'toolbar-container'
        ) as HTMLDivElement;
    }

    createSlider(label: string, currentLength: number, min: number, max: number): HTMLInputElement {
        const container = document.createElement('div');
        container.classList.add('toolbar-slider-container');

        const labelElmt = document.createElement('div');
        labelElmt.textContent = label;
        container.appendChild(labelElmt);

        const slider = document.createElement('input') as HTMLInputElement;
        slider.type = 'range';
        slider.min = min.toString();
        slider.max = max.toString();
        slider.value = currentLength.toString();
        container.appendChild(slider);

        this.toolbarContainer.appendChild(container);

        return slider;
    }

    registerSlider(slider: HTMLInputElement, cb: (e: Event) => any) {
        slider.onchange = cb;
        slider.oninput = cb;
    }

    updateShape(newShape: BaseShape) {
        this.appCanvas.editShape(newShape);
    }
}
