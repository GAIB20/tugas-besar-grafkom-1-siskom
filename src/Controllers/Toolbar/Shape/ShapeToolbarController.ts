import AppCanvas from '../../../AppCanvas';
import BaseShape from '../../../Base/BaseShape';
import Color from '../../../Base/Color';
import { hexToRgb, rgbToHex } from '../../../utils';

export default abstract class ShapeToolbarController {
    public appCanvas: AppCanvas;
    private shape: BaseShape;

    private toolbarContainer: HTMLDivElement;
    public vertexContainer: HTMLDivElement;

    public vertexPicker: HTMLSelectElement;
    private selectedVertex = '0';

    public vtxPosXSlider: HTMLInputElement | null = null;
    public vtxPosYSlider: HTMLInputElement | null = null;
    public vtxColorPicker: HTMLInputElement | null = null;

    private sliderList: HTMLInputElement[] = [];
    private getterList: (() => number)[] = [];

    constructor(shape: BaseShape, appCanvas: AppCanvas) {
        this.shape = shape;
        this.appCanvas = appCanvas;

        this.toolbarContainer = document.getElementById(
            'toolbar-container'
        ) as HTMLDivElement;

        this.vertexContainer = document.getElementById(
            'vertex-container'
        ) as HTMLDivElement;

        this.vertexPicker = document.getElementById(
            'vertex-picker'
        ) as HTMLSelectElement;

        this.initVertexToolbar();
    }

    createSlider(
        label: string,
        valueGetter: () => number,
        min: number,
        max: number
    ): HTMLInputElement {
        const container = document.createElement('div');
        container.classList.add('toolbar-slider-container');

        const labelElmt = document.createElement('div');
        labelElmt.textContent = label;
        container.appendChild(labelElmt);

        const slider = document.createElement('input') as HTMLInputElement;
        slider.type = 'range';
        slider.min = min.toString();
        slider.max = max.toString();
        slider.value = valueGetter().toString();
        container.appendChild(slider);

        this.toolbarContainer.appendChild(container);

        this.sliderList.push(slider);
        this.getterList.push(valueGetter);

        return slider;
    }

    registerSlider(slider: HTMLInputElement, cb: (e: Event) => any) {
        const newCb = (e: Event) => {
            cb(e);
            this.updateSliders(slider);
        };
        slider.onchange = newCb;
        slider.oninput = newCb;
    }

    updateShape(newShape: BaseShape) {
        this.appCanvas.editShape(newShape);
    }

    updateSliders(ignoreSlider: HTMLInputElement) {
        this.sliderList.forEach((slider, idx) => {
            if (ignoreSlider === slider) return;
            slider.value = this.getterList[idx]().toString();
        });

        if (this.vtxPosXSlider && this.vtxPosYSlider) {
            const idx = parseInt(this.vertexPicker.value);
            const vertex = this.shape.pointList[idx];

            this.vtxPosXSlider.value = vertex.x.toString();
            this.vtxPosYSlider.value = vertex.y.toString();
        }
    }

    createSliderVertex(
        label: string,
        currentLength: number,
        min: number,
        max: number
    ): HTMLInputElement {
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

        this.vertexContainer.appendChild(container);

        return slider;
    }

    createColorPickerVertex(label: string, hex: string): HTMLInputElement {
        const container = document.createElement('div');
        container.classList.add('toolbar-slider-container');

        const labelElmt = document.createElement('div');
        labelElmt.textContent = label;
        container.appendChild(labelElmt);

        const colorPicker = document.createElement('input') as HTMLInputElement;
        colorPicker.type = 'color';
        colorPicker.value = hex;
        container.appendChild(colorPicker);

        this.vertexContainer.appendChild(container);

        return colorPicker;
    }

    drawVertexToolbar() {
        while (this.vertexContainer.firstChild)
            this.vertexContainer.removeChild(this.vertexContainer.firstChild);

        const idx = parseInt(this.vertexPicker.value);
        const vertex = this.shape.pointList[idx];

        this.vtxPosXSlider = this.createSliderVertex(
            'Pos X',
            vertex.x,
            1,
            this.appCanvas.width
        );

        this.vtxPosYSlider = this.createSliderVertex(
            'Pos Y',
            vertex.y,
            1,
            this.appCanvas.height
        );

        const updateSlider = () => {
            if (this.vtxPosXSlider && this.vtxPosYSlider)
                this.updateVertex(
                    idx,
                    parseInt(this.vtxPosXSlider.value),
                    parseInt(this.vtxPosYSlider.value)
                );
        };

        this.vtxColorPicker = this.createColorPickerVertex(
            'Color',
            rgbToHex(vertex.c.r * 255, vertex.c.g * 255, vertex.c.b * 255)
        );

        const updateColor = () => {
            const { r, g, b } = hexToRgb(
                this.vtxColorPicker?.value ?? '#000000'
            ) ?? { r: 0, g: 0, b: 0 };
            const color = new Color(r / 255, g / 255, b / 255);
            this.shape.pointList[idx].c = color;
            this.updateShape(this.shape);
        };

        this.registerSlider(this.vtxPosXSlider, updateSlider);
        this.registerSlider(this.vtxPosYSlider, updateSlider);
        this.registerSlider(this.vtxColorPicker, updateColor);
    }

    initVertexToolbar() {
        while (this.vertexPicker.firstChild)
            this.vertexPicker.removeChild(this.vertexPicker.firstChild);

        this.shape.pointList.forEach((_, idx) => {
            const option = document.createElement('option');
            option.value = idx.toString();
            option.label = `Vertex ${idx}`;
            this.vertexPicker.appendChild(option);
        });

        this.vertexPicker.value = this.selectedVertex;
        this.drawVertexToolbar();

        this.vertexPicker.onchange = () => {
            this.drawVertexToolbar();
        };
    }

    abstract updateVertex(idx: number, x: number, y: number): void;
}
