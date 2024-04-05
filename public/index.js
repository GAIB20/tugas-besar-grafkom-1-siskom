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
    function AppCanvas(gl, program, positionBuffer, colorBuffer) {
        this._updateToolbar = null;
        this._shapes = {};
        this.gl = gl;
        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;
        this.program = program;
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        this.render();
    }
    AppCanvas.prototype.render = function () {
        var _this = this;
        var gl = this.gl;
        var positionBuffer = this.positionBuffer;
        var colorBuffer = this.colorBuffer;
        Object.values(this.shapes).forEach(function (shape) {
            var positions = shape.pointList.flatMap(function (point) { return [
                point.x,
                point.y,
            ]; });
            var colors = [];
            for (var i = 0; i < shape.pointList.length; i++) {
                colors.push(shape.pointList[i].c.r, shape.pointList[i].c.g, shape.pointList[i].c.b);
            }
            // Bind color data
            gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
            // Bind position data
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
            if (!(_this.positionBuffer instanceof WebGLBuffer)) {
                throw new Error("Position buffer is not a valid WebGLBuffer");
            }
            if (!(_this.colorBuffer instanceof WebGLBuffer)) {
                throw new Error("Color buffer is not a valid WebGLBuffer");
            }
            // Set transformation matrix
            // shape.setTransformationMatrix();
            var matrixLocation = gl.getUniformLocation(_this.program, "u_transformation");
            var matrix = new Float32Array(shape.transformationMatrix);
            gl.uniformMatrix3fv(matrixLocation, false, matrix);
            // const applySpecialTreatmentLocation = gl.getUniformLocation(this.program, "u_applySpecialTreatment");
            // const specialOffsetLocation = gl.getUniformLocation(this.program, "u_specialOffset");
            // const applySpecialTreatment = false; 
            // const specialOffset = [0.0, 0.0];
            // gl.uniform1i(applySpecialTreatmentLocation, applySpecialTreatment ? 1 : 0);
            // gl.uniform2fv(specialOffsetLocation, new Float32Array(specialOffset));
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
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var Vertex_1 = __importDefault(__webpack_require__(/*! ./Vertex */ "./src/Base/Vertex.ts"));
var BaseShape = /** @class */ (function () {
    function BaseShape(glDrawType, id, color, center, rotation, scaleX, scaleY) {
        if (center === void 0) { center = new Vertex_1.default(0, 0, color); }
        if (rotation === void 0) { rotation = 0; }
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        this.pointList = [];
        this.bufferTransformationList = [];
        this.translation = [0, 0];
        this.angleInRadians = 0;
        this.scale = [1, 1];
        this.transformationMatrix = utils_1.m3.identity();
        this.glDrawType = glDrawType;
        this.id = id;
        this.color = color;
        this.center = center;
        this.angleInRadians = rotation;
        this.scale[0] = scaleX;
        this.scale[1] = scaleY;
    }
    BaseShape.prototype.setTransformationMatrix = function () {
        this.transformationMatrix = utils_1.m3.identity();
        var translateToCenter = utils_1.m3.translation(-this.center.x, -this.center.y);
        var rotation = utils_1.m3.rotation(this.angleInRadians);
        var scaling = utils_1.m3.scaling(this.scale[0], this.scale[1]);
        var translateBack = utils_1.m3.translation(this.center.x, this.center.y);
        var translate = utils_1.m3.translation(this.translation[0], this.translation[1]);
        var resScale = utils_1.m3.multiply(scaling, translateToCenter);
        var resRotate = utils_1.m3.multiply(rotation, resScale);
        var resBack = utils_1.m3.multiply(translateBack, resRotate);
        var resTranslate = utils_1.m3.multiply(translate, resBack);
        this.transformationMatrix = resTranslate;
    };
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
    function Vertex(x, y, c, isSelected) {
        if (isSelected === void 0) { isSelected = false; }
        this.isSelected = false;
        this.x = x;
        this.y = y;
        this.c = c;
        this.isSelected = isSelected;
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
var FanPolygonMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/FanPolygonMakerController */ "./src/Controllers/Maker/Shape/FanPolygonMakerController.ts"));
var LineMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/LineMakerController */ "./src/Controllers/Maker/Shape/LineMakerController.ts"));
var RectangleMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/RectangleMakerController */ "./src/Controllers/Maker/Shape/RectangleMakerController.ts"));
var SquareMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/SquareMakerController */ "./src/Controllers/Maker/Shape/SquareMakerController.ts"));
var AVAIL_SHAPES;
(function (AVAIL_SHAPES) {
    AVAIL_SHAPES["Line"] = "Line";
    AVAIL_SHAPES["Rectangle"] = "Rectangle";
    AVAIL_SHAPES["Square"] = "Square";
    AVAIL_SHAPES["FanPoly"] = "FanPoly";
})(AVAIL_SHAPES || (AVAIL_SHAPES = {}));
var CanvasController = /** @class */ (function () {
    function CanvasController(appCanvas) {
        var _this = this;
        this.appCanvas = appCanvas;
        var canvasElmt = document.getElementById('c');
        var buttonContainer = document.getElementById('shape-button-container');
        this.setPolygonButton = document.getElementById('set-polygon');
        this.canvasElmt = canvasElmt;
        this.buttonContainer = buttonContainer;
        this.setPolygonButton.classList.add('hidden');
        this._shapeController = new FanPolygonMakerController_1.default(appCanvas);
        this.colorPicker = document.getElementById('shape-color-picker');
        this.canvasElmt.onclick = function (e) {
            var _a;
            var correctX = e.offsetX * window.devicePixelRatio;
            var correctY = e.offsetY * window.devicePixelRatio;
            (_a = _this.shapeController) === null || _a === void 0 ? void 0 : _a.handleClick(correctX, correctY, _this.colorPicker.value);
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
                (_a = _this.shapeController) === null || _a === void 0 ? void 0 : _a.handleClick(correctX, correctY, _this.colorPicker.value);
            };
        },
        enumerable: false,
        configurable: true
    });
    CanvasController.prototype.initController = function (shapeStr) {
        this.setPolygonButton.classList.add('hidden');
        switch (shapeStr) {
            case AVAIL_SHAPES.Line:
                return new LineMakerController_1.default(this.appCanvas);
            case AVAIL_SHAPES.Rectangle:
                return new RectangleMakerController_1.default(this.appCanvas);
            case AVAIL_SHAPES.Square:
                return new SquareMakerController_1.default(this.appCanvas);
            case AVAIL_SHAPES.FanPoly:
                return new FanPolygonMakerController_1.default(this.appCanvas);
            default:
                throw new Error('Incorrect shape string');
        }
    };
    CanvasController.prototype.editExistingFanPolygon = function (id) {
        this.shapeController = new FanPolygonMakerController_1.default(this.appCanvas);
        this.shapeController.setCurrentPolygon(id);
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

/***/ "./src/Controllers/Maker/Shape/FanPolygonMakerController.ts":
/*!******************************************************************!*\
  !*** ./src/Controllers/Maker/Shape/FanPolygonMakerController.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Color_1 = __importDefault(__webpack_require__(/*! ../../../Base/Color */ "./src/Base/Color.ts"));
var Vertex_1 = __importDefault(__webpack_require__(/*! ../../../Base/Vertex */ "./src/Base/Vertex.ts"));
var FanPolygon_1 = __importDefault(__webpack_require__(/*! ../../../Shapes/FanPolygon */ "./src/Shapes/FanPolygon.ts"));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var FanPolygonMakerController = /** @class */ (function () {
    function FanPolygonMakerController(appCanvas) {
        var _this = this;
        this.origin = null;
        this.currentPoly = null;
        this.appCanvas = appCanvas;
        this.setPolygonButton = document.getElementById('set-polygon');
        this.setPolygonButton.classList.remove('hidden');
        this.setPolygonButton.onclick = function (e) {
            e.preventDefault();
            if (_this.origin !== null &&
                _this.currentPoly !== null &&
                _this.currentPoly.pointList.length > 2) {
                _this.currentPoly = null;
                _this.origin = null;
            }
        };
    }
    FanPolygonMakerController.prototype.setCurrentPolygon = function (id) {
        this.currentPoly = this.appCanvas.shapes[id];
        this.origin = this.currentPoly.pointList[0];
    };
    FanPolygonMakerController.prototype.handleClick = function (x, y, hex) {
        var _a;
        var _b = (_a = (0, utils_1.hexToRgb)(hex)) !== null && _a !== void 0 ? _a : { r: 0, g: 0, b: 0 }, r = _b.r, g = _b.g, b = _b.b;
        var color = new Color_1.default(r / 255, g / 255, b / 255);
        if (this.origin === null) {
            this.origin = new Vertex_1.default(x, y, color);
        }
        else if (this.origin !== null && this.currentPoly === null) {
            var newVertex = new Vertex_1.default(x, y, color);
            var id = this.appCanvas.generateIdFromTag('polyfan');
            this.currentPoly = new FanPolygon_1.default(id, color, [this.origin, newVertex]);
            this.appCanvas.addShape(this.currentPoly);
        }
        else {
            var newVertex = new Vertex_1.default(x, y, color);
            if (this.currentPoly) {
                this.currentPoly.addVertex(newVertex);
                this.appCanvas.editShape(this.currentPoly);
            }
        }
    };
    return FanPolygonMakerController;
}());
exports["default"] = FanPolygonMakerController;


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
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var LineMakerController = /** @class */ (function () {
    function LineMakerController(appCanvas) {
        this.origin = null;
        this.appCanvas = appCanvas;
    }
    LineMakerController.prototype.handleClick = function (x, y, hex) {
        var _a;
        if (this.origin === null) {
            this.origin = { x: x, y: y };
        }
        else {
            var _b = (_a = (0, utils_1.hexToRgb)(hex)) !== null && _a !== void 0 ? _a : { r: 0, g: 0, b: 0 }, r = _b.r, g = _b.g, b = _b.b;
            var color = new Color_1.default(r / 255, g / 255, b / 255);
            var id = this.appCanvas.generateIdFromTag('line');
            var line = new Line_1.default(id, color, this.origin.x, this.origin.y, x, y);
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
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var RectangleMakerController = /** @class */ (function () {
    function RectangleMakerController(appCanvas) {
        this.origin = null;
        this.appCanvas = appCanvas;
    }
    RectangleMakerController.prototype.handleClick = function (x, y, hex) {
        var _a;
        if (this.origin === null) {
            this.origin = { x: x, y: y };
        }
        else {
            var _b = (_a = (0, utils_1.hexToRgb)(hex)) !== null && _a !== void 0 ? _a : { r: 0, g: 0, b: 0 }, r = _b.r, g = _b.g, b = _b.b;
            var color = new Color_1.default(r / 255, g / 255, b / 255);
            var id = this.appCanvas.generateIdFromTag('rectangle');
            var rectangle = new Rectangle_1.default(id, color, this.origin.x, this.origin.y, x, y, 0, 1, 1);
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
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var SquareMakerController = /** @class */ (function () {
    function SquareMakerController(appCanvas) {
        this.origin = null;
        this.appCanvas = appCanvas;
    }
    SquareMakerController.prototype.handleClick = function (x, y, hex) {
        var _a;
        if (this.origin === null) {
            this.origin = { x: x, y: y };
        }
        else {
            var _b = (_a = (0, utils_1.hexToRgb)(hex)) !== null && _a !== void 0 ? _a : { r: 0, g: 0, b: 0 }, r = _b.r, g = _b.g, b = _b.b;
            var color = new Color_1.default(r / 255, g / 255, b / 255);
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
            var square = new Square_1.default(id, color, v1.x, v1.y, v2.x, v2.y, v3.x, v3.y, v4.x, v4.y);
            this.appCanvas.addShape(square);
            this.origin = null;
        }
    };
    return SquareMakerController;
}());
exports["default"] = SquareMakerController;


/***/ }),

/***/ "./src/Controllers/Toolbar/Shape/FanPolygonToolbarController.ts":
/*!**********************************************************************!*\
  !*** ./src/Controllers/Toolbar/Shape/FanPolygonToolbarController.ts ***!
  \**********************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var ShapeToolbarController_1 = __webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts");
var FanPolygonToolbarController = /** @class */ (function (_super) {
    __extends(FanPolygonToolbarController, _super);
    function FanPolygonToolbarController(fanPoly, appCanvas, canvasController) {
        var _this = _super.call(this, fanPoly, appCanvas) || this;
        _this.DEFAULT_SCALE = 50;
        _this.currentScale = 50;
        _this.canvasController = canvasController;
        _this.fanPoly = fanPoly;
        _this.posXSlider = _this.createSlider('Position X', function () { return fanPoly.pointList[0].x; }, 1, appCanvas.width);
        _this.registerSlider(_this.posXSlider, function () {
            _this.updatePosX(parseInt(_this.posXSlider.value));
        });
        _this.posYSlider = _this.createSlider('Position Y', function () { return fanPoly.pointList[0].y; }, 1, appCanvas.height);
        _this.registerSlider(_this.posYSlider, function () {
            _this.updatePosY(parseInt(_this.posYSlider.value));
        });
        _this.scaleSlider = _this.createSlider('Scale', _this.getCurrentScale.bind(_this), 1, 100);
        _this.registerSlider(_this.scaleSlider, function () {
            _this.updateScale(parseInt(_this.scaleSlider.value));
        });
        return _this;
    }
    FanPolygonToolbarController.prototype.customVertexToolbar = function () {
        var _this = this;
        var addVtxButton = this.createVertexButton('Add Vertex');
        addVtxButton.onclick = function (e) {
            e.preventDefault();
            _this.canvasController.editExistingFanPolygon(_this.fanPoly.id);
            _this.initVertexToolbar();
        };
        var removeVtxButton = this.createVertexButton('Remove Vertex');
        removeVtxButton.onclick = function (e) {
            e.preventDefault();
            _this.fanPoly.removeVertex(parseInt(_this.selectedVertex));
            _this.initVertexToolbar();
            _this.updateShape(_this.fanPoly);
        };
        var refreshVertexList = this.createVertexButton("Refresh Vertices Dropdown");
        refreshVertexList.onclick = function (e) {
            e.preventDefault();
            _this.initVertexToolbar();
        };
    };
    FanPolygonToolbarController.prototype.createVertexButton = function (text) {
        var button = document.createElement('button');
        button.textContent = text;
        this.vertexContainer.appendChild(button);
        return button;
    };
    FanPolygonToolbarController.prototype.updatePosX = function (newPosX) {
        var diff = newPosX - this.fanPoly.pointList[0].x;
        this.fanPoly.pointList = this.fanPoly.pointList.map(function (vtx) {
            vtx.x += diff;
            return vtx;
        });
        this.fanPoly.recalc();
        this.updateShape(this.fanPoly);
    };
    FanPolygonToolbarController.prototype.updatePosY = function (newPosY) {
        var diff = newPosY - this.fanPoly.pointList[0].y;
        this.fanPoly.pointList = this.fanPoly.pointList.map(function (vtx, idx) {
            vtx.y += diff;
            return vtx;
        });
        this.fanPoly.recalc();
        this.updateShape(this.fanPoly);
    };
    FanPolygonToolbarController.prototype.getCurrentScale = function () {
        return this.currentScale;
    };
    FanPolygonToolbarController.prototype.updateScale = function (newScale) {
        var _this = this;
        this.currentScale = newScale;
        this.fanPoly.pointList = this.fanPoly.pointList.map(function (vtx, idx) {
            var rad = (0, utils_1.degToRad)((0, utils_1.getAngle)(_this.fanPoly.center, vtx));
            var cos = Math.cos(rad);
            var sin = Math.sin(rad);
            vtx.x =
                _this.fanPoly.center.x +
                    cos *
                        _this.fanPoly.lenList[idx] *
                        (newScale / _this.DEFAULT_SCALE);
            vtx.y =
                _this.fanPoly.center.y -
                    sin *
                        _this.fanPoly.lenList[idx] *
                        (newScale / _this.DEFAULT_SCALE);
            return vtx;
        });
        this.updateShape(this.fanPoly);
    };
    FanPolygonToolbarController.prototype.updateVertex = function (idx, x, y) {
        this.fanPoly.pointList[idx].x = x;
        this.fanPoly.pointList[idx].y = y;
        this.fanPoly.recalc();
        this.updateShape(this.fanPoly);
    };
    return FanPolygonToolbarController;
}(ShapeToolbarController_1.ShapeToolbarController));
exports["default"] = FanPolygonToolbarController;


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
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var ShapeToolbarController_1 = __webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts");
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
    LineToolbarController.prototype.customVertexToolbar = function () { };
    return LineToolbarController;
}(ShapeToolbarController_1.ShapeToolbarController));
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var ShapeToolbarController_1 = __webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts");
var RectangleToolbarController = /** @class */ (function (_super) {
    __extends(RectangleToolbarController, _super);
    function RectangleToolbarController(rectangle, appCanvas) {
        var _this = _super.call(this, rectangle, appCanvas) || this;
        _this.rectangle = rectangle;
        _this.posXSlider = _this.createSlider('Position X', function () { return parseInt(_this.posXSlider.value); }, -0.5 * appCanvas.width, 0.5 * appCanvas.width);
        _this.registerSlider(_this.posXSlider, function (e) { _this.updatePosX(parseInt(_this.posXSlider.value)); });
        _this.posYSlider = _this.createSlider('Position Y', function () { return (parseInt(_this.posYSlider.value)); }, -0.5 * appCanvas.width, 0.5 * appCanvas.width);
        _this.registerSlider(_this.posYSlider, function (e) { _this.updatePosY(parseInt(_this.posYSlider.value)); });
        _this.lengthSlider = _this.createSlider('Length', function () { return parseInt(_this.lengthSlider.value); }, 150, 450);
        _this.registerSlider(_this.lengthSlider, function (e) { _this.updateLength(parseInt(_this.lengthSlider.value)); });
        _this.widthSlider = _this.createSlider('Width', function () { return parseInt(_this.widthSlider.value); }, 150, 450);
        _this.registerSlider(_this.widthSlider, function (e) { _this.updateWidth(parseInt(_this.widthSlider.value)); });
        _this.rotateSlider = _this.createSlider('Rotation', function () { return parseInt(_this.rotateSlider.value); }, -360, 360);
        _this.registerSlider(_this.rotateSlider, function (e) { _this.updateRotation(parseInt(_this.rotateSlider.value)); });
        return _this;
    }
    RectangleToolbarController.prototype.updatePosX = function (newPosX) {
        this.rectangle.translation[0] = newPosX;
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updatePosY = function (newPosY) {
        this.rectangle.translation[1] = newPosY;
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateLength = function (newLength) {
        this.rectangle.scale[0] = newLength / 300;
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateWidth = function (newWidth) {
        this.rectangle.scale[1] = newWidth / 300;
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateRotation = function (newRotation) {
        this.rectangle.angleInRadians = (0, utils_1.degToRad)(newRotation);
        console.log("rotation: ", newRotation);
        this.updateShape(this.rectangle);
        for (var i = 0; i < 4; i++) {
            console.log("x: ", this.rectangle.pointList[i].x, "y:", this.rectangle.pointList[i].y);
        }
    };
    RectangleToolbarController.prototype.updateVertex = function (idx, x, y) {
        // console.log("xawal :" , x);
        // console.log("yawal: " , y);
        var _this = this;
        var centerX = (this.rectangle.initialPoint[0] + this.rectangle.endPoint[0]) / 2;
        var centerY = (this.rectangle.initialPoint[1] + this.rectangle.endPoint[1]) / 2;
        var translatedX = x - centerX;
        var translatedY = y - centerY;
        var angle = this.rectangle.angleInRadians; // Inverse rotation angle
        var dx = translatedX * Math.cos(angle) - translatedY * Math.sin(angle);
        var dy = translatedX * Math.sin(angle) + translatedY * Math.cos(angle);
        var originalX = dx + centerX;
        var originalY = dy + centerY;
        var movementX = originalX - this.rectangle.pointList[idx].x;
        var movementY = originalY - this.rectangle.pointList[idx].y;
        // console.log("x:" , movementX);
        // console.log("y:" ,movementY);
        this.rectangle.pointList[idx].x += movementX;
        this.rectangle.pointList[idx].y += movementY;
        var adjacentVertices = [0, 1, 2, 3].filter(function (i) { return i !== idx && i !== _this.rectangle.findOpposite(idx); });
        var pointList = this.rectangle.pointList;
        var cwAdjacentIdx = this.rectangle.findCWAdjacent(idx);
        var ccwAdjacentIdx = this.rectangle.findCCWAdjacent(idx);
        var oppositeIdx = this.rectangle.findOpposite(idx);
        var oppositePointX = pointList[oppositeIdx].x;
        var oppositePointY = pointList[oppositeIdx].y;
        // To avoid stuck
        adjacentVertices.forEach(function (vertexIdx) {
            if (vertexIdx === cwAdjacentIdx || vertexIdx === ccwAdjacentIdx) {
                var vertexPoint = pointList[vertexIdx];
                if (vertexPoint.x === oppositePointX && vertexPoint.y === oppositePointY) {
                    if (Math.abs(movementX) > Math.abs(movementY)) {
                        vertexPoint.x += movementX;
                    }
                    else {
                        vertexPoint.y += movementY;
                    }
                }
                else {
                    if (vertexPoint.x !== oppositePointX) {
                        vertexPoint.x += movementX;
                    }
                    if (vertexPoint.y !== oppositePointY) {
                        vertexPoint.y += movementY;
                    }
                }
            }
        });
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.customVertexToolbar = function () { };
    return RectangleToolbarController;
}(ShapeToolbarController_1.ShapeToolbarController));
exports["default"] = RectangleToolbarController;


/***/ }),

/***/ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts":
/*!*****************************************************************!*\
  !*** ./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ShapeToolbarController = void 0;
var Color_1 = __importDefault(__webpack_require__(/*! ../../../Base/Color */ "./src/Base/Color.ts"));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var ShapeToolbarController = /** @class */ (function () {
    function ShapeToolbarController(shape, appCanvas) {
        this.selectedVertex = '0';
        this.vtxPosXSlider = null;
        this.vtxPosYSlider = null;
        this.vtxColorPicker = null;
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
        slider.value = valueGetter().toString();
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
            slider.value = _this.getterList[idx]().toString();
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
    ShapeToolbarController.prototype.createColorPickerVertex = function (label, hex) {
        var container = document.createElement('div');
        container.classList.add('toolbar-slider-container');
        var labelElmt = document.createElement('div');
        labelElmt.textContent = label;
        container.appendChild(labelElmt);
        var colorPicker = document.createElement('input');
        colorPicker.type = 'color';
        colorPicker.value = hex;
        container.appendChild(colorPicker);
        this.vertexContainer.appendChild(container);
        return colorPicker;
    };
    ShapeToolbarController.prototype.drawVertexToolbar = function () {
        var _this = this;
        while (this.vertexContainer.firstChild)
            this.vertexContainer.removeChild(this.vertexContainer.firstChild);
        var idx = parseInt(this.vertexPicker.value);
        var vertex = this.shape.pointList[idx];
        this.vtxPosXSlider = this.createSliderVertex('Pos X', vertex.x, 1, this.appCanvas.width);
        this.vtxPosYSlider = this.createSliderVertex('Pos Y', vertex.y, 1, this.appCanvas.height);
        var updateSlider = function () {
            if (_this.vtxPosXSlider && _this.vtxPosYSlider)
                _this.updateVertex(idx, parseInt(_this.vtxPosXSlider.value), parseInt(_this.vtxPosYSlider.value));
        };
        this.vtxColorPicker = this.createColorPickerVertex('Color', (0, utils_1.rgbToHex)(vertex.c.r * 255, vertex.c.g * 255, vertex.c.b * 255));
        var updateColor = function () {
            var _a, _b, _c;
            var _d = (_c = (0, utils_1.hexToRgb)((_b = (_a = _this.vtxColorPicker) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '#000000')) !== null && _c !== void 0 ? _c : { r: 0, g: 0, b: 0 }, r = _d.r, g = _d.g, b = _d.b;
            var color = new Color_1.default(r / 255, g / 255, b / 255);
            console.log("updating idx: ".concat(idx));
            _this.shape.pointList[idx].c = color;
            _this.updateShape(_this.shape);
        };
        this.registerSlider(this.vtxPosXSlider, updateSlider);
        this.registerSlider(this.vtxPosYSlider, updateSlider);
        this.registerSlider(this.vtxColorPicker, updateColor);
        this.customVertexToolbar();
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
        this.vertexPicker.value = '0';
        this.selectedVertex = this.vertexPicker.value;
        this.drawVertexToolbar();
        this.vertexPicker.onchange = function () {
            _this.selectedVertex = _this.vertexPicker.value;
            _this.drawVertexToolbar();
        };
    };
    return ShapeToolbarController;
}());
exports.ShapeToolbarController = ShapeToolbarController;


/***/ }),

/***/ "./src/Controllers/Toolbar/Shape/SquareToolbarController.ts":
/*!******************************************************************!*\
  !*** ./src/Controllers/Toolbar/Shape/SquareToolbarController.ts ***!
  \******************************************************************/
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
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var ShapeToolbarController_1 = __webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts");
var SquareToolbarController = /** @class */ (function (_super) {
    __extends(SquareToolbarController, _super);
    function SquareToolbarController(square, appCanvas) {
        var _this = _super.call(this, square, appCanvas) || this;
        _this.square = square;
        _this.posXSlider = _this.createSlider('Position X', function () { return parseInt(_this.posXSlider.value); }, -0.5 * appCanvas.width, 0.5 * appCanvas.width);
        _this.registerSlider(_this.posXSlider, function (e) { _this.updatePosX(parseInt(_this.posXSlider.value)); });
        _this.posYSlider = _this.createSlider('Position Y', function () { return (parseInt(_this.posYSlider.value)); }, -0.5 * appCanvas.width, 0.5 * appCanvas.width);
        _this.registerSlider(_this.posYSlider, function (e) { _this.updatePosY(parseInt(_this.posYSlider.value)); });
        _this.sizeSlider = _this.createSlider('Size', function () { return parseInt(_this.sizeSlider.value); }, 150, 450);
        _this.registerSlider(_this.sizeSlider, function (e) { _this.updateSize(parseInt(_this.sizeSlider.value)); });
        _this.rotateSlider = _this.createSlider('Rotation', function () { return parseInt(_this.rotateSlider.value); }, -360, 360);
        _this.registerSlider(_this.rotateSlider, function (e) { _this.updateRotation(parseInt(_this.rotateSlider.value)); });
        return _this;
    }
    SquareToolbarController.prototype.updatePosX = function (newPosX) {
        this.square.translation[0] = newPosX;
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.updatePosY = function (newPosY) {
        this.square.translation[1] = newPosY;
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.updateSize = function (newSize) {
        this.square.scale[0] = newSize / 300;
        this.square.scale[1] = newSize / 300;
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.updateRotation = function (newRotation) {
        this.square.angleInRadians = (0, utils_1.degToRad)(newRotation);
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.updateVertex = function (idx, x, y) {
        console.log("testing");
        var vertex = this.square.bufferTransformationList[idx];
        // const opposite = (idx + 2) % 4
        // const originX = this.square.pointList[opposite].x;
        // const originY = this.square.pointList[opposite].y;
        // const translateToCenter = m3.translation(-originX, -originY);
        // let scaling = m3.scaling(x, y);
        // let translateBack = m3.translation(originX, originY);
        // let resScale = m3.multiply(scaling, translateToCenter);
        // let resBack = m3.multiply(translateBack, resScale);
        // const resVertexUpdate = m3.multiply(resBack, this.square.transformationMatrix)
        // this.square.transformationMatrix = resVertexUpdate;
        // this.square.setTransformationMatrix();
        vertex.x = x;
        vertex.y = y;
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.customVertexToolbar = function () { };
    return SquareToolbarController;
}(ShapeToolbarController_1.ShapeToolbarController));
exports["default"] = SquareToolbarController;


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
var FanPolygon_1 = __importDefault(__webpack_require__(/*! ../../Shapes/FanPolygon */ "./src/Shapes/FanPolygon.ts"));
var Line_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Line */ "./src/Shapes/Line.ts"));
var Rectangle_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Rectangle */ "./src/Shapes/Rectangle.ts"));
var Square_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Square */ "./src/Shapes/Square.ts"));
var FanPolygonToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/FanPolygonToolbarController */ "./src/Controllers/Toolbar/Shape/FanPolygonToolbarController.ts"));
var LineToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/LineToolbarController */ "./src/Controllers/Toolbar/Shape/LineToolbarController.ts"));
var RectangleToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/RectangleToolbarController */ "./src/Controllers/Toolbar/Shape/RectangleToolbarController.ts"));
var SquareToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/SquareToolbarController */ "./src/Controllers/Toolbar/Shape/SquareToolbarController.ts"));
var ToolbarController = /** @class */ (function () {
    function ToolbarController(appCanvas, canvasController) {
        var _this = this;
        this.selectedId = '';
        this.toolbarController = null;
        this.appCanvas = appCanvas;
        this.appCanvas.updateToolbar = this.updateShapeList.bind(this);
        this.canvasController = canvasController;
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
            else if (shape instanceof Square_1.default) {
                _this.toolbarController = new SquareToolbarController_1.default(shape, appCanvas);
            }
            else if (shape instanceof FanPolygon_1.default) {
                _this.toolbarController = new FanPolygonToolbarController_1.default(shape, appCanvas, _this.canvasController);
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

/***/ "./src/Shapes/FanPolygon.ts":
/*!**********************************!*\
  !*** ./src/Shapes/FanPolygon.ts ***!
  \**********************************/
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
var Color_1 = __importDefault(__webpack_require__(/*! ../Base/Color */ "./src/Base/Color.ts"));
var Vertex_1 = __importDefault(__webpack_require__(/*! ../Base/Vertex */ "./src/Base/Vertex.ts"));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var FanPolygon = /** @class */ (function (_super) {
    __extends(FanPolygon, _super);
    function FanPolygon(id, color, vertices) {
        var _this = _super.call(this, 1, id, color) || this;
        _this.lenList = [];
        _this.origin = vertices[0];
        _this.pointList.push(vertices[0], vertices[1]);
        _this.center = new Vertex_1.default((vertices[1].x + vertices[0].x) / 2, (vertices[1].y + vertices[0].y) / 2, new Color_1.default(0, 0, 0));
        _this.pointList.forEach(function (vtx, idx) {
            if (idx < 2)
                return;
            _this.glDrawType = 6;
            _this.addVertex(vtx);
        });
        return _this;
    }
    FanPolygon.prototype.addVertex = function (vertex) {
        this.pointList.push(vertex);
        this.glDrawType = 6;
        this.recalc();
    };
    FanPolygon.prototype.removeVertex = function (idx) {
        if (this.pointList.length <= 2) {
            alert("Cannot remove vertex any further");
            return;
        }
        console.log("removing idx: ".concat(idx));
        this.pointList.splice(idx, 1);
        this.origin = this.pointList[0];
        if (this.pointList.length == 2)
            this.glDrawType = 1;
        this.recalc();
    };
    FanPolygon.prototype.recalc = function () {
        var _this = this;
        var angles = this.pointList
            .filter(function (_, idx) { return idx > 0; })
            .map(function (vtx) {
            return {
                vtx: vtx,
                angle: Math.atan2(vtx.y - _this.origin.y, vtx.x - _this.origin.x),
            };
        });
        angles.sort(function (a, b) { return a.angle - b.angle; });
        this.pointList = angles.map(function (item) { return item.vtx; });
        this.pointList.unshift(this.origin);
        this.center.x =
            this.pointList.reduce(function (total, vtx) { return total + vtx.x; }, 0) /
                this.pointList.length;
        this.center.y =
            this.pointList.reduce(function (total, vtx) { return total + vtx.y; }, 0) /
                this.pointList.length;
        this.lenList = this.pointList.map(function (vtx) {
            return (0, utils_1.euclideanDistanceVtx)(vtx, _this.center);
        });
    };
    return FanPolygon;
}(BaseShape_1.default));
exports["default"] = FanPolygon;


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
    function Line(id, color, startX, startY, endX, endY, rotation, scaleX, scaleY) {
        if (rotation === void 0) { rotation = 0; }
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        var _this = this;
        var centerX = (startX + endX) / 2;
        var centerY = (startY + endY) / 2;
        var center = new Vertex_1.default(centerX, centerY, color);
        _this = _super.call(this, 1, id, color, center, rotation, scaleX, scaleY) || this;
        var origin = new Vertex_1.default(startX, startY, color);
        var end = new Vertex_1.default(endX, endY, color);
        _this.length = (0, utils_1.euclideanDistanceVtx)(origin, end);
        _this.pointList.push(origin, end);
        _this.bufferTransformationList = _this.pointList;
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
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(id, color, startX, startY, endX, endY, angleInRadians, scaleX, scaleY, transformation) {
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        if (transformation === void 0) { transformation = utils_1.m3.identity(); }
        var _this = _super.call(this, 5, id, color) || this;
        var x1 = startX;
        var y1 = startY;
        var x2 = endX;
        var y2 = startY;
        var x3 = startX;
        var y3 = endY;
        var x4 = endX;
        var y4 = endY;
        _this.transformationMatrix = transformation;
        _this.angleInRadians = angleInRadians;
        _this.scale = [scaleX, scaleY];
        _this.initialPoint = [startX, startY, 1];
        _this.endPoint = [endX, endY, 1];
        _this.targetPoint = [0, 0, 1];
        _this.length = x2 - x1;
        _this.width = y3 - y1;
        var centerX = (x1 + x4) / 2;
        var centerY = (y1 + y4) / 2;
        var center = new Vertex_1.default(centerX, centerY, color);
        _this.center = center;
        _this.pointList.push(new Vertex_1.default(x1, y1, color), new Vertex_1.default(x2, y2, color), new Vertex_1.default(x3, y3, color), new Vertex_1.default(x4, y4, color));
        _this.bufferTransformationList = _this.pointList;
        console.log("point 0: ".concat(x1, ", ").concat(y1));
        console.log("point 1: ".concat(x2, ", ").concat(y2));
        console.log("point 2: ".concat(x3, ", ").concat(y3));
        console.log("point 3: ".concat(x4, ", ").concat(y4));
        console.log("center: ".concat(center.x, ", ").concat(center.y));
        return _this;
    }
    Rectangle.prototype.setTransformationMatrix = function () {
        _super.prototype.setTransformationMatrix.call(this);
        // const point = [this.pointList[idx].x, this.pointList[idx].y, 1];
        this.endPoint = utils_1.m3.multiply3x1(this.transformationMatrix, this.endPoint);
        this.initialPoint = utils_1.m3.multiply3x1(this.transformationMatrix, this.initialPoint);
    };
    Rectangle.prototype.findCCWAdjacent = function (pointIdx) {
        var ccwAdjacent = { 0: 2, 1: 0, 2: 3, 3: 1 };
        return ccwAdjacent[pointIdx];
    };
    Rectangle.prototype.findCWAdjacent = function (pointIdx) {
        var cwAdjacent = { 0: 1, 1: 3, 2: 0, 3: 2 };
        return cwAdjacent[pointIdx];
    };
    Rectangle.prototype.findOpposite = function (pointIdx) {
        var opposite = { 0: 3, 1: 2, 2: 1, 3: 0 };
        return opposite[pointIdx];
    };
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
    function Square(id, color, x1, y1, x2, y2, x3, y3, x4, y4, rotation, scaleX, scaleY) {
        if (rotation === void 0) { rotation = 0; }
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        var _this = this;
        var centerX = (x1 + x3) / 2;
        var centerY = (y1 + y3) / 2;
        var center = new Vertex_1.default(centerX, centerY, color);
        _this = _super.call(this, 6, id, color, center, rotation, scaleX, scaleY) || this;
        _this.v1 = new Vertex_1.default(x1, y1, color);
        _this.v2 = new Vertex_1.default(x2, y2, color);
        _this.v3 = new Vertex_1.default(x3, y3, color);
        _this.v4 = new Vertex_1.default(x4, y4, color);
        _this.pointList.push(_this.v1, _this.v2, _this.v3, _this.v4);
        _this.bufferTransformationList = _this.pointList;
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
    var gl = initRet.gl, program = initRet.program, colorBuffer = initRet.colorBuffer, positionBuffer = initRet.positionBuffer;
    var appCanvas = new AppCanvas_1.default(gl, program, positionBuffer, colorBuffer);
    var canvasController = new CanvasController_1.default(appCanvas);
    canvasController.start();
    new ToolbarController_1.default(appCanvas, canvasController);
    // const red = new Color(255, 0, 200)
    // // const triangle = new Triangle('tri-1', red, 50, 50, 20, 500, 200, 100);
    // // appCanvas.addShape(triangle);
    // const rect = new Rectangle('rect-1', red, 0,0,10,20,0,1,1);
    // rect.angleInRadians = - Math.PI / 4;
    // // rect.targetPoint[0] = 5 * Math.sqrt(2);
    // // rect.scaleX = 10;
    // // rect.translation[0] = 500;
    // // rect.translation[1] = 1000;
    // // rect.setTransformationMatrix();
    // appCanvas.addShape(rect);
    // const line = new Line('line-1', red, 100, 100, 100, 300);
    // const line2 = new Line('line-2', red, 100, 100, 300, 100);
    // appCanvas.addShape(line);
    // appCanvas.addShape(line2);
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
    var matrixUniformLocation = gl.getUniformLocation(program, 'u_transformation');
    gl.uniformMatrix3fv(matrixUniformLocation, false, [1, 0, 0, 0, 1, 0, 0, 0, 1]);
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
        program: program,
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
exports.m3 = exports.rgbToHex = exports.hexToRgb = exports.degToRad = exports.radToDeg = exports.getAngle = exports.euclideanDistance = exports.euclideanDistanceVtx = void 0;
var euclideanDistanceVtx = function (a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
};
exports.euclideanDistanceVtx = euclideanDistanceVtx;
var euclideanDistance = function (ax, ay, bx, by) {
    var dx = ax - bx;
    var dy = ay - by;
    return Math.sqrt(dx * dx + dy * dy);
};
exports.euclideanDistance = euclideanDistance;
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
function hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}
exports.hexToRgb = hexToRgb;
function rgbToHex(r, g, b) {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1);
}
exports.rgbToHex = rgbToHex;
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
    inverse: function (m) {
        var det = m[0] * (m[4] * m[8] - m[7] * m[5]) -
            m[1] * (m[3] * m[8] - m[5] * m[6]) +
            m[2] * (m[3] * m[7] - m[4] * m[6]);
        if (det === 0)
            return null;
        var invDet = 1 / det;
        return [
            invDet * (m[4] * m[8] - m[5] * m[7]),
            invDet * (m[2] * m[7] - m[1] * m[8]),
            invDet * (m[1] * m[5] - m[2] * m[4]),
            invDet * (m[5] * m[6] - m[3] * m[8]),
            invDet * (m[0] * m[8] - m[2] * m[6]),
            invDet * (m[2] * m[3] - m[0] * m[5]),
            invDet * (m[3] * m[7] - m[4] * m[6]),
            invDet * (m[1] * m[6] - m[0] * m[7]),
            invDet * (m[0] * m[4] - m[1] * m[3])
        ];
    },
    multiply3x1: function (a, b) {
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
        return [
            b00 * a00 + b01 * a10 + b02 * a20,
            b00 * a01 + b01 * a11 + b02 * a21,
            b00 * a02 + b01 * a12 + b02 * a22,
        ];
    },
    translate: function (m, tx, ty) {
        return exports.m3.multiply(m, exports.m3.translation(tx, ty));
    },
    rotate: function (m, angleInRadians) {
        return exports.m3.multiply(m, exports.m3.rotation(angleInRadians));
    },
    scale: function (m, sx, sy) {
        return exports.m3.multiply(m, exports.m3.scaling(sx, sy));
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsT0FBTztZQUNMLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1NBQ2xDLENBQUM7SUFDSixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsQ0FBWTtRQUM1QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9DLElBQUksR0FBRyxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUUzQixJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRXZCLE9BQU87WUFDSCxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QyxDQUFDO0lBQ04sQ0FBQztJQUVDLFdBQVcsRUFBRSxVQUFTLENBQVksRUFBRSxDQUFZO1FBQzlDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE9BQU87WUFDTCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLENBQVksRUFBRSxFQUFTLEVBQUUsRUFBUztRQUNwRCxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELE1BQU0sRUFBRSxVQUFTLENBQVUsRUFBRSxjQUFxQjtRQUNoRCxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsQ0FBVSxFQUFFLEVBQVMsRUFBRSxFQUFTO1FBQzlDLE9BQU8sVUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsVUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0YsQ0FBQzs7Ozs7OztVQ25LSjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0FwcENhbnZhcy50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9CYXNlU2hhcGUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQ29sb3IudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvVmVydGV4LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9GYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9MaW5lTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9SZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL1NxdWFyZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9GYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9GYW5Qb2x5Z29uLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvTGluZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1NxdWFyZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL2luaXQudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL0Jhc2UvQmFzZVNoYXBlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENhbnZhcyB7XHJcbiAgICBwcml2YXRlIHByb2dyYW06IFdlYkdMUHJvZ3JhbTtcclxuICAgIHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dDtcclxuICAgIHByaXZhdGUgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyO1xyXG4gICAgcHJpdmF0ZSBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXI7XHJcbiAgICBwcml2YXRlIF91cGRhdGVUb29sYmFyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF9zaGFwZXM6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4gPSB7fTtcclxuXHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICAgICAgICBwcm9ncmFtOiBXZWJHTFByb2dyYW0sXHJcbiAgICAgICAgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLFxyXG4gICAgICAgIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlclxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25CdWZmZXIgPSBwb3NpdGlvbkJ1ZmZlcjtcclxuICAgICAgICB0aGlzLmNvbG9yQnVmZmVyID0gY29sb3JCdWZmZXI7XHJcbiAgICAgICAgdGhpcy5wcm9ncmFtID0gcHJvZ3JhbTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGdsLmNhbnZhcy53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGdsLmNhbnZhcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSB0aGlzLnBvc2l0aW9uQnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gdGhpcy5jb2xvckJ1ZmZlcjtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gc2hhcGUucG9pbnRMaXN0LmZsYXRNYXAoKHBvaW50KSA9PiBbXHJcbiAgICAgICAgICAgICAgICBwb2ludC54LFxyXG4gICAgICAgICAgICAgICAgcG9pbnQueSxcclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29sb3JzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYXBlLnBvaW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goc2hhcGUucG9pbnRMaXN0W2ldLmMuciwgc2hhcGUucG9pbnRMaXN0W2ldLmMuZywgc2hhcGUucG9pbnRMaXN0W2ldLmMuYik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJpbmQgY29sb3IgZGF0YVxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLFxyXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEJpbmQgcG9zaXRpb24gZGF0YVxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghKHRoaXMucG9zaXRpb25CdWZmZXIgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIGJ1ZmZlciBpcyBub3QgYSB2YWxpZCBXZWJHTEJ1ZmZlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCEodGhpcy5jb2xvckJ1ZmZlciBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29sb3IgYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdHJhbnNmb3JtYXRpb24gbWF0cml4XHJcbiAgICAgICAgICAgIC8vIHNoYXBlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtYXRyaXhMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIFwidV90cmFuc2Zvcm1hdGlvblwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoc2hhcGUudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG4gICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGFwcGx5U3BlY2lhbFRyZWF0bWVudExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X2FwcGx5U3BlY2lhbFRyZWF0bWVudFwiKTtcclxuICAgICAgICAgICAgLy8gY29uc3Qgc3BlY2lhbE9mZnNldExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X3NwZWNpYWxPZmZzZXRcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBjb25zdCBhcHBseVNwZWNpYWxUcmVhdG1lbnQgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHNwZWNpYWxPZmZzZXQgPSBbMC4wLCAwLjBdO1xyXG5cclxuICAgICAgICAgICAgLy8gZ2wudW5pZm9ybTFpKGFwcGx5U3BlY2lhbFRyZWF0bWVudExvY2F0aW9uLCBhcHBseVNwZWNpYWxUcmVhdG1lbnQgPyAxIDogMCk7XHJcbiAgICAgICAgICAgIC8vIGdsLnVuaWZvcm0yZnYoc3BlY2lhbE9mZnNldExvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KHNwZWNpYWxPZmZzZXQpKTtcclxuXHJcbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoc2hhcGUuZ2xEcmF3VHlwZSwgMCwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2hhcGVzKCk6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVzKHY6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4pIHtcclxuICAgICAgICB0aGlzLl9zaGFwZXMgPSB2O1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZVRvb2xiYXIpXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xiYXIuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHVwZGF0ZVRvb2xiYXIodiA6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVUb29sYmFyID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVJZEZyb21UYWcodGFnOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB3aXRoU2FtZVRhZyA9IE9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5maWx0ZXIoKGlkKSA9PiBpZC5zdGFydHNXaXRoKHRhZyArICctJykpO1xyXG4gICAgICAgIHJldHVybiBgJHt0YWd9LSR7d2l0aFNhbWVUYWcubGVuZ3RoICsgMX1gXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNoYXBlKHNoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKHNoYXBlLmlkKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBhbHJlYWR5IHVzZWQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xyXG4gICAgICAgIG5ld1NoYXBlc1tzaGFwZS5pZF0gPSBzaGFwZTtcclxuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZWRpdFNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgbm90IGZvdW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcclxuICAgICAgICBuZXdTaGFwZXNbbmV3U2hhcGUuaWRdID0gbmV3U2hhcGU7XHJcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZVNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgbm90IGZvdW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcclxuICAgICAgICBkZWxldGUgbmV3U2hhcGVzW25ld1NoYXBlLmlkXTtcclxuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcclxuICAgIH1cclxufSIsImltcG9ydCB7IG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuL1ZlcnRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQmFzZVNoYXBlIHtcclxuXHJcbiAgICBwb2ludExpc3Q6IFZlcnRleFtdID0gW107XHJcbiAgICBidWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3Q6IFZlcnRleFtdID0gW107XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgY29sb3I6IENvbG9yO1xyXG4gICAgZ2xEcmF3VHlwZTogbnVtYmVyO1xyXG4gICAgY2VudGVyOiBWZXJ0ZXg7XHJcblxyXG4gICAgdHJhbnNsYXRpb246IFtudW1iZXIsIG51bWJlcl0gPSBbMCwgMF07XHJcbiAgICBhbmdsZUluUmFkaWFuczogbnVtYmVyID0gMDtcclxuICAgIHNjYWxlOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xyXG5cclxuICAgIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBudW1iZXJbXSA9IG0zLmlkZW50aXR5KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2xEcmF3VHlwZTogbnVtYmVyLCBpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIGNlbnRlcjogVmVydGV4ID0gbmV3IFZlcnRleCgwLCAwLCBjb2xvciksIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IGdsRHJhd1R5cGU7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcclxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gcm90YXRpb247XHJcbiAgICAgICAgdGhpcy5zY2FsZVswXSA9IHNjYWxlWDtcclxuICAgICAgICB0aGlzLnNjYWxlWzFdID0gc2NhbGVZO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5pZGVudGl0eSgpXHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlVG9DZW50ZXIgPSBtMy50cmFuc2xhdGlvbigtdGhpcy5jZW50ZXIueCwgLXRoaXMuY2VudGVyLnkpO1xyXG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbTMucm90YXRpb24odGhpcy5hbmdsZUluUmFkaWFucyk7XHJcbiAgICAgICAgbGV0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHRoaXMuc2NhbGVbMF0sIHRoaXMuc2NhbGVbMV0pO1xyXG4gICAgICAgIGxldCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24odGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlID0gbTMudHJhbnNsYXRpb24odGhpcy50cmFuc2xhdGlvblswXSwgdGhpcy50cmFuc2xhdGlvblsxXSk7XHJcblxyXG4gICAgICAgIGxldCByZXNTY2FsZSA9IG0zLm11bHRpcGx5KHNjYWxpbmcsIHRyYW5zbGF0ZVRvQ2VudGVyKTtcclxuICAgICAgICBsZXQgcmVzUm90YXRlID0gbTMubXVsdGlwbHkocm90YXRpb24scmVzU2NhbGUpO1xyXG4gICAgICAgIGxldCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzUm90YXRlKTtcclxuICAgICAgICBjb25zdCByZXNUcmFuc2xhdGUgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGUsIHJlc0JhY2spO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSByZXNUcmFuc2xhdGU7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcjogbnVtYmVyO1xyXG4gICAgZzogbnVtYmVyO1xyXG4gICAgYjogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQ29sb3IgZnJvbSBcIi4vQ29sb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlcnRleCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBjOiBDb2xvcjtcclxuICAgIGlzU2VsZWN0ZWQgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBjOiBDb2xvciwgaXNTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5pc1NlbGVjdGVkID0gaXNTZWxlY3RlZDtcclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9GYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZS9JU2hhcGVNYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgTGluZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0xpbmVNYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IFNxdWFyZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1NxdWFyZU1ha2VyQ29udHJvbGxlcic7XHJcblxyXG5lbnVtIEFWQUlMX1NIQVBFUyB7XHJcbiAgICBMaW5lID0gJ0xpbmUnLFxyXG4gICAgUmVjdGFuZ2xlID0gJ1JlY3RhbmdsZScsXHJcbiAgICBTcXVhcmUgPSAnU3F1YXJlJyxcclxuICAgIEZhblBvbHkgPSAnRmFuUG9seScsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0NvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfc2hhcGVDb250cm9sbGVyOiBJU2hhcGVNYWtlckNvbnRyb2xsZXI7XHJcbiAgICBwcml2YXRlIGNhbnZhc0VsbXQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBidXR0b25Db250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBjb2xvclBpY2tlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbnZhc0VsbXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2hhcGUtYnV0dG9uLWNvbnRhaW5lcidcclxuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3NldC1wb2x5Z29uJ1xyXG4gICAgICAgICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdCA9IGNhbnZhc0VsbXQ7XHJcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBidXR0b25Db250YWluZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcihhcHBDYW52YXMpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICdzaGFwZS1jb2xvci1waWNrZXInXHJcbiAgICAgICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RYID0gZS5vZmZzZXRYICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RZID0gZS5vZmZzZXRZICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RYLFxyXG4gICAgICAgICAgICAgICAgY29ycmVjdFksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yUGlja2VyLnZhbHVlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBzaGFwZUNvbnRyb2xsZXIoKTogSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVDb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0IHNoYXBlQ29udHJvbGxlcih2OiBJU2hhcGVNYWtlckNvbnRyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSB2O1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RYID0gZS5vZmZzZXRYICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RZID0gZS5vZmZzZXRZICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RYLFxyXG4gICAgICAgICAgICAgICAgY29ycmVjdFksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yUGlja2VyLnZhbHVlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDb250cm9sbGVyKHNoYXBlU3RyOiBBVkFJTF9TSEFQRVMpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgICAgICBzd2l0Y2ggKHNoYXBlU3RyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLkxpbmU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpbmVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5SZWN0YW5nbGU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLlNxdWFyZTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3F1YXJlTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcclxuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuRmFuUG9seTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBzaGFwZSBzdHJpbmcnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdEV4aXN0aW5nRmFuUG9seWdvbihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgKHRoaXMuc2hhcGVDb250cm9sbGVyIGFzIEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIpLnNldEN1cnJlbnRQb2x5Z29uKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBzdGFydCgpIHtcclxuICAgICAgICBmb3IgKGNvbnN0IHNoYXBlU3RyIGluIEFWQUlMX1NIQVBFUykge1xyXG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcclxuICAgICAgICAgICAgYnV0dG9uLmNsYXNzTGlzdC5hZGQoJ3NoYXBlLWJ1dHRvbicpO1xyXG4gICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBzaGFwZVN0cjtcclxuICAgICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlciA9IHRoaXMuaW5pdENvbnRyb2xsZXIoXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVTdHIgYXMgQVZBSUxfU0hBUEVTXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi8uLi8uLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IFZlcnRleCBmcm9tICcuLi8uLi8uLi9CYXNlL1ZlcnRleCc7XHJcbmltcG9ydCBGYW5Qb2x5Z29uIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9GYW5Qb2x5Z29uJztcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vSVNoYXBlTWFrZXJDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXJcclxuICAgIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyXHJcbntcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIG9yaWdpbjogVmVydGV4IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRQb2x5OiBGYW5Qb2x5Z29uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2V0LXBvbHlnb24nXHJcbiAgICAgICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seS5wb2ludExpc3QubGVuZ3RoID4gMlxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDdXJyZW50UG9seWdvbihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9seSA9IHRoaXMuYXBwQ2FudmFzLnNoYXBlc1tpZF0gYXMgRmFuUG9seWdvbjtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuY3VycmVudFBvbHkucG9pbnRMaXN0WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLmN1cnJlbnRQb2x5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdwb2x5ZmFuJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gbmV3IEZhblBvbHlnb24oaWQsIGNvbG9yLCBbdGhpcy5vcmlnaW4sIG5ld1ZlcnRleF0pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZSh0aGlzLmN1cnJlbnRQb2x5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdWZXJ0ZXggPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBvbHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkuYWRkVmVydGV4KG5ld1ZlcnRleCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5lZGl0U2hhcGUodGhpcy5jdXJyZW50UG9seSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vLi4vLi4vQmFzZS9Db2xvclwiO1xyXG5pbXBvcnQgTGluZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL0xpbmVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0ge3gsIHl9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtyLCBnLCBifSA9IGhleFRvUmdiKGhleCkgPz8ge3I6IDAsIGc6IDAsIGI6IDB9O1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyLzI1NSwgZy8yNTUsIGIvMjU1KTtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygnbGluZScpO1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoaWQsIGNvbG9yLCB0aGlzLm9yaWdpbi54LCB0aGlzLm9yaWdpbi55LCB4LCB5KTtcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdyZWN0YW5nbGUnKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdGhpcy5vcmlnaW4ueCwgdGhpcy5vcmlnaW4ueSwgeCwgeSwwLDEsMSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHJlY3RhbmdsZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9TcXVhcmVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdzcXVhcmUnKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHYxID0ge3g6IHgsIHk6IHl9O1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjF4OiAke3YxLnh9LCB2MXk6ICR7djEueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjIgPSB7eDogdGhpcy5vcmlnaW4ueCAtICh5IC0gdGhpcy5vcmlnaW4ueSksIFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSArICh4LXRoaXMub3JpZ2luLngpfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjJ4OiAke3YyLnh9LCB2Mnk6ICR7djIueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjMgPSB7eDogMip0aGlzLm9yaWdpbi54IC0geCwgXHJcbiAgICAgICAgICAgICAgICB5OiAyKnRoaXMub3JpZ2luLnkgLSB5fVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjN4OiAke3YzLnh9LCB2M3k6ICR7djMueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjQgPSB7eDogdGhpcy5vcmlnaW4ueCArICh5IC0gdGhpcy5vcmlnaW4ueSksIFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSAtICh4LXRoaXMub3JpZ2luLngpfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjR4OiAke3Y0Lnh9LCB2NHk6ICR7djQueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gbmV3IFNxdWFyZShcclxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdjEueCwgdjEueSwgdjIueCwgdjIueSwgdjMueCwgdjMueSwgdjQueCwgdjQueSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHNxdWFyZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBGYW5Qb2x5Z29uIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9GYW5Qb2x5Z29uJztcclxuaW1wb3J0IHsgZGVnVG9SYWQsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgQ2FudmFzQ29udHJvbGxlciBmcm9tICcuLi8uLi9NYWtlci9DYW52YXNDb250cm9sbGVyJztcclxuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgc2NhbGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBERUZBVUxUX1NDQUxFID0gNTA7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50U2NhbGU6IG51bWJlciA9IDUwO1xyXG4gICAgcHJpdmF0ZSBmYW5Qb2x5OiBGYW5Qb2x5Z29uO1xyXG4gICAgcHJpdmF0ZSBjYW52YXNDb250cm9sbGVyOiBDYW52YXNDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZhblBvbHk6IEZhblBvbHlnb24sXHJcbiAgICAgICAgYXBwQ2FudmFzOiBBcHBDYW52YXMsXHJcbiAgICAgICAgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZmFuUG9seSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIgPSBjYW52YXNDb250cm9sbGVyO1xyXG5cclxuICAgICAgICB0aGlzLmZhblBvbHkgPSBmYW5Qb2x5O1xyXG5cclxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFgnLFxyXG4gICAgICAgICAgICAoKSA9PiBmYW5Qb2x5LnBvaW50TGlzdFswXS54LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGhcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdQb3NpdGlvbiBZJyxcclxuICAgICAgICAgICAgKCkgPT4gZmFuUG9seS5wb2ludExpc3RbMF0ueSxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgYXBwQ2FudmFzLmhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1lTbGlkZXIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNjYWxlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdTY2FsZScsXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFNjYWxlLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDEwMFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnNjYWxlU2xpZGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NhbGUocGFyc2VJbnQodGhpcy5zY2FsZVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN1c3RvbVZlcnRleFRvb2xiYXIoKSB7XHJcbiAgICAgICAgY29uc3QgYWRkVnR4QnV0dG9uID0gdGhpcy5jcmVhdGVWZXJ0ZXhCdXR0b24oJ0FkZCBWZXJ0ZXgnKTtcclxuICAgICAgICBhZGRWdHhCdXR0b24ub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXNDb250cm9sbGVyLmVkaXRFeGlzdGluZ0ZhblBvbHlnb24odGhpcy5mYW5Qb2x5LmlkKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbW92ZVZ0eEJ1dHRvbiA9IHRoaXMuY3JlYXRlVmVydGV4QnV0dG9uKCdSZW1vdmUgVmVydGV4Jyk7XHJcbiAgICAgICAgcmVtb3ZlVnR4QnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmFuUG9seS5yZW1vdmVWZXJ0ZXgocGFyc2VJbnQodGhpcy5zZWxlY3RlZFZlcnRleCkpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRWZXJ0ZXhUb29sYmFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5mYW5Qb2x5KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCByZWZyZXNoVmVydGV4TGlzdCA9IHRoaXMuY3JlYXRlVmVydGV4QnV0dG9uKFwiUmVmcmVzaCBWZXJ0aWNlcyBEcm9wZG93blwiKTtcclxuICAgICAgICByZWZyZXNoVmVydGV4TGlzdC5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRWZXJ0ZXhUb29sYmFyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVmVydGV4QnV0dG9uKHRleHQ6IHN0cmluZyk6IEhUTUxCdXR0b25FbGVtZW50IHtcclxuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xyXG5cclxuICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWCAtIHRoaXMuZmFuUG9seS5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCkgPT4ge1xyXG4gICAgICAgICAgICB2dHgueCArPSBkaWZmO1xyXG4gICAgICAgICAgICByZXR1cm4gdnR4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5yZWNhbGMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NZIC0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdFswXS55O1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5wb2ludExpc3QgPSB0aGlzLmZhblBvbHkucG9pbnRMaXN0Lm1hcCgodnR4LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgdnR4LnkgKz0gZGlmZjtcclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucmVjYWxjKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q3VycmVudFNjYWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNjYWxlKG5ld1NjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY2FsZSA9IG5ld1NjYWxlO1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5wb2ludExpc3QgPSB0aGlzLmZhblBvbHkucG9pbnRMaXN0Lm1hcCgodnR4LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmFkID0gZGVnVG9SYWQoZ2V0QW5nbGUodGhpcy5mYW5Qb2x5LmNlbnRlciwgdnR4KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XHJcblxyXG4gICAgICAgICAgICB2dHgueCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkuY2VudGVyLnggK1xyXG4gICAgICAgICAgICAgICAgY29zICpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkubGVuTGlzdFtpZHhdICpcclxuICAgICAgICAgICAgICAgICAgICAobmV3U2NhbGUgLyB0aGlzLkRFRkFVTFRfU0NBTEUpO1xyXG4gICAgICAgICAgICB2dHgueSA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkuY2VudGVyLnkgLVxyXG4gICAgICAgICAgICAgICAgc2luICpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkubGVuTGlzdFtpZHhdICpcclxuICAgICAgICAgICAgICAgICAgICAobmV3U2NhbGUgLyB0aGlzLkRFRkFVTFRfU0NBTEUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5wb2ludExpc3RbaWR4XS54ID0geDtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0W2lkeF0ueSA9IHk7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnJlY2FsYygpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgTGluZSBmcm9tICcuLi8uLi8uLi9TaGFwZXMvTGluZSc7XHJcbmltcG9ydCB7IGRlZ1RvUmFkLCBldWNsaWRlYW5EaXN0YW5jZVZ0eCwgZ2V0QW5nbGUgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGxlbmd0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJvdGF0ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIGxpbmU6IExpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3IobGluZTogTGluZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICBzdXBlcihsaW5lLCBhcHBDYW52YXMpO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG5cclxuICAgICAgICBjb25zdCBkaWFnb25hbCA9IE1hdGguc3FydChcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoICogYXBwQ2FudmFzLndpZHRoICtcclxuICAgICAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHQgKiBhcHBDYW52YXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmxlbmd0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnTGVuZ3RoJyxcclxuICAgICAgICAgICAgKCkgPT4gbGluZS5sZW5ndGgsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGRpYWdvbmFsXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMubGVuZ3RoU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFgnLFxyXG4gICAgICAgICAgICAoKSA9PiBsaW5lLnBvaW50TGlzdFswXS54LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGhcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWScsXHJcbiAgICAgICAgICAgICgpID0+IGxpbmUucG9pbnRMaXN0WzBdLnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgdGhpcy5jdXJyZW50QW5nbGUuYmluZCh0aGlzKSwgMCwgMzYwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBsaW5lTGVuID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV1cclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IGNvcyA9XHJcbiAgICAgICAgICAgICh0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLngpIC8gbGluZUxlbjtcclxuICAgICAgICBjb25zdCBzaW4gPVxyXG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55KSAvIGxpbmVMZW47XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3TGVuICogY29zICsgdGhpcy5saW5lLnBvaW50TGlzdFswXS54O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld0xlbiAqIHNpbiArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueTtcclxuXHJcbiAgICAgICAgdGhpcy5saW5lLmxlbmd0aCA9IG5ld0xlbjtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS54IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS54O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCA9IG5ld1Bvc1g7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3UG9zWCArIGRpZmY7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSA9IG5ld1Bvc1k7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID0gbmV3UG9zWSArIGRpZmY7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3VycmVudEFuZ2xlKCkge1xyXG4gICAgICAgIHJldHVybiBnZXRBbmdsZSh0aGlzLmxpbmUucG9pbnRMaXN0WzBdLCB0aGlzLmxpbmUucG9pbnRMaXN0WzFdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKG5ld1JvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcmFkID0gZGVnVG9SYWQobmV3Um90KTtcclxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWQpO1xyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XHJcblxyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9XHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCArIGNvcyAqIHRoaXMubGluZS5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID1cclxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS55IC0gc2luICogdGhpcy5saW5lLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0W2lkeF0ueCA9IHg7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFtpZHhdLnkgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLmxpbmUubGVuZ3RoID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tVmVydGV4VG9vbGJhcigpOiB2b2lkIHt9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGUnO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSB3aWR0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgbGVuZ3RoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWN0YW5nbGU6IFJlY3RhbmdsZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZWN0YW5nbGU6IFJlY3RhbmdsZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpe1xyXG4gICAgICAgIHN1cGVyKHJlY3RhbmdsZSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZSA9IHJlY3RhbmdsZTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFgnLCAoKSA9PiBwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBZJywgKCkgPT4gKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMubGVuZ3RoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ0xlbmd0aCcsICgpID0+IHBhcnNlSW50KHRoaXMubGVuZ3RoU2xpZGVyLnZhbHVlKSwgMTUwLDQ1MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpfSlcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdXaWR0aCcsICgpID0+IHBhcnNlSW50KHRoaXMud2lkdGhTbGlkZXIudmFsdWUpLCAxNTAsNDUwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMud2lkdGhTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVXaWR0aChwYXJzZUludCh0aGlzLndpZHRoU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsICgpID0+IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSwgLTM2MCwgMzYwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUm90YXRpb24ocGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpKX0pXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NYKG5ld1Bvc1g6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS50cmFuc2xhdGlvblswXSA9IG5ld1Bvc1g7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS50cmFuc2xhdGlvblsxXSA9IG5ld1Bvc1k7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuZ3RoOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2NhbGVbMF0gPSBuZXdMZW5ndGgvMzAwO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlV2lkdGgobmV3V2lkdGg6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS5zY2FsZVsxXSA9IG5ld1dpZHRoLzMwMDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKG5ld1JvdGF0aW9uIDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLmFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQobmV3Um90YXRpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicm90YXRpb246IFwiLCBuZXdSb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8NDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ4OiBcIiwgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLngsIFwieTpcIix0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaV0ueSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lke1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInhhd2FsIDpcIiAsIHgpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInlhd2FsOiBcIiAsIHkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2VudGVyWCA9ICh0aGlzLnJlY3RhbmdsZS5pbml0aWFsUG9pbnRbMF0gKyB0aGlzLnJlY3RhbmdsZS5lbmRQb2ludFswXSkgLyAyO1xyXG4gICAgICAgICAgICBjb25zdCBjZW50ZXJZID0gKHRoaXMucmVjdGFuZ2xlLmluaXRpYWxQb2ludFsxXSArIHRoaXMucmVjdGFuZ2xlLmVuZFBvaW50WzFdKSAvIDI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB0cmFuc2xhdGVkWCA9IHggLSBjZW50ZXJYO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNsYXRlZFkgPSB5IC0gY2VudGVyWTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFuczsgLy8gSW52ZXJzZSByb3RhdGlvbiBhbmdsZVxyXG4gICAgICAgICAgICBjb25zdCBkeCA9IHRyYW5zbGF0ZWRYICogTWF0aC5jb3MoYW5nbGUpIC0gdHJhbnNsYXRlZFkgKiBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGR5ID0gdHJhbnNsYXRlZFggKiBNYXRoLnNpbihhbmdsZSkgKyB0cmFuc2xhdGVkWSAqIE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxYID0gZHggKyBjZW50ZXJYO1xyXG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbFkgPSBkeSArIGNlbnRlclk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb3ZlbWVudFggPSBvcmlnaW5hbFggLSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS54O1xyXG4gICAgICAgICAgICBjb25zdCBtb3ZlbWVudFkgPSBvcmlnaW5hbFkgLSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS55O1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIng6XCIgLCBtb3ZlbWVudFgpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInk6XCIgLG1vdmVtZW50WSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpZHhdLnggKz0gbW92ZW1lbnRYO1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS55ICs9IG1vdmVtZW50WTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFkamFjZW50VmVydGljZXMgPSBbMCwgMSwgMiwgM10uZmlsdGVyKGkgPT4gaSAhPT0gaWR4ICYmIGkgIT09IHRoaXMucmVjdGFuZ2xlLmZpbmRPcHBvc2l0ZShpZHgpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50TGlzdCA9IHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdDtcclxuICAgICAgICAgICAgY29uc3QgY3dBZGphY2VudElkeCA9IHRoaXMucmVjdGFuZ2xlLmZpbmRDV0FkamFjZW50KGlkeCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNjd0FkamFjZW50SWR4ID0gdGhpcy5yZWN0YW5nbGUuZmluZENDV0FkamFjZW50KGlkeCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZUlkeCA9IHRoaXMucmVjdGFuZ2xlLmZpbmRPcHBvc2l0ZShpZHgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3Bwb3NpdGVQb2ludFggPSBwb2ludExpc3Rbb3Bwb3NpdGVJZHhdLng7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlUG9pbnRZID0gcG9pbnRMaXN0W29wcG9zaXRlSWR4XS55O1xyXG5cclxuICAgICAgICAgICAgLy8gVG8gYXZvaWQgc3R1Y2tcclxuICAgICAgICAgICAgYWRqYWNlbnRWZXJ0aWNlcy5mb3JFYWNoKHZlcnRleElkeCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmVydGV4SWR4ID09PSBjd0FkamFjZW50SWR4IHx8IHZlcnRleElkeCA9PT0gY2N3QWRqYWNlbnRJZHgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhQb2ludCA9IHBvaW50TGlzdFt2ZXJ0ZXhJZHhdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UG9pbnQueCA9PT0gb3Bwb3NpdGVQb2ludFggJiYgdmVydGV4UG9pbnQueSA9PT0gb3Bwb3NpdGVQb2ludFkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKG1vdmVtZW50WCkgPiBNYXRoLmFicyhtb3ZlbWVudFkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC54ICs9IG1vdmVtZW50WDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleFBvaW50LnkgKz0gbW92ZW1lbnRZO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBvaW50LnggIT09IG9wcG9zaXRlUG9pbnRYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC54ICs9IG1vdmVtZW50WDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UG9pbnQueSAhPT0gb3Bwb3NpdGVQb2ludFkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleFBvaW50LnkgKz0gbW92ZW1lbnRZO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VzdG9tVmVydGV4VG9vbGJhcigpOiB2b2lkIHt9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi4vLi4vLi4vQmFzZS9CYXNlU2hhcGUnO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSAnLi4vLi4vLi4vQmFzZS9Db2xvcic7XHJcbmltcG9ydCB7IGhleFRvUmdiLCByZ2JUb0hleCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHB1YmxpYyBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgc2hhcGU6IEJhc2VTaGFwZTtcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXJDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHVibGljIHZlcnRleENvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIHZlcnRleFBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWRWZXJ0ZXggPSAnMCc7XHJcblxyXG4gICAgcHVibGljIHZ0eFBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB2dHhQb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdnR4Q29sb3JQaWNrZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHNsaWRlckxpc3Q6IEhUTUxJbnB1dEVsZW1lbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBnZXR0ZXJMaXN0OiAoKCkgPT4gbnVtYmVyKVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2hhcGU6IEJhc2VTaGFwZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLnNoYXBlID0gc2hhcGU7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3ZlcnRleC1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3ZlcnRleC1waWNrZXInXHJcbiAgICAgICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNsaWRlcihcclxuICAgICAgICBsYWJlbDogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlR2V0dGVyOiAoKSA9PiBudW1iZXIsXHJcbiAgICAgICAgbWluOiBudW1iZXIsXHJcbiAgICAgICAgbWF4OiBudW1iZXJcclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFiZWxFbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XHJcbiAgICAgICAgc2xpZGVyLm1pbiA9IG1pbi50b1N0cmluZygpO1xyXG4gICAgICAgIHNsaWRlci5tYXggPSBtYXgudG9TdHJpbmcoKTtcclxuICAgICAgICBzbGlkZXIudmFsdWUgPSB2YWx1ZUdldHRlcigpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlcik7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnNsaWRlckxpc3QucHVzaChzbGlkZXIpO1xyXG4gICAgICAgIHRoaXMuZ2V0dGVyTGlzdC5wdXNoKHZhbHVlR2V0dGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlclNsaWRlcihzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQsIGNiOiAoZTogRXZlbnQpID0+IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG5ld0NiID0gKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNiKGUpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlcnMoc2xpZGVyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHNsaWRlci5vbmNoYW5nZSA9IG5ld0NiO1xyXG4gICAgICAgIHNsaWRlci5vbmlucHV0ID0gbmV3Q2I7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZShuZXdTaGFwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2xpZGVycyhpZ25vcmVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnNsaWRlckxpc3QuZm9yRWFjaCgoc2xpZGVyLCBpZHgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlnbm9yZVNsaWRlciA9PT0gc2xpZGVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIHNsaWRlci52YWx1ZSA9IHRoaXMuZ2V0dGVyTGlzdFtpZHhdKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQodGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUpO1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlID0gdmVydGV4LngudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdGhpcy52dHhQb3NZU2xpZGVyLnZhbHVlID0gdmVydGV4LnkudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2xpZGVyVmVydGV4KFxyXG4gICAgICAgIGxhYmVsOiBzdHJpbmcsXHJcbiAgICAgICAgY3VycmVudExlbmd0aDogbnVtYmVyLFxyXG4gICAgICAgIG1pbjogbnVtYmVyLFxyXG4gICAgICAgIG1heDogbnVtYmVyXHJcbiAgICApOiBIVE1MSW5wdXRFbGVtZW50IHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9vbGJhci1zbGlkZXItY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGxhYmVsRWxtdC50ZXh0Q29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xyXG5cclxuICAgICAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgc2xpZGVyLnR5cGUgPSAncmFuZ2UnO1xyXG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcclxuICAgICAgICBzbGlkZXIubWF4ID0gbWF4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgc2xpZGVyLnZhbHVlID0gY3VycmVudExlbmd0aC50b1N0cmluZygpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbGlkZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2xpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbG9yUGlja2VyVmVydGV4KGxhYmVsOiBzdHJpbmcsIGhleDogc3RyaW5nKTogSFRNTElucHV0RWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxFbG10KTtcclxuXHJcbiAgICAgICAgY29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgY29sb3JQaWNrZXIudHlwZSA9ICdjb2xvcic7XHJcbiAgICAgICAgY29sb3JQaWNrZXIudmFsdWUgPSBoZXg7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbG9yUGlja2VyKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yUGlja2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdWZXJ0ZXhUb29sYmFyKCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKTtcclxuXHJcbiAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQodGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF07XHJcblxyXG4gICAgICAgIHRoaXMudnR4UG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyVmVydGV4KFxyXG4gICAgICAgICAgICAnUG9zIFgnLFxyXG4gICAgICAgICAgICB2ZXJ0ZXgueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMud2lkdGhcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcclxuICAgICAgICAgICAgJ1BvcyBZJyxcclxuICAgICAgICAgICAgdmVydGV4LnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmhlaWdodFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZVNsaWRlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZlcnRleChcclxuICAgICAgICAgICAgICAgICAgICBpZHgsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh0aGlzLnZ0eFBvc1lTbGlkZXIudmFsdWUpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudnR4Q29sb3JQaWNrZXIgPSB0aGlzLmNyZWF0ZUNvbG9yUGlja2VyVmVydGV4KFxyXG4gICAgICAgICAgICAnQ29sb3InLFxyXG4gICAgICAgICAgICByZ2JUb0hleCh2ZXJ0ZXguYy5yICogMjU1LCB2ZXJ0ZXguYy5nICogMjU1LCB2ZXJ0ZXguYy5iICogMjU1KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZUNvbG9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IHIsIGcsIGIgfSA9IGhleFRvUmdiKFxyXG4gICAgICAgICAgICAgICAgdGhpcy52dHhDb2xvclBpY2tlcj8udmFsdWUgPz8gJyMwMDAwMDAnXHJcbiAgICAgICAgICAgICkgPz8geyByOiAwLCBnOiAwLCBiOiAwIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUpO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgdXBkYXRpbmcgaWR4OiAke2lkeH1gKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF0uYyA9IGNvbG9yO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc2hhcGUpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhQb3NYU2xpZGVyLCB1cGRhdGVTbGlkZXIpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhQb3NZU2xpZGVyLCB1cGRhdGVTbGlkZXIpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhDb2xvclBpY2tlciwgdXBkYXRlQ29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLmN1c3RvbVZlcnRleFRvb2xiYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4VG9vbGJhcigpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy52ZXJ0ZXhQaWNrZXIuZmlyc3RDaGlsZClcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIucmVtb3ZlQ2hpbGQodGhpcy52ZXJ0ZXhQaWNrZXIuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hhcGUucG9pbnRMaXN0LmZvckVhY2goKF8sIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaWR4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIG9wdGlvbi5sYWJlbCA9IGBWZXJ0ZXggJHtpZHh9YDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFZlcnRleCA9IHRoaXMudmVydGV4UGlja2VyLnZhbHVlO1xyXG4gICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRWZXJ0ZXggPSB0aGlzLnZlcnRleFBpY2tlci52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgY3VzdG9tVmVydGV4VG9vbGJhcigpOiB2b2lkO1xyXG4gICAgYWJzdHJhY3QgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQ7XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgU3F1YXJlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvU3F1YXJlXCI7XHJcbmltcG9ydCB7IGRlZ1RvUmFkIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzXCI7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgc2l6ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgLy8gcHJpdmF0ZSBwb2ludFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHNxdWFyZTogU3F1YXJlO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNxdWFyZTogU3F1YXJlLCBhcHBDYW52YXM6IEFwcENhbnZhcyl7XHJcbiAgICAgICAgc3VwZXIoc3F1YXJlLCBhcHBDYW52YXMpO1xyXG4gICAgICAgIHRoaXMuc3F1YXJlID0gc3F1YXJlO1xyXG5cclxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWCcsICgpID0+IHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSksLTAuNSphcHBDYW52YXMud2lkdGgsMC41KmFwcENhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1hTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpfSlcclxuXHJcbiAgICAgICAgdGhpcy5wb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFknLCAoKSA9PiAocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSksLTAuNSphcHBDYW52YXMud2lkdGgsMC41KmFwcENhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1lTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpfSlcclxuXHJcbiAgICAgICAgdGhpcy5zaXplU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1NpemUnLCAoKSA9PiBwYXJzZUludCh0aGlzLnNpemVTbGlkZXIudmFsdWUpLCAxNTAsNDUwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMuc2l6ZVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVNpemUocGFyc2VJbnQodGhpcy5zaXplU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsICgpID0+IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSwgLTM2MCwgMzYwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUm90YXRpb24ocGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpKX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5zcXVhcmUudHJhbnNsYXRpb25bMF0gPSBuZXdQb3NYO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zcXVhcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5zcXVhcmUudHJhbnNsYXRpb25bMV0gPSBuZXdQb3NZO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zcXVhcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlU2l6ZShuZXdTaXplOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5zcXVhcmUuc2NhbGVbMF0gPSBuZXdTaXplLzMwMDtcclxuICAgICAgICB0aGlzLnNxdWFyZS5zY2FsZVsxXSA9IG5ld1NpemUvMzAwO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zcXVhcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUm90YXRpb24obmV3Um90YXRpb24gOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5zcXVhcmUuYW5nbGVJblJhZGlhbnMgPSBkZWdUb1JhZChuZXdSb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwidGVzdGluZ1wiKTtcclxuXHJcbiAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy5zcXVhcmUuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0W2lkeF07XHJcbiAgICAgICAgLy8gY29uc3Qgb3Bwb3NpdGUgPSAoaWR4ICsgMikgJSA0XHJcbiAgICAgICAgLy8gY29uc3Qgb3JpZ2luWCA9IHRoaXMuc3F1YXJlLnBvaW50TGlzdFtvcHBvc2l0ZV0ueDtcclxuICAgICAgICAvLyBjb25zdCBvcmlnaW5ZID0gdGhpcy5zcXVhcmUucG9pbnRMaXN0W29wcG9zaXRlXS55O1xyXG4gICAgICAgIFxyXG5cclxuICAgICAgICAvLyBjb25zdCB0cmFuc2xhdGVUb0NlbnRlciA9IG0zLnRyYW5zbGF0aW9uKC1vcmlnaW5YLCAtb3JpZ2luWSk7XHJcbiAgICAgICAgLy8gbGV0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHgsIHkpO1xyXG4gICAgICAgIC8vIGxldCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24ob3JpZ2luWCwgb3JpZ2luWSk7XHJcblxyXG4gICAgICAgIC8vIGxldCByZXNTY2FsZSA9IG0zLm11bHRpcGx5KHNjYWxpbmcsIHRyYW5zbGF0ZVRvQ2VudGVyKTtcclxuICAgICAgICAvLyBsZXQgcmVzQmFjayA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZUJhY2ssIHJlc1NjYWxlKTtcclxuICAgICAgICAvLyBjb25zdCByZXNWZXJ0ZXhVcGRhdGUgPSBtMy5tdWx0aXBseShyZXNCYWNrLCB0aGlzLnNxdWFyZS50cmFuc2Zvcm1hdGlvbk1hdHJpeClcclxuICAgICAgICAvLyB0aGlzLnNxdWFyZS50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHJlc1ZlcnRleFVwZGF0ZTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5zcXVhcmUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgdmVydGV4LnggPSB4O1xyXG4gICAgICAgIHZlcnRleC55ID0geTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tVmVydGV4VG9vbGJhcigpOiB2b2lkIHt9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBGYW5Qb2x5Z29uIGZyb20gJy4uLy4uL1NoYXBlcy9GYW5Qb2x5Z29uJztcclxuaW1wb3J0IExpbmUgZnJvbSAnLi4vLi4vU2hhcGVzL0xpbmUnO1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4uLy4uL1NoYXBlcy9SZWN0YW5nbGUnO1xyXG5pbXBvcnQgU3F1YXJlIGZyb20gJy4uLy4uL1NoYXBlcy9TcXVhcmUnO1xyXG5pbXBvcnQgQ2FudmFzQ29udHJvbGxlciBmcm9tICcuLi9NYWtlci9DYW52YXNDb250cm9sbGVyJztcclxuaW1wb3J0IEZhblBvbHlnb25Ub29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0ZhblBvbHlnb25Ub29sYmFyQ29udHJvbGxlcic7XHJcbmltcG9ydCBMaW5lVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9MaW5lVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9SZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9TcXVhcmVUb29sYmFyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSB0b29sYmFyQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgaXRlbVBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkSWQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRyb2xsZXI6IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcywgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcikge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLnVwZGF0ZVRvb2xiYXIgPSB0aGlzLnVwZGF0ZVNoYXBlTGlzdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlciA9IGNhbnZhc0NvbnRyb2xsZXI7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICd0b29sYmFyLWl0ZW0tcGlja2VyJ1xyXG4gICAgICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlci5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJZCA9IHRoaXMuaXRlbVBpY2tlci52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLmFwcENhbnZhcy5zaGFwZXNbdGhpcy5pdGVtUGlja2VyLnZhbHVlXTtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclRvb2xiYXJFbG10KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcGUgaW5zdGFuY2VvZiBMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IExpbmVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBMaW5lLCBhcHBDYW52YXMpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgUmVjdGFuZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFJlY3RhbmdsZSwgYXBwQ2FudmFzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgU3F1YXJlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFNxdWFyZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFNxdWFyZSwgYXBwQ2FudmFzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgRmFuUG9seWdvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgRmFuUG9seWdvbiwgYXBwQ2FudmFzLCB0aGlzLmNhbnZhc0NvbnRyb2xsZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlTGlzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNoYXBlTGlzdCgpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVBpY2tlci5yZW1vdmVDaGlsZCh0aGlzLml0ZW1QaWNrZXIuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBwbGFjZWhvbGRlci50ZXh0ID0gJ0Nob29zZSBhbiBvYmplY3QnO1xyXG4gICAgICAgIHBsYWNlaG9sZGVyLnZhbHVlID0gJyc7XHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFwcENhbnZhcy5zaGFwZXMpLmZvckVhY2goKHNoYXBlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICAgIGNoaWxkLnRleHQgPSBzaGFwZS5pZDtcclxuICAgICAgICAgICAgY2hpbGQudmFsdWUgPSBzaGFwZS5pZDtcclxuICAgICAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLnZhbHVlID0gdGhpcy5zZWxlY3RlZElkO1xyXG5cclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuYXBwQ2FudmFzLnNoYXBlcykuaW5jbHVkZXModGhpcy5zZWxlY3RlZElkKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclRvb2xiYXJFbG10KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYXJUb29sYmFyRWxtdCgpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnRvb2xiYXJDb250YWluZXIuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi9CYXNlL0Jhc2VTaGFwZSc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IFZlcnRleCBmcm9tICcuLi9CYXNlL1ZlcnRleCc7XHJcbmltcG9ydCB7IGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFuUG9seWdvbiBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICBwcml2YXRlIG9yaWdpbjogVmVydGV4O1xyXG4gICAgbGVuTGlzdDogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHZlcnRpY2VzOiBWZXJ0ZXhbXSkge1xyXG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdmVydGljZXNbMF07XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0pO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlcnRleChcclxuICAgICAgICAgICAgKHZlcnRpY2VzWzFdLnggKyB2ZXJ0aWNlc1swXS54KSAvIDIsXHJcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS55ICsgdmVydGljZXNbMF0ueSkgLyAyLFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMCwgMCwgMClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5mb3JFYWNoKCh2dHgsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaWR4IDwgMikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSA2O1xyXG4gICAgICAgICAgICB0aGlzLmFkZFZlcnRleCh2dHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFZlcnRleCh2ZXJ0ZXg6IFZlcnRleCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godmVydGV4KTtcclxuICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSA2O1xyXG4gICAgICAgIHRoaXMucmVjYWxjKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbW92ZVZlcnRleChpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50TGlzdC5sZW5ndGggPD0gMikge1xyXG4gICAgICAgICAgICBhbGVydChcIkNhbm5vdCByZW1vdmUgdmVydGV4IGFueSBmdXJ0aGVyXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnNvbGUubG9nKGByZW1vdmluZyBpZHg6ICR7aWR4fWApO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5wb2ludExpc3RbMF07XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRMaXN0Lmxlbmd0aCA9PSAyKVxyXG4gICAgICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSAxO1xyXG4gICAgICAgIHRoaXMucmVjYWxjKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVjYWxjKCkge1xyXG4gICAgICAgIGxldCBhbmdsZXMgPSB0aGlzLnBvaW50TGlzdFxyXG4gICAgICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGlkeCA+IDApXHJcbiAgICAgICAgICAgIC5tYXAoKHZ0eCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB2dHgsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IE1hdGguYXRhbjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZ0eC55IC0gdGhpcy5vcmlnaW4ueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdnR4LnggLSB0aGlzLm9yaWdpbi54XHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhbmdsZXMuc29ydCgoYSwgYikgPT4gYS5hbmdsZSAtIGIuYW5nbGUpO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0ID0gYW5nbGVzLm1hcCgoaXRlbSkgPT4gaXRlbS52dHgpO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnVuc2hpZnQodGhpcy5vcmlnaW4pO1xyXG5cclxuICAgICAgICB0aGlzLmNlbnRlci54ID1cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QucmVkdWNlKCh0b3RhbCwgdnR4KSA9PiB0b3RhbCArIHZ0eC54LCAwKSAvXHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0Lmxlbmd0aDtcclxuICAgICAgICB0aGlzLmNlbnRlci55ID1cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QucmVkdWNlKCh0b3RhbCwgdnR4KSA9PiB0b3RhbCArIHZ0eC55LCAwKSAvXHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0Lmxlbmd0aDtcclxuICAgICAgICB0aGlzLmxlbkxpc3QgPSB0aGlzLnBvaW50TGlzdC5tYXAoKHZ0eCkgPT5cclxuICAgICAgICAgICAgZXVjbGlkZWFuRGlzdGFuY2VWdHgodnR4LCB0aGlzLmNlbnRlcilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xyXG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgZW5kWDogbnVtYmVyLCBlbmRZOiBudW1iZXIsIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoc3RhcnRYICsgZW5kWCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoc3RhcnRZICsgZW5kWSkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZXJ0ZXgoY2VudGVyWCwgY2VudGVyWSwgY29sb3IpO1xyXG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IG5ldyBWZXJ0ZXgoc3RhcnRYLCBzdGFydFksIGNvbG9yKTtcclxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgVmVydGV4KGVuZFgsIGVuZFksIGNvbG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBldWNsaWRlYW5EaXN0YW5jZVZ0eChcclxuICAgICAgICAgICAgb3JpZ2luLFxyXG4gICAgICAgICAgICBlbmRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKG9yaWdpbiwgZW5kKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdCA9IHRoaXMucG9pbnRMaXN0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XHJcbmltcG9ydCB7IG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBCYXNlU2hhcGUge1xyXG4gICAgXHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBpbml0aWFsUG9pbnQ6IG51bWJlcltdO1xyXG4gICAgZW5kUG9pbnQ6IG51bWJlcltdO1xyXG4gICAgdGFyZ2V0UG9pbnQ6IG51bWJlcltdO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgZW5kWDogbnVtYmVyLCBlbmRZOiBudW1iZXIsIGFuZ2xlSW5SYWRpYW5zOiBudW1iZXIsIHNjYWxlWDogbnVtYmVyID0gMSwgc2NhbGVZOiBudW1iZXIgPSAxLCB0cmFuc2Zvcm1hdGlvbjogbnVtYmVyW10gPSBtMy5pZGVudGl0eSgpKSB7XHJcbiAgICAgICAgc3VwZXIoNSwgaWQsIGNvbG9yKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB4MSA9IHN0YXJ0WDtcclxuICAgICAgICBjb25zdCB5MSA9IHN0YXJ0WTtcclxuICAgICAgICBjb25zdCB4MiA9IGVuZFg7XHJcbiAgICAgICAgY29uc3QgeTIgPSBzdGFydFk7XHJcbiAgICAgICAgY29uc3QgeDMgPSBzdGFydFg7XHJcbiAgICAgICAgY29uc3QgeTMgPSBlbmRZO1xyXG4gICAgICAgIGNvbnN0IHg0ID0gZW5kWDtcclxuICAgICAgICBjb25zdCB5NCA9IGVuZFk7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm1hdGlvbjtcclxuXHJcbiAgICAgICAgdGhpcy5hbmdsZUluUmFkaWFucyA9IGFuZ2xlSW5SYWRpYW5zO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBbc2NhbGVYLCBzY2FsZVldO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFBvaW50ID0gW3N0YXJ0WCwgc3RhcnRZLCAxXTtcclxuICAgICAgICB0aGlzLmVuZFBvaW50ID0gW2VuZFgsIGVuZFksIDFdO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0UG9pbnQgPSBbMCwwLCAxXTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHgyLXgxO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB5My15MTtcclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh4MSArIHg0KSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9ICh5MSArIHk0KSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XHJcblxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2gobmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKSwgbmV3IFZlcnRleCh4MiwgeTIsIGNvbG9yKSwgbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKSwgbmV3IFZlcnRleCh4NCwgeTQsIGNvbG9yKSk7XHJcbiAgICAgICAgdGhpcy5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3QgPSB0aGlzLnBvaW50TGlzdDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDA6ICR7eDF9LCAke3kxfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBwb2ludCAxOiAke3gyfSwgJHt5Mn1gKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgcG9pbnQgMjogJHt4M30sICR7eTN9YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDM6ICR7eDR9LCAke3k0fWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBjZW50ZXI6ICR7Y2VudGVyLnh9LCAke2NlbnRlci55fWApO1xyXG4gICAgfVxyXG5cclxuICAgIG92ZXJyaWRlIHNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCl7XHJcbiAgICAgICAgc3VwZXIuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgcG9pbnQgPSBbdGhpcy5wb2ludExpc3RbaWR4XS54LCB0aGlzLnBvaW50TGlzdFtpZHhdLnksIDFdO1xyXG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBtMy5tdWx0aXBseTN4MSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLmVuZFBvaW50KVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbFBvaW50ID0gbTMubXVsdGlwbHkzeDEodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5pbml0aWFsUG9pbnQpXHJcbiAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZENDV0FkamFjZW50KHBvaW50SWR4OiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IGNjd0FkamFjZW50OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0geyAwOiAyLCAxOiAwLCAyOiAzLCAzOiAxIH07XHJcbiAgICAgICAgcmV0dXJuIGNjd0FkamFjZW50W3BvaW50SWR4XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZENXQWRqYWNlbnQocG9pbnRJZHg6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3QgY3dBZGphY2VudDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHsgMDogMSwgMTogMywgMjogMCwgMzogMiB9O1xyXG4gICAgICAgIHJldHVybiBjd0FkamFjZW50W3BvaW50SWR4XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZE9wcG9zaXRlKHBvaW50SWR4OiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IG9wcG9zaXRlOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0geyAwOiAzLCAxOiAyLCAyOiAxLCAzOiAwIH07XHJcbiAgICAgICAgcmV0dXJuIG9wcG9zaXRlW3BvaW50SWR4XTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gcHVibGljIG92ZXJyaWRlIHNldFZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpOiB2b2lkIHtcclxuICAgICAgICAvLyAvLyBURVNUXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJpbml0aWFsXCIsIHRoaXMuaW5pdGlhbFBvaW50KTtcclxuICAgICAgICAvLyBjb25zdCB0YXJnZXRQb2ludFggPSB0aGlzLmVuZFBvaW50WzBdICsgdGhpcy50YXJnZXRQb2ludFswXTtcclxuICAgICAgICAvLyBjb25zdCB0YXJnZXRQb2ludFkgPSB0aGlzLmVuZFBvaW50WzFdICsgdGhpcy50YXJnZXRQb2ludFsxXTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVuZFBvaW50IFg6IFwiLCB0aGlzLmVuZFBvaW50WzBdKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVuZFBvaW50IFk6IFwiLCB0aGlzLmVuZFBvaW50WzFdKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRhcmdldFg6IFwiLCB0YXJnZXRQb2ludFgpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGFyZ2V0WTogXCIsIHRhcmdldFBvaW50WSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHRyYW5zbGF0ZVRvSW5pdGlhbCA9IG0zLnRyYW5zbGF0aW9uKC10aGlzLmluaXRpYWxQb2ludFswXSwgLXRoaXMuaW5pdGlhbFBvaW50WzFdKTtcclxuICAgICAgICAvLyBjb25zdCByb3RhdGVSZXZlcnQgPSBtMy5yb3RhdGlvbigtdGhpcy5hbmdsZUluUmFkaWFucyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHJlc1JvdGF0ZSA9IG0zLm11bHRpcGx5KHJvdGF0ZVJldmVydCwgdHJhbnNsYXRlVG9Jbml0aWFsKVxyXG4gICAgICAgIC8vIC8vIGNvbnN0IHJlc1RyYW5zQmFjayA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZUJhY2ssIHJlc1JvdGF0ZSlcclxuXHJcbiAgICAgICAgLy8gY29uc3Qgcm90YXRlZFRhcmdldD0gbTMubXVsdGlwbHkzeDEocmVzUm90YXRlLCBbdGFyZ2V0UG9pbnRYLCB0YXJnZXRQb2ludFksIDFdKTtcclxuICAgICAgICAvLyBjb25zdCByb3RhdGVkRW5kUG9pbnQ9bTMubXVsdGlwbHkzeDEocmVzUm90YXRlLCB0aGlzLmVuZFBvaW50KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJvdGF0ZWQgdGFyZ2V0XCIsIHJvdGF0ZWRUYXJnZXQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm90YXRlZCBlbmRwb2ludFwiLCByb3RhdGVkRW5kUG9pbnQpO1xyXG4gICAgICAgIC8vIC8vIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5tdWx0aXBseShyZXNSb3RhdGUsIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgpXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY29uc3QgY3VycmVudExlbmd0aCA9IHJvdGF0ZWRFbmRQb2ludFswXTtcclxuICAgICAgICAvLyBjb25zdCBjdXJyZW50V2lkdGg9IHJvdGF0ZWRFbmRQb2ludFsxXTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgdXBkYXRlZExlbmd0aCA9IGN1cnJlbnRMZW5ndGggKyByb3RhdGVkVGFyZ2V0WzBdIC0gcm90YXRlZEVuZFBvaW50WzBdO1xyXG4gICAgICAgIC8vIGNvbnN0IHVwZGF0ZWRXaWR0aCA9IGN1cnJlbnRXaWR0aCArIHJvdGF0ZWRUYXJnZXRbMV0gLSByb3RhdGVkRW5kUG9pbnRbMV07XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zdCBzY2FsZUxlbmd0aCA9IHVwZGF0ZWRMZW5ndGggLyBjdXJyZW50TGVuZ3RoO1xyXG4gICAgICAgIC8vIGNvbnN0IHNjYWxlV2lkdGggPSB1cGRhdGVkV2lkdGggLyBjdXJyZW50V2lkdGg7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJzY2FsZSBsZW5ndGg6IFwiLCBzY2FsZUxlbmd0aCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJzY2FsZSB3aWR0aDogXCIsIHNjYWxlV2lkdGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnN0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHNjYWxlTGVuZ3RoLCBzY2FsZVdpZHRoKTtcclxuICAgICAgICAvLyBjb25zdCByb3RhdGVCYWNrID0gbTMucm90YXRpb24odGhpcy5hbmdsZUluUmFkaWFucyk7XHJcbiAgICAgICAgLy8gY29uc3QgdHJhbnNsYXRlQmFjayA9IG0zLnRyYW5zbGF0aW9uKHRoaXMuaW5pdGlhbFBvaW50WzBdLCB0aGlzLmluaXRpYWxQb2ludFsxXSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHJlc1NjYWxlID0gbTMubXVsdGlwbHkocm90YXRlQmFjaywgc2NhbGluZyk7XHJcbiAgICAgICAgLy8gY29uc3QgcmVzQmFjayA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZUJhY2ssIHJlc1NjYWxlKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgdmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMubXVsdGlwbHkocmVzQmFjaywgcmVzUm90YXRlKTtcclxuICAgICAgICAvLyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMubXVsdGlwbHkodmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlczogXCIsIG0zLm11bHRpcGx5M3gxKHZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5pbml0aWFsUG9pbnQpKVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHNldFRyYW5zbGF0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAvLyAgICAgdGhpcy50cmFuc2xhdGlvbiA9IFt4LCB5XTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBzZXRSb3RhdGlvbihhbmdsZUluRGVncmVlczogbnVtYmVyKSB7XHJcbiAgICAvLyAgICAgdGhpcy5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKGFuZ2xlSW5EZWdyZWVzKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBzZXRTY2FsZShzY2FsZVg6IG51bWJlciwgc2NhbGVZOiBudW1iZXIpIHtcclxuICAgIC8vICAgICB0aGlzLnNjYWxlID0gW3NjYWxlWCwgc2NhbGVZXTtcclxuICAgIC8vIH1cclxufVxyXG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcclxuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHggfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZSBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICB2MSA6IFZlcnRleDtcclxuICAgIHYyIDogVmVydGV4O1xyXG4gICAgdjMgOiBWZXJ0ZXg7XHJcbiAgICB2NCA6IFZlcnRleDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIHg0OiBudW1iZXIsIHk0OiBudW1iZXIsIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoeDEgKyB4MykgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoeTEgKyB5MykgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZXJ0ZXgoY2VudGVyWCwgY2VudGVyWSwgY29sb3IpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyKDYsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudjEgPSBuZXcgVmVydGV4KHgxLCB5MSwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMudjIgPSBuZXcgVmVydGV4KHgyLCB5MiwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMudjMgPSBuZXcgVmVydGV4KHgzLCB5MywgY29sb3IpO1xyXG4gICAgICAgIHRoaXMudjQgPSBuZXcgVmVydGV4KHg0LCB5NCwgY29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKHRoaXMudjEsIHRoaXMudjIsIHRoaXMudjMsIHRoaXMudjQpO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0ID0gdGhpcy5wb2ludExpc3Q7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuL0FwcENhbnZhcyc7XHJcbmltcG9ydCBDYW52YXNDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcnMvTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XHJcbmltcG9ydCBUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgaW5pdCBmcm9tICcuL2luaXQnO1xyXG5cclxuY29uc3QgbWFpbiA9ICgpID0+IHtcclxuICAgIGNvbnN0IGluaXRSZXQgPSBpbml0KCk7XHJcbiAgICBpZiAoIWluaXRSZXQpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBXZWJHTCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IGdsLCBwcm9ncmFtLCBjb2xvckJ1ZmZlciwgcG9zaXRpb25CdWZmZXIgfSA9IGluaXRSZXQ7XHJcblxyXG4gICAgY29uc3QgYXBwQ2FudmFzID0gbmV3IEFwcENhbnZhcyhnbCwgcHJvZ3JhbSwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgIFxyXG4gICAgY29uc3QgY2FudmFzQ29udHJvbGxlciA9IG5ldyBDYW52YXNDb250cm9sbGVyKGFwcENhbnZhcyk7XHJcbiAgICBjYW52YXNDb250cm9sbGVyLnN0YXJ0KCk7XHJcbiAgICBcclxuICAgIG5ldyBUb29sYmFyQ29udHJvbGxlcihhcHBDYW52YXMsIGNhbnZhc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIC8vIGNvbnN0IHJlZCA9IG5ldyBDb2xvcigyNTUsIDAsIDIwMClcclxuICAgIC8vIC8vIGNvbnN0IHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKCd0cmktMScsIHJlZCwgNTAsIDUwLCAyMCwgNTAwLCAyMDAsIDEwMCk7XHJcbiAgICAvLyAvLyBhcHBDYW52YXMuYWRkU2hhcGUodHJpYW5nbGUpO1xyXG4gICAgXHJcbiAgICAvLyBjb25zdCByZWN0ID0gbmV3IFJlY3RhbmdsZSgncmVjdC0xJywgcmVkLCAwLDAsMTAsMjAsMCwxLDEpO1xyXG4gICAgLy8gcmVjdC5hbmdsZUluUmFkaWFucyA9IC0gTWF0aC5QSSAvIDQ7XHJcbiAgICAvLyAvLyByZWN0LnRhcmdldFBvaW50WzBdID0gNSAqIE1hdGguc3FydCgyKTtcclxuICAgIC8vIC8vIHJlY3Quc2NhbGVYID0gMTA7XHJcbiAgICAvLyAvLyByZWN0LnRyYW5zbGF0aW9uWzBdID0gNTAwO1xyXG4gICAgLy8gLy8gcmVjdC50cmFuc2xhdGlvblsxXSA9IDEwMDA7XHJcbiAgICAvLyAvLyByZWN0LnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUocmVjdCk7XHJcblxyXG4gICAgLy8gY29uc3QgbGluZSA9IG5ldyBMaW5lKCdsaW5lLTEnLCByZWQsIDEwMCwgMTAwLCAxMDAsIDMwMCk7XHJcbiAgICAvLyBjb25zdCBsaW5lMiA9IG5ldyBMaW5lKCdsaW5lLTInLCByZWQsIDEwMCwgMTAwLCAzMDAsIDEwMCk7XHJcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XHJcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUobGluZTIpO1xyXG59O1xyXG5cclxubWFpbigpO1xyXG4iLCJjb25zdCBjcmVhdGVTaGFkZXIgPSAoXHJcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gICAgdHlwZTogbnVtYmVyLFxyXG4gICAgc291cmNlOiBzdHJpbmdcclxuKSA9PiB7XHJcbiAgICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XHJcbiAgICBpZiAoc2hhZGVyKSB7XHJcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKTtcclxuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHNoYWRlcjtcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xyXG4gICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlUHJvZ3JhbSA9IChcclxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICB2dHhTaGQ6IFdlYkdMU2hhZGVyLFxyXG4gICAgZnJnU2hkOiBXZWJHTFNoYWRlclxyXG4pID0+IHtcclxuICAgIGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICBpZiAocHJvZ3JhbSkge1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2dHhTaGQpO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmdTaGQpO1xyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcclxuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHByb2dyYW07XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSkpO1xyXG4gICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2MnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJyk7XHJcblxyXG4gICAgaWYgKCFnbCkge1xyXG4gICAgICAgIGFsZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB3ZWJHTCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBJbml0aWFsaXplIHNoYWRlcnMgYW5kIHByb2dyYW1zXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICBjb25zdCB2dHhTaGFkZXJTb3VyY2UgPSAoXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRleC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxyXG4gICAgKS50ZXh0O1xyXG4gICAgY29uc3QgZnJhZ1NoYWRlclNvdXJjZSA9IChcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJhZ21lbnQtc2hhZGVyLTJkJykgYXMgSFRNTFNjcmlwdEVsZW1lbnRcclxuICAgICkudGV4dDtcclxuXHJcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBjcmVhdGVTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZ0eFNoYWRlclNvdXJjZSk7XHJcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGNyZWF0ZVNoYWRlcihcclxuICAgICAgICBnbCxcclxuICAgICAgICBnbC5GUkFHTUVOVF9TSEFERVIsXHJcbiAgICAgICAgZnJhZ1NoYWRlclNvdXJjZVxyXG4gICAgKTtcclxuICAgIGlmICghdmVydGV4U2hhZGVyIHx8ICFmcmFnbWVudFNoYWRlcikgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHByb2dyYW0gPSBjcmVhdGVQcm9ncmFtKGdsLCB2ZXJ0ZXhTaGFkZXIsIGZyYWdtZW50U2hhZGVyKTtcclxuICAgIGlmICghcHJvZ3JhbSkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgZGlzcGxheVdpZHRoICA9IE1hdGgucm91bmQod2lkdGggKiBkcHIpO1xyXG4gICAgY29uc3QgZGlzcGxheUhlaWdodCA9IE1hdGgucm91bmQoaGVpZ2h0ICogZHByKTtcclxuXHJcbiAgICBjb25zdCBuZWVkUmVzaXplID1cclxuICAgICAgICBnbC5jYW52YXMud2lkdGggIT0gZGlzcGxheVdpZHRoIHx8IGdsLmNhbnZhcy5oZWlnaHQgIT0gZGlzcGxheUhlaWdodDtcclxuXHJcbiAgICBpZiAobmVlZFJlc2l6ZSkge1xyXG4gICAgICAgIGdsLmNhbnZhcy53aWR0aCA9IGRpc3BsYXlXaWR0aDtcclxuICAgICAgICBnbC5jYW52YXMuaGVpZ2h0ID0gZGlzcGxheUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBnbC52aWV3cG9ydCgwLCAwLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgZ2wuY2xlYXJDb2xvcigwLCAwLCAwLCAwKTtcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xyXG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBFbmFibGUgJiBpbml0aWFsaXplIHVuaWZvcm1zIGFuZCBhdHRyaWJ1dGVzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBSZXNvbHV0aW9uXHJcbiAgICBjb25zdCBtYXRyaXhVbmlmb3JtTG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oXHJcbiAgICAgICAgcHJvZ3JhbSxcclxuICAgICAgICAndV90cmFuc2Zvcm1hdGlvbidcclxuICAgICk7XHJcbiAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeFVuaWZvcm1Mb2NhdGlvbiwgZmFsc2UsIFsxLDAsMCwwLDEsMCwwLDAsMV0pXHJcblxyXG4gICAgY29uc3QgcmVzb2x1dGlvblVuaWZvcm1Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihcclxuICAgICAgICBwcm9ncmFtLFxyXG4gICAgICAgICd1X3Jlc29sdXRpb24nXHJcbiAgICApO1xyXG4gICAgZ2wudW5pZm9ybTJmKHJlc29sdXRpb25Vbmlmb3JtTG9jYXRpb24sIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgLy8gQ29sb3JcclxuICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICBpZiAoIWNvbG9yQnVmZmVyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBjb2xvciBidWZmZXInKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcclxuICAgIGNvbnN0IGNvbG9yQXR0cmlidXRlTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYV9jb2xvcicpO1xyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoY29sb3JBdHRyaWJ1dGVMb2NhdGlvbik7XHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGNvbG9yQXR0cmlidXRlTG9jYXRpb24sIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblxyXG4gICAgLy8gUG9zaXRpb25cclxuICAgIGNvbnN0IHBvc2l0aW9uQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICBpZiAoIXBvc2l0aW9uQnVmZmVyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBwb3NpdGlvbiBidWZmZXInKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcclxuICAgIGNvbnN0IHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihcclxuICAgICAgICBwcm9ncmFtLFxyXG4gICAgICAgICdhX3Bvc2l0aW9uJ1xyXG4gICAgKTtcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24pO1xyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cclxuICAgIC8vIERvIG5vdCByZW1vdmUgY29tbWVudHMsIHVzZWQgZm9yIHNhbml0eSBjaGVja1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gU2V0IHRoZSB2YWx1ZXMgb2YgdGhlIGJ1ZmZlclxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIC8vIGNvbnN0IGNvbG9ycyA9IFsxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wXTtcclxuICAgIC8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCBnbC5TVEFUSUNfRFJBVyk7XHJcblxyXG4gICAgLy8gY29uc3QgcG9zaXRpb25zID0gWzEwMCwgNTAsIDIwLCAxMCwgNTAwLCA1MDBdO1xyXG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcclxuICAgIC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyksIGdsLlNUQVRJQ19EUkFXKTtcclxuXHJcbiAgICAvLyA9PT09XHJcbiAgICAvLyBEcmF3XHJcbiAgICAvLyA9PT09XHJcbiAgICAvLyBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywgMCwgMyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwb3NpdGlvbkJ1ZmZlcixcclxuICAgICAgICBwcm9ncmFtLFxyXG4gICAgICAgIGNvbG9yQnVmZmVyLFxyXG4gICAgICAgIGdsLFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXQ7XHJcbiIsImltcG9ydCBWZXJ0ZXggZnJvbSAnLi9CYXNlL1ZlcnRleCc7XHJcblxyXG5leHBvcnQgY29uc3QgZXVjbGlkZWFuRGlzdGFuY2VWdHggPSAoYTogVmVydGV4LCBiOiBWZXJ0ZXgpOiBudW1iZXIgPT4ge1xyXG4gICAgY29uc3QgZHggPSBhLnggLSBiLng7XHJcbiAgICBjb25zdCBkeSA9IGEueSAtIGIueTtcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBldWNsaWRlYW5EaXN0YW5jZSA9IChheDogbnVtYmVyLCBheTogbnVtYmVyLCBieDogbnVtYmVyLCBieTogbnVtYmVyKTogbnVtYmVyID0+IHtcclxuICBjb25zdCBkeCA9IGF4IC0gYng7XHJcbiAgY29uc3QgZHkgPSBheSAtIGJ5O1xyXG5cclxuICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxufTtcclxuXHJcbi8vIDM2MCBERUdcclxuZXhwb3J0IGNvbnN0IGdldEFuZ2xlID0gKG9yaWdpbjogVmVydGV4LCB0YXJnZXQ6IFZlcnRleCkgPT4ge1xyXG4gICAgY29uc3QgcGx1c01pbnVzRGVnID0gcmFkVG9EZWcoTWF0aC5hdGFuMihvcmlnaW4ueSAtIHRhcmdldC55LCBvcmlnaW4ueCAtIHRhcmdldC54KSk7XHJcbiAgICByZXR1cm4gcGx1c01pbnVzRGVnID49IDAgPyAxODAgLSBwbHVzTWludXNEZWcgOiBNYXRoLmFicyhwbHVzTWludXNEZWcpICsgMTgwO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmFkVG9EZWcgPSAocmFkOiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVnVG9SYWQgPSAoZGVnOiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9SZ2IoaGV4OiBzdHJpbmcpIHtcclxuICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgcmV0dXJuIHJlc3VsdCA/IHtcclxuICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxyXG4gICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXHJcbiAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxyXG4gIH0gOiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmdiVG9IZXgocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gIHJldHVybiBcIiNcIiArICgxIDw8IDI0IHwgciA8PCAxNiB8IGcgPDwgOCB8IGIpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG0zID0ge1xyXG4gICAgaWRlbnRpdHk6IGZ1bmN0aW9uKCkgOiBudW1iZXJbXSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgIDAsIDAsIDEsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgdHJhbnNsYXRpb246IGZ1bmN0aW9uKHR4IDogbnVtYmVyLCB0eSA6IG51bWJlcikgOiBudW1iZXJbXSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgIHR4LCB0eSwgMSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICByb3RhdGlvbjogZnVuY3Rpb24oYW5nbGVJblJhZGlhbnMgOiBudW1iZXIpIDogbnVtYmVyW10ge1xyXG4gICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xyXG4gICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGMsLXMsIDAsXHJcbiAgICAgICAgcywgYywgMCxcclxuICAgICAgICAwLCAwLCAxLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICBcclxuICAgIHNjYWxpbmc6IGZ1bmN0aW9uKHN4IDogbnVtYmVyLCBzeSA6IG51bWJlcikgOiBudW1iZXJbXSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgc3gsIDAsIDAsXHJcbiAgICAgICAgMCwgc3ksIDAsXHJcbiAgICAgICAgMCwgMCwgMSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICBtdWx0aXBseTogZnVuY3Rpb24oYSA6IG51bWJlcltdLCBiIDogbnVtYmVyW10pIDogbnVtYmVyW10ge1xyXG4gICAgICBjb25zdCBhMDAgPSBhWzAgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGEwMSA9IGFbMCAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTAyID0gYVswICogMyArIDJdO1xyXG4gICAgICBjb25zdCBhMTAgPSBhWzEgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGExMSA9IGFbMSAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTEyID0gYVsxICogMyArIDJdO1xyXG4gICAgICBjb25zdCBhMjAgPSBhWzIgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGEyMSA9IGFbMiAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTIyID0gYVsyICogMyArIDJdO1xyXG4gICAgICBjb25zdCBiMDAgPSBiWzAgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGIwMSA9IGJbMCAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYjAyID0gYlswICogMyArIDJdO1xyXG4gICAgICBjb25zdCBiMTAgPSBiWzEgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGIxMSA9IGJbMSAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYjEyID0gYlsxICogMyArIDJdO1xyXG4gICAgICBjb25zdCBiMjAgPSBiWzIgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGIyMSA9IGJbMiAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYjIyID0gYlsyICogMyArIDJdO1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMCxcclxuICAgICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXHJcbiAgICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxyXG4gICAgICAgIGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMCxcclxuICAgICAgICBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjEsXHJcbiAgICAgICAgYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyLFxyXG4gICAgICAgIGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMCxcclxuICAgICAgICBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjEsXHJcbiAgICAgICAgYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbnZlcnNlOiBmdW5jdGlvbihtIDogbnVtYmVyW10pIHtcclxuICAgICAgY29uc3QgZGV0ID0gbVswXSAqIChtWzRdICogbVs4XSAtIG1bN10gKiBtWzVdKSAtXHJcbiAgICAgICAgICAgICAgICAgIG1bMV0gKiAobVszXSAqIG1bOF0gLSBtWzVdICogbVs2XSkgK1xyXG4gICAgICAgICAgICAgICAgICBtWzJdICogKG1bM10gKiBtWzddIC0gbVs0XSAqIG1bNl0pO1xyXG4gIFxyXG4gICAgICBpZiAoZGV0ID09PSAwKSByZXR1cm4gbnVsbDtcclxuICBcclxuICAgICAgY29uc3QgaW52RGV0ID0gMSAvIGRldDtcclxuICBcclxuICAgICAgcmV0dXJuIFsgXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVs0XSAqIG1bOF0gLSBtWzVdICogbVs3XSksIFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMl0gKiBtWzddIC0gbVsxXSAqIG1bOF0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMV0gKiBtWzVdIC0gbVsyXSAqIG1bNF0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bNV0gKiBtWzZdIC0gbVszXSAqIG1bOF0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMF0gKiBtWzhdIC0gbVsyXSAqIG1bNl0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMl0gKiBtWzNdIC0gbVswXSAqIG1bNV0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bM10gKiBtWzddIC0gbVs0XSAqIG1bNl0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMV0gKiBtWzZdIC0gbVswXSAqIG1bN10pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMF0gKiBtWzRdIC0gbVsxXSAqIG1bM10pXHJcbiAgICAgIF07XHJcbiAgfSxcclxuXHJcbiAgICBtdWx0aXBseTN4MTogZnVuY3Rpb24oYSA6IG51bWJlcltdLCBiIDogbnVtYmVyW10pIDogbnVtYmVyW10ge1xyXG4gICAgICBjb25zdCBhMDAgPSBhWzAgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGEwMSA9IGFbMCAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTAyID0gYVswICogMyArIDJdO1xyXG4gICAgICBjb25zdCBhMTAgPSBhWzEgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGExMSA9IGFbMSAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTEyID0gYVsxICogMyArIDJdO1xyXG4gICAgICBjb25zdCBhMjAgPSBhWzIgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGEyMSA9IGFbMiAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTIyID0gYVsyICogMyArIDJdO1xyXG4gICAgICBjb25zdCBiMDAgPSBiWzAgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGIwMSA9IGJbMCAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYjAyID0gYlswICogMyArIDJdO1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMCxcclxuICAgICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXHJcbiAgICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuXHJcbiAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uKG0gOiBudW1iZXJbXSwgdHg6bnVtYmVyLCB0eTpudW1iZXIpIHtcclxuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnRyYW5zbGF0aW9uKHR4LCB0eSkpO1xyXG4gICAgfSxcclxuICBcclxuICAgIHJvdGF0ZTogZnVuY3Rpb24obTpudW1iZXJbXSwgYW5nbGVJblJhZGlhbnM6bnVtYmVyKSB7XHJcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy5yb3RhdGlvbihhbmdsZUluUmFkaWFucykpO1xyXG4gICAgfSxcclxuICBcclxuICAgIHNjYWxlOiBmdW5jdGlvbihtOm51bWJlcltdLCBzeDpudW1iZXIsIHN5Om51bWJlcikge1xyXG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMuc2NhbGluZyhzeCwgc3kpKTtcclxuICAgIH0sXHJcbiAgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=