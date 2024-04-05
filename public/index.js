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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var ShapeToolbarController_1 = __importDefault(__webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts"));
var FanPolygonToolbarController = /** @class */ (function (_super) {
    __extends(FanPolygonToolbarController, _super);
    function FanPolygonToolbarController(fanPoly, appCanvas) {
        var _this = _super.call(this, fanPoly, appCanvas) || this;
        _this.DEFAULT_SCALE = 50;
        _this.currentScale = 50;
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
}(ShapeToolbarController_1.default));
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
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var ShapeToolbarController_1 = __importDefault(__webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts"));
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
    return RectangleToolbarController;
}(ShapeToolbarController_1.default));
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
            _this.shape.pointList[idx].c = color;
            _this.updateShape(_this.shape);
        };
        this.registerSlider(this.vtxPosXSlider, updateSlider);
        this.registerSlider(this.vtxPosYSlider, updateSlider);
        this.registerSlider(this.vtxColorPicker, updateColor);
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var ShapeToolbarController_1 = __importDefault(__webpack_require__(/*! ./ShapeToolbarController */ "./src/Controllers/Toolbar/Shape/ShapeToolbarController.ts"));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
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
    return SquareToolbarController;
}(ShapeToolbarController_1.default));
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
            else if (shape instanceof Square_1.default) {
                _this.toolbarController = new SquareToolbarController_1.default(shape, appCanvas);
            }
            else if (shape instanceof FanPolygon_1.default) {
                _this.toolbarController = new FanPolygonToolbarController_1.default(shape, appCanvas);
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
    new ToolbarController_1.default(appCanvas);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRS9GLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRXJHLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0YsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsV0FBVyxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRWxHLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0RyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxZQUFZLEVBQUUsVUFBQyxDQUFDLElBQU0sS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUM7O0lBQzNHLENBQUM7SUFFTywrQ0FB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QUNSLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUNSLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNSLENBQUM7SUFDSixDQUFDO0lBRUQsUUFBUSxFQUFFLFVBQVMsQ0FBWSxFQUFFLENBQVk7UUFDM0MsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsT0FBTztZQUNMLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1NBQ2xDLENBQUM7SUFDSixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsQ0FBWTtRQUM1QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9DLElBQUksR0FBRyxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUUzQixJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRXZCLE9BQU87WUFDSCxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QyxDQUFDO0lBQ04sQ0FBQztJQUVDLFdBQVcsRUFBRSxVQUFTLENBQVksRUFBRSxDQUFZO1FBQzlDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE9BQU87WUFDTCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLENBQVksRUFBRSxFQUFTLEVBQUUsRUFBUztRQUNwRCxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELE1BQU0sRUFBRSxVQUFTLENBQVUsRUFBRSxjQUFxQjtRQUNoRCxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsQ0FBVSxFQUFFLEVBQVMsRUFBRSxFQUFTO1FBQzlDLE9BQU8sVUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsVUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0YsQ0FBQzs7Ozs7OztVQ25LSjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0FwcENhbnZhcy50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9CYXNlU2hhcGUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQ29sb3IudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvVmVydGV4LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9GYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9MaW5lTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9SZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL1NxdWFyZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9GYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9GYW5Qb2x5Z29uLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvTGluZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1NxdWFyZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL2luaXQudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL0Jhc2UvQmFzZVNoYXBlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENhbnZhcyB7XHJcbiAgICBwcml2YXRlIHByb2dyYW06IFdlYkdMUHJvZ3JhbTtcclxuICAgIHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dDtcclxuICAgIHByaXZhdGUgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyO1xyXG4gICAgcHJpdmF0ZSBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXI7XHJcbiAgICBwcml2YXRlIF91cGRhdGVUb29sYmFyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF9zaGFwZXM6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4gPSB7fTtcclxuXHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICAgICAgICBwcm9ncmFtOiBXZWJHTFByb2dyYW0sXHJcbiAgICAgICAgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLFxyXG4gICAgICAgIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlclxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25CdWZmZXIgPSBwb3NpdGlvbkJ1ZmZlcjtcclxuICAgICAgICB0aGlzLmNvbG9yQnVmZmVyID0gY29sb3JCdWZmZXI7XHJcbiAgICAgICAgdGhpcy5wcm9ncmFtID0gcHJvZ3JhbTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGdsLmNhbnZhcy53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGdsLmNhbnZhcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSB0aGlzLnBvc2l0aW9uQnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gdGhpcy5jb2xvckJ1ZmZlcjtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gc2hhcGUucG9pbnRMaXN0LmZsYXRNYXAoKHBvaW50KSA9PiBbXHJcbiAgICAgICAgICAgICAgICBwb2ludC54LFxyXG4gICAgICAgICAgICAgICAgcG9pbnQueSxcclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29sb3JzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYXBlLnBvaW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goc2hhcGUucG9pbnRMaXN0W2ldLmMuciwgc2hhcGUucG9pbnRMaXN0W2ldLmMuZywgc2hhcGUucG9pbnRMaXN0W2ldLmMuYik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJpbmQgY29sb3IgZGF0YVxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLFxyXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEJpbmQgcG9zaXRpb24gZGF0YVxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghKHRoaXMucG9zaXRpb25CdWZmZXIgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIGJ1ZmZlciBpcyBub3QgYSB2YWxpZCBXZWJHTEJ1ZmZlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCEodGhpcy5jb2xvckJ1ZmZlciBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29sb3IgYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdHJhbnNmb3JtYXRpb24gbWF0cml4XHJcbiAgICAgICAgICAgIC8vIHNoYXBlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtYXRyaXhMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIFwidV90cmFuc2Zvcm1hdGlvblwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoc2hhcGUudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG4gICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGFwcGx5U3BlY2lhbFRyZWF0bWVudExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X2FwcGx5U3BlY2lhbFRyZWF0bWVudFwiKTtcclxuICAgICAgICAgICAgLy8gY29uc3Qgc3BlY2lhbE9mZnNldExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X3NwZWNpYWxPZmZzZXRcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBjb25zdCBhcHBseVNwZWNpYWxUcmVhdG1lbnQgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHNwZWNpYWxPZmZzZXQgPSBbMC4wLCAwLjBdO1xyXG5cclxuICAgICAgICAgICAgLy8gZ2wudW5pZm9ybTFpKGFwcGx5U3BlY2lhbFRyZWF0bWVudExvY2F0aW9uLCBhcHBseVNwZWNpYWxUcmVhdG1lbnQgPyAxIDogMCk7XHJcbiAgICAgICAgICAgIC8vIGdsLnVuaWZvcm0yZnYoc3BlY2lhbE9mZnNldExvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KHNwZWNpYWxPZmZzZXQpKTtcclxuXHJcbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoc2hhcGUuZ2xEcmF3VHlwZSwgMCwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2hhcGVzKCk6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVzKHY6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4pIHtcclxuICAgICAgICB0aGlzLl9zaGFwZXMgPSB2O1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZVRvb2xiYXIpXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xiYXIuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHVwZGF0ZVRvb2xiYXIodiA6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVUb29sYmFyID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVJZEZyb21UYWcodGFnOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB3aXRoU2FtZVRhZyA9IE9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5maWx0ZXIoKGlkKSA9PiBpZC5zdGFydHNXaXRoKHRhZyArICctJykpO1xyXG4gICAgICAgIHJldHVybiBgJHt0YWd9LSR7d2l0aFNhbWVUYWcubGVuZ3RoICsgMX1gXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNoYXBlKHNoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKHNoYXBlLmlkKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBhbHJlYWR5IHVzZWQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xyXG4gICAgICAgIG5ld1NoYXBlc1tzaGFwZS5pZF0gPSBzaGFwZTtcclxuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZWRpdFNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgbm90IGZvdW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcclxuICAgICAgICBuZXdTaGFwZXNbbmV3U2hhcGUuaWRdID0gbmV3U2hhcGU7XHJcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZVNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgbm90IGZvdW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcclxuICAgICAgICBkZWxldGUgbmV3U2hhcGVzW25ld1NoYXBlLmlkXTtcclxuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcclxuICAgIH1cclxufSIsImltcG9ydCB7IG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuL1ZlcnRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQmFzZVNoYXBlIHtcclxuXHJcbiAgICBwb2ludExpc3Q6IFZlcnRleFtdID0gW107XHJcbiAgICBidWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3Q6IFZlcnRleFtdID0gW107XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgY29sb3I6IENvbG9yO1xyXG4gICAgZ2xEcmF3VHlwZTogbnVtYmVyO1xyXG4gICAgY2VudGVyOiBWZXJ0ZXg7XHJcblxyXG4gICAgdHJhbnNsYXRpb246IFtudW1iZXIsIG51bWJlcl0gPSBbMCwgMF07XHJcbiAgICBhbmdsZUluUmFkaWFuczogbnVtYmVyID0gMDtcclxuICAgIHNjYWxlOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xyXG5cclxuICAgIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBudW1iZXJbXSA9IG0zLmlkZW50aXR5KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2xEcmF3VHlwZTogbnVtYmVyLCBpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIGNlbnRlcjogVmVydGV4ID0gbmV3IFZlcnRleCgwLCAwLCBjb2xvciksIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IGdsRHJhd1R5cGU7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcclxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gcm90YXRpb247XHJcbiAgICAgICAgdGhpcy5zY2FsZVswXSA9IHNjYWxlWDtcclxuICAgICAgICB0aGlzLnNjYWxlWzFdID0gc2NhbGVZO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5pZGVudGl0eSgpXHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlVG9DZW50ZXIgPSBtMy50cmFuc2xhdGlvbigtdGhpcy5jZW50ZXIueCwgLXRoaXMuY2VudGVyLnkpO1xyXG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbTMucm90YXRpb24odGhpcy5hbmdsZUluUmFkaWFucyk7XHJcbiAgICAgICAgbGV0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHRoaXMuc2NhbGVbMF0sIHRoaXMuc2NhbGVbMV0pO1xyXG4gICAgICAgIGxldCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24odGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlID0gbTMudHJhbnNsYXRpb24odGhpcy50cmFuc2xhdGlvblswXSwgdGhpcy50cmFuc2xhdGlvblsxXSk7XHJcblxyXG4gICAgICAgIGxldCByZXNTY2FsZSA9IG0zLm11bHRpcGx5KHNjYWxpbmcsIHRyYW5zbGF0ZVRvQ2VudGVyKTtcclxuICAgICAgICBsZXQgcmVzUm90YXRlID0gbTMubXVsdGlwbHkocm90YXRpb24scmVzU2NhbGUpO1xyXG4gICAgICAgIGxldCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzUm90YXRlKTtcclxuICAgICAgICBjb25zdCByZXNUcmFuc2xhdGUgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGUsIHJlc0JhY2spO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSByZXNUcmFuc2xhdGU7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcjogbnVtYmVyO1xyXG4gICAgZzogbnVtYmVyO1xyXG4gICAgYjogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQ29sb3IgZnJvbSBcIi4vQ29sb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlcnRleCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBjOiBDb2xvcjtcclxuICAgIGlzU2VsZWN0ZWQgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBjOiBDb2xvciwgaXNTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5pc1NlbGVjdGVkID0gaXNTZWxlY3RlZDtcclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9GYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZS9JU2hhcGVNYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgTGluZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0xpbmVNYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IFNxdWFyZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1NxdWFyZU1ha2VyQ29udHJvbGxlcic7XHJcblxyXG5lbnVtIEFWQUlMX1NIQVBFUyB7XHJcbiAgICBMaW5lID0gJ0xpbmUnLFxyXG4gICAgUmVjdGFuZ2xlID0gJ1JlY3RhbmdsZScsXHJcbiAgICBTcXVhcmUgPSAnU3F1YXJlJyxcclxuICAgIEZhblBvbHkgPSAnRmFuUG9seScsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0NvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfc2hhcGVDb250cm9sbGVyOiBJU2hhcGVNYWtlckNvbnRyb2xsZXI7XHJcbiAgICBwcml2YXRlIGNhbnZhc0VsbXQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBidXR0b25Db250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBjb2xvclBpY2tlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbnZhc0VsbXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2hhcGUtYnV0dG9uLWNvbnRhaW5lcidcclxuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3NldC1wb2x5Z29uJ1xyXG4gICAgICAgICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdCA9IGNhbnZhc0VsbXQ7XHJcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBidXR0b25Db250YWluZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcihhcHBDYW52YXMpO1xyXG5cclxuICAgICAgICB0aGlzLmNvbG9yUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICdzaGFwZS1jb2xvci1waWNrZXInXHJcbiAgICAgICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RYID0gZS5vZmZzZXRYICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RZID0gZS5vZmZzZXRZICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RYLFxyXG4gICAgICAgICAgICAgICAgY29ycmVjdFksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yUGlja2VyLnZhbHVlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBzaGFwZUNvbnRyb2xsZXIoKTogSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVDb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0IHNoYXBlQ29udHJvbGxlcih2OiBJU2hhcGVNYWtlckNvbnRyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSB2O1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RYID0gZS5vZmZzZXRYICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RZID0gZS5vZmZzZXRZICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RYLFxyXG4gICAgICAgICAgICAgICAgY29ycmVjdFksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yUGlja2VyLnZhbHVlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDb250cm9sbGVyKHNoYXBlU3RyOiBBVkFJTF9TSEFQRVMpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgICAgICBzd2l0Y2ggKHNoYXBlU3RyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLkxpbmU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpbmVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5SZWN0YW5nbGU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLlNxdWFyZTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3F1YXJlTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcclxuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuRmFuUG9seTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBzaGFwZSBzdHJpbmcnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBzaGFwZVN0ciBpbiBBVkFJTF9TSEFQRVMpIHtcclxuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzaGFwZS1idXR0b24nKTtcclxuICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gc2hhcGVTdHI7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSB0aGlzLmluaXRDb250cm9sbGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlU3RyIGFzIEFWQUlMX1NIQVBFU1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSAnLi4vLi4vLi4vQmFzZS9Db2xvcic7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSAnLi4vLi4vLi4vQmFzZS9WZXJ0ZXgnO1xyXG5pbXBvcnQgRmFuUG9seWdvbiBmcm9tICcuLi8uLi8uLi9TaGFwZXMvRmFuUG9seWdvbic7XHJcbmltcG9ydCB7IGhleFRvUmdiIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tICcuL0lTaGFwZU1ha2VyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyXHJcbiAgICBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlclxyXG57XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBvcmlnaW46IFZlcnRleCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50UG9seTogRmFuUG9seWdvbiB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBzZXRQb2x5Z29uQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3NldC1wb2x5Z29uJ1xyXG4gICAgICAgICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xyXG5cclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24ub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmlnaW4gIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkucG9pbnRMaXN0Lmxlbmd0aCA+IDJcclxuICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBoZXhUb1JnYihoZXgpID8/IHsgcjogMCwgZzogMCwgYjogMCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3JpZ2luICE9PSBudWxsICYmIHRoaXMuY3VycmVudFBvbHkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3VmVydGV4ID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3BvbHlmYW4nKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBuZXcgRmFuUG9seWdvbihpZCwgY29sb3IsIFt0aGlzLm9yaWdpbiwgbmV3VmVydGV4XSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9seSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seS5hZGRWZXJ0ZXgobmV3VmVydGV4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZSh0aGlzLmN1cnJlbnRQb2x5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBMaW5lIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvTGluZVwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xyXG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdsaW5lJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBuZXcgTGluZShpZCwgY29sb3IsIHRoaXMub3JpZ2luLngsIHRoaXMub3JpZ2luLnksIHgsIHkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZShsaW5lKTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL1JlY3RhbmdsZVwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xyXG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBvcmlnaW46IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB7ciwgZywgYn0gPSBoZXhUb1JnYihoZXgpID8/IHtyOiAwLCBnOiAwLCBiOiAwfTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3JlY3RhbmdsZScpO1xyXG4gICAgICAgICAgICBjb25zdCByZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICAgICAgaWQsIGNvbG9yLCB0aGlzLm9yaWdpbi54LCB0aGlzLm9yaWdpbi55LCB4LCB5LDAsMSwxKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUocmVjdGFuZ2xlKTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFNxdWFyZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL1NxdWFyZVwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xyXG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBvcmlnaW46IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB7ciwgZywgYn0gPSBoZXhUb1JnYihoZXgpID8/IHtyOiAwLCBnOiAwLCBiOiAwfTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3NxdWFyZScpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdjEgPSB7eDogeCwgeTogeX07XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2MXg6ICR7djEueH0sIHYxeTogJHt2MS55fWApXHJcblxyXG4gICAgICAgICAgICBjb25zdCB2MiA9IHt4OiB0aGlzLm9yaWdpbi54IC0gKHkgLSB0aGlzLm9yaWdpbi55KSwgXHJcbiAgICAgICAgICAgICAgICB5OiB0aGlzLm9yaWdpbi55ICsgKHgtdGhpcy5vcmlnaW4ueCl9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2Mng6ICR7djIueH0sIHYyeTogJHt2Mi55fWApXHJcblxyXG4gICAgICAgICAgICBjb25zdCB2MyA9IHt4OiAyKnRoaXMub3JpZ2luLnggLSB4LCBcclxuICAgICAgICAgICAgICAgIHk6IDIqdGhpcy5vcmlnaW4ueSAtIHl9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2M3g6ICR7djMueH0sIHYzeTogJHt2My55fWApXHJcblxyXG4gICAgICAgICAgICBjb25zdCB2NCA9IHt4OiB0aGlzLm9yaWdpbi54ICsgKHkgLSB0aGlzLm9yaWdpbi55KSwgXHJcbiAgICAgICAgICAgICAgICB5OiB0aGlzLm9yaWdpbi55IC0gKHgtdGhpcy5vcmlnaW4ueCl9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2NHg6ICR7djQueH0sIHY0eTogJHt2NC55fWApXHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBuZXcgU3F1YXJlKFxyXG4gICAgICAgICAgICAgICAgaWQsIGNvbG9yLCB2MS54LCB2MS55LCB2Mi54LCB2Mi55LCB2My54LCB2My55LCB2NC54LCB2NC55KTtcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUoc3F1YXJlKTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IEZhblBvbHlnb24gZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0ZhblBvbHlnb24nO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCwgZ2V0QW5nbGUgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCBTaGFwZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgc2NhbGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBERUZBVUxUX1NDQUxFID0gNTA7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50U2NhbGU6IG51bWJlciA9IDUwO1xyXG4gICAgcHJpdmF0ZSBmYW5Qb2x5OiBGYW5Qb2x5Z29uO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGZhblBvbHk6IEZhblBvbHlnb24sIGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgc3VwZXIoZmFuUG9seSwgYXBwQ2FudmFzKTtcclxuXHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5ID0gZmFuUG9seTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcclxuICAgICAgICAgICAgKCkgPT4gZmFuUG9seS5wb2ludExpc3RbMF0ueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWScsXHJcbiAgICAgICAgICAgICgpID0+IGZhblBvbHkucG9pbnRMaXN0WzBdLnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2FsZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnU2NhbGUnLFxyXG4gICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRTY2FsZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICAxMDBcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5zY2FsZVNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjYWxlKHBhcnNlSW50KHRoaXMuc2NhbGVTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1ggLSB0aGlzLmZhblBvbHkucG9pbnRMaXN0WzBdLng7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnBvaW50TGlzdCA9IHRoaXMuZmFuUG9seS5wb2ludExpc3QubWFwKCh2dHgpID0+IHtcclxuICAgICAgICAgICAgdnR4LnggKz0gZGlmZjtcclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucmVjYWxjKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWSAtIHRoaXMuZmFuUG9seS5wb2ludExpc3RbMF0ueTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIHZ0eC55ICs9IGRpZmY7XHJcbiAgICAgICAgICAgIHJldHVybiB2dHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnJlY2FsYygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5mYW5Qb2x5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEN1cnJlbnRTY2FsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTY2FsZShuZXdTY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSBuZXdTY2FsZTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKGdldEFuZ2xlKHRoaXMuZmFuUG9seS5jZW50ZXIsIHZ0eCkpO1xyXG4gICAgICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWQpO1xyXG4gICAgICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xyXG5cclxuICAgICAgICAgICAgdnR4LnggPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5LmNlbnRlci54ICtcclxuICAgICAgICAgICAgICAgIGNvcyAqXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuICAgICAgICAgICAgdnR4LnkgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5LmNlbnRlci55IC1cclxuICAgICAgICAgICAgICAgIHNpbiAqXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2dHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0W2lkeF0ueCA9IHg7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnBvaW50TGlzdFtpZHhdLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5yZWNhbGMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IExpbmUgZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0xpbmUnO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGxlbmd0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJvdGF0ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIGxpbmU6IExpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3IobGluZTogTGluZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICBzdXBlcihsaW5lLCBhcHBDYW52YXMpO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG5cclxuICAgICAgICBjb25zdCBkaWFnb25hbCA9IE1hdGguc3FydChcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoICogYXBwQ2FudmFzLndpZHRoICtcclxuICAgICAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHQgKiBhcHBDYW52YXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmxlbmd0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnTGVuZ3RoJyxcclxuICAgICAgICAgICAgKCkgPT4gbGluZS5sZW5ndGgsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGRpYWdvbmFsXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMubGVuZ3RoU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFgnLFxyXG4gICAgICAgICAgICAoKSA9PiBsaW5lLnBvaW50TGlzdFswXS54LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGhcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWScsXHJcbiAgICAgICAgICAgICgpID0+IGxpbmUucG9pbnRMaXN0WzBdLnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgdGhpcy5jdXJyZW50QW5nbGUuYmluZCh0aGlzKSwgMCwgMzYwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBsaW5lTGVuID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV1cclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IGNvcyA9XHJcbiAgICAgICAgICAgICh0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLngpIC8gbGluZUxlbjtcclxuICAgICAgICBjb25zdCBzaW4gPVxyXG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55KSAvIGxpbmVMZW47XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3TGVuICogY29zICsgdGhpcy5saW5lLnBvaW50TGlzdFswXS54O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld0xlbiAqIHNpbiArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueTtcclxuXHJcbiAgICAgICAgdGhpcy5saW5lLmxlbmd0aCA9IG5ld0xlbjtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS54IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS54O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCA9IG5ld1Bvc1g7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3UG9zWCArIGRpZmY7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSA9IG5ld1Bvc1k7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID0gbmV3UG9zWSArIGRpZmY7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3VycmVudEFuZ2xlKCkge1xyXG4gICAgICAgIHJldHVybiBnZXRBbmdsZSh0aGlzLmxpbmUucG9pbnRMaXN0WzBdLCB0aGlzLmxpbmUucG9pbnRMaXN0WzFdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKG5ld1JvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcmFkID0gZGVnVG9SYWQobmV3Um90KTtcclxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWQpO1xyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XHJcblxyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9XHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCArIGNvcyAqIHRoaXMubGluZS5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID1cclxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS55IC0gc2luICogdGhpcy5saW5lLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0W2lkeF0ueCA9IHg7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFtpZHhdLnkgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLmxpbmUubGVuZ3RoID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSAnLi4vLi4vLi4vQmFzZS9Db2xvcic7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSAnLi4vLi4vLi4vQmFzZS9WZXJ0ZXgnO1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGUnO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlLCBoZXhUb1JnYiwgbTMsIHJnYlRvSGV4IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgd2lkdGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGxlbmd0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgcmVjdGFuZ2xlOiBSZWN0YW5nbGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVjdGFuZ2xlOiBSZWN0YW5nbGUsIGFwcENhbnZhczogQXBwQ2FudmFzKXtcclxuICAgICAgICBzdXBlcihyZWN0YW5nbGUsIGFwcENhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUgPSByZWN0YW5nbGU7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBYJywgKCkgPT4gcGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSwtMC41KmFwcENhbnZhcy53aWR0aCwwLjUqYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWScsICgpID0+IChwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKSwtMC41KmFwcENhbnZhcy53aWR0aCwwLjUqYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLmxlbmd0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdMZW5ndGgnLCAoKSA9PiBwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSksIDE1MCw0NTApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5sZW5ndGhTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVMZW5ndGgocGFyc2VJbnQodGhpcy5sZW5ndGhTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMud2lkdGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignV2lkdGgnLCAoKSA9PiBwYXJzZUludCh0aGlzLndpZHRoU2xpZGVyLnZhbHVlKSwgMTUwLDQ1MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLndpZHRoU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlV2lkdGgocGFyc2VJbnQodGhpcy53aWR0aFNsaWRlci52YWx1ZSkpfSlcclxuXHJcbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUm90YXRpb24nLCAoKSA9PiBwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSksIC0zNjAsIDM2MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSl9KVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUudHJhbnNsYXRpb25bMF0gPSBuZXdQb3NYO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUudHJhbnNsYXRpb25bMV0gPSBuZXdQb3NZO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTGVuZ3RoKG5ld0xlbmd0aDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnNjYWxlWzBdID0gbmV3TGVuZ3RoLzMwMDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVdpZHRoKG5ld1dpZHRoOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2NhbGVbMV0gPSBuZXdXaWR0aC8zMDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3RhdGlvbiA6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKG5ld1JvdGF0aW9uKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJvdGF0aW9uOiBcIiwgbmV3Um90YXRpb24pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDQ7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieDogXCIsIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS54LCBcInk6XCIsdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ4YXdhbCA6XCIgLCB4KTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ5YXdhbDogXCIgLCB5KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlclggPSAodGhpcy5yZWN0YW5nbGUuaW5pdGlhbFBvaW50WzBdICsgdGhpcy5yZWN0YW5nbGUuZW5kUG9pbnRbMF0pIC8gMjtcclxuICAgICAgICAgICAgY29uc3QgY2VudGVyWSA9ICh0aGlzLnJlY3RhbmdsZS5pbml0aWFsUG9pbnRbMV0gKyB0aGlzLnJlY3RhbmdsZS5lbmRQb2ludFsxXSkgLyAyO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdHJhbnNsYXRlZFggPSB4IC0gY2VudGVyWDtcclxuICAgICAgICAgICAgbGV0IHRyYW5zbGF0ZWRZID0geSAtIGNlbnRlclk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnM7IC8vIEludmVyc2Ugcm90YXRpb24gYW5nbGVcclxuICAgICAgICAgICAgY29uc3QgZHggPSB0cmFuc2xhdGVkWCAqIE1hdGguY29zKGFuZ2xlKSAtIHRyYW5zbGF0ZWRZICogTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgICAgICBjb25zdCBkeSA9IHRyYW5zbGF0ZWRYICogTWF0aC5zaW4oYW5nbGUpICsgdHJhbnNsYXRlZFkgKiBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsWCA9IGR4ICsgY2VudGVyWDtcclxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxZID0gZHkgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbW92ZW1lbnRYID0gb3JpZ2luYWxYIC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueDtcclxuICAgICAgICAgICAgY29uc3QgbW92ZW1lbnRZID0gb3JpZ2luYWxZIC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ4OlwiICwgbW92ZW1lbnRYKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ5OlwiICxtb3ZlbWVudFkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS54ICs9IG1vdmVtZW50WDtcclxuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueSArPSBtb3ZlbWVudFk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhZGphY2VudFZlcnRpY2VzID0gWzAsIDEsIDIsIDNdLmZpbHRlcihpID0+IGkgIT09IGlkeCAmJiBpICE9PSB0aGlzLnJlY3RhbmdsZS5maW5kT3Bwb3NpdGUoaWR4KSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb2ludExpc3QgPSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3Q7XHJcbiAgICAgICAgICAgIGNvbnN0IGN3QWRqYWNlbnRJZHggPSB0aGlzLnJlY3RhbmdsZS5maW5kQ1dBZGphY2VudChpZHgpO1xyXG4gICAgICAgICAgICBjb25zdCBjY3dBZGphY2VudElkeCA9IHRoaXMucmVjdGFuZ2xlLmZpbmRDQ1dBZGphY2VudChpZHgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3Bwb3NpdGVJZHggPSB0aGlzLnJlY3RhbmdsZS5maW5kT3Bwb3NpdGUoaWR4KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlUG9pbnRYID0gcG9pbnRMaXN0W29wcG9zaXRlSWR4XS54O1xyXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZVBvaW50WSA9IHBvaW50TGlzdFtvcHBvc2l0ZUlkeF0ueTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRvIGF2b2lkIHN0dWNrXHJcbiAgICAgICAgICAgIGFkamFjZW50VmVydGljZXMuZm9yRWFjaCh2ZXJ0ZXhJZHggPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleElkeCA9PT0gY3dBZGphY2VudElkeCB8fCB2ZXJ0ZXhJZHggPT09IGNjd0FkamFjZW50SWR4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4UG9pbnQgPSBwb2ludExpc3RbdmVydGV4SWR4XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBvaW50LnggPT09IG9wcG9zaXRlUG9pbnRYICYmIHZlcnRleFBvaW50LnkgPT09IG9wcG9zaXRlUG9pbnRZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhtb3ZlbWVudFgpID4gTWF0aC5hYnMobW92ZW1lbnRZKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4UG9pbnQueCArPSBtb3ZlbWVudFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC55ICs9IG1vdmVtZW50WTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQb2ludC54ICE9PSBvcHBvc2l0ZVBvaW50WCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4UG9pbnQueCArPSBtb3ZlbWVudFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBvaW50LnkgIT09IG9wcG9zaXRlUG9pbnRZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC55ICs9IG1vdmVtZW50WTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgICAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi4vLi4vLi4vQmFzZS9CYXNlU2hhcGUnO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSAnLi4vLi4vLi4vQmFzZS9Db2xvcic7XHJcbmltcG9ydCB7IGhleFRvUmdiLCByZ2JUb0hleCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHVibGljIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBzaGFwZTogQmFzZVNoYXBlO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgdmVydGV4Q29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgdmVydGV4UGlja2VyOiBIVE1MU2VsZWN0RWxlbWVudDtcclxuICAgIHByaXZhdGUgc2VsZWN0ZWRWZXJ0ZXggPSAnMCc7XHJcblxyXG4gICAgcHVibGljIHZ0eFBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB2dHhQb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdnR4Q29sb3JQaWNrZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHNsaWRlckxpc3Q6IEhUTUxJbnB1dEVsZW1lbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBnZXR0ZXJMaXN0OiAoKCkgPT4gbnVtYmVyKVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2hhcGU6IEJhc2VTaGFwZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLnNoYXBlID0gc2hhcGU7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3ZlcnRleC1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3ZlcnRleC1waWNrZXInXHJcbiAgICAgICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNsaWRlcihcclxuICAgICAgICBsYWJlbDogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlR2V0dGVyOiAoKSA9PiBudW1iZXIsXHJcbiAgICAgICAgbWluOiBudW1iZXIsXHJcbiAgICAgICAgbWF4OiBudW1iZXJcclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFiZWxFbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XHJcbiAgICAgICAgc2xpZGVyLm1pbiA9IG1pbi50b1N0cmluZygpO1xyXG4gICAgICAgIHNsaWRlci5tYXggPSBtYXgudG9TdHJpbmcoKTtcclxuICAgICAgICBzbGlkZXIudmFsdWUgPSB2YWx1ZUdldHRlcigpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlcik7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnNsaWRlckxpc3QucHVzaChzbGlkZXIpO1xyXG4gICAgICAgIHRoaXMuZ2V0dGVyTGlzdC5wdXNoKHZhbHVlR2V0dGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlclNsaWRlcihzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQsIGNiOiAoZTogRXZlbnQpID0+IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG5ld0NiID0gKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNiKGUpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlcnMoc2xpZGVyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHNsaWRlci5vbmNoYW5nZSA9IG5ld0NiO1xyXG4gICAgICAgIHNsaWRlci5vbmlucHV0ID0gbmV3Q2I7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZShuZXdTaGFwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2xpZGVycyhpZ25vcmVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnNsaWRlckxpc3QuZm9yRWFjaCgoc2xpZGVyLCBpZHgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlnbm9yZVNsaWRlciA9PT0gc2xpZGVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIHNsaWRlci52YWx1ZSA9IHRoaXMuZ2V0dGVyTGlzdFtpZHhdKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQodGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUpO1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlID0gdmVydGV4LngudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdGhpcy52dHhQb3NZU2xpZGVyLnZhbHVlID0gdmVydGV4LnkudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2xpZGVyVmVydGV4KFxyXG4gICAgICAgIGxhYmVsOiBzdHJpbmcsXHJcbiAgICAgICAgY3VycmVudExlbmd0aDogbnVtYmVyLFxyXG4gICAgICAgIG1pbjogbnVtYmVyLFxyXG4gICAgICAgIG1heDogbnVtYmVyXHJcbiAgICApOiBIVE1MSW5wdXRFbGVtZW50IHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9vbGJhci1zbGlkZXItY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGxhYmVsRWxtdC50ZXh0Q29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xyXG5cclxuICAgICAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgc2xpZGVyLnR5cGUgPSAncmFuZ2UnO1xyXG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcclxuICAgICAgICBzbGlkZXIubWF4ID0gbWF4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgc2xpZGVyLnZhbHVlID0gY3VycmVudExlbmd0aC50b1N0cmluZygpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbGlkZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2xpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbG9yUGlja2VyVmVydGV4KGxhYmVsOiBzdHJpbmcsIGhleDogc3RyaW5nKTogSFRNTElucHV0RWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxFbG10KTtcclxuXHJcbiAgICAgICAgY29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgY29sb3JQaWNrZXIudHlwZSA9ICdjb2xvcic7XHJcbiAgICAgICAgY29sb3JQaWNrZXIudmFsdWUgPSBoZXg7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbG9yUGlja2VyKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yUGlja2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdWZXJ0ZXhUb29sYmFyKCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKTtcclxuXHJcbiAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQodGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF07XHJcblxyXG4gICAgICAgIHRoaXMudnR4UG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyVmVydGV4KFxyXG4gICAgICAgICAgICAnUG9zIFgnLFxyXG4gICAgICAgICAgICB2ZXJ0ZXgueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMud2lkdGhcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcclxuICAgICAgICAgICAgJ1BvcyBZJyxcclxuICAgICAgICAgICAgdmVydGV4LnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmhlaWdodFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZVNsaWRlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZlcnRleChcclxuICAgICAgICAgICAgICAgICAgICBpZHgsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh0aGlzLnZ0eFBvc1lTbGlkZXIudmFsdWUpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudnR4Q29sb3JQaWNrZXIgPSB0aGlzLmNyZWF0ZUNvbG9yUGlja2VyVmVydGV4KFxyXG4gICAgICAgICAgICAnQ29sb3InLFxyXG4gICAgICAgICAgICByZ2JUb0hleCh2ZXJ0ZXguYy5yICogMjU1LCB2ZXJ0ZXguYy5nICogMjU1LCB2ZXJ0ZXguYy5iICogMjU1KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZUNvbG9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IHIsIGcsIGIgfSA9IGhleFRvUmdiKFxyXG4gICAgICAgICAgICAgICAgdGhpcy52dHhDb2xvclBpY2tlcj8udmFsdWUgPz8gJyMwMDAwMDAnXHJcbiAgICAgICAgICAgICkgPz8geyByOiAwLCBnOiAwLCBiOiAwIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUpO1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdLmMgPSBjb2xvcjtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNoYXBlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4UG9zWFNsaWRlciwgdXBkYXRlU2xpZGVyKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4UG9zWVNsaWRlciwgdXBkYXRlU2xpZGVyKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4Q29sb3JQaWNrZXIsIHVwZGF0ZUNvbG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4VG9vbGJhcigpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy52ZXJ0ZXhQaWNrZXIuZmlyc3RDaGlsZClcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIucmVtb3ZlQ2hpbGQodGhpcy52ZXJ0ZXhQaWNrZXIuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hhcGUucG9pbnRMaXN0LmZvckVhY2goKF8sIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaWR4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIG9wdGlvbi5sYWJlbCA9IGBWZXJ0ZXggJHtpZHh9YDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUgPSB0aGlzLnNlbGVjdGVkVmVydGV4O1xyXG4gICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkO1xyXG59XHJcbiIsImltcG9ydCBTcXVhcmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9TcXVhcmVcIjtcclxuaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uLy4uLy4uL0Jhc2UvQmFzZVNoYXBlJztcclxuaW1wb3J0IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSBcIi4vU2hhcGVUb29sYmFyQ29udHJvbGxlclwiO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCwgbTMgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzaXplU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAvLyBwcml2YXRlIHBvaW50U2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgc3F1YXJlOiBTcXVhcmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3F1YXJlOiBTcXVhcmUsIGFwcENhbnZhczogQXBwQ2FudmFzKXtcclxuICAgICAgICBzdXBlcihzcXVhcmUsIGFwcENhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5zcXVhcmUgPSBzcXVhcmU7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBYJywgKCkgPT4gcGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSwtMC41KmFwcENhbnZhcy53aWR0aCwwLjUqYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWScsICgpID0+IChwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKSwtMC41KmFwcENhbnZhcy53aWR0aCwwLjUqYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnNpemVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignU2l6ZScsICgpID0+IHBhcnNlSW50KHRoaXMuc2l6ZVNsaWRlci52YWx1ZSksIDE1MCw0NTApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5zaXplU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlU2l6ZShwYXJzZUludCh0aGlzLnNpemVTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgKCkgPT4gcGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpLCAtMzYwLCAzNjApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5yb3RhdGVTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVSb3RhdGlvbihwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSkpfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NYKG5ld1Bvc1g6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS50cmFuc2xhdGlvblswXSA9IG5ld1Bvc1g7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS50cmFuc2xhdGlvblsxXSA9IG5ld1Bvc1k7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTaXplKG5ld1NpemU6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS5zY2FsZVswXSA9IG5ld1NpemUvMzAwO1xyXG4gICAgICAgIHRoaXMuc3F1YXJlLnNjYWxlWzFdID0gbmV3U2l6ZS8zMDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3RhdGlvbiA6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKG5ld1JvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0aW5nXCIpO1xyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnNxdWFyZS5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3RbaWR4XTtcclxuICAgICAgICAvLyBjb25zdCBvcHBvc2l0ZSA9IChpZHggKyAyKSAlIDRcclxuICAgICAgICAvLyBjb25zdCBvcmlnaW5YID0gdGhpcy5zcXVhcmUucG9pbnRMaXN0W29wcG9zaXRlXS54O1xyXG4gICAgICAgIC8vIGNvbnN0IG9yaWdpblkgPSB0aGlzLnNxdWFyZS5wb2ludExpc3Rbb3Bwb3NpdGVdLnk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHRyYW5zbGF0ZVRvQ2VudGVyID0gbTMudHJhbnNsYXRpb24oLW9yaWdpblgsIC1vcmlnaW5ZKTtcclxuICAgICAgICAvLyBsZXQgc2NhbGluZyA9IG0zLnNjYWxpbmcoeCwgeSk7XHJcbiAgICAgICAgLy8gbGV0IHRyYW5zbGF0ZUJhY2sgPSBtMy50cmFuc2xhdGlvbihvcmlnaW5YLCBvcmlnaW5ZKTtcclxuXHJcbiAgICAgICAgLy8gbGV0IHJlc1NjYWxlID0gbTMubXVsdGlwbHkoc2NhbGluZywgdHJhbnNsYXRlVG9DZW50ZXIpO1xyXG4gICAgICAgIC8vIGxldCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzU2NhbGUpO1xyXG4gICAgICAgIC8vIGNvbnN0IHJlc1ZlcnRleFVwZGF0ZSA9IG0zLm11bHRpcGx5KHJlc0JhY2ssIHRoaXMuc3F1YXJlLnRyYW5zZm9ybWF0aW9uTWF0cml4KVxyXG4gICAgICAgIC8vIHRoaXMuc3F1YXJlLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gcmVzVmVydGV4VXBkYXRlO1xyXG5cclxuICAgICAgICAvLyB0aGlzLnNxdWFyZS5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cclxuICAgICAgICB2ZXJ0ZXgueCA9IHg7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IEZhblBvbHlnb24gZnJvbSAnLi4vLi4vU2hhcGVzL0ZhblBvbHlnb24nO1xyXG5pbXBvcnQgTGluZSBmcm9tICcuLi8uLi9TaGFwZXMvTGluZSc7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSAnLi4vLi4vU2hhcGVzL1NxdWFyZSc7XHJcbmltcG9ydCBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9GYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgTGluZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyJztcclxuaW1wb3J0IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgSVNoYXBlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcclxuaW1wb3J0IFNxdWFyZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvU3F1YXJlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGl0ZW1QaWNrZXI6IEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZElkOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXJDb250cm9sbGVyOiBJU2hhcGVUb29sYmFyQ29udHJvbGxlciB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMudXBkYXRlVG9vbGJhciA9IHRoaXMudXBkYXRlU2hhcGVMaXN0LmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICd0b29sYmFyLWl0ZW0tcGlja2VyJ1xyXG4gICAgICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlci5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJZCA9IHRoaXMuaXRlbVBpY2tlci52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLmFwcENhbnZhcy5zaGFwZXNbdGhpcy5pdGVtUGlja2VyLnZhbHVlXTtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclRvb2xiYXJFbG10KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcGUgaW5zdGFuY2VvZiBMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IExpbmVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBMaW5lLCBhcHBDYW52YXMpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgUmVjdGFuZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFJlY3RhbmdsZSwgYXBwQ2FudmFzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgU3F1YXJlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFNxdWFyZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFNxdWFyZSwgYXBwQ2FudmFzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgRmFuUG9seWdvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgRmFuUG9seWdvbiwgYXBwQ2FudmFzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZUxpc3QoKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTaGFwZUxpc3QoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMuaXRlbVBpY2tlci5maXJzdENoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLml0ZW1QaWNrZXIucmVtb3ZlQ2hpbGQodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHBsYWNlaG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIudGV4dCA9ICdDaG9vc2UgYW4gb2JqZWN0JztcclxuICAgICAgICBwbGFjZWhvbGRlci52YWx1ZSA9ICcnO1xyXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlci5hcHBlbmRDaGlsZChwbGFjZWhvbGRlcik7XHJcblxyXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5hcHBDYW52YXMuc2hhcGVzKS5mb3JFYWNoKChzaGFwZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjaGlsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgICAgICBjaGlsZC50ZXh0ID0gc2hhcGUuaWQ7XHJcbiAgICAgICAgICAgIGNoaWxkLnZhbHVlID0gc2hhcGUuaWQ7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVBpY2tlci5hcHBlbmRDaGlsZChjaGlsZCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlci52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRJZDtcclxuXHJcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmFwcENhbnZhcy5zaGFwZXMpLmluY2x1ZGVzKHRoaXMuc2VsZWN0ZWRJZCkpIHtcclxuICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG51bGw7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNsZWFyVG9vbGJhckVsbXQoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMudG9vbGJhckNvbnRhaW5lci5maXJzdENoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi4vQmFzZS9CYXNlU2hhcGUnO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSAnLi4vQmFzZS9Db2xvcic7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSAnLi4vQmFzZS9WZXJ0ZXgnO1xyXG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gJy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZhblBvbHlnb24gZXh0ZW5kcyBCYXNlU2hhcGUge1xyXG4gICAgcHJpdmF0ZSBvcmlnaW46IFZlcnRleDtcclxuICAgIGxlbkxpc3Q6IG51bWJlcltdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB2ZXJ0aWNlczogVmVydGV4W10pIHtcclxuICAgICAgICBzdXBlcigxLCBpZCwgY29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHZlcnRpY2VzWzBdO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godmVydGljZXNbMF0sIHZlcnRpY2VzWzFdKTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IG5ldyBWZXJ0ZXgoXHJcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS54ICsgdmVydGljZXNbMF0ueCkgLyAyLFxyXG4gICAgICAgICAgICAodmVydGljZXNbMV0ueSArIHZlcnRpY2VzWzBdLnkpIC8gMixcclxuICAgICAgICAgICAgbmV3IENvbG9yKDAsIDAsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QuZm9yRWFjaCgodnR4LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlkeCA8IDIpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5nbERyYXdUeXBlID0gNjtcclxuICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgodnR4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRWZXJ0ZXgodmVydGV4OiBWZXJ0ZXgpIHtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKHZlcnRleCk7XHJcbiAgICAgICAgdGhpcy5nbERyYXdUeXBlID0gNjtcclxuICAgICAgICB0aGlzLnJlY2FsYygpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY2FsYygpIHtcclxuICAgICAgICBsZXQgYW5nbGVzID0gdGhpcy5wb2ludExpc3RcclxuICAgICAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBpZHggPiAwKVxyXG4gICAgICAgICAgICAubWFwKCh2dHgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdnR4LFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBNYXRoLmF0YW4yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2dHgueSAtIHRoaXMub3JpZ2luLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZ0eC54IC0gdGhpcy5vcmlnaW4ueFxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYW5nbGVzLnNvcnQoKGEsIGIpID0+IGEuYW5nbGUgLSBiLmFuZ2xlKTtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdCA9IGFuZ2xlcy5tYXAoKGl0ZW0pID0+IGl0ZW0udnR4KTtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdC51bnNoaWZ0KHRoaXMub3JpZ2luKTtcclxuXHJcbiAgICAgICAgdGhpcy5jZW50ZXIueCA9XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0LnJlZHVjZSgodG90YWwsIHZ0eCkgPT4gdG90YWwgKyB2dHgueCwgMCkgL1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIueSA9XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0LnJlZHVjZSgodG90YWwsIHZ0eCkgPT4gdG90YWwgKyB2dHgueSwgMCkgL1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5sZW5MaXN0ID0gdGhpcy5wb2ludExpc3QubWFwKCh2dHgpID0+XHJcbiAgICAgICAgICAgIGV1Y2xpZGVhbkRpc3RhbmNlVnR4KHZ0eCwgdGhpcy5jZW50ZXIpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcclxuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHggfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCBzdGFydFg6IG51bWJlciwgc3RhcnRZOiBudW1iZXIsIGVuZFg6IG51bWJlciwgZW5kWTogbnVtYmVyLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gKHN0YXJ0WCArIGVuZFgpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHN0YXJ0WSArIGVuZFkpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIGNvbG9yKTtcclxuICAgICAgICBzdXBlcigxLCBpZCwgY29sb3IsIGNlbnRlciwgcm90YXRpb24sIHNjYWxlWCwgc2NhbGVZKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBvcmlnaW4gPSBuZXcgVmVydGV4KHN0YXJ0WCwgc3RhcnRZLCBjb2xvcik7XHJcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IFZlcnRleChlbmRYLCBlbmRZLCBjb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMubGVuZ3RoID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXHJcbiAgICAgICAgICAgIG9yaWdpbixcclxuICAgICAgICAgICAgZW5kXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaChvcmlnaW4sIGVuZCk7XHJcbiAgICAgICAgdGhpcy5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3QgPSB0aGlzLnBvaW50TGlzdDtcclxuICAgIH1cclxufSIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xyXG5pbXBvcnQgeyBtMyB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgQmFzZVNoYXBlIHtcclxuICAgIFxyXG4gICAgbGVuZ3RoOiBudW1iZXI7XHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaW5pdGlhbFBvaW50OiBudW1iZXJbXTtcclxuICAgIGVuZFBvaW50OiBudW1iZXJbXTtcclxuICAgIHRhcmdldFBvaW50OiBudW1iZXJbXTtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCBzdGFydFg6IG51bWJlciwgc3RhcnRZOiBudW1iZXIsIGVuZFg6IG51bWJlciwgZW5kWTogbnVtYmVyLCBhbmdsZUluUmFkaWFuczogbnVtYmVyLCBzY2FsZVg6IG51bWJlciA9IDEsIHNjYWxlWTogbnVtYmVyID0gMSwgdHJhbnNmb3JtYXRpb246IG51bWJlcltdID0gbTMuaWRlbnRpdHkoKSkge1xyXG4gICAgICAgIHN1cGVyKDUsIGlkLCBjb2xvcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgeDEgPSBzdGFydFg7XHJcbiAgICAgICAgY29uc3QgeTEgPSBzdGFydFk7XHJcbiAgICAgICAgY29uc3QgeDIgPSBlbmRYO1xyXG4gICAgICAgIGNvbnN0IHkyID0gc3RhcnRZO1xyXG4gICAgICAgIGNvbnN0IHgzID0gc3RhcnRYO1xyXG4gICAgICAgIGNvbnN0IHkzID0gZW5kWTtcclxuICAgICAgICBjb25zdCB4NCA9IGVuZFg7XHJcbiAgICAgICAgY29uc3QgeTQgPSBlbmRZO1xyXG5cclxuICAgICAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gdHJhbnNmb3JtYXRpb247XHJcblxyXG4gICAgICAgIHRoaXMuYW5nbGVJblJhZGlhbnMgPSBhbmdsZUluUmFkaWFucztcclxuICAgICAgICB0aGlzLnNjYWxlID0gW3NjYWxlWCwgc2NhbGVZXTtcclxuICAgICAgICB0aGlzLmluaXRpYWxQb2ludCA9IFtzdGFydFgsIHN0YXJ0WSwgMV07XHJcbiAgICAgICAgdGhpcy5lbmRQb2ludCA9IFtlbmRYLCBlbmRZLCAxXTtcclxuICAgICAgICB0aGlzLnRhcmdldFBvaW50ID0gWzAsMCwgMV07XHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSB4Mi14MTtcclxuICAgICAgICB0aGlzLndpZHRoID0geTMteTE7XHJcblxyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoeDEgKyB4NCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoeTEgKyB5NCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZXJ0ZXgoY2VudGVyWCwgY2VudGVyWSwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKG5ldyBWZXJ0ZXgoeDEsIHkxLCBjb2xvciksIG5ldyBWZXJ0ZXgoeDIsIHkyLCBjb2xvciksIG5ldyBWZXJ0ZXgoeDMsIHkzLCBjb2xvciksIG5ldyBWZXJ0ZXgoeDQsIHk0LCBjb2xvcikpO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0ID0gdGhpcy5wb2ludExpc3Q7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKGBwb2ludCAwOiAke3gxfSwgJHt5MX1gKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgcG9pbnQgMTogJHt4Mn0sICR7eTJ9YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDI6ICR7eDN9LCAke3kzfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBwb2ludCAzOiAke3g0fSwgJHt5NH1gKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgY2VudGVyOiAke2NlbnRlci54fSwgJHtjZW50ZXIueX1gKTtcclxuICAgIH1cclxuXHJcbiAgICBvdmVycmlkZSBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xyXG4gICAgICAgIHN1cGVyLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHBvaW50ID0gW3RoaXMucG9pbnRMaXN0W2lkeF0ueCwgdGhpcy5wb2ludExpc3RbaWR4XS55LCAxXTtcclxuICAgICAgICB0aGlzLmVuZFBvaW50ID0gbTMubXVsdGlwbHkzeDEodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5lbmRQb2ludClcclxuICAgICAgICB0aGlzLmluaXRpYWxQb2ludCA9IG0zLm11bHRpcGx5M3gxKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMuaW5pdGlhbFBvaW50KVxyXG4gICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZpbmRDQ1dBZGphY2VudChwb2ludElkeDogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCBjY3dBZGphY2VudDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHsgMDogMiwgMTogMCwgMjogMywgMzogMSB9O1xyXG4gICAgICAgIHJldHVybiBjY3dBZGphY2VudFtwb2ludElkeF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZpbmRDV0FkamFjZW50KHBvaW50SWR4OiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IGN3QWRqYWNlbnQ6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7IDA6IDEsIDE6IDMsIDI6IDAsIDM6IDIgfTtcclxuICAgICAgICByZXR1cm4gY3dBZGphY2VudFtwb2ludElkeF07XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGZpbmRPcHBvc2l0ZShwb2ludElkeDogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCBvcHBvc2l0ZTogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHsgMDogMywgMTogMiwgMjogMSwgMzogMCB9O1xyXG4gICAgICAgIHJldHVybiBvcHBvc2l0ZVtwb2ludElkeF07XHJcbiAgICB9XHJcblxyXG5cclxuICAgIC8vIHB1YmxpYyBvdmVycmlkZSBzZXRWaXJ0dWFsVHJhbnNmb3JtYXRpb25NYXRyaXgoKTogdm9pZCB7XHJcbiAgICAgICAgLy8gLy8gVEVTVFxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW5pdGlhbFwiLCB0aGlzLmluaXRpYWxQb2ludCk7XHJcbiAgICAgICAgLy8gY29uc3QgdGFyZ2V0UG9pbnRYID0gdGhpcy5lbmRQb2ludFswXSArIHRoaXMudGFyZ2V0UG9pbnRbMF07XHJcbiAgICAgICAgLy8gY29uc3QgdGFyZ2V0UG9pbnRZID0gdGhpcy5lbmRQb2ludFsxXSArIHRoaXMudGFyZ2V0UG9pbnRbMV07XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJlbmRQb2ludCBYOiBcIiwgdGhpcy5lbmRQb2ludFswXSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJlbmRQb2ludCBZOiBcIiwgdGhpcy5lbmRQb2ludFsxXSk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0YXJnZXRYOiBcIiwgdGFyZ2V0UG9pbnRYKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRhcmdldFk6IFwiLCB0YXJnZXRQb2ludFkpO1xyXG5cclxuICAgICAgICAvLyBjb25zdCB0cmFuc2xhdGVUb0luaXRpYWwgPSBtMy50cmFuc2xhdGlvbigtdGhpcy5pbml0aWFsUG9pbnRbMF0sIC10aGlzLmluaXRpYWxQb2ludFsxXSk7XHJcbiAgICAgICAgLy8gY29uc3Qgcm90YXRlUmV2ZXJ0ID0gbTMucm90YXRpb24oLXRoaXMuYW5nbGVJblJhZGlhbnMpO1xyXG5cclxuICAgICAgICAvLyBjb25zdCByZXNSb3RhdGUgPSBtMy5tdWx0aXBseShyb3RhdGVSZXZlcnQsIHRyYW5zbGF0ZVRvSW5pdGlhbClcclxuICAgICAgICAvLyAvLyBjb25zdCByZXNUcmFuc0JhY2sgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGVCYWNrLCByZXNSb3RhdGUpXHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHJvdGF0ZWRUYXJnZXQ9IG0zLm11bHRpcGx5M3gxKHJlc1JvdGF0ZSwgW3RhcmdldFBvaW50WCwgdGFyZ2V0UG9pbnRZLCAxXSk7XHJcbiAgICAgICAgLy8gY29uc3Qgcm90YXRlZEVuZFBvaW50PW0zLm11bHRpcGx5M3gxKHJlc1JvdGF0ZSwgdGhpcy5lbmRQb2ludCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyb3RhdGVkIHRhcmdldFwiLCByb3RhdGVkVGFyZ2V0KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJvdGF0ZWQgZW5kcG9pbnRcIiwgcm90YXRlZEVuZFBvaW50KTtcclxuICAgICAgICAvLyAvLyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMubXVsdGlwbHkocmVzUm90YXRlLCB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KVxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnN0IGN1cnJlbnRMZW5ndGggPSByb3RhdGVkRW5kUG9pbnRbMF07XHJcbiAgICAgICAgLy8gY29uc3QgY3VycmVudFdpZHRoPSByb3RhdGVkRW5kUG9pbnRbMV07XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHVwZGF0ZWRMZW5ndGggPSBjdXJyZW50TGVuZ3RoICsgcm90YXRlZFRhcmdldFswXSAtIHJvdGF0ZWRFbmRQb2ludFswXTtcclxuICAgICAgICAvLyBjb25zdCB1cGRhdGVkV2lkdGggPSBjdXJyZW50V2lkdGggKyByb3RhdGVkVGFyZ2V0WzFdIC0gcm90YXRlZEVuZFBvaW50WzFdO1xyXG5cclxuXHJcbiAgICAgICAgLy8gY29uc3Qgc2NhbGVMZW5ndGggPSB1cGRhdGVkTGVuZ3RoIC8gY3VycmVudExlbmd0aDtcclxuICAgICAgICAvLyBjb25zdCBzY2FsZVdpZHRoID0gdXBkYXRlZFdpZHRoIC8gY3VycmVudFdpZHRoO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2NhbGUgbGVuZ3RoOiBcIiwgc2NhbGVMZW5ndGgpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2NhbGUgd2lkdGg6IFwiLCBzY2FsZVdpZHRoKTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjb25zdCBzY2FsaW5nID0gbTMuc2NhbGluZyhzY2FsZUxlbmd0aCwgc2NhbGVXaWR0aCk7XHJcbiAgICAgICAgLy8gY29uc3Qgcm90YXRlQmFjayA9IG0zLnJvdGF0aW9uKHRoaXMuYW5nbGVJblJhZGlhbnMpO1xyXG4gICAgICAgIC8vIGNvbnN0IHRyYW5zbGF0ZUJhY2sgPSBtMy50cmFuc2xhdGlvbih0aGlzLmluaXRpYWxQb2ludFswXSwgdGhpcy5pbml0aWFsUG9pbnRbMV0pO1xyXG5cclxuICAgICAgICAvLyBjb25zdCByZXNTY2FsZSA9IG0zLm11bHRpcGx5KHJvdGF0ZUJhY2ssIHNjYWxpbmcpO1xyXG4gICAgICAgIC8vIGNvbnN0IHJlc0JhY2sgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGVCYWNrLCByZXNTY2FsZSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG0zLm11bHRpcGx5KHJlc0JhY2ssIHJlc1JvdGF0ZSk7XHJcbiAgICAgICAgLy8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG0zLm11bHRpcGx5KHZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyZXM6IFwiLCBtMy5tdWx0aXBseTN4MSh2aXJ0dWFsVHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMuaW5pdGlhbFBvaW50KSlcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBzZXRUcmFuc2xhdGlvbih4OiBudW1iZXIsIHk6IG51bWJlcikge1xyXG4gICAgLy8gICAgIHRoaXMudHJhbnNsYXRpb24gPSBbeCwgeV07XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gc2V0Um90YXRpb24oYW5nbGVJbkRlZ3JlZXM6IG51bWJlcikge1xyXG4gICAgLy8gICAgIHRoaXMuYW5nbGVJblJhZGlhbnMgPSBkZWdUb1JhZChhbmdsZUluRGVncmVlcyk7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gc2V0U2NhbGUoc2NhbGVYOiBudW1iZXIsIHNjYWxlWTogbnVtYmVyKSB7XHJcbiAgICAvLyAgICAgdGhpcy5zY2FsZSA9IFtzY2FsZVgsIHNjYWxlWV07XHJcbiAgICAvLyB9XHJcbn1cclxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XHJcbmltcG9ydCB7IGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xyXG4gICAgdjEgOiBWZXJ0ZXg7XHJcbiAgICB2MiA6IFZlcnRleDtcclxuICAgIHYzIDogVmVydGV4O1xyXG4gICAgdjQgOiBWZXJ0ZXg7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCB4NDogbnVtYmVyLCB5NDogbnVtYmVyLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gKHgxICsgeDMpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHkxICsgeTMpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIGNvbG9yKTtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlcig2LCBpZCwgY29sb3IsIGNlbnRlciwgcm90YXRpb24sIHNjYWxlWCwgc2NhbGVZKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnYxID0gbmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnYyID0gbmV3IFZlcnRleCh4MiwgeTIsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnYzID0gbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnY0ID0gbmV3IFZlcnRleCh4NCwgeTQsIGNvbG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh0aGlzLnYxLCB0aGlzLnYyLCB0aGlzLnYzLCB0aGlzLnY0KTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdCA9IHRoaXMucG9pbnRMaXN0O1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSAnLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyJztcclxuaW1wb3J0IFRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcnMvVG9vbGJhci9Ub29sYmFyQ29udHJvbGxlcic7XHJcbmltcG9ydCBMaW5lIGZyb20gJy4vU2hhcGVzL0xpbmUnO1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4vU2hhcGVzL1JlY3RhbmdsZSc7XHJcbmltcG9ydCBpbml0IGZyb20gJy4vaW5pdCc7XHJcblxyXG5jb25zdCBtYWluID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaW5pdFJldCA9IGluaXQoKTtcclxuICAgIGlmICghaW5pdFJldCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIFdlYkdMJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgZ2wsIHByb2dyYW0sIGNvbG9yQnVmZmVyLCBwb3NpdGlvbkJ1ZmZlciB9ID0gaW5pdFJldDtcclxuXHJcbiAgICBjb25zdCBhcHBDYW52YXMgPSBuZXcgQXBwQ2FudmFzKGdsLCBwcm9ncmFtLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgXHJcbiAgICBjb25zdCBjYW52YXNDb250cm9sbGVyID0gbmV3IENhbnZhc0NvbnRyb2xsZXIoYXBwQ2FudmFzKTtcclxuICAgIGNhbnZhc0NvbnRyb2xsZXIuc3RhcnQoKTtcclxuICAgIFxyXG4gICAgbmV3IFRvb2xiYXJDb250cm9sbGVyKGFwcENhbnZhcyk7XHJcblxyXG4gICAgLy8gY29uc3QgcmVkID0gbmV3IENvbG9yKDI1NSwgMCwgMjAwKVxyXG4gICAgLy8gLy8gY29uc3QgdHJpYW5nbGUgPSBuZXcgVHJpYW5nbGUoJ3RyaS0xJywgcmVkLCA1MCwgNTAsIDIwLCA1MDAsIDIwMCwgMTAwKTtcclxuICAgIC8vIC8vIGFwcENhbnZhcy5hZGRTaGFwZSh0cmlhbmdsZSk7XHJcbiAgICBcclxuICAgIC8vIGNvbnN0IHJlY3QgPSBuZXcgUmVjdGFuZ2xlKCdyZWN0LTEnLCByZWQsIDAsMCwxMCwyMCwwLDEsMSk7XHJcbiAgICAvLyByZWN0LmFuZ2xlSW5SYWRpYW5zID0gLSBNYXRoLlBJIC8gNDtcclxuICAgIC8vIC8vIHJlY3QudGFyZ2V0UG9pbnRbMF0gPSA1ICogTWF0aC5zcXJ0KDIpO1xyXG4gICAgLy8gLy8gcmVjdC5zY2FsZVggPSAxMDtcclxuICAgIC8vIC8vIHJlY3QudHJhbnNsYXRpb25bMF0gPSA1MDA7XHJcbiAgICAvLyAvLyByZWN0LnRyYW5zbGF0aW9uWzFdID0gMTAwMDtcclxuICAgIC8vIC8vIHJlY3Quc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShyZWN0KTtcclxuXHJcbiAgICAvLyBjb25zdCBsaW5lID0gbmV3IExpbmUoJ2xpbmUtMScsIHJlZCwgMTAwLCAxMDAsIDEwMCwgMzAwKTtcclxuICAgIC8vIGNvbnN0IGxpbmUyID0gbmV3IExpbmUoJ2xpbmUtMicsIHJlZCwgMTAwLCAxMDAsIDMwMCwgMTAwKTtcclxuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShsaW5lKTtcclxuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShsaW5lMik7XHJcbn07XHJcblxyXG5tYWluKCk7XHJcbiIsImNvbnN0IGNyZWF0ZVNoYWRlciA9IChcclxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICB0eXBlOiBudW1iZXIsXHJcbiAgICBzb3VyY2U6IHN0cmluZ1xyXG4pID0+IHtcclxuICAgIGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcclxuICAgIGlmIChzaGFkZXIpIHtcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xyXG4gICAgICAgIGlmIChzdWNjZXNzKSByZXR1cm4gc2hhZGVyO1xyXG5cclxuICAgICAgICBjb25zb2xlLmVycm9yKGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XHJcbiAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVQcm9ncmFtID0gKFxyXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICAgIHZ0eFNoZDogV2ViR0xTaGFkZXIsXHJcbiAgICBmcmdTaGQ6IFdlYkdMU2hhZGVyXHJcbikgPT4ge1xyXG4gICAgY29uc3QgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgIGlmIChwcm9ncmFtKSB7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZ0eFNoZCk7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyZ1NoZCk7XHJcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xyXG4gICAgICAgIGlmIChzdWNjZXNzKSByZXR1cm4gcHJvZ3JhbTtcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKSk7XHJcbiAgICAgICAgZ2wuZGVsZXRlUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnKTtcclxuXHJcbiAgICBpZiAoIWdsKSB7XHJcbiAgICAgICAgYWxlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHdlYkdMJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIEluaXRpYWxpemUgc2hhZGVycyBhbmQgcHJvZ3JhbXNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIGNvbnN0IHZ0eFNoYWRlclNvdXJjZSA9IChcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVydGV4LXNoYWRlci0yZCcpIGFzIEhUTUxTY3JpcHRFbGVtZW50XHJcbiAgICApLnRleHQ7XHJcbiAgICBjb25zdCBmcmFnU2hhZGVyU291cmNlID0gKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcmFnbWVudC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxyXG4gICAgKS50ZXh0O1xyXG5cclxuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IGNyZWF0ZVNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnR4U2hhZGVyU291cmNlKTtcclxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gY3JlYXRlU2hhZGVyKFxyXG4gICAgICAgIGdsLFxyXG4gICAgICAgIGdsLkZSQUdNRU5UX1NIQURFUixcclxuICAgICAgICBmcmFnU2hhZGVyU291cmNlXHJcbiAgICApO1xyXG4gICAgaWYgKCF2ZXJ0ZXhTaGFkZXIgfHwgIWZyYWdtZW50U2hhZGVyKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZlcnRleFNoYWRlciwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gICAgaWYgKCFwcm9ncmFtKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBkaXNwbGF5V2lkdGggID0gTWF0aC5yb3VuZCh3aWR0aCAqIGRwcik7XHJcbiAgICBjb25zdCBkaXNwbGF5SGVpZ2h0ID0gTWF0aC5yb3VuZChoZWlnaHQgKiBkcHIpO1xyXG5cclxuICAgIGNvbnN0IG5lZWRSZXNpemUgPVxyXG4gICAgICAgIGdsLmNhbnZhcy53aWR0aCAhPSBkaXNwbGF5V2lkdGggfHwgZ2wuY2FudmFzLmhlaWdodCAhPSBkaXNwbGF5SGVpZ2h0O1xyXG5cclxuICAgIGlmIChuZWVkUmVzaXplKSB7XHJcbiAgICAgICAgZ2wuY2FudmFzLndpZHRoID0gZGlzcGxheVdpZHRoO1xyXG4gICAgICAgIGdsLmNhbnZhcy5oZWlnaHQgPSBkaXNwbGF5SGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XHJcbiAgICBnbC5jbGVhckNvbG9yKDAsIDAsIDAsIDApO1xyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIEVuYWJsZSAmIGluaXRpYWxpemUgdW5pZm9ybXMgYW5kIGF0dHJpYnV0ZXNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFJlc29sdXRpb25cclxuICAgIGNvbnN0IG1hdHJpeFVuaWZvcm1Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihcclxuICAgICAgICBwcm9ncmFtLFxyXG4gICAgICAgICd1X3RyYW5zZm9ybWF0aW9uJ1xyXG4gICAgKTtcclxuICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4VW5pZm9ybUxvY2F0aW9uLCBmYWxzZSwgWzEsMCwwLDAsMSwwLDAsMCwxXSlcclxuXHJcbiAgICBjb25zdCByZXNvbHV0aW9uVW5pZm9ybUxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKFxyXG4gICAgICAgIHByb2dyYW0sXHJcbiAgICAgICAgJ3VfcmVzb2x1dGlvbidcclxuICAgICk7XHJcbiAgICBnbC51bmlmb3JtMmYocmVzb2x1dGlvblVuaWZvcm1Mb2NhdGlvbiwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICAvLyBDb2xvclxyXG4gICAgY29uc3QgY29sb3JCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgIGlmICghY29sb3JCdWZmZXIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGNvbG9yIGJ1ZmZlcicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgY29uc3QgY29sb3JBdHRyaWJ1dGVMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sICdhX2NvbG9yJyk7XHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShjb2xvckF0dHJpYnV0ZUxvY2F0aW9uKTtcclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoY29sb3JBdHRyaWJ1dGVMb2NhdGlvbiwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHJcbiAgICAvLyBQb3NpdGlvblxyXG4gICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgIGlmICghcG9zaXRpb25CdWZmZXIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHBvc2l0aW9uIGJ1ZmZlcicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgY29uc3QgcG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKFxyXG4gICAgICAgIHByb2dyYW0sXHJcbiAgICAgICAgJ2FfcG9zaXRpb24nXHJcbiAgICApO1xyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbik7XHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblxyXG4gICAgLy8gRG8gbm90IHJlbW92ZSBjb21tZW50cywgdXNlZCBmb3Igc2FuaXR5IGNoZWNrXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBTZXQgdGhlIHZhbHVlcyBvZiB0aGUgYnVmZmVyXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgLy8gY29uc3QgY29sb3JzID0gWzEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjBdO1xyXG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcclxuICAgIC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksIGdsLlNUQVRJQ19EUkFXKTtcclxuXHJcbiAgICAvLyBjb25zdCBwb3NpdGlvbnMgPSBbMTAwLCA1MCwgMjAsIDEwLCA1MDAsIDUwMF07XHJcbiAgICAvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgLy8gZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cclxuICAgIC8vID09PT1cclxuICAgIC8vIERyYXdcclxuICAgIC8vID09PT1cclxuICAgIC8vIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCAzKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBvc2l0aW9uQnVmZmVyLFxyXG4gICAgICAgIHByb2dyYW0sXHJcbiAgICAgICAgY29sb3JCdWZmZXIsXHJcbiAgICAgICAgZ2wsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdDtcclxuIiwiaW1wb3J0IFZlcnRleCBmcm9tICcuL0Jhc2UvVmVydGV4JztcclxuXHJcbmV4cG9ydCBjb25zdCBldWNsaWRlYW5EaXN0YW5jZVZ0eCA9IChhOiBWZXJ0ZXgsIGI6IFZlcnRleCk6IG51bWJlciA9PiB7XHJcbiAgICBjb25zdCBkeCA9IGEueCAtIGIueDtcclxuICAgIGNvbnN0IGR5ID0gYS55IC0gYi55O1xyXG5cclxuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGV1Y2xpZGVhbkRpc3RhbmNlID0gKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpOiBudW1iZXIgPT4ge1xyXG4gIGNvbnN0IGR4ID0gYXggLSBieDtcclxuICBjb25zdCBkeSA9IGF5IC0gYnk7XHJcblxyXG4gIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG59O1xyXG5cclxuLy8gMzYwIERFR1xyXG5leHBvcnQgY29uc3QgZ2V0QW5nbGUgPSAob3JpZ2luOiBWZXJ0ZXgsIHRhcmdldDogVmVydGV4KSA9PiB7XHJcbiAgICBjb25zdCBwbHVzTWludXNEZWcgPSByYWRUb0RlZyhNYXRoLmF0YW4yKG9yaWdpbi55IC0gdGFyZ2V0LnksIG9yaWdpbi54IC0gdGFyZ2V0LngpKTtcclxuICAgIHJldHVybiBwbHVzTWludXNEZWcgPj0gMCA/IDE4MCAtIHBsdXNNaW51c0RlZyA6IE1hdGguYWJzKHBsdXNNaW51c0RlZykgKyAxODA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByYWRUb0RlZyA9IChyYWQ6IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIHJhZCAqIDE4MCAvIE1hdGguUEk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWdUb1JhZCA9IChkZWc6IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIGRlZyAqIE1hdGguUEkgLyAxODA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1JnYihoZXg6IHN0cmluZykge1xyXG4gIHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcclxuICByZXR1cm4gcmVzdWx0ID8ge1xyXG4gICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbiAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcclxuICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXHJcbiAgfSA6IG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZ2JUb0hleChyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIFwiI1wiICsgKDEgPDwgMjQgfCByIDw8IDE2IHwgZyA8PCA4IHwgYikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbTMgPSB7XHJcbiAgICBpZGVudGl0eTogZnVuY3Rpb24oKSA6IG51bWJlcltdIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgMCwgMCwgMSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICB0cmFuc2xhdGlvbjogZnVuY3Rpb24odHggOiBudW1iZXIsIHR5IDogbnVtYmVyKSA6IG51bWJlcltdIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgdHgsIHR5LCAxLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICBcclxuICAgIHJvdGF0aW9uOiBmdW5jdGlvbihhbmdsZUluUmFkaWFucyA6IG51bWJlcikgOiBudW1iZXJbXSB7XHJcbiAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XHJcbiAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgYywtcywgMCxcclxuICAgICAgICBzLCBjLCAwLFxyXG4gICAgICAgIDAsIDAsIDEsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgc2NhbGluZzogZnVuY3Rpb24oc3ggOiBudW1iZXIsIHN5IDogbnVtYmVyKSA6IG51bWJlcltdIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBzeCwgMCwgMCxcclxuICAgICAgICAwLCBzeSwgMCxcclxuICAgICAgICAwLCAwLCAxLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICBcclxuICAgIG11bHRpcGx5OiBmdW5jdGlvbihhIDogbnVtYmVyW10sIGIgOiBudW1iZXJbXSkgOiBudW1iZXJbXSB7XHJcbiAgICAgIGNvbnN0IGEwMCA9IGFbMCAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTAxID0gYVswICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMDIgPSBhWzAgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGExMCA9IGFbMSAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTExID0gYVsxICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMTIgPSBhWzEgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGEyMCA9IGFbMiAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTIxID0gYVsyICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMjIgPSBhWzIgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGIwMCA9IGJbMCAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYjAxID0gYlswICogMyArIDFdO1xyXG4gICAgICBjb25zdCBiMDIgPSBiWzAgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGIxMCA9IGJbMSAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYjExID0gYlsxICogMyArIDFdO1xyXG4gICAgICBjb25zdCBiMTIgPSBiWzEgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGIyMCA9IGJbMiAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYjIxID0gYlsyICogMyArIDFdO1xyXG4gICAgICBjb25zdCBiMjIgPSBiWzIgKiAzICsgMl07XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxyXG4gICAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcclxuICAgICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXHJcbiAgICAgICAgYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwLFxyXG4gICAgICAgIGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMSxcclxuICAgICAgICBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjIsXHJcbiAgICAgICAgYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwLFxyXG4gICAgICAgIGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMSxcclxuICAgICAgICBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjIsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGludmVyc2U6IGZ1bmN0aW9uKG0gOiBudW1iZXJbXSkge1xyXG4gICAgICBjb25zdCBkZXQgPSBtWzBdICogKG1bNF0gKiBtWzhdIC0gbVs3XSAqIG1bNV0pIC1cclxuICAgICAgICAgICAgICAgICAgbVsxXSAqIChtWzNdICogbVs4XSAtIG1bNV0gKiBtWzZdKSArXHJcbiAgICAgICAgICAgICAgICAgIG1bMl0gKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSk7XHJcbiAgXHJcbiAgICAgIGlmIChkZXQgPT09IDApIHJldHVybiBudWxsO1xyXG4gIFxyXG4gICAgICBjb25zdCBpbnZEZXQgPSAxIC8gZGV0O1xyXG4gIFxyXG4gICAgICByZXR1cm4gWyBcclxuICAgICAgICAgIGludkRldCAqIChtWzRdICogbVs4XSAtIG1bNV0gKiBtWzddKSwgXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVsyXSAqIG1bN10gLSBtWzFdICogbVs4XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVsxXSAqIG1bNV0gLSBtWzJdICogbVs0XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVs1XSAqIG1bNl0gLSBtWzNdICogbVs4XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVswXSAqIG1bOF0gLSBtWzJdICogbVs2XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVsyXSAqIG1bM10gLSBtWzBdICogbVs1XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVsxXSAqIG1bNl0gLSBtWzBdICogbVs3XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVswXSAqIG1bNF0gLSBtWzFdICogbVszXSlcclxuICAgICAgXTtcclxuICB9LFxyXG5cclxuICAgIG11bHRpcGx5M3gxOiBmdW5jdGlvbihhIDogbnVtYmVyW10sIGIgOiBudW1iZXJbXSkgOiBudW1iZXJbXSB7XHJcbiAgICAgIGNvbnN0IGEwMCA9IGFbMCAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTAxID0gYVswICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMDIgPSBhWzAgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGExMCA9IGFbMSAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTExID0gYVsxICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMTIgPSBhWzEgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGEyMCA9IGFbMiAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTIxID0gYVsyICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMjIgPSBhWzIgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGIwMCA9IGJbMCAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYjAxID0gYlswICogMyArIDFdO1xyXG4gICAgICBjb25zdCBiMDIgPSBiWzAgKiAzICsgMl07XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxyXG4gICAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcclxuICAgICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24obSA6IG51bWJlcltdLCB0eDpudW1iZXIsIHR5Om51bWJlcikge1xyXG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMudHJhbnNsYXRpb24odHgsIHR5KSk7XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgcm90YXRlOiBmdW5jdGlvbihtOm51bWJlcltdLCBhbmdsZUluUmFkaWFuczpudW1iZXIpIHtcclxuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSk7XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgc2NhbGU6IGZ1bmN0aW9uKG06bnVtYmVyW10sIHN4Om51bWJlciwgc3k6bnVtYmVyKSB7XHJcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy5zY2FsaW5nKHN4LCBzeSkpO1xyXG4gICAgfSxcclxuICB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==