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
            shape.setVirtualTransformationMatrix();
            var matrixLocation = gl.getUniformLocation(_this.program, "u_transformation");
            var matrix = new Float32Array(shape.transformationMatrix);
            gl.uniformMatrix3fv(matrixLocation, false, matrix);
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
        this.transformationMatrix = utils_1.m3.identity();
        this.glDrawType = glDrawType;
        this.id = id;
        this.color = color;
        this.center = center;
        this.rotation = rotation;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
    }
    BaseShape.prototype.setTransformationMatrix = function () {
    };
    BaseShape.prototype.setVirtualTransformationMatrix = function () {
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
        // this.pointSlider = this.createSlider('Point', () => parseInt(this.pointSlider.value), -100, 100);
        // this.registerSlider(this.pointSlider, (e) => {this.updatePointX(parseInt(this.pointSlider.value))})
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
        this.rectangle.scaleX = newLength / 300;
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateWidth = function (newWidth) {
        this.rectangle.scaleY = newWidth / 300;
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateRotation = function (newRotation) {
        this.rectangle.angleInRadians = (0, utils_1.degToRad)(newRotation);
        this.updateShape(this.rectangle);
    };
    // private updatePointX(newPointX: number){
    //     const newRec = new Rectangle(this.rectangle.id, this.rectangle.color, this.rectangle.initialPoint[0], this.rectangle.initialPoint[1], this.rectangle.endPoint[0] = newPointX, this.rectangle.endPoint[1], this.rectangle.angleInRadians)
    //     // this.rectangle.targetPoint[0] = newPointX;
    //     this.rectangle = newRec
    //     this.updateShape(this.rectangle);
    // }
    // private updatePoints(idx: number){
    //     const point = [this.rectangle.pointList[idx].x, this.rectangle.pointList[idx].y, 1];
    //     const res = m3.multiply3x1(this.rectangle.transformationMatrix, point)
    //     this.rectangle.pointList[idx].x = res[0];
    //     this.rectangle.pointList[idx].y = res[1];
    //     this.updateShape(this.rectangle);
    // }
    RectangleToolbarController.prototype.updateVertex = function (idx, x, y) {
        // const diffy = y - this.rectangle.pointList[idx].y;
        // const diffx = x - this.rectangle.pointList[idx].x;
        // for (let i = 0; i < 4; i++) {
        //     if (i != idx) {
        //         this.rectangle.pointList[i].y += diffy;
        //         this.rectangle.pointList[i].x += diffx;
        //     }
        // }
        // this.rectangle.pointList[idx].x = x;
        // this.rectangle.pointList[idx].y = y;
        // // this.recalculateCenter();
        // this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.currentAngle = function () {
        return (0, utils_1.getAngle)(this.rectangle.pointList[0], this.rectangle.pointList[1]);
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
        this.vtxPosXSlider = this.createSliderVertex('Pos X', vertex.x, 0, this.appCanvas.width);
        this.vtxPosYSlider = this.createSliderVertex('Pos Y', vertex.y, 0, this.appCanvas.height);
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
    function Rectangle(id, color, startX, startY, endX, endY, angleInRadians, scaleX, scaleY) {
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        var _this = _super.call(this, 5, id, color) || this;
        _this.translation = [0, 0];
        _this.angleInRadians = 0;
        _this.scale = [1, 1];
        // const vecEnd = [endX, endY, 1];
        // const translateToInitialPoint = m3.translation(-startX, -startY)
        // const rotateReverse = m3.rotation(-angleInRadians)
        // const translateBack = m3.translation(startX, startY)
        // const resRotate = m3.multiply(rotateReverse,translateToInitialPoint);
        // const resBack = m3.multiply(translateBack, resRotate)
        // const resVecEnd = m3.multiply3x1(resBack, vecEnd)
        // endX = resVecEnd[0]
        // endY = resVecEnd[1]
        var x1 = startX;
        var y1 = startY;
        var x2 = endX;
        var y2 = startY;
        var x3 = startX;
        var y3 = endY;
        var x4 = endX;
        var y4 = endY;
        _this.angleInRadians = angleInRadians;
        _this.scale = [scaleX, scaleY];
        _this.initialPoint = [startX, startY, 1];
        _this.endPoint = [endX, endY, 1];
        _this.targetPoint = [0, 0, 1];
        _this.length = x2 - x1;
        _this.width = x3 - x2;
        var centerX = (x1 + x4) / 2;
        var centerY = (y1 + y4) / 2;
        var center = new Vertex_1.default(centerX, centerY, color);
        _this.center = center;
        _this.pointList.push(new Vertex_1.default(x1, y1, color), new Vertex_1.default(x2, y2, color), new Vertex_1.default(x3, y3, color), new Vertex_1.default(x4, y4, color));
        return _this;
        // console.log(`point 1: ${x1}, ${y1}`);
        // console.log(`point 2: ${x2}, ${y2}`);
        // console.log(`point 3: ${x3}, ${y3}`);
        // console.log(`point 3: ${x4}, ${y4}`);
        // console.log(`center: ${center.x}, ${center.y}`);
    }
    Rectangle.prototype.setTransformationMatrix = function () {
        this.transformationMatrix = utils_1.m3.identity();
        var translateToCenter = utils_1.m3.translation(-this.center.x, -this.center.y);
        var rotation = utils_1.m3.rotation(this.angleInRadians);
        var scaling = utils_1.m3.scaling(this.scaleX, this.scaleY);
        var translateBack = utils_1.m3.translation(this.center.x, this.center.y);
        var translate = utils_1.m3.translation(this.translation[0], this.translation[1]);
        var resScale = utils_1.m3.multiply(scaling, translateToCenter);
        var resRotate = utils_1.m3.multiply(rotation, resScale);
        var resBack = utils_1.m3.multiply(translateBack, resRotate);
        var resTranslate = utils_1.m3.multiply(translate, resBack);
        this.transformationMatrix = resTranslate;
        // const point = [this.pointList[idx].x, this.pointList[idx].y, 1];
        this.endPoint = utils_1.m3.multiply3x1(this.transformationMatrix, this.endPoint);
        this.initialPoint = utils_1.m3.multiply3x1(this.transformationMatrix, this.initialPoint);
    };
    Rectangle.prototype.setVirtualTransformationMatrix = function () {
        // // TEST
        // console.log("initial", this.initialPoint);
        // const targetPointX = this.endPoint[0] + this.targetPoint[0];
        // const targetPointY = this.endPoint[1] + this.targetPoint[1];
        // console.log("endPoint X: ", this.endPoint[0]);
        // console.log("endPoint Y: ", this.endPoint[1]);
        // console.log("targetX: ", targetPointX);
        // console.log("targetY: ", targetPointY);
        // const translateToInitial = m3.translation(-this.initialPoint[0], -this.initialPoint[1]);
        // const rotateRevert = m3.rotation(-this.angleInRadians);
        // const resRotate = m3.multiply(rotateRevert, translateToInitial)
        // // const resTransBack = m3.multiply(translateBack, resRotate)
        // const rotatedTarget= m3.multiply3x1(resRotate, [targetPointX, targetPointY, 1]);
        // const rotatedEndPoint=m3.multiply3x1(resRotate, this.endPoint);
        // console.log("rotated target", rotatedTarget);
        // console.log("rotated endpoint", rotatedEndPoint);
        // // this.transformationMatrix = m3.multiply(resRotate, this.transformationMatrix)
        // const currentLength = rotatedEndPoint[0];
        // const currentWidth= rotatedEndPoint[1];
        // const updatedLength = currentLength + rotatedTarget[0] - rotatedEndPoint[0];
        // const updatedWidth = currentWidth + rotatedTarget[1] - rotatedEndPoint[1];
        // const scaleLength = updatedLength / currentLength;
        // const scaleWidth = updatedWidth / currentWidth;
        // console.log("scale length: ", scaleLength);
        // console.log("scale width: ", scaleWidth);
        // const scaling = m3.scaling(scaleLength, scaleWidth);
        // const rotateBack = m3.rotation(this.angleInRadians);
        // const translateBack = m3.translation(this.initialPoint[0], this.initialPoint[1]);
        // const resScale = m3.multiply(rotateBack, scaling);
        // const resBack = m3.multiply(translateBack, resScale);
        // const virtualTransformationMatrix = m3.multiply(resBack, resRotate);
        // this.transformationMatrix = m3.multiply(virtualTransformationMatrix, this.transformationMatrix);
        // console.log(this.transformationMatrix);
        // console.log("res: ", m3.multiply3x1(virtualTransformationMatrix, this.initialPoint))
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
        var v1 = new Vertex_1.default(x1, y1, color);
        var v2 = new Vertex_1.default(x2, y2, color);
        var v3 = new Vertex_1.default(x3, y3, color);
        var v4 = new Vertex_1.default(x4, y4, color);
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
var Color_1 = __importDefault(__webpack_require__(/*! ./Base/Color */ "./src/Base/Color.ts"));
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
    var red = new Color_1.default(255, 0, 200);
    // const triangle = new Triangle('tri-1', red, 50, 50, 20, 500, 200, 100);
    // appCanvas.addShape(triangle);
    // const rect = new Rectangle('rect-1', red, 0,0,10,10,0,1,1);
    // rect.angleInRadians = - Math.PI / 4;
    // rect.targetPoint[0] = 5 * Math.sqrt(2);
    // rect.scaleX = 10;
    // rect.translation[0] = 500;
    // rect.translation[1] = 1000;
    // rect.setTransformationMatrix();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRS9GLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxRQUFRLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRXJHLEtBQUksQ0FBQyxXQUFXLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxPQUFPLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsRUFBaEMsQ0FBZ0MsRUFBRSxHQUFHLEVBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0YsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsV0FBVyxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDO1FBRWxHLEtBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUUsY0FBTSxlQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsRUFBakMsQ0FBaUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN0RyxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxZQUFZLEVBQUUsVUFBQyxDQUFDLElBQU0sS0FBSSxDQUFDLGNBQWMsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMs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QUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixPQUFPO1lBQ0wsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFH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RUFBRSxFQUFTLEVBQUUsRUFBUztRQUM5QyxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNGLENBQUM7Ozs7Ozs7VUN0SUo7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Npc2tvbS8uL3NyYy9BcHBDYW52YXMudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQmFzZVNoYXBlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL0NvbG9yLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL1ZlcnRleC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvQ2FudmFzQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvTGluZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9TcXVhcmVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9MaW5lLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvUmVjdGFuZ2xlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvU3F1YXJlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvaW5pdC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZS9CYXNlU2hhcGUnO1xuaW1wb3J0IHsgbTMgfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwQ2FudmFzIHtcbiAgICBwcml2YXRlIHByb2dyYW06IFdlYkdMUHJvZ3JhbTtcbiAgICBwcml2YXRlIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQ7XG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXI7XG4gICAgcHJpdmF0ZSBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXI7XG4gICAgcHJpdmF0ZSBfdXBkYXRlVG9vbGJhcjogKCgpID0+IHZvaWQpIHwgbnVsbCA9IG51bGw7XG5cbiAgICBwcml2YXRlIF9zaGFwZXM6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4gPSB7fTtcblxuICAgIHdpZHRoOiBudW1iZXI7XG4gICAgaGVpZ2h0OiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgICAgICAgcHJvZ3JhbTogV2ViR0xQcm9ncmFtLFxuICAgICAgICBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsXG4gICAgICAgIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlclxuICAgICkge1xuICAgICAgICB0aGlzLmdsID0gZ2w7XG4gICAgICAgIHRoaXMucG9zaXRpb25CdWZmZXIgPSBwb3NpdGlvbkJ1ZmZlcjtcbiAgICAgICAgdGhpcy5jb2xvckJ1ZmZlciA9IGNvbG9yQnVmZmVyO1xuICAgICAgICB0aGlzLnByb2dyYW0gPSBwcm9ncmFtO1xuXG4gICAgICAgIHRoaXMud2lkdGggPSBnbC5jYW52YXMud2lkdGg7XG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZ2wuY2FudmFzLmhlaWdodDtcblxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHB1YmxpYyByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSB0aGlzLnBvc2l0aW9uQnVmZmVyO1xuICAgICAgICBjb25zdCBjb2xvckJ1ZmZlciA9IHRoaXMuY29sb3JCdWZmZXI7XG5cbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9ucyA9IHNoYXBlLnBvaW50TGlzdC5mbGF0TWFwKChwb2ludCkgPT4gW1xuICAgICAgICAgICAgICAgIHBvaW50LngsXG4gICAgICAgICAgICAgICAgcG9pbnQueSxcbiAgICAgICAgICAgIF0pO1xuXG4gICAgICAgICAgICBsZXQgY29sb3JzOiBudW1iZXJbXSA9IFtdO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzaGFwZS5wb2ludExpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChzaGFwZS5wb2ludExpc3RbaV0uYy5yLCBzaGFwZS5wb2ludExpc3RbaV0uYy5nLCBzaGFwZS5wb2ludExpc3RbaV0uYy5iKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gQmluZCBjb2xvciBkYXRhXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShcbiAgICAgICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLFxuICAgICAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAvLyBCaW5kIHBvc2l0aW9uIGRhdGFcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxuICAgICAgICAgICAgICAgIGdsLkFSUkFZX0JVRkZFUixcbiAgICAgICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyksXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcbiAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgIGlmICghKHRoaXMucG9zaXRpb25CdWZmZXIgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJQb3NpdGlvbiBidWZmZXIgaXMgbm90IGEgdmFsaWQgV2ViR0xCdWZmZXJcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGlmICghKHRoaXMuY29sb3JCdWZmZXIgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb2xvciBidWZmZXIgaXMgbm90IGEgdmFsaWQgV2ViR0xCdWZmZXJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNldCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcbiAgICAgICAgICAgIHNoYXBlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XG4gICAgICAgICAgICBzaGFwZS5zZXRWaXJ0dWFsVHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcblxuICAgICAgICAgICAgY29uc3QgbWF0cml4TG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcInVfdHJhbnNmb3JtYXRpb25cIik7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgIGNvbnN0IG1hdHJpeCA9IG5ldyBGbG9hdDMyQXJyYXkoc2hhcGUudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xuICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XG5cbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoc2hhcGUuZ2xEcmF3VHlwZSwgMCwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aCk7XG5cbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgcHVibGljIGdldCBzaGFwZXMoKTogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPiB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZXM7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVzKHY6IFJlY29yZDxzdHJpbmcsIEJhc2VTaGFwZT4pIHtcbiAgICAgICAgdGhpcy5fc2hhcGVzID0gdjtcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICAgICAgaWYgKHRoaXMuX3VwZGF0ZVRvb2xiYXIpXG4gICAgICAgICAgICB0aGlzLl91cGRhdGVUb29sYmFyLmNhbGwodGhpcyk7XG4gICAgfVxuXG4gICAgcHVibGljIHNldCB1cGRhdGVUb29sYmFyKHYgOiAoKSA9PiB2b2lkKSB7XG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xiYXIgPSB2O1xuICAgIH1cblxuICAgIHB1YmxpYyBnZW5lcmF0ZUlkRnJvbVRhZyh0YWc6IHN0cmluZykge1xuICAgICAgICBjb25zdCB3aXRoU2FtZVRhZyA9IE9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5maWx0ZXIoKGlkKSA9PiBpZC5zdGFydHNXaXRoKHRhZyArICctJykpO1xuICAgICAgICByZXR1cm4gYCR7dGFnfS0ke3dpdGhTYW1lVGFnLmxlbmd0aCArIDF9YFxuICAgIH1cblxuICAgIHB1YmxpYyBhZGRTaGFwZShzaGFwZTogQmFzZVNoYXBlKSB7XG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMoc2hhcGUuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBhbHJlYWR5IHVzZWQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcbiAgICAgICAgbmV3U2hhcGVzW3NoYXBlLmlkXSA9IHNoYXBlO1xuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZWRpdFNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcbiAgICAgICAgaWYgKCFPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMobmV3U2hhcGUuaWQpKSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBub3QgZm91bmQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IG5ld1NoYXBlcyA9IHsgLi4udGhpcy5zaGFwZXMgfTtcbiAgICAgICAgbmV3U2hhcGVzW25ld1NoYXBlLmlkXSA9IG5ld1NoYXBlO1xuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgZGVsZXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NoYXBlIElEIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xuICAgICAgICBkZWxldGUgbmV3U2hhcGVzW25ld1NoYXBlLmlkXTtcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgbTMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi9Db2xvclwiO1xuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi9WZXJ0ZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQmFzZVNoYXBlIHtcblxuICAgIHBvaW50TGlzdDogVmVydGV4W10gPSBbXTtcbiAgICAvLyBpbml0aWFsVmVydGV4OiBWZXJ0ZXg7XG4gICAgaWQ6IHN0cmluZztcbiAgICBjb2xvcjogQ29sb3I7XG4gICAgZ2xEcmF3VHlwZTogbnVtYmVyO1xuICAgIGNlbnRlcjogVmVydGV4O1xuICAgIHJvdGF0aW9uOiBudW1iZXI7XG4gICAgc2NhbGVYOiBudW1iZXI7XG4gICAgc2NhbGVZOiBudW1iZXI7XG5cbiAgICB0cmFuc2Zvcm1hdGlvbk1hdHJpeDogbnVtYmVyW10gPSBtMy5pZGVudGl0eSgpO1xuXG4gICAgY29uc3RydWN0b3IoZ2xEcmF3VHlwZTogbnVtYmVyLCBpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIGNlbnRlcjogVmVydGV4ID0gbmV3IFZlcnRleCgwLCAwLCBjb2xvciksIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xuICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSBnbERyYXdUeXBlO1xuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG4gICAgICAgIHRoaXMucm90YXRpb24gPSByb3RhdGlvbjtcbiAgICAgICAgdGhpcy5zY2FsZVggPSBzY2FsZVg7XG4gICAgICAgIHRoaXMuc2NhbGVZID0gc2NhbGVZO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xuXG4gICAgfVxuXG4gICAgcHVibGljIHNldFZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xuXG4gICAgfVxufSIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbG9yIHtcbiAgICByOiBudW1iZXI7XG4gICAgZzogbnVtYmVyO1xuICAgIGI6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5yID0gcjtcbiAgICAgICAgdGhpcy5nID0gZztcbiAgICAgICAgdGhpcy5iID0gYjtcbiAgICB9XG59XG4iLCJpbXBvcnQgQ29sb3IgZnJvbSBcIi4vQ29sb3JcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVydGV4IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGM6IENvbG9yO1xuICAgIFxuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyLCBjOiBDb2xvcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgICAgICB0aGlzLmMgPSBjO1xuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlL0lTaGFwZU1ha2VyQ29udHJvbGxlcic7XG5pbXBvcnQgTGluZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0xpbmVNYWtlckNvbnRyb2xsZXInO1xuaW1wb3J0IFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1JlY3RhbmdsZU1ha2VyQ29udHJvbGxlcic7XG5pbXBvcnQgU3F1YXJlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvU3F1YXJlTWFrZXJDb250cm9sbGVyJztcblxuZW51bSBBVkFJTF9TSEFQRVMge1xuICAgIExpbmUgPSAnTGluZScsXG4gICAgUmVjdGFuZ2xlID0gJ1JlY3RhbmdsZScsXG4gICAgU3F1YXJlID0gJ1NxdWFyZScsXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0NvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgX3NoYXBlQ29udHJvbGxlcjogSVNoYXBlTWFrZXJDb250cm9sbGVyO1xuICAgIHByaXZhdGUgY2FudmFzRWxtdDogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBidXR0b25Db250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgY29sb3JQaWNrZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcblxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuXG4gICAgICAgIGNvbnN0IGNhbnZhc0VsbXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICdzaGFwZS1idXR0b24tY29udGFpbmVyJ1xuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdCA9IGNhbnZhc0VsbXQ7XG4gICAgICAgIHRoaXMuYnV0dG9uQ29udGFpbmVyID0gYnV0dG9uQ29udGFpbmVyO1xuXG4gICAgICAgIHRoaXMuX3NoYXBlQ29udHJvbGxlciA9IG5ldyBMaW5lTWFrZXJDb250cm9sbGVyKGFwcENhbnZhcyk7XG5cbiAgICAgICAgdGhpcy5jb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3NoYXBlLWNvbG9yLXBpY2tlcidcbiAgICAgICAgKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RYID0gZS5vZmZzZXRYICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WSA9IGUub2Zmc2V0WSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXI/LmhhbmRsZUNsaWNrKFxuICAgICAgICAgICAgICAgIGNvcnJlY3RYLFxuICAgICAgICAgICAgICAgIGNvcnJlY3RZLFxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JQaWNrZXIudmFsdWVcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgc2hhcGVDb250cm9sbGVyKCk6IElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZUNvbnRyb2xsZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVDb250cm9sbGVyKHY6IElTaGFwZU1ha2VyQ29udHJvbGxlcikge1xuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSB2O1xuXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RYID0gZS5vZmZzZXRYICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WSA9IGUub2Zmc2V0WSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xuICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXI/LmhhbmRsZUNsaWNrKGNvcnJlY3RYLCBjb3JyZWN0WSAsdGhpcy5jb2xvclBpY2tlci52YWx1ZSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBpbml0Q29udHJvbGxlcihzaGFwZVN0cjogQVZBSUxfU0hBUEVTKTogSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICAgICAgc3dpdGNoIChzaGFwZVN0cikge1xuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuTGluZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IExpbmVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuUmVjdGFuZ2xlOlxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLlNxdWFyZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNxdWFyZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5jb3JyZWN0IHNoYXBlIHN0cmluZycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc2hhcGVTdHIgaW4gQVZBSUxfU0hBUEVTKSB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzaGFwZS1idXR0b24nKTtcbiAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHNoYXBlU3RyO1xuICAgICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSB0aGlzLmluaXRDb250cm9sbGVyKFxuICAgICAgICAgICAgICAgICAgICBzaGFwZVN0ciBhcyBBVkFJTF9TSEFQRVNcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vLi4vLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IExpbmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9MaW5lXCI7XG5pbXBvcnQgeyBoZXhUb1JnYiB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XG4gICAgcHJpdmF0ZSBvcmlnaW46IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0ge3gsIHl9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyLzI1NSwgZy8yNTUsIGIvMjU1KTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ2xpbmUnKTtcbiAgICAgICAgICAgIGNvbnN0IGxpbmUgPSBuZXcgTGluZShpZCwgY29sb3IsIHRoaXMub3JpZ2luLngsIHRoaXMub3JpZ2luLnksIHgsIHkpO1xuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGVcIjtcbmltcG9ydCB7IGhleFRvUmdiIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHtyLCBnLCBifSA9IGhleFRvUmdiKGhleCkgPz8ge3I6IDAsIGc6IDAsIGI6IDB9O1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdyZWN0YW5nbGUnKTtcbiAgICAgICAgICAgIGNvbnN0IHJlY3RhbmdsZSA9IG5ldyBSZWN0YW5nbGUoXG4gICAgICAgICAgICAgICAgaWQsIGNvbG9yLCB0aGlzLm9yaWdpbi54LCB0aGlzLm9yaWdpbi55LCB4LCB5LDAsMSwxKTtcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHJlY3RhbmdsZSk7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBTcXVhcmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9TcXVhcmVcIjtcbmltcG9ydCB7IGhleFRvUmdiIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzXCI7XG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IHtyLCBnLCBifSA9IGhleFRvUmdiKGhleCkgPz8ge3I6IDAsIGc6IDAsIGI6IDB9O1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3Ioci8yNTUsIGcvMjU1LCBiLzI1NSk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdzcXVhcmUnKTtcblxuICAgICAgICAgICAgY29uc3QgdjEgPSB7eDogeCwgeTogeX07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjF4OiAke3YxLnh9LCB2MXk6ICR7djEueX1gKVxuXG4gICAgICAgICAgICBjb25zdCB2MiA9IHt4OiB0aGlzLm9yaWdpbi54IC0gKHkgLSB0aGlzLm9yaWdpbi55KSwgXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSArICh4LXRoaXMub3JpZ2luLngpfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHYyeDogJHt2Mi54fSwgdjJ5OiAke3YyLnl9YClcblxuICAgICAgICAgICAgY29uc3QgdjMgPSB7eDogMip0aGlzLm9yaWdpbi54IC0geCwgXG4gICAgICAgICAgICAgICAgeTogMip0aGlzLm9yaWdpbi55IC0geX1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2M3g6ICR7djMueH0sIHYzeTogJHt2My55fWApXG5cbiAgICAgICAgICAgIGNvbnN0IHY0ID0ge3g6IHRoaXMub3JpZ2luLnggKyAoeSAtIHRoaXMub3JpZ2luLnkpLCBcbiAgICAgICAgICAgICAgICB5OiB0aGlzLm9yaWdpbi55IC0gKHgtdGhpcy5vcmlnaW4ueCl9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjR4OiAke3Y0Lnh9LCB2NHk6ICR7djQueX1gKVxuXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBuZXcgU3F1YXJlKFxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdjEueCwgdjEueSwgdjIueCwgdjIueSwgdjMueCwgdjMueSwgdjQueCwgdjQueSk7XG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZShzcXVhcmUpO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9MaW5lJztcbmltcG9ydCB7IGRlZ1RvUmFkLCBldWNsaWRlYW5EaXN0YW5jZVZ0eCwgZ2V0QW5nbGUgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XG5pbXBvcnQgU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGxlbmd0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcblxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIGxpbmU6IExpbmU7XG5cbiAgICBjb25zdHJ1Y3RvcihsaW5lOiBMaW5lLCBhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICBzdXBlcihsaW5lLCBhcHBDYW52YXMpO1xuXG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG5cbiAgICAgICAgY29uc3QgZGlhZ29uYWwgPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGggKiBhcHBDYW52YXMud2lkdGggK1xuICAgICAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHQgKiBhcHBDYW52YXMuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubGVuZ3RoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXG4gICAgICAgICAgICAnTGVuZ3RoJyxcbiAgICAgICAgICAgICgpID0+IGxpbmUubGVuZ3RoLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIGRpYWdvbmFsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5sZW5ndGhTbGlkZXIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcbiAgICAgICAgICAgICgpID0+IGxpbmUucG9pbnRMaXN0WzBdLngsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdQb3NpdGlvbiBZJyxcbiAgICAgICAgICAgICgpID0+IGxpbmUucG9pbnRMaXN0WzBdLnksXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgYXBwQ2FudmFzLmhlaWdodFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUm90YXRpb24nLCB0aGlzLmN1cnJlbnRBbmdsZS5iaW5kKHRoaXMpLCAwLCAzNjApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbihwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxlbmd0aChuZXdMZW46IG51bWJlcikge1xuICAgICAgICBjb25zdCBsaW5lTGVuID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLFxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjb3MgPVxuICAgICAgICAgICAgKHRoaXMubGluZS5wb2ludExpc3RbMV0ueCAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCkgLyBsaW5lTGVuO1xuICAgICAgICBjb25zdCBzaW4gPVxuICAgICAgICAgICAgKHRoaXMubGluZS5wb2ludExpc3RbMV0ueSAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSkgLyBsaW5lTGVuO1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggPSBuZXdMZW4gKiBjb3MgKyB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLng7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld0xlbiAqIHNpbiArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueTtcblxuICAgICAgICB0aGlzLmxpbmUubGVuZ3RoID0gbmV3TGVuO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLng7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCA9IG5ld1Bvc1g7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9IG5ld1Bvc1ggKyBkaWZmO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6IG51bWJlcikge1xuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55O1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnkgPSBuZXdQb3NZO1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgPSBuZXdQb3NZICsgZGlmZjtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3VycmVudEFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gZ2V0QW5nbGUodGhpcy5saW5lLnBvaW50TGlzdFswXSwgdGhpcy5saW5lLnBvaW50TGlzdFsxXSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3Q6IG51bWJlcikge1xuICAgICAgICBjb25zdCByYWQgPSBkZWdUb1JhZChuZXdSb3QpO1xuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWQpO1xuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xuXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9XG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnggKyBjb3MgKiB0aGlzLmxpbmUubGVuZ3RoO1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgPVxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS55IC0gc2luICogdGhpcy5saW5lLmxlbmd0aDtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0W2lkeF0ueCA9IHg7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbaWR4XS55ID0geTtcblxuICAgICAgICB0aGlzLmxpbmUubGVuZ3RoID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLFxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgVmVydGV4IGZyb20gJy4uLy4uLy4uL0Jhc2UvVmVydGV4JztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlLCBtMyB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcbmltcG9ydCBTaGFwZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHdpZHRoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgbGVuZ3RoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIC8vIHByaXZhdGUgcG9pbnRTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIHJlY3RhbmdsZTogUmVjdGFuZ2xlO1xuXG4gICAgY29uc3RydWN0b3IocmVjdGFuZ2xlOiBSZWN0YW5nbGUsIGFwcENhbnZhczogQXBwQ2FudmFzKXtcbiAgICAgICAgc3VwZXIocmVjdGFuZ2xlLCBhcHBDYW52YXMpO1xuICAgICAgICB0aGlzLnJlY3RhbmdsZSA9IHJlY3RhbmdsZTtcblxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWCcsICgpID0+IHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSksLTAuNSphcHBDYW52YXMud2lkdGgsMC41KmFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy5wb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFknLCAoKSA9PiAocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSksLTAuNSphcHBDYW52YXMud2lkdGgsMC41KmFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgdGhpcy5sZW5ndGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignTGVuZ3RoJywgKCkgPT4gcGFyc2VJbnQodGhpcy5sZW5ndGhTbGlkZXIudmFsdWUpLCAxNTAsNDUwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpfSlcblxuICAgICAgICB0aGlzLndpZHRoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1dpZHRoJywgKCkgPT4gcGFyc2VJbnQodGhpcy53aWR0aFNsaWRlci52YWx1ZSksIDE1MCw0NTApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMud2lkdGhTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVXaWR0aChwYXJzZUludCh0aGlzLndpZHRoU2xpZGVyLnZhbHVlKSl9KVxuXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgKCkgPT4gcGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpLCAtMzYwLCAzNjApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUm90YXRpb24ocGFyc2VJbnQodGhpcy5yb3RhdGVTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgLy8gdGhpcy5wb2ludFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb2ludCcsICgpID0+IHBhcnNlSW50KHRoaXMucG9pbnRTbGlkZXIudmFsdWUpLCAtMTAwLCAxMDApO1xuICAgICAgICAvLyB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9pbnRTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVQb2ludFgocGFyc2VJbnQodGhpcy5wb2ludFNsaWRlci52YWx1ZSkpfSlcblxuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOm51bWJlcil7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnRyYW5zbGF0aW9uWzBdID0gbmV3UG9zWDtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6bnVtYmVyKXtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUudHJhbnNsYXRpb25bMV0gPSBuZXdQb3NZO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxlbmd0aChuZXdMZW5ndGg6bnVtYmVyKXtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2NhbGVYID0gbmV3TGVuZ3RoLzMwMDtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVXaWR0aChuZXdXaWR0aDpudW1iZXIpe1xuICAgICAgICB0aGlzLnJlY3RhbmdsZS5zY2FsZVkgPSBuZXdXaWR0aC8zMDA7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgdXBkYXRlUm90YXRpb24obmV3Um90YXRpb24gOm51bWJlcil7XG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLmFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQobmV3Um90YXRpb24pO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcbiAgICB9XG5cbiAgICAvLyBwcml2YXRlIHVwZGF0ZVBvaW50WChuZXdQb2ludFg6IG51bWJlcil7XG4gICAgLy8gICAgIGNvbnN0IG5ld1JlYyA9IG5ldyBSZWN0YW5nbGUodGhpcy5yZWN0YW5nbGUuaWQsIHRoaXMucmVjdGFuZ2xlLmNvbG9yLCB0aGlzLnJlY3RhbmdsZS5pbml0aWFsUG9pbnRbMF0sIHRoaXMucmVjdGFuZ2xlLmluaXRpYWxQb2ludFsxXSwgdGhpcy5yZWN0YW5nbGUuZW5kUG9pbnRbMF0gPSBuZXdQb2ludFgsIHRoaXMucmVjdGFuZ2xlLmVuZFBvaW50WzFdLCB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucylcbiAgICAvLyAgICAgLy8gdGhpcy5yZWN0YW5nbGUudGFyZ2V0UG9pbnRbMF0gPSBuZXdQb2ludFg7XG4gICAgLy8gICAgIHRoaXMucmVjdGFuZ2xlID0gbmV3UmVjXG4gICAgLy8gICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xuICAgIC8vIH1cblxuICAgIC8vIHByaXZhdGUgdXBkYXRlUG9pbnRzKGlkeDogbnVtYmVyKXtcbiAgICAvLyAgICAgY29uc3QgcG9pbnQgPSBbdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueCwgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueSwgMV07XG4gICAgLy8gICAgIGNvbnN0IHJlcyA9IG0zLm11bHRpcGx5M3gxKHRoaXMucmVjdGFuZ2xlLnRyYW5zZm9ybWF0aW9uTWF0cml4LCBwb2ludClcbiAgICAvLyAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueCA9IHJlc1swXTtcbiAgICAvLyAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueSA9IHJlc1sxXTtcbiAgICAvLyAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgLy8gfVxuXG5cblxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgLy8gY29uc3QgZGlmZnkgPSB5IC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueTtcbiAgICAgICAgLy8gY29uc3QgZGlmZnggPSB4IC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueDtcblxuICAgICAgICAvLyBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAvLyAgICAgaWYgKGkgIT0gaWR4KSB7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnkgKz0gZGlmZnk7XG4gICAgICAgIC8vICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnggKz0gZGlmZng7XG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH1cblxuICAgICAgICAvLyB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS54ID0geDtcbiAgICAgICAgLy8gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueSA9IHk7XG5cbiAgICAgICAgLy8gLy8gdGhpcy5yZWNhbGN1bGF0ZUNlbnRlcigpO1xuICAgICAgICAvLyB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgY3VycmVudEFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gZ2V0QW5nbGUodGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0WzBdLCB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbMV0pO1xuICAgIH1cblxuICAgIFxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi4vLi4vLi4vQmFzZS9CYXNlU2hhcGUnO1xuaW1wb3J0IENvbG9yIGZyb20gJy4uLy4uLy4uL0Jhc2UvQ29sb3InO1xuaW1wb3J0IHsgaGV4VG9SZ2IsIHJnYlRvSGV4IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcbiAgICBwdWJsaWMgYXBwQ2FudmFzOiBBcHBDYW52YXM7XG4gICAgcHJpdmF0ZSBzaGFwZTogQmFzZVNoYXBlO1xuXG4gICAgcHJpdmF0ZSB0b29sYmFyQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcbiAgICBwcml2YXRlIHZlcnRleENvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIHZlcnRleFBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZFZlcnRleCA9ICcwJztcblxuICAgIHByaXZhdGUgdnR4UG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgdnR4UG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xuICAgIHByaXZhdGUgdnR4Q29sb3JQaWNrZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcblxuICAgIHByaXZhdGUgc2xpZGVyTGlzdDogSFRNTElucHV0RWxlbWVudFtdID0gW107XG4gICAgcHJpdmF0ZSBnZXR0ZXJMaXN0OiAoKCkgPT4gbnVtYmVyKVtdID0gW107XG5cbiAgICBjb25zdHJ1Y3RvcihzaGFwZTogQmFzZVNoYXBlLCBhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLnNoYXBlID0gc2hhcGU7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3Rvb2xiYXItY29udGFpbmVyJ1xuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndmVydGV4LWNvbnRhaW5lcidcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3ZlcnRleC1waWNrZXInXG4gICAgICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xuICAgIH1cblxuICAgIGNyZWF0ZVNsaWRlcihcbiAgICAgICAgbGFiZWw6IHN0cmluZyxcbiAgICAgICAgdmFsdWVHZXR0ZXI6ICgpID0+IG51bWJlcixcbiAgICAgICAgbWluOiBudW1iZXIsXG4gICAgICAgIG1heDogbnVtYmVyXG4gICAgKTogSFRNTElucHV0RWxlbWVudCB7XG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9vbGJhci1zbGlkZXItY29udGFpbmVyJyk7XG5cbiAgICAgICAgY29uc3QgbGFiZWxFbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGxhYmVsRWxtdC50ZXh0Q29udGVudCA9IGxhYmVsO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxFbG10KTtcblxuICAgICAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIHNsaWRlci50eXBlID0gJ3JhbmdlJztcbiAgICAgICAgc2xpZGVyLm1pbiA9IG1pbi50b1N0cmluZygpO1xuICAgICAgICBzbGlkZXIubWF4ID0gbWF4LnRvU3RyaW5nKCk7XG4gICAgICAgIHNsaWRlci52YWx1ZSA9IHZhbHVlR2V0dGVyLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gICAgICAgIHRoaXMuc2xpZGVyTGlzdC5wdXNoKHNsaWRlcik7XG4gICAgICAgIHRoaXMuZ2V0dGVyTGlzdC5wdXNoKHZhbHVlR2V0dGVyKTtcblxuICAgICAgICByZXR1cm4gc2xpZGVyO1xuICAgIH1cblxuICAgIHJlZ2lzdGVyU2xpZGVyKHNsaWRlcjogSFRNTElucHV0RWxlbWVudCwgY2I6IChlOiBFdmVudCkgPT4gYW55KSB7XG4gICAgICAgIGNvbnN0IG5ld0NiID0gKGU6IEV2ZW50KSA9PiB7XG4gICAgICAgICAgICBjYihlKTtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2xpZGVycyhzbGlkZXIpO1xuICAgICAgICB9O1xuICAgICAgICBzbGlkZXIub25jaGFuZ2UgPSBuZXdDYjtcbiAgICAgICAgc2xpZGVyLm9uaW5wdXQgPSBuZXdDYjtcbiAgICB9XG5cbiAgICB1cGRhdGVTaGFwZShuZXdTaGFwZTogQmFzZVNoYXBlKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZShuZXdTaGFwZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2xpZGVycyhpZ25vcmVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5zbGlkZXJMaXN0LmZvckVhY2goKHNsaWRlciwgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZiAoaWdub3JlU2xpZGVyID09PSBzbGlkZXIpIHJldHVybjtcbiAgICAgICAgICAgIHNsaWRlci52YWx1ZSA9IHRoaXMuZ2V0dGVyTGlzdFtpZHhdKCkudG9TdHJpbmcoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpIHtcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHBhcnNlSW50KHRoaXMudmVydGV4UGlja2VyLnZhbHVlKTtcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF07XG5cbiAgICAgICAgICAgIHRoaXMudnR4UG9zWFNsaWRlci52YWx1ZSA9IHZlcnRleC54LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIudmFsdWUgPSB2ZXJ0ZXgueS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlU2xpZGVyVmVydGV4KFxuICAgICAgICBsYWJlbDogc3RyaW5nLFxuICAgICAgICBjdXJyZW50TGVuZ3RoOiBudW1iZXIsXG4gICAgICAgIG1pbjogbnVtYmVyLFxuICAgICAgICBtYXg6IG51bWJlclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XG5cbiAgICAgICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcbiAgICAgICAgc2xpZGVyLm1heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgICBzbGlkZXIudmFsdWUgPSBjdXJyZW50TGVuZ3RoLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcbiAgICB9XG5cbiAgICBjcmVhdGVDb2xvclBpY2tlclZlcnRleChsYWJlbDogc3RyaW5nLCBoZXg6IHN0cmluZyk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XG5cbiAgICAgICAgY29uc3QgY29sb3JQaWNrZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgICAgIGNvbG9yUGlja2VyLnR5cGUgPSAnY29sb3InO1xuICAgICAgICBjb2xvclBpY2tlci52YWx1ZSA9IGhleDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbG9yUGlja2VyKTtcblxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xuXG4gICAgICAgIHJldHVybiBjb2xvclBpY2tlcjtcbiAgICB9XG5cbiAgICBkcmF3VmVydGV4VG9vbGJhcigpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMudmVydGV4Q29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKTtcblxuICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludCh0aGlzLnZlcnRleFBpY2tlci52YWx1ZSk7XG4gICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF07XG5cbiAgICAgICAgdGhpcy52dHhQb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXJWZXJ0ZXgoXG4gICAgICAgICAgICAnUG9zIFgnLFxuICAgICAgICAgICAgdmVydGV4LngsXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMud2lkdGhcbiAgICAgICAgKTtcbiAgICAgICAgdGhpcy52dHhQb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXJWZXJ0ZXgoXG4gICAgICAgICAgICAnUG9zIFknLFxuICAgICAgICAgICAgdmVydGV4LnksXG4gICAgICAgICAgICAwLFxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuaGVpZ2h0XG4gICAgICAgICk7XG5cbiAgICAgICAgY29uc3QgdXBkYXRlU2xpZGVyID0gKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMudnR4UG9zWFNsaWRlciAmJiB0aGlzLnZ0eFBvc1lTbGlkZXIpXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWZXJ0ZXgoXG4gICAgICAgICAgICAgICAgICAgIGlkeCxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NYU2xpZGVyLnZhbHVlKSxcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NZU2xpZGVyLnZhbHVlKVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy52dHhDb2xvclBpY2tlciA9IHRoaXMuY3JlYXRlQ29sb3JQaWNrZXJWZXJ0ZXgoXG4gICAgICAgICAgICAnQ29sb3InLFxuICAgICAgICAgICAgcmdiVG9IZXgodmVydGV4LmMuciAqIDI1NSwgdmVydGV4LmMuZyAqIDI1NSwgdmVydGV4LmMuYiAqIDI1NSlcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCB1cGRhdGVDb2xvciA9ICgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gaGV4VG9SZ2IoXG4gICAgICAgICAgICAgICAgdGhpcy52dHhDb2xvclBpY2tlcj8udmFsdWUgPz8gJyMwMDAwMDAnXG4gICAgICAgICAgICApID8/IHsgcjogMCwgZzogMCwgYjogMCB9O1xuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3IociAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSk7XG4gICAgICAgICAgICB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdLmMgPSBjb2xvcjtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmVydGV4KFxuICAgICAgICAgICAgICAgIGlkeCxcbiAgICAgICAgICAgICAgICBwYXJzZUludCh0aGlzLnZ0eFBvc1hTbGlkZXI/LnZhbHVlID8/IHZlcnRleC54LnRvU3RyaW5nKCkpLFxuICAgICAgICAgICAgICAgIHBhcnNlSW50KHRoaXMudnR4UG9zWVNsaWRlcj8udmFsdWUgPz8gdmVydGV4LnkudG9TdHJpbmcoKSlcbiAgICAgICAgICAgICk7XG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnZ0eFBvc1hTbGlkZXIsIHVwZGF0ZVNsaWRlcik7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhQb3NZU2xpZGVyLCB1cGRhdGVTbGlkZXIpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4Q29sb3JQaWNrZXIsIHVwZGF0ZUNvbG9yKTtcbiAgICB9XG5cbiAgICBpbml0VmVydGV4VG9vbGJhcigpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMudmVydGV4UGlja2VyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleFBpY2tlci5maXJzdENoaWxkKTtcblxuICAgICAgICB0aGlzLnNoYXBlLnBvaW50TGlzdC5mb3JFYWNoKChfLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaWR4LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBvcHRpb24ubGFiZWwgPSBgVmVydGV4ICR7aWR4fWA7XG4gICAgICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRWZXJ0ZXg7XG4gICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcblxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZDtcbn1cbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uL1NoYXBlcy9MaW5lJztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgTGluZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBJU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIHRvb2xiYXJDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgaXRlbVBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZElkOiBzdHJpbmcgPSAnJztcblxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRyb2xsZXI6IElTaGFwZVRvb2xiYXJDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICAgICAgdGhpcy5hcHBDYW52YXMudXBkYXRlVG9vbGJhciA9IHRoaXMudXBkYXRlU2hhcGVMaXN0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5pdGVtUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndG9vbGJhci1pdGVtLXBpY2tlcidcbiAgICAgICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcblxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIub25jaGFuZ2UgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZElkID0gdGhpcy5pdGVtUGlja2VyLnZhbHVlO1xuICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLmFwcENhbnZhcy5zaGFwZXNbdGhpcy5pdGVtUGlja2VyLnZhbHVlXTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xuXG4gICAgICAgICAgICBpZiAoc2hhcGUgaW5zdGFuY2VvZiBMaW5lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBMaW5lVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgTGluZSwgYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUgaW5zdGFuY2VvZiBSZWN0YW5nbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFJlY3RhbmdsZSwgYXBwQ2FudmFzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGVMaXN0KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2hhcGVMaXN0KCkge1xuICAgICAgICB3aGlsZSAodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLml0ZW1QaWNrZXIucmVtb3ZlQ2hpbGQodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgcGxhY2Vob2xkZXIudGV4dCA9ICdDaG9vc2UgYW4gb2JqZWN0JztcbiAgICAgICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcblxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuYXBwQ2FudmFzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBjaGlsZC50ZXh0ID0gc2hhcGUuaWQ7XG4gICAgICAgICAgICBjaGlsZC52YWx1ZSA9IHNoYXBlLmlkO1xuICAgICAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLnZhbHVlID0gdGhpcy5zZWxlY3RlZElkO1xuXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5hcHBDYW52YXMuc2hhcGVzKS5pbmNsdWRlcyh0aGlzLnNlbGVjdGVkSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhclRvb2xiYXJFbG10KCkge1xuICAgICAgICB3aGlsZSAodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgICBsZW5ndGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBlbmRYOiBudW1iZXIsIGVuZFk6IG51bWJlciwgcm90YXRpb24gPSAwLCBzY2FsZVggPSAxLCBzY2FsZVkgPSAxKSB7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoc3RhcnRYICsgZW5kWCkgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHN0YXJ0WSArIGVuZFkpIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xuICAgICAgICBcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gbmV3IFZlcnRleChzdGFydFgsIHN0YXJ0WSwgY29sb3IpO1xuICAgICAgICBjb25zdCBlbmQgPSBuZXcgVmVydGV4KGVuZFgsIGVuZFksIGNvbG9yKTtcblxuICAgICAgICB0aGlzLmxlbmd0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxuICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgZW5kXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaChvcmlnaW4sIGVuZCk7XG4gICAgfVxufSIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XG5pbXBvcnQgeyBkZWdUb1JhZCwgbTMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgICB0cmFuc2xhdGlvbjogW251bWJlciwgbnVtYmVyXSA9IFswLCAwXTtcbiAgICBhbmdsZUluUmFkaWFuczogbnVtYmVyID0gMDtcbiAgICBzY2FsZTogW251bWJlciwgbnVtYmVyXSA9IFsxLCAxXTtcbiAgICBsZW5ndGg6IG51bWJlcjtcbiAgICB3aWR0aDogbnVtYmVyO1xuICAgIGluaXRpYWxQb2ludDogbnVtYmVyW107XG4gICAgZW5kUG9pbnQ6IG51bWJlcltdO1xuICAgIHRhcmdldFBvaW50OiBudW1iZXJbXTtcblxuXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCBzdGFydFg6IG51bWJlciwgc3RhcnRZOiBudW1iZXIsIGVuZFg6IG51bWJlciwgZW5kWTogbnVtYmVyLCBhbmdsZUluUmFkaWFuczogbnVtYmVyLCBzY2FsZVg6IG51bWJlciA9IDEsIHNjYWxlWTogbnVtYmVyID0gMSkge1xuICAgICAgICBzdXBlcig1LCBpZCwgY29sb3IpO1xuXG4gICAgICAgIC8vIGNvbnN0IHZlY0VuZCA9IFtlbmRYLCBlbmRZLCAxXTtcbiAgICAgICAgLy8gY29uc3QgdHJhbnNsYXRlVG9Jbml0aWFsUG9pbnQgPSBtMy50cmFuc2xhdGlvbigtc3RhcnRYLCAtc3RhcnRZKVxuICAgICAgICAvLyBjb25zdCByb3RhdGVSZXZlcnNlID0gbTMucm90YXRpb24oLWFuZ2xlSW5SYWRpYW5zKVxuICAgICAgICAvLyBjb25zdCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24oc3RhcnRYLCBzdGFydFkpXG4gICAgICAgIC8vIGNvbnN0IHJlc1JvdGF0ZSA9IG0zLm11bHRpcGx5KHJvdGF0ZVJldmVyc2UsdHJhbnNsYXRlVG9Jbml0aWFsUG9pbnQpO1xuICAgICAgICAvLyBjb25zdCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzUm90YXRlKVxuXG4gICAgICAgIC8vIGNvbnN0IHJlc1ZlY0VuZCA9IG0zLm11bHRpcGx5M3gxKHJlc0JhY2ssIHZlY0VuZClcblxuICAgICAgICAvLyBlbmRYID0gcmVzVmVjRW5kWzBdXG4gICAgICAgIC8vIGVuZFkgPSByZXNWZWNFbmRbMV1cblxuICAgICAgICBjb25zdCB4MSA9IHN0YXJ0WDtcbiAgICAgICAgY29uc3QgeTEgPSBzdGFydFk7XG4gICAgICAgIGNvbnN0IHgyID0gZW5kWDtcbiAgICAgICAgY29uc3QgeTIgPSBzdGFydFk7XG4gICAgICAgIGNvbnN0IHgzID0gc3RhcnRYO1xuICAgICAgICBjb25zdCB5MyA9IGVuZFk7XG4gICAgICAgIGNvbnN0IHg0ID0gZW5kWDtcbiAgICAgICAgY29uc3QgeTQgPSBlbmRZO1xuXG4gICAgICAgIHRoaXMuYW5nbGVJblJhZGlhbnMgPSBhbmdsZUluUmFkaWFucztcbiAgICAgICAgdGhpcy5zY2FsZSA9IFtzY2FsZVgsIHNjYWxlWV07XG4gICAgICAgIHRoaXMuaW5pdGlhbFBvaW50ID0gW3N0YXJ0WCwgc3RhcnRZLCAxXTtcbiAgICAgICAgdGhpcy5lbmRQb2ludCA9IFtlbmRYLCBlbmRZLCAxXTtcbiAgICAgICAgdGhpcy50YXJnZXRQb2ludCA9IFswLDAsIDFdO1xuICAgICAgICB0aGlzLmxlbmd0aCA9IHgyLXgxO1xuICAgICAgICB0aGlzLndpZHRoID0geDMteDI7XG5cbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh4MSArIHg0KSAvIDI7XG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoeTEgKyB5NCkgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIGNvbG9yKTtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaChuZXcgVmVydGV4KHgxLCB5MSwgY29sb3IpLCBuZXcgVmVydGV4KHgyLCB5MiwgY29sb3IpLCBuZXcgVmVydGV4KHgzLCB5MywgY29sb3IpLCBuZXcgVmVydGV4KHg0LCB5NCwgY29sb3IpKTtcblxuICAgICAgICAvLyBjb25zb2xlLmxvZyhgcG9pbnQgMTogJHt4MX0sICR7eTF9YCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBwb2ludCAyOiAke3gyfSwgJHt5Mn1gKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coYHBvaW50IDM6ICR7eDN9LCAke3kzfWApO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhgcG9pbnQgMzogJHt4NH0sICR7eTR9YCk7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKGBjZW50ZXI6ICR7Y2VudGVyLnh9LCAke2NlbnRlci55fWApO1xuICAgIH1cblxuICAgIG92ZXJyaWRlIHNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCl7XG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5pZGVudGl0eSgpXG4gICAgICAgIGNvbnN0IHRyYW5zbGF0ZVRvQ2VudGVyID0gbTMudHJhbnNsYXRpb24oLXRoaXMuY2VudGVyLngsIC10aGlzLmNlbnRlci55KTtcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSBtMy5yb3RhdGlvbih0aGlzLmFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgbGV0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHRoaXMuc2NhbGVYLCB0aGlzLnNjYWxlWSk7XG4gICAgICAgIGxldCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24odGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XG4gICAgICAgIGNvbnN0IHRyYW5zbGF0ZSA9IG0zLnRyYW5zbGF0aW9uKHRoaXMudHJhbnNsYXRpb25bMF0sIHRoaXMudHJhbnNsYXRpb25bMV0pO1xuXG4gICAgICAgIGxldCByZXNTY2FsZSA9IG0zLm11bHRpcGx5KHNjYWxpbmcsIHRyYW5zbGF0ZVRvQ2VudGVyKTtcbiAgICAgICAgbGV0IHJlc1JvdGF0ZSA9IG0zLm11bHRpcGx5KHJvdGF0aW9uLHJlc1NjYWxlKTtcbiAgICAgICAgbGV0IHJlc0JhY2sgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGVCYWNrLCByZXNSb3RhdGUpO1xuICAgICAgICBjb25zdCByZXNUcmFuc2xhdGUgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGUsIHJlc0JhY2spO1xuICAgICAgICB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gcmVzVHJhbnNsYXRlO1xuXG4gICAgICAgIC8vIGNvbnN0IHBvaW50ID0gW3RoaXMucG9pbnRMaXN0W2lkeF0ueCwgdGhpcy5wb2ludExpc3RbaWR4XS55LCAxXTtcbiAgICAgICAgdGhpcy5lbmRQb2ludCA9IG0zLm11bHRpcGx5M3gxKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMuZW5kUG9pbnQpXG4gICAgICAgIHRoaXMuaW5pdGlhbFBvaW50ID0gbTMubXVsdGlwbHkzeDEodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5pbml0aWFsUG9pbnQpXG4gICAgXG4gICAgfVxuXG4gICAgcHVibGljIG92ZXJyaWRlIHNldFZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpOiB2b2lkIHtcbiAgICAgICAgLy8gLy8gVEVTVFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluaXRpYWxcIiwgdGhpcy5pbml0aWFsUG9pbnQpO1xuICAgICAgICAvLyBjb25zdCB0YXJnZXRQb2ludFggPSB0aGlzLmVuZFBvaW50WzBdICsgdGhpcy50YXJnZXRQb2ludFswXTtcbiAgICAgICAgLy8gY29uc3QgdGFyZ2V0UG9pbnRZID0gdGhpcy5lbmRQb2ludFsxXSArIHRoaXMudGFyZ2V0UG9pbnRbMV07XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZW5kUG9pbnQgWDogXCIsIHRoaXMuZW5kUG9pbnRbMF0pO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImVuZFBvaW50IFk6IFwiLCB0aGlzLmVuZFBvaW50WzFdKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0YXJnZXRYOiBcIiwgdGFyZ2V0UG9pbnRYKTtcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0YXJnZXRZOiBcIiwgdGFyZ2V0UG9pbnRZKTtcblxuICAgICAgICAvLyBjb25zdCB0cmFuc2xhdGVUb0luaXRpYWwgPSBtMy50cmFuc2xhdGlvbigtdGhpcy5pbml0aWFsUG9pbnRbMF0sIC10aGlzLmluaXRpYWxQb2ludFsxXSk7XG4gICAgICAgIC8vIGNvbnN0IHJvdGF0ZVJldmVydCA9IG0zLnJvdGF0aW9uKC10aGlzLmFuZ2xlSW5SYWRpYW5zKTtcblxuICAgICAgICAvLyBjb25zdCByZXNSb3RhdGUgPSBtMy5tdWx0aXBseShyb3RhdGVSZXZlcnQsIHRyYW5zbGF0ZVRvSW5pdGlhbClcbiAgICAgICAgLy8gLy8gY29uc3QgcmVzVHJhbnNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzUm90YXRlKVxuXG4gICAgICAgIC8vIGNvbnN0IHJvdGF0ZWRUYXJnZXQ9IG0zLm11bHRpcGx5M3gxKHJlc1JvdGF0ZSwgW3RhcmdldFBvaW50WCwgdGFyZ2V0UG9pbnRZLCAxXSk7XG4gICAgICAgIC8vIGNvbnN0IHJvdGF0ZWRFbmRQb2ludD1tMy5tdWx0aXBseTN4MShyZXNSb3RhdGUsIHRoaXMuZW5kUG9pbnQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJvdGF0ZWQgdGFyZ2V0XCIsIHJvdGF0ZWRUYXJnZXQpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJvdGF0ZWQgZW5kcG9pbnRcIiwgcm90YXRlZEVuZFBvaW50KTtcbiAgICAgICAgLy8gLy8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG0zLm11bHRpcGx5KHJlc1JvdGF0ZSwgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeClcbiAgICAgICAgXG4gICAgICAgIC8vIGNvbnN0IGN1cnJlbnRMZW5ndGggPSByb3RhdGVkRW5kUG9pbnRbMF07XG4gICAgICAgIC8vIGNvbnN0IGN1cnJlbnRXaWR0aD0gcm90YXRlZEVuZFBvaW50WzFdO1xuXG4gICAgICAgIC8vIGNvbnN0IHVwZGF0ZWRMZW5ndGggPSBjdXJyZW50TGVuZ3RoICsgcm90YXRlZFRhcmdldFswXSAtIHJvdGF0ZWRFbmRQb2ludFswXTtcbiAgICAgICAgLy8gY29uc3QgdXBkYXRlZFdpZHRoID0gY3VycmVudFdpZHRoICsgcm90YXRlZFRhcmdldFsxXSAtIHJvdGF0ZWRFbmRQb2ludFsxXTtcblxuXG4gICAgICAgIC8vIGNvbnN0IHNjYWxlTGVuZ3RoID0gdXBkYXRlZExlbmd0aCAvIGN1cnJlbnRMZW5ndGg7XG4gICAgICAgIC8vIGNvbnN0IHNjYWxlV2lkdGggPSB1cGRhdGVkV2lkdGggLyBjdXJyZW50V2lkdGg7XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwic2NhbGUgbGVuZ3RoOiBcIiwgc2NhbGVMZW5ndGgpO1xuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNjYWxlIHdpZHRoOiBcIiwgc2NhbGVXaWR0aCk7XG4gICAgICAgIFxuICAgICAgICAvLyBjb25zdCBzY2FsaW5nID0gbTMuc2NhbGluZyhzY2FsZUxlbmd0aCwgc2NhbGVXaWR0aCk7XG4gICAgICAgIC8vIGNvbnN0IHJvdGF0ZUJhY2sgPSBtMy5yb3RhdGlvbih0aGlzLmFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgICAgLy8gY29uc3QgdHJhbnNsYXRlQmFjayA9IG0zLnRyYW5zbGF0aW9uKHRoaXMuaW5pdGlhbFBvaW50WzBdLCB0aGlzLmluaXRpYWxQb2ludFsxXSk7XG5cbiAgICAgICAgLy8gY29uc3QgcmVzU2NhbGUgPSBtMy5tdWx0aXBseShyb3RhdGVCYWNrLCBzY2FsaW5nKTtcbiAgICAgICAgLy8gY29uc3QgcmVzQmFjayA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZUJhY2ssIHJlc1NjYWxlKTtcblxuICAgICAgICAvLyBjb25zdCB2aXJ0dWFsVHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5tdWx0aXBseShyZXNCYWNrLCByZXNSb3RhdGUpO1xuICAgICAgICAvLyB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4ID0gbTMubXVsdGlwbHkodmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4KTtcbiAgICAgICAgLy8gY29uc29sZS5sb2codGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XG4gICAgICAgIFxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInJlczogXCIsIG0zLm11bHRpcGx5M3gxKHZpcnR1YWxUcmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5pbml0aWFsUG9pbnQpKVxuICAgIH1cblxuICAgIC8vIHNldFRyYW5zbGF0aW9uKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgLy8gICAgIHRoaXMudHJhbnNsYXRpb24gPSBbeCwgeV07XG4gICAgLy8gfVxuXG4gICAgLy8gc2V0Um90YXRpb24oYW5nbGVJbkRlZ3JlZXM6IG51bWJlcikge1xuICAgIC8vICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQoYW5nbGVJbkRlZ3JlZXMpO1xuICAgIC8vIH1cblxuICAgIC8vIHNldFNjYWxlKHNjYWxlWDogbnVtYmVyLCBzY2FsZVk6IG51bWJlcikge1xuICAgIC8vICAgICB0aGlzLnNjYWxlID0gW3NjYWxlWCwgc2NhbGVZXTtcbiAgICAvLyB9XG59XG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgeDQ6IG51bWJlciwgeTQ6IG51bWJlciwgcm90YXRpb24gPSAwLCBzY2FsZVggPSAxLCBzY2FsZVkgPSAxKSB7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoeDEgKyB4MykgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHkxICsgeTMpIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XG4gICAgICAgIFxuICAgICAgICBzdXBlcig2LCBpZCwgY29sb3IsIGNlbnRlciwgcm90YXRpb24sIHNjYWxlWCwgc2NhbGVZKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHYxID0gbmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKTtcbiAgICAgICAgY29uc3QgdjIgPSBuZXcgVmVydGV4KHgyLCB5MiwgY29sb3IpO1xuICAgICAgICBjb25zdCB2MyA9IG5ldyBWZXJ0ZXgoeDMsIHkzLCBjb2xvcik7XG4gICAgICAgIGNvbnN0IHY0ID0gbmV3IFZlcnRleCh4NCwgeTQsIGNvbG9yKTtcblxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKHYxLCB2MiwgdjMsIHY0KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4vQXBwQ2FudmFzJztcbmltcG9ydCBDb2xvciBmcm9tICcuL0Jhc2UvQ29sb3InO1xuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyJztcbmltcG9ydCBUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXInO1xuaW1wb3J0IExpbmUgZnJvbSAnLi9TaGFwZXMvTGluZSc7XG5pbXBvcnQgUmVjdGFuZ2xlIGZyb20gJy4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgaW5pdCBmcm9tICcuL2luaXQnO1xuXG5jb25zdCBtYWluID0gKCkgPT4ge1xuICAgIGNvbnN0IGluaXRSZXQgPSBpbml0KCk7XG4gICAgaWYgKCFpbml0UmV0KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIFdlYkdMJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGdsLCBwcm9ncmFtLCBjb2xvckJ1ZmZlciwgcG9zaXRpb25CdWZmZXIgfSA9IGluaXRSZXQ7XG5cbiAgICBjb25zdCBhcHBDYW52YXMgPSBuZXcgQXBwQ2FudmFzKGdsLCBwcm9ncmFtLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xuICAgIFxuICAgIGNvbnN0IGNhbnZhc0NvbnRyb2xsZXIgPSBuZXcgQ2FudmFzQ29udHJvbGxlcihhcHBDYW52YXMpO1xuICAgIGNhbnZhc0NvbnRyb2xsZXIuc3RhcnQoKTtcbiAgICBcbiAgICBuZXcgVG9vbGJhckNvbnRyb2xsZXIoYXBwQ2FudmFzKTtcblxuICAgIGNvbnN0IHJlZCA9IG5ldyBDb2xvcigyNTUsIDAsIDIwMClcbiAgICAvLyBjb25zdCB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZSgndHJpLTEnLCByZWQsIDUwLCA1MCwgMjAsIDUwMCwgMjAwLCAxMDApO1xuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZSh0cmlhbmdsZSk7XG4gICAgXG4gICAgLy8gY29uc3QgcmVjdCA9IG5ldyBSZWN0YW5nbGUoJ3JlY3QtMScsIHJlZCwgMCwwLDEwLDEwLDAsMSwxKTtcbiAgICAvLyByZWN0LmFuZ2xlSW5SYWRpYW5zID0gLSBNYXRoLlBJIC8gNDtcbiAgICAvLyByZWN0LnRhcmdldFBvaW50WzBdID0gNSAqIE1hdGguc3FydCgyKTtcbiAgICAvLyByZWN0LnNjYWxlWCA9IDEwO1xuICAgIC8vIHJlY3QudHJhbnNsYXRpb25bMF0gPSA1MDA7XG4gICAgLy8gcmVjdC50cmFuc2xhdGlvblsxXSA9IDEwMDA7XG4gICAgLy8gcmVjdC5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShyZWN0KTtcblxuICAgIC8vIGNvbnN0IGxpbmUgPSBuZXcgTGluZSgnbGluZS0xJywgcmVkLCAxMDAsIDEwMCwgMTAwLCAzMDApO1xuICAgIC8vIGNvbnN0IGxpbmUyID0gbmV3IExpbmUoJ2xpbmUtMicsIHJlZCwgMTAwLCAxMDAsIDMwMCwgMTAwKTtcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XG4gICAgLy8gYXBwQ2FudmFzLmFkZFNoYXBlKGxpbmUyKTtcbn07XG5cbm1haW4oKTtcbiIsImNvbnN0IGNyZWF0ZVNoYWRlciA9IChcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxuICAgIHR5cGU6IG51bWJlcixcbiAgICBzb3VyY2U6IHN0cmluZ1xuKSA9PiB7XG4gICAgY29uc3Qgc2hhZGVyID0gZ2wuY3JlYXRlU2hhZGVyKHR5cGUpO1xuICAgIGlmIChzaGFkZXIpIHtcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcbiAgICAgICAgZ2wuY29tcGlsZVNoYWRlcihzaGFkZXIpO1xuICAgICAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHNoYWRlcjtcblxuICAgICAgICBjb25zb2xlLmVycm9yKGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XG4gICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xuICAgIH1cbn07XG5cbmNvbnN0IGNyZWF0ZVByb2dyYW0gPSAoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgICB2dHhTaGQ6IFdlYkdMU2hhZGVyLFxuICAgIGZyZ1NoZDogV2ViR0xTaGFkZXJcbikgPT4ge1xuICAgIGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XG4gICAgaWYgKHByb2dyYW0pIHtcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZ0eFNoZCk7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmdTaGQpO1xuICAgICAgICBnbC5saW5rUHJvZ3JhbShwcm9ncmFtKTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHByb2dyYW07XG5cbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKSk7XG4gICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XG4gICAgfVxufTtcblxuY29uc3QgaW5pdCA9ICgpID0+IHtcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJyk7XG5cbiAgICBpZiAoIWdsKSB7XG4gICAgICAgIGFsZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB3ZWJHTCcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEluaXRpYWxpemUgc2hhZGVycyBhbmQgcHJvZ3JhbXNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgY29uc3QgdnR4U2hhZGVyU291cmNlID0gKFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVydGV4LXNoYWRlci0yZCcpIGFzIEhUTUxTY3JpcHRFbGVtZW50XG4gICAgKS50ZXh0O1xuICAgIGNvbnN0IGZyYWdTaGFkZXJTb3VyY2UgPSAoXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcmFnbWVudC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxuICAgICkudGV4dDtcblxuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IGNyZWF0ZVNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnR4U2hhZGVyU291cmNlKTtcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGNyZWF0ZVNoYWRlcihcbiAgICAgICAgZ2wsXG4gICAgICAgIGdsLkZSQUdNRU5UX1NIQURFUixcbiAgICAgICAgZnJhZ1NoYWRlclNvdXJjZVxuICAgICk7XG4gICAgaWYgKCF2ZXJ0ZXhTaGFkZXIgfHwgIWZyYWdtZW50U2hhZGVyKSByZXR1cm47XG5cbiAgICBjb25zdCBwcm9ncmFtID0gY3JlYXRlUHJvZ3JhbShnbCwgdmVydGV4U2hhZGVyLCBmcmFnbWVudFNoYWRlcik7XG4gICAgaWYgKCFwcm9ncmFtKSByZXR1cm47XG5cbiAgICBjb25zdCBkcHIgPSB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgY29uc3QgZGlzcGxheVdpZHRoICA9IE1hdGgucm91bmQod2lkdGggKiBkcHIpO1xuICAgIGNvbnN0IGRpc3BsYXlIZWlnaHQgPSBNYXRoLnJvdW5kKGhlaWdodCAqIGRwcik7XG5cbiAgICBjb25zdCBuZWVkUmVzaXplID1cbiAgICAgICAgZ2wuY2FudmFzLndpZHRoICE9IGRpc3BsYXlXaWR0aCB8fCBnbC5jYW52YXMuaGVpZ2h0ICE9IGRpc3BsYXlIZWlnaHQ7XG5cbiAgICBpZiAobmVlZFJlc2l6ZSkge1xuICAgICAgICBnbC5jYW52YXMud2lkdGggPSBkaXNwbGF5V2lkdGg7XG4gICAgICAgIGdsLmNhbnZhcy5oZWlnaHQgPSBkaXNwbGF5SGVpZ2h0O1xuICAgIH1cblxuICAgIGdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XG4gICAgZ2wuY2xlYXJDb2xvcigwLCAwLCAwLCAwKTtcbiAgICBnbC5jbGVhcihnbC5DT0xPUl9CVUZGRVJfQklUKTtcbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xuXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIEVuYWJsZSAmIGluaXRpYWxpemUgdW5pZm9ybXMgYW5kIGF0dHJpYnV0ZXNcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gUmVzb2x1dGlvblxuICAgIGNvbnN0IG1hdHJpeFVuaWZvcm1Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihcbiAgICAgICAgcHJvZ3JhbSxcbiAgICAgICAgJ3VfdHJhbnNmb3JtYXRpb24nXG4gICAgKTtcbiAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeFVuaWZvcm1Mb2NhdGlvbiwgZmFsc2UsIFsxLDAsMCwwLDEsMCwwLDAsMV0pXG5cbiAgICBjb25zdCByZXNvbHV0aW9uVW5pZm9ybUxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKFxuICAgICAgICBwcm9ncmFtLFxuICAgICAgICAndV9yZXNvbHV0aW9uJ1xuICAgICk7XG4gICAgZ2wudW5pZm9ybTJmKHJlc29sdXRpb25Vbmlmb3JtTG9jYXRpb24sIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XG5cbiAgICAvLyBDb2xvclxuICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgaWYgKCFjb2xvckJ1ZmZlcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGNvbG9yIGJ1ZmZlcicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICBjb25zdCBjb2xvckF0dHJpYnV0ZUxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgJ2FfY29sb3InKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShjb2xvckF0dHJpYnV0ZUxvY2F0aW9uKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGNvbG9yQXR0cmlidXRlTG9jYXRpb24sIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGNvbnN0IHBvc2l0aW9uQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgaWYgKCFwb3NpdGlvbkJ1ZmZlcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHBvc2l0aW9uIGJ1ZmZlcicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcbiAgICBjb25zdCBwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oXG4gICAgICAgIHByb2dyYW0sXG4gICAgICAgICdhX3Bvc2l0aW9uJ1xuICAgICk7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8gRG8gbm90IHJlbW92ZSBjb21tZW50cywgdXNlZCBmb3Igc2FuaXR5IGNoZWNrXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFNldCB0aGUgdmFsdWVzIG9mIHRoZSBidWZmZXJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvLyBjb25zdCBjb2xvcnMgPSBbMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMF07XG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyBjb25zdCBwb3NpdGlvbnMgPSBbMTAwLCA1MCwgMjAsIDEwLCA1MDAsIDUwMF07XG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyA9PT09XG4gICAgLy8gRHJhd1xuICAgIC8vID09PT1cbiAgICAvLyBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywgMCwgMyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbkJ1ZmZlcixcbiAgICAgICAgcHJvZ3JhbSxcbiAgICAgICAgY29sb3JCdWZmZXIsXG4gICAgICAgIGdsLFxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIiwiaW1wb3J0IFZlcnRleCBmcm9tICcuL0Jhc2UvVmVydGV4JztcblxuZXhwb3J0IGNvbnN0IGV1Y2xpZGVhbkRpc3RhbmNlVnR4ID0gKGE6IFZlcnRleCwgYjogVmVydGV4KTogbnVtYmVyID0+IHtcbiAgICBjb25zdCBkeCA9IGEueCAtIGIueDtcbiAgICBjb25zdCBkeSA9IGEueSAtIGIueTtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xufTtcblxuLy8gMzYwIERFR1xuZXhwb3J0IGNvbnN0IGdldEFuZ2xlID0gKG9yaWdpbjogVmVydGV4LCB0YXJnZXQ6IFZlcnRleCkgPT4ge1xuICAgIGNvbnN0IHBsdXNNaW51c0RlZyA9IHJhZFRvRGVnKE1hdGguYXRhbjIob3JpZ2luLnkgLSB0YXJnZXQueSwgb3JpZ2luLnggLSB0YXJnZXQueCkpO1xuICAgIHJldHVybiBwbHVzTWludXNEZWcgPj0gMCA/IDE4MCAtIHBsdXNNaW51c0RlZyA6IE1hdGguYWJzKHBsdXNNaW51c0RlZykgKyAxODA7XG59XG5cbmV4cG9ydCBjb25zdCByYWRUb0RlZyA9IChyYWQ6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xufVxuXG5leHBvcnQgY29uc3QgZGVnVG9SYWQgPSAoZGVnOiBudW1iZXIpID0+IHtcbiAgICByZXR1cm4gZGVnICogTWF0aC5QSSAvIDE4MDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhleFRvUmdiKGhleDogc3RyaW5nKSB7XG4gIHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcbiAgcmV0dXJuIHJlc3VsdCA/IHtcbiAgICByOiBwYXJzZUludChyZXN1bHRbMV0sIDE2KSxcbiAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcbiAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxuICB9IDogbnVsbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJnYlRvSGV4KHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcbiAgcmV0dXJuIFwiI1wiICsgKDEgPDwgMjQgfCByIDw8IDE2IHwgZyA8PCA4IHwgYikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xufVxuXG5leHBvcnQgY29uc3QgbTMgPSB7XG4gICAgaWRlbnRpdHk6IGZ1bmN0aW9uKCkgOiBudW1iZXJbXSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAxLCAwLCAwLFxuICAgICAgICAwLCAxLCAwLFxuICAgICAgICAwLCAwLCAxLFxuICAgICAgXTtcbiAgICB9LFxuICBcbiAgICB0cmFuc2xhdGlvbjogZnVuY3Rpb24odHggOiBudW1iZXIsIHR5IDogbnVtYmVyKSA6IG51bWJlcltdIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIDEsIDAsIDAsXG4gICAgICAgIDAsIDEsIDAsXG4gICAgICAgIHR4LCB0eSwgMSxcbiAgICAgIF07XG4gICAgfSxcbiAgXG4gICAgcm90YXRpb246IGZ1bmN0aW9uKGFuZ2xlSW5SYWRpYW5zIDogbnVtYmVyKSA6IG51bWJlcltdIHtcbiAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XG4gICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgYywtcywgMCxcbiAgICAgICAgcywgYywgMCxcbiAgICAgICAgMCwgMCwgMSxcbiAgICAgIF07XG4gICAgfSxcbiAgXG4gICAgc2NhbGluZzogZnVuY3Rpb24oc3ggOiBudW1iZXIsIHN5IDogbnVtYmVyKSA6IG51bWJlcltdIHtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIHN4LCAwLCAwLFxuICAgICAgICAwLCBzeSwgMCxcbiAgICAgICAgMCwgMCwgMSxcbiAgICAgIF07XG4gICAgfSxcbiAgXG4gICAgbXVsdGlwbHk6IGZ1bmN0aW9uKGEgOiBudW1iZXJbXSwgYiA6IG51bWJlcltdKSA6IG51bWJlcltdIHtcbiAgICAgIGNvbnN0IGEwMCA9IGFbMCAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGEwMSA9IGFbMCAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGEwMiA9IGFbMCAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGExMCA9IGFbMSAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGExMSA9IGFbMSAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGExMiA9IGFbMSAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGEyMCA9IGFbMiAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGEyMSA9IGFbMiAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGEyMiA9IGFbMiAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGIwMCA9IGJbMCAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGIwMSA9IGJbMCAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGIwMiA9IGJbMCAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGIxMCA9IGJbMSAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGIxMSA9IGJbMSAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGIxMiA9IGJbMSAqIDMgKyAyXTtcbiAgICAgIGNvbnN0IGIyMCA9IGJbMiAqIDMgKyAwXTtcbiAgICAgIGNvbnN0IGIyMSA9IGJbMiAqIDMgKyAxXTtcbiAgICAgIGNvbnN0IGIyMiA9IGJbMiAqIDMgKyAyXTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMCxcbiAgICAgICAgYjAwICogYTAxICsgYjAxICogYTExICsgYjAyICogYTIxLFxuICAgICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXG4gICAgICAgIGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMCxcbiAgICAgICAgYjEwICogYTAxICsgYjExICogYTExICsgYjEyICogYTIxLFxuICAgICAgICBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjIsXG4gICAgICAgIGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMCxcbiAgICAgICAgYjIwICogYTAxICsgYjIxICogYTExICsgYjIyICogYTIxLFxuICAgICAgICBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjIsXG4gICAgICBdO1xuICAgIH0sXG5cbiAgICBtdWx0aXBseTN4MTogZnVuY3Rpb24oYSA6IG51bWJlcltdLCBiIDogbnVtYmVyW10pIDogbnVtYmVyW10ge1xuICAgICAgY29uc3QgYTAwID0gYVswICogMyArIDBdO1xuICAgICAgY29uc3QgYTAxID0gYVswICogMyArIDFdO1xuICAgICAgY29uc3QgYTAyID0gYVswICogMyArIDJdO1xuICAgICAgY29uc3QgYTEwID0gYVsxICogMyArIDBdO1xuICAgICAgY29uc3QgYTExID0gYVsxICogMyArIDFdO1xuICAgICAgY29uc3QgYTEyID0gYVsxICogMyArIDJdO1xuICAgICAgY29uc3QgYTIwID0gYVsyICogMyArIDBdO1xuICAgICAgY29uc3QgYTIxID0gYVsyICogMyArIDFdO1xuICAgICAgY29uc3QgYTIyID0gYVsyICogMyArIDJdO1xuICAgICAgY29uc3QgYjAwID0gYlswICogMyArIDBdO1xuICAgICAgY29uc3QgYjAxID0gYlswICogMyArIDFdO1xuICAgICAgY29uc3QgYjAyID0gYlswICogMyArIDJdO1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxuICAgICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXG4gICAgICAgIGIwMCAqIGEwMiArIGIwMSAqIGExMiArIGIwMiAqIGEyMixcbiAgICAgIF07XG4gICAgfSxcblxuICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24obSA6IG51bWJlcltdLCB0eDpudW1iZXIsIHR5Om51bWJlcikge1xuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnRyYW5zbGF0aW9uKHR4LCB0eSkpO1xuICAgIH0sXG4gIFxuICAgIHJvdGF0ZTogZnVuY3Rpb24obTpudW1iZXJbXSwgYW5nbGVJblJhZGlhbnM6bnVtYmVyKSB7XG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMucm90YXRpb24oYW5nbGVJblJhZGlhbnMpKTtcbiAgICB9LFxuICBcbiAgICBzY2FsZTogZnVuY3Rpb24obTpudW1iZXJbXSwgc3g6bnVtYmVyLCBzeTpudW1iZXIpIHtcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy5zY2FsaW5nKHN4LCBzeSkpO1xuICAgIH0sXG4gIH07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0gX193ZWJwYWNrX3JlcXVpcmVfXyhcIi4vc3JjL2luZGV4LnRzXCIpO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9