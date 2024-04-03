/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/AppCanvas.ts":
/*!**************************!*\
  !*** ./src/AppCanvas.ts ***!
  \**************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {


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
var utils_1 = __webpack_require__(/*! ./utils */ "./src/utils.ts");
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
            var translation = shape.translation, angleInRadians = shape.angleInRadians, scale = shape.scale;
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
            if (!(_this.positionBuffer instanceof WebGLBuffer)) {
                throw new Error("Position buffer is not a valid WebGLBuffer");
            }
            if (!(_this.colorBuffer instanceof WebGLBuffer)) {
                throw new Error("Color buffer is not a valid WebGLBuffer");
            }
            var matrix = utils_1.m3.identity();
            matrix = utils_1.m3.multiply(matrix, utils_1.m3.translation(translation[0], translation[1]));
            matrix = utils_1.m3.multiply(matrix, utils_1.m3.rotation(angleInRadians));
            matrix = utils_1.m3.multiply(matrix, utils_1.m3.scaling(scale[0], scale[1]));
            var matrixLocation = gl.getUniformLocation(_this.program, "u_matrix");
            console.log(matrixLocation);
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
var Vertex_1 = __importDefault(__webpack_require__(/*! ./Vertex */ "./src/Base/Vertex.ts"));
var BaseShape = /** @class */ (function () {
    function BaseShape(glDrawType, id, color, center, rotation, scaleX, scaleY) {
        if (center === void 0) { center = new Vertex_1.default(0, 0); }
        if (rotation === void 0) { rotation = 0; }
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        this.translation = [0, 0];
        this.angleInRadians = 0;
        this.scale = [1, 1];
        this.pointList = [];
        this.glDrawType = glDrawType;
        this.id = id;
        this.color = color;
        this.center = center;
        this.rotation = rotation;
        this.scaleX = scaleX;
        this.scaleY = scaleY;
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
            var rect = _this.canvasElmt.getBoundingClientRect();
            var scaleX = _this.canvasElmt.width / rect.width;
            var scaleY = _this.canvasElmt.height / rect.height;
            var correctX = (e.clientX - rect.left) * scaleX;
            var correctY = (e.clientY - rect.top) * scaleY;
            console.log(canvasElmt.width, canvasElmt.height);
            console.log(canvasElmt.getBoundingClientRect().width, canvasElmt.getBoundingClientRect().height);
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
                var rect = _this.canvasElmt.getBoundingClientRect();
                var scaleX = _this.canvasElmt.width / rect.width;
                var scaleY = _this.canvasElmt.height / rect.height;
                var correctX = (e.clientX - rect.left) * scaleX;
                var correctY = (e.clientY - rect.top) * scaleY;
                console.log("a ", _this.canvasElmt.width, _this.canvasElmt.height);
                console.log("b", _this.canvasElmt.getBoundingClientRect().width, _this.canvasElmt.getBoundingClientRect().height);
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
            var rectangle = new Rectangle_1.default(id, black, this.origin.x, this.origin.y, this.origin.x, y, x, this.origin.y, x, y, 0, 1, 1);
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
var Vertex_1 = __importDefault(__webpack_require__(/*! ../../../Base/Vertex */ "./src/Base/Vertex.ts"));
var utils_1 = __webpack_require__(/*! ../../../utils */ "./src/utils.ts");
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
        // Rotation
        _this.lengthSlider = _this.createSlider('Length', function () { return rectangle.length; }, 1, appCanvas.width);
        _this.registerSlider(_this.lengthSlider, function (e) { _this.updateRotation(parseInt(_this.rotateSlider.value)); });
        // Rotation
        _this.rotateSlider = _this.createSlider('Rotation', _this.currentAngle.bind(_this), 0, 360);
        _this.registerSlider(_this.rotateSlider, function (e) { _this.updateRotation(parseInt(_this.rotateSlider.value)); });
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
    RectangleToolbarController.prototype.currentAngle = function () {
        return (0, utils_1.getAngle)(this.rectangle.pointList[0], this.rectangle.pointList[1]);
    };
    RectangleToolbarController.prototype.updateRotation = function (newRot) {
        var angleInRadians = (0, utils_1.degToRad)(newRot);
        var rotationDifference = angleInRadians - this.rectangle.angleInRadians;
        var matrix = utils_1.m3.identity();
        matrix = utils_1.m3.translate(matrix, -this.rectangle.center.x, -this.rectangle.center.y);
        matrix = utils_1.m3.rotate(matrix, rotationDifference);
        matrix = utils_1.m3.translate(matrix, this.rectangle.center.x, this.rectangle.center.y);
        this.rectangle.angleInRadians = angleInRadians;
        this.recalculateCenter();
        this.applyTransformationMatrixToRectangle(matrix);
        // this.updateShape(this.rectangle);
        // this.rectangle.setRotation(newRot);
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.updateLength = function (newLength) {
        var currentLength = this.rectangle.length;
        var scaleFactor = newLength / currentLength;
        var currentScaleX = 1;
        var newScaleY = scaleFactor;
        var matrix = utils_1.m3.identity();
        matrix = utils_1.m3.translate(matrix, -this.rectangle.center.x, -this.rectangle.center.y);
        matrix = utils_1.m3.scale(matrix, currentScaleX, newScaleY);
        matrix = utils_1.m3.translate(matrix, this.rectangle.center.x, this.rectangle.center.y);
        this.applyTransformationMatrixToRectangle(matrix);
        this.updateShape(this.rectangle);
    };
    RectangleToolbarController.prototype.applyTransformationMatrixToRectangle = function (matrix) {
        this.rectangle.pointList = this.rectangle.pointList.map(function (vertex) {
            var vertexHomogeneous = [vertex.x, vertex.y, 1];
            var transformedVertex = [
                matrix[0] * vertexHomogeneous[0] + matrix[3] * vertexHomogeneous[1] + matrix[6] * vertexHomogeneous[2],
                matrix[1] * vertexHomogeneous[0] + matrix[4] * vertexHomogeneous[1] + matrix[7] * vertexHomogeneous[2],
                matrix[2] * vertexHomogeneous[0] + matrix[5] * vertexHomogeneous[1] + matrix[8] * vertexHomogeneous[2]
            ];
            return new Vertex_1.default(transformedVertex[0], transformedVertex[1]);
        });
        this.recalculateRectangleProperties();
    };
    RectangleToolbarController.prototype.recalculateRectangleProperties = function () {
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
    function Line(id, color, startX, startY, endX, endY, rotation, scaleX, scaleY) {
        if (rotation === void 0) { rotation = 0; }
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        var _this = this;
        var centerX = (startX + endX) / 2;
        var centerY = (startY + endY) / 2;
        var center = new Vertex_1.default(centerX, centerY);
        _this = _super.call(this, 1, id, color, center, rotation, scaleX, scaleY) || this;
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
var utils_1 = __webpack_require__(/*! ../utils */ "./src/utils.ts");
var Rectangle = /** @class */ (function (_super) {
    __extends(Rectangle, _super);
    function Rectangle(id, color, x1, y1, x2, y2, x3, y3, x4, y4, angleInRadians, scaleX, scaleY) {
        if (scaleX === void 0) { scaleX = 1; }
        if (scaleY === void 0) { scaleY = 1; }
        var _this = _super.call(this, 5, id, color) || this;
        _this.angleInRadians = angleInRadians;
        _this.scale = [scaleX, scaleY];
        _this.length = x2 - x1;
        _this.width = x3 - x2;
        var centerX = (x1 + x4) / 2;
        var centerY = (y1 + y4) / 2;
        var center = new Vertex_1.default(centerX, centerY);
        _this.center = center;
        _this.pointList.push(new Vertex_1.default(x1, y1), new Vertex_1.default(x2, y2), new Vertex_1.default(x3, y3), new Vertex_1.default(x4, y4));
        console.log("point 1: ".concat(x1, ", ").concat(y1));
        console.log("point 2: ".concat(x2, ", ").concat(y2));
        console.log("point 3: ".concat(x3, ", ").concat(y3));
        console.log("point 3: ".concat(x4, ", ").concat(y4));
        console.log("center: ".concat(center.x, ", ").concat(center.y));
        return _this;
    }
    Rectangle.prototype.setTranslation = function (x, y) {
        this.translation = [x, y];
    };
    Rectangle.prototype.setRotation = function (angleInDegrees) {
        var _this = this;
        var angleInRadians = (0, utils_1.degToRad)(angleInDegrees);
        var rotationDifference = angleInRadians - this.angleInRadians;
        this.angleInRadians = angleInRadians;
        this.pointList = this.pointList.map(function (vertex) {
            var x = vertex.x - _this.center.x;
            var y = vertex.y - _this.center.y;
            var rotatedX = x * Math.cos(rotationDifference) - y * Math.sin(rotationDifference);
            var rotatedY = x * Math.sin(rotationDifference) + y * Math.cos(rotationDifference);
            x = rotatedX + _this.center.x;
            y = rotatedY + _this.center.y;
            return new Vertex_1.default(x, y);
        });
    };
    Rectangle.prototype.setScale = function (scaleX, scaleY) {
        this.scale = [scaleX, scaleY];
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
        var center = new Vertex_1.default(centerX, centerY);
        _this = _super.call(this, 6, id, color, center, rotation, scaleX, scaleY) || this;
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
    var gl = initRet.gl, program = initRet.program, colorBuffer = initRet.colorBuffer, positionBuffer = initRet.positionBuffer;
    var appCanvas = new AppCanvas_1.default(gl, program, positionBuffer, colorBuffer);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QztJQUVELE9BQU8sRUFBRSxVQUFTLEVBQVcsRUFBRSxFQUFXO1FBQ3hDLE9BQU87WUFDTCxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDUixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDUixDQUFDO0lBQ0osQ0FBQztJQUVELFFBQVEsRUFBRSxVQUFTLENBQVksRUFBRSxDQUFZO1FBQzNDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE9BQU87WUFDTCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELFNBQVMsRUFBRSxVQUFTLENBQVksRUFBRSxFQUFTLEVBQUUsRUFBUztRQUNwRCxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVELE1BQU0sRUFBRSxVQUFTLENBQVUsRUFBRSxjQUFxQjtRQUNoRCxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQsS0FBSyxFQUFFLFVBQVMsQ0FBVSxFQUFFLEVBQVMsRUFBRSxFQUFTO1FBQzlDLE9BQU8sVUFBRSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEVBQUUsVUFBRSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUM1QyxDQUFDO0NBQ0YsQ0FBQzs7Ozs7OztVQ3JHSjtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0FwcENhbnZhcy50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9CYXNlU2hhcGUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQ29sb3IudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvVmVydGV4LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9MaW5lTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9SZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL1NxdWFyZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9MaW5lVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvU2hhcGVUb29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9Ub29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL0xpbmUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9SZWN0YW5nbGUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9TcXVhcmUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL2luZGV4LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9pbml0LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy91dGlscy50cyIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9CYXNlL0Jhc2VTaGFwZSc7XG5pbXBvcnQgeyBtMyB9IGZyb20gJy4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBcHBDYW52YXMge1xuICAgIHByaXZhdGUgcHJvZ3JhbTogV2ViR0xQcm9ncmFtO1xuICAgIHByaXZhdGUgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dDtcbiAgICBwcml2YXRlIHBvc2l0aW9uQnVmZmVyOiBXZWJHTEJ1ZmZlcjtcbiAgICBwcml2YXRlIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcjtcbiAgICBwcml2YXRlIF91cGRhdGVUb29sYmFyOiAoKCkgPT4gdm9pZCkgfCBudWxsID0gbnVsbDtcblxuICAgIHByaXZhdGUgX3NoYXBlczogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPiA9IHt9O1xuXG4gICAgd2lkdGg6IG51bWJlcjtcbiAgICBoZWlnaHQ6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKFxuICAgICAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxuICAgICAgICBwcm9ncmFtOiBXZWJHTFByb2dyYW0sXG4gICAgICAgIHBvc2l0aW9uQnVmZmVyOiBXZWJHTEJ1ZmZlcixcbiAgICAgICAgY29sb3JCdWZmZXI6IFdlYkdMQnVmZmVyXG4gICAgKSB7XG4gICAgICAgIHRoaXMuZ2wgPSBnbDtcbiAgICAgICAgdGhpcy5wb3NpdGlvbkJ1ZmZlciA9IHBvc2l0aW9uQnVmZmVyO1xuICAgICAgICB0aGlzLmNvbG9yQnVmZmVyID0gY29sb3JCdWZmZXI7XG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHByb2dyYW07XG5cbiAgICAgICAgdGhpcy53aWR0aCA9IGdsLmNhbnZhcy53aWR0aDtcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBnbC5jYW52YXMuaGVpZ2h0O1xuXG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW5kZXIoKSB7XG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcbiAgICAgICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSB0aGlzLnBvc2l0aW9uQnVmZmVyO1xuICAgICAgICBjb25zdCBjb2xvckJ1ZmZlciA9IHRoaXMuY29sb3JCdWZmZXI7XG5cbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHsgdHJhbnNsYXRpb24sIGFuZ2xlSW5SYWRpYW5zLCBzY2FsZSB9ID0gc2hhcGU7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBzaGFwZS5wb2ludExpc3QuZmxhdE1hcCgocG9pbnQpID0+IFtcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnksXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgY29uc3QgYmFzZUNvbG9yVmVjdCA9IFtzaGFwZS5jb2xvci5yLCBzaGFwZS5jb2xvci5nLCBzaGFwZS5jb2xvci5iXTtcbiAgICAgICAgICAgIGxldCBjb2xvcnM6IG51bWJlcltdID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYXBlLnBvaW50TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbG9ycyA9IGNvbG9ycy5jb25jYXQoYmFzZUNvbG9yVmVjdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEJpbmQgY29sb3IgZGF0YVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSxcbiAgICAgICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gQmluZCBwb3NpdGlvbiBkYXRhXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShcbiAgICAgICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxuICAgICAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBpZiAoISh0aGlzLnBvc2l0aW9uQnVmZmVyIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9zaXRpb24gYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiAoISh0aGlzLmNvbG9yQnVmZmVyIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ29sb3IgYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsZXQgbWF0cml4ID0gbTMuaWRlbnRpdHkoKTtcbiAgICAgICAgICAgIG1hdHJpeCA9IG0zLm11bHRpcGx5KG1hdHJpeCwgbTMudHJhbnNsYXRpb24odHJhbnNsYXRpb25bMF0sIHRyYW5zbGF0aW9uWzFdKSk7XG4gICAgICAgICAgICBtYXRyaXggPSBtMy5tdWx0aXBseShtYXRyaXgsIG0zLnJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSk7XG4gICAgICAgICAgICBtYXRyaXggPSBtMy5tdWx0aXBseShtYXRyaXgsIG0zLnNjYWxpbmcoc2NhbGVbMF0sIHNjYWxlWzFdKSk7XG5cbiAgICAgICAgICAgIGNvbnN0IG1hdHJpeExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X21hdHJpeFwiKTtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1hdHJpeExvY2F0aW9uKVxuICAgICAgICAgICAgZ2wudW5pZm9ybU1hdHJpeDNmdihtYXRyaXhMb2NhdGlvbiwgZmFsc2UsIG1hdHJpeCk7XG5cbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoc2hhcGUuZ2xEcmF3VHlwZSwgMCwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aCk7XG5cblxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHNoYXBlcygpOiBSZWNvcmQ8c3RyaW5nLCBCYXNlU2hhcGU+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlcztcbiAgICB9XG5cbiAgICBwcml2YXRlIHNldCBzaGFwZXModjogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPikge1xuICAgICAgICB0aGlzLl9zaGFwZXMgPSB2O1xuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgICAgICBpZiAodGhpcy5fdXBkYXRlVG9vbGJhcilcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xiYXIuY2FsbCh0aGlzKTtcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHVwZGF0ZVRvb2xiYXIodiA6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5fdXBkYXRlVG9vbGJhciA9IHY7XG4gICAgfVxuXG4gICAgcHVibGljIGdlbmVyYXRlSWRGcm9tVGFnKHRhZzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHdpdGhTYW1lVGFnID0gT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmZpbHRlcigoaWQpID0+IGlkLnN0YXJ0c1dpdGgodGFnICsgJy0nKSk7XG4gICAgICAgIHJldHVybiBgJHt0YWd9LSR7d2l0aFNhbWVUYWcubGVuZ3RoICsgMX1gXG4gICAgfVxuXG4gICAgcHVibGljIGFkZFNoYXBlKHNoYXBlOiBCYXNlU2hhcGUpIHtcbiAgICAgICAgaWYgKE9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhzaGFwZS5pZCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NoYXBlIElEIGFscmVhZHkgdXNlZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xuICAgICAgICBuZXdTaGFwZXNbc2hhcGUuaWRdID0gc2hhcGU7XG4gICAgICAgIHRoaXMuc2hhcGVzID0gbmV3U2hhcGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBlZGl0U2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKS5pbmNsdWRlcyhuZXdTaGFwZS5pZCkpIHtcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NoYXBlIElEIG5vdCBmb3VuZCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xuICAgICAgICBuZXdTaGFwZXNbbmV3U2hhcGUuaWRdID0gbmV3U2hhcGU7XG4gICAgICAgIHRoaXMuc2hhcGVzID0gbmV3U2hhcGVzO1xuICAgIH1cblxuICAgIHB1YmxpYyBkZWxldGVTaGFwZShuZXdTaGFwZTogQmFzZVNoYXBlKSB7XG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKG5ld1NoYXBlLmlkKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgbm90IGZvdW5kJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTaGFwZXMgPSB7IC4uLnRoaXMuc2hhcGVzIH07XG4gICAgICAgIGRlbGV0ZSBuZXdTaGFwZXNbbmV3U2hhcGUuaWRdO1xuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcbiAgICB9XG59XG4iLCJpbXBvcnQgQ29sb3IgZnJvbSBcIi4vQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4vVmVydGV4XCI7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEJhc2VTaGFwZSB7XG4gICAgdHJhbnNsYXRpb246IFtudW1iZXIsIG51bWJlcl0gPSBbMCwgMF07XG4gICAgYW5nbGVJblJhZGlhbnM6IG51bWJlciA9IDA7XG4gICAgc2NhbGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMSwgMV07XG5cbiAgICBwb2ludExpc3Q6IFZlcnRleFtdID0gW107XG4gICAgaWQ6IHN0cmluZztcbiAgICBjb2xvcjogQ29sb3I7XG4gICAgZ2xEcmF3VHlwZTogbnVtYmVyO1xuICAgIGNlbnRlcjogVmVydGV4O1xuICAgIHJvdGF0aW9uOiBudW1iZXI7XG4gICAgc2NhbGVYOiBudW1iZXI7XG4gICAgc2NhbGVZOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihnbERyYXdUeXBlOiBudW1iZXIsIGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgY2VudGVyOiBWZXJ0ZXggPSBuZXcgVmVydGV4KDAsIDApLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcbiAgICAgICAgdGhpcy5nbERyYXdUeXBlID0gZ2xEcmF3VHlwZTtcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgICAgICB0aGlzLmNvbG9yID0gY29sb3I7XG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xuICAgICAgICB0aGlzLnJvdGF0aW9uID0gcm90YXRpb247XG4gICAgICAgIHRoaXMuc2NhbGVYID0gc2NhbGVYO1xuICAgICAgICB0aGlzLnNjYWxlWSA9IHNjYWxlWTtcbiAgICB9XG59IiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3Ige1xuICAgIHI6IG51bWJlcjtcbiAgICBnOiBudW1iZXI7XG4gICAgYjogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xuICAgICAgICB0aGlzLnIgPSByO1xuICAgICAgICB0aGlzLmcgPSBnO1xuICAgICAgICB0aGlzLmIgPSBiO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlcnRleCB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbiAgICBjb25zdHJ1Y3Rvcih4OiBudW1iZXIsIHk6IG51bWJlcikge1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICB0aGlzLnkgPSB5O1xuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlL0lTaGFwZU1ha2VyQ29udHJvbGxlcic7XG5pbXBvcnQgTGluZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0xpbmVNYWtlckNvbnRyb2xsZXInO1xuaW1wb3J0IFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1JlY3RhbmdsZU1ha2VyQ29udHJvbGxlcic7XG5pbXBvcnQgU3F1YXJlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvU3F1YXJlTWFrZXJDb250cm9sbGVyJztcblxuZW51bSBBVkFJTF9TSEFQRVMge1xuICAgIExpbmUgPSBcIkxpbmVcIixcbiAgICBSZWN0YW5nbGUgPSBcIlJlY3RhbmdsZVwiLFxuICAgIFNxdWFyZSA9IFwiU3F1YXJlXCJcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBfc2hhcGVDb250cm9sbGVyOiBJU2hhcGVNYWtlckNvbnRyb2xsZXI7XG4gICAgcHJpdmF0ZSBjYW52YXNFbG10OiBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBwcml2YXRlIGJ1dHRvbkNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcblxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuXG4gICAgICAgIGNvbnN0IGNhbnZhc0VsbXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgICBjb25zdCBidXR0b25Db250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICdzaGFwZS1idXR0b24tY29udGFpbmVyJ1xuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdCA9IGNhbnZhc0VsbXQ7XG4gICAgICAgIHRoaXMuYnV0dG9uQ29udGFpbmVyID0gYnV0dG9uQ29udGFpbmVyO1xuXG4gICAgICAgIHRoaXMuX3NoYXBlQ29udHJvbGxlciA9IG5ldyBMaW5lTWFrZXJDb250cm9sbGVyKGFwcENhbnZhcyk7XG5cbiAgICAgICAgdGhpcy5jYW52YXNFbG10Lm9uY2xpY2sgPSAoZSkgPT4ge1xuICAgICAgICAgICAgY29uc3QgcmVjdCA9IHRoaXMuY2FudmFzRWxtdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlWCA9IHRoaXMuY2FudmFzRWxtdC53aWR0aCAvIHJlY3Qud2lkdGg7XG4gICAgICAgICAgICBjb25zdCBzY2FsZVkgPSB0aGlzLmNhbnZhc0VsbXQuaGVpZ2h0IC8gcmVjdC5oZWlnaHQ7XG5cbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RYID0gKGUuY2xpZW50WCAtIHJlY3QubGVmdCkgKiBzY2FsZVg7XG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WSA9IChlLmNsaWVudFkgLSByZWN0LnRvcCkgKiBzY2FsZVk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYW52YXNFbG10LndpZHRoLCBjYW52YXNFbG10LmhlaWdodCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhjYW52YXNFbG10LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLCBjYW52YXNFbG10LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLmhlaWdodCk7XG4gICAgICAgICBcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhjb3JyZWN0WCwgY29ycmVjdFkpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHByaXZhdGUgZ2V0IHNoYXBlQ29udHJvbGxlcigpOiBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVDb250cm9sbGVyO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0IHNoYXBlQ29udHJvbGxlcih2OiBJU2hhcGVNYWtlckNvbnRyb2xsZXIpIHtcbiAgICAgICAgdGhpcy5fc2hhcGVDb250cm9sbGVyID0gdjtcblxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCByZWN0ID0gdGhpcy5jYW52YXNFbG10LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgY29uc3Qgc2NhbGVYID0gdGhpcy5jYW52YXNFbG10LndpZHRoIC8gcmVjdC53aWR0aDtcbiAgICAgICAgICAgIGNvbnN0IHNjYWxlWSA9IHRoaXMuY2FudmFzRWxtdC5oZWlnaHQgLyByZWN0LmhlaWdodDtcblxuICAgICAgICAgICAgY29uc3QgY29ycmVjdFggPSAoZS5jbGllbnRYIC0gcmVjdC5sZWZ0KSAqIHNjYWxlWDsgXG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WSA9IChlLmNsaWVudFkgLSByZWN0LnRvcCkgKiBzY2FsZVk7XG5cblxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJhIFwiLCB0aGlzLmNhbnZhc0VsbXQud2lkdGgsIHRoaXMuY2FudmFzRWxtdC5oZWlnaHQpO1xuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImJcIiwgdGhpcy5jYW52YXNFbG10LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpLndpZHRoLCB0aGlzLmNhbnZhc0VsbXQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkuaGVpZ2h0KTtcblxuICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXI/LmhhbmRsZUNsaWNrKGNvcnJlY3RYLCBjb3JyZWN0WSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgaW5pdENvbnRyb2xsZXIoc2hhcGVTdHI6IEFWQUlMX1NIQVBFUyk6IElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgICAgIHN3aXRjaCAoc2hhcGVTdHIpIHtcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLkxpbmU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5lTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLlJlY3RhbmdsZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5TcXVhcmU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBTcXVhcmVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xuICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBzaGFwZSBzdHJpbmcnKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHN0YXJ0KCkge1xuICAgICAgICBmb3IgKGNvbnN0IHNoYXBlU3RyIGluIEFWQUlMX1NIQVBFUykge1xuICAgICAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJyk7XG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2hhcGUtYnV0dG9uJyk7XG4gICAgICAgICAgICBidXR0b24udGV4dENvbnRlbnQgPSBzaGFwZVN0cjtcbiAgICAgICAgICAgIGJ1dHRvbi5vbmNsaWNrID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyID0gdGhpcy5pbml0Q29udHJvbGxlcihzaGFwZVN0ciBhcyBBVkFJTF9TSEFQRVMpO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XG4gICAgICAgIH1cbiAgICB9XG5cbn1cbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgTGluZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL0xpbmVcIjtcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gXCIuL0lTaGFwZU1ha2VyQ29udHJvbGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0ge3gsIHl9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmVkID0gbmV3IENvbG9yKDEsIDAsIDApO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygnbGluZScpO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IG5ldyBMaW5lKGlkLCByZWQsIHRoaXMub3JpZ2luLngsIHRoaXMub3JpZ2luLnksIHgsIHkpO1xuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGVcIjtcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gXCIuL0lTaGFwZU1ha2VyQ29udHJvbGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XG4gICAgcHJpdmF0ZSBvcmlnaW46IHt4OiBudW1iZXIsIHk6IG51bWJlcn0gfCBudWxsID0gbnVsbDtcblxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xuICAgIH1cblxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLm9yaWdpbiA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zdCBibGFjayA9IG5ldyBDb2xvcigwLCAwLCAwKTtcbiAgICAgICAgICAgIGNvbnN0IGlkID0gdGhpcy5hcHBDYW52YXMuZ2VuZXJhdGVJZEZyb21UYWcoJ3JlY3RhbmdsZScpO1xuICAgICAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZShcbiAgICAgICAgICAgICAgICBpZCwgYmxhY2ssIHRoaXMub3JpZ2luLngsIHRoaXMub3JpZ2luLnksdGhpcy5vcmlnaW4ueCwgeSwgeCwgdGhpcy5vcmlnaW4ueSwgeCwgeSwwLDEsMSk7XG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZShyZWN0YW5nbGUpO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgU3F1YXJlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvU3F1YXJlXCI7XG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9JU2hhcGVNYWtlckNvbnRyb2xsZXJcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0ge3gsIHl9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgYmxhY2sgPSBuZXcgQ29sb3IoMCwgMCwgMCk7XG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdzcXVhcmUnKTtcblxuICAgICAgICAgICAgY29uc3QgdjEgPSB7eDogeCwgeTogeX07XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjF4OiAke3YxLnh9LCB2MXk6ICR7djEueX1gKVxuXG4gICAgICAgICAgICBjb25zdCB2MiA9IHt4OiB0aGlzLm9yaWdpbi54IC0gKHkgLSB0aGlzLm9yaWdpbi55KSwgXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSArICh4LXRoaXMub3JpZ2luLngpfVxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYHYyeDogJHt2Mi54fSwgdjJ5OiAke3YyLnl9YClcblxuICAgICAgICAgICAgY29uc3QgdjMgPSB7eDogMip0aGlzLm9yaWdpbi54IC0geCwgXG4gICAgICAgICAgICAgICAgeTogMip0aGlzLm9yaWdpbi55IC0geX1cbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGB2M3g6ICR7djMueH0sIHYzeTogJHt2My55fWApXG5cbiAgICAgICAgICAgIGNvbnN0IHY0ID0ge3g6IHRoaXMub3JpZ2luLnggKyAoeSAtIHRoaXMub3JpZ2luLnkpLCBcbiAgICAgICAgICAgICAgICB5OiB0aGlzLm9yaWdpbi55IC0gKHgtdGhpcy5vcmlnaW4ueCl9XG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjR4OiAke3Y0Lnh9LCB2NHk6ICR7djQueX1gKVxuXG4gICAgICAgICAgICBjb25zdCBzcXVhcmUgPSBuZXcgU3F1YXJlKFxuICAgICAgICAgICAgICAgIGlkLCBibGFjaywgdjEueCwgdjEueSwgdjIueCwgdjIueSwgdjMueCwgdjMueSwgdjQueCwgdjQueSk7XG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZShzcXVhcmUpO1xuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9MaW5lJztcbmltcG9ydCB7IGRlZ1RvUmFkLCBldWNsaWRlYW5EaXN0YW5jZVZ0eCwgZ2V0QW5nbGUgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XG5pbXBvcnQgU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGxlbmd0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcblxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XG5cbiAgICBwcml2YXRlIGxpbmU6IExpbmU7XG5cbiAgICBjb25zdHJ1Y3RvcihsaW5lOiBMaW5lLCBhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICBzdXBlcihsaW5lLCBhcHBDYW52YXMpO1xuXG4gICAgICAgIHRoaXMubGluZSA9IGxpbmU7XG5cbiAgICAgICAgY29uc3QgZGlhZ29uYWwgPSBNYXRoLnNxcnQoXG4gICAgICAgICAgICBhcHBDYW52YXMud2lkdGggKiBhcHBDYW52YXMud2lkdGggK1xuICAgICAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHQgKiBhcHBDYW52YXMuaGVpZ2h0XG4gICAgICAgICk7XG4gICAgICAgIHRoaXMubGVuZ3RoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXG4gICAgICAgICAgICAnTGVuZ3RoJyxcbiAgICAgICAgICAgICgpID0+IGxpbmUubGVuZ3RoLFxuICAgICAgICAgICAgMSxcbiAgICAgICAgICAgIGRpYWdvbmFsXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5sZW5ndGhTbGlkZXIsIChlKSA9PiB7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcbiAgICAgICAgICAgICgpID0+IGxpbmUucG9pbnRMaXN0WzBdLngsXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXG4gICAgICAgICk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcbiAgICAgICAgICAgICdQb3NpdGlvbiBZJyxcbiAgICAgICAgICAgICgpID0+IGxpbmUucG9pbnRMaXN0WzBdLnksXG4gICAgICAgICAgICAxLFxuICAgICAgICAgICAgYXBwQ2FudmFzLmhlaWdodFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUm90YXRpb24nLCB0aGlzLmN1cnJlbnRBbmdsZS5iaW5kKHRoaXMpLCAwLCAzNjApO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbihwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZUxlbmd0aChuZXdMZW46IG51bWJlcikge1xuICAgICAgICBjb25zdCBsaW5lTGVuID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLFxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXVxuICAgICAgICApO1xuICAgICAgICBjb25zdCBjb3MgPVxuICAgICAgICAgICAgKHRoaXMubGluZS5wb2ludExpc3RbMV0ueCAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCkgLyBsaW5lTGVuO1xuICAgICAgICBjb25zdCBzaW4gPVxuICAgICAgICAgICAgKHRoaXMubGluZS5wb2ludExpc3RbMV0ueSAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSkgLyBsaW5lTGVuO1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggPSBuZXdMZW4gKiBjb3MgKyB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLng7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld0xlbiAqIHNpbiArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueTtcblxuICAgICAgICB0aGlzLmxpbmUubGVuZ3RoID0gbmV3TGVuO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGRpZmYgPSB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggLSB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLng7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueCA9IG5ld1Bvc1g7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9IG5ld1Bvc1ggKyBkaWZmO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NZKG5ld1Bvc1k6IG51bWJlcikge1xuICAgICAgICBjb25zdCBkaWZmID0gdGhpcy5saW5lLnBvaW50TGlzdFsxXS55IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS55O1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnkgPSBuZXdQb3NZO1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgPSBuZXdQb3NZICsgZGlmZjtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY3VycmVudEFuZ2xlKCkge1xuICAgICAgICByZXR1cm4gZ2V0QW5nbGUodGhpcy5saW5lLnBvaW50TGlzdFswXSwgdGhpcy5saW5lLnBvaW50TGlzdFsxXSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3Q6IG51bWJlcikge1xuICAgICAgICBjb25zdCByYWQgPSBkZWdUb1JhZChuZXdSb3QpO1xuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWQpO1xuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xuXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9XG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnggKyBjb3MgKiB0aGlzLmxpbmUubGVuZ3RoO1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgPVxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFswXS55IC0gc2luICogdGhpcy5saW5lLmxlbmd0aDtcblxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMubGluZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0W2lkeF0ueCA9IHg7XG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbaWR4XS55ID0geTtcblxuICAgICAgICB0aGlzLmxpbmUubGVuZ3RoID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgoXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLFxuICAgICAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFsxXVxuICAgICAgICApO1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgVmVydGV4IGZyb20gJy4uLy4uLy4uL0Jhc2UvVmVydGV4JztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlLCBtMyB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcbmltcG9ydCBTaGFwZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGVUb29sYmFyQ29udHJvbGxlcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcbiAgICAvLyBwcml2YXRlIHdpZHRoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgbGVuZ3RoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xuXG4gICAgcHJpdmF0ZSByZWN0YW5nbGU6IFJlY3RhbmdsZTtcblxuICAgIGNvbnN0cnVjdG9yKHJlY3RhbmdsZTogUmVjdGFuZ2xlLCBhcHBDYW52YXM6IEFwcENhbnZhcyl7XG4gICAgICAgIHN1cGVyKHJlY3RhbmdsZSwgYXBwQ2FudmFzKTtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUgPSByZWN0YW5nbGU7XG5cbiAgICAgICAgLy8gWCBQb3NpdGlvblxuICAgICAgICB0aGlzLnBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWCcsICgpID0+IHJlY3RhbmdsZS5jZW50ZXIueCwxLGFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgLy8gWSBQb3NpdGlvblxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWScsICgpID0+IHJlY3RhbmdsZS5jZW50ZXIueSwxLGFwcENhbnZhcy53aWR0aCk7XG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXG5cbiAgICAgICAgLy8gUm90YXRpb25cbiAgICAgICAgdGhpcy5sZW5ndGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignTGVuZ3RoJywgKCkgPT4gcmVjdGFuZ2xlLmxlbmd0aCwgMSwgYXBwQ2FudmFzLndpZHRoKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSl9KVxuXG4gICAgICAgIC8vIFJvdGF0aW9uXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgdGhpcy5jdXJyZW50QW5nbGUuYmluZCh0aGlzKSwgMCwgMzYwKTtcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSl9KVxuXG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVQb3NYKG5ld1Bvc1g6bnVtYmVyKXtcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1ggLSB0aGlzLnJlY3RhbmdsZS5jZW50ZXIueDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS54ICs9IGRpZmY7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZUNlbnRlcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTpudW1iZXIpe1xuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWSAtIHRoaXMucmVjdGFuZ2xlLmNlbnRlci55O1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnkgKz0gZGlmZjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlY2FsY3VsYXRlQ2VudGVyKCk7XG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xuICAgIH1cblxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZGlmZnkgPSB5IC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueTtcbiAgICAgICAgY29uc3QgZGlmZnggPSB4IC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueDtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgaWYgKGkgIT0gaWR4KSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnkgKz0gZGlmZnk7XG4gICAgICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnggKz0gZGlmZng7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS54ID0geDtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueSA9IHk7XG5cbiAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZUNlbnRlcigpO1xuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSByZWNhbGN1bGF0ZUNlbnRlcigpOiB2b2lkIHtcbiAgICAgICAgbGV0IHN1bVggPSAwLCBzdW1ZID0gMDtcbiAgICAgICAgY29uc3QgdmVydGljZXMgPSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3Q7XG4gICAgICAgIHZlcnRpY2VzLmZvckVhY2godmVydGV4ID0+IHtcbiAgICAgICAgICAgIHN1bVggKz0gdmVydGV4Lng7XG4gICAgICAgICAgICBzdW1ZICs9IHZlcnRleC55O1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuY2VudGVyLnggPSBzdW1YIC8gdmVydGljZXMubGVuZ3RoO1xuICAgICAgICB0aGlzLnJlY3RhbmdsZS5jZW50ZXIueSA9IHN1bVkgLyB2ZXJ0aWNlcy5sZW5ndGg7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjdXJyZW50QW5nbGUoKSB7XG4gICAgICAgIHJldHVybiBnZXRBbmdsZSh0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbMF0sIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFsxXSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3Q6IG51bWJlcil7XG4gICAgICAgIGNvbnN0IGFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQobmV3Um90KTtcbiAgICAgICAgY29uc3Qgcm90YXRpb25EaWZmZXJlbmNlID0gYW5nbGVJblJhZGlhbnMgLSB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucztcblxuICAgICAgICBsZXQgbWF0cml4ID0gbTMuaWRlbnRpdHkoKTtcbiAgICBcbiAgICAgICAgbWF0cml4ID0gbTMudHJhbnNsYXRlKG1hdHJpeCwgLXRoaXMucmVjdGFuZ2xlLmNlbnRlci54LCAtdGhpcy5yZWN0YW5nbGUuY2VudGVyLnkpO1xuICAgICAgICBtYXRyaXggPSBtMy5yb3RhdGUobWF0cml4LCByb3RhdGlvbkRpZmZlcmVuY2UpO1xuICAgICAgICBtYXRyaXggPSBtMy50cmFuc2xhdGUobWF0cml4LCB0aGlzLnJlY3RhbmdsZS5jZW50ZXIueCwgdGhpcy5yZWN0YW5nbGUuY2VudGVyLnkpO1xuXG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLmFuZ2xlSW5SYWRpYW5zID0gYW5nbGVJblJhZGlhbnM7XG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGVDZW50ZXIoKVxuICAgICAgICB0aGlzLmFwcGx5VHJhbnNmb3JtYXRpb25NYXRyaXhUb1JlY3RhbmdsZShtYXRyaXgpO1xuIFxuICAgICAgICAvLyB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcbiAgICAgICAgLy8gdGhpcy5yZWN0YW5nbGUuc2V0Um90YXRpb24obmV3Um90KTtcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB1cGRhdGVMZW5ndGgobmV3TGVuZ3RoOiBudW1iZXIpIHtcbiAgICAgICAgY29uc3QgY3VycmVudExlbmd0aCA9IHRoaXMucmVjdGFuZ2xlLmxlbmd0aDtcbiAgICAgICAgY29uc3Qgc2NhbGVGYWN0b3IgPSBuZXdMZW5ndGggLyBjdXJyZW50TGVuZ3RoO1xuICAgICAgICBjb25zdCBjdXJyZW50U2NhbGVYID0gMTtcbiAgICAgICAgY29uc3QgbmV3U2NhbGVZID0gc2NhbGVGYWN0b3I7XG4gICAgXG4gICAgICAgIGxldCBtYXRyaXggPSBtMy5pZGVudGl0eSgpO1xuICAgIFxuICAgICAgICBtYXRyaXggPSBtMy50cmFuc2xhdGUobWF0cml4LCAtdGhpcy5yZWN0YW5nbGUuY2VudGVyLngsIC10aGlzLnJlY3RhbmdsZS5jZW50ZXIueSk7XG4gICAgICAgIG1hdHJpeCA9IG0zLnNjYWxlKG1hdHJpeCwgY3VycmVudFNjYWxlWCwgbmV3U2NhbGVZKTtcbiAgICAgICAgbWF0cml4ID0gbTMudHJhbnNsYXRlKG1hdHJpeCwgdGhpcy5yZWN0YW5nbGUuY2VudGVyLngsIHRoaXMucmVjdGFuZ2xlLmNlbnRlci55KTtcbiAgICBcbiAgICAgICAgdGhpcy5hcHBseVRyYW5zZm9ybWF0aW9uTWF0cml4VG9SZWN0YW5nbGUobWF0cml4KTtcbiBcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhcHBseVRyYW5zZm9ybWF0aW9uTWF0cml4VG9SZWN0YW5nbGUobWF0cml4OiBudW1iZXJbXSkge1xuICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3QgPSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3QubWFwKHZlcnRleCA9PiB7XG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhIb21vZ2VuZW91cyA9IFt2ZXJ0ZXgueCwgdmVydGV4LnksIDFdO1xuICAgIFxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRWZXJ0ZXggPSBbXG4gICAgICAgICAgICAgICAgbWF0cml4WzBdICogdmVydGV4SG9tb2dlbmVvdXNbMF0gKyBtYXRyaXhbM10gKiB2ZXJ0ZXhIb21vZ2VuZW91c1sxXSArIG1hdHJpeFs2XSAqIHZlcnRleEhvbW9nZW5lb3VzWzJdLFxuICAgICAgICAgICAgICAgIG1hdHJpeFsxXSAqIHZlcnRleEhvbW9nZW5lb3VzWzBdICsgbWF0cml4WzRdICogdmVydGV4SG9tb2dlbmVvdXNbMV0gKyBtYXRyaXhbN10gKiB2ZXJ0ZXhIb21vZ2VuZW91c1syXSxcbiAgICAgICAgICAgICAgICBtYXRyaXhbMl0gKiB2ZXJ0ZXhIb21vZ2VuZW91c1swXSArIG1hdHJpeFs1XSAqIHZlcnRleEhvbW9nZW5lb3VzWzFdICsgbWF0cml4WzhdICogdmVydGV4SG9tb2dlbmVvdXNbMl1cbiAgICAgICAgICAgIF07XG4gICAgICAgICAgICByZXR1cm4gbmV3IFZlcnRleCh0cmFuc2Zvcm1lZFZlcnRleFswXSwgdHJhbnNmb3JtZWRWZXJ0ZXhbMV0pO1xuICAgICAgICB9KTtcbiAgICAgICAgdGhpcy5yZWNhbGN1bGF0ZVJlY3RhbmdsZVByb3BlcnRpZXMoKTtcbiAgICB9XG4gICAgXG4gICAgcHJpdmF0ZSByZWNhbGN1bGF0ZVJlY3RhbmdsZVByb3BlcnRpZXMoKSB7XG5cbiAgICB9XG4gICAgXG5cbiAgICBcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XG5pbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uLy4uLy4uL0Jhc2UvQmFzZVNoYXBlJztcblxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIHNoYXBlOiBCYXNlU2hhcGU7XG5cbiAgICBwcml2YXRlIHRvb2xiYXJDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgdmVydGV4Q29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcblxuICAgIHByaXZhdGUgdmVydGV4UGlja2VyOiBIVE1MU2VsZWN0RWxlbWVudDtcbiAgICBwcml2YXRlIHNlbGVjdGVkVmVydGV4ID0gJzAnO1xuXG4gICAgcHJpdmF0ZSB2dHhQb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XG4gICAgcHJpdmF0ZSB2dHhQb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XG5cbiAgICBwcml2YXRlIHNsaWRlckxpc3Q6IEhUTUxJbnB1dEVsZW1lbnRbXSA9IFtdO1xuICAgIHByaXZhdGUgZ2V0dGVyTGlzdDogKCgpID0+IG51bWJlcilbXSA9IFtdO1xuXG4gICAgY29uc3RydWN0b3Ioc2hhcGU6IEJhc2VTaGFwZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5zaGFwZSA9IHNoYXBlO1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcblxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICd0b29sYmFyLWNvbnRhaW5lcidcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxuICAgICAgICAgICAgJ3ZlcnRleC1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcbiAgICAgICAgICAgICd2ZXJ0ZXgtcGlja2VyJ1xuICAgICAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xuXG4gICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcbiAgICB9XG5cbiAgICBjcmVhdGVTbGlkZXIoXG4gICAgICAgIGxhYmVsOiBzdHJpbmcsXG4gICAgICAgIHZhbHVlR2V0dGVyOiAoKSA9PiBudW1iZXIsXG4gICAgICAgIG1pbjogbnVtYmVyLFxuICAgICAgICBtYXg6IG51bWJlclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XG5cbiAgICAgICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcbiAgICAgICAgc2xpZGVyLm1heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgICBzbGlkZXIudmFsdWUgPSB2YWx1ZUdldHRlci50b1N0cmluZygpO1xuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcblxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcblxuICAgICAgICB0aGlzLnNsaWRlckxpc3QucHVzaChzbGlkZXIpO1xuICAgICAgICB0aGlzLmdldHRlckxpc3QucHVzaCh2YWx1ZUdldHRlcik7XG5cbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcbiAgICB9XG5cbiAgICByZWdpc3RlclNsaWRlcihzbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQsIGNiOiAoZTogRXZlbnQpID0+IGFueSkge1xuICAgICAgICBjb25zdCBuZXdDYiA9IChlOiBFdmVudCkgPT4ge1xuICAgICAgICAgICAgY2IoZSk7XG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNsaWRlcnMoc2xpZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBzbGlkZXIub25jaGFuZ2UgPSBuZXdDYjtcbiAgICAgICAgc2xpZGVyLm9uaW5wdXQgPSBuZXdDYjtcbiAgICB9XG5cbiAgICB1cGRhdGVTaGFwZShuZXdTaGFwZTogQmFzZVNoYXBlKSB7XG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZShuZXdTaGFwZSk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2xpZGVycyhpZ25vcmVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQpIHtcbiAgICAgICAgdGhpcy5zbGlkZXJMaXN0LmZvckVhY2goKHNsaWRlciwgaWR4KSA9PiB7XG4gICAgICAgICAgICBpZiAoaWdub3JlU2xpZGVyID09PSBzbGlkZXIpIHJldHVybjtcbiAgICAgICAgICAgIHNsaWRlci52YWx1ZSA9ICgodGhpcy5nZXR0ZXJMaXN0W2lkeF0pKCkpLnRvU3RyaW5nKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICh0aGlzLnZ0eFBvc1hTbGlkZXIgJiYgdGhpcy52dHhQb3NZU2xpZGVyKSB7XG4gICAgICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludCh0aGlzLnZlcnRleFBpY2tlci52YWx1ZSlcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF07XG5cbiAgICAgICAgICAgIHRoaXMudnR4UG9zWFNsaWRlci52YWx1ZSA9IHZlcnRleC54LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIudmFsdWUgPSB2ZXJ0ZXgueS50b1N0cmluZygpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY3JlYXRlU2xpZGVyVmVydGV4KFxuICAgICAgICBsYWJlbDogc3RyaW5nLFxuICAgICAgICBjdXJyZW50TGVuZ3RoOiBudW1iZXIsXG4gICAgICAgIG1pbjogbnVtYmVyLFxuICAgICAgICBtYXg6IG51bWJlclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xuXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XG5cbiAgICAgICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcbiAgICAgICAgc2xpZGVyLm1heCA9IG1heC50b1N0cmluZygpO1xuICAgICAgICBzbGlkZXIudmFsdWUgPSBjdXJyZW50TGVuZ3RoLnRvU3RyaW5nKCk7XG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbGlkZXIpO1xuXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XG5cbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcbiAgICB9XG5cbiAgICBkcmF3VmVydGV4VG9vbGJhcigpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMudmVydGV4Q29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleENvbnRhaW5lci5maXJzdENoaWxkKTtcblxuICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludCh0aGlzLnZlcnRleFBpY2tlci52YWx1ZSlcbiAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy5zaGFwZS5wb2ludExpc3RbaWR4XTtcblxuICAgICAgICB0aGlzLnZ0eFBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcbiAgICAgICAgICAgICdQb3MgWCcsXG4gICAgICAgICAgICB2ZXJ0ZXgueCxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy53aWR0aFxuICAgICAgICApO1xuICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcbiAgICAgICAgICAgICdQb3MgWScsXG4gICAgICAgICAgICB2ZXJ0ZXgueSxcbiAgICAgICAgICAgIDAsXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5oZWlnaHRcbiAgICAgICAgKTtcblxuICAgICAgICBjb25zdCB1cGRhdGVTbGlkZXIgPSAoKSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy52dHhQb3NYU2xpZGVyICYmIHRoaXMudnR4UG9zWVNsaWRlcilcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVZlcnRleChpZHgsIHBhcnNlSW50KHRoaXMudnR4UG9zWFNsaWRlci52YWx1ZSksIHBhcnNlSW50KHRoaXMudnR4UG9zWVNsaWRlci52YWx1ZSkpO1xuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhQb3NYU2xpZGVyLCB1cGRhdGVTbGlkZXIpO1xuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4UG9zWVNsaWRlciwgdXBkYXRlU2xpZGVyKTtcbiAgICB9XG5cbiAgICBpbml0VmVydGV4VG9vbGJhcigpIHtcbiAgICAgICAgd2hpbGUgKHRoaXMudmVydGV4UGlja2VyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5yZW1vdmVDaGlsZCh0aGlzLnZlcnRleFBpY2tlci5maXJzdENoaWxkKTtcblxuICAgICAgICB0aGlzLnNoYXBlLnBvaW50TGlzdC5mb3JFYWNoKChfLCBpZHgpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaWR4LnRvU3RyaW5nKCk7XG4gICAgICAgICAgICBvcHRpb24ubGFiZWwgPSBgVmVydGV4ICR7aWR4fWA7XG4gICAgICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5hcHBlbmRDaGlsZChvcHRpb24pO1xuICAgICAgICB9KTtcblxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci52YWx1ZSA9IHRoaXMuc2VsZWN0ZWRWZXJ0ZXg7XG4gICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcblxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlci5vbmNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZDtcbn1cbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uL1NoYXBlcy9MaW5lJztcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XG5pbXBvcnQgTGluZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyJztcbmltcG9ydCBJU2hhcGVUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sYmFyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIHRvb2xiYXJDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgaXRlbVBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XG4gICAgcHJpdmF0ZSBzZWxlY3RlZElkOiBzdHJpbmcgPSAnJztcblxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRyb2xsZXI6IElTaGFwZVRvb2xiYXJDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICAgICAgdGhpcy5hcHBDYW52YXMudXBkYXRlVG9vbGJhciA9IHRoaXMudXBkYXRlU2hhcGVMaXN0LmJpbmQodGhpcyk7XG5cbiAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XG5cbiAgICAgICAgdGhpcy5pdGVtUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAndG9vbGJhci1pdGVtLXBpY2tlcidcbiAgICAgICAgKSBhcyBIVE1MU2VsZWN0RWxlbWVudDtcblxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIub25jaGFuZ2UgPSAoZSkgPT4ge1xuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZElkID0gdGhpcy5pdGVtUGlja2VyLnZhbHVlO1xuICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLmFwcENhbnZhcy5zaGFwZXNbdGhpcy5pdGVtUGlja2VyLnZhbHVlXTtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xuXG4gICAgICAgICAgICBpZiAoc2hhcGUgaW5zdGFuY2VvZiBMaW5lKSB7XG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBMaW5lVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgTGluZSwgYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUgaW5zdGFuY2VvZiBSZWN0YW5nbGUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFJlY3RhbmdsZSwgYXBwQ2FudmFzKVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGVMaXN0KCk7XG4gICAgfVxuXG4gICAgdXBkYXRlU2hhcGVMaXN0KCkge1xuICAgICAgICB3aGlsZSAodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLml0ZW1QaWNrZXIucmVtb3ZlQ2hpbGQodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgICAgICAgcGxhY2Vob2xkZXIudGV4dCA9ICdDaG9vc2UgYW4gb2JqZWN0JztcbiAgICAgICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnJztcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcblxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuYXBwQ2FudmFzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICAgICAgICBjaGlsZC50ZXh0ID0gc2hhcGUuaWQ7XG4gICAgICAgICAgICBjaGlsZC52YWx1ZSA9IHNoYXBlLmlkO1xuICAgICAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKGNoaWxkKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLnZhbHVlID0gdGhpcy5zZWxlY3RlZElkO1xuXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5hcHBDYW52YXMuc2hhcGVzKS5pbmNsdWRlcyh0aGlzLnNlbGVjdGVkSWQpKSB7XG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjbGVhclRvb2xiYXJFbG10KCkge1xuICAgICAgICB3aGlsZSAodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpXG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpO1xuICAgIH1cbn1cbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgICBsZW5ndGg6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBlbmRYOiBudW1iZXIsIGVuZFk6IG51bWJlciwgcm90YXRpb24gPSAwLCBzY2FsZVggPSAxLCBzY2FsZVkgPSAxKSB7XG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoc3RhcnRYICsgZW5kWCkgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHN0YXJ0WSArIGVuZFkpIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgc3VwZXIoMSwgaWQsIGNvbG9yLCBjZW50ZXIsIHJvdGF0aW9uLCBzY2FsZVgsIHNjYWxlWSk7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcmlnaW4gPSBuZXcgVmVydGV4KHN0YXJ0WCwgc3RhcnRZKTtcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IFZlcnRleChlbmRYLCBlbmRZKTtcblxuICAgICAgICB0aGlzLmxlbmd0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxuICAgICAgICAgICAgb3JpZ2luLFxuICAgICAgICAgICAgZW5kXG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaChvcmlnaW4sIGVuZCk7XG4gICAgfVxufSIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XG5pbXBvcnQgeyBkZWdUb1JhZCB9IGZyb20gXCIuLi91dGlsc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBCYXNlU2hhcGUge1xuICAgIGxlbmd0aDogbnVtYmVyO1xuICAgIHdpZHRoOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIHg0OiBudW1iZXIsIHk0OiBudW1iZXIsIGFuZ2xlSW5SYWRpYW5zOiBudW1iZXIsIHNjYWxlWDogbnVtYmVyID0gMSwgc2NhbGVZOiBudW1iZXIgPSAxKSB7XG4gICAgICAgIHN1cGVyKDUsIGlkLCBjb2xvcik7XG5cbiAgICAgICAgdGhpcy5hbmdsZUluUmFkaWFucyA9IGFuZ2xlSW5SYWRpYW5zO1xuICAgICAgICB0aGlzLnNjYWxlID0gW3NjYWxlWCwgc2NhbGVZXTtcbiAgICAgICAgdGhpcy5sZW5ndGggPSB4Mi14MTtcbiAgICAgICAgdGhpcy53aWR0aCA9IHgzLXgyO1xuXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoeDEgKyB4NCkgLyAyO1xuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHkxICsgeTQpIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZKTtcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaChuZXcgVmVydGV4KHgxLCB5MSksIG5ldyBWZXJ0ZXgoeDIsIHkyKSwgbmV3IFZlcnRleCh4MywgeTMpLCBuZXcgVmVydGV4KHg0LCB5NCkpO1xuXG4gICAgICAgIGNvbnNvbGUubG9nKGBwb2ludCAxOiAke3gxfSwgJHt5MX1gKTtcbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDI6ICR7eDJ9LCAke3kyfWApO1xuICAgICAgICBjb25zb2xlLmxvZyhgcG9pbnQgMzogJHt4M30sICR7eTN9YCk7XG4gICAgICAgIGNvbnNvbGUubG9nKGBwb2ludCAzOiAke3g0fSwgJHt5NH1gKTtcbiAgICAgICAgY29uc29sZS5sb2coYGNlbnRlcjogJHtjZW50ZXIueH0sICR7Y2VudGVyLnl9YCk7XG4gICAgfVxuXG4gICAgc2V0VHJhbnNsYXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy50cmFuc2xhdGlvbiA9IFt4LCB5XTtcbiAgICB9XG5cbiAgICBzZXRSb3RhdGlvbihhbmdsZUluRGVncmVlczogbnVtYmVyKSB7XG4gICAgICAgIGNvbnN0IGFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQoYW5nbGVJbkRlZ3JlZXMpO1xuXG4gICAgICAgIGNvbnN0IHJvdGF0aW9uRGlmZmVyZW5jZSA9IGFuZ2xlSW5SYWRpYW5zIC0gdGhpcy5hbmdsZUluUmFkaWFucztcblxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gYW5nbGVJblJhZGlhbnM7XG5cbiAgICAgICAgdGhpcy5wb2ludExpc3QgPSB0aGlzLnBvaW50TGlzdC5tYXAodmVydGV4ID0+IHtcbiAgICAgICAgICAgIGxldCB4ID0gdmVydGV4LnggLSB0aGlzLmNlbnRlci54O1xuICAgICAgICAgICAgbGV0IHkgPSB2ZXJ0ZXgueSAtIHRoaXMuY2VudGVyLnk7XG5cbiAgICAgICAgICAgIGNvbnN0IHJvdGF0ZWRYID0geCAqIE1hdGguY29zKHJvdGF0aW9uRGlmZmVyZW5jZSkgLSB5ICogTWF0aC5zaW4ocm90YXRpb25EaWZmZXJlbmNlKTtcbiAgICAgICAgICAgIGNvbnN0IHJvdGF0ZWRZID0geCAqIE1hdGguc2luKHJvdGF0aW9uRGlmZmVyZW5jZSkgKyB5ICogTWF0aC5jb3Mocm90YXRpb25EaWZmZXJlbmNlKTtcblxuICAgICAgICAgICAgeCA9IHJvdGF0ZWRYICsgdGhpcy5jZW50ZXIueDtcbiAgICAgICAgICAgIHkgPSByb3RhdGVkWSArIHRoaXMuY2VudGVyLnk7XG5cbiAgICAgICAgICAgIHJldHVybiBuZXcgVmVydGV4KHgsIHkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzZXRTY2FsZShzY2FsZVg6IG51bWJlciwgc2NhbGVZOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5zY2FsZSA9IFtzY2FsZVgsIHNjYWxlWV07XG4gICAgfVxufVxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIHg0OiBudW1iZXIsIHk0OiBudW1iZXIsIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xuICAgICAgICBjb25zdCBjZW50ZXJYID0gKHgxICsgeDMpIC8gMjtcbiAgICAgICAgY29uc3QgY2VudGVyWSA9ICh5MSArIHkzKSAvIDI7XG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZXJ0ZXgoY2VudGVyWCwgY2VudGVyWSk7XG4gICAgICAgIFxuICAgICAgICBzdXBlcig2LCBpZCwgY29sb3IsIGNlbnRlciwgcm90YXRpb24sIHNjYWxlWCwgc2NhbGVZKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHYxID0gbmV3IFZlcnRleCh4MSwgeTEpO1xuICAgICAgICBjb25zdCB2MiA9IG5ldyBWZXJ0ZXgoeDIsIHkyKTtcbiAgICAgICAgY29uc3QgdjMgPSBuZXcgVmVydGV4KHgzLCB5Myk7XG4gICAgICAgIGNvbnN0IHY0ID0gbmV3IFZlcnRleCh4NCwgeTQpO1xuXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godjEsIHYyLCB2MywgdjQpO1xuICAgIH1cbn1cbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi9BcHBDYW52YXMnO1xuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyJztcbmltcG9ydCBUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXInO1xuaW1wb3J0IGluaXQgZnJvbSAnLi9pbml0JztcblxuY29uc3QgbWFpbiA9ICgpID0+IHtcbiAgICBjb25zdCBpbml0UmV0ID0gaW5pdCgpO1xuICAgIGlmICghaW5pdFJldCkge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBXZWJHTCcpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgeyBnbCwgcHJvZ3JhbSwgY29sb3JCdWZmZXIsIHBvc2l0aW9uQnVmZmVyIH0gPSBpbml0UmV0O1xuXG4gICAgY29uc3QgYXBwQ2FudmFzID0gbmV3IEFwcENhbnZhcyhnbCwgcHJvZ3JhbSwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcbiAgICBcbiAgICBjb25zdCBjYW52YXNDb250cm9sbGVyID0gbmV3IENhbnZhc0NvbnRyb2xsZXIoYXBwQ2FudmFzKTtcbiAgICBjYW52YXNDb250cm9sbGVyLnN0YXJ0KCk7XG4gICAgXG4gICAgbmV3IFRvb2xiYXJDb250cm9sbGVyKGFwcENhbnZhcyk7XG5cbiAgICAvLyBjb25zdCByZWQgPSBuZXcgQ29sb3IoMjU1LCAwLCAyMDApXG4gICAgLy8gY29uc3QgdHJpYW5nbGUgPSBuZXcgVHJpYW5nbGUoJ3RyaS0xJywgcmVkLCA1MCwgNTAsIDIwLCA1MDAsIDIwMCwgMTAwKTtcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUodHJpYW5nbGUpO1xuXG4gICAgLy8gY29uc3QgbGluZSA9IG5ldyBMaW5lKCdsaW5lLTEnLCByZWQsIDIwMCwgMTAwLCAzMDAsIDEwMCk7XG4gICAgLy8gYXBwQ2FudmFzLmFkZFNoYXBlKGxpbmUpO1xufTtcblxubWFpbigpO1xuIiwiaW1wb3J0IHsgbTMgfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5jb25zdCBjcmVhdGVTaGFkZXIgPSAoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgICB0eXBlOiBudW1iZXIsXG4gICAgc291cmNlOiBzdHJpbmdcbikgPT4ge1xuICAgIGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcbiAgICBpZiAoc2hhZGVyKSB7XG4gICAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKTtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHJldHVybiBzaGFkZXI7XG5cbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xuICAgICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcbiAgICB9XG59O1xuXG5jb25zdCBjcmVhdGVQcm9ncmFtID0gKFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXG4gICAgdnR4U2hkOiBXZWJHTFNoYWRlcixcbiAgICBmcmdTaGQ6IFdlYkdMU2hhZGVyXG4pID0+IHtcbiAgICBjb25zdCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgIGlmIChwcm9ncmFtKSB7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2dHhTaGQpO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJnU2hkKTtcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHJldHVybiBwcm9ncmFtO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSkpO1xuICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgIH1cbn07XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2MnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpO1xuXG4gICAgaWYgKCFnbCkge1xuICAgICAgICBhbGVydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgd2ViR0wnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBJbml0aWFsaXplIHNoYWRlcnMgYW5kIHByb2dyYW1zXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IHZ0eFNoYWRlclNvdXJjZSA9IChcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRleC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxuICAgICkudGV4dDtcbiAgICBjb25zdCBmcmFnU2hhZGVyU291cmNlID0gKFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJhZ21lbnQtc2hhZGVyLTJkJykgYXMgSFRNTFNjcmlwdEVsZW1lbnRcbiAgICApLnRleHQ7XG5cbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBjcmVhdGVTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZ0eFNoYWRlclNvdXJjZSk7XG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBjcmVhdGVTaGFkZXIoXG4gICAgICAgIGdsLFxuICAgICAgICBnbC5GUkFHTUVOVF9TSEFERVIsXG4gICAgICAgIGZyYWdTaGFkZXJTb3VyY2VcbiAgICApO1xuICAgIGlmICghdmVydGV4U2hhZGVyIHx8ICFmcmFnbWVudFNoYWRlcikgcmV0dXJuO1xuXG4gICAgY29uc3QgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZlcnRleFNoYWRlciwgZnJhZ21lbnRTaGFkZXIpO1xuICAgIGlmICghcHJvZ3JhbSkgcmV0dXJuO1xuXG4gICAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGNvbnN0IGRpc3BsYXlXaWR0aCAgPSBNYXRoLnJvdW5kKHdpZHRoICogZHByKTtcbiAgICBjb25zdCBkaXNwbGF5SGVpZ2h0ID0gTWF0aC5yb3VuZChoZWlnaHQgKiBkcHIpO1xuXG4gICAgY29uc3QgbmVlZFJlc2l6ZSA9XG4gICAgICAgIGdsLmNhbnZhcy53aWR0aCAhPSBkaXNwbGF5V2lkdGggfHwgZ2wuY2FudmFzLmhlaWdodCAhPSBkaXNwbGF5SGVpZ2h0O1xuXG4gICAgaWYgKG5lZWRSZXNpemUpIHtcbiAgICAgICAgZ2wuY2FudmFzLndpZHRoID0gZGlzcGxheVdpZHRoO1xuICAgICAgICBnbC5jYW52YXMuaGVpZ2h0ID0gZGlzcGxheUhlaWdodDtcbiAgICB9XG5cbiAgICBnbC52aWV3cG9ydCgwLCAwLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQpO1xuICAgIGdsLmNsZWFyQ29sb3IoMCwgMCwgMCwgMCk7XG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBFbmFibGUgJiBpbml0aWFsaXplIHVuaWZvcm1zIGFuZCBhdHRyaWJ1dGVzXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFJlc29sdXRpb25cbiAgICBjb25zdCByZXNvbHV0aW9uVW5pZm9ybUxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKFxuICAgICAgICBwcm9ncmFtLFxuICAgICAgICAndV9yZXNvbHV0aW9uJ1xuICAgICk7XG4gICAgZ2wudW5pZm9ybTJmKHJlc29sdXRpb25Vbmlmb3JtTG9jYXRpb24sIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XG5cbiAgICAvLyBDb2xvclxuICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgaWYgKCFjb2xvckJ1ZmZlcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGNvbG9yIGJ1ZmZlcicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICBjb25zdCBjb2xvckF0dHJpYnV0ZUxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24ocHJvZ3JhbSwgJ2FfY29sb3InKTtcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShjb2xvckF0dHJpYnV0ZUxvY2F0aW9uKTtcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGNvbG9yQXR0cmlidXRlTG9jYXRpb24sIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XG5cbiAgICAvLyBQb3NpdGlvblxuICAgIGNvbnN0IHBvc2l0aW9uQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XG4gICAgaWYgKCFwb3NpdGlvbkJ1ZmZlcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHBvc2l0aW9uIGJ1ZmZlcicpO1xuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcbiAgICBjb25zdCBwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uID0gZ2wuZ2V0QXR0cmliTG9jYXRpb24oXG4gICAgICAgIHByb2dyYW0sXG4gICAgICAgICdhX3Bvc2l0aW9uJ1xuICAgICk7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8gRG8gbm90IHJlbW92ZSBjb21tZW50cywgdXNlZCBmb3Igc2FuaXR5IGNoZWNrXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIC8vIFNldCB0aGUgdmFsdWVzIG9mIHRoZSBidWZmZXJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XG5cbiAgICAvLyBjb25zdCBjb2xvcnMgPSBbMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMCwgMS4wLCAwLjAsIDAuMF07XG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyBjb25zdCBwb3NpdGlvbnMgPSBbMTAwLCA1MCwgMjAsIDEwLCA1MDAsIDUwMF07XG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLCBnbC5TVEFUSUNfRFJBVyk7XG5cbiAgICAvLyA9PT09XG4gICAgLy8gRHJhd1xuICAgIC8vID09PT1cbiAgICAvLyBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywgMCwgMyk7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBwb3NpdGlvbkJ1ZmZlcixcbiAgICAgICAgcHJvZ3JhbSxcbiAgICAgICAgY29sb3JCdWZmZXIsXG4gICAgICAgIGdsLFxuICAgIH07XG59O1xuXG5leHBvcnQgZGVmYXVsdCBpbml0O1xuIiwiaW1wb3J0IFZlcnRleCBmcm9tICcuL0Jhc2UvVmVydGV4JztcblxuZXhwb3J0IGNvbnN0IGV1Y2xpZGVhbkRpc3RhbmNlVnR4ID0gKGE6IFZlcnRleCwgYjogVmVydGV4KTogbnVtYmVyID0+IHtcbiAgICBjb25zdCBkeCA9IGEueCAtIGIueDtcbiAgICBjb25zdCBkeSA9IGEueSAtIGIueTtcblxuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xufTtcblxuLy8gMzYwIERFR1xuZXhwb3J0IGNvbnN0IGdldEFuZ2xlID0gKG9yaWdpbjogVmVydGV4LCB0YXJnZXQ6IFZlcnRleCkgPT4ge1xuICAgIGNvbnN0IHBsdXNNaW51c0RlZyA9IHJhZFRvRGVnKE1hdGguYXRhbjIob3JpZ2luLnkgLSB0YXJnZXQueSwgb3JpZ2luLnggLSB0YXJnZXQueCkpO1xuICAgIHJldHVybiBwbHVzTWludXNEZWcgPj0gMCA/IDE4MCAtIHBsdXNNaW51c0RlZyA6IE1hdGguYWJzKHBsdXNNaW51c0RlZykgKyAxODA7XG59XG5cbmV4cG9ydCBjb25zdCByYWRUb0RlZyA9IChyYWQ6IG51bWJlcikgPT4ge1xuICAgIHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xufVxuXG5leHBvcnQgY29uc3QgZGVnVG9SYWQgPSAoZGVnOiBudW1iZXIpID0+IHtcbiAgICByZXR1cm4gZGVnICogTWF0aC5QSSAvIDE4MDtcbn1cblxuZXhwb3J0IGNvbnN0IG0zID0ge1xuICAgIGlkZW50aXR5OiBmdW5jdGlvbigpIDogbnVtYmVyW10ge1xuICAgICAgcmV0dXJuIFtcbiAgICAgICAgMSwgMCwgMCxcbiAgICAgICAgMCwgMSwgMCxcbiAgICAgICAgMCwgMCwgMSxcbiAgICAgIF07XG4gICAgfSxcbiAgXG4gICAgdHJhbnNsYXRpb246IGZ1bmN0aW9uKHR4IDogbnVtYmVyLCB0eSA6IG51bWJlcikgOiBudW1iZXJbXSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICAxLCAwLCAwLFxuICAgICAgICAwLCAxLCAwLFxuICAgICAgICB0eCwgdHksIDEsXG4gICAgICBdO1xuICAgIH0sXG4gIFxuICAgIHJvdGF0aW9uOiBmdW5jdGlvbihhbmdsZUluUmFkaWFucyA6IG51bWJlcikgOiBudW1iZXJbXSB7XG4gICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xuICAgICAgY29uc3QgcyA9IE1hdGguc2luKGFuZ2xlSW5SYWRpYW5zKTtcbiAgICAgIHJldHVybiBbXG4gICAgICAgIGMsLXMsIDAsXG4gICAgICAgIHMsIGMsIDAsXG4gICAgICAgIDAsIDAsIDEsXG4gICAgICBdO1xuICAgIH0sXG4gIFxuICAgIHNjYWxpbmc6IGZ1bmN0aW9uKHN4IDogbnVtYmVyLCBzeSA6IG51bWJlcikgOiBudW1iZXJbXSB7XG4gICAgICByZXR1cm4gW1xuICAgICAgICBzeCwgMCwgMCxcbiAgICAgICAgMCwgc3ksIDAsXG4gICAgICAgIDAsIDAsIDEsXG4gICAgICBdO1xuICAgIH0sXG4gIFxuICAgIG11bHRpcGx5OiBmdW5jdGlvbihhIDogbnVtYmVyW10sIGIgOiBudW1iZXJbXSkgOiBudW1iZXJbXSB7XG4gICAgICBjb25zdCBhMDAgPSBhWzAgKiAzICsgMF07XG4gICAgICBjb25zdCBhMDEgPSBhWzAgKiAzICsgMV07XG4gICAgICBjb25zdCBhMDIgPSBhWzAgKiAzICsgMl07XG4gICAgICBjb25zdCBhMTAgPSBhWzEgKiAzICsgMF07XG4gICAgICBjb25zdCBhMTEgPSBhWzEgKiAzICsgMV07XG4gICAgICBjb25zdCBhMTIgPSBhWzEgKiAzICsgMl07XG4gICAgICBjb25zdCBhMjAgPSBhWzIgKiAzICsgMF07XG4gICAgICBjb25zdCBhMjEgPSBhWzIgKiAzICsgMV07XG4gICAgICBjb25zdCBhMjIgPSBhWzIgKiAzICsgMl07XG4gICAgICBjb25zdCBiMDAgPSBiWzAgKiAzICsgMF07XG4gICAgICBjb25zdCBiMDEgPSBiWzAgKiAzICsgMV07XG4gICAgICBjb25zdCBiMDIgPSBiWzAgKiAzICsgMl07XG4gICAgICBjb25zdCBiMTAgPSBiWzEgKiAzICsgMF07XG4gICAgICBjb25zdCBiMTEgPSBiWzEgKiAzICsgMV07XG4gICAgICBjb25zdCBiMTIgPSBiWzEgKiAzICsgMl07XG4gICAgICBjb25zdCBiMjAgPSBiWzIgKiAzICsgMF07XG4gICAgICBjb25zdCBiMjEgPSBiWzIgKiAzICsgMV07XG4gICAgICBjb25zdCBiMjIgPSBiWzIgKiAzICsgMl07XG4gICAgICByZXR1cm4gW1xuICAgICAgICBiMDAgKiBhMDAgKyBiMDEgKiBhMTAgKyBiMDIgKiBhMjAsXG4gICAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcbiAgICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxuICAgICAgICBiMTAgKiBhMDAgKyBiMTEgKiBhMTAgKyBiMTIgKiBhMjAsXG4gICAgICAgIGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMSxcbiAgICAgICAgYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyLFxuICAgICAgICBiMjAgKiBhMDAgKyBiMjEgKiBhMTAgKyBiMjIgKiBhMjAsXG4gICAgICAgIGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMSxcbiAgICAgICAgYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyLFxuICAgICAgXTtcbiAgICB9LFxuXG4gICAgdHJhbnNsYXRlOiBmdW5jdGlvbihtIDogbnVtYmVyW10sIHR4Om51bWJlciwgdHk6bnVtYmVyKSB7XG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMudHJhbnNsYXRpb24odHgsIHR5KSk7XG4gICAgfSxcbiAgXG4gICAgcm90YXRlOiBmdW5jdGlvbihtOm51bWJlcltdLCBhbmdsZUluUmFkaWFuczpudW1iZXIpIHtcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy5yb3RhdGlvbihhbmdsZUluUmFkaWFucykpO1xuICAgIH0sXG4gIFxuICAgIHNjYWxlOiBmdW5jdGlvbihtOm51bWJlcltdLCBzeDpudW1iZXIsIHN5Om51bWJlcikge1xuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnNjYWxpbmcoc3gsIHN5KSk7XG4gICAgfSxcbiAgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=