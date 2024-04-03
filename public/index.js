/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AppCanvas.ts":
/*!**************************!*\
  !*** ./src/AppCanvas.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports) {


var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var AppCanvas = /** @class */ (function () {
    function AppCanvas(gl, positionBuffer, colorBuffer) {
        this._updateToolbar = null;
        this._shapes = {};
        this.gl = gl;
        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        this.render();
    }
    AppCanvas.prototype.render = function () {
        var gl = this.gl;
        var positionBuffer = this.positionBuffer;
        var colorBuffer = this.colorBuffer;
        Object.values(this.shapes).forEach(function (shape) {
            var positions = shape.pointList.flatMap(function (point) { return [
                point.x,
                point.y,
            ]; });
            var baseColorVect = [shape.color.r, shape.color.g, shape.color.b];
            var colors = [];
            for (var i = 0; i < shape.pointList.length; i++) {
                colors = colors.concat(baseColorVect);
            }
            // Bind color data
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            // Bind position data
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            gl.drawArrays(shape.glDrawType, 0, shape.pointList.length);
        });
    };
    Object.defineProperty(AppCanvas.prototype, "shapes", {
        get: function () {
            return this._shapes;
        },
        set: function (v) {
            this._shapes = v;
            this.render();
            if (this._updateToolbar)
                this._updateToolbar.call(this);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(AppCanvas.prototype, "updateToolbar", {
        set: function (v) {
            this._updateToolbar = v;
        },
        enumerable: false,
        configurable: true
    });
    AppCanvas.prototype.generateIdFromTag = function (tag) {
        var withSameTag = Object.keys(this.shapes).filter(function (id) { return id.startsWith(tag + '-'); });
        return "".concat(tag, "-").concat(withSameTag.length + 1);
    };
    AppCanvas.prototype.addShape = function (shape) {
        if (Object.keys(this.shapes).includes(shape.id)) {
            console.error('Shape ID already used');
            return;
        }
        var newShapes = __assign({}, this.shapes);
        newShapes[shape.id] = shape;
        this.shapes = newShapes;
    };
    AppCanvas.prototype.editShape = function (newShape) {
        if (!Object.keys(this.shapes).includes(newShape.id)) {
            console.error('Shape ID not found');
            return;
        }
        var newShapes = __assign({}, this.shapes);
        newShapes[newShape.id] = newShape;
        this.shapes = newShapes;
    };
    AppCanvas.prototype.deleteShape = function (newShape) {
        if (!Object.keys(this.shapes).includes(newShape.id)) {
            console.error('Shape ID not found');
            return;
        }
        var newShapes = __assign({}, this.shapes);
        delete newShapes[newShape.id];
        this.shapes = newShapes;
    };
    return AppCanvas;
}());
exports["default"] = AppCanvas;


/***/ }),

/***/ "./src/Base/BaseShape.ts":
/*!*******************************!*\
  !*** ./src/Base/BaseShape.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var BaseShape = /** @class */ (function () {
    function BaseShape(glDrawType, id, color) {
        this.pointList = [];
        this.glDrawType = glDrawType;
        this.id = id;
        this.color = color;
    }
    return BaseShape;
}());
exports["default"] = BaseShape;


/***/ }),

/***/ "./src/Base/Color.ts":
/*!***************************!*\
  !*** ./src/Base/Color.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Color = /** @class */ (function () {
    function Color(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    return Color;
}());
exports["default"] = Color;


/***/ }),

/***/ "./src/Base/Vertex.ts":
/*!****************************!*\
  !*** ./src/Base/Vertex.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var Vertex = /** @class */ (function () {
    function Vertex(x, y) {
        this.x = x;
        this.y = y;
    }
    return Vertex;
}());
exports["default"] = Vertex;


/***/ }),

/***/ "./src/Controllers/Maker/CanvasController.ts":
/*!***************************************************!*\
  !*** ./src/Controllers/Maker/CanvasController.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var LineMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/LineMakerController */ "./src/Controllers/Maker/Shape/LineMakerController.ts"));
var RectangleMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/RectangleMakerController */ "./src/Controllers/Maker/Shape/RectangleMakerController.ts"));
var SquareMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/SquareMakerController */ "./src/Controllers/Maker/Shape/SquareMakerController.ts"));
var AVAIL_SHAPES;
(function (AVAIL_SHAPES) {
    AVAIL_SHAPES["Line"] = "Line";
    AVAIL_SHAPES["Rectangle"] = "Rectangle";
    AVAIL_SHAPES["Square"] = "Square";
})(AVAIL_SHAPES || (AVAIL_SHAPES = {}));
var CanvasController = /** @class */ (function () {
    function CanvasController(appCanvas) {
        var _this = this;
        this.appCanvas = appCanvas;
        var canvasElmt = document.getElementById('c');
        var buttonContainer = document.getElementById('shape-button-container');
        this.canvasElmt = canvasElmt;
        this.buttonContainer = buttonContainer;
        this._shapeController = new LineMakerController_1.default(appCanvas);
        this.canvasElmt.onclick = function (e) {
            var _a;
            var correctX = e.offsetX * window.devicePixelRatio;
            var correctY = e.offsetY * window.devicePixelRatio;
            (_a = _this.shapeController) === null || _a === void 0 ? void 0 : _a.handleClick(correctX, correctY);
        };
    }
    Object.defineProperty(CanvasController.prototype, "shapeController", {
        get: function () {
            return this._shapeController;
        },
        set: function (v) {
            var _this = this;
            this._shapeController = v;
            this.canvasElmt.onclick = function (e) {
                var _a;
                var correctX = e.offsetX * window.devicePixelRatio;
                var correctY = e.offsetY * window.devicePixelRatio;
                (_a = _this.shapeController) === null || _a === void 0 ? void 0 : _a.handleClick(correctX, correctY);
            };
        },
        enumerable: false,
        configurable: true
    });
    CanvasController.prototype.initController = function (shapeStr) {
        switch (shapeStr) {
            case AVAIL_SHAPES.Line:
                return new LineMakerController_1.default(this.appCanvas);
            case AVAIL_SHAPES.Rectangle:
                return new RectangleMakerController_1.default(this.appCanvas);
            case AVAIL_SHAPES.Square:
                return new SquareMakerController_1.default(this.appCanvas);
            default:
                throw new Error('Incorrect shape string');
        }
    };
    CanvasController.prototype.start = function () {
        var _this = this;
        var _loop_1 = function (shapeStr) {
            var button = document.createElement('button');
            button.classList.add('shape-button');
            button.textContent = shapeStr;
            button.onclick = function () {
                _this.shapeController = _this.initController(shapeStr);
            };
            this_1.buttonContainer.appendChild(button);
        };
        var this_1 = this;
        for (var shapeStr in AVAIL_SHAPES) {
            _loop_1(shapeStr);
        }
    };
    return CanvasController;
}());
exports["default"] = CanvasController;


/***/ }),

/***/ "./src/Controllers/Maker/Shape/LineMakerController.ts":
/*!************************************************************!*\
  !*** ./src/Controllers/Maker/Shape/LineMakerController.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Color_1 = __importDefault(__webpack_require__(/*! ../../../Base/Color */ "./src/Base/Color.ts"));
var Line_1 = __importDefault(__webpack_require__(/*! ../../../Shapes/Line */ "./src/Shapes/Line.ts"));
var LineMakerController = /** @class */ (function () {
    function LineMakerController(appCanvas) {
        this.origin = null;
        this.appCanvas = appCanvas;
    }
    LineMakerController.prototype.handleClick = function (x, y) {
        if (this.origin === null) {
            this.origin = { x: x, y: y };
        }
        else {
            var red = new Color_1.default(1, 0, 0);
            var id = this.appCanvas.generateIdFromTag('line');
            var line = new Line_1.default(id, red, this.origin.x, this.origin.y, x, y);
            this.appCanvas.addShape(line);
            this.origin = null;
        }
    };
    return LineMakerController;
}());
exports["default"] = LineMakerController;


/***/ }),

/***/ "./src/Controllers/Maker/Shape/RectangleMakerController.ts":
/*!*****************************************************************!*\
  !*** ./src/Controllers/Maker/Shape/RectangleMakerController.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Color_1 = __importDefault(__webpack_require__(/*! ../../../Base/Color */ "./src/Base/Color.ts"));
var Rectangle_1 = __importDefault(__webpack_require__(/*! ../../../Shapes/Rectangle */ "./src/Shapes/Rectangle.ts"));
var RectangleMakerController = /** @class */ (function () {
    function RectangleMakerController(appCanvas) {
        this.origin = null;
        this.appCanvas = appCanvas;
    }
    RectangleMakerController.prototype.handleClick = function (x, y) {
        if (this.origin === null) {
            this.origin = { x: x, y: y };
        }
        else {
            var black = new Color_1.default(0, 0, 0);
            var id = this.appCanvas.generateIdFromTag('rectangle');
            var rectangle = new Rectangle_1.default(id, black, this.origin.x, this.origin.y, this.origin.x, y, x, this.origin.y, x, y);
            this.appCanvas.addShape(rectangle);
            this.origin = null;
        }
    };
    return RectangleMakerController;
}());
exports["default"] = RectangleMakerController;


/***/ }),

/***/ "./src/Controllers/Maker/Shape/SquareMakerController.ts":
/*!**************************************************************!*\
  !*** ./src/Controllers/Maker/Shape/SquareMakerController.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Color_1 = __importDefault(__webpack_require__(/*! ../../../Base/Color */ "./src/Base/Color.ts"));
var Square_1 = __importDefault(__webpack_require__(/*! ../../../Shapes/Square */ "./src/Shapes/Square.ts"));
var SquareMakerController = /** @class */ (function () {
    function SquareMakerController(appCanvas) {
        this.origin = null;
        this.appCanvas = appCanvas;
    }
    SquareMakerController.prototype.handleClick = function (x, y) {
        if (this.origin === null) {
            this.origin = { x: x, y: y };
        }
        else {
            var black = new Color_1.default(0, 0, 0);
            var id = this.appCanvas.generateIdFromTag('square');
            var v1 = { x: x, y: y };
            // console.log(`v1x: ${v1.x}, v1y: ${v1.y}`)
            var v2 = { x: this.origin.x - (y - this.origin.y),
                y: this.origin.y + (x - this.origin.x) };
            // console.log(`v2x: ${v2.x}, v2y: ${v2.y}`)
            var v3 = { x: 2 * this.origin.x - x,
                y: 2 * this.origin.y - y };
            // console.log(`v3x: ${v3.x}, v3y: ${v3.y}`)
            var v4 = { x: this.origin.x + (y - this.origin.y),
                y: this.origin.y - (x - this.origin.x) };
            // console.log(`v4x: ${v4.x}, v4y: ${v4.y}`)
            var square = new Square_1.default(id, black, v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, v4.x, v4.y);
            this.appCanvas.addShape(square);
            this.origin = null;
        }
    };
    return SquareMakerController;
}());
exports["default"] = SquareMakerController;


/***/ }),

/***/ "./src/Controllers/Toolbar/Shape/LineToolbarController.ts":
/*!****************************************************************!*\
  !*** ./src/Controllers/Toolbar/Shape/LineToolbarController.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var ShapeToolbarController_1 = __importDefault(__webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts"));
var LineToolbarController = /** @class */ (function (_super) {
    __extends(LineToolbarController, _super);
    function LineToolbarController(line, appCanvas) {
        var _this = _super.call(this, line, appCanvas) || this;
        _this.line = line;
        var diagonal = Math.sqrt(appCanvas.width * appCanvas.width +
            appCanvas.height * appCanvas.height);
        _this.lengthSlider = _this.createSlider('Length', function () { return line.length; }, 1, diagonal);
        _this.registerSlider(_this.lengthSlider, function (e) {
            _this.updateLength(parseInt(_this.lengthSlider.value));
        });
        _this.posXSlider = _this.createSlider('Position X', function () { return line.pointList[0].x; }, 1, appCanvas.width);
        _this.registerSlider(_this.posXSlider, function (e) {
            _this.updatePosX(parseInt(_this.posXSlider.value));
        });
        _this.posYSlider = _this.createSlider('Position Y', function () { return line.pointList[0].y; }, 1, appCanvas.height);
        _this.registerSlider(_this.posYSlider, function (e) {
            _this.updatePosY(parseInt(_this.posYSlider.value));
        });
        _this.rotateSlider = _this.createSlider('Rotation', _this.currentAngle.bind(_this), 0, 360);
        _this.registerSlider(_this.rotateSlider, function (e) {
            _this.updateRotation(parseInt(_this.rotateSlider.value));
        });
        return _this;
    }
    LineToolbarController.prototype.updateLength = function (newLen) {
        var lineLen = (0, utils_1.euclideanDistanceVtx)(this.line.pointList[0], this.line.pointList[1]);
        var cos = (this.line.pointList[1].x - this.line.pointList[0].x) / lineLen;
        var sin = (this.line.pointList[1].y - this.line.pointList[0].y) / lineLen;
        this.line.pointList[1].x = newLen * cos + this.line.pointList[0].x;
        this.line.pointList[1].y = newLen * sin + this.line.pointList[0].y;
        this.line.length = newLen;
        this.updateShape(this.line);
    };
    LineToolbarController.prototype.updatePosX = function (newPosX) {
        var diff = this.line.pointList[1].x - this.line.pointList[0].x;
        this.line.pointList[0].x = newPosX;
        this.line.pointList[1].x = newPosX + diff;
        this.updateShape(this.line);
    };
    LineToolbarController.prototype.updatePosY = function (newPosY) {
        var diff = this.line.pointList[1].y - this.line.pointList[0].y;
        this.line.pointList[0].y = newPosY;
        this.line.pointList[1].y = newPosY + diff;
        this.updateShape(this.line);
    };
    LineToolbarController.prototype.currentAngle = function () {
        return (0, utils_1.getAngle)(this.line.pointList[0], this.line.pointList[1]);
    };
    LineToolbarController.prototype.updateRotation = function (newRot) {
        var rad = (0, utils_1.degToRad)(newRot);
        var cos = Math.cos(rad);
        var sin = Math.sin(rad);
        this.line.pointList[1].x =
            this.line.pointList[0].x + cos * this.line.length;
        this.line.pointList[1].y =
            this.line.pointList[0].y - sin * this.line.length;
        this.updateShape(this.line);
    };
    LineToolbarController.prototype.updateVertex = function (idx, x, y) {
        this.line.pointList[idx].x = x;
        this.line.pointList[idx].y = y;
        this.line.length = (0, utils_1.euclideanDistanceVtx)(this.line.pointList[0], this.line.pointList[1]);
        this.updateShape(this.line);
    };
    return LineToolbarController;
}(ShapeToolbarController_1.default));
exports["default"] = LineToolbarController;


/***/ }),

/***/ "./src/Controllers/Toolbar/Shape/RectangleToolbarController.ts":
/*!*********************************************************************!*\
  !*** ./src/Controllers/Toolbar/Shape/RectangleToolbarController.ts ***!
  \*********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShapeToolbarController_1 = __importDefault(__webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts"));
var RectangleToolbarController = /** @class */ (function (_super) {
    __extends(RectangleToolbarController, _super);
    function RectangleToolbarController(rectangle, appCanvas) {
        var _this = _super.call(this, rectangle, appCanvas) || this;
        _this.rectangle = rectangle;
        // X Position
        _this.posXSlider = _this.createSlider('Position X', function () { return rectangle.center.x; }, 1, appCanvas.width);
        _this.registerSlider(_this.posXSlider, function (e) { _this.updatePosX(parseInt(_this.posXSlider.value)); });
        // Y Position
        _this.posYSlider = _this.createSlider('Position Y', function () { return rectangle.center.y; }, 1, appCanvas.width);
        _this.registerSlider(_this.posYSlider, function (e) { _this.updatePosY(parseInt(_this.posYSlider.value)); });
        return _this;
    }
    RectangleToolbarController.prototype.updatePosX = function (newPosX) {
        var diff = newPosX - this.rectangle.center.x;
        for (var i = 0; i < 4; i++) {
            this.rectangle.pointList[i].x += diff;
        }
        this.recalculateCenter();
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updatePosY = function (newPosY) {
        var diff = newPosY - this.rectangle.center.y;
        for (var i = 0; i < 4; i++) {
            this.rectangle.pointList[i].y += diff;
        }
        this.recalculateCenter();
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateVertex = function (idx, x, y) {
        var diffy = y - this.rectangle.pointList[idx].y;
        var diffx = x - this.rectangle.pointList[idx].x;
        for (var i = 0; i < 4; i++) {
            if (i != idx) {
                this.rectangle.pointList[i].y += diffy;
                this.rectangle.pointList[i].x += diffx;
            }
        }
        this.rectangle.pointList[idx].x = x;
        this.rectangle.pointList[idx].y = y;
        this.recalculateCenter();
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.recalculateCenter = function () {
        var sumX = 0, sumY = 0;
        var vertices = this.rectangle.pointList;
        vertices.forEach(function (vertex) {
            sumX += vertex.x;
            sumY += vertex.y;
        });
        this.rectangle.center.x = sumX / vertices.length;
        this.rectangle.center.y = sumY / vertices.length;
    };
    return RectangleToolbarController;
}(ShapeToolbarController_1.default));
exports["default"] = RectangleToolbarController;


/***/ }),

/***/ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts":
/*!*****************************************************************!*\
  !*** ./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShapeToolbarController = /** @class */ (function () {
    function ShapeToolbarController(shape, appCanvas) {
        this.selectedVertex = '0';
        this.vtxPosXSlider = null;
        this.vtxPosYSlider = null;
        this.sliderList = [];
        this.getterList = [];
        this.shape = shape;
        this.appCanvas = appCanvas;
        this.toolbarContainer = document.getElementById('toolbar-container');
        this.vertexContainer = document.getElementById('vertex-container');
        this.vertexPicker = document.getElementById('vertex-picker');
        this.initVertexToolbar();
    }
    ShapeToolbarController.prototype.createSlider = function (label, valueGetter, min, max) {
        var container = document.createElement('div');
        container.classList.add('toolbar-slider-container');
        var labelElmt = document.createElement('div');
        labelElmt.textContent = label;
        container.appendChild(labelElmt);
        var slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min.toString();
        slider.max = max.toString();
        slider.value = valueGetter.toString();
        container.appendChild(slider);
        this.toolbarContainer.appendChild(container);
        this.sliderList.push(slider);
        this.getterList.push(valueGetter);
        return slider;
    };
    ShapeToolbarController.prototype.registerSlider = function (slider, cb) {
        var _this = this;
        var newCb = function (e) {
            cb(e);
            _this.updateSliders(slider);
        };
        slider.onchange = newCb;
        slider.oninput = newCb;
    };
    ShapeToolbarController.prototype.updateShape = function (newShape) {
        this.appCanvas.editShape(newShape);
    };
    ShapeToolbarController.prototype.updateSliders = function (ignoreSlider) {
        var _this = this;
        this.sliderList.forEach(function (slider, idx) {
            if (ignoreSlider === slider)
                return;
            slider.value = ((_this.getterList[idx])()).toString();
        });
        if (this.vtxPosXSlider && this.vtxPosYSlider) {
            var idx = parseInt(this.vertexPicker.value);
            var vertex = this.shape.pointList[idx];
            this.vtxPosXSlider.value = vertex.x.toString();
            this.vtxPosYSlider.value = vertex.y.toString();
        }
    };
    ShapeToolbarController.prototype.createSliderVertex = function (label, currentLength, min, max) {
        var container = document.createElement('div');
        container.classList.add('toolbar-slider-container');
        var labelElmt = document.createElement('div');
        labelElmt.textContent = label;
        container.appendChild(labelElmt);
        var slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min.toString();
        slider.max = max.toString();
        slider.value = currentLength.toString();
        container.appendChild(slider);
        this.vertexContainer.appendChild(container);
        return slider;
    };
    ShapeToolbarController.prototype.drawVertexToolbar = function () {
        var _this = this;
        while (this.vertexContainer.firstChild)
            this.vertexContainer.removeChild(this.vertexContainer.firstChild);
        var idx = parseInt(this.vertexPicker.value);
        var vertex = this.shape.pointList[idx];
        this.vtxPosXSlider = this.createSliderVertex('Pos X', vertex.x, 0, this.appCanvas.width);
        this.vtxPosYSlider = this.createSliderVertex('Pos Y', vertex.y, 0, this.appCanvas.height);
        var updateSlider = function () {
            if (_this.vtxPosXSlider && _this.vtxPosYSlider)
                _this.updateVertex(idx, parseInt(_this.vtxPosXSlider.value), parseInt(_this.vtxPosYSlider.value));
        };
        this.registerSlider(this.vtxPosXSlider, updateSlider);
        this.registerSlider(this.vtxPosYSlider, updateSlider);
    };
    ShapeToolbarController.prototype.initVertexToolbar = function () {
        var _this = this;
        while (this.vertexPicker.firstChild)
            this.vertexPicker.removeChild(this.vertexPicker.firstChild);
        this.shape.pointList.forEach(function (_, idx) {
            var option = document.createElement('option');
            option.value = idx.toString();
            option.label = "Vertex ".concat(idx);
            _this.vertexPicker.appendChild(option);
        });
        this.vertexPicker.value = this.selectedVertex;
        this.drawVertexToolbar();
        this.vertexPicker.onchange = function () {
            _this.drawVertexToolbar();
        };
    };
    return ShapeToolbarController;
}());
exports["default"] = ShapeToolbarController;


/***/ }),

/***/ "./src/Controllers/Toolbar/ToolbarController.ts":
/*!******************************************************!*\
  !*** ./src/Controllers/Toolbar/ToolbarController.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Line_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Line */ "./src/Shapes/Line.ts"));
var Rectangle_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Rectangle */ "./src/Shapes/Rectangle.ts"));
var LineToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/LineToolbarController */ "./src/Controllers/Toolbar/Shape/LineToolbarController.ts"));
var RectangleToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/RectangleToolbarController */ "./src/Controllers/Toolbar/Shape/RectangleToolbarController.ts"));
var ToolbarController = /** @class */ (function () {
    function ToolbarController(appCanvas) {
        var _this = this;
        this.selectedId = '';
        this.toolbarController = null;
        this.appCanvas = appCanvas;
        this.appCanvas.updateToolbar = this.updateShapeList.bind(this);
        this.toolbarContainer = document.getElementById('toolbar-container');
        this.itemPicker = document.getElementById('toolbar-item-picker');
        this.itemPicker.onchange = function (e) {
            _this.selectedId = _this.itemPicker.value;
            var shape = _this.appCanvas.shapes[_this.itemPicker.value];
            _this.clearToolbarElmt();
            if (shape instanceof Line_1.default) {
                _this.toolbarController = new LineToolbarController_1.default(shape, appCanvas);
            }
            else if (shape instanceof Rectangle_1.default) {
                _this.toolbarController = new RectangleToolbarController_1.default(shape, appCanvas);
            }
        };
        this.updateShapeList();
    }
    ToolbarController.prototype.updateShapeList = function () {
        var _this = this;
        while (this.itemPicker.firstChild)
            this.itemPicker.removeChild(this.itemPicker.firstChild);
        var placeholder = document.createElement('option');
        placeholder.text = 'Choose an object';
        placeholder.value = '';
        this.itemPicker.appendChild(placeholder);
        Object.values(this.appCanvas.shapes).forEach(function (shape) {
            var child = document.createElement('option');
            child.text = shape.id;
            child.value = shape.id;
            _this.itemPicker.appendChild(child);
        });
        this.itemPicker.value = this.selectedId;
        if (!Object.keys(this.appCanvas.shapes).includes(this.selectedId)) {
            this.toolbarController = null;
            this.clearToolbarElmt();
        }
    };
    ToolbarController.prototype.clearToolbarElmt = function () {
        while (this.toolbarContainer.firstChild)
            this.toolbarContainer.removeChild(this.toolbarContainer.firstChild);
    };
    return ToolbarController;
}());
exports["default"] = ToolbarController;


/***/ }),

/***/ "./src/Shapes/Line.ts":
/*!****************************!*\
  !*** ./src/Shapes/Line.ts ***!
  \****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var BaseShape_1 = __importDefault(__webpack_require__(/*! ../Base/BaseShape */ "./src/Base/BaseShape.ts"));
var Vertex_1 = __importDefault(__webpack_require__(/*! ../Base/Vertex */ "./src/Base/Vertex.ts"));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(id, color, startX, startY, endX, endY) {
        var _this = _super.call(this, 1, id, color) || this;
        var origin = new Vertex_1.default(startX, startY);
        var end = new Vertex_1.default(endX, endY);
        _this.length = (0, utils_1.euclideanDistanceVtx)(origin, end);
        _this.pointList.push(origin, end);
        return _this;
    }
    return Line;
}(BaseShape_1.default));
exports["default"] = Line;


/***/ }),

/***/ "./src/Shapes/Rectangle.ts":
/*!*********************************!*\
  !*** ./src/Shapes/Rectangle.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var BaseShape_1 = __importDefault(__webpack_require__(/*! ../Base/BaseShape */ "./src/Base/BaseShape.ts"));
var Vertex_1 = __importDefault(__webpack_require__(/*! ../Base/Vertex */ "./src/Base/Vertex.ts"));
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(id, color, x1, y1, x2, y2, x3, y3, x4, y4) {
        var _this = _super.call(this, 5, id, color) || this;
        var v1 = new Vertex_1.default(x1, y1);
        var v2 = new Vertex_1.default(x2, y2);
        var v3 = new Vertex_1.default(x3, y3);
        var v4 = new Vertex_1.default(x4, y4);
        _this.center = { x: (v1.x + v3.x) / 2, y: (v1.y + v3.y) / 2 };
        _this.pointList.push(v1, v2, v3, v4);
        return _this;
    }
    return Rectangle;
}(BaseShape_1.default));
exports["default"] = Rectangle;


/***/ }),

/***/ "./src/Shapes/Square.ts":
/*!******************************!*\
  !*** ./src/Shapes/Square.ts ***!
  \******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var BaseShape_1 = __importDefault(__webpack_require__(/*! ../Base/BaseShape */ "./src/Base/BaseShape.ts"));
var Vertex_1 = __importDefault(__webpack_require__(/*! ../Base/Vertex */ "./src/Base/Vertex.ts"));
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(id, color, x1, y1, x2, y2, x3, y3, x4, y4) {
        var _this = _super.call(this, 6, id, color) || this;
        var v1 = new Vertex_1.default(x1, y1);
        var v2 = new Vertex_1.default(x2, y2);
        var v3 = new Vertex_1.default(x3, y3);
        var v4 = new Vertex_1.default(x4, y4);
        _this.pointList.push(v1, v2, v3, v4);
        return _this;
    }
    return Square;
}(BaseShape_1.default));
exports["default"] = Square;


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var AppCanvas_1 = __importDefault(__webpack_require__(/*! ./AppCanvas */ "./src/AppCanvas.ts"));
var CanvasController_1 = __importDefault(__webpack_require__(/*! ./Controllers/Maker/CanvasController */ "./src/Controllers/Maker/CanvasController.ts"));
var ToolbarController_1 = __importDefault(__webpack_require__(/*! ./Controllers/Toolbar/ToolbarController */ "./src/Controllers/Toolbar/ToolbarController.ts"));
var init_1 = __importDefault(__webpack_require__(/*! ./init */ "./src/init.ts"));
var main = function () {
    var initRet = (0, init_1.default)();
    if (!initRet) {
        console.error('Failed to initialize WebGL');
        return;
    }
    var gl = initRet.gl, colorBuffer = initRet.colorBuffer, positionBuffer = initRet.positionBuffer;
    var appCanvas = new AppCanvas_1.default(gl, positionBuffer, colorBuffer);
    var canvasController = new CanvasController_1.default(appCanvas);
    canvasController.start();
    new ToolbarController_1.default(appCanvas);
    // const red = new Color(255, 0, 200)
    // const triangle = new Triangle('tri-1', red, 50, 50, 20, 500, 200, 100);
    // appCanvas.addShape(triangle);
    // const line = new Line('line-1', red, 200, 100, 300, 100);
    // appCanvas.addShape(line);
};
main();


/***/ }),

/***/ "./src/init.ts":
/*!*********************!*\
  !*** ./src/init.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var createShader = function (gl, type, source) {
    var shader = gl.createShader(type);
    if (shader) {
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
        if (success)
            return shader;
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
    }
};
var createProgram = function (gl, vtxShd, frgShd) {
    var program = gl.createProgram();
    if (program) {
        gl.attachShader(program, vtxShd);
        gl.attachShader(program, frgShd);
        gl.linkProgram(program);
        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success)
            return program;
        console.error(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
    }
};
var init = function () {
    var canvas = document.getElementById('c');
    var gl = canvas.getContext('webgl');
    if (!gl) {
        alert('Your browser does not support webGL');
        return;
    }
    // ===========================================
    // Initialize shaders and programs
    // ===========================================
    var vtxShaderSource = document.getElementById('vertex-shader-2d').text;
    var fragShaderSource = document.getElementById('fragment-shader-2d').text;
    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vtxShaderSource);
    var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragShaderSource);
    if (!vertexShader || !fragmentShader)
        return;
    var program = createProgram(gl, vertexShader, fragmentShader);
    if (!program)
        return;
    var dpr = window.devicePixelRatio;
    var _a = canvas.getBoundingClientRect(), width = _a.width, height = _a.height;
    var displayWidth = Math.round(width * dpr);
    var displayHeight = Math.round(height * dpr);
    var needResize = gl.canvas.width != displayWidth || gl.canvas.height != displayHeight;
    if (needResize) {
        gl.canvas.width = displayWidth;
        gl.canvas.height = displayHeight;
    }
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    // ===========================================
    // Enable & initialize uniforms and attributes
    // ===========================================
    // Resolution
    var resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
    // Color
    var colorBuffer = gl.createBuffer();
    if (!colorBuffer) {
        console.error('Failed to create color buffer');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    var colorAttributeLocation = gl.getAttribLocation(program, 'a_color');
    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.vertexAttribPointer(colorAttributeLocation, 3, gl.FLOAT, false, 0, 0);
    // Position
    var positionBuffer = gl.createBuffer();
    if (!positionBuffer) {
        console.error('Failed to create position buffer');
        return;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    var positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
    // Do not remove comments, used for sanity check
    // ============================
    // Set the values of the buffer
    // ============================
    // const colors = [1.0, 0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 0.0];
    // gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    // const positions = [100, 50, 20, 10, 500, 500];
    // gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    // gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    // ====
    // Draw
    // ====
    // gl.drawArrays(gl.TRIANGLES, 0, 3);
    return {
        positionBuffer: positionBuffer,
        colorBuffer: colorBuffer,
        gl: gl,
    };
};
exports["default"] = init;


/***/ }),

/***/ "./src/utils.ts":
/*!**********************!*\
  !*** ./src/utils.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.m3 = exports.degToRad = exports.radToDeg = exports.getAngle = exports.euclideanDistanceVtx = void 0;
var euclideanDistanceVtx = function (a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};
exports.euclideanDistanceVtx = euclideanDistanceVtx;
// 360 DEG
var getAngle = function (origin, target) {
    var plusMinusDeg = (0, exports.radToDeg)(Math.atan2(origin.y - target.y, origin.x - target.x));
    return plusMinusDeg >= 0 ? 180 - plusMinusDeg : Math.abs(plusMinusDeg) + 180;
};
exports.getAngle = getAngle;
var radToDeg = function (rad) {
    return rad * 180 / Math.PI;
};
exports.radToDeg = radToDeg;
var degToRad = function (deg) {
    return deg * Math.PI / 180;
};
exports.degToRad = degToRad;
exports.m3 = {
    identity: function () {
        return [
            1, 0, 0,
            0, 1, 0,
            0, 0, 1,
        ];
    },
    translation: function (tx, ty) {
        return [
            1, 0, 0,
            0, 1, 0,
            tx, ty, 1,
        ];
    },
    rotation: function (angleInRadians) {
        var c = Math.cos(angleInRadians);
        var s = Math.sin(angleInRadians);
        return [
            c, -s, 0,
            s, c, 0,
            0, 0, 1,
        ];
    },
    scaling: function (sx, sy) {
        return [
            sx, 0, 0,
            0, sy, 0,
            0, 0, 1,
        ];
    },
    multiply: function (a, b) {
        var a00 = a[0 * 3 + 0];
        var a01 = a[0 * 3 + 1];
        var a02 = a[0 * 3 + 2];
        var a10 = a[1 * 3 + 0];
        var a11 = a[1 * 3 + 1];
        var a12 = a[1 * 3 + 2];
        var a20 = a[2 * 3 + 0];
        var a21 = a[2 * 3 + 1];
        var a22 = a[2 * 3 + 2];
        var b00 = b[0 * 3 + 0];
        var b01 = b[0 * 3 + 1];
        var b02 = b[0 * 3 + 2];
        var b10 = b[1 * 3 + 0];
        var b11 = b[1 * 3 + 1];
        var b12 = b[1 * 3 + 2];
        var b20 = b[2 * 3 + 0];
        var b21 = b[2 * 3 + 1];
        var b22 = b[2 * 3 + 2];
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
            b10 * a00 + b11 * a10 + b12 * a20,
            b10 * a01 + b11 * a11 + b12 * a21,
            b10 * a02 + b11 * a12 + b12 * a22,
            b20 * a00 + b21 * a10 + b22 * a20,
            b20 * a01 + b21 * a11 + b22 * a21,
            b20 * a02 + b21 * a12 + b22 * a22,
        ];
    },
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixPQUFPO1lBQ0wsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7U0FDbEMsQ0FBQztJQUNKLENBQUM7Q0FDRixDQUFDOzs7Ozs7O1VDekZKO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQXBwQ2FudmFzLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL0Jhc2VTaGFwZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9Db2xvci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9WZXJ0ZXgudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL0NhbnZhc0NvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL0xpbmVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL1JlY3RhbmdsZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvU3F1YXJlTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL0xpbmVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9SZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9TaGFwZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1Rvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvTGluZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1NxdWFyZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL2luaXQudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL0Jhc2UvQmFzZVNoYXBlJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwQ2FudmFzIHtcbiAgICBwcml2YXRlIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQ7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXI7XG4gICAgcHJpdmF0ZSBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXI7XG4gICAgcHJpdmF0ZSBfdXBkYXRlVG9vbGJhcjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgICBwcml2YXRlIF9zaGFwZXM6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4gPSB7fTtcblxuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaGVpZ2h0OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgICAgICAgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLFxuICAgICAgICBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXJcbiAgICApIHtcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQnVmZmVyID0gcG9zaXRpb25CdWZmZXI7XG4gICAgICAgIHRoaXMuY29sb3JCdWZmZXIgPSBjb2xvckJ1ZmZlcjtcblxuICAgICAgICB0aGlzLndpZHRoID0gZ2wuY2FudmFzLndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGdsLmNhbnZhcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICBjb25zdCBwb3NpdGlvbkJ1ZmZlciA9IHRoaXMucG9zaXRpb25CdWZmZXI7XG4gICAgICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gdGhpcy5jb2xvckJ1ZmZlcjtcblxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2hhcGVzKS5mb3JFYWNoKChzaGFwZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gc2hhcGUucG9pbnRMaXN0LmZsYXRNYXAoKHBvaW50KSA9PiBbXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55LFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGNvbnN0IGJhc2VDb2xvclZlY3QgPSBbc2hhcGUuY29sb3Iuciwgc2hhcGUuY29sb3IuZywgc2hhcGUuY29sb3IuYl07XG4gICAgICAgICAgICBsZXQgY29sb3JzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGFwZS5wb2ludExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb2xvcnMgPSBjb2xvcnMuY29uY2F0KGJhc2VDb2xvclZlY3QpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBCaW5kIGNvbG9yIGRhdGFcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxuICAgICAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIEJpbmQgcG9zaXRpb24gZGF0YVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKSxcbiAgICAgICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgZ2wuZHJhd0FycmF5cyhzaGFwZS5nbERyYXdUeXBlLCAwLCBzaGFwZS5wb2ludExpc3QubGVuZ3RoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzaGFwZXMoKTogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVzKHY6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4pIHtcbiAgICAgICAgdGhpcy5fc2hhcGVzID0gdjtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZVRvb2xiYXIpXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVUb29sYmFyLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB1cGRhdGVUb29sYmFyKHYgOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xiYXIgPSB2O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZW5lcmF0ZUlkRnJvbVRhZyh0YWc6IHN0cmluZykge1xuICAgICAgICBjb25zdCB3aXRoU2FtZVRhZyA9IE9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5maWx0ZXIoKGlkKSA9PiBpZC5zdGFydHNXaXRoKHRhZyArICctJykpO1xuICAgICAgICByZXR1cm4gYCR7dGFnfS0ke3dpdGhTYW1lVGFnLmxlbmd0aCArIDF9YFxuICAgIH1cblxuICAgIHB1YmxpYyBhZGRTaGFwZShzaGFwZTogQmFzZVNoYXBlKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMoc2hhcGUuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBhbHJlYWR5IHVzZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcbiAgICAgICAgbmV3U2hhcGVzW3NoYXBlLmlkXSA9IHNoYXBlO1xuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZWRpdFNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMobmV3U2hhcGUuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBub3QgZm91bmQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcbiAgICAgICAgbmV3U2hhcGVzW25ld1NoYXBlLmlkXSA9IG5ld1NoYXBlO1xuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVsZXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NoYXBlIElEIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xuICAgICAgICBkZWxldGUgbmV3U2hhcGVzW25ld1NoYXBlLmlkXTtcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IENvbG9yIGZyb20gXCIuL0NvbG9yXCI7XG5pbXBvcnQgVmVydGV4IGZyb20gXCIuL1ZlcnRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBCYXNlU2hhcGUge1xuICAgIHBvaW50TGlzdDogVmVydGV4W10gPSBbXTtcbiAgICBpZDogc3RyaW5nO1xuICAgIGNvbG9yOiBDb2xvcjtcbiAgICBnbERyYXdUeXBlOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKGdsRHJhd1R5cGU6IG51bWJlciwgaWQ6IHN0cmluZywgY29sb3I6IENvbG9yKSB7XG4gICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IGdsRHJhd1R5cGU7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvciB7XG4gICAgcjogbnVtYmVyO1xuICAgIGc6IG51bWJlcjtcbiAgICBiOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuciA9IHI7XG4gICAgICAgIHRoaXMuZyA9IGc7XG4gICAgICAgIHRoaXMuYiA9IGI7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVydGV4IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGUvSVNoYXBlTWFrZXJDb250cm9sbGVyJztcbmltcG9ydCBMaW5lTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZU1ha2VyQ29udHJvbGxlcic7XG5pbXBvcnQgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyJztcbmltcG9ydCBTcXVhcmVNYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9TcXVhcmVNYWtlckNvbnRyb2xsZXInO1xuXG5lbnVtIEFWQUlMX1NIQVBFUyB7XG4gICAgTGluZSA9IFwiTGluZVwiLFxuICAgIFJlY3RhbmdsZSA9IFwiUmVjdGFuZ2xlXCIsXG4gICAgU3F1YXJlID0gXCJTcXVhcmVcIlxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIF9zaGFwZUNvbnRyb2xsZXI6IElTaGFwZU1ha2VyQ29udHJvbGxlcjtcbiAgICBwcml2YXRlIGNhbnZhc0VsbXQ6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgYnV0dG9uQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG5cbiAgICAgICAgY29uc3QgY2FudmFzRWxtdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3NoYXBlLWJ1dHRvbi1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5jYW52YXNFbG10ID0gY2FudmFzRWxtdDtcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBidXR0b25Db250YWluZXI7XG5cbiAgICAgICAgdGhpcy5fc2hhcGVDb250cm9sbGVyID0gbmV3IExpbmVNYWtlckNvbnRyb2xsZXIoYXBwQ2FudmFzKTtcblxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WCA9IGUub2Zmc2V0WCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgY29uc3QgY29ycmVjdFkgPSBlLm9mZnNldFkgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbzsgICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhjb3JyZWN0WCwgY29ycmVjdFkpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IHNoYXBlQ29udHJvbGxlcigpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVDb250cm9sbGVyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0IHNoYXBlQ29udHJvbGxlcih2OiBJU2hhcGVNYWtlckNvbnRyb2xsZXIpIHtcbiAgICAgICAgdGhpcy5fc2hhcGVDb250cm9sbGVyID0gdjtcblxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WCA9IGUub2Zmc2V0WCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgY29uc3QgY29ycmVjdFkgPSBlLm9mZnNldFkgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhjb3JyZWN0WCwgY29ycmVjdFkpO1xuICAgICAgICB9O1xuICAgIH1cbiAgICBcbiAgICBwcml2YXRlIGluaXRDb250cm9sbGVyKHNoYXBlU3RyOiBBVkFJTF9TSEFQRVMpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgICAgICBzd2l0Y2ggKHNoYXBlU3RyKSB7XG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5MaW5lOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTGluZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5SZWN0YW5nbGU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuU3F1YXJlOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3F1YXJlTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbmNvcnJlY3Qgc2hhcGUgc3RyaW5nJyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGFydCgpIHtcbiAgICAgICAgZm9yIChjb25zdCBzaGFwZVN0ciBpbiBBVkFJTF9TSEFQRVMpIHtcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NoYXBlLWJ1dHRvbicpO1xuICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gc2hhcGVTdHI7XG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9ICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlciA9IHRoaXMuaW5pdENvbnRyb2xsZXIoc2hhcGVTdHIgYXMgQVZBSUxfU0hBUEVTKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBMaW5lIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvTGluZVwiO1xuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XG4gICAgcHJpdmF0ZSBvcmlnaW46IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCByZWQgPSBuZXcgQ29sb3IoMSwgMCwgMCk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdsaW5lJyk7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoaWQsIHJlZCwgdGhpcy5vcmlnaW4ueCwgdGhpcy5vcmlnaW4ueSwgeCwgeSk7XG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZShsaW5lKTtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vLi4vLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL1JlY3RhbmdsZVwiO1xuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGJsYWNrID0gbmV3IENvbG9yKDAsIDAsIDApO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygncmVjdGFuZ2xlJyk7XG4gICAgICAgICAgICBjb25zdCByZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgIGlkLCBibGFjaywgdGhpcy5vcmlnaW4ueCwgdGhpcy5vcmlnaW4ueSx0aGlzLm9yaWdpbi54LCB5LCB4LCB0aGlzLm9yaWdpbi55LCB4LCB5KTtcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHJlY3RhbmdsZSk7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBTcXVhcmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9TcXVhcmVcIjtcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gXCIuL0lTaGFwZU1ha2VyQ29udHJvbGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XG4gICAgcHJpdmF0ZSBvcmlnaW46IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBibGFjayA9IG5ldyBDb2xvcigwLCAwLCAwKTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3NxdWFyZScpO1xuXG4gICAgICAgICAgICBjb25zdCB2MSA9IHt4OiB4LCB5OiB5fTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2MXg6ICR7djEueH0sIHYxeTogJHt2MS55fWApXG5cbiAgICAgICAgICAgIGNvbnN0IHYyID0ge3g6IHRoaXMub3JpZ2luLnggLSAoeSAtIHRoaXMub3JpZ2luLnkpLCBcbiAgICAgICAgICAgICAgICB5OiB0aGlzLm9yaWdpbi55ICsgKHgtdGhpcy5vcmlnaW4ueCl9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjJ4OiAke3YyLnh9LCB2Mnk6ICR7djIueX1gKVxuXG4gICAgICAgICAgICBjb25zdCB2MyA9IHt4OiAyKnRoaXMub3JpZ2luLnggLSB4LCBcbiAgICAgICAgICAgICAgICB5OiAyKnRoaXMub3JpZ2luLnkgLSB5fVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHYzeDogJHt2My54fSwgdjN5OiAke3YzLnl9YClcblxuICAgICAgICAgICAgY29uc3QgdjQgPSB7eDogdGhpcy5vcmlnaW4ueCArICh5IC0gdGhpcy5vcmlnaW4ueSksIFxuICAgICAgICAgICAgICAgIHk6IHRoaXMub3JpZ2luLnkgLSAoeC10aGlzLm9yaWdpbi54KX1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2NHg6ICR7djQueH0sIHY0eTogJHt2NC55fWApXG5cbiAgICAgICAgICAgIGNvbnN0IHNxdWFyZSA9IG5ldyBTcXVhcmUoXG4gICAgICAgICAgICAgICAgaWQsIGJsYWNrLCB2MS54LCB2MS55LCB2Mi54LCB2Mi55LCB2My54LCB2My55LCB2NC54LCB2NC55KTtcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHNxdWFyZSk7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xuaW1wb3J0IExpbmUgZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0xpbmUnO1xuaW1wb3J0IHsgZGVnVG9SYWQsIGV1Y2xpZGVhbkRpc3RhbmNlVnR4LCBnZXRBbmdsZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcbmltcG9ydCBTaGFwZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgbGVuZ3RoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHJvdGF0ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcblxuICAgIHByaXZhdGUgbGluZTogTGluZTtcblxuICAgIGNvbnN0cnVjdG9yKGxpbmU6IExpbmUsIGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHN1cGVyKGxpbmUsIGFwcENhbnZhcyk7XG5cbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcblxuICAgICAgICBjb25zdCBkaWFnb25hbCA9IE1hdGguc3FydChcbiAgICAgICAgICAgIGFwcENhbnZhcy53aWR0aCAqIGFwcENhbnZhcy53aWR0aCArXG4gICAgICAgICAgICAgICAgYXBwQ2FudmFzLmhlaWdodCAqIGFwcENhbnZhcy5oZWlnaHRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5sZW5ndGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdMZW5ndGgnLFxuICAgICAgICAgICAgKCkgPT4gbGluZS5sZW5ndGgsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgZGlhZ29uYWxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVuZ3RoKHBhcnNlSW50KHRoaXMubGVuZ3RoU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFgnLFxuICAgICAgICAgICAgKCkgPT4gbGluZS5wb2ludExpc3RbMF0ueCxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGhcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1hTbGlkZXIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFknLFxuICAgICAgICAgICAgKCkgPT4gbGluZS5wb2ludExpc3RbMF0ueSxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsIHRoaXMuY3VycmVudEFuZ2xlLmJpbmQodGhpcyksIDAsIDM2MCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5yb3RhdGVTbGlkZXIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlTGVuZ3RoKG5ld0xlbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxpbmVMZW4gPSBldWNsaWRlYW5EaXN0YW5jZVZ0eChcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGNvcyA9XG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS54IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS54KSAvIGxpbmVMZW47XG4gICAgICAgIGNvbnN0IHNpbiA9XG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55KSAvIGxpbmVMZW47XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9IG5ld0xlbiAqIGNvcyArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID0gbmV3TGVuICogc2luICsgdGhpcy5saW5lLnBvaW50TGlzdFswXS55O1xuXG4gICAgICAgIHRoaXMubGluZS5sZW5ndGggPSBuZXdMZW47XG5cbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMubGluZS5wb2ludExpc3RbMV0ueCAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS54ID0gbmV3UG9zWDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3UG9zWCArIGRpZmY7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnk7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSA9IG5ld1Bvc1k7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld1Bvc1kgKyBkaWZmO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjdXJyZW50QW5nbGUoKSB7XG4gICAgICAgIHJldHVybiBnZXRBbmdsZSh0aGlzLmxpbmUucG9pbnRMaXN0WzBdLCB0aGlzLmxpbmUucG9pbnRMaXN0WzFdKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKG5ld1JvdDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKG5ld1JvdCk7XG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZCk7XG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XG5cbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID1cbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCArIGNvcyAqIHRoaXMubGluZS5sZW5ndGg7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9XG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnkgLSBzaW4gKiB0aGlzLmxpbmUubGVuZ3RoO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbaWR4XS54ID0geDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFtpZHhdLnkgPSB5O1xuXG4gICAgICAgIHRoaXMubGluZS5sZW5ndGggPSBldWNsaWRlYW5EaXN0YW5jZVZ0eChcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xuICAgIH1cbn1cbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuaW1wb3J0IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIC8vIHByaXZhdGUgd2lkdGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgLy8gcHJpdmF0ZSBsZW5ndGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgLy8gcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIHJlY3RhbmdsZTogUmVjdGFuZ2xlO1xuXG4gICAgY29uc3RydWN0b3IocmVjdGFuZ2xlOiBSZWN0YW5nbGUsIGFwcENhbnZhczogQXBwQ2FudmFzKXtcbiAgICAgICAgc3VwZXIocmVjdGFuZ2xlLCBhcHBDYW52YXMpO1xuICAgICAgICB0aGlzLnJlY3RhbmdsZSA9IHJlY3RhbmdsZTtcblxuICAgICAgICAvLyBYIFBvc2l0aW9uXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBYJywgKCkgPT4gcmVjdGFuZ2xlLmNlbnRlci54LDEsYXBwQ2FudmFzLndpZHRoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1hTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpfSlcblxuICAgICAgICAvLyBZIFBvc2l0aW9uXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBZJywgKCkgPT4gcmVjdGFuZ2xlLmNlbnRlci55LDEsYXBwQ2FudmFzLndpZHRoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1lTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpfSlcblxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOm51bWJlcil7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NYIC0gdGhpcy5yZWN0YW5nbGUuY2VudGVyLng7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaV0ueCArPSBkaWZmO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGVDZW50ZXIoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6bnVtYmVyKXtcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1kgLSB0aGlzLnJlY3RhbmdsZS5jZW50ZXIueTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS55ICs9IGRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZUNlbnRlcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcbiAgICB9XG5cbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRpZmZ5ID0geSAtIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpZHhdLnk7XG4gICAgICAgIGNvbnN0IGRpZmZ4ID0geCAtIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpZHhdLng7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIGlmIChpICE9IGlkeCkge1xuICAgICAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS55ICs9IGRpZmZ5O1xuICAgICAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS54ICs9IGRpZmZ4O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueCA9IHg7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpZHhdLnkgPSB5O1xuXG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGVDZW50ZXIoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgcmVjYWxjdWxhdGVDZW50ZXIoKTogdm9pZCB7XG4gICAgICAgIGxldCBzdW1YID0gMCwgc3VtWSA9IDA7XG4gICAgICAgIGNvbnN0IHZlcnRpY2VzID0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0O1xuICAgICAgICB2ZXJ0aWNlcy5mb3JFYWNoKHZlcnRleCA9PiB7XG4gICAgICAgICAgICBzdW1YICs9IHZlcnRleC54O1xuICAgICAgICAgICAgc3VtWSArPSB2ZXJ0ZXgueTtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLmNlbnRlci54ID0gc3VtWCAvIHZlcnRpY2VzLmxlbmd0aDtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuY2VudGVyLnkgPSBzdW1ZIC8gdmVydGljZXMubGVuZ3RoO1xuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uLy4uLy4uL0Jhc2UvQmFzZVNoYXBlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIHNoYXBlOiBCYXNlU2hhcGU7XG5cbiAgICBwcml2YXRlIHRvb2xiYXJDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgdmVydGV4Q29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcblxuICAgIHByaXZhdGUgdmVydGV4UGlja2VyOiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICBwcml2YXRlIHNlbGVjdGVkVmVydGV4ID0gJzAnO1xuXG4gICAgcHJpdmF0ZSB2dHhQb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSB2dHhQb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgICBwcml2YXRlIHNsaWRlckxpc3Q6IEhUTUxJbnB1dEVsZW1lbnRbXSA9IFtdO1xuICAgIHByaXZhdGUgZ2V0dGVyTGlzdDogKCgpID0+IG51bWJlcilbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3Ioc2hhcGU6IEJhc2VTaGFwZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5zaGFwZSA9IHNoYXBlO1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcblxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICd0b29sYmFyLWNvbnRhaW5lcidcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3ZlcnRleC1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICd2ZXJ0ZXgtcGlja2VyJ1xuICAgICAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVTbGlkZXIoXG4gICAgICAgIGxhYmVsOiBzdHJpbmcsXG4gICAgICAgIHZhbHVlR2V0dGVyOiAoKSA9PiBudW1iZXIsXG4gICAgICAgIG1pbjogbnVtYmVyLFxuICAgICAgICBtYXg6IG51bWJlclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XG5cbiAgICAgICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcbiAgICAgICAgc2xpZGVyLm1heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgICBzbGlkZXIudmFsdWUgPSB2YWx1ZUdldHRlci50b1N0cmluZygpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcblxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgICAgICB0aGlzLnNsaWRlckxpc3QucHVzaChzbGlkZXIpO1xuICAgICAgICB0aGlzLmdldHRlckxpc3QucHVzaCh2YWx1ZUdldHRlcik7XG5cbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcbiAgICB9XG5cbiAgICByZWdpc3RlclNsaWRlcihzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQsIGNiOiAoZTogRXZlbnQpID0+IGFueSkge1xuICAgICAgICBjb25zdCBuZXdDYiA9IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY2IoZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlcnMoc2xpZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBzbGlkZXIub25jaGFuZ2UgPSBuZXdDYjtcbiAgICAgICAgc2xpZGVyLm9uaW5wdXQgPSBuZXdDYjtcbiAgICB9XG5cbiAgICB1cGRhdGVTaGFwZShuZXdTaGFwZTogQmFzZVNoYXBlKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZShuZXdTaGFwZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2xpZGVycyhpZ25vcmVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5zbGlkZXJMaXN0LmZvckVhY2goKHNsaWRlciwgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZiAoaWdub3JlU2xpZGVyID09PSBzbGlkZXIpIHJldHVybjtcbiAgICAgICAgICAgIHNsaWRlci52YWx1ZSA9ICgodGhpcy5nZXR0ZXJMaXN0W2lkeF0pKCkpLnRvU3RyaW5nKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLnZ0eFBvc1hTbGlkZXIgJiYgdGhpcy52dHhQb3NZU2xpZGVyKSB7XG4gICAgICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludCh0aGlzLnZlcnRleFBpY2tlci52YWx1ZSlcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF07XG5cbiAgICAgICAgICAgIHRoaXMudnR4UG9zWFNsaWRlci52YWx1ZSA9IHZlcnRleC54LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIudmFsdWUgPSB2ZXJ0ZXgueS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlU2xpZGVyVmVydGV4KFxuICAgICAgICBsYWJlbDogc3RyaW5nLFxuICAgICAgICBjdXJyZW50TGVuZ3RoOiBudW1iZXIsXG4gICAgICAgIG1pbjogbnVtYmVyLFxuICAgICAgICBtYXg6IG51bWJlclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XG5cbiAgICAgICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcbiAgICAgICAgc2xpZGVyLm1heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgICBzbGlkZXIudmFsdWUgPSBjdXJyZW50TGVuZ3RoLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcbiAgICB9XG5cbiAgICBkcmF3VmVydGV4VG9vbGJhcigpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMudmVydGV4Q29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKTtcblxuICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludCh0aGlzLnZlcnRleFBpY2tlci52YWx1ZSlcbiAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy5zaGFwZS5wb2ludExpc3RbaWR4XTtcblxuICAgICAgICB0aGlzLnZ0eFBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcbiAgICAgICAgICAgICdQb3MgWCcsXG4gICAgICAgICAgICB2ZXJ0ZXgueCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy53aWR0aFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcbiAgICAgICAgICAgICdQb3MgWScsXG4gICAgICAgICAgICB2ZXJ0ZXgueSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5oZWlnaHRcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCB1cGRhdGVTbGlkZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy52dHhQb3NYU2xpZGVyICYmIHRoaXMudnR4UG9zWVNsaWRlcilcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZlcnRleChpZHgsIHBhcnNlSW50KHRoaXMudnR4UG9zWFNsaWRlci52YWx1ZSksIHBhcnNlSW50KHRoaXMudnR4UG9zWVNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhQb3NYU2xpZGVyLCB1cGRhdGVTbGlkZXIpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4UG9zWVNsaWRlciwgdXBkYXRlU2xpZGVyKTtcbiAgICB9XG5cbiAgICBpbml0VmVydGV4VG9vbGJhcigpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMudmVydGV4UGlja2VyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleFBpY2tlci5maXJzdENoaWxkKTtcblxuICAgICAgICB0aGlzLnNoYXBlLnBvaW50TGlzdC5mb3JFYWNoKChfLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaWR4LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBvcHRpb24ubGFiZWwgPSBgVmVydGV4ICR7aWR4fWA7XG4gICAgICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRWZXJ0ZXg7XG4gICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcblxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZDtcbn1cbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uL1NoYXBlcy9MaW5lJztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgTGluZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBJU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIHRvb2xiYXJDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgaXRlbVBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZElkOiBzdHJpbmcgPSAnJztcblxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRyb2xsZXI6IElTaGFwZVRvb2xiYXJDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICAgICAgdGhpcy5hcHBDYW52YXMudXBkYXRlVG9vbGJhciA9IHRoaXMudXBkYXRlU2hhcGVMaXN0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5pdGVtUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndG9vbGJhci1pdGVtLXBpY2tlcidcbiAgICAgICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcblxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIub25jaGFuZ2UgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZElkID0gdGhpcy5pdGVtUGlja2VyLnZhbHVlO1xuICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLmFwcENhbnZhcy5zaGFwZXNbdGhpcy5pdGVtUGlja2VyLnZhbHVlXTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xuXG4gICAgICAgICAgICBpZiAoc2hhcGUgaW5zdGFuY2VvZiBMaW5lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBMaW5lVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgTGluZSwgYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUgaW5zdGFuY2VvZiBSZWN0YW5nbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFJlY3RhbmdsZSwgYXBwQ2FudmFzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGVMaXN0KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2hhcGVMaXN0KCkge1xuICAgICAgICB3aGlsZSAodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLml0ZW1QaWNrZXIucmVtb3ZlQ2hpbGQodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgcGxhY2Vob2xkZXIudGV4dCA9ICdDaG9vc2UgYW4gb2JqZWN0JztcbiAgICAgICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcblxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuYXBwQ2FudmFzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBjaGlsZC50ZXh0ID0gc2hhcGUuaWQ7XG4gICAgICAgICAgICBjaGlsZC52YWx1ZSA9IHNoYXBlLmlkO1xuICAgICAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLnZhbHVlID0gdGhpcy5zZWxlY3RlZElkO1xuXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5hcHBDYW52YXMuc2hhcGVzKS5pbmNsdWRlcyh0aGlzLnNlbGVjdGVkSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhclRvb2xiYXJFbG10KCkge1xuICAgICAgICB3aGlsZSAodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgICBsZW5ndGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBlbmRYOiBudW1iZXIsIGVuZFk6IG51bWJlcikge1xuICAgICAgICBzdXBlcigxLCBpZCwgY29sb3IpO1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gbmV3IFZlcnRleChzdGFydFgsIHN0YXJ0WSk7XG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBWZXJ0ZXgoZW5kWCwgZW5kWSk7XG5cbiAgICAgICAgdGhpcy5sZW5ndGggPSBldWNsaWRlYW5EaXN0YW5jZVZ0eChcbiAgICAgICAgICAgIG9yaWdpbixcbiAgICAgICAgICAgIGVuZFxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2gob3JpZ2luLCBlbmQpO1xuICAgIH1cbn0iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICAgIHB1YmxpYyBjZW50ZXI6IHt4OiBudW1iZXIsIHk6bnVtYmVyfVxuXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCB4NDogbnVtYmVyLCB5NDogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKDUgLGlkLCBjb2xvcik7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB2MSA9IG5ldyBWZXJ0ZXgoeDEsIHkxKTtcbiAgICAgICAgY29uc3QgdjIgPSBuZXcgVmVydGV4KHgyLCB5Mik7XG4gICAgICAgIGNvbnN0IHYzID0gbmV3IFZlcnRleCh4MywgeTMpO1xuICAgICAgICBjb25zdCB2NCA9IG5ldyBWZXJ0ZXgoeDQsIHk0KTtcblxuICAgICAgICB0aGlzLmNlbnRlciA9IHt4OiAodjEueCt2My54KS8yLCB5OiAodjEueSt2My55KS8yfTtcblxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKHYxLCB2MiwgdjMsIHY0KTtcbiAgICB9XG59IiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIHg0OiBudW1iZXIsIHk0OiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoNiAsaWQsIGNvbG9yKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHYxID0gbmV3IFZlcnRleCh4MSwgeTEpO1xuICAgICAgICBjb25zdCB2MiA9IG5ldyBWZXJ0ZXgoeDIsIHkyKTtcbiAgICAgICAgY29uc3QgdjMgPSBuZXcgVmVydGV4KHgzLCB5Myk7XG4gICAgICAgIGNvbnN0IHY0ID0gbmV3IFZlcnRleCh4NCwgeTQpO1xuXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godjEsIHYyLCB2MywgdjQpO1xuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4vQXBwQ2FudmFzJztcbmltcG9ydCBDYW52YXNDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcnMvTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XG5pbXBvcnQgVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVycy9Ub29sYmFyL1Rvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBpbml0IGZyb20gJy4vaW5pdCc7XG5cbmNvbnN0IG1haW4gPSAoKSA9PiB7XG4gICAgY29uc3QgaW5pdFJldCA9IGluaXQoKTtcbiAgICBpZiAoIWluaXRSZXQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGluaXRpYWxpemUgV2ViR0wnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgZ2wsIGNvbG9yQnVmZmVyLCBwb3NpdGlvbkJ1ZmZlciB9ID0gaW5pdFJldDtcblxuICAgIGNvbnN0IGFwcENhbnZhcyA9IG5ldyBBcHBDYW52YXMoZ2wsIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XG4gICAgXG4gICAgY29uc3QgY2FudmFzQ29udHJvbGxlciA9IG5ldyBDYW52YXNDb250cm9sbGVyKGFwcENhbnZhcyk7XG4gICAgY2FudmFzQ29udHJvbGxlci5zdGFydCgpO1xuICAgIFxuICAgIG5ldyBUb29sYmFyQ29udHJvbGxlcihhcHBDYW52YXMpO1xuXG4gICAgLy8gY29uc3QgcmVkID0gbmV3IENvbG9yKDI1NSwgMCwgMjAwKVxuICAgIC8vIGNvbnN0IHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKCd0cmktMScsIHJlZCwgNTAsIDUwLCAyMCwgNTAwLCAyMDAsIDEwMCk7XG4gICAgLy8gYXBwQ2FudmFzLmFkZFNoYXBlKHRyaWFuZ2xlKTtcblxuICAgIC8vIGNvbnN0IGxpbmUgPSBuZXcgTGluZSgnbGluZS0xJywgcmVkLCAyMDAsIDEwMCwgMzAwLCAxMDApO1xuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShsaW5lKTtcbn07XG5cbm1haW4oKTtcbiIsImNvbnN0IGNyZWF0ZVNoYWRlciA9IChcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxuICAgIHR5cGU6IG51bWJlcixcbiAgICBzb3VyY2U6IHN0cmluZ1xuKSA9PiB7XG4gICAgY29uc3Qgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuICAgIGlmIChzaGFkZXIpIHtcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHNoYWRlcjtcblxuICAgICAgICBjb25zb2xlLmVycm9yKGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XG4gICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xuICAgIH1cbn07XG5cbmNvbnN0IGNyZWF0ZVByb2dyYW0gPSAoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgICB2dHhTaGQ6IFdlYkdMU2hhZGVyLFxuICAgIGZyZ1NoZDogV2ViR0xTaGFkZXJcbikgPT4ge1xuICAgIGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgaWYgKHByb2dyYW0pIHtcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZ0eFNoZCk7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmdTaGQpO1xuICAgICAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHByb2dyYW07XG5cbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKSk7XG4gICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XG4gICAgfVxufTtcblxuY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJyk7XG5cbiAgICBpZiAoIWdsKSB7XG4gICAgICAgIGFsZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB3ZWJHTCcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEluaXRpYWxpemUgc2hhZGVycyBhbmQgcHJvZ3JhbXNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgdnR4U2hhZGVyU291cmNlID0gKFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVydGV4LXNoYWRlci0yZCcpIGFzIEhUTUxTY3JpcHRFbGVtZW50XG4gICAgKS50ZXh0O1xuICAgIGNvbnN0IGZyYWdTaGFkZXJTb3VyY2UgPSAoXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcmFnbWVudC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxuICAgICkudGV4dDtcblxuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IGNyZWF0ZVNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnR4U2hhZGVyU291cmNlKTtcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGNyZWF0ZVNoYWRlcihcbiAgICAgICAgZ2wsXG4gICAgICAgIGdsLkZSQUdNRU5UX1NIQURFUixcbiAgICAgICAgZnJhZ1NoYWRlclNvdXJjZVxuICAgICk7XG4gICAgaWYgKCF2ZXJ0ZXhTaGFkZXIgfHwgIWZyYWdtZW50U2hhZGVyKSByZXR1cm47XG5cbiAgICBjb25zdCBwcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShnbCwgdmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcik7XG4gICAgaWYgKCFwcm9ncmFtKSByZXR1cm47XG5cbiAgICBjb25zdCBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZGlzcGxheVdpZHRoICA9IE1hdGgucm91bmQod2lkdGggKiBkcHIpO1xuICAgIGNvbnN0IGRpc3BsYXlIZWlnaHQgPSBNYXRoLnJvdW5kKGhlaWdodCAqIGRwcik7XG5cbiAgICBjb25zdCBuZWVkUmVzaXplID1cbiAgICAgICAgZ2wuY2FudmFzLndpZHRoICE9IGRpc3BsYXlXaWR0aCB8fCBnbC5jYW52YXMuaGVpZ2h0ICE9IGRpc3BsYXlIZWlnaHQ7XG5cbiAgICBpZiAobmVlZFJlc2l6ZSkge1xuICAgICAgICBnbC5jYW52YXMud2lkdGggPSBkaXNwbGF5V2lkdGg7XG4gICAgICAgIGdsLmNhbnZhcy5oZWlnaHQgPSBkaXNwbGF5SGVpZ2h0O1xuICAgIH1cblxuICAgIGdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XG4gICAgZ2wuY2xlYXJDb2xvcigwLCAwLCAwLCAwKTtcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEVuYWJsZSAmIGluaXRpYWxpemUgdW5pZm9ybXMgYW5kIGF0dHJpYnV0ZXNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gUmVzb2x1dGlvblxuICAgIGNvbnN0IHJlc29sdXRpb25Vbmlmb3JtTG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oXG4gICAgICAgIHByb2dyYW0sXG4gICAgICAgICd1X3Jlc29sdXRpb24nXG4gICAgKTtcbiAgICBnbC51bmlmb3JtMmYocmVzb2x1dGlvblVuaWZvcm1Mb2NhdGlvbiwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTtcblxuICAgIC8vIENvbG9yXG4gICAgY29uc3QgY29sb3JCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICBpZiAoIWNvbG9yQnVmZmVyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgY29sb3IgYnVmZmVyJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xuICAgIGNvbnN0IGNvbG9yQXR0cmlidXRlTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYV9jb2xvcicpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGNvbG9yQXR0cmlidXRlTG9jYXRpb24pO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoY29sb3JBdHRyaWJ1dGVMb2NhdGlvbiwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIFBvc2l0aW9uXG4gICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICBpZiAoIXBvc2l0aW9uQnVmZmVyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgcG9zaXRpb24gYnVmZmVyJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xuICAgIGNvbnN0IHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihcbiAgICAgICAgcHJvZ3JhbSxcbiAgICAgICAgJ2FfcG9zaXRpb24nXG4gICAgKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyBEbyBub3QgcmVtb3ZlIGNvbW1lbnRzLCB1c2VkIGZvciBzYW5pdHkgY2hlY2tcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU2V0IHRoZSB2YWx1ZXMgb2YgdGhlIGJ1ZmZlclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIC8vIGNvbnN0IGNvbG9ycyA9IFsxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wXTtcbiAgICAvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xuICAgIC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIGNvbnN0IHBvc2l0aW9ucyA9IFsxMDAsIDUwLCAyMCwgMTAsIDUwMCwgNTAwXTtcbiAgICAvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xuICAgIC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vID09PT1cbiAgICAvLyBEcmF3XG4gICAgLy8gPT09PVxuICAgIC8vIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCAzKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uQnVmZmVyLFxuICAgICAgICBjb2xvckJ1ZmZlcixcbiAgICAgICAgZ2wsXG4gICAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG4iLCJpbXBvcnQgVmVydGV4IGZyb20gJy4vQmFzZS9WZXJ0ZXgnO1xuXG5leHBvcnQgY29uc3QgZXVjbGlkZWFuRGlzdGFuY2VWdHggPSAoYTogVmVydGV4LCBiOiBWZXJ0ZXgpOiBudW1iZXIgPT4ge1xuICAgIGNvbnN0IGR4ID0gYS54IC0gYi54O1xuICAgIGNvbnN0IGR5ID0gYS55IC0gYi55O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG59O1xuXG4vLyAzNjAgREVHXG5leHBvcnQgY29uc3QgZ2V0QW5nbGUgPSAob3JpZ2luOiBWZXJ0ZXgsIHRhcmdldDogVmVydGV4KSA9PiB7XG4gICAgY29uc3QgcGx1c01pbnVzRGVnID0gcmFkVG9EZWcoTWF0aC5hdGFuMihvcmlnaW4ueSAtIHRhcmdldC55LCBvcmlnaW4ueCAtIHRhcmdldC54KSk7XG4gICAgcmV0dXJuIHBsdXNNaW51c0RlZyA+PSAwID8gMTgwIC0gcGx1c01pbnVzRGVnIDogTWF0aC5hYnMocGx1c01pbnVzRGVnKSArIDE4MDtcbn1cblxuZXhwb3J0IGNvbnN0IHJhZFRvRGVnID0gKHJhZDogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIHJhZCAqIDE4MCAvIE1hdGguUEk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWdUb1JhZCA9IChkZWc6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG5leHBvcnQgY29uc3QgbTMgPSB7XG4gICAgaWRlbnRpdHk6IGZ1bmN0aW9uKCkgOiBudW1iZXJbXSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAxLCAwLCAwLFxuICAgICAgICAwLCAxLCAwLFxuICAgICAgICAwLCAwLCAxLFxuICAgICAgXTtcbiAgICB9LFxuICBcbiAgICB0cmFuc2xhdGlvbjogZnVuY3Rpb24odHggOiBudW1iZXIsIHR5IDogbnVtYmVyKSA6IG51bWJlcltdIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIDEsIDAsIDAsXG4gICAgICAgIDAsIDEsIDAsXG4gICAgICAgIHR4LCB0eSwgMSxcbiAgICAgIF07XG4gICAgfSxcbiAgXG4gICAgcm90YXRpb246IGZ1bmN0aW9uKGFuZ2xlSW5SYWRpYW5zIDogbnVtYmVyKSA6IG51bWJlcltdIHtcbiAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgYywtcywgMCxcbiAgICAgICAgcywgYywgMCxcbiAgICAgICAgMCwgMCwgMSxcbiAgICAgIF07XG4gICAgfSxcbiAgXG4gICAgc2NhbGluZzogZnVuY3Rpb24oc3ggOiBudW1iZXIsIHN5IDogbnVtYmVyKSA6IG51bWJlcltdIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHN4LCAwLCAwLFxuICAgICAgICAwLCBzeSwgMCxcbiAgICAgICAgMCwgMCwgMSxcbiAgICAgIF07XG4gICAgfSxcbiAgXG4gICAgbXVsdGlwbHk6IGZ1bmN0aW9uKGEgOiBudW1iZXJbXSwgYiA6IG51bWJlcltdKSA6IG51bWJlcltdIHtcbiAgICAgIGNvbnN0IGEwMCA9IGFbMCAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGEwMSA9IGFbMCAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGEwMiA9IGFbMCAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGExMCA9IGFbMSAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGExMSA9IGFbMSAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGExMiA9IGFbMSAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGEyMCA9IGFbMiAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGEyMSA9IGFbMiAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGEyMiA9IGFbMiAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGIwMCA9IGJbMCAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGIwMSA9IGJbMCAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGIwMiA9IGJbMCAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGIxMCA9IGJbMSAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGIxMSA9IGJbMSAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGIxMiA9IGJbMSAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGIyMCA9IGJbMiAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGIyMSA9IGJbMiAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGIyMiA9IGJbMiAqIDMgKyAyXTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMCxcbiAgICAgICAgYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxLFxuICAgICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXG4gICAgICAgIGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMCxcbiAgICAgICAgYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxLFxuICAgICAgICBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjIsXG4gICAgICAgIGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMCxcbiAgICAgICAgYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxLFxuICAgICAgICBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjIsXG4gICAgICBdO1xuICAgIH0sXG4gIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9