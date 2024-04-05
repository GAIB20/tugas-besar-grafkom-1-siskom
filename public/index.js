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
    function Vertex(x, y, c) {
        this.x = x;
        this.y = y;
        this.c = c;
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
var CVPolygonMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/CVPolygonMakerController */ "./src/Controllers/Maker/Shape/CVPolygonMakerController.ts"));
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
    AVAIL_SHAPES["CVPoly"] = "CVPoly";
})(AVAIL_SHAPES || (AVAIL_SHAPES = {}));
var CanvasController = /** @class */ (function () {
    function CanvasController(appCanvas) {
        var _this = this;
        this.toolbarOnClickCb = null;
        this.appCanvas = appCanvas;
        var canvasElmt = document.getElementById('c');
        var buttonContainer = document.getElementById('shape-button-container');
        this.setPolygonButton = document.getElementById('set-polygon');
        this.canvasElmt = canvasElmt;
        this.buttonContainer = buttonContainer;
        this.setPolygonButton.classList.add('hidden');
        this._shapeController = new CVPolygonMakerController_1.default(appCanvas);
        this.colorPicker = document.getElementById('shape-color-picker');
        this.canvasElmt.onclick = function (e) {
            var _a;
            var correctX = e.offsetX * window.devicePixelRatio;
            var correctY = e.offsetY * window.devicePixelRatio;
            (_a = _this.shapeController) === null || _a === void 0 ? void 0 : _a.handleClick(correctX, correctY, _this.colorPicker.value);
            if (_this.toolbarOnClickCb)
                _this.toolbarOnClickCb();
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
                if (_this.toolbarOnClickCb)
                    _this.toolbarOnClickCb();
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
            case AVAIL_SHAPES.CVPoly:
                return new CVPolygonMakerController_1.default(this.appCanvas);
            default:
                throw new Error('Incorrect shape string');
        }
    };
    CanvasController.prototype.editExistingFanPolygon = function (id) {
        this.shapeController = new FanPolygonMakerController_1.default(this.appCanvas);
        this.shapeController.setCurrentPolygon(id);
    };
    CanvasController.prototype.editExistingCVPolygon = function (id) {
        this.shapeController = new CVPolygonMakerController_1.default(this.appCanvas);
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

/***/ "./src/Controllers/Maker/Shape/CVPolygonMakerController.ts":
/*!*****************************************************************!*\
  !*** ./src/Controllers/Maker/Shape/CVPolygonMakerController.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Color_1 = __importDefault(__webpack_require__(/*! ../../../Base/Color */ "./src/Base/Color.ts"));
var Vertex_1 = __importDefault(__webpack_require__(/*! ../../../Base/Vertex */ "./src/Base/Vertex.ts"));
var CVPolygon_1 = __importDefault(__webpack_require__(/*! ../../../Shapes/CVPolygon */ "./src/Shapes/CVPolygon.ts"));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var CVPolygonMakerController = /** @class */ (function () {
    function CVPolygonMakerController(appCanvas) {
        var _this = this;
        this.origin = null;
        this.secondPoint = null;
        this.currentPoly = null;
        this.appCanvas = appCanvas;
        this.setPolygonButton = document.getElementById('set-polygon');
        this.setPolygonButton.classList.remove('hidden');
        this.setPolygonButton.onclick = function (e) {
            e.preventDefault();
            if (_this.origin !== null &&
                _this.currentPoly !== null &&
                _this.secondPoint !== null) {
                _this.currentPoly = null;
                _this.secondPoint = null;
                _this.origin = null;
            }
        };
    }
    CVPolygonMakerController.prototype.setCurrentPolygon = function (id) {
        this.currentPoly = this.appCanvas.shapes[id];
        this.origin = this.currentPoly.pointList[0];
        this.secondPoint = this.currentPoly.pointList[1];
    };
    CVPolygonMakerController.prototype.handleClick = function (x, y, hex) {
        var _a;
        var _b = (_a = (0, utils_1.hexToRgb)(hex)) !== null && _a !== void 0 ? _a : { r: 0, g: 0, b: 0 }, r = _b.r, g = _b.g, b = _b.b;
        var color = new Color_1.default(r / 255, g / 255, b / 255);
        if (this.origin === null) {
            console.log('origin set');
            this.origin = new Vertex_1.default(x, y, color);
        }
        else if (this.origin !== null && this.secondPoint === null) {
            console.log('second set');
            this.secondPoint = new Vertex_1.default(x, y, color);
        }
        else if (this.origin !== null && this.secondPoint !== null && this.currentPoly === null) {
            console.log('shape set');
            var newVertex = new Vertex_1.default(x, y, color);
            var id = this.appCanvas.generateIdFromTag('polycv');
            this.currentPoly = new CVPolygon_1.default(id, color, [this.origin, this.secondPoint, newVertex]);
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
    return CVPolygonMakerController;
}());
exports["default"] = CVPolygonMakerController;


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

/***/ "./src/Controllers/Toolbar/Shape/CVPolygonToolbarController.ts":
/*!*********************************************************************!*\
  !*** ./src/Controllers/Toolbar/Shape/CVPolygonToolbarController.ts ***!
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
var CVPolygonToolbarController = /** @class */ (function (_super) {
    __extends(CVPolygonToolbarController, _super);
    function CVPolygonToolbarController(fanPoly, appCanvas, canvasController) {
        var _this = _super.call(this, fanPoly, appCanvas) || this;
        _this.DEFAULT_SCALE = 50;
        _this.currentScale = 50;
        _this.canvasController = canvasController;
        _this.canvasController.toolbarOnClickCb = _this.initVertexToolbar.bind(_this);
        _this.cvPoly = fanPoly;
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
    CVPolygonToolbarController.prototype.customVertexToolbar = function () {
        var _this = this;
        var addVtxButton = this.createVertexButton('Add Vertex');
        addVtxButton.onclick = function (e) {
            e.preventDefault();
            _this.canvasController.editExistingCVPolygon(_this.cvPoly.id);
            _this.initVertexToolbar();
        };
        var removeVtxButton = this.createVertexButton('Remove Vertex');
        removeVtxButton.onclick = function (e) {
            e.preventDefault();
            _this.cvPoly.removeVertex(parseInt(_this.selectedVertex));
            _this.initVertexToolbar();
            _this.updateShape(_this.cvPoly);
        };
    };
    CVPolygonToolbarController.prototype.createVertexButton = function (text) {
        var button = document.createElement('button');
        button.textContent = text;
        this.vertexContainer.appendChild(button);
        return button;
    };
    CVPolygonToolbarController.prototype.updatePosX = function (newPosX) {
        var diff = newPosX - this.cvPoly.pointList[0].x;
        this.cvPoly.pointList = this.cvPoly.pointList.map(function (vtx) {
            vtx.x += diff;
            return vtx;
        });
        this.cvPoly.recalc();
        this.updateShape(this.cvPoly);
    };
    CVPolygonToolbarController.prototype.updatePosY = function (newPosY) {
        var diff = newPosY - this.cvPoly.pointList[0].y;
        this.cvPoly.pointList = this.cvPoly.pointList.map(function (vtx, idx) {
            vtx.y += diff;
            return vtx;
        });
        this.cvPoly.recalc();
        this.updateShape(this.cvPoly);
    };
    CVPolygonToolbarController.prototype.getCurrentScale = function () {
        return this.currentScale;
    };
    CVPolygonToolbarController.prototype.updateScale = function (newScale) {
        var _this = this;
        this.currentScale = newScale;
        this.cvPoly.pointList = this.cvPoly.pointList.map(function (vtx, idx) {
            var rad = (0, utils_1.degToRad)((0, utils_1.getAngle)(_this.cvPoly.center, vtx));
            var cos = Math.cos(rad);
            var sin = Math.sin(rad);
            vtx.x =
                _this.cvPoly.center.x +
                    cos *
                        _this.cvPoly.lenList[idx] *
                        (newScale / _this.DEFAULT_SCALE);
            vtx.y =
                _this.cvPoly.center.y -
                    sin *
                        _this.cvPoly.lenList[idx] *
                        (newScale / _this.DEFAULT_SCALE);
            return vtx;
        });
        this.updateShape(this.cvPoly);
    };
    CVPolygonToolbarController.prototype.updateVertex = function (idx, x, y) {
        this.cvPoly.pointList[idx].x = x;
        this.cvPoly.pointList[idx].y = y;
        this.cvPoly.recalc();
        this.updateShape(this.cvPoly);
    };
    return CVPolygonToolbarController;
}(ShapeToolbarController_1.ShapeToolbarController));
exports["default"] = CVPolygonToolbarController;


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
        _this.canvasController.toolbarOnClickCb = _this.initVertexToolbar.bind(_this);
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
        _this.initialRotationValue = 0;
        _this.rectangle = rectangle;
        // X Position
        _this.posXSlider = _this.createSlider('Position X', function () { return rectangle.center.x; }, 1, appCanvas.width);
        _this.registerSlider(_this.posXSlider, function (e) { _this.updatePosX(parseInt(_this.posXSlider.value)); });
        // Y Position
        _this.posYSlider = _this.createSlider('Position Y', function () { return rectangle.center.y; }, 1, appCanvas.width);
        _this.registerSlider(_this.posYSlider, function (e) { _this.updatePosY(parseInt(_this.posYSlider.value)); });
        _this.lengthSlider = _this.createSlider('Length', function () { return rectangle.length; }, 1, appCanvas.width);
        _this.registerSlider(_this.lengthSlider, function (e) { _this.updateLength(parseInt(_this.lengthSlider.value)); });
        _this.widthSlider = _this.createSlider('Width', function () { return _this.rectangle.width; }, 1, appCanvas.width);
        _this.registerSlider(_this.widthSlider, function (e) { _this.updateWidth(parseInt(_this.widthSlider.value)); });
        _this.rotateSlider = _this.createSlider('Rotation', function () { return 0; }, -180, 180);
        _this.registerSlider(_this.rotateSlider, function (e) { _this.handleRotationEnd; });
        _this.rotateSlider.addEventListener('mousedown', _this.handleRotationStart.bind(_this));
        _this.rotateSlider.addEventListener('touchstart', _this.handleRotationStart.bind(_this));
        _this.rotateSlider.addEventListener('mouseup', _this.handleRotationEnd.bind(_this));
        _this.rotateSlider.addEventListener('touchend', _this.handleRotationEnd.bind(_this));
        return _this;
    }
    RectangleToolbarController.prototype.updatePosX = function (newPosX) {
        var diff = newPosX - this.rectangle.center.x;
        for (var i = 0; i < 4; i++) {
            this.rectangle.pointList[i].x += diff;
        }
        this.rectangle.recalculate();
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updatePosY = function (newPosY) {
        var diff = newPosY - this.rectangle.center.y;
        for (var i = 0; i < 4; i++) {
            this.rectangle.pointList[i].y += diff;
        }
        this.rectangle.recalculate();
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateLength = function (newLength) {
        this.rectangle.angleInRadians = -this.rectangle.angleInRadians;
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();
        var currentLength = (0, utils_1.euclideanDistanceVtx)(this.rectangle.pointList[0], this.rectangle.pointList[1]);
        var scaleFactor = newLength / currentLength;
        for (var i = 1; i < 4; i++) {
            this.rectangle.pointList[i].x = this.rectangle.pointList[0].x + (this.rectangle.pointList[i].x - this.rectangle.pointList[0].x) * scaleFactor;
        }
        this.rectangle.angleInRadians = -this.rectangle.angleInRadians;
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();
        // this.rectangle.angleInRadians = 0;
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateWidth = function (newWidth) {
        this.rectangle.angleInRadians = -this.rectangle.angleInRadians;
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();
        var currentWidth = (0, utils_1.euclideanDistanceVtx)(this.rectangle.pointList[1], this.rectangle.pointList[3]);
        var scaleFactor = newWidth / currentWidth;
        for (var i = 1; i < 4; i++) {
            if (i != 1)
                this.rectangle.pointList[i].y = this.rectangle.pointList[1].y + (this.rectangle.pointList[i].y - this.rectangle.pointList[1].y) * scaleFactor;
        }
        this.rectangle.angleInRadians = -this.rectangle.angleInRadians;
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();
        // this.rectangle.angleInRadians = 0;
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.handleRotationStart = function (e) {
        this.initialRotationValue = parseInt(this.rotateSlider.value);
    };
    RectangleToolbarController.prototype.handleRotationEnd = function (e) {
        var finalRotationValue = parseInt(this.rotateSlider.value);
        var deltaRotation = finalRotationValue - this.initialRotationValue;
        this.updateRotation(this.initialRotationValue, deltaRotation);
    };
    RectangleToolbarController.prototype.updateRotation = function (initialRotation, deltaRotation) {
        this.rectangle.angleInRadians = (0, utils_1.degToRad)(deltaRotation);
        this.rectangle.setTransformationMatrix();
        this.rectangle.updatePointListWithTransformation();
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateVertex = function (idx, x, y) {
        var movedVertex = this.rectangle.pointList[idx];
        var dx = x - movedVertex.x;
        var dy = y - movedVertex.y;
        movedVertex.x = x;
        movedVertex.y = y;
        var cwAdjacentIdx = this.rectangle.findCWAdjacent(idx);
        var ccwAdjacentIdx = this.rectangle.findCCWAdjacent(idx);
        if (idx % 2 === 0) {
            this.rectangle.pointList[cwAdjacentIdx].x += dx;
            this.rectangle.pointList[ccwAdjacentIdx].y += dy;
        }
        else {
            this.rectangle.pointList[cwAdjacentIdx].y += dy;
            this.rectangle.pointList[ccwAdjacentIdx].x += dx;
        }
        this.rectangle.recalculate();
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
            var _a, _b, _c, _d, _e, _f, _g;
            var _h = (_c = (0, utils_1.hexToRgb)((_b = (_a = _this.vtxColorPicker) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : '#000000')) !== null && _c !== void 0 ? _c : { r: 0, g: 0, b: 0 }, r = _h.r, g = _h.g, b = _h.b;
            var color = new Color_1.default(r / 255, g / 255, b / 255);
            _this.shape.pointList[idx].c = color;
            _this.updateVertex(idx, parseInt((_e = (_d = _this.vtxPosXSlider) === null || _d === void 0 ? void 0 : _d.value) !== null && _e !== void 0 ? _e : vertex.x.toString()), parseInt((_g = (_f = _this.vtxPosYSlider) === null || _f === void 0 ? void 0 : _f.value) !== null && _g !== void 0 ? _g : vertex.y.toString()));
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
        // private pointSlider: HTMLInputElement;
        _this.initialRotationValue = 0;
        _this.square = square;
        _this.posXSlider = _this.createSlider('Position X', function () { return square.center.x; }, 1, appCanvas.width);
        _this.registerSlider(_this.posXSlider, function (e) { _this.updatePosX(parseInt(_this.posXSlider.value)); });
        _this.posYSlider = _this.createSlider('Position Y', function () { return square.center.y; }, 1, appCanvas.width);
        _this.registerSlider(_this.posYSlider, function (e) { _this.updatePosY(parseInt(_this.posYSlider.value)); });
        _this.sizeSlider = _this.createSlider('Size', function () { return square.size; }, 1, appCanvas.width);
        _this.registerSlider(_this.sizeSlider, function (e) { _this.updateSize(parseInt(_this.sizeSlider.value)); });
        _this.rotateSlider = _this.createSlider('Rotation', function () { return 0; }, -180, 180);
        _this.registerSlider(_this.rotateSlider, function (e) { _this.handleRotationEnd; });
        _this.rotateSlider.addEventListener('mousedown', _this.handleRotationStart.bind(_this));
        _this.rotateSlider.addEventListener('touchstart', _this.handleRotationStart.bind(_this));
        _this.rotateSlider.addEventListener('mouseup', _this.handleRotationEnd.bind(_this));
        _this.rotateSlider.addEventListener('touchend', _this.handleRotationEnd.bind(_this));
        return _this;
    }
    SquareToolbarController.prototype.updatePosX = function (newPosX) {
        var diff = newPosX - this.square.center.x;
        for (var i = 0; i < 4; i++) {
            this.square.pointList[i].x += diff;
        }
        this.square.recalculate();
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.updatePosY = function (newPosY) {
        var diff = newPosY - this.square.center.y;
        for (var i = 0; i < 4; i++) {
            this.square.pointList[i].y += diff;
        }
        this.square.recalculate();
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.updateSize = function (newSize) {
        var halfNewSize = newSize / 2;
        var angle = this.square.angleInRadians;
        var offsets = [
            { x: -halfNewSize, y: -halfNewSize }, // Top left
            { x: halfNewSize, y: -halfNewSize }, // Top right
            { x: halfNewSize, y: halfNewSize }, // Bottom right
            { x: -halfNewSize, y: halfNewSize }, // Bottom left
        ];
        for (var i = 0; i < 4; i++) {
            var offset = offsets[i];
            this.square.pointList[i] = {
                x: this.square.center.x + offset.x * Math.cos(angle) - offset.y * Math.sin(angle),
                y: this.square.center.y + offset.x * Math.sin(angle) + offset.y * Math.cos(angle),
                c: this.square.pointList[i].c
            };
        }
        this.square.size = newSize;
        this.square.recalculate();
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.handleRotationStart = function (e) {
        this.initialRotationValue = parseInt(this.rotateSlider.value);
    };
    SquareToolbarController.prototype.handleRotationEnd = function (e) {
        var finalRotationValue = parseInt(this.rotateSlider.value);
        var deltaRotation = finalRotationValue - this.initialRotationValue;
        this.updateRotation(this.initialRotationValue, deltaRotation);
    };
    SquareToolbarController.prototype.updateRotation = function (initialRotation, deltaRotation) {
        this.square.angleInRadians = (0, utils_1.degToRad)(deltaRotation);
        this.square.setTransformationMatrix();
        this.square.updatePointListWithTransformation();
        this.updateShape(this.square);
    };
    SquareToolbarController.prototype.updateVertex = function (idx, x, y) {
        // Find the indices of the adjacent vertices
        var nextIdx = (idx + 1) % 4;
        var prevIdx = (idx + 3) % 4;
        var opposite = (idx + 2) % 4;
        this.square.recalculate();
        var deltaY = this.square.pointList[1].y - this.square.pointList[0].y;
        var deltaX = this.square.pointList[1].x - this.square.pointList[0].x;
        this.square.angleInRadians = Math.atan2(deltaY, deltaX);
        this.square.translation[0] = -this.square.center.x;
        this.square.translation[1] = -this.square.center.y;
        this.square.angleInRadians = -this.square.angleInRadians;
        this.square.setTransformationMatrix;
        this.square.updatePointListWithTransformation();
        // // Calculate the difference in position
        // const dx = x - this.square.pointList[idx].x;
        // const dy = y - this.square.pointList[idx].y;
        // // Update the selected vertex
        // this.square.pointList[idx].x += dx;
        // this.square.pointList[idx].y += dy;
        // console.log(idx);
        // for(let i=0; i<4;i++){
        //     if(i != idx && i!= opposite){
        //         if (this.square.pointList[i].x == this.square.pointList[opposite].x && this.square.pointList[i].y == this.square.pointList[opposite].y) {
        //             if (Math.abs(dx) > Math.abs(dy)) {
        //                 this.square.pointList[i].x += dx;
        //             } else {
        //                 this.square.pointList[i].y += dy;
        //             }
        //         } else {
        //             if (this.square.pointList[i].x == this.square.pointList[opposite].x){
        //                 this.square.pointList[i].y += dy;
        //             } if(this.square.pointList[i].y == this.square.pointList[opposite].y){
        //                 this.square.pointList[i].x += dx; 
        //             }
        //         }
        //     }
        // }
        // this.square.translation[0] = -this.square.center.x;
        // this.square.translation[1] = -this.square.center.y;
        // this.square.angleInRadians = -this.square.angleInRadians;
        // this.square.setTransformationMatrix;
        // this.square.updatePointListWithTransformation();
        // Recalculate the square properties to reflect the changes
        this.square.recalculate();
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
var CVPolygon_1 = __importDefault(__webpack_require__(/*! ../../Shapes/CVPolygon */ "./src/Shapes/CVPolygon.ts"));
var FanPolygon_1 = __importDefault(__webpack_require__(/*! ../../Shapes/FanPolygon */ "./src/Shapes/FanPolygon.ts"));
var Line_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Line */ "./src/Shapes/Line.ts"));
var Rectangle_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Rectangle */ "./src/Shapes/Rectangle.ts"));
var Square_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Square */ "./src/Shapes/Square.ts"));
var CVPolygonToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/CVPolygonToolbarController */ "./src/Controllers/Toolbar/Shape/CVPolygonToolbarController.ts"));
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
            else if (shape instanceof CVPolygon_1.default) {
                _this.toolbarController = new CVPolygonToolbarController_1.default(shape, appCanvas, _this.canvasController);
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

/***/ "./src/Shapes/CVPolygon.ts":
/*!*********************************!*\
  !*** ./src/Shapes/CVPolygon.ts ***!
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
var Color_1 = __importDefault(__webpack_require__(/*! ../Base/Color */ "./src/Base/Color.ts"));
var Vertex_1 = __importDefault(__webpack_require__(/*! ../Base/Vertex */ "./src/Base/Vertex.ts"));
var convexHullUtils_1 = __importDefault(__webpack_require__(/*! ../convexHullUtils */ "./src/convexHullUtils.ts"));
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var CVPolygon = /** @class */ (function (_super) {
    __extends(CVPolygon, _super);
    function CVPolygon(id, color, vertices) {
        var _this = _super.call(this, 6, id, color) || this;
        _this.lenList = [];
        _this.gs = new convexHullUtils_1.default();
        _this.origin = vertices[0];
        _this.pointList.push(vertices[0], vertices[1]);
        _this.center = new Vertex_1.default((vertices[1].x + vertices[0].x) / 2, (vertices[1].y + vertices[0].y) / 2, new Color_1.default(0, 0, 0));
        vertices.forEach(function (vtx, idx) {
            if (idx < 2)
                return;
            console.log("shape set");
            _this.addVertex(vtx);
        });
        return _this;
    }
    CVPolygon.prototype.addVertex = function (vertex) {
        this.pointList.push(vertex);
        this.recalc();
    };
    CVPolygon.prototype.removeVertex = function (idx) {
        if (this.pointList.length <= 3) {
            alert("Cannot remove vertex any further");
            return;
        }
        this.pointList.splice(idx, 1);
        this.origin = this.pointList[0];
        this.recalc();
    };
    CVPolygon.prototype.recalc = function () {
        var _this = this;
        this.gs.setPoints(this.pointList);
        this.pointList = this.gs.getHull();
        this.origin = this.pointList[0];
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
    return CVPolygon;
}(BaseShape_1.default));
exports["default"] = CVPolygon;


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
        return _this;
    }
    Rectangle.prototype.setTransformationMatrix = function () {
        _super.prototype.setTransformationMatrix.call(this);
        // const point = [this.pointList[idx].x, this.pointList[idx].y, 1];
        this.endPoint = utils_1.m3.multiply3x1(this.transformationMatrix, this.endPoint);
        this.initialPoint = utils_1.m3.multiply3x1(this.transformationMatrix, this.initialPoint);
    };
    Rectangle.prototype.updatePointListWithTransformation = function () {
        var _this = this;
        this.pointList.forEach(function (vertex, index) {
            var vertexMatrix = [vertex.x, vertex.y, 1];
            var transformedVertex = utils_1.m3.multiply3x1(_this.transformationMatrix, vertexMatrix);
            _this.pointList[index] = new Vertex_1.default(transformedVertex[0], transformedVertex[1], _this.pointList[index].c);
        });
        this.recalculate();
    };
    Rectangle.prototype.recalculate = function () {
        var length = Math.sqrt(Math.pow(this.pointList[1].x - this.pointList[0].x, 2) + Math.pow(this.pointList[1].y - this.pointList[0].y, 2));
        var width = Math.sqrt(Math.pow(this.pointList[3].x - this.pointList[1].x, 2) + Math.pow(this.pointList[3].y - this.pointList[1].y, 2));
        var centerX = (this.pointList[0].x + this.pointList[1].x + this.pointList[3].x + this.pointList[2].x) / 4;
        var centerY = (this.pointList[0].y + this.pointList[1].y + this.pointList[3].y + this.pointList[2].y) / 4;
        this.length = length;
        this.width = width;
        this.center = new Vertex_1.default(centerX, centerY, this.color);
    };
    Rectangle.prototype.findOpposite = function (pointIdx) {
        var opposite = { 0: 3, 1: 2, 2: 1, 3: 0 };
        return opposite[pointIdx];
    };
    Rectangle.prototype.findCCWAdjacent = function (pointIdx) {
        var ccwAdjacent = { 0: 2, 1: 0, 2: 3, 3: 1 };
        return ccwAdjacent[pointIdx];
    };
    Rectangle.prototype.findCWAdjacent = function (pointIdx) {
        var cwAdjacent = { 0: 1, 1: 3, 2: 0, 3: 2 };
        return cwAdjacent[pointIdx];
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
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
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
        _this.size = (0, utils_1.euclideanDistanceVtx)(_this.v1, _this.v3);
        _this.pointList.push(_this.v1, _this.v2, _this.v3, _this.v4);
        _this.bufferTransformationList = _this.pointList;
        var deltaY = _this.pointList[1].y - _this.pointList[0].y;
        var deltaX = _this.pointList[1].x - _this.pointList[0].x;
        _this.angleInRadians = Math.atan2(deltaY, deltaX);
        return _this;
    }
    Square.prototype.updatePointListWithTransformation = function () {
        var _this = this;
        this.pointList.forEach(function (vertex, index) {
            var vertexMatrix = [vertex.x, vertex.y, 1];
            var transformedVertex = utils_1.m3.multiply3x1(_this.transformationMatrix, vertexMatrix);
            _this.pointList[index] = new Vertex_1.default(transformedVertex[0], transformedVertex[1], _this.pointList[index].c);
        });
        this.recalculate();
    };
    Square.prototype.recalculate = function () {
        var length = Math.sqrt(Math.pow(this.pointList[1].x - this.pointList[0].x, 2) + Math.pow(this.pointList[1].y - this.pointList[0].y, 2));
        var size = Math.sqrt(Math.pow(this.pointList[3].x - this.pointList[1].x, 2) + Math.pow(this.pointList[3].y - this.pointList[1].y, 2));
        var centerX = (this.pointList[0].x + this.pointList[1].x + this.pointList[3].x + this.pointList[2].x) / 4;
        var centerY = (this.pointList[0].y + this.pointList[1].y + this.pointList[3].y + this.pointList[2].y) / 4;
        var deltaY = this.pointList[1].y - this.pointList[0].y;
        var deltaX = this.pointList[1].x - this.pointList[0].x;
        this.angleInRadians = Math.atan2(deltaY, deltaX);
        this.size = size;
        this.center = new Vertex_1.default(centerX, centerY, this.color);
    };
    return Square;
}(BaseShape_1.default));
exports["default"] = Square;


/***/ }),

/***/ "./src/convexHullUtils.ts":
/*!********************************!*\
  !*** ./src/convexHullUtils.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
var REMOVED = -1;
var GrahamScan = /** @class */ (function () {
    function GrahamScan() {
        this.points = [];
    }
    GrahamScan.prototype.clear = function () {
        this.points = [];
    };
    GrahamScan.prototype.getPoints = function () {
        return this.points;
    };
    GrahamScan.prototype.setPoints = function (points) {
        this.points = points.slice();
    };
    GrahamScan.prototype.addPoint = function (point) {
        this.points.push(point);
    };
    GrahamScan.prototype.getHull = function () {
        var _this = this;
        var pivot = this.preparePivotPoint();
        var indexes = Array.from(this.points, function (point, i) { return i; });
        var angles = Array.from(this.points, function (point) { return _this.getAngle(pivot, point); });
        var distances = Array.from(this.points, function (point) { return _this.euclideanDistanceSquared(pivot, point); });
        indexes.sort(function (i, j) {
            var angleA = angles[i];
            var angleB = angles[j];
            if (angleA === angleB) {
                var distanceA = distances[i];
                var distanceB = distances[j];
                return distanceA - distanceB;
            }
            return angleA - angleB;
        });
        for (var i = 1; i < indexes.length - 1; i++) {
            if (angles[indexes[i]] === angles[indexes[i + 1]]) {
                indexes[i] = REMOVED;
            }
        }
        var hull = [];
        for (var i = 0; i < indexes.length; i++) {
            var index = indexes[i];
            var point = this.points[index];
            if (index !== REMOVED) {
                if (hull.length < 3) {
                    hull.push(point);
                }
                else {
                    while (this.checkOrientation(hull[hull.length - 2], hull[hull.length - 1], point) > 0) {
                        hull.pop();
                    }
                    hull.push(point);
                }
            }
        }
        return hull.length < 3 ? [] : hull;
    };
    GrahamScan.prototype.checkOrientation = function (p1, p2, p3) {
        return (p2.y - p1.y) * (p3.x - p2.x) - (p3.y - p2.y) * (p2.x - p1.x);
    };
    GrahamScan.prototype.getAngle = function (a, b) {
        return Math.atan2(b.y - a.y, b.x - a.x);
    };
    GrahamScan.prototype.euclideanDistanceSquared = function (p1, p2) {
        var a = p2.x - p1.x;
        var b = p2.y - p1.y;
        return a * a + b * b;
    };
    GrahamScan.prototype.preparePivotPoint = function () {
        var pivot = this.points[0];
        var pivotIndex = 0;
        for (var i = 1; i < this.points.length; i++) {
            var point = this.points[i];
            if (point.y < pivot.y || point.y === pivot.y && point.x < pivot.x) {
                pivot = point;
                pivotIndex = i;
            }
        }
        return pivot;
    };
    return GrahamScan;
}());
exports["default"] = GrahamScan;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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WUFBWSxDQUFDLFlBQVksRUFBRSxjQUFNLFFBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBakMsQ0FBaUMsRUFBQyxDQUFDLEdBQUcsR0FBQyxTQUFTLENBQUMsS0FBSyxFQUFDLEdBQUcsR0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEksS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRS9GLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBL0IsQ0FBK0IsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUYsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRS9GLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0RyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxZQUFZLEVBQUUsVUFBQyxDQUFDLElBQU0sS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQzs7SUFDNUcsQ0FBQztJQUVPLDRDQUFVLEdBQWxCLFVBQW1C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RyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixPQUFPO1lBQ0wsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7U0FDbEMsQ0FBQztJQUNKLENBQUM7SUFFRCxPQUFPLEVBQUUsVUFBUyxDQUFZO1FBQzVCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFL0MsSUFBSSxHQUFHLEtBQUssQ0FBQztZQUFFLE9BQU8sSUFBSSxDQUFDO1FBRTNCLElBQU0sTUFBTSxHQUFHLENBQUMsR0FBRyxHQUFHLENBQUM7UUFFdkIsT0FBTztZQUNILE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3ZDLENBQUM7SUFDTixDQUFDO0lBRUMsV0FBVyxFQUFFLFVBQVMsQ0FBWSxFQUFFLENBQVk7UUFDOUMsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsT0FBTztZQUNMLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1NBQ2xDLENBQUM7SUFDSixDQUFDO0lBRUQsU0FBUyxFQUFFLFVBQVMsQ0FBWSxFQUFFLEVBQVMsRUFBRSxFQUFTO1FBQ3BELE9BQU8sVUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsVUFBRSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRUQsTUFBTSxFQUFFLFVBQVMsQ0FBVSxFQUFFLGNBQXFCO1FBQ2hELE9BQU8sVUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsVUFBRSxDQUFDLFFBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO0lBQ3JELENBQUM7SUFFRCxLQUFLLEVBQUUsVUFBUyxDQUFVLEVBQUUsRUFBUyxFQUFFLEVBQVM7UUFDOUMsT0FBTyxVQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFFLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzVDLENBQUM7Q0FDRixDQUFDOzs7Ozs7O1VDbktKO1VBQ0E7O1VBRUE7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7O1VBRUE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7Ozs7VUV0QkE7VUFDQTtVQUNBO1VBQ0EiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQXBwQ2FudmFzLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL0Jhc2VTaGFwZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9Db2xvci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9WZXJ0ZXgudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL0NhbnZhc0NvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL0NWUG9seWdvbk1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvTGluZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9TcXVhcmVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvQ1ZQb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvRmFuUG9seWdvblRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL0xpbmVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9SZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9TaGFwZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1NxdWFyZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1Rvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvQ1ZQb2x5Z29uLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvRmFuUG9seWdvbi50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL0xpbmUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9SZWN0YW5nbGUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9TcXVhcmUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL2NvbnZleEh1bGxVdGlscy50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL2luaXQudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL3V0aWxzLnRzIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9iZWZvcmUtc3RhcnR1cCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2FmdGVyLXN0YXJ0dXAiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuL0Jhc2UvQmFzZVNoYXBlJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENhbnZhcyB7XHJcbiAgICBwcml2YXRlIHByb2dyYW06IFdlYkdMUHJvZ3JhbTtcclxuICAgIHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dDtcclxuICAgIHByaXZhdGUgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyO1xyXG4gICAgcHJpdmF0ZSBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXI7XHJcbiAgICBwcml2YXRlIF91cGRhdGVUb29sYmFyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIF9zaGFwZXM6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4gPSB7fTtcclxuXHJcbiAgICB3aWR0aDogbnVtYmVyO1xyXG4gICAgaGVpZ2h0OiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoXHJcbiAgICAgICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICAgICAgICBwcm9ncmFtOiBXZWJHTFByb2dyYW0sXHJcbiAgICAgICAgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLFxyXG4gICAgICAgIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlclxyXG4gICAgKSB7XHJcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xyXG4gICAgICAgIHRoaXMucG9zaXRpb25CdWZmZXIgPSBwb3NpdGlvbkJ1ZmZlcjtcclxuICAgICAgICB0aGlzLmNvbG9yQnVmZmVyID0gY29sb3JCdWZmZXI7XHJcbiAgICAgICAgdGhpcy5wcm9ncmFtID0gcHJvZ3JhbTtcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aCA9IGdsLmNhbnZhcy53aWR0aDtcclxuICAgICAgICB0aGlzLmhlaWdodCA9IGdsLmNhbnZhcy5oZWlnaHQ7XHJcblxyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSB0aGlzLnBvc2l0aW9uQnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gdGhpcy5jb2xvckJ1ZmZlcjtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gc2hhcGUucG9pbnRMaXN0LmZsYXRNYXAoKHBvaW50KSA9PiBbXHJcbiAgICAgICAgICAgICAgICBwb2ludC54LFxyXG4gICAgICAgICAgICAgICAgcG9pbnQueSxcclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29sb3JzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYXBlLnBvaW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goc2hhcGUucG9pbnRMaXN0W2ldLmMuciwgc2hhcGUucG9pbnRMaXN0W2ldLmMuZywgc2hhcGUucG9pbnRMaXN0W2ldLmMuYik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJpbmQgY29sb3IgZGF0YVxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLFxyXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEJpbmQgcG9zaXRpb24gZGF0YVxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghKHRoaXMucG9zaXRpb25CdWZmZXIgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIGJ1ZmZlciBpcyBub3QgYSB2YWxpZCBXZWJHTEJ1ZmZlclwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgaWYgKCEodGhpcy5jb2xvckJ1ZmZlciBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29sb3IgYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTZXQgdHJhbnNmb3JtYXRpb24gbWF0cml4XHJcbiAgICAgICAgICAgIC8vIHNoYXBlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtYXRyaXhMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIFwidV90cmFuc2Zvcm1hdGlvblwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoc2hhcGUudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG4gICAgICAgICAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeExvY2F0aW9uLCBmYWxzZSwgbWF0cml4KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGFwcGx5U3BlY2lhbFRyZWF0bWVudExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X2FwcGx5U3BlY2lhbFRyZWF0bWVudFwiKTtcclxuICAgICAgICAgICAgLy8gY29uc3Qgc3BlY2lhbE9mZnNldExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X3NwZWNpYWxPZmZzZXRcIik7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAvLyBjb25zdCBhcHBseVNwZWNpYWxUcmVhdG1lbnQgPSBmYWxzZTsgXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IHNwZWNpYWxPZmZzZXQgPSBbMC4wLCAwLjBdO1xyXG5cclxuICAgICAgICAgICAgLy8gZ2wudW5pZm9ybTFpKGFwcGx5U3BlY2lhbFRyZWF0bWVudExvY2F0aW9uLCBhcHBseVNwZWNpYWxUcmVhdG1lbnQgPyAxIDogMCk7XHJcbiAgICAgICAgICAgIC8vIGdsLnVuaWZvcm0yZnYoc3BlY2lhbE9mZnNldExvY2F0aW9uLCBuZXcgRmxvYXQzMkFycmF5KHNwZWNpYWxPZmZzZXQpKTtcclxuXHJcbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoc2hhcGUuZ2xEcmF3VHlwZSwgMCwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aCk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXQgc2hhcGVzKCk6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVzKHY6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4pIHtcclxuICAgICAgICB0aGlzLl9zaGFwZXMgPSB2O1xyXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XHJcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZVRvb2xiYXIpXHJcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xiYXIuY2FsbCh0aGlzKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgc2V0IHVwZGF0ZVRvb2xiYXIodiA6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICB0aGlzLl91cGRhdGVUb29sYmFyID0gdjtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZ2VuZXJhdGVJZEZyb21UYWcodGFnOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB3aXRoU2FtZVRhZyA9IE9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5maWx0ZXIoKGlkKSA9PiBpZC5zdGFydHNXaXRoKHRhZyArICctJykpO1xyXG4gICAgICAgIHJldHVybiBgJHt0YWd9LSR7d2l0aFNhbWVUYWcubGVuZ3RoICsgMX1gXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGFkZFNoYXBlKHNoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKHNoYXBlLmlkKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBhbHJlYWR5IHVzZWQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xyXG4gICAgICAgIG5ld1NoYXBlc1tzaGFwZS5pZF0gPSBzaGFwZTtcclxuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZWRpdFNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgbm90IGZvdW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcclxuICAgICAgICBuZXdTaGFwZXNbbmV3U2hhcGUuaWRdID0gbmV3U2hhcGU7XHJcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlbGV0ZVNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgbm90IGZvdW5kJyk7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcclxuICAgICAgICBkZWxldGUgbmV3U2hhcGVzW25ld1NoYXBlLmlkXTtcclxuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcclxuICAgIH1cclxufSIsImltcG9ydCB7IG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuL1ZlcnRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQmFzZVNoYXBlIHtcclxuXHJcbiAgICBwb2ludExpc3Q6IFZlcnRleFtdID0gW107XHJcbiAgICBidWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3Q6IFZlcnRleFtdID0gW107XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgY29sb3I6IENvbG9yO1xyXG4gICAgZ2xEcmF3VHlwZTogbnVtYmVyO1xyXG4gICAgY2VudGVyOiBWZXJ0ZXg7XHJcblxyXG4gICAgdHJhbnNsYXRpb246IFtudW1iZXIsIG51bWJlcl0gPSBbMCwgMF07XHJcbiAgICBhbmdsZUluUmFkaWFuczogbnVtYmVyID0gMDtcclxuICAgIHNjYWxlOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xyXG5cclxuICAgIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBudW1iZXJbXSA9IG0zLmlkZW50aXR5KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2xEcmF3VHlwZTogbnVtYmVyLCBpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIGNlbnRlcjogVmVydGV4ID0gbmV3IFZlcnRleCgwLCAwLCBjb2xvciksIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IGdsRHJhd1R5cGU7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcclxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gcm90YXRpb247XHJcbiAgICAgICAgdGhpcy5zY2FsZVswXSA9IHNjYWxlWDtcclxuICAgICAgICB0aGlzLnNjYWxlWzFdID0gc2NhbGVZO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5pZGVudGl0eSgpXHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlVG9DZW50ZXIgPSBtMy50cmFuc2xhdGlvbigtdGhpcy5jZW50ZXIueCwgLXRoaXMuY2VudGVyLnkpO1xyXG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbTMucm90YXRpb24odGhpcy5hbmdsZUluUmFkaWFucyk7XHJcbiAgICAgICAgbGV0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHRoaXMuc2NhbGVbMF0sIHRoaXMuc2NhbGVbMV0pO1xyXG4gICAgICAgIGxldCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24odGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlID0gbTMudHJhbnNsYXRpb24odGhpcy50cmFuc2xhdGlvblswXSwgdGhpcy50cmFuc2xhdGlvblsxXSk7XHJcblxyXG4gICAgICAgIGxldCByZXNTY2FsZSA9IG0zLm11bHRpcGx5KHNjYWxpbmcsIHRyYW5zbGF0ZVRvQ2VudGVyKTtcclxuICAgICAgICBsZXQgcmVzUm90YXRlID0gbTMubXVsdGlwbHkocm90YXRpb24scmVzU2NhbGUpO1xyXG4gICAgICAgIGxldCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzUm90YXRlKTtcclxuICAgICAgICBjb25zdCByZXNUcmFuc2xhdGUgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGUsIHJlc0JhY2spO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSByZXNUcmFuc2xhdGU7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcjogbnVtYmVyO1xyXG4gICAgZzogbnVtYmVyO1xyXG4gICAgYjogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQ29sb3IgZnJvbSBcIi4vQ29sb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlcnRleCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBjOiBDb2xvcjtcclxuICAgIGlzU2VsZWN0ZWQgOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICBcclxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBjOiBDb2xvciwgaXNTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICAgICAgdGhpcy5pc1NlbGVjdGVkID0gaXNTZWxlY3RlZDtcclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IENWUG9seWdvbk1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0NWUG9seWdvbk1ha2VyQ29udHJvbGxlcic7XHJcbmltcG9ydCBGYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGUvSVNoYXBlTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IExpbmVNYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9MaW5lTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1JlY3RhbmdsZU1ha2VyQ29udHJvbGxlcic7XHJcbmltcG9ydCBTcXVhcmVNYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9TcXVhcmVNYWtlckNvbnRyb2xsZXInO1xyXG5cclxuZW51bSBBVkFJTF9TSEFQRVMge1xyXG4gICAgTGluZSA9ICdMaW5lJyxcclxuICAgIFJlY3RhbmdsZSA9ICdSZWN0YW5nbGUnLFxyXG4gICAgU3F1YXJlID0gJ1NxdWFyZScsXHJcbiAgICBGYW5Qb2x5ID0gJ0ZhblBvbHknLFxyXG4gICAgQ1ZQb2x5ID0gJ0NWUG9seScsXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0NvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBfc2hhcGVDb250cm9sbGVyOiBJU2hhcGVNYWtlckNvbnRyb2xsZXI7XHJcbiAgICBwcml2YXRlIGNhbnZhc0VsbXQ6IEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBidXR0b25Db250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBjb2xvclBpY2tlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgdG9vbGJhck9uQ2xpY2tDYjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuXHJcbiAgICAgICAgY29uc3QgY2FudmFzRWxtdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICdzaGFwZS1idXR0b24tY29udGFpbmVyJ1xyXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2V0LXBvbHlnb24nXHJcbiAgICAgICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNFbG10ID0gY2FudmFzRWxtdDtcclxuICAgICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lciA9IGJ1dHRvbkNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgICAgIHRoaXMuX3NoYXBlQ29udHJvbGxlciA9IG5ldyBDVlBvbHlnb25NYWtlckNvbnRyb2xsZXIoYXBwQ2FudmFzKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2hhcGUtY29sb3ItcGlja2VyJ1xyXG4gICAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNFbG10Lm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WCA9IGUub2Zmc2V0WCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WSA9IGUub2Zmc2V0WSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlcj8uaGFuZGxlQ2xpY2soXHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0WCxcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RZLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvclBpY2tlci52YWx1ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50b29sYmFyT25DbGlja0NiKVxyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyT25DbGlja0NiKClcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0IHNoYXBlQ29udHJvbGxlcigpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZUNvbnRyb2xsZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVDb250cm9sbGVyKHY6IElTaGFwZU1ha2VyQ29udHJvbGxlcikge1xyXG4gICAgICAgIHRoaXMuX3NoYXBlQ29udHJvbGxlciA9IHY7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdC5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29ycmVjdFggPSBlLm9mZnNldFggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgY29uc3QgY29ycmVjdFkgPSBlLm9mZnNldFkgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXI/LmhhbmRsZUNsaWNrKFxyXG4gICAgICAgICAgICAgICAgY29ycmVjdFgsXHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0WSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JQaWNrZXIudmFsdWVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9vbGJhck9uQ2xpY2tDYilcclxuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhck9uQ2xpY2tDYigpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGluaXRDb250cm9sbGVyKHNoYXBlU3RyOiBBVkFJTF9TSEFQRVMpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgICAgICBzd2l0Y2ggKHNoYXBlU3RyKSB7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLkxpbmU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpbmVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5SZWN0YW5nbGU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLlNxdWFyZTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3F1YXJlTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcclxuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuRmFuUG9seTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLkNWUG9seTpcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5jb3JyZWN0IHNoYXBlIHN0cmluZycpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBlZGl0RXhpc3RpbmdGYW5Qb2x5Z29uKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlciA9IG5ldyBGYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcclxuICAgICAgICAodGhpcy5zaGFwZUNvbnRyb2xsZXIgYXMgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcikuc2V0Q3VycmVudFBvbHlnb24oaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIGVkaXRFeGlzdGluZ0NWUG9seWdvbihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSBuZXcgQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcclxuICAgICAgICAodGhpcy5zaGFwZUNvbnRyb2xsZXIgYXMgQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyKS5zZXRDdXJyZW50UG9seWdvbihpZCk7XHJcbiAgICB9XHJcblxyXG4gICAgc3RhcnQoKSB7XHJcbiAgICAgICAgZm9yIChjb25zdCBzaGFwZVN0ciBpbiBBVkFJTF9TSEFQRVMpIHtcclxuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzaGFwZS1idXR0b24nKTtcclxuICAgICAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gc2hhcGVTdHI7XHJcbiAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSB0aGlzLmluaXRDb250cm9sbGVyKFxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlU3RyIGFzIEFWQUlMX1NIQVBFU1xyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSAnLi4vLi4vLi4vQmFzZS9Db2xvcic7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSAnLi4vLi4vLi4vQmFzZS9WZXJ0ZXgnO1xyXG5pbXBvcnQgQ1ZQb2x5Z29uIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9DVlBvbHlnb24nO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSAnLi9JU2hhcGVNYWtlckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyXHJcbiAgICBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlclxyXG57XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBvcmlnaW46IFZlcnRleCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBzZWNvbmRQb2ludDogVmVydGV4IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRQb2x5OiBDVlBvbHlnb24gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgc2V0UG9seWdvbkJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICdzZXQtcG9seWdvbidcclxuICAgICAgICApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMub3JpZ2luICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZFBvaW50ICE9PSBudWxsXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlY29uZFBvaW50ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgc2V0Q3VycmVudFBvbHlnb24oaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSB0aGlzLmFwcENhbnZhcy5zaGFwZXNbaWRdIGFzIENWUG9seWdvbjtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuY3VycmVudFBvbHkucG9pbnRMaXN0WzBdO1xyXG4gICAgICAgIHRoaXMuc2Vjb25kUG9pbnQgPSB0aGlzLmN1cnJlbnRQb2x5LnBvaW50TGlzdFsxXTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBjb25zdCB7IHIsIGcsIGIgfSA9IGhleFRvUmdiKGhleCkgPz8geyByOiAwLCBnOiAwLCBiOiAwIH07XHJcbiAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3IociAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb3JpZ2luIHNldCcpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3JpZ2luICE9PSBudWxsICYmIHRoaXMuc2Vjb25kUG9pbnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NlY29uZCBzZXQnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2Vjb25kUG9pbnQgPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3JpZ2luICE9PSBudWxsICYmIHRoaXMuc2Vjb25kUG9pbnQgIT09IG51bGwgJiYgdGhpcy5jdXJyZW50UG9seSA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnc2hhcGUgc2V0Jyk7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdwb2x5Y3YnKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBuZXcgQ1ZQb2x5Z29uKGlkLCBjb2xvciwgW3RoaXMub3JpZ2luLCB0aGlzLnNlY29uZFBvaW50LCBuZXdWZXJ0ZXhdKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUodGhpcy5jdXJyZW50UG9seSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3VmVydGV4ID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQb2x5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5LmFkZFZlcnRleChuZXdWZXJ0ZXgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuZWRpdFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IENvbG9yIGZyb20gJy4uLy4uLy4uL0Jhc2UvQ29sb3InO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gJy4uLy4uLy4uL0Jhc2UvVmVydGV4JztcclxuaW1wb3J0IEZhblBvbHlnb24gZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0ZhblBvbHlnb24nO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSAnLi9JU2hhcGVNYWtlckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlclxyXG4gICAgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXJcclxue1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiBWZXJ0ZXggfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgY3VycmVudFBvbHk6IEZhblBvbHlnb24gfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgc2V0UG9seWdvbkJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICdzZXQtcG9seWdvbidcclxuICAgICAgICApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgIHRoaXMub3JpZ2luICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5LnBvaW50TGlzdC5sZW5ndGggPiAyXHJcbiAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNldEN1cnJlbnRQb2x5Z29uKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gdGhpcy5hcHBDYW52YXMuc2hhcGVzW2lkXSBhcyBGYW5Qb2x5Z29uO1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5jdXJyZW50UG9seS5wb2ludExpc3RbMF07XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBoZXhUb1JnYihoZXgpID8/IHsgcjogMCwgZzogMCwgYjogMCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3JpZ2luICE9PSBudWxsICYmIHRoaXMuY3VycmVudFBvbHkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc3QgbmV3VmVydGV4ID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3BvbHlmYW4nKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBuZXcgRmFuUG9seWdvbihpZCwgY29sb3IsIFt0aGlzLm9yaWdpbiwgbmV3VmVydGV4XSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9seSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seS5hZGRWZXJ0ZXgobmV3VmVydGV4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZSh0aGlzLmN1cnJlbnRQb2x5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBMaW5lIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvTGluZVwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xyXG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdsaW5lJyk7XHJcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBuZXcgTGluZShpZCwgY29sb3IsIHRoaXMub3JpZ2luLngsIHRoaXMub3JpZ2luLnksIHgsIHkpO1xyXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZShsaW5lKTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL1JlY3RhbmdsZVwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xyXG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBvcmlnaW46IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB7ciwgZywgYn0gPSBoZXhUb1JnYihoZXgpID8/IHtyOiAwLCBnOiAwLCBiOiAwfTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3JlY3RhbmdsZScpO1xyXG4gICAgICAgICAgICBjb25zdCByZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxyXG4gICAgICAgICAgICAgICAgaWQsIGNvbG9yLCB0aGlzLm9yaWdpbi54LCB0aGlzLm9yaWdpbi55LCB4LCB5LDAsMSwxKTtcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUocmVjdGFuZ2xlKTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFNxdWFyZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL1NxdWFyZVwiO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xyXG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBvcmlnaW46IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB7ciwgZywgYn0gPSBoZXhUb1JnYihoZXgpID8/IHtyOiAwLCBnOiAwLCBiOiAwfTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3NxdWFyZScpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgdjEgPSB7eDogeCwgeTogeX07XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2MXg6ICR7djEueH0sIHYxeTogJHt2MS55fWApXHJcblxyXG4gICAgICAgICAgICBjb25zdCB2MiA9IHt4OiB0aGlzLm9yaWdpbi54IC0gKHkgLSB0aGlzLm9yaWdpbi55KSwgXHJcbiAgICAgICAgICAgICAgICB5OiB0aGlzLm9yaWdpbi55ICsgKHgtdGhpcy5vcmlnaW4ueCl9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2Mng6ICR7djIueH0sIHYyeTogJHt2Mi55fWApXHJcblxyXG4gICAgICAgICAgICBjb25zdCB2MyA9IHt4OiAyKnRoaXMub3JpZ2luLnggLSB4LCBcclxuICAgICAgICAgICAgICAgIHk6IDIqdGhpcy5vcmlnaW4ueSAtIHl9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2M3g6ICR7djMueH0sIHYzeTogJHt2My55fWApXHJcblxyXG4gICAgICAgICAgICBjb25zdCB2NCA9IHt4OiB0aGlzLm9yaWdpbi54ICsgKHkgLSB0aGlzLm9yaWdpbi55KSwgXHJcbiAgICAgICAgICAgICAgICB5OiB0aGlzLm9yaWdpbi55IC0gKHgtdGhpcy5vcmlnaW4ueCl9XHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2NHg6ICR7djQueH0sIHY0eTogJHt2NC55fWApXHJcblxyXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBuZXcgU3F1YXJlKFxyXG4gICAgICAgICAgICAgICAgaWQsIGNvbG9yLCB2MS54LCB2MS55LCB2Mi54LCB2Mi55LCB2My54LCB2My55LCB2NC54LCB2NC55KTtcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUoc3F1YXJlKTtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IENWUG9seWdvbiBmcm9tICcuLi8uLi8uLi9TaGFwZXMvQ1ZQb2x5Z29uJztcclxuaW1wb3J0IHsgZGVnVG9SYWQsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgQ2FudmFzQ29udHJvbGxlciBmcm9tICcuLi8uLi9NYWtlci9DYW52YXNDb250cm9sbGVyJztcclxuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDVlBvbHlnb25Ub29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzY2FsZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIERFRkFVTFRfU0NBTEUgPSA1MDtcclxuXHJcbiAgICBwcml2YXRlIGN1cnJlbnRTY2FsZTogbnVtYmVyID0gNTA7XHJcbiAgICBwcml2YXRlIGN2UG9seTogQ1ZQb2x5Z29uO1xyXG4gICAgcHJpdmF0ZSBjYW52YXNDb250cm9sbGVyOiBDYW52YXNDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZhblBvbHk6IENWUG9seWdvbixcclxuICAgICAgICBhcHBDYW52YXM6IEFwcENhbnZhcyxcclxuICAgICAgICBjYW52YXNDb250cm9sbGVyOiBDYW52YXNDb250cm9sbGVyXHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihmYW5Qb2x5LCBhcHBDYW52YXMpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlciA9IGNhbnZhc0NvbnRyb2xsZXI7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250cm9sbGVyLnRvb2xiYXJPbkNsaWNrQ2IgPSB0aGlzLmluaXRWZXJ0ZXhUb29sYmFyLmJpbmQodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuY3ZQb2x5ID0gZmFuUG9seTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcclxuICAgICAgICAgICAgKCkgPT4gZmFuUG9seS5wb2ludExpc3RbMF0ueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWScsXHJcbiAgICAgICAgICAgICgpID0+IGZhblBvbHkucG9pbnRMaXN0WzBdLnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2FsZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnU2NhbGUnLFxyXG4gICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRTY2FsZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICAxMDBcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5zY2FsZVNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjYWxlKHBhcnNlSW50KHRoaXMuc2NhbGVTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjdXN0b21WZXJ0ZXhUb29sYmFyKCkge1xyXG4gICAgICAgIGNvbnN0IGFkZFZ0eEJ1dHRvbiA9IHRoaXMuY3JlYXRlVmVydGV4QnV0dG9uKCdBZGQgVmVydGV4Jyk7XHJcbiAgICAgICAgYWRkVnR4QnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlci5lZGl0RXhpc3RpbmdDVlBvbHlnb24odGhpcy5jdlBvbHkuaWQpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRWZXJ0ZXhUb29sYmFyKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVtb3ZlVnR4QnV0dG9uID0gdGhpcy5jcmVhdGVWZXJ0ZXhCdXR0b24oJ1JlbW92ZSBWZXJ0ZXgnKTtcclxuICAgICAgICByZW1vdmVWdHhCdXR0b24ub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5jdlBvbHkucmVtb3ZlVmVydGV4KHBhcnNlSW50KHRoaXMuc2VsZWN0ZWRWZXJ0ZXgpKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuY3ZQb2x5KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVmVydGV4QnV0dG9uKHRleHQ6IHN0cmluZyk6IEhUTUxCdXR0b25FbGVtZW50IHtcclxuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xyXG5cclxuICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWCAtIHRoaXMuY3ZQb2x5LnBvaW50TGlzdFswXS54O1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnBvaW50TGlzdCA9IHRoaXMuY3ZQb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCkgPT4ge1xyXG4gICAgICAgICAgICB2dHgueCArPSBkaWZmO1xyXG4gICAgICAgICAgICByZXR1cm4gdnR4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnJlY2FsYygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5jdlBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWSAtIHRoaXMuY3ZQb2x5LnBvaW50TGlzdFswXS55O1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnBvaW50TGlzdCA9IHRoaXMuY3ZQb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIHZ0eC55ICs9IGRpZmY7XHJcbiAgICAgICAgICAgIHJldHVybiB2dHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5jdlBvbHkucmVjYWxjKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmN2UG9seSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXRDdXJyZW50U2NhbGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFNjYWxlO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlU2NhbGUobmV3U2NhbGU6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gbmV3U2NhbGU7XHJcbiAgICAgICAgdGhpcy5jdlBvbHkucG9pbnRMaXN0ID0gdGhpcy5jdlBvbHkucG9pbnRMaXN0Lm1hcCgodnR4LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmFkID0gZGVnVG9SYWQoZ2V0QW5nbGUodGhpcy5jdlBvbHkuY2VudGVyLCB2dHgpKTtcclxuICAgICAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MocmFkKTtcclxuICAgICAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4ocmFkKTtcclxuXHJcbiAgICAgICAgICAgIHZ0eC54ID1cclxuICAgICAgICAgICAgICAgIHRoaXMuY3ZQb2x5LmNlbnRlci54ICtcclxuICAgICAgICAgICAgICAgIGNvcyAqXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdlBvbHkubGVuTGlzdFtpZHhdICpcclxuICAgICAgICAgICAgICAgICAgICAobmV3U2NhbGUgLyB0aGlzLkRFRkFVTFRfU0NBTEUpO1xyXG4gICAgICAgICAgICB2dHgueSA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN2UG9seS5jZW50ZXIueSAtXHJcbiAgICAgICAgICAgICAgICBzaW4gKlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3ZQb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2dHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmN2UG9seSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnBvaW50TGlzdFtpZHhdLnggPSB4O1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnBvaW50TGlzdFtpZHhdLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnJlY2FsYygpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuY3ZQb2x5KTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBGYW5Qb2x5Z29uIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9GYW5Qb2x5Z29uJztcclxuaW1wb3J0IHsgZGVnVG9SYWQsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgQ2FudmFzQ29udHJvbGxlciBmcm9tICcuLi8uLi9NYWtlci9DYW52YXNDb250cm9sbGVyJztcclxuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgc2NhbGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBERUZBVUxUX1NDQUxFID0gNTA7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50U2NhbGU6IG51bWJlciA9IDUwO1xyXG4gICAgcHJpdmF0ZSBmYW5Qb2x5OiBGYW5Qb2x5Z29uO1xyXG4gICAgcHJpdmF0ZSBjYW52YXNDb250cm9sbGVyOiBDYW52YXNDb250cm9sbGVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGZhblBvbHk6IEZhblBvbHlnb24sXHJcbiAgICAgICAgYXBwQ2FudmFzOiBBcHBDYW52YXMsXHJcbiAgICAgICAgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZmFuUG9seSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIgPSBjYW52YXNDb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlci50b29sYmFyT25DbGlja0NiID0gdGhpcy5pbml0VmVydGV4VG9vbGJhci5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmZhblBvbHkgPSBmYW5Qb2x5O1xyXG5cclxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFgnLFxyXG4gICAgICAgICAgICAoKSA9PiBmYW5Qb2x5LnBvaW50TGlzdFswXS54LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGhcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdQb3NpdGlvbiBZJyxcclxuICAgICAgICAgICAgKCkgPT4gZmFuUG9seS5wb2ludExpc3RbMF0ueSxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgYXBwQ2FudmFzLmhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1lTbGlkZXIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNjYWxlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdTY2FsZScsXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0Q3VycmVudFNjYWxlLmJpbmQodGhpcyksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIDEwMFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnNjYWxlU2xpZGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NhbGUocGFyc2VJbnQodGhpcy5zY2FsZVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGN1c3RvbVZlcnRleFRvb2xiYXIoKSB7XHJcbiAgICAgICAgY29uc3QgYWRkVnR4QnV0dG9uID0gdGhpcy5jcmVhdGVWZXJ0ZXhCdXR0b24oJ0FkZCBWZXJ0ZXgnKTtcclxuICAgICAgICBhZGRWdHhCdXR0b24ub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5jYW52YXNDb250cm9sbGVyLmVkaXRFeGlzdGluZ0ZhblBvbHlnb24odGhpcy5mYW5Qb2x5LmlkKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbW92ZVZ0eEJ1dHRvbiA9IHRoaXMuY3JlYXRlVmVydGV4QnV0dG9uKCdSZW1vdmUgVmVydGV4Jyk7XHJcbiAgICAgICAgcmVtb3ZlVnR4QnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuZmFuUG9seS5yZW1vdmVWZXJ0ZXgocGFyc2VJbnQodGhpcy5zZWxlY3RlZFZlcnRleCkpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRWZXJ0ZXhUb29sYmFyKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5mYW5Qb2x5KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3JlYXRlVmVydGV4QnV0dG9uKHRleHQ6IHN0cmluZyk6IEhUTUxCdXR0b25FbGVtZW50IHtcclxuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0O1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xyXG5cclxuICAgICAgICByZXR1cm4gYnV0dG9uO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWCAtIHRoaXMuZmFuUG9seS5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCkgPT4ge1xyXG4gICAgICAgICAgICB2dHgueCArPSBkaWZmO1xyXG4gICAgICAgICAgICByZXR1cm4gdnR4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5yZWNhbGMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NZIC0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdFswXS55O1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5wb2ludExpc3QgPSB0aGlzLmZhblBvbHkucG9pbnRMaXN0Lm1hcCgodnR4LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgdnR4LnkgKz0gZGlmZjtcclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucmVjYWxjKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q3VycmVudFNjYWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNjYWxlKG5ld1NjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY2FsZSA9IG5ld1NjYWxlO1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5wb2ludExpc3QgPSB0aGlzLmZhblBvbHkucG9pbnRMaXN0Lm1hcCgodnR4LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcmFkID0gZGVnVG9SYWQoZ2V0QW5nbGUodGhpcy5mYW5Qb2x5LmNlbnRlciwgdnR4KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XHJcblxyXG4gICAgICAgICAgICB2dHgueCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkuY2VudGVyLnggK1xyXG4gICAgICAgICAgICAgICAgY29zICpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkubGVuTGlzdFtpZHhdICpcclxuICAgICAgICAgICAgICAgICAgICAobmV3U2NhbGUgLyB0aGlzLkRFRkFVTFRfU0NBTEUpO1xyXG4gICAgICAgICAgICB2dHgueSA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkuY2VudGVyLnkgLVxyXG4gICAgICAgICAgICAgICAgc2luICpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkubGVuTGlzdFtpZHhdICpcclxuICAgICAgICAgICAgICAgICAgICAobmV3U2NhbGUgLyB0aGlzLkRFRkFVTFRfU0NBTEUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5wb2ludExpc3RbaWR4XS54ID0geDtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0W2lkeF0ueSA9IHk7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnJlY2FsYygpO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgTGluZSBmcm9tICcuLi8uLi8uLi9TaGFwZXMvTGluZSc7XHJcbmltcG9ydCB7IGRlZ1RvUmFkLCBldWNsaWRlYW5EaXN0YW5jZVZ0eCwgZ2V0QW5nbGUgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGxlbmd0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJvdGF0ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIGxpbmU6IExpbmU7XHJcblxyXG4gICAgY29uc3RydWN0b3IobGluZTogTGluZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICBzdXBlcihsaW5lLCBhcHBDYW52YXMpO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xyXG5cclxuICAgICAgICBjb25zdCBkaWFnb25hbCA9IE1hdGguc3FydChcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoICogYXBwQ2FudmFzLndpZHRoICtcclxuICAgICAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHQgKiBhcHBDYW52YXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLmxlbmd0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnTGVuZ3RoJyxcclxuICAgICAgICAgICAgKCkgPT4gbGluZS5sZW5ndGgsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGRpYWdvbmFsXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMubGVuZ3RoU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFgnLFxyXG4gICAgICAgICAgICAoKSA9PiBsaW5lLnBvaW50TGlzdFswXS54LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGhcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWScsXHJcbiAgICAgICAgICAgICgpID0+IGxpbmUucG9pbnRMaXN0WzBdLnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgdGhpcy5jdXJyZW50QW5nbGUuYmluZCh0aGlzKSwgMCwgMzYwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBsaW5lTGVuID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV1cclxuICAgICAgICApO1xyXG4gICAgICAgIGNvbnN0IGNvcyA9XHJcbiAgICAgICAgICAgICh0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLngpIC8gbGluZUxlbjtcclxuICAgICAgICBjb25zdCBzaW4gPVxyXG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55KSAvIGxpbmVMZW47XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3TGVuICogY29zICsgdGhpcy5saW5lLnBvaW50TGlzdFswXS54O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld0xlbiAqIHNpbiArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueTtcclxuXHJcbiAgICAgICAgdGhpcy5saW5lLmxlbmd0aCA9IG5ld0xlbjtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS54IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS54O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCA9IG5ld1Bvc1g7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3UG9zWCArIGRpZmY7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSA9IG5ld1Bvc1k7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID0gbmV3UG9zWSArIGRpZmY7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY3VycmVudEFuZ2xlKCkge1xyXG4gICAgICAgIHJldHVybiBnZXRBbmdsZSh0aGlzLmxpbmUucG9pbnRMaXN0WzBdLCB0aGlzLmxpbmUucG9pbnRMaXN0WzFdKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKG5ld1JvdDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgcmFkID0gZGVnVG9SYWQobmV3Um90KTtcclxuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWQpO1xyXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XHJcblxyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9XHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCArIGNvcyAqIHRoaXMubGluZS5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID1cclxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS55IC0gc2luICogdGhpcy5saW5lLmxlbmd0aDtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0W2lkeF0ueCA9IHg7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFtpZHhdLnkgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLmxpbmUubGVuZ3RoID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV1cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tVmVydGV4VG9vbGJhcigpOiB2b2lkIHt9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGUnO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSB3aWR0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgbGVuZ3RoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSByZWN0YW5nbGU6IFJlY3RhbmdsZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZWN0YW5nbGU6IFJlY3RhbmdsZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpe1xyXG4gICAgICAgIHN1cGVyKHJlY3RhbmdsZSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZSA9IHJlY3RhbmdsZTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFgnLCAoKSA9PiBwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBZJywgKCkgPT4gKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMubGVuZ3RoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ0xlbmd0aCcsICgpID0+IHBhcnNlSW50KHRoaXMubGVuZ3RoU2xpZGVyLnZhbHVlKSwgMTUwLDQ1MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpfSlcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdXaWR0aCcsICgpID0+IHBhcnNlSW50KHRoaXMud2lkdGhTbGlkZXIudmFsdWUpLCAxNTAsNDUwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMud2lkdGhTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVXaWR0aChwYXJzZUludCh0aGlzLndpZHRoU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsICgpID0+IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSwgLTM2MCwgMzYwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUm90YXRpb24ocGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpKX0pXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NYKG5ld1Bvc1g6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS50cmFuc2xhdGlvblswXSA9IG5ld1Bvc1g7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICAgICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS50cmFuc2xhdGlvblsxXSA9IG5ld1Bvc1k7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuZ3RoOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2NhbGVbMF0gPSBuZXdMZW5ndGgvMzAwO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlV2lkdGgobmV3V2lkdGg6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS5zY2FsZVsxXSA9IG5ld1dpZHRoLzMwMDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKG5ld1JvdGF0aW9uIDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLmFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQobmV3Um90YXRpb24pO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKFwicm90YXRpb246IFwiLCBuZXdSb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8NDsgaSsrKXtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ4OiBcIiwgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLngsIFwieTpcIix0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaV0ueSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lke1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInhhd2FsIDpcIiAsIHgpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInlhd2FsOiBcIiAsIHkpO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgY2VudGVyWCA9ICh0aGlzLnJlY3RhbmdsZS5pbml0aWFsUG9pbnRbMF0gKyB0aGlzLnJlY3RhbmdsZS5lbmRQb2ludFswXSkgLyAyO1xyXG4gICAgICAgICAgICBjb25zdCBjZW50ZXJZID0gKHRoaXMucmVjdGFuZ2xlLmluaXRpYWxQb2ludFsxXSArIHRoaXMucmVjdGFuZ2xlLmVuZFBvaW50WzFdKSAvIDI7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGxldCB0cmFuc2xhdGVkWCA9IHggLSBjZW50ZXJYO1xyXG4gICAgICAgICAgICBsZXQgdHJhbnNsYXRlZFkgPSB5IC0gY2VudGVyWTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgYW5nbGUgPSB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFuczsgLy8gSW52ZXJzZSByb3RhdGlvbiBhbmdsZVxyXG4gICAgICAgICAgICBjb25zdCBkeCA9IHRyYW5zbGF0ZWRYICogTWF0aC5jb3MoYW5nbGUpIC0gdHJhbnNsYXRlZFkgKiBNYXRoLnNpbihhbmdsZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGR5ID0gdHJhbnNsYXRlZFggKiBNYXRoLnNpbihhbmdsZSkgKyB0cmFuc2xhdGVkWSAqIE1hdGguY29zKGFuZ2xlKTtcclxuICAgICAgICBcclxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxYID0gZHggKyBjZW50ZXJYO1xyXG4gICAgICAgICAgICBjb25zdCBvcmlnaW5hbFkgPSBkeSArIGNlbnRlclk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBtb3ZlbWVudFggPSBvcmlnaW5hbFggLSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS54O1xyXG4gICAgICAgICAgICBjb25zdCBtb3ZlbWVudFkgPSBvcmlnaW5hbFkgLSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS55O1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcIng6XCIgLCBtb3ZlbWVudFgpO1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInk6XCIgLG1vdmVtZW50WSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpZHhdLnggKz0gbW92ZW1lbnRYO1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS55ICs9IG1vdmVtZW50WTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGFkamFjZW50VmVydGljZXMgPSBbMCwgMSwgMiwgM10uZmlsdGVyKGkgPT4gaSAhPT0gaWR4ICYmIGkgIT09IHRoaXMucmVjdGFuZ2xlLmZpbmRPcHBvc2l0ZShpZHgpKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50TGlzdCA9IHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdDtcclxuICAgICAgICAgICAgY29uc3QgY3dBZGphY2VudElkeCA9IHRoaXMucmVjdGFuZ2xlLmZpbmRDV0FkamFjZW50KGlkeCk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNjd0FkamFjZW50SWR4ID0gdGhpcy5yZWN0YW5nbGUuZmluZENDV0FkamFjZW50KGlkeCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZUlkeCA9IHRoaXMucmVjdGFuZ2xlLmZpbmRPcHBvc2l0ZShpZHgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3Bwb3NpdGVQb2ludFggPSBwb2ludExpc3Rbb3Bwb3NpdGVJZHhdLng7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlUG9pbnRZID0gcG9pbnRMaXN0W29wcG9zaXRlSWR4XS55O1xyXG5cclxuICAgICAgICAgICAgLy8gVG8gYXZvaWQgc3R1Y2tcclxuICAgICAgICAgICAgYWRqYWNlbnRWZXJ0aWNlcy5mb3JFYWNoKHZlcnRleElkeCA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmVydGV4SWR4ID09PSBjd0FkamFjZW50SWR4IHx8IHZlcnRleElkeCA9PT0gY2N3QWRqYWNlbnRJZHgpIHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCB2ZXJ0ZXhQb2ludCA9IHBvaW50TGlzdFt2ZXJ0ZXhJZHhdO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UG9pbnQueCA9PT0gb3Bwb3NpdGVQb2ludFggJiYgdmVydGV4UG9pbnQueSA9PT0gb3Bwb3NpdGVQb2ludFkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE1hdGguYWJzKG1vdmVtZW50WCkgPiBNYXRoLmFicyhtb3ZlbWVudFkpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC54ICs9IG1vdmVtZW50WDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleFBvaW50LnkgKz0gbW92ZW1lbnRZO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBvaW50LnggIT09IG9wcG9zaXRlUG9pbnRYKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC54ICs9IG1vdmVtZW50WDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UG9pbnQueSAhPT0gb3Bwb3NpdGVQb2ludFkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleFBvaW50LnkgKz0gbW92ZW1lbnRZO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY3VzdG9tVmVydGV4VG9vbGJhcigpOiB2b2lkIHt9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi4vLi4vLi4vQmFzZS9CYXNlU2hhcGUnO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSAnLi4vLi4vLi4vQmFzZS9Db2xvcic7XHJcbmltcG9ydCB7IGhleFRvUmdiLCByZ2JUb0hleCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuXHJcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHB1YmxpYyBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgc2hhcGU6IEJhc2VTaGFwZTtcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXJDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgcHVibGljIHZlcnRleENvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgcHVibGljIHZlcnRleFBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgc2VsZWN0ZWRWZXJ0ZXggPSAnMCc7XHJcblxyXG4gICAgcHVibGljIHZ0eFBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB2dHhQb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdnR4Q29sb3JQaWNrZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuXHJcbiAgICBwcml2YXRlIHNsaWRlckxpc3Q6IEhUTUxJbnB1dEVsZW1lbnRbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBnZXR0ZXJMaXN0OiAoKCkgPT4gbnVtYmVyKVtdID0gW107XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc2hhcGU6IEJhc2VTaGFwZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLnNoYXBlID0gc2hhcGU7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3ZlcnRleC1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3ZlcnRleC1waWNrZXInXHJcbiAgICAgICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNsaWRlcihcclxuICAgICAgICBsYWJlbDogc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlR2V0dGVyOiAoKSA9PiBudW1iZXIsXHJcbiAgICAgICAgbWluOiBudW1iZXIsXHJcbiAgICAgICAgbWF4OiBudW1iZXJcclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFiZWxFbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XHJcbiAgICAgICAgc2xpZGVyLm1pbiA9IG1pbi50b1N0cmluZygpO1xyXG4gICAgICAgIHNsaWRlci5tYXggPSBtYXgudG9TdHJpbmcoKTtcclxuICAgICAgICBzbGlkZXIudmFsdWUgPSB2YWx1ZUdldHRlcigpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlcik7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnNsaWRlckxpc3QucHVzaChzbGlkZXIpO1xyXG4gICAgICAgIHRoaXMuZ2V0dGVyTGlzdC5wdXNoKHZhbHVlR2V0dGVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcclxuICAgIH1cclxuXHJcbiAgICByZWdpc3RlclNsaWRlcihzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQsIGNiOiAoZTogRXZlbnQpID0+IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG5ld0NiID0gKGU6IEV2ZW50KSA9PiB7XHJcbiAgICAgICAgICAgIGNiKGUpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlcnMoc2xpZGVyKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHNsaWRlci5vbmNoYW5nZSA9IG5ld0NiO1xyXG4gICAgICAgIHNsaWRlci5vbmlucHV0ID0gbmV3Q2I7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZShuZXdTaGFwZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2xpZGVycyhpZ25vcmVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQpIHtcclxuICAgICAgICB0aGlzLnNsaWRlckxpc3QuZm9yRWFjaCgoc2xpZGVyLCBpZHgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlnbm9yZVNsaWRlciA9PT0gc2xpZGVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIHNsaWRlci52YWx1ZSA9IHRoaXMuZ2V0dGVyTGlzdFtpZHhdKCkudG9TdHJpbmcoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpIHtcclxuICAgICAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQodGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUpO1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdO1xyXG5cclxuICAgICAgICAgICAgdGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlID0gdmVydGV4LngudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdGhpcy52dHhQb3NZU2xpZGVyLnZhbHVlID0gdmVydGV4LnkudG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2xpZGVyVmVydGV4KFxyXG4gICAgICAgIGxhYmVsOiBzdHJpbmcsXHJcbiAgICAgICAgY3VycmVudExlbmd0aDogbnVtYmVyLFxyXG4gICAgICAgIG1pbjogbnVtYmVyLFxyXG4gICAgICAgIG1heDogbnVtYmVyXHJcbiAgICApOiBIVE1MSW5wdXRFbGVtZW50IHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9vbGJhci1zbGlkZXItY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGxhYmVsRWxtdC50ZXh0Q29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xyXG5cclxuICAgICAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgc2xpZGVyLnR5cGUgPSAncmFuZ2UnO1xyXG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcclxuICAgICAgICBzbGlkZXIubWF4ID0gbWF4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgc2xpZGVyLnZhbHVlID0gY3VycmVudExlbmd0aC50b1N0cmluZygpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbGlkZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2xpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZUNvbG9yUGlja2VyVmVydGV4KGxhYmVsOiBzdHJpbmcsIGhleDogc3RyaW5nKTogSFRNTElucHV0RWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxFbG10KTtcclxuXHJcbiAgICAgICAgY29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgY29sb3JQaWNrZXIudHlwZSA9ICdjb2xvcic7XHJcbiAgICAgICAgY29sb3JQaWNrZXIudmFsdWUgPSBoZXg7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbG9yUGlja2VyKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGNvbG9yUGlja2VyO1xyXG4gICAgfVxyXG5cclxuICAgIGRyYXdWZXJ0ZXhUb29sYmFyKCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKTtcclxuXHJcbiAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQodGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUpO1xyXG4gICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF07XHJcblxyXG4gICAgICAgIHRoaXMudnR4UG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyVmVydGV4KFxyXG4gICAgICAgICAgICAnUG9zIFgnLFxyXG4gICAgICAgICAgICB2ZXJ0ZXgueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMud2lkdGhcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcclxuICAgICAgICAgICAgJ1BvcyBZJyxcclxuICAgICAgICAgICAgdmVydGV4LnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmhlaWdodFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZVNsaWRlciA9ICgpID0+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZlcnRleChcclxuICAgICAgICAgICAgICAgICAgICBpZHgsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlKSxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh0aGlzLnZ0eFBvc1lTbGlkZXIudmFsdWUpXHJcbiAgICAgICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudnR4Q29sb3JQaWNrZXIgPSB0aGlzLmNyZWF0ZUNvbG9yUGlja2VyVmVydGV4KFxyXG4gICAgICAgICAgICAnQ29sb3InLFxyXG4gICAgICAgICAgICByZ2JUb0hleCh2ZXJ0ZXguYy5yICogMjU1LCB2ZXJ0ZXguYy5nICogMjU1LCB2ZXJ0ZXguYy5iICogMjU1KVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIGNvbnN0IHVwZGF0ZUNvbG9yID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB7IHIsIGcsIGIgfSA9IGhleFRvUmdiKFxyXG4gICAgICAgICAgICAgICAgdGhpcy52dHhDb2xvclBpY2tlcj8udmFsdWUgPz8gJyMwMDAwMDAnXHJcbiAgICAgICAgICAgICkgPz8geyByOiAwLCBnOiAwLCBiOiAwIH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgdGhpcy5zaGFwZS5wb2ludExpc3RbaWR4XS5jID0gY29sb3I7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zaGFwZSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnZ0eFBvc1hTbGlkZXIsIHVwZGF0ZVNsaWRlcik7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnZ0eFBvc1lTbGlkZXIsIHVwZGF0ZVNsaWRlcik7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnZ0eENvbG9yUGlja2VyLCB1cGRhdGVDb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMuY3VzdG9tVmVydGV4VG9vbGJhcigpO1xyXG4gICAgfVxyXG5cclxuICAgIGluaXRWZXJ0ZXhUb29sYmFyKCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLnZlcnRleFBpY2tlci5maXJzdENoaWxkKVxyXG4gICAgICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleFBpY2tlci5maXJzdENoaWxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5zaGFwZS5wb2ludExpc3QuZm9yRWFjaCgoXywgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBpZHgudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgb3B0aW9uLmxhYmVsID0gYFZlcnRleCAke2lkeH1gO1xyXG4gICAgICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5hcHBlbmRDaGlsZChvcHRpb24pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci52YWx1ZSA9ICcwJztcclxuICAgICAgICB0aGlzLnNlbGVjdGVkVmVydGV4ID0gdGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWU7XHJcbiAgICAgICAgdGhpcy5kcmF3VmVydGV4VG9vbGJhcigpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5vbmNoYW5nZSA9ICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZFZlcnRleCA9IHRoaXMudmVydGV4UGlja2VyLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmRyYXdWZXJ0ZXhUb29sYmFyKCk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBhYnN0cmFjdCBjdXN0b21WZXJ0ZXhUb29sYmFyKCk6IHZvaWQ7XHJcbiAgICBhYnN0cmFjdCB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZDtcclxufVxyXG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9TcXVhcmVcIjtcclxuaW1wb3J0IHsgZGVnVG9SYWQgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gXCIuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXJcIjtcclxuXHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzaXplU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAvLyBwcml2YXRlIHBvaW50U2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgc3F1YXJlOiBTcXVhcmU7XHJcblxyXG4gICAgY29uc3RydWN0b3Ioc3F1YXJlOiBTcXVhcmUsIGFwcENhbnZhczogQXBwQ2FudmFzKXtcclxuICAgICAgICBzdXBlcihzcXVhcmUsIGFwcENhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5zcXVhcmUgPSBzcXVhcmU7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBYJywgKCkgPT4gcGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSwtMC41KmFwcENhbnZhcy53aWR0aCwwLjUqYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWScsICgpID0+IChwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKSwtMC41KmFwcENhbnZhcy53aWR0aCwwLjUqYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnNpemVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignU2l6ZScsICgpID0+IHBhcnNlSW50KHRoaXMuc2l6ZVNsaWRlci52YWx1ZSksIDE1MCw0NTApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5zaXplU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlU2l6ZShwYXJzZUludCh0aGlzLnNpemVTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgKCkgPT4gcGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpLCAtMzYwLCAzNjApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5yb3RhdGVTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVSb3RhdGlvbihwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSkpfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NYKG5ld1Bvc1g6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS50cmFuc2xhdGlvblswXSA9IG5ld1Bvc1g7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS50cmFuc2xhdGlvblsxXSA9IG5ld1Bvc1k7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTaXplKG5ld1NpemU6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS5zY2FsZVswXSA9IG5ld1NpemUvMzAwO1xyXG4gICAgICAgIHRoaXMuc3F1YXJlLnNjYWxlWzFdID0gbmV3U2l6ZS8zMDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3RhdGlvbiA6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKG5ld1JvdGF0aW9uKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0aW5nXCIpO1xyXG5cclxuICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnNxdWFyZS5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3RbaWR4XTtcclxuICAgICAgICAvLyBjb25zdCBvcHBvc2l0ZSA9IChpZHggKyAyKSAlIDRcclxuICAgICAgICAvLyBjb25zdCBvcmlnaW5YID0gdGhpcy5zcXVhcmUucG9pbnRMaXN0W29wcG9zaXRlXS54O1xyXG4gICAgICAgIC8vIGNvbnN0IG9yaWdpblkgPSB0aGlzLnNxdWFyZS5wb2ludExpc3Rbb3Bwb3NpdGVdLnk7XHJcbiAgICAgICAgXHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHRyYW5zbGF0ZVRvQ2VudGVyID0gbTMudHJhbnNsYXRpb24oLW9yaWdpblgsIC1vcmlnaW5ZKTtcclxuICAgICAgICAvLyBsZXQgc2NhbGluZyA9IG0zLnNjYWxpbmcoeCwgeSk7XHJcbiAgICAgICAgLy8gbGV0IHRyYW5zbGF0ZUJhY2sgPSBtMy50cmFuc2xhdGlvbihvcmlnaW5YLCBvcmlnaW5ZKTtcclxuXHJcbiAgICAgICAgLy8gbGV0IHJlc1NjYWxlID0gbTMubXVsdGlwbHkoc2NhbGluZywgdHJhbnNsYXRlVG9DZW50ZXIpO1xyXG4gICAgICAgIC8vIGxldCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzU2NhbGUpO1xyXG4gICAgICAgIC8vIGNvbnN0IHJlc1ZlcnRleFVwZGF0ZSA9IG0zLm11bHRpcGx5KHJlc0JhY2ssIHRoaXMuc3F1YXJlLnRyYW5zZm9ybWF0aW9uTWF0cml4KVxyXG4gICAgICAgIC8vIHRoaXMuc3F1YXJlLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gcmVzVmVydGV4VXBkYXRlO1xyXG5cclxuICAgICAgICAvLyB0aGlzLnNxdWFyZS5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cclxuICAgICAgICB2ZXJ0ZXgueCA9IHg7XHJcbiAgICAgICAgdmVydGV4LnkgPSB5O1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBjdXN0b21WZXJ0ZXhUb29sYmFyKCk6IHZvaWQge31cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IENWUG9seWdvbiBmcm9tICcuLi8uLi9TaGFwZXMvQ1ZQb2x5Z29uJztcclxuaW1wb3J0IEZhblBvbHlnb24gZnJvbSAnLi4vLi4vU2hhcGVzL0ZhblBvbHlnb24nO1xyXG5pbXBvcnQgTGluZSBmcm9tICcuLi8uLi9TaGFwZXMvTGluZSc7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSAnLi4vLi4vU2hhcGVzL1NxdWFyZSc7XHJcbmltcG9ydCBDYW52YXNDb250cm9sbGVyIGZyb20gJy4uL01ha2VyL0NhbnZhc0NvbnRyb2xsZXInO1xyXG5pbXBvcnQgQ1ZQb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9DVlBvbHlnb25Ub29sYmFyQ29udHJvbGxlcic7XHJcbmltcG9ydCBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9GYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgTGluZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyJztcclxuaW1wb3J0IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZS9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcclxuaW1wb3J0IFNxdWFyZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvU3F1YXJlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGl0ZW1QaWNrZXI6IEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZElkOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXJDb250cm9sbGVyOiBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNhbnZhc0NvbnRyb2xsZXI6IENhbnZhc0NvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMsIGNhbnZhc0NvbnRyb2xsZXI6IENhbnZhc0NvbnRyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgICAgICB0aGlzLmFwcENhbnZhcy51cGRhdGVUb29sYmFyID0gdGhpcy51cGRhdGVTaGFwZUxpc3QuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIgPSBjYW52YXNDb250cm9sbGVyO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3Rvb2xiYXItY29udGFpbmVyJ1xyXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndG9vbGJhci1pdGVtLXBpY2tlcidcclxuICAgICAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSWQgPSB0aGlzLml0ZW1QaWNrZXIudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5hcHBDYW52YXMuc2hhcGVzW3RoaXMuaXRlbVBpY2tlci52YWx1ZV07XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNoYXBlIGluc3RhbmNlb2YgTGluZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBMaW5lVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgTGluZSwgYXBwQ2FudmFzKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSBpbnN0YW5jZW9mIFJlY3RhbmdsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBSZWN0YW5nbGUsIGFwcENhbnZhcylcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSBpbnN0YW5jZW9mIFNxdWFyZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBTcXVhcmVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBTcXVhcmUsIGFwcENhbnZhcylcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSBpbnN0YW5jZW9mIEZhblBvbHlnb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRyb2xsZXIgPSBuZXcgRmFuUG9seWdvblRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIEZhblBvbHlnb24sIGFwcENhbnZhcywgdGhpcy5jYW52YXNDb250cm9sbGVyKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgQ1ZQb2x5Z29uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IENWUG9seWdvblRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIENWUG9seWdvbiwgYXBwQ2FudmFzLCB0aGlzLmNhbnZhc0NvbnRyb2xsZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlTGlzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNoYXBlTGlzdCgpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVBpY2tlci5yZW1vdmVDaGlsZCh0aGlzLml0ZW1QaWNrZXIuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBwbGFjZWhvbGRlci50ZXh0ID0gJ0Nob29zZSBhbiBvYmplY3QnO1xyXG4gICAgICAgIHBsYWNlaG9sZGVyLnZhbHVlID0gJyc7XHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFwcENhbnZhcy5zaGFwZXMpLmZvckVhY2goKHNoYXBlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICAgIGNoaWxkLnRleHQgPSBzaGFwZS5pZDtcclxuICAgICAgICAgICAgY2hpbGQudmFsdWUgPSBzaGFwZS5pZDtcclxuICAgICAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLnZhbHVlID0gdGhpcy5zZWxlY3RlZElkO1xyXG5cclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuYXBwQ2FudmFzLnNoYXBlcykuaW5jbHVkZXModGhpcy5zZWxlY3RlZElkKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclRvb2xiYXJFbG10KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYXJUb29sYmFyRWxtdCgpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnRvb2xiYXJDb250YWluZXIuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi9CYXNlL0Jhc2VTaGFwZSc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IFZlcnRleCBmcm9tICcuLi9CYXNlL1ZlcnRleCc7XHJcbmltcG9ydCBHcmFoYW1TY2FuIGZyb20gJy4uL2NvbnZleEh1bGxVdGlscyc7XHJcbmltcG9ydCB7IGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1ZQb2x5Z29uIGV4dGVuZHMgQmFzZVNoYXBlIHtcclxuICAgIHByaXZhdGUgb3JpZ2luOiBWZXJ0ZXg7XHJcbiAgICBsZW5MaXN0OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBnczogR3JhaGFtU2NhbiA9IG5ldyBHcmFoYW1TY2FuKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB2ZXJ0aWNlczogVmVydGV4W10pIHtcclxuICAgICAgICBzdXBlcig2LCBpZCwgY29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHZlcnRpY2VzWzBdO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godmVydGljZXNbMF0sIHZlcnRpY2VzWzFdKTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IG5ldyBWZXJ0ZXgoXHJcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS54ICsgdmVydGljZXNbMF0ueCkgLyAyLFxyXG4gICAgICAgICAgICAodmVydGljZXNbMV0ueSArIHZlcnRpY2VzWzBdLnkpIC8gMixcclxuICAgICAgICAgICAgbmV3IENvbG9yKDAsIDAsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdmVydGljZXMuZm9yRWFjaCgodnR4LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlkeCA8IDIpIHJldHVybjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaGFwZSBzZXRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KHZ0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkVmVydGV4KHZlcnRleDogVmVydGV4KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2ZXJ0ZXgpO1xyXG4gICAgICAgIHRoaXMucmVjYWxjKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbW92ZVZlcnRleChpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50TGlzdC5sZW5ndGggPD0gMykge1xyXG4gICAgICAgICAgICBhbGVydChcIkNhbm5vdCByZW1vdmUgdmVydGV4IGFueSBmdXJ0aGVyXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5wb2ludExpc3RbMF07XHJcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWNhbGMoKSB7XHJcbiAgICAgICAgdGhpcy5ncy5zZXRQb2ludHModGhpcy5wb2ludExpc3QpO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0ID0gdGhpcy5ncy5nZXRIdWxsKCk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLnBvaW50TGlzdFswXTtcclxuXHJcbiAgICAgICAgbGV0IGFuZ2xlcyA9IHRoaXMucG9pbnRMaXN0XHJcbiAgICAgICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gaWR4ID4gMClcclxuICAgICAgICAgICAgLm1hcCgodnR4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZ0eCxcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogTWF0aC5hdGFuMihcclxuICAgICAgICAgICAgICAgICAgICAgICAgdnR4LnkgLSB0aGlzLm9yaWdpbi55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2dHgueCAtIHRoaXMub3JpZ2luLnhcclxuICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFuZ2xlcy5zb3J0KChhLCBiKSA9PiBhLmFuZ2xlIC0gYi5hbmdsZSk7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QgPSBhbmdsZXMubWFwKChpdGVtKSA9PiBpdGVtLnZ0eCk7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QudW5zaGlmdCh0aGlzLm9yaWdpbik7XHJcblxyXG4gICAgICAgIHRoaXMuY2VudGVyLnggPVxyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5yZWR1Y2UoKHRvdGFsLCB2dHgpID0+IHRvdGFsICsgdnR4LngsIDApIC9cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2VudGVyLnkgPVxyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5yZWR1Y2UoKHRvdGFsLCB2dHgpID0+IHRvdGFsICsgdnR4LnksIDApIC9cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMubGVuTGlzdCA9IHRoaXMucG9pbnRMaXN0Lm1hcCgodnR4KSA9PlxyXG4gICAgICAgICAgICBldWNsaWRlYW5EaXN0YW5jZVZ0eCh2dHgsIHRoaXMuY2VudGVyKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi9CYXNlL0Jhc2VTaGFwZSc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IFZlcnRleCBmcm9tICcuLi9CYXNlL1ZlcnRleCc7XHJcbmltcG9ydCB7IGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFuUG9seWdvbiBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICBwcml2YXRlIG9yaWdpbjogVmVydGV4O1xyXG4gICAgbGVuTGlzdDogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHZlcnRpY2VzOiBWZXJ0ZXhbXSkge1xyXG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdmVydGljZXNbMF07XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0pO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlcnRleChcclxuICAgICAgICAgICAgKHZlcnRpY2VzWzFdLnggKyB2ZXJ0aWNlc1swXS54KSAvIDIsXHJcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS55ICsgdmVydGljZXNbMF0ueSkgLyAyLFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMCwgMCwgMClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5mb3JFYWNoKCh2dHgsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaWR4IDwgMikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSA2O1xyXG4gICAgICAgICAgICB0aGlzLmFkZFZlcnRleCh2dHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFZlcnRleCh2ZXJ0ZXg6IFZlcnRleCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godmVydGV4KTtcclxuICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSA2O1xyXG4gICAgICAgIHRoaXMucmVjYWxjKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbW92ZVZlcnRleChpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50TGlzdC5sZW5ndGggPD0gMikge1xyXG4gICAgICAgICAgICBhbGVydChcIkNhbm5vdCByZW1vdmUgdmVydGV4IGFueSBmdXJ0aGVyXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5wb2ludExpc3RbMF07XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRMaXN0Lmxlbmd0aCA9PSAyKVxyXG4gICAgICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSAxO1xyXG4gICAgICAgIHRoaXMucmVjYWxjKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVjYWxjKCkge1xyXG4gICAgICAgIGxldCBhbmdsZXMgPSB0aGlzLnBvaW50TGlzdFxyXG4gICAgICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGlkeCA+IDApXHJcbiAgICAgICAgICAgIC5tYXAoKHZ0eCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB2dHgsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IE1hdGguYXRhbjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZ0eC55IC0gdGhpcy5vcmlnaW4ueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdnR4LnggLSB0aGlzLm9yaWdpbi54XHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhbmdsZXMuc29ydCgoYSwgYikgPT4gYS5hbmdsZSAtIGIuYW5nbGUpO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0ID0gYW5nbGVzLm1hcCgoaXRlbSkgPT4gaXRlbS52dHgpO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnVuc2hpZnQodGhpcy5vcmlnaW4pO1xyXG5cclxuICAgICAgICB0aGlzLmNlbnRlci54ID1cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QucmVkdWNlKCh0b3RhbCwgdnR4KSA9PiB0b3RhbCArIHZ0eC54LCAwKSAvXHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0Lmxlbmd0aDtcclxuICAgICAgICB0aGlzLmNlbnRlci55ID1cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QucmVkdWNlKCh0b3RhbCwgdnR4KSA9PiB0b3RhbCArIHZ0eC55LCAwKSAvXHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0Lmxlbmd0aDtcclxuICAgICAgICB0aGlzLmxlbkxpc3QgPSB0aGlzLnBvaW50TGlzdC5tYXAoKHZ0eCkgPT5cclxuICAgICAgICAgICAgZXVjbGlkZWFuRGlzdGFuY2VWdHgodnR4LCB0aGlzLmNlbnRlcilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xyXG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgZW5kWDogbnVtYmVyLCBlbmRZOiBudW1iZXIsIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoc3RhcnRYICsgZW5kWCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoc3RhcnRZICsgZW5kWSkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZXJ0ZXgoY2VudGVyWCwgY2VudGVyWSwgY29sb3IpO1xyXG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IG5ldyBWZXJ0ZXgoc3RhcnRYLCBzdGFydFksIGNvbG9yKTtcclxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgVmVydGV4KGVuZFgsIGVuZFksIGNvbG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBldWNsaWRlYW5EaXN0YW5jZVZ0eChcclxuICAgICAgICAgICAgb3JpZ2luLFxyXG4gICAgICAgICAgICBlbmRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKG9yaWdpbiwgZW5kKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdCA9IHRoaXMucG9pbnRMaXN0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XHJcbmltcG9ydCB7IG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBCYXNlU2hhcGUge1xyXG4gICAgXHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBpbml0aWFsUG9pbnQ6IG51bWJlcltdO1xyXG4gICAgZW5kUG9pbnQ6IG51bWJlcltdO1xyXG4gICAgdGFyZ2V0UG9pbnQ6IG51bWJlcltdO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgZW5kWDogbnVtYmVyLCBlbmRZOiBudW1iZXIsIGFuZ2xlSW5SYWRpYW5zOiBudW1iZXIsIHNjYWxlWDogbnVtYmVyID0gMSwgc2NhbGVZOiBudW1iZXIgPSAxLCB0cmFuc2Zvcm1hdGlvbjogbnVtYmVyW10gPSBtMy5pZGVudGl0eSgpKSB7XHJcbiAgICAgICAgc3VwZXIoNSwgaWQsIGNvbG9yKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB4MSA9IHN0YXJ0WDtcclxuICAgICAgICBjb25zdCB5MSA9IHN0YXJ0WTtcclxuICAgICAgICBjb25zdCB4MiA9IGVuZFg7XHJcbiAgICAgICAgY29uc3QgeTIgPSBzdGFydFk7XHJcbiAgICAgICAgY29uc3QgeDMgPSBzdGFydFg7XHJcbiAgICAgICAgY29uc3QgeTMgPSBlbmRZO1xyXG4gICAgICAgIGNvbnN0IHg0ID0gZW5kWDtcclxuICAgICAgICBjb25zdCB5NCA9IGVuZFk7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm1hdGlvbjtcclxuXHJcbiAgICAgICAgdGhpcy5hbmdsZUluUmFkaWFucyA9IGFuZ2xlSW5SYWRpYW5zO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBbc2NhbGVYLCBzY2FsZVldO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFBvaW50ID0gW3N0YXJ0WCwgc3RhcnRZLCAxXTtcclxuICAgICAgICB0aGlzLmVuZFBvaW50ID0gW2VuZFgsIGVuZFksIDFdO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0UG9pbnQgPSBbMCwwLCAxXTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHgyLXgxO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB5My15MTtcclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh4MSArIHg0KSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9ICh5MSArIHk0KSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XHJcblxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2gobmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKSwgbmV3IFZlcnRleCh4MiwgeTIsIGNvbG9yKSwgbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKSwgbmV3IFZlcnRleCh4NCwgeTQsIGNvbG9yKSk7XHJcbiAgICAgICAgdGhpcy5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3QgPSB0aGlzLnBvaW50TGlzdDtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDA6ICR7eDF9LCAke3kxfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBwb2ludCAxOiAke3gyfSwgJHt5Mn1gKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgcG9pbnQgMjogJHt4M30sICR7eTN9YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDM6ICR7eDR9LCAke3k0fWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBjZW50ZXI6ICR7Y2VudGVyLnh9LCAke2NlbnRlci55fWApO1xyXG4gICAgfVxyXG5cclxuICAgIG92ZXJyaWRlIHNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCl7XHJcbiAgICAgICAgc3VwZXIuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgcG9pbnQgPSBbdGhpcy5wb2ludExpc3RbaWR4XS54LCB0aGlzLnBvaW50TGlzdFtpZHhdLnksIDFdO1xyXG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBtMy5tdWx0aXBseTN4MSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLmVuZFBvaW50KVxyXG4gICAgICAgIHRoaXMuaW5pdGlhbFBvaW50ID0gbTMubXVsdGlwbHkzeDEodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5pbml0aWFsUG9pbnQpXHJcbiAgICBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZENDV0FkamFjZW50KHBvaW50SWR4OiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IGNjd0FkamFjZW50OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0geyAwOiAyLCAxOiAwLCAyOiAzLCAzOiAxIH07XHJcbiAgICAgICAgcmV0dXJuIGNjd0FkamFjZW50W3BvaW50SWR4XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZENXQWRqYWNlbnQocG9pbnRJZHg6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3QgY3dBZGphY2VudDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHsgMDogMSwgMTogMywgMjogMCwgMzogMiB9O1xyXG4gICAgICAgIHJldHVybiBjd0FkamFjZW50W3BvaW50SWR4XTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZmluZE9wcG9zaXRlKHBvaW50SWR4OiBudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IG9wcG9zaXRlOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0geyAwOiAzLCAxOiAyLCAyOiAxLCAzOiAwIH07XHJcbiAgICAgICAgcmV0dXJuIG9wcG9zaXRlW3BvaW50SWR4XTtcclxuICAgIH1cclxuXHJcblxyXG4gICAgLy8gcHVibGljIG92ZXJyaWRlIHNldFZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpOiB2b2lkIHtcclxuICAgICAgICAvLyAvLyBURVNUXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJpbml0aWFsXCIsIHRoaXMuaW5pdGlhbFBvaW50KTtcclxuICAgICAgICAvLyBjb25zdCB0YXJnZXRQb2ludFggPSB0aGlzLmVuZFBvaW50WzBdICsgdGhpcy50YXJnZXRQb2ludFswXTtcclxuICAgICAgICAvLyBjb25zdCB0YXJnZXRQb2ludFkgPSB0aGlzLmVuZFBvaW50WzFdICsgdGhpcy50YXJnZXRQb2ludFsxXTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVuZFBvaW50IFg6IFwiLCB0aGlzLmVuZFBvaW50WzBdKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVuZFBvaW50IFk6IFwiLCB0aGlzLmVuZFBvaW50WzFdKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRhcmdldFg6IFwiLCB0YXJnZXRQb2ludFgpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGFyZ2V0WTogXCIsIHRhcmdldFBvaW50WSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHRyYW5zbGF0ZVRvSW5pdGlhbCA9IG0zLnRyYW5zbGF0aW9uKC10aGlzLmluaXRpYWxQb2ludFswXSwgLXRoaXMuaW5pdGlhbFBvaW50WzFdKTtcclxuICAgICAgICAvLyBjb25zdCByb3RhdGVSZXZlcnQgPSBtMy5yb3RhdGlvbigtdGhpcy5hbmdsZUluUmFkaWFucyk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHJlc1JvdGF0ZSA9IG0zLm11bHRpcGx5KHJvdGF0ZVJldmVydCwgdHJhbnNsYXRlVG9Jbml0aWFsKVxyXG4gICAgICAgIC8vIC8vIGNvbnN0IHJlc1RyYW5zQmFjayA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZUJhY2ssIHJlc1JvdGF0ZSlcclxuXHJcbiAgICAgICAgLy8gY29uc3Qgcm90YXRlZFRhcmdldD0gbTMubXVsdGlwbHkzeDEocmVzUm90YXRlLCBbdGFyZ2V0UG9pbnRYLCB0YXJnZXRQb2ludFksIDFdKTtcclxuICAgICAgICAvLyBjb25zdCByb3RhdGVkRW5kUG9pbnQ9bTMubXVsdGlwbHkzeDEocmVzUm90YXRlLCB0aGlzLmVuZFBvaW50KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJvdGF0ZWQgdGFyZ2V0XCIsIHJvdGF0ZWRUYXJnZXQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm90YXRlZCBlbmRwb2ludFwiLCByb3RhdGVkRW5kUG9pbnQpO1xyXG4gICAgICAgIC8vIC8vIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5tdWx0aXBseShyZXNSb3RhdGUsIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgpXHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY29uc3QgY3VycmVudExlbmd0aCA9IHJvdGF0ZWRFbmRQb2ludFswXTtcclxuICAgICAgICAvLyBjb25zdCBjdXJyZW50V2lkdGg9IHJvdGF0ZWRFbmRQb2ludFsxXTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgdXBkYXRlZExlbmd0aCA9IGN1cnJlbnRMZW5ndGggKyByb3RhdGVkVGFyZ2V0WzBdIC0gcm90YXRlZEVuZFBvaW50WzBdO1xyXG4gICAgICAgIC8vIGNvbnN0IHVwZGF0ZWRXaWR0aCA9IGN1cnJlbnRXaWR0aCArIHJvdGF0ZWRUYXJnZXRbMV0gLSByb3RhdGVkRW5kUG9pbnRbMV07XHJcblxyXG5cclxuICAgICAgICAvLyBjb25zdCBzY2FsZUxlbmd0aCA9IHVwZGF0ZWRMZW5ndGggLyBjdXJyZW50TGVuZ3RoO1xyXG4gICAgICAgIC8vIGNvbnN0IHNjYWxlV2lkdGggPSB1cGRhdGVkV2lkdGggLyBjdXJyZW50V2lkdGg7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJzY2FsZSBsZW5ndGg6IFwiLCBzY2FsZUxlbmd0aCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJzY2FsZSB3aWR0aDogXCIsIHNjYWxlV2lkdGgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnN0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHNjYWxlTGVuZ3RoLCBzY2FsZVdpZHRoKTtcclxuICAgICAgICAvLyBjb25zdCByb3RhdGVCYWNrID0gbTMucm90YXRpb24odGhpcy5hbmdsZUluUmFkaWFucyk7XHJcbiAgICAgICAgLy8gY29uc3QgdHJhbnNsYXRlQmFjayA9IG0zLnRyYW5zbGF0aW9uKHRoaXMuaW5pdGlhbFBvaW50WzBdLCB0aGlzLmluaXRpYWxQb2ludFsxXSk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHJlc1NjYWxlID0gbTMubXVsdGlwbHkocm90YXRlQmFjaywgc2NhbGluZyk7XHJcbiAgICAgICAgLy8gY29uc3QgcmVzQmFjayA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZUJhY2ssIHJlc1NjYWxlKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgdmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMubXVsdGlwbHkocmVzQmFjaywgcmVzUm90YXRlKTtcclxuICAgICAgICAvLyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMubXVsdGlwbHkodmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcclxuICAgICAgICBcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlczogXCIsIG0zLm11bHRpcGx5M3gxKHZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5pbml0aWFsUG9pbnQpKVxyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHNldFRyYW5zbGF0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XHJcbiAgICAvLyAgICAgdGhpcy50cmFuc2xhdGlvbiA9IFt4LCB5XTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBzZXRSb3RhdGlvbihhbmdsZUluRGVncmVlczogbnVtYmVyKSB7XHJcbiAgICAvLyAgICAgdGhpcy5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKGFuZ2xlSW5EZWdyZWVzKTtcclxuICAgIC8vIH1cclxuXHJcbiAgICAvLyBzZXRTY2FsZShzY2FsZVg6IG51bWJlciwgc2NhbGVZOiBudW1iZXIpIHtcclxuICAgIC8vICAgICB0aGlzLnNjYWxlID0gW3NjYWxlWCwgc2NhbGVZXTtcclxuICAgIC8vIH1cclxufVxyXG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcclxuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHggfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZSBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICB2MSA6IFZlcnRleDtcclxuICAgIHYyIDogVmVydGV4O1xyXG4gICAgdjMgOiBWZXJ0ZXg7XHJcbiAgICB2NCA6IFZlcnRleDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIHg0OiBudW1iZXIsIHk0OiBudW1iZXIsIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoeDEgKyB4MykgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoeTEgKyB5MykgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZXJ0ZXgoY2VudGVyWCwgY2VudGVyWSwgY29sb3IpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHN1cGVyKDYsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMudjEgPSBuZXcgVmVydGV4KHgxLCB5MSwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMudjIgPSBuZXcgVmVydGV4KHgyLCB5MiwgY29sb3IpO1xyXG4gICAgICAgIHRoaXMudjMgPSBuZXcgVmVydGV4KHgzLCB5MywgY29sb3IpO1xyXG4gICAgICAgIHRoaXMudjQgPSBuZXcgVmVydGV4KHg0LCB5NCwgY29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKHRoaXMudjEsIHRoaXMudjIsIHRoaXMudjMsIHRoaXMudjQpO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0ID0gdGhpcy5wb2ludExpc3Q7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IFZlcnRleCBmcm9tIFwiLi9CYXNlL1ZlcnRleFwiO1xyXG5cclxuY29uc3QgUkVNT1ZFRCA9IC0xO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhaGFtU2NhbiB7XHJcbiAgICBwcml2YXRlIHBvaW50czogVmVydGV4W10gPSBbXTtcclxuXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IFtdO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFBvaW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wb2ludHM7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0UG9pbnRzKHBvaW50czogVmVydGV4W10pIHtcclxuICAgICAgICB0aGlzLnBvaW50cyA9IHBvaW50cy5zbGljZSgpOyBcclxuICAgIH1cclxuXHJcbiAgICBhZGRQb2ludChwb2ludDogVmVydGV4KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludHMucHVzaChwb2ludCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0SHVsbCgpIHtcclxuICAgICAgICBjb25zdCBwaXZvdCA9IHRoaXMucHJlcGFyZVBpdm90UG9pbnQoKTtcclxuXHJcbiAgICAgICAgbGV0IGluZGV4ZXMgPSBBcnJheS5mcm9tKHRoaXMucG9pbnRzLCAocG9pbnQsIGkpID0+IGkpO1xyXG4gICAgICAgIGNvbnN0IGFuZ2xlcyA9IEFycmF5LmZyb20odGhpcy5wb2ludHMsIChwb2ludCkgPT4gdGhpcy5nZXRBbmdsZShwaXZvdCwgcG9pbnQpKTtcclxuICAgICAgICBjb25zdCBkaXN0YW5jZXMgPSBBcnJheS5mcm9tKHRoaXMucG9pbnRzLCAocG9pbnQpID0+IHRoaXMuZXVjbGlkZWFuRGlzdGFuY2VTcXVhcmVkKHBpdm90LCBwb2ludCkpO1xyXG5cclxuICAgICAgICBpbmRleGVzLnNvcnQoKGksIGopID0+IHtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGVBID0gYW5nbGVzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZUIgPSBhbmdsZXNbal07XHJcbiAgICAgICAgICAgIGlmIChhbmdsZUEgPT09IGFuZ2xlQikge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2VBID0gZGlzdGFuY2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2VCID0gZGlzdGFuY2VzW2pdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGRpc3RhbmNlQSAtIGRpc3RhbmNlQjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYW5nbGVBIC0gYW5nbGVCO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGluZGV4ZXMubGVuZ3RoIC0gMTsgaSsrKSB7XHJcbiAgICAgICAgICAgIGlmIChhbmdsZXNbaW5kZXhlc1tpXV0gPT09IGFuZ2xlc1tpbmRleGVzW2kgKyAxXV0pIHsgXHJcbiAgICAgICAgICAgICAgICBpbmRleGVzW2ldID0gUkVNT1ZFRDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgaHVsbCA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kZXhlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGluZGV4ZXNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNbaW5kZXhdO1xyXG5cclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSBSRU1PVkVEKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaHVsbC5sZW5ndGggPCAzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaHVsbC5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2hlY2tPcmllbnRhdGlvbihodWxsW2h1bGwubGVuZ3RoIC0gMl0sIGh1bGxbaHVsbC5sZW5ndGggLSAxXSwgcG9pbnQpID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBodWxsLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBodWxsLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gaHVsbC5sZW5ndGggPCAzID8gW10gOiBodWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGNoZWNrT3JpZW50YXRpb24ocDE6IFZlcnRleCwgcDI6IFZlcnRleCwgcDM6IFZlcnRleCkge1xyXG4gICAgICAgIHJldHVybiAocDIueSAtIHAxLnkpICogKHAzLnggLSBwMi54KSAtIChwMy55IC0gcDIueSkgKiAocDIueCAtIHAxLngpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEFuZ2xlKGE6IFZlcnRleCwgYjogVmVydGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIoYi55IC0gYS55LCBiLnggLSBhLngpO1xyXG4gICAgfVxyXG5cclxuICAgIGV1Y2xpZGVhbkRpc3RhbmNlU3F1YXJlZChwMTogVmVydGV4LCBwMjogVmVydGV4KSB7XHJcbiAgICAgICAgY29uc3QgYSA9IHAyLnggLSBwMS54O1xyXG4gICAgICAgIGNvbnN0IGIgPSBwMi55IC0gcDEueTtcclxuICAgICAgICByZXR1cm4gYSAqIGEgKyBiICogYjtcclxuICAgIH1cclxuXHJcbiAgICBwcmVwYXJlUGl2b3RQb2ludCgpIHtcclxuICAgICAgICBsZXQgcGl2b3QgPSB0aGlzLnBvaW50c1swXTtcclxuICAgICAgICBsZXQgcGl2b3RJbmRleCA9IDA7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCB0aGlzLnBvaW50cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzW2ldO1xyXG4gICAgICAgICAgICBpZiAocG9pbnQueSA8IHBpdm90LnkgfHwgcG9pbnQueSA9PT0gcGl2b3QueSAmJiBwb2ludC54IDwgcGl2b3QueCkge1xyXG4gICAgICAgICAgICAgICAgcGl2b3QgPSBwb2ludDtcclxuICAgICAgICAgICAgICAgIHBpdm90SW5kZXggPSBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBwaXZvdDtcclxuICAgIH1cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQ2FudmFzQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXJzL01ha2VyL0NhbnZhc0NvbnRyb2xsZXInO1xyXG5pbXBvcnQgVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVycy9Ub29sYmFyL1Rvb2xiYXJDb250cm9sbGVyJztcclxuaW1wb3J0IGluaXQgZnJvbSAnLi9pbml0JztcclxuXHJcbmNvbnN0IG1haW4gPSAoKSA9PiB7XHJcbiAgICBjb25zdCBpbml0UmV0ID0gaW5pdCgpO1xyXG4gICAgaWYgKCFpbml0UmV0KSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGluaXRpYWxpemUgV2ViR0wnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgeyBnbCwgcHJvZ3JhbSwgY29sb3JCdWZmZXIsIHBvc2l0aW9uQnVmZmVyIH0gPSBpbml0UmV0O1xyXG5cclxuICAgIGNvbnN0IGFwcENhbnZhcyA9IG5ldyBBcHBDYW52YXMoZ2wsIHByb2dyYW0sIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XHJcbiAgICBcclxuICAgIGNvbnN0IGNhbnZhc0NvbnRyb2xsZXIgPSBuZXcgQ2FudmFzQ29udHJvbGxlcihhcHBDYW52YXMpO1xyXG4gICAgY2FudmFzQ29udHJvbGxlci5zdGFydCgpO1xyXG4gICAgXHJcbiAgICBuZXcgVG9vbGJhckNvbnRyb2xsZXIoYXBwQ2FudmFzLCBjYW52YXNDb250cm9sbGVyKTtcclxuXHJcbiAgICAvLyBjb25zdCByZWQgPSBuZXcgQ29sb3IoMjU1LCAwLCAyMDApXHJcbiAgICAvLyAvLyBjb25zdCB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZSgndHJpLTEnLCByZWQsIDUwLCA1MCwgMjAsIDUwMCwgMjAwLCAxMDApO1xyXG4gICAgLy8gLy8gYXBwQ2FudmFzLmFkZFNoYXBlKHRyaWFuZ2xlKTtcclxuICAgIFxyXG4gICAgLy8gY29uc3QgcmVjdCA9IG5ldyBSZWN0YW5nbGUoJ3JlY3QtMScsIHJlZCwgMCwwLDEwLDIwLDAsMSwxKTtcclxuICAgIC8vIHJlY3QuYW5nbGVJblJhZGlhbnMgPSAtIE1hdGguUEkgLyA0O1xyXG4gICAgLy8gLy8gcmVjdC50YXJnZXRQb2ludFswXSA9IDUgKiBNYXRoLnNxcnQoMik7XHJcbiAgICAvLyAvLyByZWN0LnNjYWxlWCA9IDEwO1xyXG4gICAgLy8gLy8gcmVjdC50cmFuc2xhdGlvblswXSA9IDUwMDtcclxuICAgIC8vIC8vIHJlY3QudHJhbnNsYXRpb25bMV0gPSAxMDAwO1xyXG4gICAgLy8gLy8gcmVjdC5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG4gICAgLy8gYXBwQ2FudmFzLmFkZFNoYXBlKHJlY3QpO1xyXG5cclxuICAgIC8vIGNvbnN0IGxpbmUgPSBuZXcgTGluZSgnbGluZS0xJywgcmVkLCAxMDAsIDEwMCwgMTAwLCAzMDApO1xyXG4gICAgLy8gY29uc3QgbGluZTIgPSBuZXcgTGluZSgnbGluZS0yJywgcmVkLCAxMDAsIDEwMCwgMzAwLCAxMDApO1xyXG4gICAgLy8gYXBwQ2FudmFzLmFkZFNoYXBlKGxpbmUpO1xyXG4gICAgLy8gYXBwQ2FudmFzLmFkZFNoYXBlKGxpbmUyKTtcclxufTtcclxuXHJcbm1haW4oKTtcclxuIiwiY29uc3QgY3JlYXRlU2hhZGVyID0gKFxyXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICAgIHR5cGU6IG51bWJlcixcclxuICAgIHNvdXJjZTogc3RyaW5nXHJcbikgPT4ge1xyXG4gICAgY29uc3Qgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xyXG4gICAgaWYgKHNoYWRlcikge1xyXG4gICAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XHJcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyk7XHJcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHJldHVybiBzaGFkZXI7XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKTtcclxuICAgICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGNyZWF0ZVByb2dyYW0gPSAoXHJcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gICAgdnR4U2hkOiBXZWJHTFNoYWRlcixcclxuICAgIGZyZ1NoZDogV2ViR0xTaGFkZXJcclxuKSA9PiB7XHJcbiAgICBjb25zdCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xyXG4gICAgaWYgKHByb2dyYW0pIHtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdnR4U2hkKTtcclxuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJnU2hkKTtcclxuICAgICAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyk7XHJcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHJldHVybiBwcm9ncmFtO1xyXG5cclxuICAgICAgICBjb25zb2xlLmVycm9yKGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pKTtcclxuICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgaW5pdCA9ICgpID0+IHtcclxuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpO1xyXG5cclxuICAgIGlmICghZ2wpIHtcclxuICAgICAgICBhbGVydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgd2ViR0wnKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gSW5pdGlhbGl6ZSBzaGFkZXJzIGFuZCBwcm9ncmFtc1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgY29uc3QgdnR4U2hhZGVyU291cmNlID0gKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZXJ0ZXgtc2hhZGVyLTJkJykgYXMgSFRNTFNjcmlwdEVsZW1lbnRcclxuICAgICkudGV4dDtcclxuICAgIGNvbnN0IGZyYWdTaGFkZXJTb3VyY2UgPSAoXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZyYWdtZW50LXNoYWRlci0yZCcpIGFzIEhUTUxTY3JpcHRFbGVtZW50XHJcbiAgICApLnRleHQ7XHJcblxyXG4gICAgY29uc3QgdmVydGV4U2hhZGVyID0gY3JlYXRlU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2dHhTaGFkZXJTb3VyY2UpO1xyXG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBjcmVhdGVTaGFkZXIoXHJcbiAgICAgICAgZ2wsXHJcbiAgICAgICAgZ2wuRlJBR01FTlRfU0hBREVSLFxyXG4gICAgICAgIGZyYWdTaGFkZXJTb3VyY2VcclxuICAgICk7XHJcbiAgICBpZiAoIXZlcnRleFNoYWRlciB8fCAhZnJhZ21lbnRTaGFkZXIpIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBwcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShnbCwgdmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcik7XHJcbiAgICBpZiAoIXByb2dyYW0pIHJldHVybjtcclxuXHJcbiAgICBjb25zdCBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgIGNvbnN0IGRpc3BsYXlXaWR0aCAgPSBNYXRoLnJvdW5kKHdpZHRoICogZHByKTtcclxuICAgIGNvbnN0IGRpc3BsYXlIZWlnaHQgPSBNYXRoLnJvdW5kKGhlaWdodCAqIGRwcik7XHJcblxyXG4gICAgY29uc3QgbmVlZFJlc2l6ZSA9XHJcbiAgICAgICAgZ2wuY2FudmFzLndpZHRoICE9IGRpc3BsYXlXaWR0aCB8fCBnbC5jYW52YXMuaGVpZ2h0ICE9IGRpc3BsYXlIZWlnaHQ7XHJcblxyXG4gICAgaWYgKG5lZWRSZXNpemUpIHtcclxuICAgICAgICBnbC5jYW52YXMud2lkdGggPSBkaXNwbGF5V2lkdGg7XHJcbiAgICAgICAgZ2wuY2FudmFzLmhlaWdodCA9IGRpc3BsYXlIZWlnaHQ7XHJcbiAgICB9XHJcblxyXG4gICAgZ2wudmlld3BvcnQoMCwgMCwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTtcclxuICAgIGdsLmNsZWFyQ29sb3IoMCwgMCwgMCwgMCk7XHJcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcclxuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XHJcblxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gRW5hYmxlICYgaW5pdGlhbGl6ZSB1bmlmb3JtcyBhbmQgYXR0cmlidXRlc1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gUmVzb2x1dGlvblxyXG4gICAgY29uc3QgbWF0cml4VW5pZm9ybUxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKFxyXG4gICAgICAgIHByb2dyYW0sXHJcbiAgICAgICAgJ3VfdHJhbnNmb3JtYXRpb24nXHJcbiAgICApO1xyXG4gICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhVbmlmb3JtTG9jYXRpb24sIGZhbHNlLCBbMSwwLDAsMCwxLDAsMCwwLDFdKVxyXG5cclxuICAgIGNvbnN0IHJlc29sdXRpb25Vbmlmb3JtTG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oXHJcbiAgICAgICAgcHJvZ3JhbSxcclxuICAgICAgICAndV9yZXNvbHV0aW9uJ1xyXG4gICAgKTtcclxuICAgIGdsLnVuaWZvcm0yZihyZXNvbHV0aW9uVW5pZm9ybUxvY2F0aW9uLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQpO1xyXG5cclxuICAgIC8vIENvbG9yXHJcbiAgICBjb25zdCBjb2xvckJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgaWYgKCFjb2xvckJ1ZmZlcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgY29sb3IgYnVmZmVyJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbiAgICBjb25zdCBjb2xvckF0dHJpYnV0ZUxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgJ2FfY29sb3InKTtcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGNvbG9yQXR0cmlidXRlTG9jYXRpb24pO1xyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihjb2xvckF0dHJpYnV0ZUxvY2F0aW9uLCAzLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cclxuICAgIC8vIFBvc2l0aW9uXHJcbiAgICBjb25zdCBwb3NpdGlvbkJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xyXG4gICAgaWYgKCFwb3NpdGlvbkJ1ZmZlcikge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgcG9zaXRpb24gYnVmZmVyJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XHJcbiAgICBjb25zdCBwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oXHJcbiAgICAgICAgcHJvZ3JhbSxcclxuICAgICAgICAnYV9wb3NpdGlvbidcclxuICAgICk7XHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uKTtcclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbiwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHJcbiAgICAvLyBEbyBub3QgcmVtb3ZlIGNvbW1lbnRzLCB1c2VkIGZvciBzYW5pdHkgY2hlY2tcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFNldCB0aGUgdmFsdWVzIG9mIHRoZSBidWZmZXJcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuXHJcbiAgICAvLyBjb25zdCBjb2xvcnMgPSBbMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMF07XHJcbiAgICAvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgLy8gZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cclxuICAgIC8vIGNvbnN0IHBvc2l0aW9ucyA9IFsxMDAsIDUwLCAyMCwgMTAsIDUwMCwgNTAwXTtcclxuICAgIC8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XHJcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLCBnbC5TVEFUSUNfRFJBVyk7XHJcblxyXG4gICAgLy8gPT09PVxyXG4gICAgLy8gRHJhd1xyXG4gICAgLy8gPT09PVxyXG4gICAgLy8gZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsIDAsIDMpO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgcG9zaXRpb25CdWZmZXIsXHJcbiAgICAgICAgcHJvZ3JhbSxcclxuICAgICAgICBjb2xvckJ1ZmZlcixcclxuICAgICAgICBnbCxcclxuICAgIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBpbml0O1xyXG4iLCJpbXBvcnQgVmVydGV4IGZyb20gJy4vQmFzZS9WZXJ0ZXgnO1xyXG5cclxuZXhwb3J0IGNvbnN0IGV1Y2xpZGVhbkRpc3RhbmNlVnR4ID0gKGE6IFZlcnRleCwgYjogVmVydGV4KTogbnVtYmVyID0+IHtcclxuICAgIGNvbnN0IGR4ID0gYS54IC0gYi54O1xyXG4gICAgY29uc3QgZHkgPSBhLnkgLSBiLnk7XHJcblxyXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcbn07XHJcblxyXG5leHBvcnQgY29uc3QgZXVjbGlkZWFuRGlzdGFuY2UgPSAoYXg6IG51bWJlciwgYXk6IG51bWJlciwgYng6IG51bWJlciwgYnk6IG51bWJlcik6IG51bWJlciA9PiB7XHJcbiAgY29uc3QgZHggPSBheCAtIGJ4O1xyXG4gIGNvbnN0IGR5ID0gYXkgLSBieTtcclxuXHJcbiAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XHJcbn07XHJcblxyXG4vLyAzNjAgREVHXHJcbmV4cG9ydCBjb25zdCBnZXRBbmdsZSA9IChvcmlnaW46IFZlcnRleCwgdGFyZ2V0OiBWZXJ0ZXgpID0+IHtcclxuICAgIGNvbnN0IHBsdXNNaW51c0RlZyA9IHJhZFRvRGVnKE1hdGguYXRhbjIob3JpZ2luLnkgLSB0YXJnZXQueSwgb3JpZ2luLnggLSB0YXJnZXQueCkpO1xyXG4gICAgcmV0dXJuIHBsdXNNaW51c0RlZyA+PSAwID8gMTgwIC0gcGx1c01pbnVzRGVnIDogTWF0aC5hYnMocGx1c01pbnVzRGVnKSArIDE4MDtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IHJhZFRvRGVnID0gKHJhZDogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gcmFkICogMTgwIC8gTWF0aC5QSTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGRlZ1RvUmFkID0gKGRlZzogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gZGVnICogTWF0aC5QSSAvIDE4MDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvUmdiKGhleDogc3RyaW5nKSB7XHJcbiAgdmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xyXG4gIHJldHVybiByZXN1bHQgPyB7XHJcbiAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcclxuICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxyXG4gICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcclxuICB9IDogbnVsbDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJnYlRvSGV4KHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICByZXR1cm4gXCIjXCIgKyAoMSA8PCAyNCB8IHIgPDwgMTYgfCBnIDw8IDggfCBiKS50b1N0cmluZygxNikuc2xpY2UoMSk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBtMyA9IHtcclxuICAgIGlkZW50aXR5OiBmdW5jdGlvbigpIDogbnVtYmVyW10ge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIDEsIDAsIDAsXHJcbiAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICAwLCAwLCAxLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICBcclxuICAgIHRyYW5zbGF0aW9uOiBmdW5jdGlvbih0eCA6IG51bWJlciwgdHkgOiBudW1iZXIpIDogbnVtYmVyW10ge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIDEsIDAsIDAsXHJcbiAgICAgICAgMCwgMSwgMCxcclxuICAgICAgICB0eCwgdHksIDEsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgcm90YXRpb246IGZ1bmN0aW9uKGFuZ2xlSW5SYWRpYW5zIDogbnVtYmVyKSA6IG51bWJlcltdIHtcclxuICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcclxuICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBjLC1zLCAwLFxyXG4gICAgICAgIHMsIGMsIDAsXHJcbiAgICAgICAgMCwgMCwgMSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICBzY2FsaW5nOiBmdW5jdGlvbihzeCA6IG51bWJlciwgc3kgOiBudW1iZXIpIDogbnVtYmVyW10ge1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIHN4LCAwLCAwLFxyXG4gICAgICAgIDAsIHN5LCAwLFxyXG4gICAgICAgIDAsIDAsIDEsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgbXVsdGlwbHk6IGZ1bmN0aW9uKGEgOiBudW1iZXJbXSwgYiA6IG51bWJlcltdKSA6IG51bWJlcltdIHtcclxuICAgICAgY29uc3QgYTAwID0gYVswICogMyArIDBdO1xyXG4gICAgICBjb25zdCBhMDEgPSBhWzAgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGEwMiA9IGFbMCAqIDMgKyAyXTtcclxuICAgICAgY29uc3QgYTEwID0gYVsxICogMyArIDBdO1xyXG4gICAgICBjb25zdCBhMTEgPSBhWzEgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGExMiA9IGFbMSAqIDMgKyAyXTtcclxuICAgICAgY29uc3QgYTIwID0gYVsyICogMyArIDBdO1xyXG4gICAgICBjb25zdCBhMjEgPSBhWzIgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGEyMiA9IGFbMiAqIDMgKyAyXTtcclxuICAgICAgY29uc3QgYjAwID0gYlswICogMyArIDBdO1xyXG4gICAgICBjb25zdCBiMDEgPSBiWzAgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGIwMiA9IGJbMCAqIDMgKyAyXTtcclxuICAgICAgY29uc3QgYjEwID0gYlsxICogMyArIDBdO1xyXG4gICAgICBjb25zdCBiMTEgPSBiWzEgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGIxMiA9IGJbMSAqIDMgKyAyXTtcclxuICAgICAgY29uc3QgYjIwID0gYlsyICogMyArIDBdO1xyXG4gICAgICBjb25zdCBiMjEgPSBiWzIgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGIyMiA9IGJbMiAqIDMgKyAyXTtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXHJcbiAgICAgICAgYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxLFxyXG4gICAgICAgIGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMixcclxuICAgICAgICBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjAsXHJcbiAgICAgICAgYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxLFxyXG4gICAgICAgIGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMixcclxuICAgICAgICBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjAsXHJcbiAgICAgICAgYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxLFxyXG4gICAgICAgIGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMixcclxuICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgaW52ZXJzZTogZnVuY3Rpb24obSA6IG51bWJlcltdKSB7XHJcbiAgICAgIGNvbnN0IGRldCA9IG1bMF0gKiAobVs0XSAqIG1bOF0gLSBtWzddICogbVs1XSkgLVxyXG4gICAgICAgICAgICAgICAgICBtWzFdICogKG1bM10gKiBtWzhdIC0gbVs1XSAqIG1bNl0pICtcclxuICAgICAgICAgICAgICAgICAgbVsyXSAqIChtWzNdICogbVs3XSAtIG1bNF0gKiBtWzZdKTtcclxuICBcclxuICAgICAgaWYgKGRldCA9PT0gMCkgcmV0dXJuIG51bGw7XHJcbiAgXHJcbiAgICAgIGNvbnN0IGludkRldCA9IDEgLyBkZXQ7XHJcbiAgXHJcbiAgICAgIHJldHVybiBbIFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bNF0gKiBtWzhdIC0gbVs1XSAqIG1bN10pLCBcclxuICAgICAgICAgIGludkRldCAqIChtWzJdICogbVs3XSAtIG1bMV0gKiBtWzhdKSxcclxuICAgICAgICAgIGludkRldCAqIChtWzFdICogbVs1XSAtIG1bMl0gKiBtWzRdKSxcclxuICAgICAgICAgIGludkRldCAqIChtWzVdICogbVs2XSAtIG1bM10gKiBtWzhdKSxcclxuICAgICAgICAgIGludkRldCAqIChtWzBdICogbVs4XSAtIG1bMl0gKiBtWzZdKSxcclxuICAgICAgICAgIGludkRldCAqIChtWzJdICogbVszXSAtIG1bMF0gKiBtWzVdKSxcclxuICAgICAgICAgIGludkRldCAqIChtWzNdICogbVs3XSAtIG1bNF0gKiBtWzZdKSxcclxuICAgICAgICAgIGludkRldCAqIChtWzFdICogbVs2XSAtIG1bMF0gKiBtWzddKSxcclxuICAgICAgICAgIGludkRldCAqIChtWzBdICogbVs0XSAtIG1bMV0gKiBtWzNdKVxyXG4gICAgICBdO1xyXG4gIH0sXHJcblxyXG4gICAgbXVsdGlwbHkzeDE6IGZ1bmN0aW9uKGEgOiBudW1iZXJbXSwgYiA6IG51bWJlcltdKSA6IG51bWJlcltdIHtcclxuICAgICAgY29uc3QgYTAwID0gYVswICogMyArIDBdO1xyXG4gICAgICBjb25zdCBhMDEgPSBhWzAgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGEwMiA9IGFbMCAqIDMgKyAyXTtcclxuICAgICAgY29uc3QgYTEwID0gYVsxICogMyArIDBdO1xyXG4gICAgICBjb25zdCBhMTEgPSBhWzEgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGExMiA9IGFbMSAqIDMgKyAyXTtcclxuICAgICAgY29uc3QgYTIwID0gYVsyICogMyArIDBdO1xyXG4gICAgICBjb25zdCBhMjEgPSBhWzIgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGEyMiA9IGFbMiAqIDMgKyAyXTtcclxuICAgICAgY29uc3QgYjAwID0gYlswICogMyArIDBdO1xyXG4gICAgICBjb25zdCBiMDEgPSBiWzAgKiAzICsgMV07XHJcbiAgICAgIGNvbnN0IGIwMiA9IGJbMCAqIDMgKyAyXTtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXHJcbiAgICAgICAgYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxLFxyXG4gICAgICAgIGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMixcclxuICAgICAgXTtcclxuICAgIH0sXHJcblxyXG4gICAgdHJhbnNsYXRlOiBmdW5jdGlvbihtIDogbnVtYmVyW10sIHR4Om51bWJlciwgdHk6bnVtYmVyKSB7XHJcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy50cmFuc2xhdGlvbih0eCwgdHkpKTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICByb3RhdGU6IGZ1bmN0aW9uKG06bnVtYmVyW10sIGFuZ2xlSW5SYWRpYW5zOm51bWJlcikge1xyXG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMucm90YXRpb24oYW5nbGVJblJhZGlhbnMpKTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICBzY2FsZTogZnVuY3Rpb24obTpudW1iZXJbXSwgc3g6bnVtYmVyLCBzeTpudW1iZXIpIHtcclxuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnNjYWxpbmcoc3gsIHN5KSk7XHJcbiAgICB9LFxyXG4gIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9
