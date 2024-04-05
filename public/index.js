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
            shape.setTransformationMatrix();
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
var LineMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/LineMakerController */ "./src/Controllers/Maker/Shape/LineMakerController.ts"));
var RectangleMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/RectangleMakerController */ "./src/Controllers/Maker/Shape/RectangleMakerController.ts"));
var SquareMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/SquareMakerController */ "./src/Controllers/Maker/Shape/SquareMakerController.ts"));
var TriangleMakerController_1 = __importDefault(__webpack_require__(/*! ./Shape/TriangleMakerController */ "./src/Controllers/Maker/Shape/TriangleMakerController.ts"));
var AVAIL_SHAPES;
(function (AVAIL_SHAPES) {
    AVAIL_SHAPES["Line"] = "Line";
    AVAIL_SHAPES["Rectangle"] = "Rectangle";
    AVAIL_SHAPES["Square"] = "Square";
    AVAIL_SHAPES["Triangle"] = "Triangle";
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
        switch (shapeStr) {
            case AVAIL_SHAPES.Line:
                return new LineMakerController_1.default(this.appCanvas);
            case AVAIL_SHAPES.Rectangle:
                return new RectangleMakerController_1.default(this.appCanvas);
            case AVAIL_SHAPES.Square:
                return new SquareMakerController_1.default(this.appCanvas);
            case AVAIL_SHAPES.Triangle:
                return new TriangleMakerController_1.default(this.appCanvas);
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

/***/ "./src/Controllers/Maker/Shape/TriangleMakerController.ts":
/*!****************************************************************!*\
  !*** ./src/Controllers/Maker/Shape/TriangleMakerController.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Color_1 = __importDefault(__webpack_require__(/*! ../../../Base/Color */ "./src/Base/Color.ts"));
var Triangle_1 = __importDefault(__webpack_require__(/*! ../../../Shapes/Triangle */ "./src/Shapes/Triangle.ts"));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
var SquareMakerController = /** @class */ (function () {
    function SquareMakerController(appCanvas) {
        this.pointOne = null;
        this.pointTwo = null;
        this.appCanvas = appCanvas;
    }
    SquareMakerController.prototype.handleClick = function (x, y, hex) {
        var _a;
        if (this.pointOne === null) {
            this.pointOne = { x: x, y: y };
        }
        else if (this.pointTwo === null) {
            this.pointTwo = { x: x, y: y };
        }
        else {
            var _b = (_a = (0, utils_1.hexToRgb)(hex)) !== null && _a !== void 0 ? _a : { r: 0, g: 0, b: 0 }, r = _b.r, g = _b.g, b = _b.b;
            var color = new Color_1.default(r / 255, g / 255, b / 255);
            var id = this.appCanvas.generateIdFromTag('triangle');
            var v1 = { x: this.pointOne.x, y: this.pointOne.y };
            console.log("v1x: ".concat(v1.x, ", v1y: ").concat(v1.y));
            var v2 = { x: this.pointTwo.x,
                y: this.pointTwo.y };
            console.log("v2x: ".concat(v2.x, ", v2y: ").concat(v2.y));
            var v3 = { x: x, y: y };
            console.log("v3x: ".concat(v3.x, ", v3y: ").concat(v3.y));
            var triangle = new Triangle_1.default(id, color, v1.x, v1.y, v2.x, v2.y, v3.x, v3.y);
            this.appCanvas.addShape(triangle);
            this.pointOne = null;
            this.pointTwo = null;
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
        this.vtxPosXSlider = this.createSliderVertex('Pos X', vertex.x, -0.5 * this.appCanvas.width, 0.5 * this.appCanvas.width);
        this.vtxPosYSlider = this.createSliderVertex('Pos Y', vertex.y, -0.5 * this.appCanvas.width, 0.5 * this.appCanvas.width);
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

/***/ "./src/Controllers/Toolbar/Shape/TriangleToolbarController.ts":
/*!********************************************************************!*\
  !*** ./src/Controllers/Toolbar/Shape/TriangleToolbarController.ts ***!
  \********************************************************************/
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
var TriangleToolbarController = /** @class */ (function (_super) {
    __extends(TriangleToolbarController, _super);
    function TriangleToolbarController(triangle, appCanvas) {
        var _this = _super.call(this, triangle, appCanvas) || this;
        _this.triangle = triangle;
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
    TriangleToolbarController.prototype.updatePosX = function (newPosX) {
        this.triangle.translation[0] = newPosX;
        this.updateShape(this.triangle);
    };
    TriangleToolbarController.prototype.updatePosY = function (newPosY) {
        this.triangle.translation[1] = newPosY;
        this.updateShape(this.triangle);
    };
    TriangleToolbarController.prototype.updateLength = function (newSize) {
        this.triangle.scale[0] = newSize / 300;
        this.updateShape(this.triangle);
    };
    TriangleToolbarController.prototype.updateWidth = function (newSize) {
        this.triangle.scale[1] = newSize / 300;
        this.updateShape(this.triangle);
    };
    TriangleToolbarController.prototype.updateRotation = function (newRotation) {
        this.triangle.angleInRadians = (0, utils_1.degToRad)(newRotation);
        this.updateShape(this.triangle);
    };
    TriangleToolbarController.prototype.updateVertex = function (idx, x, y) {
        var vertex = this.triangle.pointList[idx];
        var deltaX = x - vertex.x;
        var deltaY = y - vertex.y;
        var movementVector = [deltaX, deltaY, 1];
        // const inverseTransformationMatrix = m3.inverse(this.triangle.transformationMatrix);
        // if (!inverseTransformationMatrix) return;
        // const transformedMovement = m3.multiply3x1(inverseTransformationMatrix, movementVector);
        vertex.x += movementVector[0];
        vertex.y += movementVector[1];
        this.updateShape(this.triangle);
    };
    return TriangleToolbarController;
}(ShapeToolbarController_1.default));
exports["default"] = TriangleToolbarController;


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
var Square_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Square */ "./src/Shapes/Square.ts"));
var Triangle_1 = __importDefault(__webpack_require__(/*! ../../Shapes/Triangle */ "./src/Shapes/Triangle.ts"));
var LineToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/LineToolbarController */ "./src/Controllers/Toolbar/Shape/LineToolbarController.ts"));
var RectangleToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/RectangleToolbarController */ "./src/Controllers/Toolbar/Shape/RectangleToolbarController.ts"));
var SquareToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/SquareToolbarController */ "./src/Controllers/Toolbar/Shape/SquareToolbarController.ts"));
var TriangleToolbarController_1 = __importDefault(__webpack_require__(/*! ./Shape/TriangleToolbarController */ "./src/Controllers/Toolbar/Shape/TriangleToolbarController.ts"));
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
            else if (shape instanceof Triangle_1.default) {
                _this.toolbarController = new TriangleToolbarController_1.default(shape, appCanvas);
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

/***/ "./src/Shapes/Triangle.ts":
/*!********************************!*\
  !*** ./src/Shapes/Triangle.ts ***!
  \********************************/
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
var Triangle = /** @class */ (function (_super) {
    __extends(Triangle, _super);
    function Triangle(id, color, x1, y1, x2, y2, x3, y3, rotation, scaleX, scaleY) {
        if (rotation === void 0) { rotation = 0; }
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        var _this = this;
        var centerX = (x1 + x2 + x3) / 3;
        var centerY = (y1 + y2 + y3) / 3;
        var center = new Vertex_1.default(centerX, centerY, color);
        _this = _super.call(this, 4, id, color, center, rotation, scaleX, scaleY) || this;
        var v1 = new Vertex_1.default(x1, y1, color);
        var v2 = new Vertex_1.default(x2, y2, color);
        var v3 = new Vertex_1.default(x3, y3, color);
        _this.pointList.push(v1, v2, v3);
        _this.bufferTransformationList = _this.pointList;
        console.log(_this.pointList);
        return _this;
    }
    return Triangle;
}(BaseShape_1.default));
exports["default"] = Triangle;


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
exports.m3 = exports.rgbToHex = exports.hexToRgb = exports.degToRad = exports.radToDeg = exports.getAngle = exports.euclideanDistanceVtx = void 0;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFFBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBakMsQ0FBaUMsRUFBQyxDQUFDLEdBQUcsR0FBQyxTQUFTLENBQUMsS0FBSyxFQUFDLEdBQUcsR0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEksS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRS9GLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRXJHLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0YsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsV0FBVyxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRWxHLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBTSxlQUFRLENB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QUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxDQUFDLElBQU0sS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUM7UUFFL0YsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxjQUFNLFFBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBakMsQ0FBaUMsRUFBQyxDQUFDLEdBQUcsR0FBQyxTQUFTLENBQUMsS0FBSyxFQUFDLEdBQUcsR0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEksS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRS9GLEtBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBL0IsQ0FBK0IsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDNUYsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRS9GLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0RyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxZQUFZLEVBQUUsVUFBQyxDQUFDLElBQU0sS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUMsQ0FBQzs7SUFDNUcsQ0FBQztJQUVPLDRDQUFVLEdBQWxCLFVBQW1CLE9BQWM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTyw0Q0FBVSxHQUFsQixVQUFtQixPQUFjO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztRQUNyQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU8sNENBQVUsR0FBbEIsVUFBbUIsT0FBYztRQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLEdBQUMsR0FBRyxDQUFDO1FBQ25DLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBQyxHQUFHLENBQUM7UUFDbkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVPLGdEQUFjLEdBQXRCLFVBQXVCLFdBQW1CO1FBQ3RDLElBQUksQ0FBQyxNQUFNLENBQUMsY0FBYyxHQUFHLG9CQUFRLEVBQUMsV0FBVyxDQUFDLENBQUM7UUFDbkQsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELDhDQUFZLEdBQVosVUFBYSxHQUFXLEVBQUUsQ0FBUyxFQUFFLENBQVM7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUV2QixJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLHdCQUF3QixDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELGlDQUFpQztRQUNqQyxxREFBcUQ7UUFDckQscURBQXFEO1FBR3JELGdFQUFnRTtRQUNoRSxrQ0FBa0M7UUFDbEMsd0RBQXdEO1FBRXhELDBEQUEwRDtRQUMxRCxzREFBc0Q7UUFDdEQsaUZBQWlGO1FBQ2pGLHNEQUFzRDtRQUV0RCx5Q0FBeUM7UUFFekMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDYixNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUViLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFDTCw4QkFBQztBQUFELENBQUMsQ0F4RW9ELGdDQUFzQixHQXdFMUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDNUVELGlLQUE4RDtBQUM5RCwwRUFBOEM7QUFJOUM7SUFBdUQsNkNBQXNCO0lBVXpFLG1DQUFZLFFBQWtCLEVBQUUsU0FBb0I7UUFDaEQsa0JBQUssWUFBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLFNBQUM7UUFDM0IsS0FBSSxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFekIsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxjQUFNLGVBQVEsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUEvQixDQUErQixFQUFDLENBQUMsR0FBRyxHQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUMsR0FBRyxHQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNsSSxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxDQUFDLElBQU0sS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUM7UUFFL0YsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFlBQVksRUFBRSxjQUFNLFFBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBakMsQ0FBaUMsRUFBQyxDQUFDLEdBQUcsR0FBQyxTQUFTLENBQUMsS0FBSyxFQUFDLEdBQUcsR0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEksS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsVUFBVSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRS9GLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRXJHLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0YsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsV0FBVyxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRWxHLEtBQUksQ0FBQyxZQUFZ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Q0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEVBQVcsRUFBRSxFQUFXO1FBQ3hDLE9BQU87WUFDTCxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDUixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDUixDQUFDO0lBQ0osQ0FBQztJQUVELFFBQVEsRUFBRSxVQUFTLENBQVksRUFBRSxDQUFZO1FBQzNDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE9BQU87WUFDTCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLENBQVk7UUFDNUIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFM0IsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUV2QixPQUFPO1lBQ0gsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkMsQ0FBQztJQUNOLENBQUM7SUFFQyxXQUFXLEVBQUUsVUFBUyxDQUFZLEVBQUUsQ0FBWTtRQUM5QyxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixPQUFPO1lBQ0wsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7U0FDbEMsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLEVBQUUsVUFBUyxDQUFZLEVBQUUsRUFBUyxFQUFFLEVBQVM7UUFDcEQsT0FBTyxVQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxNQUFNLEVBQUUsVUFBUyxDQUFVLEVBQUUsY0FBcUI7UUFDaEQsT0FBTyxVQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELEtBQUssRUFBRSxVQUFTLENBQVUsRUFBRSxFQUFTLEVBQUUsRUFBUztRQUM5QyxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNGLENBQUM7Ozs7Ozs7VUM1Sko7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Npc2tvbS8uL3NyYy9BcHBDYW52YXMudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQmFzZVNoYXBlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL0NvbG9yLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL1ZlcnRleC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvQ2FudmFzQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvTGluZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9TcXVhcmVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL1RyaWFuZ2xlTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL0xpbmVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9SZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9TaGFwZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1NxdWFyZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1RyaWFuZ2xlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9MaW5lLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvUmVjdGFuZ2xlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvU3F1YXJlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvVHJpYW5nbGUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9pbml0LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9CYXNlL0Jhc2VTaGFwZSc7XG5pbXBvcnQgeyBtMyB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBDYW52YXMge1xuICAgIHByaXZhdGUgcHJvZ3JhbTogV2ViR0xQcm9ncmFtO1xuICAgIHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dDtcbiAgICBwcml2YXRlIHBvc2l0aW9uQnVmZmVyOiBXZWJHTEJ1ZmZlcjtcbiAgICBwcml2YXRlIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcjtcbiAgICBwcml2YXRlIF91cGRhdGVUb29sYmFyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICAgIHByaXZhdGUgX3NoYXBlczogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPiA9IHt9O1xuXG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxuICAgICAgICBwcm9ncmFtOiBXZWJHTFByb2dyYW0sXG4gICAgICAgIHBvc2l0aW9uQnVmZmVyOiBXZWJHTEJ1ZmZlcixcbiAgICAgICAgY29sb3JCdWZmZXI6IFdlYkdMQnVmZmVyXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZ2wgPSBnbDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkJ1ZmZlciA9IHBvc2l0aW9uQnVmZmVyO1xuICAgICAgICB0aGlzLmNvbG9yQnVmZmVyID0gY29sb3JCdWZmZXI7XG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHByb2dyYW07XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IGdsLmNhbnZhcy53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBnbC5jYW52YXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIHJlbmRlcigpIHtcbiAgICAgICAgY29uc3QgZ2wgPSB0aGlzLmdsO1xuICAgICAgICBjb25zdCBwb3NpdGlvbkJ1ZmZlciA9IHRoaXMucG9zaXRpb25CdWZmZXI7XG4gICAgICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gdGhpcy5jb2xvckJ1ZmZlcjtcblxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2hhcGVzKS5mb3JFYWNoKChzaGFwZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gc2hhcGUucG9pbnRMaXN0LmZsYXRNYXAoKHBvaW50KSA9PiBbXG4gICAgICAgICAgICAgICAgcG9pbnQueCxcbiAgICAgICAgICAgICAgICBwb2ludC55LFxuICAgICAgICAgICAgXSk7XG5cbiAgICAgICAgICAgIGxldCBjb2xvcnM6IG51bWJlcltdID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYXBlLnBvaW50TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbG9ycy5wdXNoKHNoYXBlLnBvaW50TGlzdFtpXS5jLnIsIHNoYXBlLnBvaW50TGlzdFtpXS5jLmcsIHNoYXBlLnBvaW50TGlzdFtpXS5jLmIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBCaW5kIGNvbG9yIGRhdGFcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxuICAgICAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIC8vIEJpbmQgcG9zaXRpb24gZGF0YVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKSxcbiAgICAgICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgaWYgKCEodGhpcy5wb3NpdGlvbkJ1ZmZlciBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIlBvc2l0aW9uIGJ1ZmZlciBpcyBub3QgYSB2YWxpZCBXZWJHTEJ1ZmZlclwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYgKCEodGhpcy5jb2xvckJ1ZmZlciBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNvbG9yIGJ1ZmZlciBpcyBub3QgYSB2YWxpZCBXZWJHTEJ1ZmZlclwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gU2V0IHRyYW5zZm9ybWF0aW9uIG1hdHJpeFxuICAgICAgICAgICAgc2hhcGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcblxuICAgICAgICAgICAgY29uc3QgbWF0cml4TG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcInVfdHJhbnNmb3JtYXRpb25cIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoc2hhcGUudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xuICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XG5cbiAgICAgICAgICAgIC8vIGNvbnN0IGFwcGx5U3BlY2lhbFRyZWF0bWVudExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X2FwcGx5U3BlY2lhbFRyZWF0bWVudFwiKTtcbiAgICAgICAgICAgIC8vIGNvbnN0IHNwZWNpYWxPZmZzZXRMb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbih0aGlzLnByb2dyYW0sIFwidV9zcGVjaWFsT2Zmc2V0XCIpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBjb25zdCBhcHBseVNwZWNpYWxUcmVhdG1lbnQgPSBmYWxzZTsgXG4gICAgICAgICAgICAvLyBjb25zdCBzcGVjaWFsT2Zmc2V0ID0gWzAuMCwgMC4wXTtcblxuICAgICAgICAgICAgLy8gZ2wudW5pZm9ybTFpKGFwcGx5U3BlY2lhbFRyZWF0bWVudExvY2F0aW9uLCBhcHBseVNwZWNpYWxUcmVhdG1lbnQgPyAxIDogMCk7XG4gICAgICAgICAgICAvLyBnbC51bmlmb3JtMmZ2KHNwZWNpYWxPZmZzZXRMb2NhdGlvbiwgbmV3IEZsb2F0MzJBcnJheShzcGVjaWFsT2Zmc2V0KSk7XG5cbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoc2hhcGUuZ2xEcmF3VHlwZSwgMCwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aCk7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzaGFwZXMoKTogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVzKHY6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4pIHtcbiAgICAgICAgdGhpcy5fc2hhcGVzID0gdjtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZVRvb2xiYXIpXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVUb29sYmFyLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB1cGRhdGVUb29sYmFyKHYgOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xiYXIgPSB2O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZW5lcmF0ZUlkRnJvbVRhZyh0YWc6IHN0cmluZykge1xuICAgICAgICBjb25zdCB3aXRoU2FtZVRhZyA9IE9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5maWx0ZXIoKGlkKSA9PiBpZC5zdGFydHNXaXRoKHRhZyArICctJykpO1xuICAgICAgICByZXR1cm4gYCR7dGFnfS0ke3dpdGhTYW1lVGFnLmxlbmd0aCArIDF9YFxuICAgIH1cblxuICAgIHB1YmxpYyBhZGRTaGFwZShzaGFwZTogQmFzZVNoYXBlKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMoc2hhcGUuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBhbHJlYWR5IHVzZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcbiAgICAgICAgbmV3U2hhcGVzW3NoYXBlLmlkXSA9IHNoYXBlO1xuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZWRpdFNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMobmV3U2hhcGUuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBub3QgZm91bmQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcbiAgICAgICAgbmV3U2hhcGVzW25ld1NoYXBlLmlkXSA9IG5ld1NoYXBlO1xuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVsZXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NoYXBlIElEIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xuICAgICAgICBkZWxldGUgbmV3U2hhcGVzW25ld1NoYXBlLmlkXTtcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XG4gICAgfVxufSIsImltcG9ydCB7IG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4vQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4vVmVydGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEJhc2VTaGFwZSB7XG5cbiAgICBwb2ludExpc3Q6IFZlcnRleFtdID0gW107XG4gICAgYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0OiBWZXJ0ZXhbXSA9IFtdO1xuICAgIGlkOiBzdHJpbmc7XG4gICAgY29sb3I6IENvbG9yO1xuICAgIGdsRHJhd1R5cGU6IG51bWJlcjtcbiAgICBjZW50ZXI6IFZlcnRleDtcblxuICAgIHRyYW5zbGF0aW9uOiBbbnVtYmVyLCBudW1iZXJdID0gWzAsIDBdO1xuICAgIGFuZ2xlSW5SYWRpYW5zOiBudW1iZXIgPSAwO1xuICAgIHNjYWxlOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xuXG4gICAgdHJhbnNmb3JtYXRpb25NYXRyaXg6IG51bWJlcltdID0gbTMuaWRlbnRpdHkoKTtcblxuICAgIGNvbnN0cnVjdG9yKGdsRHJhd1R5cGU6IG51bWJlciwgaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCBjZW50ZXI6IFZlcnRleCA9IG5ldyBWZXJ0ZXgoMCwgMCwgY29sb3IpLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcbiAgICAgICAgdGhpcy5nbERyYXdUeXBlID0gZ2xEcmF3VHlwZTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gcm90YXRpb247XG4gICAgICAgIHRoaXMuc2NhbGVbMF0gPSBzY2FsZVg7XG4gICAgICAgIHRoaXMuc2NhbGVbMV0gPSBzY2FsZVk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCl7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5pZGVudGl0eSgpXG4gICAgICAgIGNvbnN0IHRyYW5zbGF0ZVRvQ2VudGVyID0gbTMudHJhbnNsYXRpb24oLXRoaXMuY2VudGVyLngsIC10aGlzLmNlbnRlci55KTtcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSBtMy5yb3RhdGlvbih0aGlzLmFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgbGV0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHRoaXMuc2NhbGVbMF0sIHRoaXMuc2NhbGVbMV0pO1xuICAgICAgICBsZXQgdHJhbnNsYXRlQmFjayA9IG0zLnRyYW5zbGF0aW9uKHRoaXMuY2VudGVyLngsIHRoaXMuY2VudGVyLnkpO1xuICAgICAgICBjb25zdCB0cmFuc2xhdGUgPSBtMy50cmFuc2xhdGlvbih0aGlzLnRyYW5zbGF0aW9uWzBdLCB0aGlzLnRyYW5zbGF0aW9uWzFdKTtcblxuICAgICAgICBsZXQgcmVzU2NhbGUgPSBtMy5tdWx0aXBseShzY2FsaW5nLCB0cmFuc2xhdGVUb0NlbnRlcik7XG4gICAgICAgIGxldCByZXNSb3RhdGUgPSBtMy5tdWx0aXBseShyb3RhdGlvbixyZXNTY2FsZSk7XG4gICAgICAgIGxldCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzUm90YXRlKTtcbiAgICAgICAgY29uc3QgcmVzVHJhbnNsYXRlID0gbTMubXVsdGlwbHkodHJhbnNsYXRlLCByZXNCYWNrKTtcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHJlc1RyYW5zbGF0ZTtcbiAgICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvciB7XG4gICAgcjogbnVtYmVyO1xuICAgIGc6IG51bWJlcjtcbiAgICBiOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuciA9IHI7XG4gICAgICAgIHRoaXMuZyA9IGc7XG4gICAgICAgIHRoaXMuYiA9IGI7XG4gICAgfVxufVxuIiwiaW1wb3J0IENvbG9yIGZyb20gXCIuL0NvbG9yXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlcnRleCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBjOiBDb2xvcjtcbiAgICBpc1NlbGVjdGVkIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBjOiBDb2xvciwgaXNTZWxlY3RlZDogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHRoaXMuYyA9IGM7XG4gICAgICAgIHRoaXMuaXNTZWxlY3RlZCA9IGlzU2VsZWN0ZWQ7XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGUvSVNoYXBlTWFrZXJDb250cm9sbGVyJztcbmltcG9ydCBMaW5lTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZU1ha2VyQ29udHJvbGxlcic7XG5pbXBvcnQgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyJztcbmltcG9ydCBTcXVhcmVNYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9TcXVhcmVNYWtlckNvbnRyb2xsZXInO1xuaW1wb3J0IFRyaWFuZ2xlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvVHJpYW5nbGVNYWtlckNvbnRyb2xsZXInO1xuXG5lbnVtIEFWQUlMX1NIQVBFUyB7XG4gICAgTGluZSA9ICdMaW5lJyxcbiAgICBSZWN0YW5nbGUgPSAnUmVjdGFuZ2xlJyxcbiAgICBTcXVhcmUgPSAnU3F1YXJlJyxcbiAgICBUcmlhbmdsZSA9ICdUcmlhbmdsZSdcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBfc2hhcGVDb250cm9sbGVyOiBJU2hhcGVNYWtlckNvbnRyb2xsZXI7XG4gICAgcHJpdmF0ZSBjYW52YXNFbG10OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBwcml2YXRlIGJ1dHRvbkNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBjb2xvclBpY2tlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG5cbiAgICAgICAgY29uc3QgY2FudmFzRWxtdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3NoYXBlLWJ1dHRvbi1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5jYW52YXNFbG10ID0gY2FudmFzRWxtdDtcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBidXR0b25Db250YWluZXI7XG5cbiAgICAgICAgdGhpcy5fc2hhcGVDb250cm9sbGVyID0gbmV3IExpbmVNYWtlckNvbnRyb2xsZXIoYXBwQ2FudmFzKTtcblxuICAgICAgICB0aGlzLmNvbG9yUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAnc2hhcGUtY29sb3ItcGlja2VyJ1xuICAgICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5jYW52YXNFbG10Lm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29ycmVjdFggPSBlLm9mZnNldFggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RZID0gZS5vZmZzZXRZICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlcj8uaGFuZGxlQ2xpY2soXG4gICAgICAgICAgICAgICAgY29ycmVjdFgsXG4gICAgICAgICAgICAgICAgY29ycmVjdFksXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvclBpY2tlci52YWx1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdldCBzaGFwZUNvbnRyb2xsZXIoKTogSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlQ29udHJvbGxlcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldCBzaGFwZUNvbnRyb2xsZXIodjogSVNoYXBlTWFrZXJDb250cm9sbGVyKSB7XG4gICAgICAgIHRoaXMuX3NoYXBlQ29udHJvbGxlciA9IHY7XG5cbiAgICAgICAgdGhpcy5jYW52YXNFbG10Lm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY29ycmVjdFggPSBlLm9mZnNldFggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RZID0gZS5vZmZzZXRZICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlcj8uaGFuZGxlQ2xpY2soY29ycmVjdFgsIGNvcnJlY3RZICx0aGlzLmNvbG9yUGlja2VyLnZhbHVlKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGluaXRDb250cm9sbGVyKHNoYXBlU3RyOiBBVkFJTF9TSEFQRVMpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgICAgICBzd2l0Y2ggKHNoYXBlU3RyKSB7XG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5MaW5lOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgTGluZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5SZWN0YW5nbGU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuU3F1YXJlOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgU3F1YXJlTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLlRyaWFuZ2xlOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVHJpYW5nbGVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBzaGFwZSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICBmb3IgKGNvbnN0IHNoYXBlU3RyIGluIEFWQUlMX1NIQVBFUykge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2hhcGUtYnV0dG9uJyk7XG4gICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBzaGFwZVN0cjtcbiAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyID0gdGhpcy5pbml0Q29udHJvbGxlcihcbiAgICAgICAgICAgICAgICAgICAgc2hhcGVTdHIgYXMgQVZBSUxfU0hBUEVTXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lci5hcHBlbmRDaGlsZChidXR0b24pO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBMaW5lIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvTGluZVwiO1xuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gXCIuL0lTaGFwZU1ha2VyQ29udHJvbGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHtyLCBnLCBifSA9IGhleFRvUmdiKGhleCkgPz8ge3I6IDAsIGc6IDAsIGI6IDB9O1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdsaW5lJyk7XG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoaWQsIGNvbG9yLCB0aGlzLm9yaWdpbi54LCB0aGlzLm9yaWdpbi55LCB4LCB5KTtcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKGxpbmUpO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvUmVjdGFuZ2xlXCI7XG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB7ciwgZywgYn0gPSBoZXhUb1JnYihoZXgpID8/IHtyOiAwLCBnOiAwLCBiOiAwfTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygncmVjdGFuZ2xlJyk7XG4gICAgICAgICAgICBjb25zdCByZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdGhpcy5vcmlnaW4ueCwgdGhpcy5vcmlnaW4ueSwgeCwgeSwwLDEsMSk7XG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZShyZWN0YW5nbGUpO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgU3F1YXJlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvU3F1YXJlXCI7XG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCB7ciwgZywgYn0gPSBoZXhUb1JnYihoZXgpID8/IHtyOiAwLCBnOiAwLCBiOiAwfTtcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygnc3F1YXJlJyk7XG5cbiAgICAgICAgICAgIGNvbnN0IHYxID0ge3g6IHgsIHk6IHl9O1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHYxeDogJHt2MS54fSwgdjF5OiAke3YxLnl9YClcblxuICAgICAgICAgICAgY29uc3QgdjIgPSB7eDogdGhpcy5vcmlnaW4ueCAtICh5IC0gdGhpcy5vcmlnaW4ueSksIFxuICAgICAgICAgICAgICAgIHk6IHRoaXMub3JpZ2luLnkgKyAoeC10aGlzLm9yaWdpbi54KX1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2Mng6ICR7djIueH0sIHYyeTogJHt2Mi55fWApXG5cbiAgICAgICAgICAgIGNvbnN0IHYzID0ge3g6IDIqdGhpcy5vcmlnaW4ueCAtIHgsIFxuICAgICAgICAgICAgICAgIHk6IDIqdGhpcy5vcmlnaW4ueSAtIHl9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjN4OiAke3YzLnh9LCB2M3k6ICR7djMueX1gKVxuXG4gICAgICAgICAgICBjb25zdCB2NCA9IHt4OiB0aGlzLm9yaWdpbi54ICsgKHkgLSB0aGlzLm9yaWdpbi55KSwgXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSAtICh4LXRoaXMub3JpZ2luLngpfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHY0eDogJHt2NC54fSwgdjR5OiAke3Y0Lnl9YClcblxuICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gbmV3IFNxdWFyZShcbiAgICAgICAgICAgICAgICBpZCwgY29sb3IsIHYxLngsIHYxLnksIHYyLngsIHYyLnksIHYzLngsIHYzLnksIHY0LngsIHY0LnkpO1xuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUoc3F1YXJlKTtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vLi4vLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IFRyaWFuZ2xlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvVHJpYW5nbGVcIjtcbmltcG9ydCB7IGhleFRvUmdiIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgcG9pbnRPbmU6IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIHBvaW50VHdvOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMucG9pbnRPbmUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRPbmUgPSB7eCwgeX07XG4gICAgICAgIH0gZWxzZSBpZiAodGhpcy5wb2ludFR3byA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5wb2ludFR3byA9IHt4LCB5fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHtyLCBnLCBifSA9IGhleFRvUmdiKGhleCkgPz8ge3I6IDAsIGc6IDAsIGI6IDB9O1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCd0cmlhbmdsZScpO1xuXG4gICAgICAgICAgICBjb25zdCB2MSA9IHt4OiB0aGlzLnBvaW50T25lLngsIHk6IHRoaXMucG9pbnRPbmUueX07XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgdjF4OiAke3YxLnh9LCB2MXk6ICR7djEueX1gKVxuXG4gICAgICAgICAgICBjb25zdCB2MiA9IHt4OiB0aGlzLnBvaW50VHdvLngsIFxuICAgICAgICAgICAgICAgIHk6IHRoaXMucG9pbnRUd28ueX1cbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGB2Mng6ICR7djIueH0sIHYyeTogJHt2Mi55fWApXG5cbiAgICAgICAgICAgIGNvbnN0IHYzID0ge3g6IHgsIHk6IHl9XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgdjN4OiAke3YzLnh9LCB2M3k6ICR7djMueX1gKVxuXG4gICAgICAgICAgICBjb25zdCB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZShcbiAgICAgICAgICAgICAgICBpZCwgY29sb3IsIHYxLngsIHYxLnksIHYyLngsIHYyLnksIHYzLngsIHYzLnkpO1xuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUodHJpYW5nbGUpO1xuICAgICAgICAgICAgdGhpcy5wb2ludE9uZSA9IG51bGw7XG4gICAgICAgICAgICB0aGlzLnBvaW50VHdvID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgTGluZSBmcm9tICcuLi8uLi8uLi9TaGFwZXMvTGluZSc7XG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuaW1wb3J0IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBsZW5ndGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSBsaW5lOiBMaW5lO1xuXG4gICAgY29uc3RydWN0b3IobGluZTogTGluZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgc3VwZXIobGluZSwgYXBwQ2FudmFzKTtcblxuICAgICAgICB0aGlzLmxpbmUgPSBsaW5lO1xuXG4gICAgICAgIGNvbnN0IGRpYWdvbmFsID0gTWF0aC5zcXJ0KFxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoICogYXBwQ2FudmFzLndpZHRoICtcbiAgICAgICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0ICogYXBwQ2FudmFzLmhlaWdodFxuICAgICAgICApO1xuICAgICAgICB0aGlzLmxlbmd0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxuICAgICAgICAgICAgJ0xlbmd0aCcsXG4gICAgICAgICAgICAoKSA9PiBsaW5lLmxlbmd0aCxcbiAgICAgICAgICAgIDEsXG4gICAgICAgICAgICBkaWFnb25hbFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMubGVuZ3RoU2xpZGVyLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVMZW5ndGgocGFyc2VJbnQodGhpcy5sZW5ndGhTbGlkZXIudmFsdWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXG4gICAgICAgICAgICAnUG9zaXRpb24gWCcsXG4gICAgICAgICAgICAoKSA9PiBsaW5lLnBvaW50TGlzdFswXS54LFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIGFwcENhbnZhcy53aWR0aFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5wb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXG4gICAgICAgICAgICAnUG9zaXRpb24gWScsXG4gICAgICAgICAgICAoKSA9PiBsaW5lLnBvaW50TGlzdFswXS55LFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHRcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1lTbGlkZXIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgdGhpcy5jdXJyZW50QW5nbGUuYmluZCh0aGlzKSwgMCwgMzYwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUm90YXRpb24ocGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgbGluZUxlbiA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXSxcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV1cbiAgICAgICAgKTtcbiAgICAgICAgY29uc3QgY29zID1cbiAgICAgICAgICAgICh0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLngpIC8gbGluZUxlbjtcbiAgICAgICAgY29uc3Qgc2luID1cbiAgICAgICAgICAgICh0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnkpIC8gbGluZUxlbjtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS54ID0gbmV3TGVuICogY29zICsgdGhpcy5saW5lLnBvaW50TGlzdFswXS54O1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgPSBuZXdMZW4gKiBzaW4gKyB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnk7XG5cbiAgICAgICAgdGhpcy5saW5lLmxlbmd0aCA9IG5ld0xlbjtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NYKG5ld1Bvc1g6IG51bWJlcikge1xuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS54IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS54O1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnggPSBuZXdQb3NYO1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggPSBuZXdQb3NYICsgZGlmZjtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMubGluZS5wb2ludExpc3RbMV0ueSAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueTtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS55ID0gbmV3UG9zWTtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID0gbmV3UG9zWSArIGRpZmY7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGN1cnJlbnRBbmdsZSgpIHtcbiAgICAgICAgcmV0dXJuIGdldEFuZ2xlKHRoaXMubGluZS5wb2ludExpc3RbMF0sIHRoaXMubGluZS5wb2ludExpc3RbMV0pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUm90YXRpb24obmV3Um90OiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgcmFkID0gZGVnVG9SYWQobmV3Um90KTtcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MocmFkKTtcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4ocmFkKTtcblxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggPVxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS54ICsgY29zICogdGhpcy5saW5lLmxlbmd0aDtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXS55ID1cbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSAtIHNpbiAqIHRoaXMubGluZS5sZW5ndGg7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFtpZHhdLnggPSB4O1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0W2lkeF0ueSA9IHk7XG5cbiAgICAgICAgdGhpcy5saW5lLmxlbmd0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXSxcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV1cbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xuaW1wb3J0IENvbG9yIGZyb20gJy4uLy4uLy4uL0Jhc2UvQ29sb3InO1xuaW1wb3J0IFZlcnRleCBmcm9tICcuLi8uLi8uLi9CYXNlL1ZlcnRleCc7XG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGUnO1xuaW1wb3J0IHsgZGVnVG9SYWQsIGV1Y2xpZGVhbkRpc3RhbmNlVnR4LCBnZXRBbmdsZSwgaGV4VG9SZ2IsIG0zLCByZ2JUb0hleCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcbmltcG9ydCBTaGFwZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHdpZHRoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgbGVuZ3RoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSByZWN0YW5nbGU6IFJlY3RhbmdsZTtcblxuICAgIGNvbnN0cnVjdG9yKHJlY3RhbmdsZTogUmVjdGFuZ2xlLCBhcHBDYW52YXM6IEFwcENhbnZhcyl7XG4gICAgICAgIHN1cGVyKHJlY3RhbmdsZSwgYXBwQ2FudmFzKTtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUgPSByZWN0YW5nbGU7XG5cbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFgnLCAoKSA9PiBwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSl9KVxuXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBZJywgKCkgPT4gKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSl9KVxuXG4gICAgICAgIHRoaXMubGVuZ3RoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ0xlbmd0aCcsICgpID0+IHBhcnNlSW50KHRoaXMubGVuZ3RoU2xpZGVyLnZhbHVlKSwgMTUwLDQ1MCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5sZW5ndGhTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVMZW5ndGgocGFyc2VJbnQodGhpcy5sZW5ndGhTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy53aWR0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdXaWR0aCcsICgpID0+IHBhcnNlSW50KHRoaXMud2lkdGhTbGlkZXIudmFsdWUpLCAxNTAsNDUwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLndpZHRoU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlV2lkdGgocGFyc2VJbnQodGhpcy53aWR0aFNsaWRlci52YWx1ZSkpfSlcblxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsICgpID0+IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSwgLTM2MCwgMzYwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSl9KVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOm51bWJlcil7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnRyYW5zbGF0aW9uWzBdID0gbmV3UG9zWDtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgICAgIFxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOm51bWJlcil7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnRyYW5zbGF0aW9uWzFdID0gbmV3UG9zWTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuZ3RoOm51bWJlcil7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnNjYWxlWzBdID0gbmV3TGVuZ3RoLzMwMDtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVXaWR0aChuZXdXaWR0aDpudW1iZXIpe1xuICAgICAgICB0aGlzLnJlY3RhbmdsZS5zY2FsZVsxXSA9IG5ld1dpZHRoLzMwMDtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3RhdGlvbiA6bnVtYmVyKXtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSBkZWdUb1JhZChuZXdSb3RhdGlvbik7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicm90YXRpb246IFwiLCBuZXdSb3RhdGlvbik7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xuICAgICAgICBmb3IobGV0IGk9MDsgaTw0OyBpKyspe1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJ4OiBcIiwgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLngsIFwieTpcIix0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaV0ueSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZHtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwieGF3YWwgOlwiICwgeCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInlhd2FsOiBcIiAsIHkpO1xuXG4gICAgICAgICAgICBjb25zdCBjZW50ZXJYID0gKHRoaXMucmVjdGFuZ2xlLmluaXRpYWxQb2ludFswXSArIHRoaXMucmVjdGFuZ2xlLmVuZFBvaW50WzBdKSAvIDI7XG4gICAgICAgICAgICBjb25zdCBjZW50ZXJZID0gKHRoaXMucmVjdGFuZ2xlLmluaXRpYWxQb2ludFsxXSArIHRoaXMucmVjdGFuZ2xlLmVuZFBvaW50WzFdKSAvIDI7XG4gICAgICAgIFxuICAgICAgICAgICAgbGV0IHRyYW5zbGF0ZWRYID0geCAtIGNlbnRlclg7XG4gICAgICAgICAgICBsZXQgdHJhbnNsYXRlZFkgPSB5IC0gY2VudGVyWTtcbiAgICAgICAgXG4gICAgICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMucmVjdGFuZ2xlLmFuZ2xlSW5SYWRpYW5zOyAvLyBJbnZlcnNlIHJvdGF0aW9uIGFuZ2xlXG4gICAgICAgICAgICBjb25zdCBkeCA9IHRyYW5zbGF0ZWRYICogTWF0aC5jb3MoYW5nbGUpIC0gdHJhbnNsYXRlZFkgKiBNYXRoLnNpbihhbmdsZSk7XG4gICAgICAgICAgICBjb25zdCBkeSA9IHRyYW5zbGF0ZWRYICogTWF0aC5zaW4oYW5nbGUpICsgdHJhbnNsYXRlZFkgKiBNYXRoLmNvcyhhbmdsZSk7XG4gICAgICAgIFxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxYID0gZHggKyBjZW50ZXJYO1xuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxZID0gZHkgKyBjZW50ZXJZO1xuXG4gICAgICAgICAgICBjb25zdCBtb3ZlbWVudFggPSBvcmlnaW5hbFggLSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS54O1xuICAgICAgICAgICAgY29uc3QgbW92ZW1lbnRZID0gb3JpZ2luYWxZIC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKFwieDpcIiAsIG1vdmVtZW50WCk7XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhcInk6XCIgLG1vdmVtZW50WSk7XG4gICAgICAgIFxuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueCArPSBtb3ZlbWVudFg7XG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS55ICs9IG1vdmVtZW50WTtcblxuICAgICAgICAgICAgY29uc3QgYWRqYWNlbnRWZXJ0aWNlcyA9IFswLCAxLCAyLCAzXS5maWx0ZXIoaSA9PiBpICE9PSBpZHggJiYgaSAhPT0gdGhpcy5yZWN0YW5nbGUuZmluZE9wcG9zaXRlKGlkeCkpO1xuXG4gICAgICAgICAgICBjb25zdCBwb2ludExpc3QgPSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3Q7XG4gICAgICAgICAgICBjb25zdCBjd0FkamFjZW50SWR4ID0gdGhpcy5yZWN0YW5nbGUuZmluZENXQWRqYWNlbnQoaWR4KTtcbiAgICAgICAgICAgIGNvbnN0IGNjd0FkamFjZW50SWR4ID0gdGhpcy5yZWN0YW5nbGUuZmluZENDV0FkamFjZW50KGlkeCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlSWR4ID0gdGhpcy5yZWN0YW5nbGUuZmluZE9wcG9zaXRlKGlkeCk7XG5cbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlUG9pbnRYID0gcG9pbnRMaXN0W29wcG9zaXRlSWR4XS54O1xuICAgICAgICAgICAgY29uc3Qgb3Bwb3NpdGVQb2ludFkgPSBwb2ludExpc3Rbb3Bwb3NpdGVJZHhdLnk7XG5cbiAgICAgICAgICAgIC8vIFRvIGF2b2lkIHN0dWNrXG4gICAgICAgICAgICBhZGphY2VudFZlcnRpY2VzLmZvckVhY2godmVydGV4SWR4ID0+IHtcbiAgICAgICAgICAgICAgICBpZiAodmVydGV4SWR4ID09PSBjd0FkamFjZW50SWR4IHx8IHZlcnRleElkeCA9PT0gY2N3QWRqYWNlbnRJZHgpIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4UG9pbnQgPSBwb2ludExpc3RbdmVydGV4SWR4XTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAodmVydGV4UG9pbnQueCA9PT0gb3Bwb3NpdGVQb2ludFggJiYgdmVydGV4UG9pbnQueSA9PT0gb3Bwb3NpdGVQb2ludFkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhtb3ZlbWVudFgpID4gTWF0aC5hYnMobW92ZW1lbnRZKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleFBvaW50LnggKz0gbW92ZW1lbnRYO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC55ICs9IG1vdmVtZW50WTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQb2ludC54ICE9PSBvcHBvc2l0ZVBvaW50WCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRleFBvaW50LnggKz0gbW92ZW1lbnRYO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBvaW50LnkgIT09IG9wcG9zaXRlUG9pbnRZKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4UG9pbnQueSArPSBtb3ZlbWVudFk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uLy4uLy4uL0Jhc2UvQmFzZVNoYXBlJztcbmltcG9ydCBDb2xvciBmcm9tICcuLi8uLi8uLi9CYXNlL0NvbG9yJztcbmltcG9ydCB7IGhleFRvUmdiLCByZ2JUb0hleCB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHVibGljIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgc2hhcGU6IEJhc2VTaGFwZTtcblxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHVibGljIHZlcnRleENvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgICBwdWJsaWMgdmVydGV4UGlja2VyOiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICBwcml2YXRlIHNlbGVjdGVkVmVydGV4ID0gJzAnO1xuXG4gICAgcHVibGljIHZ0eFBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgICBwdWJsaWMgdnR4UG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIHB1YmxpYyB2dHhDb2xvclBpY2tlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSBzbGlkZXJMaXN0OiBIVE1MSW5wdXRFbGVtZW50W10gPSBbXTtcbiAgICBwcml2YXRlIGdldHRlckxpc3Q6ICgoKSA9PiBudW1iZXIpW10gPSBbXTtcblxuICAgIGNvbnN0cnVjdG9yKHNoYXBlOiBCYXNlU2hhcGUsIGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuc2hhcGUgPSBzaGFwZTtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG5cbiAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICd2ZXJ0ZXgtY29udGFpbmVyJ1xuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMudmVydGV4UGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndmVydGV4LXBpY2tlcidcbiAgICAgICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcblxuICAgICAgICB0aGlzLmluaXRWZXJ0ZXhUb29sYmFyKCk7XG4gICAgfVxuXG4gICAgY3JlYXRlU2xpZGVyKFxuICAgICAgICBsYWJlbDogc3RyaW5nLFxuICAgICAgICB2YWx1ZUdldHRlcjogKCkgPT4gbnVtYmVyLFxuICAgICAgICBtaW46IG51bWJlcixcbiAgICAgICAgbWF4OiBudW1iZXJcbiAgICApOiBIVE1MSW5wdXRFbGVtZW50IHtcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcblxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xuXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgc2xpZGVyLnR5cGUgPSAncmFuZ2UnO1xuICAgICAgICBzbGlkZXIubWluID0gbWluLnRvU3RyaW5nKCk7XG4gICAgICAgIHNsaWRlci5tYXggPSBtYXgudG9TdHJpbmcoKTtcbiAgICAgICAgc2xpZGVyLnZhbHVlID0gdmFsdWVHZXR0ZXIudG9TdHJpbmcoKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlcik7XG5cbiAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICAgICAgdGhpcy5zbGlkZXJMaXN0LnB1c2goc2xpZGVyKTtcbiAgICAgICAgdGhpcy5nZXR0ZXJMaXN0LnB1c2godmFsdWVHZXR0ZXIpO1xuXG4gICAgICAgIHJldHVybiBzbGlkZXI7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJTbGlkZXIoc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50LCBjYjogKGU6IEV2ZW50KSA9PiBhbnkpIHtcbiAgICAgICAgY29uc3QgbmV3Q2IgPSAoZTogRXZlbnQpID0+IHtcbiAgICAgICAgICAgIGNiKGUpO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTbGlkZXJzKHNsaWRlcik7XG4gICAgICAgIH07XG4gICAgICAgIHNsaWRlci5vbmNoYW5nZSA9IG5ld0NiO1xuICAgICAgICBzbGlkZXIub25pbnB1dCA9IG5ld0NiO1xuICAgIH1cblxuICAgIHVwZGF0ZVNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMuZWRpdFNoYXBlKG5ld1NoYXBlKTtcbiAgICB9XG5cbiAgICB1cGRhdGVTbGlkZXJzKGlnbm9yZVNsaWRlcjogSFRNTElucHV0RWxlbWVudCkge1xuICAgICAgICB0aGlzLnNsaWRlckxpc3QuZm9yRWFjaCgoc2xpZGVyLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGlmIChpZ25vcmVTbGlkZXIgPT09IHNsaWRlcikgcmV0dXJuO1xuICAgICAgICAgICAgc2xpZGVyLnZhbHVlID0gdGhpcy5nZXR0ZXJMaXN0W2lkeF0oKS50b1N0cmluZygpO1xuICAgICAgICB9KTtcblxuICAgICAgICBpZiAodGhpcy52dHhQb3NYU2xpZGVyICYmIHRoaXMudnR4UG9zWVNsaWRlcikge1xuICAgICAgICAgICAgY29uc3QgaWR4ID0gcGFyc2VJbnQodGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUpO1xuICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy5zaGFwZS5wb2ludExpc3RbaWR4XTtcblxuICAgICAgICAgICAgdGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlID0gdmVydGV4LngudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIHRoaXMudnR4UG9zWVNsaWRlci52YWx1ZSA9IHZlcnRleC55LnRvU3RyaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBjcmVhdGVTbGlkZXJWZXJ0ZXgoXG4gICAgICAgIGxhYmVsOiBzdHJpbmcsXG4gICAgICAgIGN1cnJlbnRMZW5ndGg6IG51bWJlcixcbiAgICAgICAgbWluOiBudW1iZXIsXG4gICAgICAgIG1heDogbnVtYmVyXG4gICAgKTogSFRNTElucHV0RWxlbWVudCB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9vbGJhci1zbGlkZXItY29udGFpbmVyJyk7XG5cbiAgICAgICAgY29uc3QgbGFiZWxFbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxhYmVsRWxtdC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxFbG10KTtcblxuICAgICAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIHNsaWRlci50eXBlID0gJ3JhbmdlJztcbiAgICAgICAgc2xpZGVyLm1pbiA9IG1pbi50b1N0cmluZygpO1xuICAgICAgICBzbGlkZXIubWF4ID0gbWF4LnRvU3RyaW5nKCk7XG4gICAgICAgIHNsaWRlci52YWx1ZSA9IGN1cnJlbnRMZW5ndGgudG9TdHJpbmcoKTtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlcik7XG5cbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgICAgICByZXR1cm4gc2xpZGVyO1xuICAgIH1cblxuICAgIGNyZWF0ZUNvbG9yUGlja2VyVmVydGV4KGxhYmVsOiBzdHJpbmcsIGhleDogc3RyaW5nKTogSFRNTElucHV0RWxlbWVudCB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9vbGJhci1zbGlkZXItY29udGFpbmVyJyk7XG5cbiAgICAgICAgY29uc3QgbGFiZWxFbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxhYmVsRWxtdC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxFbG10KTtcblxuICAgICAgICBjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcbiAgICAgICAgY29sb3JQaWNrZXIudHlwZSA9ICdjb2xvcic7XG4gICAgICAgIGNvbG9yUGlja2VyLnZhbHVlID0gaGV4O1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29sb3JQaWNrZXIpO1xuXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICAgICAgcmV0dXJuIGNvbG9yUGlja2VyO1xuICAgIH1cblxuICAgIGRyYXdWZXJ0ZXhUb29sYmFyKCkge1xuICAgICAgICB3aGlsZSAodGhpcy52ZXJ0ZXhDb250YWluZXIuZmlyc3RDaGlsZClcbiAgICAgICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMudmVydGV4Q29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgIGNvbnN0IGlkeCA9IHBhcnNlSW50KHRoaXMudmVydGV4UGlja2VyLnZhbHVlKTtcbiAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy5zaGFwZS5wb2ludExpc3RbaWR4XTtcblxuICAgICAgICB0aGlzLnZ0eFBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcbiAgICAgICAgICAgICdQb3MgWCcsXG4gICAgICAgICAgICB2ZXJ0ZXgueCxcbiAgICAgICAgICAgIC0wLjUqdGhpcy5hcHBDYW52YXMud2lkdGgsXG4gICAgICAgICAgICAwLjUqdGhpcy5hcHBDYW52YXMud2lkdGhcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcbiAgICAgICAgICAgICdQb3MgWScsXG4gICAgICAgICAgICB2ZXJ0ZXgueSxcbiAgICAgICAgICAgIC0wLjUqdGhpcy5hcHBDYW52YXMud2lkdGgsXG4gICAgICAgICAgICAwLjUqdGhpcy5hcHBDYW52YXMud2lkdGhcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCB1cGRhdGVTbGlkZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy52dHhQb3NYU2xpZGVyICYmIHRoaXMudnR4UG9zWVNsaWRlcilcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZlcnRleChcbiAgICAgICAgICAgICAgICAgICAgaWR4LFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh0aGlzLnZ0eFBvc1hTbGlkZXIudmFsdWUpLFxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh0aGlzLnZ0eFBvc1lTbGlkZXIudmFsdWUpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnZ0eENvbG9yUGlja2VyID0gdGhpcy5jcmVhdGVDb2xvclBpY2tlclZlcnRleChcbiAgICAgICAgICAgICdDb2xvcicsXG4gICAgICAgICAgICByZ2JUb0hleCh2ZXJ0ZXguYy5yICogMjU1LCB2ZXJ0ZXguYy5nICogMjU1LCB2ZXJ0ZXguYy5iICogMjU1KVxuICAgICAgICApO1xuXG4gICAgICAgIGNvbnN0IHVwZGF0ZUNvbG9yID0gKCkgPT4ge1xuICAgICAgICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBoZXhUb1JnYihcbiAgICAgICAgICAgICAgICB0aGlzLnZ0eENvbG9yUGlja2VyPy52YWx1ZSA/PyAnIzAwMDAwMCdcbiAgICAgICAgICAgICkgPz8geyByOiAwLCBnOiAwLCBiOiAwIH07XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1KTtcbiAgICAgICAgICAgIHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF0uYyA9IGNvbG9yO1xuICAgICAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNoYXBlKTtcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4UG9zWFNsaWRlciwgdXBkYXRlU2xpZGVyKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnZ0eFBvc1lTbGlkZXIsIHVwZGF0ZVNsaWRlcik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhDb2xvclBpY2tlciwgdXBkYXRlQ29sb3IpO1xuICAgIH1cblxuICAgIGluaXRWZXJ0ZXhUb29sYmFyKCkge1xuICAgICAgICB3aGlsZSAodGhpcy52ZXJ0ZXhQaWNrZXIuZmlyc3RDaGlsZClcbiAgICAgICAgICAgIHRoaXMudmVydGV4UGlja2VyLnJlbW92ZUNoaWxkKHRoaXMudmVydGV4UGlja2VyLmZpcnN0Q2hpbGQpO1xuXG4gICAgICAgIHRoaXMuc2hhcGUucG9pbnRMaXN0LmZvckVhY2goKF8sIGlkeCkgPT4ge1xuICAgICAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBvcHRpb24udmFsdWUgPSBpZHgudG9TdHJpbmcoKTtcbiAgICAgICAgICAgIG9wdGlvbi5sYWJlbCA9IGBWZXJ0ZXggJHtpZHh9YDtcbiAgICAgICAgICAgIHRoaXMudmVydGV4UGlja2VyLmFwcGVuZENoaWxkKG9wdGlvbik7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMudmVydGV4UGlja2VyLnZhbHVlID0gdGhpcy5zZWxlY3RlZFZlcnRleDtcbiAgICAgICAgdGhpcy5kcmF3VmVydGV4VG9vbGJhcigpO1xuXG4gICAgICAgIHRoaXMudmVydGV4UGlja2VyLm9uY2hhbmdlID0gKCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5kcmF3VmVydGV4VG9vbGJhcigpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIGFic3RyYWN0IHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkO1xufVxuIiwiaW1wb3J0IFNxdWFyZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL1NxdWFyZVwiO1xuaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xuaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi8uLi8uLi9CYXNlL0Jhc2VTaGFwZSc7XG5pbXBvcnQgU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tIFwiLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyXCI7XG5pbXBvcnQgeyBkZWdUb1JhZCwgbTMgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcblxuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzaXplU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIC8vIHByaXZhdGUgcG9pbnRTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIHNxdWFyZTogU3F1YXJlO1xuXG4gICAgY29uc3RydWN0b3Ioc3F1YXJlOiBTcXVhcmUsIGFwcENhbnZhczogQXBwQ2FudmFzKXtcbiAgICAgICAgc3VwZXIoc3F1YXJlLCBhcHBDYW52YXMpO1xuICAgICAgICB0aGlzLnNxdWFyZSA9IHNxdWFyZTtcblxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWCcsICgpID0+IHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSksLTAuNSphcHBDYW52YXMud2lkdGgsMC41KmFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy5wb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFknLCAoKSA9PiAocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSksLTAuNSphcHBDYW52YXMud2lkdGgsMC41KmFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy5zaXplU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1NpemUnLCAoKSA9PiBwYXJzZUludCh0aGlzLnNpemVTbGlkZXIudmFsdWUpLCAxNTAsNDUwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnNpemVTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVTaXplKHBhcnNlSW50KHRoaXMuc2l6ZVNsaWRlci52YWx1ZSkpfSlcblxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsICgpID0+IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSwgLTM2MCwgMzYwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSl9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDpudW1iZXIpe1xuICAgICAgICB0aGlzLnNxdWFyZS50cmFuc2xhdGlvblswXSA9IG5ld1Bvc1g7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zcXVhcmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOm51bWJlcil7XG4gICAgICAgIHRoaXMuc3F1YXJlLnRyYW5zbGF0aW9uWzFdID0gbmV3UG9zWTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVTaXplKG5ld1NpemU6bnVtYmVyKXtcbiAgICAgICAgdGhpcy5zcXVhcmUuc2NhbGVbMF0gPSBuZXdTaXplLzMwMDtcbiAgICAgICAgdGhpcy5zcXVhcmUuc2NhbGVbMV0gPSBuZXdTaXplLzMwMDtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3RhdGlvbiA6bnVtYmVyKXtcbiAgICAgICAgdGhpcy5zcXVhcmUuYW5nbGVJblJhZGlhbnMgPSBkZWdUb1JhZChuZXdSb3RhdGlvbik7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zcXVhcmUpO1xuICAgIH1cblxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc29sZS5sb2coXCJ0ZXN0aW5nXCIpO1xuXG4gICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc3F1YXJlLmJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdFtpZHhdO1xuICAgICAgICAvLyBjb25zdCBvcHBvc2l0ZSA9IChpZHggKyAyKSAlIDRcbiAgICAgICAgLy8gY29uc3Qgb3JpZ2luWCA9IHRoaXMuc3F1YXJlLnBvaW50TGlzdFtvcHBvc2l0ZV0ueDtcbiAgICAgICAgLy8gY29uc3Qgb3JpZ2luWSA9IHRoaXMuc3F1YXJlLnBvaW50TGlzdFtvcHBvc2l0ZV0ueTtcbiAgICAgICAgXG5cbiAgICAgICAgLy8gY29uc3QgdHJhbnNsYXRlVG9DZW50ZXIgPSBtMy50cmFuc2xhdGlvbigtb3JpZ2luWCwgLW9yaWdpblkpO1xuICAgICAgICAvLyBsZXQgc2NhbGluZyA9IG0zLnNjYWxpbmcoeCwgeSk7XG4gICAgICAgIC8vIGxldCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24ob3JpZ2luWCwgb3JpZ2luWSk7XG5cbiAgICAgICAgLy8gbGV0IHJlc1NjYWxlID0gbTMubXVsdGlwbHkoc2NhbGluZywgdHJhbnNsYXRlVG9DZW50ZXIpO1xuICAgICAgICAvLyBsZXQgcmVzQmFjayA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZUJhY2ssIHJlc1NjYWxlKTtcbiAgICAgICAgLy8gY29uc3QgcmVzVmVydGV4VXBkYXRlID0gbTMubXVsdGlwbHkocmVzQmFjaywgdGhpcy5zcXVhcmUudHJhbnNmb3JtYXRpb25NYXRyaXgpXG4gICAgICAgIC8vIHRoaXMuc3F1YXJlLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gcmVzVmVydGV4VXBkYXRlO1xuXG4gICAgICAgIC8vIHRoaXMuc3F1YXJlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XG5cbiAgICAgICAgdmVydGV4LnggPSB4O1xuICAgICAgICB2ZXJ0ZXgueSA9IHk7XG5cbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XG4gICAgfVxufSIsImltcG9ydCBTcXVhcmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9TcXVhcmVcIjtcbmltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi4vLi4vLi4vQmFzZS9CYXNlU2hhcGUnO1xuaW1wb3J0IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSBcIi4vU2hhcGVUb29sYmFyQ29udHJvbGxlclwiO1xuaW1wb3J0IHsgZGVnVG9SYWQsIG0zIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgVHJpYW5nbGUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9UcmlhbmdsZVwiO1xuXG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRyaWFuZ2xlVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgbGVuZ3RoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgd2lkdGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgLy8gcHJpdmF0ZSBwb2ludFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcblxuICAgIHByaXZhdGUgdHJpYW5nbGU6IFRyaWFuZ2xlO1xuXG4gICAgY29uc3RydWN0b3IodHJpYW5nbGU6IFRyaWFuZ2xlLCBhcHBDYW52YXM6IEFwcENhbnZhcyl7XG4gICAgICAgIHN1cGVyKHRyaWFuZ2xlLCBhcHBDYW52YXMpO1xuICAgICAgICB0aGlzLnRyaWFuZ2xlID0gdHJpYW5nbGU7XG5cbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFgnLCAoKSA9PiBwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSl9KVxuXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBZJywgKCkgPT4gKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSl9KVxuXG4gICAgICAgIHRoaXMubGVuZ3RoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ0xlbmd0aCcsICgpID0+IHBhcnNlSW50KHRoaXMubGVuZ3RoU2xpZGVyLnZhbHVlKSwgMTUwLDQ1MCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5sZW5ndGhTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVMZW5ndGgocGFyc2VJbnQodGhpcy5sZW5ndGhTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy53aWR0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdXaWR0aCcsICgpID0+IHBhcnNlSW50KHRoaXMud2lkdGhTbGlkZXIudmFsdWUpLCAxNTAsNDUwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLndpZHRoU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlV2lkdGgocGFyc2VJbnQodGhpcy53aWR0aFNsaWRlci52YWx1ZSkpfSlcblxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsICgpID0+IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSwgLTM2MCwgMzYwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSl9KVxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOm51bWJlcil7XG4gICAgICAgIHRoaXMudHJpYW5nbGUudHJhbnNsYXRpb25bMF0gPSBuZXdQb3NYO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMudHJpYW5nbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOm51bWJlcil7XG4gICAgICAgIHRoaXMudHJpYW5nbGUudHJhbnNsYXRpb25bMV0gPSBuZXdQb3NZO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMudHJpYW5nbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlTGVuZ3RoKG5ld1NpemU6bnVtYmVyKXtcbiAgICAgICAgdGhpcy50cmlhbmdsZS5zY2FsZVswXSA9IG5ld1NpemUvMzAwO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMudHJpYW5nbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlV2lkdGgobmV3U2l6ZTpudW1iZXIpe1xuICAgICAgICB0aGlzLnRyaWFuZ2xlLnNjYWxlWzFdID0gbmV3U2l6ZS8zMDA7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy50cmlhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3RhdGlvbiA6bnVtYmVyKXtcbiAgICAgICAgdGhpcy50cmlhbmdsZS5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKG5ld1JvdGF0aW9uKTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnRyaWFuZ2xlKTtcbiAgICB9XG5cbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMudHJpYW5nbGUucG9pbnRMaXN0W2lkeF07XG4gICAgICAgIGNvbnN0IGRlbHRhWCA9IHggLSB2ZXJ0ZXgueDtcbiAgICAgICAgY29uc3QgZGVsdGFZID0geSAtIHZlcnRleC55O1xuXG4gICAgICAgIGNvbnN0IG1vdmVtZW50VmVjdG9yID0gW2RlbHRhWCwgZGVsdGFZLCAxXTtcbiAgICAgICAgLy8gY29uc3QgaW52ZXJzZVRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMuaW52ZXJzZSh0aGlzLnRyaWFuZ2xlLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcbiAgICAgICAgLy8gaWYgKCFpbnZlcnNlVHJhbnNmb3JtYXRpb25NYXRyaXgpIHJldHVybjtcblxuICAgICAgICAvLyBjb25zdCB0cmFuc2Zvcm1lZE1vdmVtZW50ID0gbTMubXVsdGlwbHkzeDEoaW52ZXJzZVRyYW5zZm9ybWF0aW9uTWF0cml4LCBtb3ZlbWVudFZlY3Rvcik7XG5cbiAgICAgICAgdmVydGV4LnggKz0gbW92ZW1lbnRWZWN0b3JbMF07XG4gICAgICAgIHZlcnRleC55ICs9IG1vdmVtZW50VmVjdG9yWzFdO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy50cmlhbmdsZSk7XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uL1NoYXBlcy9MaW5lJztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgU3F1YXJlIGZyb20gJy4uLy4uL1NoYXBlcy9TcXVhcmUnO1xuaW1wb3J0IFRyaWFuZ2xlIGZyb20gJy4uLy4uL1NoYXBlcy9UcmlhbmdsZSc7XG5pbXBvcnQgTGluZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBJU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xuaW1wb3J0IFNxdWFyZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvU3F1YXJlVG9vbGJhckNvbnRyb2xsZXInO1xuaW1wb3J0IFRyaWFuZ2xlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9UcmlhbmdsZVRvb2xiYXJDb250cm9sbGVyJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbGJhckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XG4gICAgcHJpdmF0ZSB0b29sYmFyQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcbiAgICBwcml2YXRlIGl0ZW1QaWNrZXI6IEhUTUxTZWxlY3RFbGVtZW50O1xuICAgIHByaXZhdGUgc2VsZWN0ZWRJZDogc3RyaW5nID0gJyc7XG5cbiAgICBwcml2YXRlIHRvb2xiYXJDb250cm9sbGVyOiBJU2hhcGVUb29sYmFyQ29udHJvbGxlciB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLnVwZGF0ZVRvb2xiYXIgPSB0aGlzLnVwZGF0ZVNoYXBlTGlzdC5iaW5kKHRoaXMpO1xuXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3Rvb2xiYXItY29udGFpbmVyJ1xuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3Rvb2xiYXItaXRlbS1waWNrZXInXG4gICAgICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLm9uY2hhbmdlID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJZCA9IHRoaXMuaXRlbVBpY2tlci52YWx1ZTtcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5hcHBDYW52YXMuc2hhcGVzW3RoaXMuaXRlbVBpY2tlci52YWx1ZV07XG4gICAgICAgICAgICB0aGlzLmNsZWFyVG9vbGJhckVsbXQoKTtcblxuICAgICAgICAgICAgaWYgKHNoYXBlIGluc3RhbmNlb2YgTGluZSkge1xuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRyb2xsZXIgPSBuZXcgTGluZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIExpbmUsIGFwcENhbnZhcyk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgUmVjdGFuZ2xlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBSZWN0YW5nbGUsIGFwcENhbnZhcylcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUgaW5zdGFuY2VvZiBTcXVhcmUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFNxdWFyZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFNxdWFyZSwgYXBwQ2FudmFzKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSBpbnN0YW5jZW9mIFRyaWFuZ2xlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBUcmlhbmdsZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFRyaWFuZ2xlLCBhcHBDYW52YXMpXG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZUxpc3QoKTtcbiAgICB9XG5cbiAgICB1cGRhdGVTaGFwZUxpc3QoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLml0ZW1QaWNrZXIuZmlyc3RDaGlsZClcbiAgICAgICAgICAgIHRoaXMuaXRlbVBpY2tlci5yZW1vdmVDaGlsZCh0aGlzLml0ZW1QaWNrZXIuZmlyc3RDaGlsZCk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICBwbGFjZWhvbGRlci50ZXh0ID0gJ0Nob29zZSBhbiBvYmplY3QnO1xuICAgICAgICBwbGFjZWhvbGRlci52YWx1ZSA9ICcnO1xuICAgICAgICB0aGlzLml0ZW1QaWNrZXIuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xuXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5hcHBDYW52YXMuc2hhcGVzKS5mb3JFYWNoKChzaGFwZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgICAgIGNoaWxkLnRleHQgPSBzaGFwZS5pZDtcbiAgICAgICAgICAgIGNoaWxkLnZhbHVlID0gc2hhcGUuaWQ7XG4gICAgICAgICAgICB0aGlzLml0ZW1QaWNrZXIuYXBwZW5kQ2hpbGQoY2hpbGQpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIudmFsdWUgPSB0aGlzLnNlbGVjdGVkSWQ7XG5cbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLmFwcENhbnZhcy5zaGFwZXMpLmluY2x1ZGVzKHRoaXMuc2VsZWN0ZWRJZCkpIHtcbiAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRyb2xsZXIgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5jbGVhclRvb2xiYXJFbG10KCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIGNsZWFyVG9vbGJhckVsbXQoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLnRvb2xiYXJDb250YWluZXIuZmlyc3RDaGlsZClcbiAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnRvb2xiYXJDb250YWluZXIuZmlyc3RDaGlsZCk7XG4gICAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcbmltcG9ydCB7IGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSBcIi4uL3V0aWxzXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICAgIGxlbmd0aDogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCBzdGFydFg6IG51bWJlciwgc3RhcnRZOiBudW1iZXIsIGVuZFg6IG51bWJlciwgZW5kWTogbnVtYmVyLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IChzdGFydFggKyBlbmRYKSAvIDI7XG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoc3RhcnRZICsgZW5kWSkgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIGNvbG9yKTtcbiAgICAgICAgc3VwZXIoMSwgaWQsIGNvbG9yLCBjZW50ZXIsIHJvdGF0aW9uLCBzY2FsZVgsIHNjYWxlWSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcmlnaW4gPSBuZXcgVmVydGV4KHN0YXJ0WCwgc3RhcnRZLCBjb2xvcik7XG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBWZXJ0ZXgoZW5kWCwgZW5kWSwgY29sb3IpO1xuXG4gICAgICAgIHRoaXMubGVuZ3RoID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXG4gICAgICAgICAgICBvcmlnaW4sXG4gICAgICAgICAgICBlbmRcbiAgICAgICAgKTtcblxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKG9yaWdpbiwgZW5kKTtcbiAgICAgICAgdGhpcy5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3QgPSB0aGlzLnBvaW50TGlzdDtcbiAgICB9XG59IiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcbmltcG9ydCB7IGRlZ1RvUmFkLCBtMyB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICAgIFxuICAgIGxlbmd0aDogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaW5pdGlhbFBvaW50OiBudW1iZXJbXTtcbiAgICBlbmRQb2ludDogbnVtYmVyW107XG4gICAgdGFyZ2V0UG9pbnQ6IG51bWJlcltdO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgZW5kWDogbnVtYmVyLCBlbmRZOiBudW1iZXIsIGFuZ2xlSW5SYWRpYW5zOiBudW1iZXIsIHNjYWxlWDogbnVtYmVyID0gMSwgc2NhbGVZOiBudW1iZXIgPSAxLCB0cmFuc2Zvcm1hdGlvbjogbnVtYmVyW10gPSBtMy5pZGVudGl0eSgpKSB7XG4gICAgICAgIHN1cGVyKDUsIGlkLCBjb2xvcik7XG4gICAgICAgIFxuICAgICAgICBjb25zdCB4MSA9IHN0YXJ0WDtcbiAgICAgICAgY29uc3QgeTEgPSBzdGFydFk7XG4gICAgICAgIGNvbnN0IHgyID0gZW5kWDtcbiAgICAgICAgY29uc3QgeTIgPSBzdGFydFk7XG4gICAgICAgIGNvbnN0IHgzID0gc3RhcnRYO1xuICAgICAgICBjb25zdCB5MyA9IGVuZFk7XG4gICAgICAgIGNvbnN0IHg0ID0gZW5kWDtcbiAgICAgICAgY29uc3QgeTQgPSBlbmRZO1xuXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm1hdGlvbjtcblxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gYW5nbGVJblJhZGlhbnM7XG4gICAgICAgIHRoaXMuc2NhbGUgPSBbc2NhbGVYLCBzY2FsZVldO1xuICAgICAgICB0aGlzLmluaXRpYWxQb2ludCA9IFtzdGFydFgsIHN0YXJ0WSwgMV07XG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBbZW5kWCwgZW5kWSwgMV07XG4gICAgICAgIHRoaXMudGFyZ2V0UG9pbnQgPSBbMCwwLCAxXTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSB4Mi14MTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHkzLXkxO1xuXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoeDEgKyB4NCkgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHkxICsgeTQpIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2gobmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKSwgbmV3IFZlcnRleCh4MiwgeTIsIGNvbG9yKSwgbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKSwgbmV3IFZlcnRleCh4NCwgeTQsIGNvbG9yKSk7XG4gICAgICAgIHRoaXMuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0ID0gdGhpcy5wb2ludExpc3Q7XG5cbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDA6ICR7eDF9LCAke3kxfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhgcG9pbnQgMTogJHt4Mn0sICR7eTJ9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBwb2ludCAyOiAke3gzfSwgJHt5M31gKTtcbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDM6ICR7eDR9LCAke3k0fWApO1xuICAgICAgICBjb25zb2xlLmxvZyhgY2VudGVyOiAke2NlbnRlci54fSwgJHtjZW50ZXIueX1gKTtcbiAgICB9XG5cbiAgICBvdmVycmlkZSBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xuICAgICAgICBzdXBlci5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xuXG4gICAgICAgIC8vIGNvbnN0IHBvaW50ID0gW3RoaXMucG9pbnRMaXN0W2lkeF0ueCwgdGhpcy5wb2ludExpc3RbaWR4XS55LCAxXTtcbiAgICAgICAgdGhpcy5lbmRQb2ludCA9IG0zLm11bHRpcGx5M3gxKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMuZW5kUG9pbnQpXG4gICAgICAgIHRoaXMuaW5pdGlhbFBvaW50ID0gbTMubXVsdGlwbHkzeDEodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5pbml0aWFsUG9pbnQpXG4gICAgXG4gICAgfVxuXG4gICAgcHVibGljIGZpbmRDQ1dBZGphY2VudChwb2ludElkeDogbnVtYmVyKXtcbiAgICAgICAgY29uc3QgY2N3QWRqYWNlbnQ6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7IDA6IDIsIDE6IDAsIDI6IDMsIDM6IDEgfTtcbiAgICAgICAgcmV0dXJuIGNjd0FkamFjZW50W3BvaW50SWR4XTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZmluZENXQWRqYWNlbnQocG9pbnRJZHg6IG51bWJlcil7XG4gICAgICAgIGNvbnN0IGN3QWRqYWNlbnQ6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7IDA6IDEsIDE6IDMsIDI6IDAsIDM6IDIgfTtcbiAgICAgICAgcmV0dXJuIGN3QWRqYWNlbnRbcG9pbnRJZHhdO1xuICAgIH1cblxuICAgIHB1YmxpYyBmaW5kT3Bwb3NpdGUocG9pbnRJZHg6IG51bWJlcil7XG4gICAgICAgIGNvbnN0IG9wcG9zaXRlOiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0geyAwOiAzLCAxOiAyLCAyOiAxLCAzOiAwIH07XG4gICAgICAgIHJldHVybiBvcHBvc2l0ZVtwb2ludElkeF07XG4gICAgfVxuXG5cbiAgICAvLyBwdWJsaWMgb3ZlcnJpZGUgc2V0VmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4KCk6IHZvaWQge1xuICAgICAgICAvLyAvLyBURVNUXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiaW5pdGlhbFwiLCB0aGlzLmluaXRpYWxQb2ludCk7XG4gICAgICAgIC8vIGNvbnN0IHRhcmdldFBvaW50WCA9IHRoaXMuZW5kUG9pbnRbMF0gKyB0aGlzLnRhcmdldFBvaW50WzBdO1xuICAgICAgICAvLyBjb25zdCB0YXJnZXRQb2ludFkgPSB0aGlzLmVuZFBvaW50WzFdICsgdGhpcy50YXJnZXRQb2ludFsxXTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJlbmRQb2ludCBYOiBcIiwgdGhpcy5lbmRQb2ludFswXSk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZW5kUG9pbnQgWTogXCIsIHRoaXMuZW5kUG9pbnRbMV0pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRhcmdldFg6IFwiLCB0YXJnZXRQb2ludFgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInRhcmdldFk6IFwiLCB0YXJnZXRQb2ludFkpO1xuXG4gICAgICAgIC8vIGNvbnN0IHRyYW5zbGF0ZVRvSW5pdGlhbCA9IG0zLnRyYW5zbGF0aW9uKC10aGlzLmluaXRpYWxQb2ludFswXSwgLXRoaXMuaW5pdGlhbFBvaW50WzFdKTtcbiAgICAgICAgLy8gY29uc3Qgcm90YXRlUmV2ZXJ0ID0gbTMucm90YXRpb24oLXRoaXMuYW5nbGVJblJhZGlhbnMpO1xuXG4gICAgICAgIC8vIGNvbnN0IHJlc1JvdGF0ZSA9IG0zLm11bHRpcGx5KHJvdGF0ZVJldmVydCwgdHJhbnNsYXRlVG9Jbml0aWFsKVxuICAgICAgICAvLyAvLyBjb25zdCByZXNUcmFuc0JhY2sgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGVCYWNrLCByZXNSb3RhdGUpXG5cbiAgICAgICAgLy8gY29uc3Qgcm90YXRlZFRhcmdldD0gbTMubXVsdGlwbHkzeDEocmVzUm90YXRlLCBbdGFyZ2V0UG9pbnRYLCB0YXJnZXRQb2ludFksIDFdKTtcbiAgICAgICAgLy8gY29uc3Qgcm90YXRlZEVuZFBvaW50PW0zLm11bHRpcGx5M3gxKHJlc1JvdGF0ZSwgdGhpcy5lbmRQb2ludCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm90YXRlZCB0YXJnZXRcIiwgcm90YXRlZFRhcmdldCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm90YXRlZCBlbmRwb2ludFwiLCByb3RhdGVkRW5kUG9pbnQpO1xuICAgICAgICAvLyAvLyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMubXVsdGlwbHkocmVzUm90YXRlLCB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KVxuICAgICAgICBcbiAgICAgICAgLy8gY29uc3QgY3VycmVudExlbmd0aCA9IHJvdGF0ZWRFbmRQb2ludFswXTtcbiAgICAgICAgLy8gY29uc3QgY3VycmVudFdpZHRoPSByb3RhdGVkRW5kUG9pbnRbMV07XG5cbiAgICAgICAgLy8gY29uc3QgdXBkYXRlZExlbmd0aCA9IGN1cnJlbnRMZW5ndGggKyByb3RhdGVkVGFyZ2V0WzBdIC0gcm90YXRlZEVuZFBvaW50WzBdO1xuICAgICAgICAvLyBjb25zdCB1cGRhdGVkV2lkdGggPSBjdXJyZW50V2lkdGggKyByb3RhdGVkVGFyZ2V0WzFdIC0gcm90YXRlZEVuZFBvaW50WzFdO1xuXG5cbiAgICAgICAgLy8gY29uc3Qgc2NhbGVMZW5ndGggPSB1cGRhdGVkTGVuZ3RoIC8gY3VycmVudExlbmd0aDtcbiAgICAgICAgLy8gY29uc3Qgc2NhbGVXaWR0aCA9IHVwZGF0ZWRXaWR0aCAvIGN1cnJlbnRXaWR0aDtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJzY2FsZSBsZW5ndGg6IFwiLCBzY2FsZUxlbmd0aCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2NhbGUgd2lkdGg6IFwiLCBzY2FsZVdpZHRoKTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnN0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHNjYWxlTGVuZ3RoLCBzY2FsZVdpZHRoKTtcbiAgICAgICAgLy8gY29uc3Qgcm90YXRlQmFjayA9IG0zLnJvdGF0aW9uKHRoaXMuYW5nbGVJblJhZGlhbnMpO1xuICAgICAgICAvLyBjb25zdCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24odGhpcy5pbml0aWFsUG9pbnRbMF0sIHRoaXMuaW5pdGlhbFBvaW50WzFdKTtcblxuICAgICAgICAvLyBjb25zdCByZXNTY2FsZSA9IG0zLm11bHRpcGx5KHJvdGF0ZUJhY2ssIHNjYWxpbmcpO1xuICAgICAgICAvLyBjb25zdCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzU2NhbGUpO1xuXG4gICAgICAgIC8vIGNvbnN0IHZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG0zLm11bHRpcGx5KHJlc0JhY2ssIHJlc1JvdGF0ZSk7XG4gICAgICAgIC8vIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5tdWx0aXBseSh2aXJ0dWFsVHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzOiBcIiwgbTMubXVsdGlwbHkzeDEodmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLmluaXRpYWxQb2ludCkpXG4gICAgLy8gfVxuXG4gICAgLy8gc2V0VHJhbnNsYXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAvLyAgICAgdGhpcy50cmFuc2xhdGlvbiA9IFt4LCB5XTtcbiAgICAvLyB9XG5cbiAgICAvLyBzZXRSb3RhdGlvbihhbmdsZUluRGVncmVlczogbnVtYmVyKSB7XG4gICAgLy8gICAgIHRoaXMuYW5nbGVJblJhZGlhbnMgPSBkZWdUb1JhZChhbmdsZUluRGVncmVlcyk7XG4gICAgLy8gfVxuXG4gICAgLy8gc2V0U2NhbGUoc2NhbGVYOiBudW1iZXIsIHNjYWxlWTogbnVtYmVyKSB7XG4gICAgLy8gICAgIHRoaXMuc2NhbGUgPSBbc2NhbGVYLCBzY2FsZVldO1xuICAgIC8vIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICAgIHYxIDogVmVydGV4O1xuICAgIHYyIDogVmVydGV4O1xuICAgIHYzIDogVmVydGV4O1xuICAgIHY0IDogVmVydGV4O1xuXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCB4NDogbnVtYmVyLCB5NDogbnVtYmVyLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh4MSArIHgzKSAvIDI7XG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoeTEgKyB5MykgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIGNvbG9yKTtcbiAgICAgICAgXG4gICAgICAgIHN1cGVyKDYsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xuICAgICAgICBcbiAgICAgICAgdGhpcy52MSA9IG5ldyBWZXJ0ZXgoeDEsIHkxLCBjb2xvcik7XG4gICAgICAgIHRoaXMudjIgPSBuZXcgVmVydGV4KHgyLCB5MiwgY29sb3IpO1xuICAgICAgICB0aGlzLnYzID0gbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKTtcbiAgICAgICAgdGhpcy52NCA9IG5ldyBWZXJ0ZXgoeDQsIHk0LCBjb2xvcik7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh0aGlzLnYxLCB0aGlzLnYyLCB0aGlzLnYzLCB0aGlzLnY0KTtcbiAgICAgICAgdGhpcy5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3QgPSB0aGlzLnBvaW50TGlzdDtcbiAgICB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUcmlhbmdsZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh4MSArIHgyICsgeDMpIC8gMztcbiAgICAgICAgY29uc3QgY2VudGVyWSA9ICh5MSArIHkyICsgeTMpIC8gMztcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XG4gICAgICAgIFxuICAgICAgICBzdXBlcig0LCBpZCwgY29sb3IsIGNlbnRlciwgcm90YXRpb24sIHNjYWxlWCwgc2NhbGVZKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHYxID0gbmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKTtcbiAgICAgICAgY29uc3QgdjIgPSBuZXcgVmVydGV4KHgyLCB5MiwgY29sb3IpO1xuICAgICAgICBjb25zdCB2MyA9IG5ldyBWZXJ0ZXgoeDMsIHkzLCBjb2xvcik7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2MSwgdjIsIHYzKTtcbiAgICAgICAgdGhpcy5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3QgPSB0aGlzLnBvaW50TGlzdDtcbiAgICAgICAgY29uc29sZS5sb2codGhpcy5wb2ludExpc3QpXG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi9BcHBDYW52YXMnO1xuaW1wb3J0IENvbG9yIGZyb20gJy4vQmFzZS9Db2xvcic7XG5pbXBvcnQgQ2FudmFzQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXJzL01ha2VyL0NhbnZhc0NvbnRyb2xsZXInO1xuaW1wb3J0IFRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcnMvVG9vbGJhci9Ub29sYmFyQ29udHJvbGxlcic7XG5pbXBvcnQgTGluZSBmcm9tICcuL1NoYXBlcy9MaW5lJztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi9TaGFwZXMvUmVjdGFuZ2xlJztcbmltcG9ydCBpbml0IGZyb20gJy4vaW5pdCc7XG5cbmNvbnN0IG1haW4gPSAoKSA9PiB7XG4gICAgY29uc3QgaW5pdFJldCA9IGluaXQoKTtcbiAgICBpZiAoIWluaXRSZXQpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGluaXRpYWxpemUgV2ViR0wnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGNvbnN0IHsgZ2wsIHByb2dyYW0sIGNvbG9yQnVmZmVyLCBwb3NpdGlvbkJ1ZmZlciB9ID0gaW5pdFJldDtcblxuICAgIGNvbnN0IGFwcENhbnZhcyA9IG5ldyBBcHBDYW52YXMoZ2wsIHByb2dyYW0sIHBvc2l0aW9uQnVmZmVyLCBjb2xvckJ1ZmZlcik7XG4gICAgXG4gICAgY29uc3QgY2FudmFzQ29udHJvbGxlciA9IG5ldyBDYW52YXNDb250cm9sbGVyKGFwcENhbnZhcyk7XG4gICAgY2FudmFzQ29udHJvbGxlci5zdGFydCgpO1xuICAgIFxuICAgIG5ldyBUb29sYmFyQ29udHJvbGxlcihhcHBDYW52YXMpO1xuXG4gICAgLy8gY29uc3QgcmVkID0gbmV3IENvbG9yKDI1NSwgMCwgMjAwKVxuICAgIC8vIC8vIGNvbnN0IHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKCd0cmktMScsIHJlZCwgNTAsIDUwLCAyMCwgNTAwLCAyMDAsIDEwMCk7XG4gICAgLy8gLy8gYXBwQ2FudmFzLmFkZFNoYXBlKHRyaWFuZ2xlKTtcbiAgICBcbiAgICAvLyBjb25zdCByZWN0ID0gbmV3IFJlY3RhbmdsZSgncmVjdC0xJywgcmVkLCAwLDAsMTAsMjAsMCwxLDEpO1xuICAgIC8vIHJlY3QuYW5nbGVJblJhZGlhbnMgPSAtIE1hdGguUEkgLyA0O1xuICAgIC8vIC8vIHJlY3QudGFyZ2V0UG9pbnRbMF0gPSA1ICogTWF0aC5zcXJ0KDIpO1xuICAgIC8vIC8vIHJlY3Quc2NhbGVYID0gMTA7XG4gICAgLy8gLy8gcmVjdC50cmFuc2xhdGlvblswXSA9IDUwMDtcbiAgICAvLyAvLyByZWN0LnRyYW5zbGF0aW9uWzFdID0gMTAwMDtcbiAgICAvLyAvLyByZWN0LnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XG4gICAgLy8gYXBwQ2FudmFzLmFkZFNoYXBlKHJlY3QpO1xuXG4gICAgLy8gY29uc3QgbGluZSA9IG5ldyBMaW5lKCdsaW5lLTEnLCByZWQsIDEwMCwgMTAwLCAxMDAsIDMwMCk7XG4gICAgLy8gY29uc3QgbGluZTIgPSBuZXcgTGluZSgnbGluZS0yJywgcmVkLCAxMDAsIDEwMCwgMzAwLCAxMDApO1xuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShsaW5lKTtcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUobGluZTIpO1xufTtcblxubWFpbigpO1xuIiwiY29uc3QgY3JlYXRlU2hhZGVyID0gKFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXG4gICAgdHlwZTogbnVtYmVyLFxuICAgIHNvdXJjZTogc3RyaW5nXG4pID0+IHtcbiAgICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XG4gICAgaWYgKHNoYWRlcikge1xuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRTaGFkZXJQYXJhbWV0ZXIoc2hhZGVyLCBnbC5DT01QSUxFX1NUQVRVUyk7XG4gICAgICAgIGlmIChzdWNjZXNzKSByZXR1cm4gc2hhZGVyO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0U2hhZGVySW5mb0xvZyhzaGFkZXIpKTtcbiAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XG4gICAgfVxufTtcblxuY29uc3QgY3JlYXRlUHJvZ3JhbSA9IChcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxuICAgIHZ0eFNoZDogV2ViR0xTaGFkZXIsXG4gICAgZnJnU2hkOiBXZWJHTFNoYWRlclxuKSA9PiB7XG4gICAgY29uc3QgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcbiAgICBpZiAocHJvZ3JhbSkge1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgdnR4U2hkKTtcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyZ1NoZCk7XG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0UHJvZ3JhbVBhcmFtZXRlcihwcm9ncmFtLCBnbC5MSU5LX1NUQVRVUyk7XG4gICAgICAgIGlmIChzdWNjZXNzKSByZXR1cm4gcHJvZ3JhbTtcblxuICAgICAgICBjb25zb2xlLmVycm9yKGdsLmdldFByb2dyYW1JbmZvTG9nKHByb2dyYW0pKTtcbiAgICAgICAgZ2wuZGVsZXRlUHJvZ3JhbShwcm9ncmFtKTtcbiAgICB9XG59O1xuXG5jb25zdCBpbml0ID0gKCkgPT4ge1xuICAgIGNvbnN0IGNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnKTtcblxuICAgIGlmICghZ2wpIHtcbiAgICAgICAgYWxlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHdlYkdMJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gSW5pdGlhbGl6ZSBzaGFkZXJzIGFuZCBwcm9ncmFtc1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICBjb25zdCB2dHhTaGFkZXJTb3VyY2UgPSAoXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd2ZXJ0ZXgtc2hhZGVyLTJkJykgYXMgSFRNTFNjcmlwdEVsZW1lbnRcbiAgICApLnRleHQ7XG4gICAgY29uc3QgZnJhZ1NoYWRlclNvdXJjZSA9IChcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ZyYWdtZW50LXNoYWRlci0yZCcpIGFzIEhUTUxTY3JpcHRFbGVtZW50XG4gICAgKS50ZXh0O1xuXG4gICAgY29uc3QgdmVydGV4U2hhZGVyID0gY3JlYXRlU2hhZGVyKGdsLCBnbC5WRVJURVhfU0hBREVSLCB2dHhTaGFkZXJTb3VyY2UpO1xuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gY3JlYXRlU2hhZGVyKFxuICAgICAgICBnbCxcbiAgICAgICAgZ2wuRlJBR01FTlRfU0hBREVSLFxuICAgICAgICBmcmFnU2hhZGVyU291cmNlXG4gICAgKTtcbiAgICBpZiAoIXZlcnRleFNoYWRlciB8fCAhZnJhZ21lbnRTaGFkZXIpIHJldHVybjtcblxuICAgIGNvbnN0IHByb2dyYW0gPSBjcmVhdGVQcm9ncmFtKGdsLCB2ZXJ0ZXhTaGFkZXIsIGZyYWdtZW50U2hhZGVyKTtcbiAgICBpZiAoIXByb2dyYW0pIHJldHVybjtcblxuICAgIGNvbnN0IGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBjb25zdCBkaXNwbGF5V2lkdGggID0gTWF0aC5yb3VuZCh3aWR0aCAqIGRwcik7XG4gICAgY29uc3QgZGlzcGxheUhlaWdodCA9IE1hdGgucm91bmQoaGVpZ2h0ICogZHByKTtcblxuICAgIGNvbnN0IG5lZWRSZXNpemUgPVxuICAgICAgICBnbC5jYW52YXMud2lkdGggIT0gZGlzcGxheVdpZHRoIHx8IGdsLmNhbnZhcy5oZWlnaHQgIT0gZGlzcGxheUhlaWdodDtcblxuICAgIGlmIChuZWVkUmVzaXplKSB7XG4gICAgICAgIGdsLmNhbnZhcy53aWR0aCA9IGRpc3BsYXlXaWR0aDtcbiAgICAgICAgZ2wuY2FudmFzLmhlaWdodCA9IGRpc3BsYXlIZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2wudmlld3BvcnQoMCwgMCwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTtcbiAgICBnbC5jbGVhckNvbG9yKDAsIDAsIDAsIDApO1xuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gRW5hYmxlICYgaW5pdGlhbGl6ZSB1bmlmb3JtcyBhbmQgYXR0cmlidXRlc1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBSZXNvbHV0aW9uXG4gICAgY29uc3QgbWF0cml4VW5pZm9ybUxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKFxuICAgICAgICBwcm9ncmFtLFxuICAgICAgICAndV90cmFuc2Zvcm1hdGlvbidcbiAgICApO1xuICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4VW5pZm9ybUxvY2F0aW9uLCBmYWxzZSwgWzEsMCwwLDAsMSwwLDAsMCwxXSlcblxuICAgIGNvbnN0IHJlc29sdXRpb25Vbmlmb3JtTG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oXG4gICAgICAgIHByb2dyYW0sXG4gICAgICAgICd1X3Jlc29sdXRpb24nXG4gICAgKTtcbiAgICBnbC51bmlmb3JtMmYocmVzb2x1dGlvblVuaWZvcm1Mb2NhdGlvbiwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTtcblxuICAgIC8vIENvbG9yXG4gICAgY29uc3QgY29sb3JCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICBpZiAoIWNvbG9yQnVmZmVyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgY29sb3IgYnVmZmVyJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xuICAgIGNvbnN0IGNvbG9yQXR0cmlidXRlTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYV9jb2xvcicpO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KGNvbG9yQXR0cmlidXRlTG9jYXRpb24pO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoY29sb3JBdHRyaWJ1dGVMb2NhdGlvbiwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIFBvc2l0aW9uXG4gICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcbiAgICBpZiAoIXBvc2l0aW9uQnVmZmVyKSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBjcmVhdGUgcG9zaXRpb24gYnVmZmVyJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xuICAgIGNvbnN0IHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihcbiAgICAgICAgcHJvZ3JhbSxcbiAgICAgICAgJ2FfcG9zaXRpb24nXG4gICAgKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyBEbyBub3QgcmVtb3ZlIGNvbW1lbnRzLCB1c2VkIGZvciBzYW5pdHkgY2hlY2tcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gU2V0IHRoZSB2YWx1ZXMgb2YgdGhlIGJ1ZmZlclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cblxuICAgIC8vIGNvbnN0IGNvbG9ycyA9IFsxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wXTtcbiAgICAvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xuICAgIC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vIGNvbnN0IHBvc2l0aW9ucyA9IFsxMDAsIDUwLCAyMCwgMTAsIDUwMCwgNTAwXTtcbiAgICAvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xuICAgIC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyksIGdsLlNUQVRJQ19EUkFXKTtcblxuICAgIC8vID09PT1cbiAgICAvLyBEcmF3XG4gICAgLy8gPT09PVxuICAgIC8vIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCAzKTtcblxuICAgIHJldHVybiB7XG4gICAgICAgIHBvc2l0aW9uQnVmZmVyLFxuICAgICAgICBwcm9ncmFtLFxuICAgICAgICBjb2xvckJ1ZmZlcixcbiAgICAgICAgZ2wsXG4gICAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGluaXQ7XG4iLCJpbXBvcnQgVmVydGV4IGZyb20gJy4vQmFzZS9WZXJ0ZXgnO1xuXG5leHBvcnQgY29uc3QgZXVjbGlkZWFuRGlzdGFuY2VWdHggPSAoYTogVmVydGV4LCBiOiBWZXJ0ZXgpOiBudW1iZXIgPT4ge1xuICAgIGNvbnN0IGR4ID0gYS54IC0gYi54O1xuICAgIGNvbnN0IGR5ID0gYS55IC0gYi55O1xuXG4gICAgcmV0dXJuIE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG59O1xuXG4vLyAzNjAgREVHXG5leHBvcnQgY29uc3QgZ2V0QW5nbGUgPSAob3JpZ2luOiBWZXJ0ZXgsIHRhcmdldDogVmVydGV4KSA9PiB7XG4gICAgY29uc3QgcGx1c01pbnVzRGVnID0gcmFkVG9EZWcoTWF0aC5hdGFuMihvcmlnaW4ueSAtIHRhcmdldC55LCBvcmlnaW4ueCAtIHRhcmdldC54KSk7XG4gICAgcmV0dXJuIHBsdXNNaW51c0RlZyA+PSAwID8gMTgwIC0gcGx1c01pbnVzRGVnIDogTWF0aC5hYnMocGx1c01pbnVzRGVnKSArIDE4MDtcbn1cblxuZXhwb3J0IGNvbnN0IHJhZFRvRGVnID0gKHJhZDogbnVtYmVyKSA9PiB7XG4gICAgcmV0dXJuIHJhZCAqIDE4MCAvIE1hdGguUEk7XG59XG5cbmV4cG9ydCBjb25zdCBkZWdUb1JhZCA9IChkZWc6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9SZ2IoaGV4OiBzdHJpbmcpIHtcbiAgdmFyIHJlc3VsdCA9IC9eIz8oW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkkL2kuZXhlYyhoZXgpO1xuICByZXR1cm4gcmVzdWx0ID8ge1xuICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxuICAgIGc6IHBhcnNlSW50KHJlc3VsdFsyXSwgMTYpLFxuICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXG4gIH0gOiBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmdiVG9IZXgocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xuICByZXR1cm4gXCIjXCIgKyAoMSA8PCAyNCB8IHIgPDwgMTYgfCBnIDw8IDggfCBiKS50b1N0cmluZygxNikuc2xpY2UoMSk7XG59XG5cbmV4cG9ydCBjb25zdCBtMyA9IHtcbiAgICBpZGVudGl0eTogZnVuY3Rpb24oKSA6IG51bWJlcltdIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIDEsIDAsIDAsXG4gICAgICAgIDAsIDEsIDAsXG4gICAgICAgIDAsIDAsIDEsXG4gICAgICBdO1xuICAgIH0sXG4gIFxuICAgIHRyYW5zbGF0aW9uOiBmdW5jdGlvbih0eCA6IG51bWJlciwgdHkgOiBudW1iZXIpIDogbnVtYmVyW10ge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgMSwgMCwgMCxcbiAgICAgICAgMCwgMSwgMCxcbiAgICAgICAgdHgsIHR5LCAxLFxuICAgICAgXTtcbiAgICB9LFxuICBcbiAgICByb3RhdGlvbjogZnVuY3Rpb24oYW5nbGVJblJhZGlhbnMgOiBudW1iZXIpIDogbnVtYmVyW10ge1xuICAgICAgY29uc3QgYyA9IE1hdGguY29zKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBjLC1zLCAwLFxuICAgICAgICBzLCBjLCAwLFxuICAgICAgICAwLCAwLCAxLFxuICAgICAgXTtcbiAgICB9LFxuICBcbiAgICBzY2FsaW5nOiBmdW5jdGlvbihzeCA6IG51bWJlciwgc3kgOiBudW1iZXIpIDogbnVtYmVyW10ge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgc3gsIDAsIDAsXG4gICAgICAgIDAsIHN5LCAwLFxuICAgICAgICAwLCAwLCAxLFxuICAgICAgXTtcbiAgICB9LFxuICBcbiAgICBtdWx0aXBseTogZnVuY3Rpb24oYSA6IG51bWJlcltdLCBiIDogbnVtYmVyW10pIDogbnVtYmVyW10ge1xuICAgICAgY29uc3QgYTAwID0gYVswICogMyArIDBdO1xuICAgICAgY29uc3QgYTAxID0gYVswICogMyArIDFdO1xuICAgICAgY29uc3QgYTAyID0gYVswICogMyArIDJdO1xuICAgICAgY29uc3QgYTEwID0gYVsxICogMyArIDBdO1xuICAgICAgY29uc3QgYTExID0gYVsxICogMyArIDFdO1xuICAgICAgY29uc3QgYTEyID0gYVsxICogMyArIDJdO1xuICAgICAgY29uc3QgYTIwID0gYVsyICogMyArIDBdO1xuICAgICAgY29uc3QgYTIxID0gYVsyICogMyArIDFdO1xuICAgICAgY29uc3QgYTIyID0gYVsyICogMyArIDJdO1xuICAgICAgY29uc3QgYjAwID0gYlswICogMyArIDBdO1xuICAgICAgY29uc3QgYjAxID0gYlswICogMyArIDFdO1xuICAgICAgY29uc3QgYjAyID0gYlswICogMyArIDJdO1xuICAgICAgY29uc3QgYjEwID0gYlsxICogMyArIDBdO1xuICAgICAgY29uc3QgYjExID0gYlsxICogMyArIDFdO1xuICAgICAgY29uc3QgYjEyID0gYlsxICogMyArIDJdO1xuICAgICAgY29uc3QgYjIwID0gYlsyICogMyArIDBdO1xuICAgICAgY29uc3QgYjIxID0gYlsyICogMyArIDFdO1xuICAgICAgY29uc3QgYjIyID0gYlsyICogMyArIDJdO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxuICAgICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXG4gICAgICAgIGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMixcbiAgICAgICAgYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwLFxuICAgICAgICBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjEsXG4gICAgICAgIGIxMCAqIGEwMiArIGIxMSAqIGExMiArIGIxMiAqIGEyMixcbiAgICAgICAgYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwLFxuICAgICAgICBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjEsXG4gICAgICAgIGIyMCAqIGEwMiArIGIyMSAqIGExMiArIGIyMiAqIGEyMixcbiAgICAgIF07XG4gICAgfSxcblxuICAgIGludmVyc2U6IGZ1bmN0aW9uKG0gOiBudW1iZXJbXSkge1xuICAgICAgY29uc3QgZGV0ID0gbVswXSAqIChtWzRdICogbVs4XSAtIG1bN10gKiBtWzVdKSAtXG4gICAgICAgICAgICAgICAgICBtWzFdICogKG1bM10gKiBtWzhdIC0gbVs1XSAqIG1bNl0pICtcbiAgICAgICAgICAgICAgICAgIG1bMl0gKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSk7XG4gIFxuICAgICAgaWYgKGRldCA9PT0gMCkgcmV0dXJuIG51bGw7XG4gIFxuICAgICAgY29uc3QgaW52RGV0ID0gMSAvIGRldDtcbiAgXG4gICAgICByZXR1cm4gWyBcbiAgICAgICAgICBpbnZEZXQgKiAobVs0XSAqIG1bOF0gLSBtWzVdICogbVs3XSksIFxuICAgICAgICAgIGludkRldCAqIChtWzJdICogbVs3XSAtIG1bMV0gKiBtWzhdKSxcbiAgICAgICAgICBpbnZEZXQgKiAobVsxXSAqIG1bNV0gLSBtWzJdICogbVs0XSksXG4gICAgICAgICAgaW52RGV0ICogKG1bNV0gKiBtWzZdIC0gbVszXSAqIG1bOF0pLFxuICAgICAgICAgIGludkRldCAqIChtWzBdICogbVs4XSAtIG1bMl0gKiBtWzZdKSxcbiAgICAgICAgICBpbnZEZXQgKiAobVsyXSAqIG1bM10gLSBtWzBdICogbVs1XSksXG4gICAgICAgICAgaW52RGV0ICogKG1bM10gKiBtWzddIC0gbVs0XSAqIG1bNl0pLFxuICAgICAgICAgIGludkRldCAqIChtWzFdICogbVs2XSAtIG1bMF0gKiBtWzddKSxcbiAgICAgICAgICBpbnZEZXQgKiAobVswXSAqIG1bNF0gLSBtWzFdICogbVszXSlcbiAgICAgIF07XG4gIH0sXG5cbiAgICBtdWx0aXBseTN4MTogZnVuY3Rpb24oYSA6IG51bWJlcltdLCBiIDogbnVtYmVyW10pIDogbnVtYmVyW10ge1xuICAgICAgY29uc3QgYTAwID0gYVswICogMyArIDBdO1xuICAgICAgY29uc3QgYTAxID0gYVswICogMyArIDFdO1xuICAgICAgY29uc3QgYTAyID0gYVswICogMyArIDJdO1xuICAgICAgY29uc3QgYTEwID0gYVsxICogMyArIDBdO1xuICAgICAgY29uc3QgYTExID0gYVsxICogMyArIDFdO1xuICAgICAgY29uc3QgYTEyID0gYVsxICogMyArIDJdO1xuICAgICAgY29uc3QgYTIwID0gYVsyICogMyArIDBdO1xuICAgICAgY29uc3QgYTIxID0gYVsyICogMyArIDFdO1xuICAgICAgY29uc3QgYTIyID0gYVsyICogMyArIDJdO1xuICAgICAgY29uc3QgYjAwID0gYlswICogMyArIDBdO1xuICAgICAgY29uc3QgYjAxID0gYlswICogMyArIDFdO1xuICAgICAgY29uc3QgYjAyID0gYlswICogMyArIDJdO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxuICAgICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXG4gICAgICAgIGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMixcbiAgICAgIF07XG4gICAgfSxcblxuICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24obSA6IG51bWJlcltdLCB0eDpudW1iZXIsIHR5Om51bWJlcikge1xuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnRyYW5zbGF0aW9uKHR4LCB0eSkpO1xuICAgIH0sXG4gIFxuICAgIHJvdGF0ZTogZnVuY3Rpb24obTpudW1iZXJbXSwgYW5nbGVJblJhZGlhbnM6bnVtYmVyKSB7XG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMucm90YXRpb24oYW5nbGVJblJhZGlhbnMpKTtcbiAgICB9LFxuICBcbiAgICBzY2FsZTogZnVuY3Rpb24obTpudW1iZXJbXSwgc3g6bnVtYmVyLCBzeTpudW1iZXIpIHtcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy5zY2FsaW5nKHN4LCBzeSkpO1xuICAgIH0sXG4gIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9