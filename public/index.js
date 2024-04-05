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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQU0saUJBQWlCLEdBQUcsVUFBRSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsb0JBQW9CLEVBQUUsWUFBWSxDQUFDLENBQUM7WUFDbEYsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxJQUFJLGdCQUFNLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxDQUFDLEVBQUUsS0FBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sNEJBQVcsR0FBbEI7UUFDSSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFJLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDeEksSUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM1RyxJQUFNLE9BQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTVHLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3pELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7UUFFakQsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFD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SUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekIsT0FBTztZQUNMLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1NBQ2xDLENBQUM7SUFDSixDQUFDO0lBRUQsT0FBTyxFQUFFLFVBQVMsQ0FBWTtRQUM1QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRS9DLElBQUksR0FBRyxLQUFLLENBQUM7WUFBRSxPQUFPLElBQUksQ0FBQztRQUUzQixJQUFNLE1BQU0sR0FBRyxDQUFDLEdBQUcsR0FBRyxDQUFDO1FBRXZCLE9BQU87WUFDSCxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN2QyxDQUFDO0lBQ04sQ0FBQztJQUVDLFdBQVcsRUFBRSxVQUFTLENBQVksRUFBRSxDQUFZO1FBQzlDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE9BQU87WUFDTCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLENBQVksRUFBRSxFQUFTLEVBQUUsRUFBUztRQUNwRCxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELE1BQU0sRUFBRSxVQUFTLENBQVUsRUFBRSxjQUFxQjtRQUNoRCxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsQ0FBVSxFQUFFLEVBQVMsRUFBRSxFQUFTO1FBQzlDLE9BQU8sVUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsVUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0YsQ0FBQzs7Ozs7OztVQ25LSjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0FwcENhbnZhcy50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9CYXNlU2hhcGUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQ29sb3IudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvVmVydGV4LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9DVlBvbHlnb25NYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL0ZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL0xpbmVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL1JlY3RhbmdsZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvU3F1YXJlTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL0NWUG9seWdvblRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL0ZhblBvbHlnb25Ub29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9MaW5lVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvU2hhcGVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9TcXVhcmVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9Ub29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL0NWUG9seWdvbi50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL0ZhblBvbHlnb24udHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9MaW5lLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvUmVjdGFuZ2xlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvU3F1YXJlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9jb252ZXhIdWxsVXRpbHMudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9pbml0LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9CYXNlL0Jhc2VTaGFwZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENhbnZhcyB7XG4gICAgcHJpdmF0ZSBwcm9ncmFtOiBXZWJHTFByb2dyYW07XG4gICAgcHJpdmF0ZSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xuICAgIHByaXZhdGUgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyO1xuICAgIHByaXZhdGUgY29sb3JCdWZmZXI6IFdlYkdMQnVmZmVyO1xuICAgIHByaXZhdGUgX3VwZGF0ZVRvb2xiYXI6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBfc2hhcGVzOiBSZWNvcmQ8c3RyaW5nLCBCYXNlU2hhcGU+ID0ge307XG5cbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIGhlaWdodDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXG4gICAgICAgIHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcbiAgICAgICAgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLFxuICAgICAgICBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXJcbiAgICApIHtcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQnVmZmVyID0gcG9zaXRpb25CdWZmZXI7XG4gICAgICAgIHRoaXMuY29sb3JCdWZmZXIgPSBjb2xvckJ1ZmZlcjtcbiAgICAgICAgdGhpcy5wcm9ncmFtID0gcHJvZ3JhbTtcblxuICAgICAgICB0aGlzLndpZHRoID0gZ2wuY2FudmFzLndpZHRoO1xuICAgICAgICB0aGlzLmhlaWdodCA9IGdsLmNhbnZhcy5oZWlnaHQ7XG5cbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQnVmZmVyID0gdGhpcy5wb3NpdGlvbkJ1ZmZlcjtcbiAgICAgICAgY29uc3QgY29sb3JCdWZmZXIgPSB0aGlzLmNvbG9yQnVmZmVyO1xuXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zaGFwZXMpLmZvckVhY2goKHNoYXBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBzaGFwZS5wb2ludExpc3QuZmxhdE1hcCgocG9pbnQpID0+IFtcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnksXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgbGV0IGNvbG9yczogbnVtYmVyW10gPSBbXTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goc2hhcGUucG9pbnRMaXN0W2ldLmMuciwgc2hhcGUucG9pbnRMaXN0W2ldLmMuZywgc2hhcGUucG9pbnRMaXN0W2ldLmMuYik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEJpbmQgY29sb3IgZGF0YVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSxcbiAgICAgICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gQmluZCBwb3NpdGlvbiBkYXRhXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShcbiAgICAgICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxuICAgICAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoISh0aGlzLnBvc2l0aW9uQnVmZmVyIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9zaXRpb24gYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoISh0aGlzLmNvbG9yQnVmZmVyIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29sb3IgYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTZXQgdHJhbnNmb3JtYXRpb24gbWF0cml4XG4gICAgICAgICAgICAvLyBzaGFwZS5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xuXG4gICAgICAgICAgICBnbC5kcmF3QXJyYXlzKHNoYXBlLmdsRHJhd1R5cGUsIDAsIHNoYXBlLnBvaW50TGlzdC5sZW5ndGgpO1xuXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXQgc2hhcGVzKCk6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVzO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0IHNoYXBlcyh2OiBSZWNvcmQ8c3RyaW5nLCBCYXNlU2hhcGU+KSB7XG4gICAgICAgIHRoaXMuX3NoYXBlcyA9IHY7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgIGlmICh0aGlzLl91cGRhdGVUb29sYmFyKVxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVG9vbGJhci5jYWxsKHRoaXMpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXQgdXBkYXRlVG9vbGJhcih2IDogKCkgPT4gdm9pZCkge1xuICAgICAgICB0aGlzLl91cGRhdGVUb29sYmFyID0gdjtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2VuZXJhdGVJZEZyb21UYWcodGFnOiBzdHJpbmcpIHtcbiAgICAgICAgY29uc3Qgd2l0aFNhbWVUYWcgPSBPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuZmlsdGVyKChpZCkgPT4gaWQuc3RhcnRzV2l0aCh0YWcgKyAnLScpKTtcbiAgICAgICAgcmV0dXJuIGAke3RhZ30tJHt3aXRoU2FtZVRhZy5sZW5ndGggKyAxfWBcbiAgICB9XG5cbiAgICBwdWJsaWMgYWRkU2hhcGUoc2hhcGU6IEJhc2VTaGFwZSkge1xuICAgICAgICBpZiAoT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKHNoYXBlLmlkKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgYWxyZWFkeSB1c2VkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTaGFwZXMgPSB7IC4uLnRoaXMuc2hhcGVzIH07XG4gICAgICAgIG5ld1NoYXBlc1tzaGFwZS5pZF0gPSBzaGFwZTtcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGVkaXRTaGFwZShuZXdTaGFwZTogQmFzZVNoYXBlKSB7XG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKG5ld1NoYXBlLmlkKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTaGFwZXMgPSB7IC4uLnRoaXMuc2hhcGVzIH07XG4gICAgICAgIG5ld1NoYXBlc1tuZXdTaGFwZS5pZF0gPSBuZXdTaGFwZTtcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XG4gICAgfVxuXG4gICAgcHVibGljIGRlbGV0ZVNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMobmV3U2hhcGUuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBub3QgZm91bmQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcbiAgICAgICAgZGVsZXRlIG5ld1NoYXBlc1tuZXdTaGFwZS5pZF07XG4gICAgICAgIHRoaXMuc2hhcGVzID0gbmV3U2hhcGVzO1xuICAgIH1cbn0iLCJpbXBvcnQgeyBtMyB9IGZyb20gXCIuLi91dGlsc1wiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuL0NvbG9yXCI7XG5pbXBvcnQgVmVydGV4IGZyb20gXCIuL1ZlcnRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBCYXNlU2hhcGUge1xuXG4gICAgcG9pbnRMaXN0OiBWZXJ0ZXhbXSA9IFtdO1xuICAgIGJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdDogVmVydGV4W10gPSBbXTtcbiAgICBpZDogc3RyaW5nO1xuICAgIGNvbG9yOiBDb2xvcjtcbiAgICBnbERyYXdUeXBlOiBudW1iZXI7XG4gICAgY2VudGVyOiBWZXJ0ZXg7XG5cbiAgICB0cmFuc2xhdGlvbjogW251bWJlciwgbnVtYmVyXSA9IFswLCAwXTtcbiAgICBhbmdsZUluUmFkaWFuczogbnVtYmVyID0gMDtcbiAgICBzY2FsZTogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcblxuICAgIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBudW1iZXJbXSA9IG0zLmlkZW50aXR5KCk7XG5cbiAgICBjb25zdHJ1Y3RvcihnbERyYXdUeXBlOiBudW1iZXIsIGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgY2VudGVyOiBWZXJ0ZXggPSBuZXcgVmVydGV4KDAsIDAsIGNvbG9yKSwgcm90YXRpb24gPSAwLCBzY2FsZVggPSAxLCBzY2FsZVkgPSAxKSB7XG4gICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IGdsRHJhd1R5cGU7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcbiAgICAgICAgdGhpcy5hbmdsZUluUmFkaWFucyA9IHJvdGF0aW9uO1xuICAgICAgICB0aGlzLnNjYWxlWzBdID0gc2NhbGVYO1xuICAgICAgICB0aGlzLnNjYWxlWzFdID0gc2NhbGVZO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xuICAgICAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMuaWRlbnRpdHkoKVxuICAgICAgICBjb25zdCB0cmFuc2xhdGVUb0NlbnRlciA9IG0zLnRyYW5zbGF0aW9uKC10aGlzLmNlbnRlci54LCAtdGhpcy5jZW50ZXIueSk7XG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbTMucm90YXRpb24odGhpcy5hbmdsZUluUmFkaWFucyk7XG4gICAgICAgIGxldCBzY2FsaW5nID0gbTMuc2NhbGluZyh0aGlzLnNjYWxlWzBdLCB0aGlzLnNjYWxlWzFdKTtcbiAgICAgICAgbGV0IHRyYW5zbGF0ZUJhY2sgPSBtMy50cmFuc2xhdGlvbih0aGlzLmNlbnRlci54LCB0aGlzLmNlbnRlci55KTtcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlID0gbTMudHJhbnNsYXRpb24odGhpcy50cmFuc2xhdGlvblswXSwgdGhpcy50cmFuc2xhdGlvblsxXSk7XG5cbiAgICAgICAgbGV0IHJlc1NjYWxlID0gbTMubXVsdGlwbHkoc2NhbGluZywgdHJhbnNsYXRlVG9DZW50ZXIpO1xuICAgICAgICBsZXQgcmVzUm90YXRlID0gbTMubXVsdGlwbHkocm90YXRpb24scmVzU2NhbGUpO1xuICAgICAgICBsZXQgcmVzQmFjayA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZUJhY2ssIHJlc1JvdGF0ZSk7XG4gICAgICAgIGNvbnN0IHJlc1RyYW5zbGF0ZSA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZSwgcmVzQmFjayk7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSByZXNUcmFuc2xhdGU7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3Ige1xuICAgIHI6IG51bWJlcjtcbiAgICBnOiBudW1iZXI7XG4gICAgYjogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xuICAgICAgICB0aGlzLnIgPSByO1xuICAgICAgICB0aGlzLmcgPSBnO1xuICAgICAgICB0aGlzLmIgPSBiO1xuICAgIH1cbn1cbiIsImltcG9ydCBDb2xvciBmcm9tIFwiLi9Db2xvclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZXJ0ZXgge1xuICAgIHg6IG51bWJlcjtcbiAgICB5OiBudW1iZXI7XG4gICAgYzogQ29sb3I7XG4gICAgXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIGM6IENvbG9yKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMuYyA9IGM7XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBDVlBvbHlnb25NYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9DVlBvbHlnb25NYWtlckNvbnRyb2xsZXInO1xuaW1wb3J0IEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9GYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyJztcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGUvSVNoYXBlTWFrZXJDb250cm9sbGVyJztcbmltcG9ydCBMaW5lTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZU1ha2VyQ29udHJvbGxlcic7XG5pbXBvcnQgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyJztcbmltcG9ydCBTcXVhcmVNYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9TcXVhcmVNYWtlckNvbnRyb2xsZXInO1xuXG5lbnVtIEFWQUlMX1NIQVBFUyB7XG4gICAgTGluZSA9ICdMaW5lJyxcbiAgICBSZWN0YW5nbGUgPSAnUmVjdGFuZ2xlJyxcbiAgICBTcXVhcmUgPSAnU3F1YXJlJyxcbiAgICBGYW5Qb2x5ID0gJ0ZhblBvbHknLFxuICAgIENWUG9seSA9ICdDVlBvbHknLFxufVxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIF9zaGFwZUNvbnRyb2xsZXI6IElTaGFwZU1ha2VyQ29udHJvbGxlcjtcbiAgICBwcml2YXRlIGNhbnZhc0VsbXQ6IEhUTUxDYW52YXNFbGVtZW50O1xuICAgIHByaXZhdGUgYnV0dG9uQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcbiAgICBwcml2YXRlIGNvbG9yUGlja2VyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XG4gICAgcHJpdmF0ZSBzZXRQb2x5Z29uQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICB0b29sYmFyT25DbGlja0NiOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuXG4gICAgICAgIGNvbnN0IGNhbnZhc0VsbXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICdzaGFwZS1idXR0b24tY29udGFpbmVyJ1xuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3NldC1wb2x5Z29uJ1xuICAgICAgICApIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdCA9IGNhbnZhc0VsbXQ7XG4gICAgICAgIHRoaXMuYnV0dG9uQ29udGFpbmVyID0gYnV0dG9uQ29udGFpbmVyO1xuXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgdGhpcy5fc2hhcGVDb250cm9sbGVyID0gbmV3IENWUG9seWdvbk1ha2VyQ29udHJvbGxlcihhcHBDYW52YXMpO1xuXG4gICAgICAgIHRoaXMuY29sb3JQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICdzaGFwZS1jb2xvci1waWNrZXInXG4gICAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcblxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WCA9IGUub2Zmc2V0WCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgY29uc3QgY29ycmVjdFkgPSBlLm9mZnNldFkgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhcbiAgICAgICAgICAgICAgICBjb3JyZWN0WCxcbiAgICAgICAgICAgICAgICBjb3JyZWN0WSxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yUGlja2VyLnZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHRoaXMudG9vbGJhck9uQ2xpY2tDYilcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJPbkNsaWNrQ2IoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IHNoYXBlQ29udHJvbGxlcigpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVDb250cm9sbGVyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0IHNoYXBlQ29udHJvbGxlcih2OiBJU2hhcGVNYWtlckNvbnRyb2xsZXIpIHtcbiAgICAgICAgdGhpcy5fc2hhcGVDb250cm9sbGVyID0gdjtcblxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WCA9IGUub2Zmc2V0WCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgY29uc3QgY29ycmVjdFkgPSBlLm9mZnNldFkgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhcbiAgICAgICAgICAgICAgICBjb3JyZWN0WCxcbiAgICAgICAgICAgICAgICBjb3JyZWN0WSxcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yUGlja2VyLnZhbHVlXG4gICAgICAgICAgICApO1xuICAgICAgICAgICAgaWYgKHRoaXMudG9vbGJhck9uQ2xpY2tDYilcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJPbkNsaWNrQ2IoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgaW5pdENvbnRyb2xsZXIoc2hhcGVTdHI6IEFWQUlMX1NIQVBFUyk6IElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcbiAgICAgICAgc3dpdGNoIChzaGFwZVN0cikge1xuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuTGluZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpbmVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuUmVjdGFuZ2xlOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLlNxdWFyZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNxdWFyZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5GYW5Qb2x5OlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5DVlBvbHk6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBDVlBvbHlnb25NYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBzaGFwZSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGVkaXRFeGlzdGluZ0ZhblBvbHlnb24oaWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlciA9IG5ldyBGYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcbiAgICAgICAgKHRoaXMuc2hhcGVDb250cm9sbGVyIGFzIEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIpLnNldEN1cnJlbnRQb2x5Z29uKGlkKTtcbiAgICB9XG5cbiAgICBlZGl0RXhpc3RpbmdDVlBvbHlnb24oaWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlciA9IG5ldyBDVlBvbHlnb25NYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xuICAgICAgICAodGhpcy5zaGFwZUNvbnRyb2xsZXIgYXMgQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyKS5zZXRDdXJyZW50UG9seWdvbihpZCk7XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc2hhcGVTdHIgaW4gQVZBSUxfU0hBUEVTKSB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzaGFwZS1idXR0b24nKTtcbiAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHNoYXBlU3RyO1xuICAgICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSB0aGlzLmluaXRDb250cm9sbGVyKFxuICAgICAgICAgICAgICAgICAgICBzaGFwZVN0ciBhcyBBVkFJTF9TSEFQRVNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgQ29sb3IgZnJvbSAnLi4vLi4vLi4vQmFzZS9Db2xvcic7XG5pbXBvcnQgVmVydGV4IGZyb20gJy4uLy4uLy4uL0Jhc2UvVmVydGV4JztcbmltcG9ydCBDVlBvbHlnb24gZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0NWUG9seWdvbic7XG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vSVNoYXBlTWFrZXJDb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyXG4gICAgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXJcbntcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgb3JpZ2luOiBWZXJ0ZXggfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIHNlY29uZFBvaW50OiBWZXJ0ZXggfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIGN1cnJlbnRQb2x5OiBDVlBvbHlnb24gfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG5cbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAnc2V0LXBvbHlnb24nXG4gICAgICAgICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKCdoaWRkZW4nKTtcblxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24ub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBpZiAoXG4gICAgICAgICAgICAgICAgdGhpcy5vcmlnaW4gIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ICE9PSBudWxsICYmXG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRQb2ludCAhPT0gbnVsbFxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRQb2ludCA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIHNldEN1cnJlbnRQb2x5Z29uKGlkOiBzdHJpbmcpIHtcbiAgICAgICAgdGhpcy5jdXJyZW50UG9seSA9IHRoaXMuYXBwQ2FudmFzLnNoYXBlc1tpZF0gYXMgQ1ZQb2x5Z29uO1xuICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuY3VycmVudFBvbHkucG9pbnRMaXN0WzBdO1xuICAgICAgICB0aGlzLnNlY29uZFBvaW50ID0gdGhpcy5jdXJyZW50UG9seS5wb2ludExpc3RbMV07XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcbiAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3IociAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSk7XG5cbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnb3JpZ2luIHNldCcpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMub3JpZ2luICE9PSBudWxsICYmIHRoaXMuc2Vjb25kUG9pbnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWNvbmQgc2V0Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuc2Vjb25kUG9pbnQgPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLnNlY29uZFBvaW50ICE9PSBudWxsICYmIHRoaXMuY3VycmVudFBvbHkgPT09IG51bGwpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzaGFwZSBzZXQnKTtcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygncG9seWN2Jyk7XG5cbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBuZXcgQ1ZQb2x5Z29uKGlkLCBjb2xvciwgW3RoaXMub3JpZ2luLCB0aGlzLnNlY29uZFBvaW50LCBuZXdWZXJ0ZXhdKTtcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbmV3VmVydGV4ID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9seSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkuYWRkVmVydGV4KG5ld1ZlcnRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuZWRpdFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xuaW1wb3J0IENvbG9yIGZyb20gJy4uLy4uLy4uL0Jhc2UvQ29sb3InO1xuaW1wb3J0IFZlcnRleCBmcm9tICcuLi8uLi8uLi9CYXNlL1ZlcnRleCc7XG5pbXBvcnQgRmFuUG9seWdvbiBmcm9tICcuLi8uLi8uLi9TaGFwZXMvRmFuUG9seWdvbic7XG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vSVNoYXBlTWFrZXJDb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlclxuICAgIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyXG57XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIG9yaWdpbjogVmVydGV4IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSBjdXJyZW50UG9seTogRmFuUG9seWdvbiB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgc2V0UG9seWdvbkJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcblxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICdzZXQtcG9seWdvbidcbiAgICAgICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uLmNsYXNzTGlzdC5yZW1vdmUoJ2hpZGRlbicpO1xuXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJlxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgIT09IG51bGwgJiZcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5LnBvaW50TGlzdC5sZW5ndGggPiAyXG4gICAgICAgICAgICApIHtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gbnVsbDtcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgc2V0Q3VycmVudFBvbHlnb24oaWQ6IHN0cmluZykge1xuICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gdGhpcy5hcHBDYW52YXMuc2hhcGVzW2lkXSBhcyBGYW5Qb2x5Z29uO1xuICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuY3VycmVudFBvbHkucG9pbnRMaXN0WzBdO1xuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBjb25zdCB7IHIsIGcsIGIgfSA9IGhleFRvUmdiKGhleCkgPz8geyByOiAwLCBnOiAwLCBiOiAwIH07XG4gICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUpO1xuXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLmN1cnJlbnRQb2x5ID09PSBudWxsKSB7XG4gICAgICAgICAgICBjb25zdCBuZXdWZXJ0ZXggPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3BvbHlmYW4nKTtcblxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSA9IG5ldyBGYW5Qb2x5Z29uKGlkLCBjb2xvciwgW3RoaXMub3JpZ2luLCBuZXdWZXJ0ZXhdKTtcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgbmV3VmVydGV4ID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9seSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkuYWRkVmVydGV4KG5ld1ZlcnRleCk7XG4gICAgICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuZWRpdFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBMaW5lIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvTGluZVwiO1xuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gXCIuL0lTaGFwZU1ha2VyQ29udHJvbGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHtyLCBnLCBifSA9IGhleFRvUmdiKGhleCkgPz8ge3I6IDAsIGc6IDAsIGI6IDB9O1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdsaW5lJyk7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoaWQsIGNvbG9yLCB0aGlzLm9yaWdpbi54LCB0aGlzLm9yaWdpbi55LCB4LCB5KTtcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKGxpbmUpO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvUmVjdGFuZ2xlXCI7XG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB7ciwgZywgYn0gPSBoZXhUb1JnYihoZXgpID8/IHtyOiAwLCBnOiAwLCBiOiAwfTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygncmVjdGFuZ2xlJyk7XG4gICAgICAgICAgICBjb25zdCByZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdGhpcy5vcmlnaW4ueCwgdGhpcy5vcmlnaW4ueSwgeCwgeSwwLDEsMSk7XG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZShyZWN0YW5nbGUpO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgU3F1YXJlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvU3F1YXJlXCI7XG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB7ciwgZywgYn0gPSBoZXhUb1JnYihoZXgpID8/IHtyOiAwLCBnOiAwLCBiOiAwfTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygnc3F1YXJlJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHYxID0ge3g6IHgsIHk6IHl9O1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHYxeDogJHt2MS54fSwgdjF5OiAke3YxLnl9YClcblxuICAgICAgICAgICAgY29uc3QgdjIgPSB7eDogdGhpcy5vcmlnaW4ueCAtICh5IC0gdGhpcy5vcmlnaW4ueSksIFxuICAgICAgICAgICAgICAgIHk6IHRoaXMub3JpZ2luLnkgKyAoeC10aGlzLm9yaWdpbi54KX1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2Mng6ICR7djIueH0sIHYyeTogJHt2Mi55fWApXG5cbiAgICAgICAgICAgIGNvbnN0IHYzID0ge3g6IDIqdGhpcy5vcmlnaW4ueCAtIHgsIFxuICAgICAgICAgICAgICAgIHk6IDIqdGhpcy5vcmlnaW4ueSAtIHl9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjN4OiAke3YzLnh9LCB2M3k6ICR7djMueX1gKVxuXG4gICAgICAgICAgICBjb25zdCB2NCA9IHt4OiB0aGlzLm9yaWdpbi54ICsgKHkgLSB0aGlzLm9yaWdpbi55KSwgXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSAtICh4LXRoaXMub3JpZ2luLngpfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHY0eDogJHt2NC54fSwgdjR5OiAke3Y0Lnl9YClcblxuICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gbmV3IFNxdWFyZShcbiAgICAgICAgICAgICAgICBpZCwgY29sb3IsIHYxLngsIHYxLnksIHYyLngsIHYyLnksIHYzLngsIHYzLnksIHY0LngsIHY0LnkpO1xuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUoc3F1YXJlKTtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgQ1ZQb2x5Z29uIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9DVlBvbHlnb24nO1xuaW1wb3J0IHsgZGVnVG9SYWQsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi4vLi4vTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XG5pbXBvcnQgeyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1ZQb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgc2NhbGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIERFRkFVTFRfU0NBTEUgPSA1MDtcblxuICAgIHByaXZhdGUgY3VycmVudFNjYWxlOiBudW1iZXIgPSA1MDtcbiAgICBwcml2YXRlIGN2UG9seTogQ1ZQb2x5Z29uO1xuICAgIHByaXZhdGUgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBmYW5Qb2x5OiBDVlBvbHlnb24sXG4gICAgICAgIGFwcENhbnZhczogQXBwQ2FudmFzLFxuICAgICAgICBjYW52YXNDb250cm9sbGVyOiBDYW52YXNDb250cm9sbGVyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGZhblBvbHksIGFwcENhbnZhcyk7XG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlciA9IGNhbnZhc0NvbnRyb2xsZXI7XG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlci50b29sYmFyT25DbGlja0NiID0gdGhpcy5pbml0VmVydGV4VG9vbGJhci5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuY3ZQb2x5ID0gZmFuUG9seTtcblxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcbiAgICAgICAgICAgICgpID0+IGZhblBvbHkucG9pbnRMaXN0WzBdLngsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFknLFxuICAgICAgICAgICAgKCkgPT4gZmFuUG9seS5wb2ludExpc3RbMF0ueSxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuc2NhbGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdTY2FsZScsXG4gICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRTY2FsZS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIDEwMFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMuc2NhbGVTbGlkZXIsICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2NhbGUocGFyc2VJbnQodGhpcy5zY2FsZVNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjdXN0b21WZXJ0ZXhUb29sYmFyKCkge1xuICAgICAgICBjb25zdCBhZGRWdHhCdXR0b24gPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbignQWRkIFZlcnRleCcpO1xuICAgICAgICBhZGRWdHhCdXR0b24ub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIuZWRpdEV4aXN0aW5nQ1ZQb2x5Z29uKHRoaXMuY3ZQb2x5LmlkKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByZW1vdmVWdHhCdXR0b24gPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbignUmVtb3ZlIFZlcnRleCcpO1xuICAgICAgICByZW1vdmVWdHhCdXR0b24ub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmN2UG9seS5yZW1vdmVWZXJ0ZXgocGFyc2VJbnQodGhpcy5zZWxlY3RlZFZlcnRleCkpO1xuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmN2UG9seSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjcmVhdGVWZXJ0ZXhCdXR0b24odGV4dDogc3RyaW5nKTogSFRNTEJ1dHRvbkVsZW1lbnQge1xuICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dDtcblxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xuXG4gICAgICAgIHJldHVybiBidXR0b247XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NYKG5ld1Bvc1g6IG51bWJlcikge1xuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWCAtIHRoaXMuY3ZQb2x5LnBvaW50TGlzdFswXS54O1xuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3QgPSB0aGlzLmN2UG9seS5wb2ludExpc3QubWFwKCh2dHgpID0+IHtcbiAgICAgICAgICAgIHZ0eC54ICs9IGRpZmY7XG4gICAgICAgICAgICByZXR1cm4gdnR4O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdlBvbHkucmVjYWxjKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5jdlBvbHkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1kgLSB0aGlzLmN2UG9seS5wb2ludExpc3RbMF0ueTtcbiAgICAgICAgdGhpcy5jdlBvbHkucG9pbnRMaXN0ID0gdGhpcy5jdlBvbHkucG9pbnRMaXN0Lm1hcCgodnR4LCBpZHgpID0+IHtcbiAgICAgICAgICAgIHZ0eC55ICs9IGRpZmY7XG4gICAgICAgICAgICByZXR1cm4gdnR4O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5jdlBvbHkucmVjYWxjKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5jdlBvbHkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q3VycmVudFNjYWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NhbGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTY2FsZShuZXdTY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gbmV3U2NhbGU7XG4gICAgICAgIHRoaXMuY3ZQb2x5LnBvaW50TGlzdCA9IHRoaXMuY3ZQb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCByYWQgPSBkZWdUb1JhZChnZXRBbmdsZSh0aGlzLmN2UG9seS5jZW50ZXIsIHZ0eCkpO1xuICAgICAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MocmFkKTtcbiAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XG5cbiAgICAgICAgICAgIHZ0eC54ID1cbiAgICAgICAgICAgICAgICB0aGlzLmN2UG9seS5jZW50ZXIueCArXG4gICAgICAgICAgICAgICAgY29zICpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdlBvbHkubGVuTGlzdFtpZHhdICpcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcbiAgICAgICAgICAgIHZ0eC55ID1cbiAgICAgICAgICAgICAgICB0aGlzLmN2UG9seS5jZW50ZXIueSAtXG4gICAgICAgICAgICAgICAgc2luICpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdlBvbHkubGVuTGlzdFtpZHhdICpcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcblxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5jdlBvbHkpO1xuICAgIH1cblxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdlBvbHkucG9pbnRMaXN0W2lkeF0ueCA9IHg7XG4gICAgICAgIHRoaXMuY3ZQb2x5LnBvaW50TGlzdFtpZHhdLnkgPSB5O1xuICAgICAgICB0aGlzLmN2UG9seS5yZWNhbGMoKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuY3ZQb2x5KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgRmFuUG9seWdvbiBmcm9tICcuLi8uLi8uLi9TaGFwZXMvRmFuUG9seWdvbic7XG5pbXBvcnQgeyBkZWdUb1JhZCwgZ2V0QW5nbGUgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XG5pbXBvcnQgQ2FudmFzQ29udHJvbGxlciBmcm9tICcuLi8uLi9NYWtlci9DYW52YXNDb250cm9sbGVyJztcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgc2NhbGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIERFRkFVTFRfU0NBTEUgPSA1MDtcblxuICAgIHByaXZhdGUgY3VycmVudFNjYWxlOiBudW1iZXIgPSA1MDtcbiAgICBwcml2YXRlIGZhblBvbHk6IEZhblBvbHlnb247XG4gICAgcHJpdmF0ZSBjYW52YXNDb250cm9sbGVyOiBDYW52YXNDb250cm9sbGVyO1xuXG4gICAgY29uc3RydWN0b3IoXG4gICAgICAgIGZhblBvbHk6IEZhblBvbHlnb24sXG4gICAgICAgIGFwcENhbnZhczogQXBwQ2FudmFzLFxuICAgICAgICBjYW52YXNDb250cm9sbGVyOiBDYW52YXNDb250cm9sbGVyXG4gICAgKSB7XG4gICAgICAgIHN1cGVyKGZhblBvbHksIGFwcENhbnZhcyk7XG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlciA9IGNhbnZhc0NvbnRyb2xsZXI7XG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlci50b29sYmFyT25DbGlja0NiID0gdGhpcy5pbml0VmVydGV4VG9vbGJhci5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMuZmFuUG9seSA9IGZhblBvbHk7XG5cbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXG4gICAgICAgICAgICAnUG9zaXRpb24gWCcsXG4gICAgICAgICAgICAoKSA9PiBmYW5Qb2x5LnBvaW50TGlzdFswXS54LFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIGFwcENhbnZhcy53aWR0aFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdQb3NpdGlvbiBZJyxcbiAgICAgICAgICAgICgpID0+IGZhblBvbHkucG9pbnRMaXN0WzBdLnksXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgYXBwQ2FudmFzLmhlaWdodFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnNjYWxlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXG4gICAgICAgICAgICAnU2NhbGUnLFxuICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50U2NhbGUuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICAxMDBcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnNjYWxlU2xpZGVyLCAoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjYWxlKHBhcnNlSW50KHRoaXMuc2NhbGVTbGlkZXIudmFsdWUpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgY3VzdG9tVmVydGV4VG9vbGJhcigpIHtcbiAgICAgICAgY29uc3QgYWRkVnR4QnV0dG9uID0gdGhpcy5jcmVhdGVWZXJ0ZXhCdXR0b24oJ0FkZCBWZXJ0ZXgnKTtcbiAgICAgICAgYWRkVnR4QnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgdGhpcy5jYW52YXNDb250cm9sbGVyLmVkaXRFeGlzdGluZ0ZhblBvbHlnb24odGhpcy5mYW5Qb2x5LmlkKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcbiAgICAgICAgfTtcblxuICAgICAgICBjb25zdCByZW1vdmVWdHhCdXR0b24gPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbignUmVtb3ZlIFZlcnRleCcpO1xuICAgICAgICByZW1vdmVWdHhCdXR0b24ub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB0aGlzLmZhblBvbHkucmVtb3ZlVmVydGV4KHBhcnNlSW50KHRoaXMuc2VsZWN0ZWRWZXJ0ZXgpKTtcbiAgICAgICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5mYW5Qb2x5KTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGNyZWF0ZVZlcnRleEJ1dHRvbih0ZXh0OiBzdHJpbmcpOiBIVE1MQnV0dG9uRWxlbWVudCB7XG4gICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpIGFzIEhUTUxCdXR0b25FbGVtZW50O1xuICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSB0ZXh0O1xuXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG5cbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NYIC0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdFswXS54O1xuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCkgPT4ge1xuICAgICAgICAgICAgdnR4LnggKz0gZGlmZjtcbiAgICAgICAgICAgIHJldHVybiB2dHg7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLmZhblBvbHkucmVjYWxjKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5mYW5Qb2x5KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NZIC0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdFswXS55O1xuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XG4gICAgICAgICAgICB2dHgueSArPSBkaWZmO1xuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcbiAgICAgICAgfSk7XG4gICAgICAgIHRoaXMuZmFuUG9seS5yZWNhbGMoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0Q3VycmVudFNjYWxlKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NhbGU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTY2FsZShuZXdTY2FsZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuY3VycmVudFNjYWxlID0gbmV3U2NhbGU7XG4gICAgICAgIHRoaXMuZmFuUG9seS5wb2ludExpc3QgPSB0aGlzLmZhblBvbHkucG9pbnRMaXN0Lm1hcCgodnR4LCBpZHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKGdldEFuZ2xlKHRoaXMuZmFuUG9seS5jZW50ZXIsIHZ0eCkpO1xuICAgICAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MocmFkKTtcbiAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XG5cbiAgICAgICAgICAgIHZ0eC54ID1cbiAgICAgICAgICAgICAgICB0aGlzLmZhblBvbHkuY2VudGVyLnggK1xuICAgICAgICAgICAgICAgIGNvcyAqXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZmFuUG9seS5sZW5MaXN0W2lkeF0gKlxuICAgICAgICAgICAgICAgICAgICAobmV3U2NhbGUgLyB0aGlzLkRFRkFVTFRfU0NBTEUpO1xuICAgICAgICAgICAgdnR4LnkgPVxuICAgICAgICAgICAgICAgIHRoaXMuZmFuUG9seS5jZW50ZXIueSAtXG4gICAgICAgICAgICAgICAgc2luICpcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5Lmxlbkxpc3RbaWR4XSAqXG4gICAgICAgICAgICAgICAgICAgIChuZXdTY2FsZSAvIHRoaXMuREVGQVVMVF9TQ0FMRSk7XG5cbiAgICAgICAgICAgIHJldHVybiB2dHg7XG4gICAgICAgIH0pO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XG4gICAgfVxuXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0W2lkeF0ueCA9IHg7XG4gICAgICAgIHRoaXMuZmFuUG9seS5wb2ludExpc3RbaWR4XS55ID0geTtcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnJlY2FsYygpO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5mYW5Qb2x5KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgTGluZSBmcm9tICcuLi8uLi8uLi9TaGFwZXMvTGluZSc7XG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgbGVuZ3RoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHJvdGF0ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcblxuICAgIHByaXZhdGUgbGluZTogTGluZTtcblxuICAgIGNvbnN0cnVjdG9yKGxpbmU6IExpbmUsIGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHN1cGVyKGxpbmUsIGFwcENhbnZhcyk7XG5cbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcblxuICAgICAgICBjb25zdCBkaWFnb25hbCA9IE1hdGguc3FydChcbiAgICAgICAgICAgIGFwcENhbnZhcy53aWR0aCAqIGFwcENhbnZhcy53aWR0aCArXG4gICAgICAgICAgICAgICAgYXBwQ2FudmFzLmhlaWdodCAqIGFwcENhbnZhcy5oZWlnaHRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5sZW5ndGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdMZW5ndGgnLFxuICAgICAgICAgICAgKCkgPT4gbGluZS5sZW5ndGgsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgZGlhZ29uYWxcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlTGVuZ3RoKHBhcnNlSW50KHRoaXMubGVuZ3RoU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFgnLFxuICAgICAgICAgICAgKCkgPT4gbGluZS5wb2ludExpc3RbMF0ueCxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGhcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1hTbGlkZXIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFknLFxuICAgICAgICAgICAgKCkgPT4gbGluZS5wb2ludExpc3RbMF0ueSxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsIHRoaXMuY3VycmVudEFuZ2xlLmJpbmQodGhpcyksIDAsIDM2MCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5yb3RhdGVTbGlkZXIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlTGVuZ3RoKG5ld0xlbjogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGxpbmVMZW4gPSBldWNsaWRlYW5EaXN0YW5jZVZ0eChcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdXG4gICAgICAgICk7XG4gICAgICAgIGNvbnN0IGNvcyA9XG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS54IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS54KSAvIGxpbmVMZW47XG4gICAgICAgIGNvbnN0IHNpbiA9XG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55KSAvIGxpbmVMZW47XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9IG5ld0xlbiAqIGNvcyArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID0gbmV3TGVuICogc2luICsgdGhpcy5saW5lLnBvaW50TGlzdFswXS55O1xuXG4gICAgICAgIHRoaXMubGluZS5sZW5ndGggPSBuZXdMZW47XG5cbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMubGluZS5wb2ludExpc3RbMV0ueCAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS54ID0gbmV3UG9zWDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3UG9zWCArIGRpZmY7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnk7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSA9IG5ld1Bvc1k7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld1Bvc1kgKyBkaWZmO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjdXJyZW50QW5nbGUoKSB7XG4gICAgICAgIHJldHVybiBnZXRBbmdsZSh0aGlzLmxpbmUucG9pbnRMaXN0WzBdLCB0aGlzLmxpbmUucG9pbnRMaXN0WzFdKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKG5ld1JvdDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKG5ld1JvdCk7XG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZCk7XG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XG5cbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID1cbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCArIGNvcyAqIHRoaXMubGluZS5sZW5ndGg7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9XG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnkgLSBzaW4gKiB0aGlzLmxpbmUubGVuZ3RoO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbaWR4XS54ID0geDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFtpZHhdLnkgPSB5O1xuXG4gICAgICAgIHRoaXMubGluZS5sZW5ndGggPSBldWNsaWRlYW5EaXN0YW5jZVZ0eChcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0sXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIGN1c3RvbVZlcnRleFRvb2xiYXIoKTogdm9pZCB7fVxufVxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xuaW1wb3J0IFJlY3RhbmdsZSBmcm9tICcuLi8uLi8uLi9TaGFwZXMvUmVjdGFuZ2xlJztcbmltcG9ydCB7IGRlZ1RvUmFkLCBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSB3aWR0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIGxlbmd0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHJvdGF0ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcblxuICAgIHByaXZhdGUgcmVjdGFuZ2xlOiBSZWN0YW5nbGU7XG4gICAgcHJpdmF0ZSBpbml0aWFsUm90YXRpb25WYWx1ZTogbnVtYmVyID0gMDtcblxuICAgIGNvbnN0cnVjdG9yKHJlY3RhbmdsZTogUmVjdGFuZ2xlLCBhcHBDYW52YXM6IEFwcENhbnZhcyl7XG4gICAgICAgIHN1cGVyKHJlY3RhbmdsZSwgYXBwQ2FudmFzKTtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUgPSByZWN0YW5nbGU7XG5cbiAgICAgICAgLy8gWCBQb3NpdGlvblxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWCcsICgpID0+IHJlY3RhbmdsZS5jZW50ZXIueCwxLGFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgLy8gWSBQb3NpdGlvblxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWScsICgpID0+IHJlY3RhbmdsZS5jZW50ZXIueSwxLGFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy5sZW5ndGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignTGVuZ3RoJywgKCkgPT4gcmVjdGFuZ2xlLmxlbmd0aCwgMSwgYXBwQ2FudmFzLndpZHRoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpfSlcblxuICAgICAgICB0aGlzLndpZHRoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1dpZHRoJywgKCkgPT4gdGhpcy5yZWN0YW5nbGUud2lkdGgsIDEsIGFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy53aWR0aFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVdpZHRoKHBhcnNlSW50KHRoaXMud2lkdGhTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUm90YXRpb24nLCAoKSA9PiAwLCAtMTgwLCAxODApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge3RoaXMuaGFuZGxlUm90YXRpb25FbmR9KVxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCB0aGlzLmhhbmRsZVJvdGF0aW9uU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoc3RhcnQnLCB0aGlzLmhhbmRsZVJvdGF0aW9uU3RhcnQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZVJvdGF0aW9uRW5kLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIHRoaXMuaGFuZGxlUm90YXRpb25FbmQuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NYKG5ld1Bvc1g6bnVtYmVyKXtcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1ggLSB0aGlzLnJlY3RhbmdsZS5jZW50ZXIueDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS54ICs9IGRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWN0YW5nbGUucmVjYWxjdWxhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6bnVtYmVyKXtcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1kgLSB0aGlzLnJlY3RhbmdsZS5jZW50ZXIueTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS55ICs9IGRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWN0YW5nbGUucmVjYWxjdWxhdGUoKTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuZ3RoOm51bWJlcil7XG5cbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSAtdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnM7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnVwZGF0ZVBvaW50TGlzdFdpdGhUcmFuc2Zvcm1hdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRMZW5ndGggPSBldWNsaWRlYW5EaXN0YW5jZVZ0eCh0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbMF0sIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFsxXSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9IG5ld0xlbmd0aCAvIGN1cnJlbnRMZW5ndGg7XG4gICAgICAgIGZvcihsZXQgaT0xOyBpPDQ7IGkrKyl7XG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaV0ueCA9IHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFswXS54ICsgKHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS54IC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0WzBdLngpICogc2NhbGVGYWN0b3I7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucyA9IC10aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucztcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUudXBkYXRlUG9pbnRMaXN0V2l0aFRyYW5zZm9ybWF0aW9uKCk7XG5cbiAgICAgICAgLy8gdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSAwO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlV2lkdGgobmV3V2lkdGg6bnVtYmVyKXtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSAtdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnM7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnVwZGF0ZVBvaW50TGlzdFdpdGhUcmFuc2Zvcm1hdGlvbigpO1xuXG4gICAgICAgIGNvbnN0IGN1cnJlbnRXaWR0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFsxXSwgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0WzNdKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gbmV3V2lkdGggLyBjdXJyZW50V2lkdGg7XG4gICAgICAgIGZvcihsZXQgaT0xOyBpPDQ7IGkrKyl7XG4gICAgICAgICAgICBpZiAoaSAhPSAxKVxuICAgICAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS55ID0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0WzFdLnkgKyAodGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnkgLSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbMV0ueSkgKiBzY2FsZUZhY3RvcjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucyA9IC10aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucztcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUudXBkYXRlUG9pbnRMaXN0V2l0aFRyYW5zZm9ybWF0aW9uKCk7XG4gICAgICAgIC8vIHRoaXMucmVjdGFuZ2xlLmFuZ2xlSW5SYWRpYW5zID0gMDtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVSb3RhdGlvblN0YXJ0KGU6IEV2ZW50KSB7XG4gICAgICAgIHRoaXMuaW5pdGlhbFJvdGF0aW9uVmFsdWUgPSBwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBoYW5kbGVSb3RhdGlvbkVuZChlOiBFdmVudCkge1xuICAgICAgICBsZXQgZmluYWxSb3RhdGlvblZhbHVlID0gcGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpO1xuICAgICAgICBsZXQgZGVsdGFSb3RhdGlvbiA9IGZpbmFsUm90YXRpb25WYWx1ZSAtIHRoaXMuaW5pdGlhbFJvdGF0aW9uVmFsdWU7XG4gICAgICAgIHRoaXMudXBkYXRlUm90YXRpb24odGhpcy5pbml0aWFsUm90YXRpb25WYWx1ZSwgZGVsdGFSb3RhdGlvbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihpbml0aWFsUm90YXRpb246IG51bWJlciwgZGVsdGFSb3RhdGlvbjogbnVtYmVyKXtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSBkZWdUb1JhZChkZWx0YVJvdGF0aW9uKTtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUudXBkYXRlUG9pbnRMaXN0V2l0aFRyYW5zZm9ybWF0aW9uKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xuICAgIH1cblxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lke1xuICAgICAgICBjb25zdCBtb3ZlZFZlcnRleCA9IHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpZHhdO1xuICAgICAgICBjb25zdCBkeCA9IHggLSBtb3ZlZFZlcnRleC54O1xuICAgICAgICBjb25zdCBkeSA9IHkgLSBtb3ZlZFZlcnRleC55O1xuXG4gICAgICAgIG1vdmVkVmVydGV4LnggPSB4O1xuICAgICAgICBtb3ZlZFZlcnRleC55ID0geTtcbiAgICAgICAgY29uc3QgY3dBZGphY2VudElkeCA9IHRoaXMucmVjdGFuZ2xlLmZpbmRDV0FkamFjZW50KGlkeCk7XG4gICAgICAgIGNvbnN0IGNjd0FkamFjZW50SWR4ID0gdGhpcy5yZWN0YW5nbGUuZmluZENDV0FkamFjZW50KGlkeCk7XG5cbiAgICAgICAgaWYgKGlkeCAlIDIgPT09IDApIHtcbiAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtjd0FkamFjZW50SWR4XS54ICs9IGR4O1xuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2Njd0FkamFjZW50SWR4XS55ICs9IGR5O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2N3QWRqYWNlbnRJZHhdLnkgKz0gZHk7XG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbY2N3QWRqYWNlbnRJZHhdLnggKz0gZHg7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY3RhbmdsZS5yZWNhbGN1bGF0ZSgpXG4gICAgICAgXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xuICAgIH1cbiAgICBjdXN0b21WZXJ0ZXhUb29sYmFyKCk6IHZvaWQge31cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uLy4uLy4uL0Jhc2UvQmFzZVNoYXBlJztcbmltcG9ydCBDb2xvciBmcm9tICcuLi8uLi8uLi9CYXNlL0NvbG9yJztcbmltcG9ydCB7IGhleFRvUmdiLCByZ2JUb0hleCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xuICAgIHB1YmxpYyBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIHNoYXBlOiBCYXNlU2hhcGU7XG5cbiAgICBwcml2YXRlIHRvb2xiYXJDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHB1YmxpYyB2ZXJ0ZXhDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuXG4gICAgcHVibGljIHZlcnRleFBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gICAgcHVibGljIHNlbGVjdGVkVmVydGV4ID0gJzAnO1xuXG4gICAgcHVibGljIHZ0eFBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgdnR4UG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIHB1YmxpYyB2dHhDb2xvclBpY2tlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBzbGlkZXJMaXN0OiBIVE1MSW5wdXRFbGVtZW50W10gPSBbXTtcbiAgICBwcml2YXRlIGdldHRlckxpc3Q6ICgoKSA9PiBudW1iZXIpW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHNoYXBlOiBCYXNlU2hhcGUsIGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuc2hhcGUgPSBzaGFwZTtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG5cbiAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICd2ZXJ0ZXgtY29udGFpbmVyJ1xuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMudmVydGV4UGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndmVydGV4LXBpY2tlcidcbiAgICAgICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcblxuICAgICAgICB0aGlzLmluaXRWZXJ0ZXhUb29sYmFyKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlU2xpZGVyKFxuICAgICAgICBsYWJlbDogc3RyaW5nLFxuICAgICAgICB2YWx1ZUdldHRlcjogKCkgPT4gbnVtYmVyLFxuICAgICAgICBtaW46IG51bWJlcixcbiAgICAgICAgbWF4OiBudW1iZXJcbiAgICApOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcblxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xuXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgc2xpZGVyLnR5cGUgPSAncmFuZ2UnO1xuICAgICAgICBzbGlkZXIubWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICAgIHNsaWRlci5tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgICAgc2xpZGVyLnZhbHVlID0gdmFsdWVHZXR0ZXIoKS50b1N0cmluZygpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcblxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgICAgICB0aGlzLnNsaWRlckxpc3QucHVzaChzbGlkZXIpO1xuICAgICAgICB0aGlzLmdldHRlckxpc3QucHVzaCh2YWx1ZUdldHRlcik7XG5cbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcbiAgICB9XG5cbiAgICByZWdpc3RlclNsaWRlcihzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQsIGNiOiAoZTogRXZlbnQpID0+IGFueSkge1xuICAgICAgICBjb25zdCBuZXdDYiA9IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY2IoZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlcnMoc2xpZGVyKTtcbiAgICAgICAgfTtcbiAgICAgICAgc2xpZGVyLm9uY2hhbmdlID0gbmV3Q2I7XG4gICAgICAgIHNsaWRlci5vbmlucHV0ID0gbmV3Q2I7XG4gICAgfVxuXG4gICAgdXBkYXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xuICAgICAgICB0aGlzLmFwcENhbnZhcy5lZGl0U2hhcGUobmV3U2hhcGUpO1xuICAgIH1cblxuICAgIHVwZGF0ZVNsaWRlcnMoaWdub3JlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50KSB7XG4gICAgICAgIHRoaXMuc2xpZGVyTGlzdC5mb3JFYWNoKChzbGlkZXIsIGlkeCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlnbm9yZVNsaWRlciA9PT0gc2xpZGVyKSByZXR1cm47XG4gICAgICAgICAgICBzbGlkZXIudmFsdWUgPSB0aGlzLmdldHRlckxpc3RbaWR4XSgpLnRvU3RyaW5nKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLnZ0eFBvc1hTbGlkZXIgJiYgdGhpcy52dHhQb3NZU2xpZGVyKSB7XG4gICAgICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludCh0aGlzLnZlcnRleFBpY2tlci52YWx1ZSk7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdO1xuXG4gICAgICAgICAgICB0aGlzLnZ0eFBvc1hTbGlkZXIudmFsdWUgPSB2ZXJ0ZXgueC50b1N0cmluZygpO1xuICAgICAgICAgICAgdGhpcy52dHhQb3NZU2xpZGVyLnZhbHVlID0gdmVydGV4LnkudG9TdHJpbmcoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGNyZWF0ZVNsaWRlclZlcnRleChcbiAgICAgICAgbGFiZWw6IHN0cmluZyxcbiAgICAgICAgY3VycmVudExlbmd0aDogbnVtYmVyLFxuICAgICAgICBtaW46IG51bWJlcixcbiAgICAgICAgbWF4OiBudW1iZXJcbiAgICApOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcblxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xuXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgc2xpZGVyLnR5cGUgPSAncmFuZ2UnO1xuICAgICAgICBzbGlkZXIubWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICAgIHNsaWRlci5tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgICAgc2xpZGVyLnZhbHVlID0gY3VycmVudExlbmd0aC50b1N0cmluZygpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcblxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gICAgICAgIHJldHVybiBzbGlkZXI7XG4gICAgfVxuXG4gICAgY3JlYXRlQ29sb3JQaWNrZXJWZXJ0ZXgobGFiZWw6IHN0cmluZywgaGV4OiBzdHJpbmcpOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcblxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xuXG4gICAgICAgIGNvbnN0IGNvbG9yUGlja2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBjb2xvclBpY2tlci50eXBlID0gJ2NvbG9yJztcbiAgICAgICAgY29sb3JQaWNrZXIudmFsdWUgPSBoZXg7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb2xvclBpY2tlcik7XG5cbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgICAgICByZXR1cm4gY29sb3JQaWNrZXI7XG4gICAgfVxuXG4gICAgZHJhd1ZlcnRleFRvb2xiYXIoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKVxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy52ZXJ0ZXhDb250YWluZXIuZmlyc3RDaGlsZCk7XG5cbiAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQodGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUpO1xuICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdO1xuXG4gICAgICAgIHRoaXMudnR4UG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyVmVydGV4KFxuICAgICAgICAgICAgJ1BvcyBYJyxcbiAgICAgICAgICAgIHZlcnRleC54LFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLndpZHRoXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy52dHhQb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXJWZXJ0ZXgoXG4gICAgICAgICAgICAnUG9zIFknLFxuICAgICAgICAgICAgdmVydGV4LnksXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuaGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlU2xpZGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWZXJ0ZXgoXG4gICAgICAgICAgICAgICAgICAgIGlkeCxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NZU2xpZGVyLnZhbHVlKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy52dHhDb2xvclBpY2tlciA9IHRoaXMuY3JlYXRlQ29sb3JQaWNrZXJWZXJ0ZXgoXG4gICAgICAgICAgICAnQ29sb3InLFxuICAgICAgICAgICAgcmdiVG9IZXgodmVydGV4LmMuciAqIDI1NSwgdmVydGV4LmMuZyAqIDI1NSwgdmVydGV4LmMuYiAqIDI1NSlcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCB1cGRhdGVDb2xvciA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gaGV4VG9SZ2IoXG4gICAgICAgICAgICAgICAgdGhpcy52dHhDb2xvclBpY2tlcj8udmFsdWUgPz8gJyMwMDAwMDAnXG4gICAgICAgICAgICApID8/IHsgcjogMCwgZzogMCwgYjogMCB9O1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3IociAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF0uYyA9IGNvbG9yO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVWZXJ0ZXgoXG4gICAgICAgICAgICAgICAgaWR4LFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHRoaXMudnR4UG9zWFNsaWRlcj8udmFsdWUgPz8gdmVydGV4LngudG9TdHJpbmcoKSksXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NZU2xpZGVyPy52YWx1ZSA/PyB2ZXJ0ZXgueS50b1N0cmluZygpKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4UG9zWFNsaWRlciwgdXBkYXRlU2xpZGVyKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnZ0eFBvc1lTbGlkZXIsIHVwZGF0ZVNsaWRlcik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhDb2xvclBpY2tlciwgdXBkYXRlQ29sb3IpO1xuXG4gICAgICAgIHRoaXMuY3VzdG9tVmVydGV4VG9vbGJhcigpO1xuICAgIH1cblxuICAgIGluaXRWZXJ0ZXhUb29sYmFyKCkge1xuICAgICAgICB3aGlsZSAodGhpcy52ZXJ0ZXhQaWNrZXIuZmlyc3RDaGlsZClcbiAgICAgICAgICAgIHRoaXMudmVydGV4UGlja2VyLnJlbW92ZUNoaWxkKHRoaXMudmVydGV4UGlja2VyLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgIHRoaXMuc2hhcGUucG9pbnRMaXN0LmZvckVhY2goKF8sIGlkeCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBpZHgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIG9wdGlvbi5sYWJlbCA9IGBWZXJ0ZXggJHtpZHh9YDtcbiAgICAgICAgICAgIHRoaXMudmVydGV4UGlja2VyLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudmVydGV4UGlja2VyLnZhbHVlID0gJzAnO1xuICAgICAgICB0aGlzLnNlbGVjdGVkVmVydGV4ID0gdGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWU7XG4gICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcblxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRWZXJ0ZXggPSB0aGlzLnZlcnRleFBpY2tlci52YWx1ZTtcbiAgICAgICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBjdXN0b21WZXJ0ZXhUb29sYmFyKCk6IHZvaWQ7XG4gICAgYWJzdHJhY3QgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQ7XG59XG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgU3F1YXJlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvU3F1YXJlXCI7XG5pbXBvcnQgeyBkZWdUb1JhZCB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gXCIuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXJcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzaXplU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIC8vIHByaXZhdGUgcG9pbnRTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBpbml0aWFsUm90YXRpb25WYWx1ZTogbnVtYmVyID0gMDtcblxuICAgIHByaXZhdGUgc3F1YXJlOiBTcXVhcmU7XG5cbiAgICBjb25zdHJ1Y3RvcihzcXVhcmU6IFNxdWFyZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpe1xuICAgICAgICBzdXBlcihzcXVhcmUsIGFwcENhbnZhcyk7XG4gICAgICAgIHRoaXMuc3F1YXJlID0gc3F1YXJlO1xuXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBYJywgKCkgPT4gc3F1YXJlLmNlbnRlci54LDEsYXBwQ2FudmFzLndpZHRoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1hTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpfSlcblxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWScsICgpID0+IHNxdWFyZS5jZW50ZXIueSwxLGFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy5zaXplU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1NpemUnLCAoKSA9PiBzcXVhcmUuc2l6ZSwgMSwgYXBwQ2FudmFzLndpZHRoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnNpemVTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVTaXplKHBhcnNlSW50KHRoaXMuc2l6ZVNsaWRlci52YWx1ZSkpfSlcblxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsICgpID0+IDAsIC0xODAsIDE4MCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5yb3RhdGVTbGlkZXIsIChlKSA9PiB7dGhpcy5oYW5kbGVSb3RhdGlvbkVuZH0pXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlUm90YXRpb25TdGFydC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcigndG91Y2hzdGFydCcsIHRoaXMuaGFuZGxlUm90YXRpb25TdGFydC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZXIuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuaGFuZGxlUm90YXRpb25FbmQuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5oYW5kbGVSb3RhdGlvbkVuZC5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDpudW1iZXIpe1xuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWCAtIHRoaXMuc3F1YXJlLmNlbnRlci54O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnggKz0gZGlmZjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNxdWFyZS5yZWNhbGN1bGF0ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTpudW1iZXIpe1xuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWSAtIHRoaXMuc3F1YXJlLmNlbnRlci55O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnkgKz0gZGlmZjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnNxdWFyZS5yZWNhbGN1bGF0ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVNpemUobmV3U2l6ZTogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGhhbGZOZXdTaXplID0gbmV3U2l6ZSAvIDI7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5zcXVhcmUuYW5nbGVJblJhZGlhbnM7XG5cbiAgICAgICAgY29uc3Qgb2Zmc2V0cyA9IFtcbiAgICAgICAgICAgIHsgeDogLWhhbGZOZXdTaXplLCB5OiAtaGFsZk5ld1NpemUgfSwgLy8gVG9wIGxlZnRcbiAgICAgICAgICAgIHsgeDogaGFsZk5ld1NpemUsIHk6IC1oYWxmTmV3U2l6ZSB9LCAgLy8gVG9wIHJpZ2h0XG4gICAgICAgICAgICB7IHg6IGhhbGZOZXdTaXplLCB5OiBoYWxmTmV3U2l6ZSB9LCAgIC8vIEJvdHRvbSByaWdodFxuICAgICAgICAgICAgeyB4OiAtaGFsZk5ld1NpemUsIHk6IGhhbGZOZXdTaXplIH0sICAvLyBCb3R0b20gbGVmdFxuICAgICAgICBdO1xuICAgIFxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gb2Zmc2V0c1tpXTtcbiAgICAgICAgICAgIHRoaXMuc3F1YXJlLnBvaW50TGlzdFtpXSA9IHtcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnNxdWFyZS5jZW50ZXIueCArIG9mZnNldC54ICogTWF0aC5jb3MoYW5nbGUpIC0gb2Zmc2V0LnkgKiBNYXRoLnNpbihhbmdsZSksXG4gICAgICAgICAgICAgICAgeTogdGhpcy5zcXVhcmUuY2VudGVyLnkgKyBvZmZzZXQueCAqIE1hdGguc2luKGFuZ2xlKSArIG9mZnNldC55ICogTWF0aC5jb3MoYW5nbGUpLFxuICAgICAgICAgICAgICAgIGM6IHRoaXMuc3F1YXJlLnBvaW50TGlzdFtpXS5jXG4gICAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgXG4gICAgICAgIHRoaXMuc3F1YXJlLnNpemUgPSBuZXdTaXplO1xuICAgICAgICB0aGlzLnNxdWFyZS5yZWNhbGN1bGF0ZSgpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVJvdGF0aW9uU3RhcnQoZTogRXZlbnQpIHtcbiAgICAgICAgdGhpcy5pbml0aWFsUm90YXRpb25WYWx1ZSA9IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGhhbmRsZVJvdGF0aW9uRW5kKGU6IEV2ZW50KSB7XG4gICAgICAgIGxldCBmaW5hbFJvdGF0aW9uVmFsdWUgPSBwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSk7XG4gICAgICAgIGxldCBkZWx0YVJvdGF0aW9uID0gZmluYWxSb3RhdGlvblZhbHVlIC0gdGhpcy5pbml0aWFsUm90YXRpb25WYWx1ZTtcbiAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbih0aGlzLmluaXRpYWxSb3RhdGlvblZhbHVlLCBkZWx0YVJvdGF0aW9uKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKGluaXRpYWxSb3RhdGlvbjogbnVtYmVyLCBkZWx0YVJvdGF0aW9uOiBudW1iZXIpe1xuICAgICAgICB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKGRlbHRhUm90YXRpb24pO1xuICAgICAgICB0aGlzLnNxdWFyZS5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xuICAgICAgICB0aGlzLnNxdWFyZS51cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuXG4gICAgICAgICAgICAvLyBGaW5kIHRoZSBpbmRpY2VzIG9mIHRoZSBhZGphY2VudCB2ZXJ0aWNlc1xuICAgICAgICAgICAgY29uc3QgbmV4dElkeCA9IChpZHggKyAxKSAlIDQ7XG4gICAgICAgICAgICBjb25zdCBwcmV2SWR4ID0gKGlkeCArIDMpICUgNDtcbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlID0gKGlkeCArMikgJSA0O1xuICAgICAgICAgICAgdGhpcy5zcXVhcmUucmVjYWxjdWxhdGUoKTtcblxuICAgICAgICAgICAgY29uc3QgZGVsdGFZID0gdGhpcy5zcXVhcmUucG9pbnRMaXN0WzFdLnkgLSB0aGlzLnNxdWFyZS5wb2ludExpc3RbMF0ueTtcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWCA9IHRoaXMuc3F1YXJlLnBvaW50TGlzdFsxXS54IC0gdGhpcy5zcXVhcmUucG9pbnRMaXN0WzBdLng7XG4gICAgICAgICAgICB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IE1hdGguYXRhbjIoZGVsdGFZLCBkZWx0YVgpO1xuXG5cbiAgICAgICAgICAgIHRoaXMuc3F1YXJlLnRyYW5zbGF0aW9uWzBdID0gLXRoaXMuc3F1YXJlLmNlbnRlci54O1xuICAgICAgICAgICAgdGhpcy5zcXVhcmUudHJhbnNsYXRpb25bMV0gPSAtdGhpcy5zcXVhcmUuY2VudGVyLnk7XG4gICAgICAgICAgICB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IC0gdGhpcy5zcXVhcmUuYW5nbGVJblJhZGlhbnM7XG4gICAgICAgICAgICB0aGlzLnNxdWFyZS5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeDtcbiAgICAgICAgICAgIHRoaXMuc3F1YXJlLnVwZGF0ZVBvaW50TGlzdFdpdGhUcmFuc2Zvcm1hdGlvbigpO1xuXG4gICAgICAgICAgICAvLyAvLyBDYWxjdWxhdGUgdGhlIGRpZmZlcmVuY2UgaW4gcG9zaXRpb25cbiAgICAgICAgICAgIC8vIGNvbnN0IGR4ID0geCAtIHRoaXMuc3F1YXJlLnBvaW50TGlzdFtpZHhdLng7XG4gICAgICAgICAgICAvLyBjb25zdCBkeSA9IHkgLSB0aGlzLnNxdWFyZS5wb2ludExpc3RbaWR4XS55O1xuICAgICAgICBcbiAgICAgICAgICAgIC8vIC8vIFVwZGF0ZSB0aGUgc2VsZWN0ZWQgdmVydGV4XG4gICAgICAgICAgICAvLyB0aGlzLnNxdWFyZS5wb2ludExpc3RbaWR4XS54ICs9IGR4O1xuICAgICAgICAgICAgLy8gdGhpcy5zcXVhcmUucG9pbnRMaXN0W2lkeF0ueSArPSBkeTtcbiAgICAgICAgXG4gICAgICAgICAgICBcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGlkeCk7XG4gICAgICAgICAgICAvLyBmb3IobGV0IGk9MDsgaTw0O2krKyl7XG4gICAgICAgICAgICAvLyAgICAgaWYoaSAhPSBpZHggJiYgaSE9IG9wcG9zaXRlKXtcbiAgICAgICAgICAgIC8vICAgICAgICAgaWYgKHRoaXMuc3F1YXJlLnBvaW50TGlzdFtpXS54ID09IHRoaXMuc3F1YXJlLnBvaW50TGlzdFtvcHBvc2l0ZV0ueCAmJiB0aGlzLnNxdWFyZS5wb2ludExpc3RbaV0ueSA9PSB0aGlzLnNxdWFyZS5wb2ludExpc3Rbb3Bwb3NpdGVdLnkpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmIChNYXRoLmFicyhkeCkgPiBNYXRoLmFicyhkeSkpIHtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnNxdWFyZS5wb2ludExpc3RbaV0ueCArPSBkeDtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnkgKz0gZHk7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAodGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnggPT0gdGhpcy5zcXVhcmUucG9pbnRMaXN0W29wcG9zaXRlXS54KXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnNxdWFyZS5wb2ludExpc3RbaV0ueSArPSBkeTtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgIH0gaWYodGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnkgPT0gdGhpcy5zcXVhcmUucG9pbnRMaXN0W29wcG9zaXRlXS55KXtcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnNxdWFyZS5wb2ludExpc3RbaV0ueCArPSBkeDsgXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgIC8vICAgICB9XG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIC8vIHRoaXMuc3F1YXJlLnRyYW5zbGF0aW9uWzBdID0gLXRoaXMuc3F1YXJlLmNlbnRlci54O1xuICAgICAgICAgICAgLy8gdGhpcy5zcXVhcmUudHJhbnNsYXRpb25bMV0gPSAtdGhpcy5zcXVhcmUuY2VudGVyLnk7XG4gICAgICAgICAgICAvLyB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IC10aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucztcbiAgICAgICAgICAgIC8vIHRoaXMuc3F1YXJlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4O1xuICAgICAgICAgICAgLy8gdGhpcy5zcXVhcmUudXBkYXRlUG9pbnRMaXN0V2l0aFRyYW5zZm9ybWF0aW9uKCk7XG4gICAgICAgIFxuICAgICAgICAgICAgLy8gUmVjYWxjdWxhdGUgdGhlIHNxdWFyZSBwcm9wZXJ0aWVzIHRvIHJlZmxlY3QgdGhlIGNoYW5nZXNcbiAgICAgICAgICAgIHRoaXMuc3F1YXJlLnJlY2FsY3VsYXRlKCk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcbiAgICAgICAgXG4gICAgfVxuXG4gICAgY3VzdG9tVmVydGV4VG9vbGJhcigpOiB2b2lkIHt9XG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi9BcHBDYW52YXMnO1xuaW1wb3J0IENWUG9seWdvbiBmcm9tICcuLi8uLi9TaGFwZXMvQ1ZQb2x5Z29uJztcbmltcG9ydCBGYW5Qb2x5Z29uIGZyb20gJy4uLy4uL1NoYXBlcy9GYW5Qb2x5Z29uJztcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uL1NoYXBlcy9MaW5lJztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgU3F1YXJlIGZyb20gJy4uLy4uL1NoYXBlcy9TcXVhcmUnO1xuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi4vTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XG5pbXBvcnQgQ1ZQb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9DVlBvbHlnb25Ub29sYmFyQ29udHJvbGxlcic7XG5pbXBvcnQgRmFuUG9seWdvblRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvRmFuUG9seWdvblRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBMaW5lVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9MaW5lVG9vbGJhckNvbnRyb2xsZXInO1xuaW1wb3J0IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXInO1xuaW1wb3J0IHsgU2hhcGVUb29sYmFyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGUvU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XG5pbXBvcnQgU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9TcXVhcmVUb29sYmFyQ29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRvb2xiYXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgdG9vbGJhckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBpdGVtUGlja2VyOiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICBwcml2YXRlIHNlbGVjdGVkSWQ6IHN0cmluZyA9ICcnO1xuXG4gICAgcHJpdmF0ZSB0b29sYmFyQ29udHJvbGxlcjogU2hhcGVUb29sYmFyQ29udHJvbGxlciB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcjtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzLCBjYW52YXNDb250cm9sbGVyOiBDYW52YXNDb250cm9sbGVyKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuICAgICAgICB0aGlzLmFwcENhbnZhcy51cGRhdGVUb29sYmFyID0gdGhpcy51cGRhdGVTaGFwZUxpc3QuYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5jYW52YXNDb250cm9sbGVyID0gY2FudmFzQ29udHJvbGxlcjtcblxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICd0b29sYmFyLWNvbnRhaW5lcidcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICd0b29sYmFyLWl0ZW0tcGlja2VyJ1xuICAgICAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlci5vbmNoYW5nZSA9IChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSWQgPSB0aGlzLml0ZW1QaWNrZXIudmFsdWU7XG4gICAgICAgICAgICBjb25zdCBzaGFwZSA9IHRoaXMuYXBwQ2FudmFzLnNoYXBlc1t0aGlzLml0ZW1QaWNrZXIudmFsdWVdO1xuICAgICAgICAgICAgdGhpcy5jbGVhclRvb2xiYXJFbG10KCk7XG5cbiAgICAgICAgICAgIGlmIChzaGFwZSBpbnN0YW5jZW9mIExpbmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IExpbmVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBMaW5lLCBhcHBDYW52YXMpO1xuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSBpbnN0YW5jZW9mIFJlY3RhbmdsZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRyb2xsZXIgPSBuZXcgUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgUmVjdGFuZ2xlLCBhcHBDYW52YXMpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgU3F1YXJlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBTcXVhcmVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBTcXVhcmUsIGFwcENhbnZhcylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUgaW5zdGFuY2VvZiBGYW5Qb2x5Z29uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgRmFuUG9seWdvbiwgYXBwQ2FudmFzLCB0aGlzLmNhbnZhc0NvbnRyb2xsZXIpXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgQ1ZQb2x5Z29uKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBDVlBvbHlnb25Ub29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBDVlBvbHlnb24sIGFwcENhbnZhcywgdGhpcy5jYW52YXNDb250cm9sbGVyKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGVMaXN0KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2hhcGVMaXN0KCkge1xuICAgICAgICB3aGlsZSAodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLml0ZW1QaWNrZXIucmVtb3ZlQ2hpbGQodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgcGxhY2Vob2xkZXIudGV4dCA9ICdDaG9vc2UgYW4gb2JqZWN0JztcbiAgICAgICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcblxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuYXBwQ2FudmFzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBjaGlsZC50ZXh0ID0gc2hhcGUuaWQ7XG4gICAgICAgICAgICBjaGlsZC52YWx1ZSA9IHNoYXBlLmlkO1xuICAgICAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLnZhbHVlID0gdGhpcy5zZWxlY3RlZElkO1xuXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5hcHBDYW52YXMuc2hhcGVzKS5pbmNsdWRlcyh0aGlzLnNlbGVjdGVkSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhclRvb2xiYXJFbG10KCkge1xuICAgICAgICB3aGlsZSAodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi4vQmFzZS9CYXNlU2hhcGUnO1xuaW1wb3J0IENvbG9yIGZyb20gJy4uL0Jhc2UvQ29sb3InO1xuaW1wb3J0IFZlcnRleCBmcm9tICcuLi9CYXNlL1ZlcnRleCc7XG5pbXBvcnQgR3JhaGFtU2NhbiBmcm9tICcuLi9jb252ZXhIdWxsVXRpbHMnO1xuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHggfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENWUG9seWdvbiBleHRlbmRzIEJhc2VTaGFwZSB7XG4gICAgcHJpdmF0ZSBvcmlnaW46IFZlcnRleDtcbiAgICBsZW5MaXN0OiBudW1iZXJbXSA9IFtdO1xuICAgIHByaXZhdGUgZ3M6IEdyYWhhbVNjYW4gPSBuZXcgR3JhaGFtU2NhbigpO1xuXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB2ZXJ0aWNlczogVmVydGV4W10pIHtcbiAgICAgICAgc3VwZXIoNiwgaWQsIGNvbG9yKTtcblxuICAgICAgICB0aGlzLm9yaWdpbiA9IHZlcnRpY2VzWzBdO1xuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKHZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1sxXSk7XG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlcnRleChcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS54ICsgdmVydGljZXNbMF0ueCkgLyAyLFxuICAgICAgICAgICAgKHZlcnRpY2VzWzFdLnkgKyB2ZXJ0aWNlc1swXS55KSAvIDIsXG4gICAgICAgICAgICBuZXcgQ29sb3IoMCwgMCwgMClcbiAgICAgICAgKTtcblxuICAgICAgICB2ZXJ0aWNlcy5mb3JFYWNoKCh2dHgsIGlkeCkgPT4ge1xuICAgICAgICAgICAgaWYgKGlkeCA8IDIpIHJldHVybjtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2hhcGUgc2V0XCIpO1xuICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgodnR4KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkVmVydGV4KHZlcnRleDogVmVydGV4KSB7XG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godmVydGV4KTtcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcbiAgICB9XG4gICAgXG4gICAgcmVtb3ZlVmVydGV4KGlkeDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnBvaW50TGlzdC5sZW5ndGggPD0gMykge1xuICAgICAgICAgICAgYWxlcnQoXCJDYW5ub3QgcmVtb3ZlIHZlcnRleCBhbnkgZnVydGhlclwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvaW50TGlzdC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLnBvaW50TGlzdFswXTtcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcbiAgICB9XG5cbiAgICByZWNhbGMoKSB7XG4gICAgICAgIHRoaXMuZ3Muc2V0UG9pbnRzKHRoaXMucG9pbnRMaXN0KTtcbiAgICAgICAgdGhpcy5wb2ludExpc3QgPSB0aGlzLmdzLmdldEh1bGwoKTtcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLnBvaW50TGlzdFswXTtcblxuICAgICAgICBsZXQgYW5nbGVzID0gdGhpcy5wb2ludExpc3RcbiAgICAgICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gaWR4ID4gMClcbiAgICAgICAgICAgIC5tYXAoKHZ0eCkgPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICAgICAgICAgIHZ0eCxcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IE1hdGguYXRhbjIoXG4gICAgICAgICAgICAgICAgICAgICAgICB2dHgueSAtIHRoaXMub3JpZ2luLnksXG4gICAgICAgICAgICAgICAgICAgICAgICB2dHgueCAtIHRoaXMub3JpZ2luLnhcbiAgICAgICAgICAgICAgICAgICAgKSxcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgYW5nbGVzLnNvcnQoKGEsIGIpID0+IGEuYW5nbGUgLSBiLmFuZ2xlKTtcbiAgICAgICAgdGhpcy5wb2ludExpc3QgPSBhbmdsZXMubWFwKChpdGVtKSA9PiBpdGVtLnZ0eCk7XG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnVuc2hpZnQodGhpcy5vcmlnaW4pO1xuXG4gICAgICAgIHRoaXMuY2VudGVyLnggPVxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QucmVkdWNlKCh0b3RhbCwgdnR4KSA9PiB0b3RhbCArIHZ0eC54LCAwKSAvXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5sZW5ndGg7XG4gICAgICAgIHRoaXMuY2VudGVyLnkgPVxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QucmVkdWNlKCh0b3RhbCwgdnR4KSA9PiB0b3RhbCArIHZ0eC55LCAwKSAvXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5sZW5ndGg7XG4gICAgICAgIHRoaXMubGVuTGlzdCA9IHRoaXMucG9pbnRMaXN0Lm1hcCgodnR4KSA9PlxuICAgICAgICAgICAgZXVjbGlkZWFuRGlzdGFuY2VWdHgodnR4LCB0aGlzLmNlbnRlcilcbiAgICAgICAgKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uL0Jhc2UvQmFzZVNoYXBlJztcbmltcG9ydCBDb2xvciBmcm9tICcuLi9CYXNlL0NvbG9yJztcbmltcG9ydCBWZXJ0ZXggZnJvbSAnLi4vQmFzZS9WZXJ0ZXgnO1xuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHggfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZhblBvbHlnb24gZXh0ZW5kcyBCYXNlU2hhcGUge1xuICAgIHByaXZhdGUgb3JpZ2luOiBWZXJ0ZXg7XG4gICAgbGVuTGlzdDogbnVtYmVyW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgdmVydGljZXM6IFZlcnRleFtdKSB7XG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvcik7XG5cbiAgICAgICAgdGhpcy5vcmlnaW4gPSB2ZXJ0aWNlc1swXTtcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0pO1xuICAgICAgICB0aGlzLmNlbnRlciA9IG5ldyBWZXJ0ZXgoXG4gICAgICAgICAgICAodmVydGljZXNbMV0ueCArIHZlcnRpY2VzWzBdLngpIC8gMixcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS55ICsgdmVydGljZXNbMF0ueSkgLyAyLFxuICAgICAgICAgICAgbmV3IENvbG9yKDAsIDAsIDApXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QuZm9yRWFjaCgodnR4LCBpZHgpID0+IHtcbiAgICAgICAgICAgIGlmIChpZHggPCAyKSByZXR1cm47XG4gICAgICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSA2O1xuICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgodnR4KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgYWRkVmVydGV4KHZlcnRleDogVmVydGV4KSB7XG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godmVydGV4KTtcbiAgICAgICAgdGhpcy5nbERyYXdUeXBlID0gNjtcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcbiAgICB9XG4gICAgXG4gICAgcmVtb3ZlVmVydGV4KGlkeDogbnVtYmVyKSB7XG4gICAgICAgIGlmICh0aGlzLnBvaW50TGlzdC5sZW5ndGggPD0gMikge1xuICAgICAgICAgICAgYWxlcnQoXCJDYW5ub3QgcmVtb3ZlIHZlcnRleCBhbnkgZnVydGhlclwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnBvaW50TGlzdC5zcGxpY2UoaWR4LCAxKTtcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLnBvaW50TGlzdFswXTtcbiAgICAgICAgaWYgKHRoaXMucG9pbnRMaXN0Lmxlbmd0aCA9PSAyKVxuICAgICAgICAgICAgdGhpcy5nbERyYXdUeXBlID0gMTtcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcbiAgICB9XG5cbiAgICByZWNhbGMoKSB7XG4gICAgICAgIGxldCBhbmdsZXMgPSB0aGlzLnBvaW50TGlzdFxuICAgICAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBpZHggPiAwKVxuICAgICAgICAgICAgLm1hcCgodnR4KSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgICAgICAgICAgdnR4LFxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogTWF0aC5hdGFuMihcbiAgICAgICAgICAgICAgICAgICAgICAgIHZ0eC55IC0gdGhpcy5vcmlnaW4ueSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHZ0eC54IC0gdGhpcy5vcmlnaW4ueFxuICAgICAgICAgICAgICAgICAgICApLFxuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICBhbmdsZXMuc29ydCgoYSwgYikgPT4gYS5hbmdsZSAtIGIuYW5nbGUpO1xuICAgICAgICB0aGlzLnBvaW50TGlzdCA9IGFuZ2xlcy5tYXAoKGl0ZW0pID0+IGl0ZW0udnR4KTtcbiAgICAgICAgdGhpcy5wb2ludExpc3QudW5zaGlmdCh0aGlzLm9yaWdpbik7XG5cbiAgICAgICAgdGhpcy5jZW50ZXIueCA9XG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5yZWR1Y2UoKHRvdGFsLCB2dHgpID0+IHRvdGFsICsgdnR4LngsIDApIC9cbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5jZW50ZXIueSA9XG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5yZWR1Y2UoKHRvdGFsLCB2dHgpID0+IHRvdGFsICsgdnR4LnksIDApIC9cbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0Lmxlbmd0aDtcbiAgICAgICAgdGhpcy5sZW5MaXN0ID0gdGhpcy5wb2ludExpc3QubWFwKCh2dHgpID0+XG4gICAgICAgICAgICBldWNsaWRlYW5EaXN0YW5jZVZ0eCh2dHgsIHRoaXMuY2VudGVyKVxuICAgICAgICApO1xuICAgIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgICBsZW5ndGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBlbmRYOiBudW1iZXIsIGVuZFk6IG51bWJlciwgcm90YXRpb24gPSAwLCBzY2FsZVggPSAxLCBzY2FsZVkgPSAxKSB7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoc3RhcnRYICsgZW5kWCkgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHN0YXJ0WSArIGVuZFkpIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gbmV3IFZlcnRleChzdGFydFgsIHN0YXJ0WSwgY29sb3IpO1xuICAgICAgICBjb25zdCBlbmQgPSBuZXcgVmVydGV4KGVuZFgsIGVuZFksIGNvbG9yKTtcblxuICAgICAgICB0aGlzLmxlbmd0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxuICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgZW5kXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaChvcmlnaW4sIGVuZCk7XG4gICAgICAgIHRoaXMuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0ID0gdGhpcy5wb2ludExpc3Q7XG4gICAgfVxufSIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XG5pbXBvcnQgeyBtMyB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICAgIFxuICAgIGxlbmd0aDogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaW5pdGlhbFBvaW50OiBudW1iZXJbXTtcbiAgICBlbmRQb2ludDogbnVtYmVyW107XG4gICAgdGFyZ2V0UG9pbnQ6IG51bWJlcltdO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgZW5kWDogbnVtYmVyLCBlbmRZOiBudW1iZXIsIGFuZ2xlSW5SYWRpYW5zOiBudW1iZXIsIHNjYWxlWDogbnVtYmVyID0gMSwgc2NhbGVZOiBudW1iZXIgPSAxLCB0cmFuc2Zvcm1hdGlvbjogbnVtYmVyW10gPSBtMy5pZGVudGl0eSgpKSB7XG4gICAgICAgIHN1cGVyKDUsIGlkLCBjb2xvcik7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB4MSA9IHN0YXJ0WDtcbiAgICAgICAgY29uc3QgeTEgPSBzdGFydFk7XG4gICAgICAgIGNvbnN0IHgyID0gZW5kWDtcbiAgICAgICAgY29uc3QgeTIgPSBzdGFydFk7XG4gICAgICAgIGNvbnN0IHgzID0gc3RhcnRYO1xuICAgICAgICBjb25zdCB5MyA9IGVuZFk7XG4gICAgICAgIGNvbnN0IHg0ID0gZW5kWDtcbiAgICAgICAgY29uc3QgeTQgPSBlbmRZO1xuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm1hdGlvbjtcblxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gYW5nbGVJblJhZGlhbnM7XG4gICAgICAgIHRoaXMuc2NhbGUgPSBbc2NhbGVYLCBzY2FsZVldO1xuICAgICAgICB0aGlzLmluaXRpYWxQb2ludCA9IFtzdGFydFgsIHN0YXJ0WSwgMV07XG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBbZW5kWCwgZW5kWSwgMV07XG4gICAgICAgIHRoaXMudGFyZ2V0UG9pbnQgPSBbMCwwLCAxXTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSB4Mi14MTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHkzLXkxO1xuXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoeDEgKyB4NCkgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHkxICsgeTQpIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2gobmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKSwgbmV3IFZlcnRleCh4MiwgeTIsIGNvbG9yKSwgbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKSwgbmV3IFZlcnRleCh4NCwgeTQsIGNvbG9yKSk7XG4gICAgICAgIHRoaXMuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0ID0gdGhpcy5wb2ludExpc3Q7XG4gICAgfVxuXG4gICAgb3ZlcnJpZGUgc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKXtcbiAgICAgICAgc3VwZXIuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcblxuICAgICAgICAvLyBjb25zdCBwb2ludCA9IFt0aGlzLnBvaW50TGlzdFtpZHhdLngsIHRoaXMucG9pbnRMaXN0W2lkeF0ueSwgMV07XG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBtMy5tdWx0aXBseTN4MSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLmVuZFBvaW50KVxuICAgICAgICB0aGlzLmluaXRpYWxQb2ludCA9IG0zLm11bHRpcGx5M3gxKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMuaW5pdGlhbFBvaW50KVxuICAgIFxuICAgIH1cblxuICAgIHB1YmxpYyB1cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKSB7XG4gICAgICAgIHRoaXMucG9pbnRMaXN0LmZvckVhY2goKHZlcnRleCwgaW5kZXgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleE1hdHJpeCA9IFt2ZXJ0ZXgueCwgdmVydGV4LnksIDFdO1xuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRWZXJ0ZXggPSBtMy5tdWx0aXBseTN4MSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB2ZXJ0ZXhNYXRyaXgpO1xuICAgICAgICAgICAgdGhpcy5wb2ludExpc3RbaW5kZXhdID0gbmV3IFZlcnRleCh0cmFuc2Zvcm1lZFZlcnRleFswXSwgdHJhbnNmb3JtZWRWZXJ0ZXhbMV0sIHRoaXMucG9pbnRMaXN0W2luZGV4XS5jKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZSgpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZWNhbGN1bGF0ZSgpIHtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMucG9pbnRMaXN0WzFdLnggLSB0aGlzLnBvaW50TGlzdFswXS54LCAyKSArIE1hdGgucG93KHRoaXMucG9pbnRMaXN0WzFdLnkgLSB0aGlzLnBvaW50TGlzdFswXS55LCAyKSk7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMucG9pbnRMaXN0WzNdLnggLSB0aGlzLnBvaW50TGlzdFsxXS54LCAyKSArIE1hdGgucG93KHRoaXMucG9pbnRMaXN0WzNdLnkgLSB0aGlzLnBvaW50TGlzdFsxXS55LCAyKSk7XG5cbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh0aGlzLnBvaW50TGlzdFswXS54ICsgdGhpcy5wb2ludExpc3RbMV0ueCArIHRoaXMucG9pbnRMaXN0WzNdLnggKyB0aGlzLnBvaW50TGlzdFsyXS54KSAvIDQ7XG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAodGhpcy5wb2ludExpc3RbMF0ueSArIHRoaXMucG9pbnRMaXN0WzFdLnkgKyB0aGlzLnBvaW50TGlzdFszXS55ICsgdGhpcy5wb2ludExpc3RbMl0ueSkgLyA0O1xuICAgIFxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcbiAgICAgICAgdGhpcy53aWR0aCA9IHdpZHRoO1xuICAgICAgICB0aGlzLmNlbnRlciA9IG5ldyBWZXJ0ZXgoY2VudGVyWCwgY2VudGVyWSwgdGhpcy5jb2xvcik7XG4gICAgfVxuXG4gICAgcHVibGljIGZpbmRPcHBvc2l0ZShwb2ludElkeDogbnVtYmVyKXtcbiAgICAgICAgY29uc3Qgb3Bwb3NpdGU6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7IDA6IDMsIDE6IDIsIDI6IDEsIDM6IDAgfTtcbiAgICAgICAgcmV0dXJuIG9wcG9zaXRlW3BvaW50SWR4XTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmluZENDV0FkamFjZW50KHBvaW50SWR4OiBudW1iZXIpe1xuICAgICAgICBjb25zdCBjY3dBZGphY2VudDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHsgMDogMiwgMTogMCwgMjogMywgMzogMSB9O1xuICAgICAgICByZXR1cm4gY2N3QWRqYWNlbnRbcG9pbnRJZHhdO1xuICAgIH1cblxuICAgIHB1YmxpYyBmaW5kQ1dBZGphY2VudChwb2ludElkeDogbnVtYmVyKXtcbiAgICAgICAgY29uc3QgY3dBZGphY2VudDogeyBba2V5OiBudW1iZXJdOiBudW1iZXIgfSA9IHsgMDogMSwgMTogMywgMjogMCwgMzogMiB9O1xuICAgICAgICByZXR1cm4gY3dBZGphY2VudFtwb2ludElkeF07XG4gICAgfVxuXG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIHYxIDogVmVydGV4O1xuICAgIHYyIDogVmVydGV4O1xuICAgIHYzIDogVmVydGV4O1xuICAgIHY0IDogVmVydGV4O1xuXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCB4NDogbnVtYmVyLCB5NDogbnVtYmVyLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh4MSArIHgzKSAvIDI7XG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoeTEgKyB5MykgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIGNvbG9yKTtcbiAgICAgICAgXG4gICAgICAgIHN1cGVyKDYsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy52MSA9IG5ldyBWZXJ0ZXgoeDEsIHkxLCBjb2xvcik7XG4gICAgICAgIHRoaXMudjIgPSBuZXcgVmVydGV4KHgyLCB5MiwgY29sb3IpO1xuICAgICAgICB0aGlzLnYzID0gbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKTtcbiAgICAgICAgdGhpcy52NCA9IG5ldyBWZXJ0ZXgoeDQsIHk0LCBjb2xvcik7XG4gICAgICAgIHRoaXMuc2l6ZSA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KHRoaXMudjEsIHRoaXMudjMpO1xuXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godGhpcy52MSwgdGhpcy52MiwgdGhpcy52MywgdGhpcy52NCk7XG4gICAgICAgIHRoaXMuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0ID0gdGhpcy5wb2ludExpc3Q7XG5cbiAgICAgICAgY29uc3QgZGVsdGFZID0gdGhpcy5wb2ludExpc3RbMV0ueSAtIHRoaXMucG9pbnRMaXN0WzBdLnk7XG4gICAgICAgIGNvbnN0IGRlbHRhWCA9IHRoaXMucG9pbnRMaXN0WzFdLnggLSB0aGlzLnBvaW50TGlzdFswXS54O1xuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gTWF0aC5hdGFuMihkZWx0YVksIGRlbHRhWCk7XG5cbiAgICB9XG5cbiAgICBwdWJsaWMgdXBkYXRlUG9pbnRMaXN0V2l0aFRyYW5zZm9ybWF0aW9uKCkge1xuICAgICAgICB0aGlzLnBvaW50TGlzdC5mb3JFYWNoKCh2ZXJ0ZXgsIGluZGV4KSA9PiB7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhNYXRyaXggPSBbdmVydGV4LngsIHZlcnRleC55LCAxXTtcbiAgICAgICAgICAgIGNvbnN0IHRyYW5zZm9ybWVkVmVydGV4ID0gbTMubXVsdGlwbHkzeDEodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdmVydGV4TWF0cml4KTtcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0W2luZGV4XSA9IG5ldyBWZXJ0ZXgodHJhbnNmb3JtZWRWZXJ0ZXhbMF0sIHRyYW5zZm9ybWVkVmVydGV4WzFdLCB0aGlzLnBvaW50TGlzdFtpbmRleF0uYyk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgcmVjYWxjdWxhdGUoKSB7XG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChNYXRoLnBvdyh0aGlzLnBvaW50TGlzdFsxXS54IC0gdGhpcy5wb2ludExpc3RbMF0ueCwgMikgKyBNYXRoLnBvdyh0aGlzLnBvaW50TGlzdFsxXS55IC0gdGhpcy5wb2ludExpc3RbMF0ueSwgMikpO1xuICAgICAgICBjb25zdCBzaXplID0gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMucG9pbnRMaXN0WzNdLnggLSB0aGlzLnBvaW50TGlzdFsxXS54LCAyKSArIE1hdGgucG93KHRoaXMucG9pbnRMaXN0WzNdLnkgLSB0aGlzLnBvaW50TGlzdFsxXS55LCAyKSk7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAodGhpcy5wb2ludExpc3RbMF0ueCArIHRoaXMucG9pbnRMaXN0WzFdLnggKyB0aGlzLnBvaW50TGlzdFszXS54ICsgdGhpcy5wb2ludExpc3RbMl0ueCkgLyA0O1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHRoaXMucG9pbnRMaXN0WzBdLnkgKyB0aGlzLnBvaW50TGlzdFsxXS55ICsgdGhpcy5wb2ludExpc3RbM10ueSArIHRoaXMucG9pbnRMaXN0WzJdLnkpIC8gNDtcblxuICAgICAgICBjb25zdCBkZWx0YVkgPSB0aGlzLnBvaW50TGlzdFsxXS55IC0gdGhpcy5wb2ludExpc3RbMF0ueTtcbiAgICAgICAgY29uc3QgZGVsdGFYID0gdGhpcy5wb2ludExpc3RbMV0ueCAtIHRoaXMucG9pbnRMaXN0WzBdLng7XG4gICAgICAgIHRoaXMuYW5nbGVJblJhZGlhbnMgPSBNYXRoLmF0YW4yKGRlbHRhWSwgZGVsdGFYKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCB0aGlzLmNvbG9yKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgVmVydGV4IGZyb20gXCIuL0Jhc2UvVmVydGV4XCI7XG5cbmNvbnN0IFJFTU9WRUQgPSAtMTtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JhaGFtU2NhbiB7XG4gICAgcHJpdmF0ZSBwb2ludHM6IFZlcnRleFtdID0gW107XG5cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5wb2ludHMgPSBbXTtcbiAgICB9XG5cbiAgICBnZXRQb2ludHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50cztcbiAgICB9XG5cbiAgICBzZXRQb2ludHMocG9pbnRzOiBWZXJ0ZXhbXSkge1xuICAgICAgICB0aGlzLnBvaW50cyA9IHBvaW50cy5zbGljZSgpOyBcbiAgICB9XG5cbiAgICBhZGRQb2ludChwb2ludDogVmVydGV4KSB7XG4gICAgICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnQpO1xuICAgIH1cblxuICAgIGdldEh1bGwoKSB7XG4gICAgICAgIGNvbnN0IHBpdm90ID0gdGhpcy5wcmVwYXJlUGl2b3RQb2ludCgpO1xuXG4gICAgICAgIGxldCBpbmRleGVzID0gQXJyYXkuZnJvbSh0aGlzLnBvaW50cywgKHBvaW50LCBpKSA9PiBpKTtcbiAgICAgICAgY29uc3QgYW5nbGVzID0gQXJyYXkuZnJvbSh0aGlzLnBvaW50cywgKHBvaW50KSA9PiB0aGlzLmdldEFuZ2xlKHBpdm90LCBwb2ludCkpO1xuICAgICAgICBjb25zdCBkaXN0YW5jZXMgPSBBcnJheS5mcm9tKHRoaXMucG9pbnRzLCAocG9pbnQpID0+IHRoaXMuZXVjbGlkZWFuRGlzdGFuY2VTcXVhcmVkKHBpdm90LCBwb2ludCkpO1xuXG4gICAgICAgIGluZGV4ZXMuc29ydCgoaSwgaikgPT4ge1xuICAgICAgICAgICAgY29uc3QgYW5nbGVBID0gYW5nbGVzW2ldO1xuICAgICAgICAgICAgY29uc3QgYW5nbGVCID0gYW5nbGVzW2pdO1xuICAgICAgICAgICAgaWYgKGFuZ2xlQSA9PT0gYW5nbGVCKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2VBID0gZGlzdGFuY2VzW2ldO1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlQiA9IGRpc3RhbmNlc1tqXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzdGFuY2VBIC0gZGlzdGFuY2VCO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGFuZ2xlQSAtIGFuZ2xlQjtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBpbmRleGVzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICAgICAgaWYgKGFuZ2xlc1tpbmRleGVzW2ldXSA9PT0gYW5nbGVzW2luZGV4ZXNbaSArIDFdXSkgeyBcbiAgICAgICAgICAgICAgICBpbmRleGVzW2ldID0gUkVNT1ZFRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGh1bGwgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRleGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IGluZGV4ZXNbaV07XG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzW2luZGV4XTtcblxuICAgICAgICAgICAgaWYgKGluZGV4ICE9PSBSRU1PVkVEKSB7XG4gICAgICAgICAgICAgICAgaWYgKGh1bGwubGVuZ3RoIDwgMykge1xuICAgICAgICAgICAgICAgICAgICBodWxsLnB1c2gocG9pbnQpO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoZWNrT3JpZW50YXRpb24oaHVsbFtodWxsLmxlbmd0aCAtIDJdLCBodWxsW2h1bGwubGVuZ3RoIC0gMV0sIHBvaW50KSA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGh1bGwucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaHVsbC5wdXNoKHBvaW50KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gaHVsbC5sZW5ndGggPCAzID8gW10gOiBodWxsO1xuICAgIH1cblxuICAgIGNoZWNrT3JpZW50YXRpb24ocDE6IFZlcnRleCwgcDI6IFZlcnRleCwgcDM6IFZlcnRleCkge1xuICAgICAgICByZXR1cm4gKHAyLnkgLSBwMS55KSAqIChwMy54IC0gcDIueCkgLSAocDMueSAtIHAyLnkpICogKHAyLnggLSBwMS54KTtcbiAgICB9XG5cbiAgICBnZXRBbmdsZShhOiBWZXJ0ZXgsIGI6IFZlcnRleCkge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMihiLnkgLSBhLnksIGIueCAtIGEueCk7XG4gICAgfVxuXG4gICAgZXVjbGlkZWFuRGlzdGFuY2VTcXVhcmVkKHAxOiBWZXJ0ZXgsIHAyOiBWZXJ0ZXgpIHtcbiAgICAgICAgY29uc3QgYSA9IHAyLnggLSBwMS54O1xuICAgICAgICBjb25zdCBiID0gcDIueSAtIHAxLnk7XG4gICAgICAgIHJldHVybiBhICogYSArIGIgKiBiO1xuICAgIH1cblxuICAgIHByZXBhcmVQaXZvdFBvaW50KCkge1xuICAgICAgICBsZXQgcGl2b3QgPSB0aGlzLnBvaW50c1swXTtcbiAgICAgICAgbGV0IHBpdm90SW5kZXggPSAwO1xuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzW2ldO1xuICAgICAgICAgICAgaWYgKHBvaW50LnkgPCBwaXZvdC55IHx8IHBvaW50LnkgPT09IHBpdm90LnkgJiYgcG9pbnQueCA8IHBpdm90LngpIHtcbiAgICAgICAgICAgICAgICBwaXZvdCA9IHBvaW50O1xuICAgICAgICAgICAgICAgIHBpdm90SW5kZXggPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwaXZvdDtcbiAgICB9XG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuL0FwcENhbnZhcyc7XG5pbXBvcnQgQ2FudmFzQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXJzL01ha2VyL0NhbnZhc0NvbnRyb2xsZXInO1xuaW1wb3J0IFRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcnMvVG9vbGJhci9Ub29sYmFyQ29udHJvbGxlcic7XG5pbXBvcnQgaW5pdCBmcm9tICcuL2luaXQnO1xuXG5jb25zdCBtYWluID0gKCkgPT4ge1xuICAgIGNvbnN0IGluaXRSZXQgPSBpbml0KCk7XG4gICAgaWYgKCFpbml0UmV0KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIFdlYkdMJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGdsLCBwcm9ncmFtLCBjb2xvckJ1ZmZlciwgcG9zaXRpb25CdWZmZXIgfSA9IGluaXRSZXQ7XG5cbiAgICBjb25zdCBhcHBDYW52YXMgPSBuZXcgQXBwQ2FudmFzKGdsLCBwcm9ncmFtLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xuICAgIFxuICAgIGNvbnN0IGNhbnZhc0NvbnRyb2xsZXIgPSBuZXcgQ2FudmFzQ29udHJvbGxlcihhcHBDYW52YXMpO1xuICAgIGNhbnZhc0NvbnRyb2xsZXIuc3RhcnQoKTtcbiAgICBcbiAgICBuZXcgVG9vbGJhckNvbnRyb2xsZXIoYXBwQ2FudmFzLCBjYW52YXNDb250cm9sbGVyKTtcblxuICAgIC8vIGNvbnN0IHJlZCA9IG5ldyBDb2xvcigyNTUsIDAsIDIwMClcbiAgICAvLyAvLyBjb25zdCB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZSgndHJpLTEnLCByZWQsIDUwLCA1MCwgMjAsIDUwMCwgMjAwLCAxMDApO1xuICAgIC8vIC8vIGFwcENhbnZhcy5hZGRTaGFwZSh0cmlhbmdsZSk7XG4gICAgXG4gICAgLy8gY29uc3QgcmVjdCA9IG5ldyBSZWN0YW5nbGUoJ3JlY3QtMScsIHJlZCwgMCwwLDEwLDIwLDAsMSwxKTtcbiAgICAvLyByZWN0LmFuZ2xlSW5SYWRpYW5zID0gLSBNYXRoLlBJIC8gNDtcbiAgICAvLyAvLyByZWN0LnRhcmdldFBvaW50WzBdID0gNSAqIE1hdGguc3FydCgyKTtcbiAgICAvLyAvLyByZWN0LnNjYWxlWCA9IDEwO1xuICAgIC8vIC8vIHJlY3QudHJhbnNsYXRpb25bMF0gPSA1MDA7XG4gICAgLy8gLy8gcmVjdC50cmFuc2xhdGlvblsxXSA9IDEwMDA7XG4gICAgLy8gLy8gcmVjdC5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShyZWN0KTtcblxuICAgIC8vIGNvbnN0IGxpbmUgPSBuZXcgTGluZSgnbGluZS0xJywgcmVkLCAxMDAsIDEwMCwgMTAwLCAzMDApO1xuICAgIC8vIGNvbnN0IGxpbmUyID0gbmV3IExpbmUoJ2xpbmUtMicsIHJlZCwgMTAwLCAxMDAsIDMwMCwgMTAwKTtcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XG4gICAgLy8gYXBwQ2FudmFzLmFkZFNoYXBlKGxpbmUyKTtcbn07XG5cbm1haW4oKTtcbiIsImNvbnN0IGNyZWF0ZVNoYWRlciA9IChcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxuICAgIHR5cGU6IG51bWJlcixcbiAgICBzb3VyY2U6IHN0cmluZ1xuKSA9PiB7XG4gICAgY29uc3Qgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuICAgIGlmIChzaGFkZXIpIHtcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHNoYWRlcjtcblxuICAgICAgICBjb25zb2xlLmVycm9yKGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XG4gICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xuICAgIH1cbn07XG5cbmNvbnN0IGNyZWF0ZVByb2dyYW0gPSAoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgICB2dHhTaGQ6IFdlYkdMU2hhZGVyLFxuICAgIGZyZ1NoZDogV2ViR0xTaGFkZXJcbikgPT4ge1xuICAgIGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgaWYgKHByb2dyYW0pIHtcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZ0eFNoZCk7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmdTaGQpO1xuICAgICAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHByb2dyYW07XG5cbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKSk7XG4gICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XG4gICAgfVxufTtcblxuY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJyk7XG5cbiAgICBpZiAoIWdsKSB7XG4gICAgICAgIGFsZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB3ZWJHTCcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEluaXRpYWxpemUgc2hhZGVycyBhbmQgcHJvZ3JhbXNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgdnR4U2hhZGVyU291cmNlID0gKFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVydGV4LXNoYWRlci0yZCcpIGFzIEhUTUxTY3JpcHRFbGVtZW50XG4gICAgKS50ZXh0O1xuICAgIGNvbnN0IGZyYWdTaGFkZXJTb3VyY2UgPSAoXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcmFnbWVudC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxuICAgICkudGV4dDtcblxuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IGNyZWF0ZVNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnR4U2hhZGVyU291cmNlKTtcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGNyZWF0ZVNoYWRlcihcbiAgICAgICAgZ2wsXG4gICAgICAgIGdsLkZSQUdNRU5UX1NIQURFUixcbiAgICAgICAgZnJhZ1NoYWRlclNvdXJjZVxuICAgICk7XG4gICAgaWYgKCF2ZXJ0ZXhTaGFkZXIgfHwgIWZyYWdtZW50U2hhZGVyKSByZXR1cm47XG5cbiAgICBjb25zdCBwcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShnbCwgdmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcik7XG4gICAgaWYgKCFwcm9ncmFtKSByZXR1cm47XG5cbiAgICBjb25zdCBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZGlzcGxheVdpZHRoICA9IE1hdGgucm91bmQod2lkdGggKiBkcHIpO1xuICAgIGNvbnN0IGRpc3BsYXlIZWlnaHQgPSBNYXRoLnJvdW5kKGhlaWdodCAqIGRwcik7XG5cbiAgICBjb25zdCBuZWVkUmVzaXplID1cbiAgICAgICAgZ2wuY2FudmFzLndpZHRoICE9IGRpc3BsYXlXaWR0aCB8fCBnbC5jYW52YXMuaGVpZ2h0ICE9IGRpc3BsYXlIZWlnaHQ7XG5cbiAgICBpZiAobmVlZFJlc2l6ZSkge1xuICAgICAgICBnbC5jYW52YXMud2lkdGggPSBkaXNwbGF5V2lkdGg7XG4gICAgICAgIGdsLmNhbnZhcy5oZWlnaHQgPSBkaXNwbGF5SGVpZ2h0O1xuICAgIH1cblxuICAgIGdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XG4gICAgZ2wuY2xlYXJDb2xvcigwLCAwLCAwLCAwKTtcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEVuYWJsZSAmIGluaXRpYWxpemUgdW5pZm9ybXMgYW5kIGF0dHJpYnV0ZXNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gUmVzb2x1dGlvblxuICAgIGNvbnN0IG1hdHJpeFVuaWZvcm1Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihcbiAgICAgICAgcHJvZ3JhbSxcbiAgICAgICAgJ3VfdHJhbnNmb3JtYXRpb24nXG4gICAgKTtcbiAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeFVuaWZvcm1Mb2NhdGlvbiwgZmFsc2UsIFsxLDAsMCwwLDEsMCwwLDAsMV0pXG5cbiAgICBjb25zdCByZXNvbHV0aW9uVW5pZm9ybUxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKFxuICAgICAgICBwcm9ncmFtLFxuICAgICAgICAndV9yZXNvbHV0aW9uJ1xuICAgICk7XG4gICAgZ2wudW5pZm9ybTJmKHJlc29sdXRpb25Vbmlmb3JtTG9jYXRpb24sIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XG5cbiAgICAvLyBDb2xvclxuICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgaWYgKCFjb2xvckJ1ZmZlcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGNvbG9yIGJ1ZmZlcicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICBjb25zdCBjb2xvckF0dHJpYnV0ZUxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgJ2FfY29sb3InKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShjb2xvckF0dHJpYnV0ZUxvY2F0aW9uKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGNvbG9yQXR0cmlidXRlTG9jYXRpb24sIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGNvbnN0IHBvc2l0aW9uQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgaWYgKCFwb3NpdGlvbkJ1ZmZlcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHBvc2l0aW9uIGJ1ZmZlcicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcbiAgICBjb25zdCBwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oXG4gICAgICAgIHByb2dyYW0sXG4gICAgICAgICdhX3Bvc2l0aW9uJ1xuICAgICk7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8gRG8gbm90IHJlbW92ZSBjb21tZW50cywgdXNlZCBmb3Igc2FuaXR5IGNoZWNrXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFNldCB0aGUgdmFsdWVzIG9mIHRoZSBidWZmZXJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvLyBjb25zdCBjb2xvcnMgPSBbMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMF07XG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyBjb25zdCBwb3NpdGlvbnMgPSBbMTAwLCA1MCwgMjAsIDEwLCA1MDAsIDUwMF07XG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyA9PT09XG4gICAgLy8gRHJhd1xuICAgIC8vID09PT1cbiAgICAvLyBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywgMCwgMyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbkJ1ZmZlcixcbiAgICAgICAgcHJvZ3JhbSxcbiAgICAgICAgY29sb3JCdWZmZXIsXG4gICAgICAgIGdsLFxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIiwiaW1wb3J0IFZlcnRleCBmcm9tICcuL0Jhc2UvVmVydGV4JztcblxuZXhwb3J0IGNvbnN0IGV1Y2xpZGVhbkRpc3RhbmNlVnR4ID0gKGE6IFZlcnRleCwgYjogVmVydGV4KTogbnVtYmVyID0+IHtcbiAgICBjb25zdCBkeCA9IGEueCAtIGIueDtcbiAgICBjb25zdCBkeSA9IGEueSAtIGIueTtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xufTtcblxuZXhwb3J0IGNvbnN0IGV1Y2xpZGVhbkRpc3RhbmNlID0gKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICBjb25zdCBkeCA9IGF4IC0gYng7XG4gIGNvbnN0IGR5ID0gYXkgLSBieTtcblxuICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcbn07XG5cbi8vIDM2MCBERUdcbmV4cG9ydCBjb25zdCBnZXRBbmdsZSA9IChvcmlnaW46IFZlcnRleCwgdGFyZ2V0OiBWZXJ0ZXgpID0+IHtcbiAgICBjb25zdCBwbHVzTWludXNEZWcgPSByYWRUb0RlZyhNYXRoLmF0YW4yKG9yaWdpbi55IC0gdGFyZ2V0LnksIG9yaWdpbi54IC0gdGFyZ2V0LngpKTtcbiAgICByZXR1cm4gcGx1c01pbnVzRGVnID49IDAgPyAxODAgLSBwbHVzTWludXNEZWcgOiBNYXRoLmFicyhwbHVzTWludXNEZWcpICsgMTgwO1xufVxuXG5leHBvcnQgY29uc3QgcmFkVG9EZWcgPSAocmFkOiBudW1iZXIpID0+IHtcbiAgICByZXR1cm4gcmFkICogMTgwIC8gTWF0aC5QSTtcbn1cblxuZXhwb3J0IGNvbnN0IGRlZ1RvUmFkID0gKGRlZzogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIGRlZyAqIE1hdGguUEkgLyAxODA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1JnYihoZXg6IHN0cmluZykge1xuICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XG4gIHJldHVybiByZXN1bHQgPyB7XG4gICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXG4gICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXG4gICAgYjogcGFyc2VJbnQocmVzdWx0WzNdLCAxNilcbiAgfSA6IG51bGw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZ2JUb0hleChyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XG4gIHJldHVybiBcIiNcIiArICgxIDw8IDI0IHwgciA8PCAxNiB8IGcgPDwgOCB8IGIpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcbn1cblxuZXhwb3J0IGNvbnN0IG0zID0ge1xuICAgIGlkZW50aXR5OiBmdW5jdGlvbigpIDogbnVtYmVyW10ge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgMSwgMCwgMCxcbiAgICAgICAgMCwgMSwgMCxcbiAgICAgICAgMCwgMCwgMSxcbiAgICAgIF07XG4gICAgfSxcbiAgXG4gICAgdHJhbnNsYXRpb246IGZ1bmN0aW9uKHR4IDogbnVtYmVyLCB0eSA6IG51bWJlcikgOiBudW1iZXJbXSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAxLCAwLCAwLFxuICAgICAgICAwLCAxLCAwLFxuICAgICAgICB0eCwgdHksIDEsXG4gICAgICBdO1xuICAgIH0sXG4gIFxuICAgIHJvdGF0aW9uOiBmdW5jdGlvbihhbmdsZUluUmFkaWFucyA6IG51bWJlcikgOiBudW1iZXJbXSB7XG4gICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGMsLXMsIDAsXG4gICAgICAgIHMsIGMsIDAsXG4gICAgICAgIDAsIDAsIDEsXG4gICAgICBdO1xuICAgIH0sXG4gIFxuICAgIHNjYWxpbmc6IGZ1bmN0aW9uKHN4IDogbnVtYmVyLCBzeSA6IG51bWJlcikgOiBudW1iZXJbXSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBzeCwgMCwgMCxcbiAgICAgICAgMCwgc3ksIDAsXG4gICAgICAgIDAsIDAsIDEsXG4gICAgICBdO1xuICAgIH0sXG4gIFxuICAgIG11bHRpcGx5OiBmdW5jdGlvbihhIDogbnVtYmVyW10sIGIgOiBudW1iZXJbXSkgOiBudW1iZXJbXSB7XG4gICAgICBjb25zdCBhMDAgPSBhWzAgKiAzICsgMF07XG4gICAgICBjb25zdCBhMDEgPSBhWzAgKiAzICsgMV07XG4gICAgICBjb25zdCBhMDIgPSBhWzAgKiAzICsgMl07XG4gICAgICBjb25zdCBhMTAgPSBhWzEgKiAzICsgMF07XG4gICAgICBjb25zdCBhMTEgPSBhWzEgKiAzICsgMV07XG4gICAgICBjb25zdCBhMTIgPSBhWzEgKiAzICsgMl07XG4gICAgICBjb25zdCBhMjAgPSBhWzIgKiAzICsgMF07XG4gICAgICBjb25zdCBhMjEgPSBhWzIgKiAzICsgMV07XG4gICAgICBjb25zdCBhMjIgPSBhWzIgKiAzICsgMl07XG4gICAgICBjb25zdCBiMDAgPSBiWzAgKiAzICsgMF07XG4gICAgICBjb25zdCBiMDEgPSBiWzAgKiAzICsgMV07XG4gICAgICBjb25zdCBiMDIgPSBiWzAgKiAzICsgMl07XG4gICAgICBjb25zdCBiMTAgPSBiWzEgKiAzICsgMF07XG4gICAgICBjb25zdCBiMTEgPSBiWzEgKiAzICsgMV07XG4gICAgICBjb25zdCBiMTIgPSBiWzEgKiAzICsgMl07XG4gICAgICBjb25zdCBiMjAgPSBiWzIgKiAzICsgMF07XG4gICAgICBjb25zdCBiMjEgPSBiWzIgKiAzICsgMV07XG4gICAgICBjb25zdCBiMjIgPSBiWzIgKiAzICsgMl07XG4gICAgICByZXR1cm4gW1xuICAgICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXG4gICAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcbiAgICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxuICAgICAgICBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjAsXG4gICAgICAgIGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMSxcbiAgICAgICAgYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyLFxuICAgICAgICBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjAsXG4gICAgICAgIGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMSxcbiAgICAgICAgYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyLFxuICAgICAgXTtcbiAgICB9LFxuXG4gICAgaW52ZXJzZTogZnVuY3Rpb24obSA6IG51bWJlcltdKSB7XG4gICAgICBjb25zdCBkZXQgPSBtWzBdICogKG1bNF0gKiBtWzhdIC0gbVs3XSAqIG1bNV0pIC1cbiAgICAgICAgICAgICAgICAgIG1bMV0gKiAobVszXSAqIG1bOF0gLSBtWzVdICogbVs2XSkgK1xuICAgICAgICAgICAgICAgICAgbVsyXSAqIChtWzNdICogbVs3XSAtIG1bNF0gKiBtWzZdKTtcbiAgXG4gICAgICBpZiAoZGV0ID09PSAwKSByZXR1cm4gbnVsbDtcbiAgXG4gICAgICBjb25zdCBpbnZEZXQgPSAxIC8gZGV0O1xuICBcbiAgICAgIHJldHVybiBbIFxuICAgICAgICAgIGludkRldCAqIChtWzRdICogbVs4XSAtIG1bNV0gKiBtWzddKSwgXG4gICAgICAgICAgaW52RGV0ICogKG1bMl0gKiBtWzddIC0gbVsxXSAqIG1bOF0pLFxuICAgICAgICAgIGludkRldCAqIChtWzFdICogbVs1XSAtIG1bMl0gKiBtWzRdKSxcbiAgICAgICAgICBpbnZEZXQgKiAobVs1XSAqIG1bNl0gLSBtWzNdICogbVs4XSksXG4gICAgICAgICAgaW52RGV0ICogKG1bMF0gKiBtWzhdIC0gbVsyXSAqIG1bNl0pLFxuICAgICAgICAgIGludkRldCAqIChtWzJdICogbVszXSAtIG1bMF0gKiBtWzVdKSxcbiAgICAgICAgICBpbnZEZXQgKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSksXG4gICAgICAgICAgaW52RGV0ICogKG1bMV0gKiBtWzZdIC0gbVswXSAqIG1bN10pLFxuICAgICAgICAgIGludkRldCAqIChtWzBdICogbVs0XSAtIG1bMV0gKiBtWzNdKVxuICAgICAgXTtcbiAgfSxcblxuICAgIG11bHRpcGx5M3gxOiBmdW5jdGlvbihhIDogbnVtYmVyW10sIGIgOiBudW1iZXJbXSkgOiBudW1iZXJbXSB7XG4gICAgICBjb25zdCBhMDAgPSBhWzAgKiAzICsgMF07XG4gICAgICBjb25zdCBhMDEgPSBhWzAgKiAzICsgMV07XG4gICAgICBjb25zdCBhMDIgPSBhWzAgKiAzICsgMl07XG4gICAgICBjb25zdCBhMTAgPSBhWzEgKiAzICsgMF07XG4gICAgICBjb25zdCBhMTEgPSBhWzEgKiAzICsgMV07XG4gICAgICBjb25zdCBhMTIgPSBhWzEgKiAzICsgMl07XG4gICAgICBjb25zdCBhMjAgPSBhWzIgKiAzICsgMF07XG4gICAgICBjb25zdCBhMjEgPSBhWzIgKiAzICsgMV07XG4gICAgICBjb25zdCBhMjIgPSBhWzIgKiAzICsgMl07XG4gICAgICBjb25zdCBiMDAgPSBiWzAgKiAzICsgMF07XG4gICAgICBjb25zdCBiMDEgPSBiWzAgKiAzICsgMV07XG4gICAgICBjb25zdCBiMDIgPSBiWzAgKiAzICsgMl07XG4gICAgICByZXR1cm4gW1xuICAgICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXG4gICAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcbiAgICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxuICAgICAgXTtcbiAgICB9LFxuXG4gICAgdHJhbnNsYXRlOiBmdW5jdGlvbihtIDogbnVtYmVyW10sIHR4Om51bWJlciwgdHk6bnVtYmVyKSB7XG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMudHJhbnNsYXRpb24odHgsIHR5KSk7XG4gICAgfSxcbiAgXG4gICAgcm90YXRlOiBmdW5jdGlvbihtOm51bWJlcltdLCBhbmdsZUluUmFkaWFuczpudW1iZXIpIHtcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy5yb3RhdGlvbihhbmdsZUluUmFkaWFucykpO1xuICAgIH0sXG4gIFxuICAgIHNjYWxlOiBmdW5jdGlvbihtOm51bWJlcltdLCBzeDpudW1iZXIsIHN5Om51bWJlcikge1xuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnNjYWxpbmcoc3gsIHN5KSk7XG4gICAgfSxcbiAgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=