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
        var refreshVertexList = this.createVertexButton("Refresh Vertices Dropdown");
        refreshVertexList.onclick = function (e) {
            e.preventDefault();
            _this.initVertexToolbar();
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQztRQUUvRixLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxFQUFFLGNBQU0sZUFBUSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQWpDLENBQWlDLEVBQUUsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2xHLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLFlBQVksRUFBRSxVQUFDLENBQUMsSUFBTSxLQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQztRQUVyRyxLQUFJLENBQUMsV0FBVyxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsT0FBTyxFQUFFLGNBQU0sZUFBUSxDQUFDLEtBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQWhDLENBQWdDLEVBQUUsR0FBRyxFQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQy9GLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRSxVQUFDLENBQUMsSUFBTSxLQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQztRQUVsRyxLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLGNBQU0sZUFBUSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLEVBQWpDLENBQWlDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdEcsS0FBSSxDQUFDLGNBQWMsQ0FBQyxLQUFJLENBQUMsWUFBWSxFQUFFLFVBQUMsQ0FBQyxJQUFNLEtBQUksQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBQyxDQUFDOztJQUMzRyxDQUFDO0lBRU8sK0NBQVUsR0FBbEIsVUFBbUIsT0FBYztRQUM3QixJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDeEMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFFckMsQ0FBQztJQUVPLCtDQUFVLEdBQWxCLFVBQW1CLE9BQWM7UUFDN0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTyxpREFBWSxHQUFwQixVQUFxQixTQUFnQjtRQUNqQyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLEdBQUMsR0FBRyxDQUFDO1FBQ3hDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFTyxnREFBVyxHQUFuQixVQUFvQixRQUFlO1FBQy9CLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsR0FBQyxHQUFHLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7SUFDckMsQ0FBQztJQUVPLG1EQUFjLEdBQXRCLFVBQXVCLFdBQW1CO1FBQ3RDLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxHQUFHLG9CQUFRLEVBQUMsV0FBVyxDQUFDLENBQUM7UUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDakMsS0FBSSxJQUFJLENBQUMsR0FBQyxDQUFDLEVBQUUsQ0FBQyxHQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBQyxDQUFDO1lBQ25CLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUYsQ0FBQztJQUNMLENBQUM7SUFFRCxpREFBWSxHQUFaLFVBQWEsR0FBVyxFQUFFLENBQVMsRUFBRSxDQUFTO1FBQ3RDLDhCQUE4QjtRQUM5Qiw4QkFBOEI7UUFGdEMsaUJBMkRLO1FBdkRHLElBQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEYsSUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVsRixJQUFJLFdBQVcsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzlCLElBQUksV0FBVyxHQUFHLENBQUMsR0FBRyxPQUFPLENBQUM7UUFFOUIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxjQUFjLENBQUMsQ0FBQyx5QkFBeUI7UUFDdEUsSUFBTSxFQUFFLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDekUsSUFBTSxFQUFFLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEdBQUcsV0FBVyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7UUFFekUsSUFBTSxTQUFTLEdBQUcsRUFBRSxHQUFHLE9BQU8sQ0FBQztRQUMvQixJQUFNLFNBQVMsR0FBRyxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBRS9CLElBQU0sU0FBUyxHQUFHLFNBQVMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDOUQsSUFBTSxTQUFTLEdBQUcsU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM5RCxpQ0FBaUM7UUFDakMsZ0NBQWdDO1FBRWhDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUM7UUFDN0MsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztRQUU3QyxJQUFNLGdCQUFnQixHQUFHLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQUMsSUFBSSxRQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxLQUFJLENBQUMsU0FBUyxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsRUFBbkQsQ0FBbUQsQ0FBQyxDQUFDO1FBRXZHLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDO1FBQzNDLElBQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3pELElBQU0sY0FBYyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsZUFBZSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRTNELElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXJELElBQU0sY0FBYyxHQUFHLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDaEQsSUFBTSxjQUFjLEdBQUcsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUVoRCxpQkFBaUI7UUFDakIsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLG1CQUFTO1lBQzlCLElBQUksU0FBUyxLQUFLLGFBQWEsSUFBSSxTQUFTLEtBQUssY0FBYyxFQUFFLENBQUM7Z0JBQzlELElBQU0sV0FBVyxHQUFHLFNBQVMsQ0FBQyxTQUFTLENBQUMsQ0FBQztnQkFFekMsSUFBSSxXQUFXLENBQUMsQ0FBQyxLQUFLLGNBQWMsSUFBSSxXQUFXLENBQUMsQ0FBQyxLQUFLLGNBQWMsRUFBRSxDQUFDO29CQUN2RSxJQUFJLElBQUksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDO3dCQUM1QyxXQUFXLENBQUMsQ0FBQyxJQUFJLFNBQVMsQ0FBQztvQkFDL0IsQ0FBQzt5QkFBTSxDQUFDO3dCQUNKLFdBQVcsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO29CQUMvQixDQUFDO2dCQUNMLENBQUM7cUJBQU0sQ0FBQztvQkFDSixJQUFJLFdBQVcsQ0FBQyxDQUFDLEtBQUssY0FBYyxFQUFFLENBQUM7d0JBQ25DLFdBQVcsQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDO29CQUMvQixDQUFDO29CQUNELElBQUksV0FBVyxDQUFDLENBQUMsS0FBSyxjQUFjLEVBQUUsQ0FBQzt3QkFDbkMsV0FBVyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUM7b0JBQy9CLENBQUM7Z0JBQ0wsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3JDLENBQUM7SUFFRCx3REFBbUIsR0FBbkIsY0FBNkIsQ0FBQztJQUN0QyxpQ0FBQztBQUFELENBQUMsQ0F6SHVELCtDQUFzQixHQXlIN0U7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzVIRCxxR0FBd0M7QUFDeEMsMEVBQW9EO0FBRXBEO0lBaUJJLGdDQUFZLEtBQWdCLEVBQUUsU0FBb0I7UUFUM0MsbUJBQWMsR0FBRyxHQUFHLENBQUM7UUFFckIsa0JBQWEsR0FBNEIsSUFBSSxDQUFDO1FBQzlDLGtCQUFhLEdBQTRCLElBQUksQ0FBQztRQUM5QyxtQkFBYyxHQUE0QixJQUFJLENBQUM7UUFFOUMsZUFBVSxHQUF1QixFQUFFLENBQUM7UUFDcEMsZUFBVSxHQUFxQixFQUFFLENBQUM7UUFHdEMsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7UUFDbkIsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7UUFFM0IsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQzNDLG1CQUFtQixDQUNKLENBQUM7UUFFcEIsSUFBSSxDQUFDLGVBQWUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUMxQyxrQkFBa0IsQ0FDSCxDQUFDO1FBRXBCLElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLGNBQWMsQ0FDdkMsZUFBZSxDQUNHLENBQUM7UUFFdkIsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUVELDZDQUFZLEdBQVosVUFDSSxLQUFhLEVBQ2IsV0FBeUIsRUFDekIsR0FBVyxFQUNYLEdBQVc7UUFFWCxJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFFcEQsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUM5QixTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWpDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO1FBQ25FLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDeEMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU5QixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRTdDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRWxDLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7SUFFRCwrQ0FBYyxHQUFkLFVBQWUsTUFBd0IsRUFBRSxFQUFxQjtRQUE5RCxpQkFPQztRQU5HLElBQU0sS0FBSyxHQUFHLFVBQUMsQ0FBUTtZQUNuQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDTixLQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQy9CLENBQUMsQ0FBQztRQUNGLE1BQU0sQ0FBQyxRQUFRLEdBQUcsS0FBSyxDQUFDO1FBQ3hCLE1BQU0sQ0FBQyxPQUFPLEdBQUcsS0FBSyxDQUFDO0lBQzNCLENBQUM7SUFFRCw0Q0FBVyxHQUFYLFVBQVksUUFBbUI7UUFDM0IsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkMsQ0FBQztJQUVELDhDQUFhLEdBQWIsVUFBYyxZQUE4QjtRQUE1QyxpQkFhQztRQVpHLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFVBQUMsTUFBTSxFQUFFLEdBQUc7WUFDaEMsSUFBSSxZQUFZLEtBQUssTUFBTTtnQkFBRSxPQUFPO1lBQ3BDLE1BQU0sQ0FBQyxLQUFLLEdBQUcsS0FBSSxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3JELENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxJQUFJLENBQUMsYUFBYSxJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztZQUMzQyxJQUFNLEdBQUcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUM5QyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUV6QyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQy9DLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDbkQsQ0FBQztJQUNMLENBQUM7SUFFRCxtREFBa0IsR0FBbEIsVUFDSSxLQUFhLEVBQ2IsYUFBcUIsRUFDckIsR0FBVyxFQUNYLEdBQVc7UUFFWCxJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFFcEQsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUM5QixTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWpDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO1FBQ25FLE1BQU0sQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQ3RCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3hDLFNBQVMsQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFFOUIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFNUMsT0FBTyxNQUFNLENBQUM7SUFDbEIsQ0FBQztJQUVELHdEQUF1QixHQUF2QixVQUF3QixLQUFhLEVBQUUsR0FBVztRQUM5QyxJQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2hELFNBQVMsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFFcEQsSUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxTQUFTLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQztRQUM5QixTQUFTLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWpDLElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFxQixDQUFDO1FBQ3hFLFdBQVcsQ0FBQyxJQUFJLEdBQUcsT0FBTyxDQUFDO1FBQzNCLFdBQVcsQ0FBQyxLQUFLLEdBQUcsR0FBRyxDQUFDO1FBQ3hCLFNBQVMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFbkMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFNUMsT0FBTyxXQUFXLENBQUM7SUFDdkIsQ0FBQztJQUVELGtEQUFpQixHQUFqQjtRQUFBLGlCQW1EQztRQWxERyxPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVTtZQUNsQyxJQUFJLENBQUMsZUFBZSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRXRFLElBQU0sR0FBRyxHQUFHLFFBQVEsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQzlDLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRXpDLElBQUksQ0FBQyxhQUFhLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUN4QyxPQUFPLEVBQ1AsTUFBTSxDQUFDLENBQUMsRUFDUixDQUFDLEVBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQ3ZCLENBQUM7UUFFRixJQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FDeEMsT0FBTyxFQUNQLE1BQU0sQ0FBQyxDQUFDLEVBQ1IsQ0FBQyxFQUNELElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUN4QixDQUFDO1FBRUYsSUFBTSxZQUFZLEdBQUc7WUFDakIsSUFBSSxLQUFJLENBQUMsYUFBYSxJQUFJLEtBQUksQ0FBQyxhQUFhO2dCQUN4QyxLQUFJLENBQUMsWUFBWSxDQUNiLEdBQUcsRUFDSCxRQUFRLENBQUMsS0FBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsRUFDbEMsUUFBUSxDQUFDLEtBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQ3JDLENBQUM7UUFDVixDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FDOUMsT0FBTyxFQUNQLG9CQUFRLEVBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FDakUsQ0FBQztRQUVGLElBQU0sV0FBVyxHQUFHOztZQUNWLFNBQWMsMEJBQVEsRUFDeEIsaUJBQUksQ0FBQyxjQUFjLDBDQUFFLEtBQUssbUNBQUksU0FBUyxDQUMxQyxtQ0FBSSxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBRmpCLENBQUMsU0FBRSxDQUFDLFNBQUUsQ0FBQyxPQUVVLENBQUM7WUFDMUIsSUFBTSxLQUFLLEdBQUcsSUFBSSxlQUFLLENBQUMsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQztZQUNuRCxPQUFPLENBQUMsR0FBRyxDQUFDLHdCQUFpQixHQUFHLENBQUUsQ0FBQyxDQUFDO1lBRXBDLEtBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDcEMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxLQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDakMsQ0FBQyxDQUFDO1FBRUYsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3RELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxZQUFZLENBQUMsQ0FBQztRQUN0RCxJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFdEQsSUFBSSxDQUFDLG1CQUFtQixFQUFFLENBQUM7SUFDL0IsQ0FBQztJQUVELGtEQUFpQixHQUFqQjtRQUFBLGlCQW1CQztRQWxCRyxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsVUFBVTtZQUMvQixJQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWhFLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLENBQUMsRUFBRSxHQUFHO1lBQ2hDLElBQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDaEQsTUFBTSxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDOUIsTUFBTSxDQUFDLEtBQUssR0FBRyxpQkFBVSxHQUFHLENBQUUsQ0FBQztZQUMvQixLQUFJLENBQUMsWUFBWSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMxQyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxHQUFHLEdBQUcsQ0FBQztRQUM5QixJQUFJLENBQUMsY0FBYyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsS0FBSyxDQUFDO1FBQzlDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBRXpCLElBQUksQ0FBQyxZQUFZLENBQUMsUUFBUSxHQUFHO1lBQ3pCLEtBQUksQ0FBQyxjQUFjLEdBQUcsS0FBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7WUFDOUMsS0FBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFDN0IsQ0FBQyxDQUFDO0lBQ04sQ0FBQztJQUlMLDZCQUFDO0FBQUQsQ0FBQztBQW5OcUIsd0RBQXNCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDSDVDLDBFQUEwQztBQUMxQyxnSkFBa0U7QUFHbEU7SUFBcUQsMkNBQXNCO0lBU3ZFLGlDQUFZLE1BQWMsRUFBRSxTQUFvQjtRQUM1QyxrQkFBSyxZQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsU0FBQztRQUN6QixLQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUVyQixLQUFJLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLGNBQU0sZUFBUSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEVBQS9CLENBQStCLEVBQUMsQ0FBQyxHQUFHLEdBQUMsU0FBUyxDQUFDLEtBQUssRUFBQyxHQUFHLEdBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2xJLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLFVBQVUsRUFBRSxVQUFDLENBQUMsSUFBTSxLQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQztRQUUvRixLQUFJLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsWUFBWSxFQUFFLGNBQU0sUUFBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFqQyxDQUFpQyxFQUFDLENBQUMsR0FBRyxHQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUMsR0FBRyxHQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNwSSxLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxDQUFDLElBQU0sS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUM7UUFFL0YsS0FBSSxDQUFDLFVBQVUsR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxjQUFNLGVBQVEsQ0FBQyxLQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxFQUEvQixDQUErQixFQUFFLEdBQUcsRUFBQyxHQUFHLENBQUMsQ0FBQztRQUM1RixLQUFJLENBQUMsY0FBYyxDQUFDLEtBQUksQ0FBQyxVQUFVLEVBQUUsVUFBQyxDQUFDLElBQU0sS0FBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsS0FBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxHQUFDLENBQUM7UUFFL0YsS0FBSSxDQUFDLFlBQVksR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDLFVBQVUsRUFBRSxjQUFNLGVBQVEsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFqQyxDQUFpQyxFQUFFLENBQUMsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3RHLEtBQUksQ0FBQyxjQUFjLENBQUMsS0FBSSxDQUFDLFlBQVksRUFBRSxVQUFDLENBQUMsSUFBTSxLQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsQ0FBQyxLQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUMsQ0FBQyxDQUFDOztJQUM1RyxDQUFDO0lBRU8sNENBQVUsR0FBbEIsVUFBbUIsT0FBYztRQUM3QixJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7UUFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVPLDRDQUFVLEdBQWxCLFVBQW1CLE9BQWM7UUFDN0IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ2xDLENBQUM7SUFFTyw0Q0FBVSxHQUFsQixVQUFtQixPQUFjO1FBQzdCLElBQUksQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLE9BQU8sR0FBQyxHQUFHLENBQUM7UUFDbkMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxHQUFDLEdBQUcsQ0FBQztRQUNuQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRU8sZ0RBQWMsR0FBdEIsVUFBdUIsV0FBbUI7UUFDdEMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxjQUFjLEdBQUcsb0JBQVEsRUFBQyxXQUFXLENBQUMsQ0FBQztRQUNuRCxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQsOENBQVksR0FBWixVQUFhLEdBQVcsRUFBRSxDQUFTLEVBQUUsQ0FBUztRQUMxQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRXZCLElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsd0JBQXdCLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDekQsaUNBQWlDO1FBQ2pDLHFEQUFxRDtRQUNyRCxxREFBcUQ7UUFHckQsZ0VBQWdFO1FBQ2hFLGtDQUFrQztRQUNsQyx3REFBd0Q7UUFFeEQsMERBQTBEO1FBQzFELHNEQUFzRDtRQUN0RCxpRkFBaUY7UUFDakYsc0RBQXNEO1FBRXRELHlDQUF5QztRQUV6QyxNQUFNLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNiLE1BQU0sQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBRWIsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDbEMsQ0FBQztJQUVELHFEQUFtQixHQUFuQixjQUE2QixDQUFDO0lBQ2xDLDhCQUFDO0FBQUQsQ0FBQyxDQTFFb0QsK0NBQXNCLEdBMEUxRTs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvRUQsa0hBQStDO0FBQy9DLHFIQUFpRDtBQUNqRCxtR0FBcUM7QUFDckMsa0hBQStDO0FBQy9DLHlHQUF5QztBQUV6QyxtTEFBNEU7QUFDNUUsc0xBQThFO0FBQzlFLG9LQUFrRTtBQUNsRSxtTEFBNEU7QUFFNUUsMEtBQXNFO0FBRXRFO0lBU0ksMkJBQVksU0FBb0IsRUFBRSxnQkFBa0M7UUFBcEUsaUJBZ0NDO1FBckNPLGVBQVUsR0FBVyxFQUFFLENBQUM7UUFFeEIsc0JBQWlCLEdBQWtDLElBQUksQ0FBQztRQUk1RCxJQUFJLENBQUMsU0FBUyxHQUFHLFNBQVMsQ0FBQztRQUMzQixJQUFJLENBQUMsU0FBUyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvRCxJQUFJLENBQUMsZ0JBQWdCLEdBQUcsZ0JBQWdCLENBQUM7UUFFekMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQzNDLG1CQUFtQixDQUNKLENBQUM7UUFFcEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxRQUFRLENBQUMsY0FBYyxDQUNyQyxxQkFBcUIsQ0FDSCxDQUFDO1FBRXZCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxHQUFHLFVBQUMsQ0FBQztZQUN6QixLQUFJLENBQUMsVUFBVSxHQUFHLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDO1lBQ3hDLElBQU0sS0FBSyxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLEtBQUksQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDM0QsS0FBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7WUFFeEIsSUFBSSxLQUFLLFlBQVksY0FBSSxFQUFFLENBQUM7Z0JBQ3hCLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLCtCQUFxQixDQUFDLEtBQWEsRUFBRSxTQUFTLENBQUMsQ0FBQztZQUNqRixDQUFDO2lCQUFNLElBQUksS0FBSyxZQUFZLG1CQUFTLEVBQUUsQ0FBQztnQkFDcEMsS0FBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksb0NBQTBCLENBQUMsS0FBa0IsRUFBRSxTQUFTLENBQUM7WUFDMUYsQ0FBQztpQkFBTSxJQUFJLEtBQUssWUFBWSxnQkFBTSxFQUFFLENBQUM7Z0JBQ2pDLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLGlDQUF1QixDQUFDLEtBQWUsRUFBRSxTQUFTLENBQUM7WUFDcEYsQ0FBQztpQkFBTSxJQUFJLEtBQUssWUFBWSxvQkFBVSxFQUFFLENBQUM7Z0JBQ3JDLEtBQUksQ0FBQyxpQkFBaUIsR0FBRyxJQUFJLHFDQUEyQixDQUFDLEtBQW1CLEVBQUUsU0FBUyxFQUFFLEtBQUksQ0FBQyxnQkFBZ0IsQ0FBQztZQUNuSCxDQUFDO2lCQUFNLElBQUksS0FBSyxZQUFZLG1CQUFTLEVBQUUsQ0FBQztnQkFDcEMsS0FBSSxDQUFDLGlCQUFpQixHQUFHLElBQUksb0NBQTBCLENBQUMsS0FBa0IsRUFBRSxTQUFTLEVBQUUsS0FBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ2pILENBQUM7UUFDTCxDQUFDLENBQUM7UUFFRixJQUFJLENBQUMsZUFBZSxFQUFFLENBQUM7SUFDM0IsQ0FBQztJQUVELDJDQUFlLEdBQWY7UUFBQSxpQkFzQkM7UUFyQkcsT0FBTyxJQUFJLENBQUMsVUFBVSxDQUFDLFVBQVU7WUFDN0IsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUU1RCxJQUFNLFdBQVcsR0FBRyxRQUFRLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELFdBQVcsQ0FBQyxJQUFJLEdBQUcsa0JBQWtCLENBQUM7UUFDdEMsV0FBVyxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDdkIsSUFBSSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFekMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEtBQUs7WUFDL0MsSUFBTSxLQUFLLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsQ0FBQztZQUMvQyxLQUFLLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdEIsS0FBSyxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLEtBQUksQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3ZDLENBQUMsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUV4QyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQztZQUNoRSxJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDO1lBQzlCLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzVCLENBQUM7SUFDTCxDQUFDO0lBRU8sNENBQWdCLEdBQXhCO1FBQ0ksT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsVUFBVTtZQUNuQyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUM1RSxDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3JGRCwyR0FBMEM7QUFDMUMsK0ZBQWtDO0FBQ2xDLGtHQUFvQztBQUNwQyxtSEFBNEM7QUFDNUMsb0VBQWdEO0FBRWhEO0lBQXVDLDZCQUFTO0lBSzVDLG1CQUFZLEVBQVUsRUFBRSxLQUFZLEVBQUUsUUFBa0I7UUFDcEQsa0JBQUssWUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxTQUFDO1FBSnhCLGFBQU8sR0FBYSxFQUFFLENBQUM7UUFDZixRQUFFLEdBQWUsSUFBSSx5QkFBVSxFQUFFLENBQUM7UUFLdEMsS0FBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUNwQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDbkMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ25DLElBQUksZUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3JCLENBQUM7UUFFRixRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUMsR0FBRyxFQUFFLEdBQUc7WUFDdEIsSUFBSSxHQUFHLEdBQUcsQ0FBQztnQkFBRSxPQUFPO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDekIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN4QixDQUFDLENBQUMsQ0FBQzs7SUFDUCxDQUFDO0lBRUQsNkJBQVMsR0FBVCxVQUFVLE1BQWM7UUFDcEIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDO0lBQ2xCLENBQUM7SUFFRCxnQ0FBWSxHQUFaLFVBQWEsR0FBVztRQUNwQixJQUFJLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRSxDQUFDO1lBQzdCLEtBQUssQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFDO1lBQzFDLE9BQU87UUFDWCxDQUFDO1FBQ0QsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQzlCLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNoQyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELDBCQUFNLEdBQU47UUFBQSxpQkE4QkM7UUE3QkcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ2xDLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNuQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFaEMsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVM7YUFDdEIsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSyxVQUFHLEdBQUcsQ0FBQyxFQUFQLENBQU8sQ0FBQzthQUMzQixHQUFHLENBQUMsVUFBQyxHQUFHO1lBQ0wsT0FBTztnQkFDSCxHQUFHO2dCQUNILEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUNiLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ3JCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3hCO2FBQ0osQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRVAsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssUUFBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLFdBQUksQ0FBQyxHQUFHLEVBQVIsQ0FBUSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSyxZQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBYixDQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxHQUFHLElBQUssWUFBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQWIsQ0FBYSxFQUFFLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUc7WUFDbEMsdUNBQW9CLEVBQUMsR0FBRyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUM7UUFBdEMsQ0FBc0MsQ0FDekMsQ0FBQztJQUNOLENBQUM7SUFDTCxnQkFBQztBQUFELENBQUMsQ0FyRXNDLG1CQUFTLEdBcUUvQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUMzRUQsMkdBQTBDO0FBQzFDLCtGQUFrQztBQUNsQyxrR0FBb0M7QUFDcEMsb0VBQWdEO0FBRWhEO0lBQXdDLDhCQUFTO0lBSTdDLG9CQUFZLEVBQVUsRUFBRSxLQUFZLEVBQUUsUUFBa0I7UUFDcEQsa0JBQUssWUFBQyxDQUFDLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxTQUFDO1FBSHhCLGFBQU8sR0FBYSxFQUFFLENBQUM7UUFLbkIsS0FBSSxDQUFDLE1BQU0sR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDMUIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlDLEtBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUNwQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsUUFBUSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFDbkMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQ25DLElBQUksZUFBSyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQ3JCLENBQUM7UUFFRixLQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxVQUFDLEdBQUcsRUFBRSxHQUFHO1lBQzVCLElBQUksR0FBRyxHQUFHLENBQUM7Z0JBQUUsT0FBTztZQUNwQixLQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztZQUNwQixLQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3hCLENBQUMsQ0FBQyxDQUFDOztJQUNQLENBQUM7SUFFRCw4QkFBUyxHQUFULFVBQVUsTUFBYztRQUNwQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNwQixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELGlDQUFZLEdBQVosVUFBYSxHQUFXO1FBQ3BCLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFLENBQUM7WUFDN0IsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7WUFDMUMsT0FBTztRQUNYLENBQUM7UUFDRCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDOUIsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2hDLElBQUksSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksQ0FBQztZQUMxQixJQUFJLENBQUMsVUFBVSxHQUFHLENBQUMsQ0FBQztRQUN4QixJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUVELDJCQUFNLEdBQU47UUFBQSxpQkEwQkM7UUF6QkcsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVM7YUFDdEIsTUFBTSxDQUFDLFVBQUMsQ0FBQyxFQUFFLEdBQUcsSUFBSyxVQUFHLEdBQUcsQ0FBQyxFQUFQLENBQU8sQ0FBQzthQUMzQixHQUFHLENBQUMsVUFBQyxHQUFHO1lBQ0wsT0FBTztnQkFDSCxHQUFHO2dCQUNILEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUNiLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQ3JCLEdBQUcsQ0FBQyxDQUFDLEdBQUcsS0FBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQ3hCO2FBQ0osQ0FBQztRQUNOLENBQUMsQ0FBQyxDQUFDO1FBRVAsTUFBTSxDQUFDLElBQUksQ0FBQyxVQUFDLENBQUMsRUFBRSxDQUFDLElBQUssUUFBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsS0FBSyxFQUFqQixDQUFpQixDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQUMsSUFBSSxJQUFLLFdBQUksQ0FBQyxHQUFHLEVBQVIsQ0FBUSxDQUFDLENBQUM7UUFDaEQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBRXBDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNULElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFVBQUMsS0FBSyxFQUFFLEdBQUcsSUFBSyxZQUFLLEdBQUcsR0FBRyxDQUFDLENBQUMsRUFBYixDQUFhLEVBQUUsQ0FBQyxDQUFDO2dCQUN2RCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQztRQUMxQixJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDVCxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sQ0FBQyxVQUFDLEtBQUssRUFBRSxHQUFHLElBQUssWUFBSyxHQUFHLEdBQUcsQ0FBQyxDQUFDLEVBQWIsQ0FBYSxFQUFFLENBQUMsQ0FBQztnQkFDdkQsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUM7UUFDMUIsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxVQUFDLEdBQUc7WUFDbEMsdUNBQW9CLEVBQUMsR0FBRyxFQUFFLEtBQUksQ0FBQyxNQUFNLENBQUM7UUFBdEMsQ0FBc0MsQ0FDekMsQ0FBQztJQUNOLENBQUM7SUFDTCxpQkFBQztBQUFELENBQUMsQ0FuRXVDLG1CQUFTLEdBbUVoRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN4RUQsMkdBQTBDO0FBRTFDLGtHQUFvQztBQUNwQyxvRUFBZ0Q7QUFFaEQ7SUFBa0Msd0JBQVM7SUFHdkMsY0FBWSxFQUFVLEVBQUUsS0FBWSxFQUFFLE1BQWMsRUFBRSxNQUFjLEVBQUUsSUFBWSxFQUFFLElBQVksRUFBRSxRQUFZLEVBQUUsTUFBVSxFQUFFLE1BQVU7UUFBcEMsdUNBQVk7UUFBRSxtQ0FBVTtRQUFFLG1DQUFVO1FBQXRJLGlCQWdCQztRQWZHLElBQU0sT0FBTyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNwQyxJQUFNLE9BQU8sR0FBRyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDcEMsSUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkQsY0FBSyxZQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQyxTQUFDO1FBRXRELElBQU0sTUFBTSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ2pELElBQU0sR0FBRyxHQUFHLElBQUksZ0JBQU0sQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBRTFDLEtBQUksQ0FBQyxNQUFNLEdBQUcsZ0NBQW9CLEVBQzlCLE1BQU0sRUFDTixHQUFHLENBQ04sQ0FBQztRQUVGLEtBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNqQyxLQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQzs7SUFDbkQsQ0FBQztJQUNMLFdBQUM7QUFBRCxDQUFDLENBcEJpQyxtQkFBUyxHQW9CMUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDekJELDJHQUEwQztBQUUxQyxrR0FBb0M7QUFDcEMsb0VBQThCO0FBRTlCO0lBQXVDLDZCQUFTO0lBUzVDLG1CQUFZLEVBQVUsRUFBRSxLQUFZLEVBQUUsTUFBYyxFQUFFLE1BQWMsRUFBRSxJQUFZLEVBQUUsSUFBWSxFQUFFLGNBQXNCLEVBQUUsTUFBa0IsRUFBRSxNQUFrQixFQUFFLGNBQXdDO1FBQWhGLG1DQUFrQjtRQUFFLG1DQUFrQjtRQUFFLGtEQUEyQixVQUFFLENBQUMsUUFBUSxFQUFFO1FBQ3RNLGtCQUFLLFlBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsU0FBQztRQUVwQixJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFDbEIsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2xCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUM7UUFDbEIsSUFBTSxFQUFFLEdBQUcsTUFBTSxDQUFDO1FBQ2xCLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQztRQUNoQixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUM7UUFDaEIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDO1FBRWhCLEtBQUksQ0FBQyxvQkFBb0IsR0FBRyxjQUFjLENBQUM7UUFFM0MsS0FBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUM7UUFDckMsS0FBSSxDQUFDLEtBQUssR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUM5QixLQUFJLENBQUMsWUFBWSxHQUFHLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUN4QyxLQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztRQUNoQyxLQUFJLENBQUMsV0FBVyxHQUFHLENBQUMsQ0FBQyxFQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztRQUM1QixLQUFJLENBQUMsTUFBTSxHQUFHLEVBQUUsR0FBQyxFQUFFLENBQUM7UUFDcEIsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLEdBQUMsRUFBRSxDQUFDO1FBRW5CLElBQU0sT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFNLE9BQU8sR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDOUIsSUFBTSxNQUFNLEdBQUcsSUFBSSxnQkFBTSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDbkQsS0FBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFFckIsS0FBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsSUFBSSxnQkFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxnQkFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxnQkFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLEVBQUUsSUFBSSxnQkFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQztRQUNoSSxLQUFJLENBQUMsd0JBQXdCLEdBQUcsS0FBSSxDQUFDLFNBQVMsQ0FBQztRQUUvQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFZLEVBQUUsZUFBSyxFQUFFLENBQUUsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsbUJBQVksRUFBRSxlQUFLLEVBQUUsQ0FBRSxDQUFDLENBQUM7UUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtQkFBWSxFQUFFLGVBQUssRUFBRSxDQUFFLENBQUMsQ0FBQztRQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLG1CQUFZLEVBQUUsZUFBSyxFQUFFLENBQUUsQ0FBQyxDQUFDO1FBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQVcsTUFBTSxDQUFDLENBQUMsZUFBSyxNQUFNLENBQUMsQ0FBQyxDQUFFLENBQUMsQ0FBQzs7SUFDcEQsQ0FBQztJQUVRLDJDQUF1QixHQUFoQztRQUNJLGdCQUFLLENBQUMsdUJBQXVCLFdBQUUsQ0FBQztRQUVoQyxtRUFBbUU7UUFDbkUsSUFBSSxDQUFDLFFBQVEsR0FBRyxVQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQ3hFLElBQUksQ0FBQyxZQUFZLEdBQUcsVUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsb0JBQW9CLEVBQUUsSUFBSSxDQUFDLFlBQVksQ0FBQztJQUVwRixDQUFDO0lBRU0sbUNBQWUsR0FBdEIsVUFBdUIsUUFBZ0I7UUFDbkMsSUFBTSxXQUFXLEdBQThCLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDO1FBQzFFLE9BQU8sV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ2pDLENBQUM7SUFFTSxrQ0FBYyxHQUFyQixVQUFzQixRQUFnQjtRQUNsQyxJQUFNLFVBQVUsR0FBOEIsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7UUFDekUsT0FBTyxVQUFVLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDaEMsQ0FBQztJQUVNLGdDQUFZLEdBQW5CLFVBQW9CLFFBQWdCO1FBQ2hDLElBQU0sUUFBUSxHQUE4QixFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQztRQUN2RSxPQUFPLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUM5QixDQUFDO0lBOERMLGdCQUFDO0FBQUQsQ0FBQyxDQWxJc0MsbUJBQVMsR0FrSS9DOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3ZJRCwyR0FBMEM7QUFFMUMsa0dBQW9DO0FBR3BDO0lBQW9DLDBCQUFTO0lBTXpDLGdCQUFZLEVBQVUsRUFBRSxLQUFZLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxRQUFZLEVBQUUsTUFBVSxFQUFFLE1BQVU7UUFBcEMsdUNBQVk7UUFBRSxtQ0FBVTtRQUFFLG1DQUFVO1FBQTFLLGlCQWNDO1FBYkcsSUFBTSxPQUFPLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQzlCLElBQU0sT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUM5QixJQUFNLE1BQU0sR0FBRyxJQUFJLGdCQUFNLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVuRCxjQUFLLFlBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDLFNBQUM7UUFFdEQsS0FBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwQyxLQUFJLENBQUMsRUFBRSxHQUFHLElBQUksZ0JBQU0sQ0FBQyxFQUFFLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3BDLEtBQUksQ0FBQyxFQUFFLEdBQUcsSUFBSSxnQkFBTSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDcEMsS0FBSSxDQUFDLEVBQUUsR0FBRyxJQUFJLGdCQUFNLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUVwQyxLQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFJLENBQUMsRUFBRSxFQUFFLEtBQUksQ0FBQyxFQUFFLEVBQUUsS0FBSSxDQUFDLEVBQUUsRUFBRSxLQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDeEQsS0FBSSxDQUFDLHdCQUF3QixHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUM7O0lBQ25ELENBQUM7SUFDTCxhQUFDO0FBQUQsQ0FBQyxDQXJCbUMsbUJBQVMsR0FxQjVDOzs7Ozs7Ozs7Ozs7OztBQ3hCRCxJQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUVuQjtJQUFBO1FBQ1ksV0FBTSxHQUFhLEVBQUUsQ0FBQztJQXdGbEMsQ0FBQztJQXRGRywwQkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLE1BQU0sR0FBRyxFQUFFLENBQUM7SUFDckIsQ0FBQztJQUVELDhCQUFTLEdBQVQ7UUFDSSxPQUFPLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDdkIsQ0FBQztJQUVELDhCQUFTLEdBQVQsVUFBVSxNQUFnQjtRQUN0QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNqQyxDQUFDO0lBRUQsNkJBQVEsR0FBUixVQUFTLEtBQWE7UUFDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDNUIsQ0FBQztJQUVELDRCQUFPLEdBQVA7UUFBQSxpQkEwQ0M7UUF6Q0csSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7UUFFdkMsSUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxFQUFFLENBQUMsSUFBSyxRQUFDLEVBQUQsQ0FBQyxDQUFDLENBQUM7UUFDdkQsSUFBTSxNQUFNLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxJQUFLLFlBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxFQUEzQixDQUEyQixDQUFDLENBQUM7UUFDL0UsSUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLFVBQUMsS0FBSyxJQUFLLFlBQUksQ0FBQyx3QkFBd0IsQ0FBQyxLQUFLLEVBQUUsS0FBSyxDQUFDLEVBQTNDLENBQTJDLENBQUMsQ0FBQztRQUVsRyxPQUFPLENBQUMsSUFBSSxDQUFDLFVBQUMsQ0FBQyxFQUFFLENBQUM7WUFDZCxJQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBTSxNQUFNLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksTUFBTSxLQUFLLE1BQU0sRUFBRSxDQUFDO2dCQUNwQixJQUFNLFNBQVMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQy9CLElBQU0sU0FBUyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDL0IsT0FBTyxTQUFTLEdBQUcsU0FBUyxDQUFDO1lBQ2pDLENBQUM7WUFDRCxPQUFPLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDM0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxJQUFJLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxNQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7Z0JBQ2hELE9BQU8sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7WUFDekIsQ0FBQztRQUNMLENBQUM7UUFFRCxJQUFNLElBQUksR0FBRyxFQUFFLENBQUM7UUFDaEIsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUN0QyxJQUFNLEtBQUssR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekIsSUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUVqQyxJQUFJLEtBQUssS0FBSyxPQUFPLEVBQUUsQ0FBQztnQkFDcEIsSUFBSSxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO29CQUNsQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNyQixDQUFDO3FCQUFNLENBQUM7b0JBQ0osT0FBTyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLEVBQUUsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUM7d0JBQ3BGLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztvQkFDZixDQUFDO29CQUNELElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQ3JCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO0lBQ3ZDLENBQUM7SUFFRCxxQ0FBZ0IsR0FBaEIsVUFBaUIsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO1FBQy9DLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRUQsNkJBQVEsR0FBUixVQUFTLENBQVMsRUFBRSxDQUFTO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELDZDQUF3QixHQUF4QixVQUF5QixFQUFVLEVBQUUsRUFBVTtRQUMzQyxJQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDdEIsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRCxzQ0FBaUIsR0FBakI7UUFDSSxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzNCLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQztRQUNuQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztZQUMxQyxJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdCLElBQUksS0FBSyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxJQUFJLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsSUFBSSxLQUFLLENBQUMsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQztnQkFDaEUsS0FBSyxHQUFHLEtBQUssQ0FBQztnQkFDZCxVQUFVLEdBQUcsQ0FBQyxDQUFDO1lBQ25CLENBQUM7UUFDTCxDQUFDO1FBQ0QsT0FBTyxLQUFLLENBQUM7SUFDakIsQ0FBQztJQUNMLGlCQUFDO0FBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3RkQsZ0dBQW9DO0FBQ3BDLHlKQUFvRTtBQUNwRSxnS0FBd0U7QUFDeEUsaUZBQTBCO0FBRTFCLElBQU0sSUFBSSxHQUFHO0lBQ1QsSUFBTSxPQUFPLEdBQUcsa0JBQUksR0FBRSxDQUFDO0lBQ3ZCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUNYLE9BQU8sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLENBQUMsQ0FBQztRQUM1QyxPQUFPO0lBQ1gsQ0FBQztJQUVPLE1BQUUsR0FBMkMsT0FBTyxHQUFsRCxFQUFFLE9BQU8sR0FBa0MsT0FBTyxRQUF6QyxFQUFFLFdBQVcsR0FBcUIsT0FBTyxZQUE1QixFQUFFLGNBQWMsR0FBSyxPQUFPLGVBQVosQ0FBYTtJQUU3RCxJQUFNLFNBQVMsR0FBRyxJQUFJLG1CQUFTLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFFMUUsSUFBTSxnQkFBZ0IsR0FBRyxJQUFJLDBCQUFnQixDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQ3pELGdCQUFnQixDQUFDLEtBQUssRUFBRSxDQUFDO0lBRXpCLElBQUksMkJBQWlCLENBQUMsU0FBUyxFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFFbkQscUNBQXFDO0lBQ3JDLDZFQUE2RTtJQUM3RSxtQ0FBbUM7SUFFbkMsOERBQThEO0lBQzlELHVDQUF1QztJQUN2Qyw2Q0FBNkM7SUFDN0MsdUJBQXVCO0lBQ3ZCLGdDQUFnQztJQUNoQyxpQ0FBaUM7SUFDakMscUNBQXFDO0lBQ3JDLDRCQUE0QjtJQUU1Qiw0REFBNEQ7SUFDNUQsNkRBQTZEO0lBQzdELDRCQUE0QjtJQUM1Qiw2QkFBNkI7QUFDakMsQ0FBQyxDQUFDO0FBRUYsSUFBSSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7QUN4Q1AsSUFBTSxZQUFZLEdBQUcsVUFDakIsRUFBeUIsRUFDekIsSUFBWSxFQUNaLE1BQWM7SUFFZCxJQUFNLE1BQU0sR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3JDLElBQUksTUFBTSxFQUFFLENBQUM7UUFDVCxFQUFFLENBQUMsWUFBWSxDQUFDLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNoQyxFQUFFLENBQUMsYUFBYSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ3pCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ2pFLElBQUksT0FBTztZQUFFLE9BQU8sTUFBTSxDQUFDO1FBRTNCLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUM7UUFDM0MsRUFBRSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM1QixDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsSUFBTSxhQUFhLEdBQUcsVUFDbEIsRUFBeUIsRUFDekIsTUFBbUIsRUFDbkIsTUFBbUI7SUFFbkIsSUFBTSxPQUFPLEdBQUcsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO0lBQ25DLElBQUksT0FBTyxFQUFFLENBQUM7UUFDVixFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztRQUNqQyxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hCLElBQU0sT0FBTyxHQUFHLEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQ2hFLElBQUksT0FBTztZQUFFLE9BQU8sT0FBTyxDQUFDO1FBRTVCLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7UUFDN0MsRUFBRSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM5QixDQUFDO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsSUFBTSxJQUFJLEdBQUc7SUFDVCxJQUFNLE1BQU0sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FBc0IsQ0FBQztJQUNqRSxJQUFNLEVBQUUsR0FBRyxNQUFNLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0lBRXRDLElBQUksQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUNOLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBQzdDLE9BQU87SUFDWCxDQUFDO0lBRUQsOENBQThDO0lBQzlDLGtDQUFrQztJQUNsQyw4Q0FBOEM7SUFDOUMsSUFBTSxlQUFlLEdBQ2pCLFFBQVEsQ0FBQyxjQUFjLENBQUMsa0JBQWtCLENBQzdDLENBQUMsSUFBSSxDQUFDO0lBQ1AsSUFBTSxnQkFBZ0IsR0FDbEIsUUFBUSxDQUFDLGNBQWMsQ0FBQyxvQkFBb0IsQ0FDL0MsQ0FBQyxJQUFJLENBQUM7SUFFUCxJQUFNLFlBQVksR0FBRyxZQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxhQUFhLEVBQUUsZUFBZSxDQUFDLENBQUM7SUFDekUsSUFBTSxjQUFjLEdBQUcsWUFBWSxDQUMvQixFQUFFLEVBQ0YsRUFBRSxDQUFDLGVBQWUsRUFDbEIsZ0JBQWdCLENBQ25CLENBQUM7SUFDRixJQUFJLENBQUMsWUFBWSxJQUFJLENBQUMsY0FBYztRQUFFLE9BQU87SUFFN0MsSUFBTSxPQUFPLEdBQUcsYUFBYSxDQUFDLEVBQUUsRUFBRSxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDaEUsSUFBSSxDQUFDLE9BQU87UUFBRSxPQUFPO0lBRXJCLElBQU0sR0FBRyxHQUFHLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQztJQUM5QixTQUFrQixNQUFNLENBQUMscUJBQXFCLEVBQUUsRUFBL0MsS0FBSyxhQUFFLE1BQU0sWUFBa0MsQ0FBQztJQUN2RCxJQUFNLFlBQVksR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxHQUFHLENBQUMsQ0FBQztJQUM5QyxJQUFNLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxHQUFHLENBQUMsQ0FBQztJQUUvQyxJQUFNLFVBQVUsR0FDWixFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssSUFBSSxZQUFZLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksYUFBYSxDQUFDO0lBRXpFLElBQUksVUFBVSxFQUFFLENBQUM7UUFDYixFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssR0FBRyxZQUFZLENBQUM7UUFDL0IsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDO0lBQ3JDLENBQUM7SUFFRCxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNyRCxFQUFFLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQzFCLEVBQUUsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDOUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUV2Qiw4Q0FBOEM7SUFDOUMsOENBQThDO0lBQzlDLDhDQUE4QztJQUM5QyxhQUFhO0lBQ2IsSUFBTSxxQkFBcUIsR0FBRyxFQUFFLENBQUMsa0JBQWtCLENBQy9DLE9BQU8sRUFDUCxrQkFBa0IsQ0FDckIsQ0FBQztJQUNGLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxxQkFBcUIsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsRUFBQyxDQUFDLEVBQUMsQ0FBQyxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBRXRFLElBQU0seUJBQXlCLEdBQUcsRUFBRSxDQUFDLGtCQUFrQixDQUNuRCxPQUFPLEVBQ1AsY0FBYyxDQUNqQixDQUFDO0lBQ0YsRUFBRSxDQUFDLFNBQVMsQ0FBQyx5QkFBeUIsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTNFLFFBQVE7SUFDUixJQUFNLFdBQVcsR0FBRyxFQUFFLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDdEMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQywrQkFBK0IsQ0FBQyxDQUFDO1FBQy9DLE9BQU87SUFDWCxDQUFDO0lBRUQsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsWUFBWSxFQUFFLFdBQVcsQ0FBQyxDQUFDO0lBQzVDLElBQU0sc0JBQXNCLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUN4RSxFQUFFLENBQUMsdUJBQXVCLENBQUMsc0JBQXNCLENBQUMsQ0FBQztJQUNuRCxFQUFFLENBQUMsbUJBQW1CLENBQUMsc0JBQXNCLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUV6RSxXQUFXO0lBQ1gsSUFBTSxjQUFjLEdBQUcsRUFBRSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3pDLElBQUksQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUNsQixPQUFPLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxDQUFDLENBQUM7UUFDbEQsT0FBTztJQUNYLENBQUM7SUFFRCxFQUFFLENBQUMsVUFBVSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDL0MsSUFBTSx5QkFBeUIsR0FBRyxFQUFFLENBQUMsaUJBQWlCLENBQ2xELE9BQU8sRUFDUCxZQUFZLENBQ2YsQ0FBQztJQUNGLEVBQUUsQ0FBQyx1QkFBdUIsQ0FBQyx5QkFBeUIsQ0FBQyxDQUFDO0lBQ3RELEVBQUUsQ0FBQyxtQkFBbUIsQ0FBQyx5QkFBeUIsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBRTVFLGdEQUFnRDtJQUNoRCwrQkFBK0I7SUFDL0IsK0JBQStCO0lBQy9CLCtCQUErQjtJQUUvQixnRUFBZ0U7SUFDaEUsK0NBQStDO0lBQy9DLDRFQUE0RTtJQUU1RSxpREFBaUQ7SUFDakQsa0RBQWtEO0lBQ2xELCtFQUErRTtJQUUvRSxPQUFPO0lBQ1AsT0FBTztJQUNQLE9BQU87SUFDUCxxQ0FBcUM7SUFFckMsT0FBTztRQUNILGNBQWM7UUFDZCxPQUFPO1FBQ1AsV0FBVztRQUNYLEVBQUU7S0FDTCxDQUFDO0FBQ04sQ0FBQyxDQUFDO0FBRUYscUJBQWUsSUFBSSxDQUFDOzs7Ozs7Ozs7Ozs7OztBQ3RKYixJQUFNLG9CQUFvQixHQUFHLFVBQUMsQ0FBUyxFQUFFLENBQVM7SUFDckQsSUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3JCLElBQU0sRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUVyQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDeEMsQ0FBQyxDQUFDO0FBTFcsNEJBQW9CLHdCQUsvQjtBQUVLLElBQU0saUJBQWlCLEdBQUcsVUFBQyxFQUFVLEVBQUUsRUFBVSxFQUFFLEVBQVUsRUFBRSxFQUFVO0lBQzlFLElBQU0sRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLENBQUM7SUFDbkIsSUFBTSxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztJQUVuQixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxDQUFDLENBQUM7QUFDdEMsQ0FBQyxDQUFDO0FBTFcseUJBQWlCLHFCQUs1QjtBQUVGLFVBQVU7QUFDSCxJQUFNLFFBQVEsR0FBRyxVQUFDLE1BQWMsRUFBRSxNQUFjO0lBQ25ELElBQU0sWUFBWSxHQUFHLG9CQUFRLEVBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUNwRixPQUFPLFlBQVksSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLEdBQUcsR0FBRyxDQUFDO0FBQ2pGLENBQUM7QUFIWSxnQkFBUSxZQUdwQjtBQUVNLElBQU0sUUFBUSxHQUFHLFVBQUMsR0FBVztJQUNoQyxPQUFPLEdBQUcsR0FBRyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsQ0FBQztBQUMvQixDQUFDO0FBRlksZ0JBQVEsWUFFcEI7QUFFTSxJQUFNLFFBQVEsR0FBRyxVQUFDLEdBQVc7SUFDaEMsT0FBTyxHQUFHLEdBQUcsSUFBSSxDQUFDLEVBQUUsR0FBRyxHQUFHLENBQUM7QUFDL0IsQ0FBQztBQUZZLGdCQUFRLFlBRXBCO0FBRUQsU0FBZ0IsUUFBUSxDQUFDLEdBQVc7SUFDbEMsSUFBSSxNQUFNLEdBQUcsMkNBQTJDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ25FLE9BQU8sTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNkLENBQUMsRUFBRSxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQztRQUMxQixDQUFDLEVBQUUsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUM7UUFDMUIsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDO0tBQzNCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztBQUNYLENBQUM7QUFQRCw0QkFPQztBQUVELFNBQWdCLFFBQVEsQ0FBQyxDQUFTLEVBQUUsQ0FBUyxFQUFFLENBQVM7SUFDdEQsT0FBTyxHQUFHLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RFLENBQUM7QUFGRCw0QkFFQztBQUVZLFVBQUUsR0FBRztJQUNkLFFBQVEsRUFBRTtRQUNSLE9BQU87WUFDTCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDUixDQUFDO0lBQ0osQ0FBQztJQUVELFdBQVcsRUFBRSxVQUFTLEVBQVcsRUFBRSxFQUFXO1FBQzVDLE9BQU87WUFDTCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxFQUFFLEVBQUUsRUFBRSxFQUFFLENBQUM7U0FDVixDQUFDO0lBQ0osQ0FBQztJQUVELFFBQVEsRUFBRSxVQUFTLGNBQXVCO1FBQ3hDLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDbkMsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNuQyxPQUFPO1lBQ0wsQ0FBQyxFQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUCxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDUixDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLEVBQVcsRUFBRSxFQUFXO1FBQ3hDLE9BQU87WUFDTCxFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDUixDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUM7WUFDUixDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDUixDQUFDO0lBQ0osQ0FBQztJQUVELFFBQVEsRUFBRSxVQUFTLENBQVksRUFBRSxDQUFZO1FBQzNDLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE9BQU87WUFDTCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLENBQVk7UUFDNUIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFM0IsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUV2QixPQUFPO1lBQ0gsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkMsQ0FBQztJQUNOLENBQUM7SUFFQyxXQUFXLEVBQUUsVUFBUyxDQUFZLEVBQUUsQ0FBWTtRQUM5QyxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixPQUFPO1lBQ0wsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7U0FDbEMsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLEVBQUUsVUFBUyxDQUFZLEVBQUUsRUFBUyxFQUFFLEVBQVM7UUFDcEQsT0FBTyxVQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxNQUFNLEVBQUUsVUFBUyxDQUFVLEVBQUUsY0FBcUI7UUFDaEQsT0FBTyxVQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELEtBQUssRUFBRSxVQUFTLENBQVUsRUFBRSxFQUFTLEVBQUUsRUFBUztRQUM5QyxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNGLENBQUM7Ozs7Ozs7VUNuS0o7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Npc2tvbS8uL3NyYy9BcHBDYW52YXMudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQmFzZVNoYXBlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL0NvbG9yLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL1ZlcnRleC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvQ2FudmFzQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9GYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9MaW5lTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9SZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL1NxdWFyZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9DVlBvbHlnb25Ub29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9GYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9DVlBvbHlnb24udHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9GYW5Qb2x5Z29uLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvTGluZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1NxdWFyZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvY29udmV4SHVsbFV0aWxzLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvaW5pdC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZS9CYXNlU2hhcGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwQ2FudmFzIHtcclxuICAgIHByaXZhdGUgcHJvZ3JhbTogV2ViR0xQcm9ncmFtO1xyXG4gICAgcHJpdmF0ZSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xyXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXI7XHJcbiAgICBwcml2YXRlIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcjtcclxuICAgIHByaXZhdGUgX3VwZGF0ZVRvb2xiYXI6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgX3NoYXBlczogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPiA9IHt9O1xyXG5cclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBoZWlnaHQ6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gICAgICAgIHByb2dyYW06IFdlYkdMUHJvZ3JhbSxcclxuICAgICAgICBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXIsXHJcbiAgICAgICAgY29sb3JCdWZmZXI6IFdlYkdMQnVmZmVyXHJcbiAgICApIHtcclxuICAgICAgICB0aGlzLmdsID0gZ2w7XHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbkJ1ZmZlciA9IHBvc2l0aW9uQnVmZmVyO1xyXG4gICAgICAgIHRoaXMuY29sb3JCdWZmZXIgPSBjb2xvckJ1ZmZlcjtcclxuICAgICAgICB0aGlzLnByb2dyYW0gPSBwcm9ncmFtO1xyXG5cclxuICAgICAgICB0aGlzLndpZHRoID0gZ2wuY2FudmFzLndpZHRoO1xyXG4gICAgICAgIHRoaXMuaGVpZ2h0ID0gZ2wuY2FudmFzLmhlaWdodDtcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGdsID0gdGhpcy5nbDtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbkJ1ZmZlciA9IHRoaXMucG9zaXRpb25CdWZmZXI7XHJcbiAgICAgICAgY29uc3QgY29sb3JCdWZmZXIgPSB0aGlzLmNvbG9yQnVmZmVyO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuc2hhcGVzKS5mb3JFYWNoKChzaGFwZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBzaGFwZS5wb2ludExpc3QuZmxhdE1hcCgocG9pbnQpID0+IFtcclxuICAgICAgICAgICAgICAgIHBvaW50LngsXHJcbiAgICAgICAgICAgICAgICBwb2ludC55LFxyXG4gICAgICAgICAgICBdKTtcclxuXHJcbiAgICAgICAgICAgIGxldCBjb2xvcnM6IG51bWJlcltdID0gW107XHJcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBjb2xvcnMucHVzaChzaGFwZS5wb2ludExpc3RbaV0uYy5yLCBzaGFwZS5wb2ludExpc3RbaV0uYy5nLCBzaGFwZS5wb2ludExpc3RbaV0uYy5iKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gQmluZCBjb2xvciBkYXRhXHJcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksXHJcbiAgICAgICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgLy8gQmluZCBwb3NpdGlvbiBkYXRhXHJcbiAgICAgICAgICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XHJcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoXHJcbiAgICAgICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXHJcbiAgICAgICAgICAgICAgICBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyksXHJcbiAgICAgICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xyXG4gICAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEodGhpcy5wb3NpdGlvbkJ1ZmZlciBpbnN0YW5jZW9mIFdlYkdMQnVmZmVyKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiUG9zaXRpb24gYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICBpZiAoISh0aGlzLmNvbG9yQnVmZmVyIGluc3RhbmNlb2YgV2ViR0xCdWZmZXIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb2xvciBidWZmZXIgaXMgbm90IGEgdmFsaWQgV2ViR0xCdWZmZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcclxuICAgICAgICAgICAgLy8gc2hhcGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG1hdHJpeExvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKHRoaXMucHJvZ3JhbSwgXCJ1X3RyYW5zZm9ybWF0aW9uXCIpO1xyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgY29uc3QgbWF0cml4ID0gbmV3IEZsb2F0MzJBcnJheShzaGFwZS50cmFuc2Zvcm1hdGlvbk1hdHJpeCk7XHJcbiAgICAgICAgICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4TG9jYXRpb24sIGZhbHNlLCBtYXRyaXgpO1xyXG5cclxuICAgICAgICAgICAgLy8gY29uc3QgYXBwbHlTcGVjaWFsVHJlYXRtZW50TG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcInVfYXBwbHlTcGVjaWFsVHJlYXRtZW50XCIpO1xyXG4gICAgICAgICAgICAvLyBjb25zdCBzcGVjaWFsT2Zmc2V0TG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24odGhpcy5wcm9ncmFtLCBcInVfc3BlY2lhbE9mZnNldFwiKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIC8vIGNvbnN0IGFwcGx5U3BlY2lhbFRyZWF0bWVudCA9IGZhbHNlOyBcclxuICAgICAgICAgICAgLy8gY29uc3Qgc3BlY2lhbE9mZnNldCA9IFswLjAsIDAuMF07XHJcblxyXG4gICAgICAgICAgICAvLyBnbC51bmlmb3JtMWkoYXBwbHlTcGVjaWFsVHJlYXRtZW50TG9jYXRpb24sIGFwcGx5U3BlY2lhbFRyZWF0bWVudCA/IDEgOiAwKTtcclxuICAgICAgICAgICAgLy8gZ2wudW5pZm9ybTJmdihzcGVjaWFsT2Zmc2V0TG9jYXRpb24sIG5ldyBGbG9hdDMyQXJyYXkoc3BlY2lhbE9mZnNldCkpO1xyXG5cclxuICAgICAgICAgICAgZ2wuZHJhd0FycmF5cyhzaGFwZS5nbERyYXdUeXBlLCAwLCBzaGFwZS5wb2ludExpc3QubGVuZ3RoKTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzaGFwZXMoKTogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldCBzaGFwZXModjogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPikge1xyXG4gICAgICAgIHRoaXMuX3NoYXBlcyA9IHY7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBpZiAodGhpcy5fdXBkYXRlVG9vbGJhcilcclxuICAgICAgICAgICAgdGhpcy5fdXBkYXRlVG9vbGJhci5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdXBkYXRlVG9vbGJhcih2IDogKCkgPT4gdm9pZCkge1xyXG4gICAgICAgIHRoaXMuX3VwZGF0ZVRvb2xiYXIgPSB2O1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZW5lcmF0ZUlkRnJvbVRhZyh0YWc6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHdpdGhTYW1lVGFnID0gT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmZpbHRlcigoaWQpID0+IGlkLnN0YXJ0c1dpdGgodGFnICsgJy0nKSk7XHJcbiAgICAgICAgcmV0dXJuIGAke3RhZ30tJHt3aXRoU2FtZVRhZy5sZW5ndGggKyAxfWBcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkU2hhcGUoc2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMoc2hhcGUuaWQpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NoYXBlIElEIGFscmVhZHkgdXNlZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdTaGFwZXMgPSB7IC4uLnRoaXMuc2hhcGVzIH07XHJcbiAgICAgICAgbmV3U2hhcGVzW3NoYXBlLmlkXSA9IHNoYXBlO1xyXG4gICAgICAgIHRoaXMuc2hhcGVzID0gbmV3U2hhcGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlZGl0U2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKG5ld1NoYXBlLmlkKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBub3QgZm91bmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xyXG4gICAgICAgIG5ld1NoYXBlc1tuZXdTaGFwZS5pZF0gPSBuZXdTaGFwZTtcclxuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKG5ld1NoYXBlLmlkKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBub3QgZm91bmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xyXG4gICAgICAgIGRlbGV0ZSBuZXdTaGFwZXNbbmV3U2hhcGUuaWRdO1xyXG4gICAgICAgIHRoaXMuc2hhcGVzID0gbmV3U2hhcGVzO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IHsgbTMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuL0NvbG9yXCI7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4vVmVydGV4XCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBCYXNlU2hhcGUge1xyXG5cclxuICAgIHBvaW50TGlzdDogVmVydGV4W10gPSBbXTtcclxuICAgIGJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdDogVmVydGV4W10gPSBbXTtcclxuICAgIGlkOiBzdHJpbmc7XHJcbiAgICBjb2xvcjogQ29sb3I7XHJcbiAgICBnbERyYXdUeXBlOiBudW1iZXI7XHJcbiAgICBjZW50ZXI6IFZlcnRleDtcclxuXHJcbiAgICB0cmFuc2xhdGlvbjogW251bWJlciwgbnVtYmVyXSA9IFswLCAwXTtcclxuICAgIGFuZ2xlSW5SYWRpYW5zOiBudW1iZXIgPSAwO1xyXG4gICAgc2NhbGU6IFtudW1iZXIsIG51bWJlcl0gPSBbMSwgMV07XHJcblxyXG4gICAgdHJhbnNmb3JtYXRpb25NYXRyaXg6IG51bWJlcltdID0gbTMuaWRlbnRpdHkoKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihnbERyYXdUeXBlOiBudW1iZXIsIGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgY2VudGVyOiBWZXJ0ZXggPSBuZXcgVmVydGV4KDAsIDAsIGNvbG9yKSwgcm90YXRpb24gPSAwLCBzY2FsZVggPSAxLCBzY2FsZVkgPSAxKSB7XHJcbiAgICAgICAgdGhpcy5nbERyYXdUeXBlID0gZ2xEcmF3VHlwZTtcclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gY2VudGVyO1xyXG4gICAgICAgIHRoaXMuYW5nbGVJblJhZGlhbnMgPSByb3RhdGlvbjtcclxuICAgICAgICB0aGlzLnNjYWxlWzBdID0gc2NhbGVYO1xyXG4gICAgICAgIHRoaXMuc2NhbGVbMV0gPSBzY2FsZVk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCl7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG0zLmlkZW50aXR5KClcclxuICAgICAgICBjb25zdCB0cmFuc2xhdGVUb0NlbnRlciA9IG0zLnRyYW5zbGF0aW9uKC10aGlzLmNlbnRlci54LCAtdGhpcy5jZW50ZXIueSk7XHJcbiAgICAgICAgY29uc3Qgcm90YXRpb24gPSBtMy5yb3RhdGlvbih0aGlzLmFuZ2xlSW5SYWRpYW5zKTtcclxuICAgICAgICBsZXQgc2NhbGluZyA9IG0zLnNjYWxpbmcodGhpcy5zY2FsZVswXSwgdGhpcy5zY2FsZVsxXSk7XHJcbiAgICAgICAgbGV0IHRyYW5zbGF0ZUJhY2sgPSBtMy50cmFuc2xhdGlvbih0aGlzLmNlbnRlci54LCB0aGlzLmNlbnRlci55KTtcclxuICAgICAgICBjb25zdCB0cmFuc2xhdGUgPSBtMy50cmFuc2xhdGlvbih0aGlzLnRyYW5zbGF0aW9uWzBdLCB0aGlzLnRyYW5zbGF0aW9uWzFdKTtcclxuXHJcbiAgICAgICAgbGV0IHJlc1NjYWxlID0gbTMubXVsdGlwbHkoc2NhbGluZywgdHJhbnNsYXRlVG9DZW50ZXIpO1xyXG4gICAgICAgIGxldCByZXNSb3RhdGUgPSBtMy5tdWx0aXBseShyb3RhdGlvbixyZXNTY2FsZSk7XHJcbiAgICAgICAgbGV0IHJlc0JhY2sgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGVCYWNrLCByZXNSb3RhdGUpO1xyXG4gICAgICAgIGNvbnN0IHJlc1RyYW5zbGF0ZSA9IG0zLm11bHRpcGx5KHRyYW5zbGF0ZSwgcmVzQmFjayk7XHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHJlc1RyYW5zbGF0ZTtcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvciB7XHJcbiAgICByOiBudW1iZXI7XHJcbiAgICBnOiBudW1iZXI7XHJcbiAgICBiOiBudW1iZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gICAgICAgIHRoaXMuciA9IHI7XHJcbiAgICAgICAgdGhpcy5nID0gZztcclxuICAgICAgICB0aGlzLmIgPSBiO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBDb2xvciBmcm9tIFwiLi9Db2xvclwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVydGV4IHtcclxuICAgIHg6IG51bWJlcjtcclxuICAgIHk6IG51bWJlcjtcclxuICAgIGM6IENvbG9yO1xyXG4gICAgaXNTZWxlY3RlZCA6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIGM6IENvbG9yLCBpc1NlbGVjdGVkOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICB0aGlzLnggPSB4O1xyXG4gICAgICAgIHRoaXMueSA9IHk7XHJcbiAgICAgICAgdGhpcy5jID0gYztcclxuICAgICAgICB0aGlzLmlzU2VsZWN0ZWQgPSBpc1NlbGVjdGVkO1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9GYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZS9JU2hhcGVNYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgTGluZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0xpbmVNYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyJztcclxuaW1wb3J0IFNxdWFyZU1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL1NxdWFyZU1ha2VyQ29udHJvbGxlcic7XHJcblxyXG5lbnVtIEFWQUlMX1NIQVBFUyB7XHJcbiAgICBMaW5lID0gJ0xpbmUnLFxyXG4gICAgUmVjdGFuZ2xlID0gJ1JlY3RhbmdsZScsXHJcbiAgICBTcXVhcmUgPSAnU3F1YXJlJyxcclxuICAgIEZhblBvbHkgPSAnRmFuUG9seScsXHJcbiAgICBDVlBvbHkgPSAnQ1ZQb2x5JyxcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIF9zaGFwZUNvbnRyb2xsZXI6IElTaGFwZU1ha2VyQ29udHJvbGxlcjtcclxuICAgIHByaXZhdGUgY2FudmFzRWxtdDogSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGJ1dHRvbkNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGNvbG9yUGlja2VyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgc2V0UG9seWdvbkJ1dHRvbjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuXHJcbiAgICAgICAgY29uc3QgY2FudmFzRWxtdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdjJykgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICdzaGFwZS1idXR0b24tY29udGFpbmVyJ1xyXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2V0LXBvbHlnb24nXHJcbiAgICAgICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNFbG10ID0gY2FudmFzRWxtdDtcclxuICAgICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lciA9IGJ1dHRvbkNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRQb2x5Z29uQnV0dG9uLmNsYXNzTGlzdC5hZGQoJ2hpZGRlbicpO1xyXG4gICAgICAgIHRoaXMuX3NoYXBlQ29udHJvbGxlciA9IG5ldyBDVlBvbHlnb25NYWtlckNvbnRyb2xsZXIoYXBwQ2FudmFzKTtcclxuXHJcbiAgICAgICAgdGhpcy5jb2xvclBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2hhcGUtY29sb3ItcGlja2VyJ1xyXG4gICAgICAgICkgYXMgSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNFbG10Lm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WCA9IGUub2Zmc2V0WCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WSA9IGUub2Zmc2V0WSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlcj8uaGFuZGxlQ2xpY2soXHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0WCxcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RZLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvclBpY2tlci52YWx1ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBnZXQgc2hhcGVDb250cm9sbGVyKCk6IElTaGFwZU1ha2VyQ29udHJvbGxlciB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlQ29udHJvbGxlcjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldCBzaGFwZUNvbnRyb2xsZXIodjogSVNoYXBlTWFrZXJDb250cm9sbGVyKSB7XHJcbiAgICAgICAgdGhpcy5fc2hhcGVDb250cm9sbGVyID0gdjtcclxuXHJcbiAgICAgICAgdGhpcy5jYW52YXNFbG10Lm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WCA9IGUub2Zmc2V0WCAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICBjb25zdCBjb3JyZWN0WSA9IGUub2Zmc2V0WSAqIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgICAgICAgICB0aGlzLnNoYXBlQ29udHJvbGxlcj8uaGFuZGxlQ2xpY2soXHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0WCxcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RZLFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jb2xvclBpY2tlci52YWx1ZVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0Q29udHJvbGxlcihzaGFwZVN0cjogQVZBSUxfU0hBUEVTKTogSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcbiAgICAgICAgc3dpdGNoIChzaGFwZVN0cikge1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5MaW5lOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5lTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcclxuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuUmVjdGFuZ2xlOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5TcXVhcmU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNxdWFyZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLkZhblBvbHk6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5DVlBvbHk6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENWUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBzaGFwZSBzdHJpbmcnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdEV4aXN0aW5nRmFuUG9seWdvbihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgKHRoaXMuc2hhcGVDb250cm9sbGVyIGFzIEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIpLnNldEN1cnJlbnRQb2x5Z29uKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0RXhpc3RpbmdDVlBvbHlnb24oaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyID0gbmV3IENWUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgKHRoaXMuc2hhcGVDb250cm9sbGVyIGFzIENWUG9seWdvbk1ha2VyQ29udHJvbGxlcikuc2V0Q3VycmVudFBvbHlnb24oaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2hhcGVTdHIgaW4gQVZBSUxfU0hBUEVTKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2hhcGUtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHNoYXBlU3RyO1xyXG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyID0gdGhpcy5pbml0Q29udHJvbGxlcihcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZVN0ciBhcyBBVkFJTF9TSEFQRVNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IENvbG9yIGZyb20gJy4uLy4uLy4uL0Jhc2UvQ29sb3InO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gJy4uLy4uLy4uL0Jhc2UvVmVydGV4JztcclxuaW1wb3J0IENWUG9seWdvbiBmcm9tICcuLi8uLi8uLi9TaGFwZXMvQ1ZQb2x5Z29uJztcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vSVNoYXBlTWFrZXJDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENWUG9seWdvbk1ha2VyQ29udHJvbGxlclxyXG4gICAgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXJcclxue1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiBWZXJ0ZXggfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgc2Vjb25kUG9pbnQ6IFZlcnRleCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50UG9seTogQ1ZQb2x5Z29uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2V0LXBvbHlnb24nXHJcbiAgICAgICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRQb2ludCAhPT0gbnVsbFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRQb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNldEN1cnJlbnRQb2x5Z29uKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gdGhpcy5hcHBDYW52YXMuc2hhcGVzW2lkXSBhcyBDVlBvbHlnb247XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLmN1cnJlbnRQb2x5LnBvaW50TGlzdFswXTtcclxuICAgICAgICB0aGlzLnNlY29uZFBvaW50ID0gdGhpcy5jdXJyZW50UG9seS5wb2ludExpc3RbMV07XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBoZXhUb1JnYihoZXgpID8/IHsgcjogMCwgZzogMCwgYjogMCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ29yaWdpbiBzZXQnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLnNlY29uZFBvaW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWNvbmQgc2V0Jyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlY29uZFBvaW50ID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLnNlY29uZFBvaW50ICE9PSBudWxsICYmIHRoaXMuY3VycmVudFBvbHkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NoYXBlIHNldCcpO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdWZXJ0ZXggPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygncG9seWN2Jyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gbmV3IENWUG9seWdvbihpZCwgY29sb3IsIFt0aGlzLm9yaWdpbiwgdGhpcy5zZWNvbmRQb2ludCwgbmV3VmVydGV4XSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9seSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seS5hZGRWZXJ0ZXgobmV3VmVydGV4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZSh0aGlzLmN1cnJlbnRQb2x5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi8uLi8uLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IFZlcnRleCBmcm9tICcuLi8uLi8uLi9CYXNlL1ZlcnRleCc7XHJcbmltcG9ydCBGYW5Qb2x5Z29uIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9GYW5Qb2x5Z29uJztcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vSVNoYXBlTWFrZXJDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXJcclxuICAgIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyXHJcbntcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIG9yaWdpbjogVmVydGV4IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRQb2x5OiBGYW5Qb2x5Z29uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2V0LXBvbHlnb24nXHJcbiAgICAgICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seS5wb2ludExpc3QubGVuZ3RoID4gMlxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDdXJyZW50UG9seWdvbihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9seSA9IHRoaXMuYXBwQ2FudmFzLnNoYXBlc1tpZF0gYXMgRmFuUG9seWdvbjtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuY3VycmVudFBvbHkucG9pbnRMaXN0WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLmN1cnJlbnRQb2x5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdwb2x5ZmFuJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gbmV3IEZhblBvbHlnb24oaWQsIGNvbG9yLCBbdGhpcy5vcmlnaW4sIG5ld1ZlcnRleF0pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZSh0aGlzLmN1cnJlbnRQb2x5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdWZXJ0ZXggPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBvbHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkuYWRkVmVydGV4KG5ld1ZlcnRleCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5lZGl0U2hhcGUodGhpcy5jdXJyZW50UG9seSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vLi4vLi4vQmFzZS9Db2xvclwiO1xyXG5pbXBvcnQgTGluZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL0xpbmVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0ge3gsIHl9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtyLCBnLCBifSA9IGhleFRvUmdiKGhleCkgPz8ge3I6IDAsIGc6IDAsIGI6IDB9O1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyLzI1NSwgZy8yNTUsIGIvMjU1KTtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygnbGluZScpO1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoaWQsIGNvbG9yLCB0aGlzLm9yaWdpbi54LCB0aGlzLm9yaWdpbi55LCB4LCB5KTtcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdyZWN0YW5nbGUnKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdGhpcy5vcmlnaW4ueCwgdGhpcy5vcmlnaW4ueSwgeCwgeSwwLDEsMSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHJlY3RhbmdsZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9TcXVhcmVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdzcXVhcmUnKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHYxID0ge3g6IHgsIHk6IHl9O1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjF4OiAke3YxLnh9LCB2MXk6ICR7djEueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjIgPSB7eDogdGhpcy5vcmlnaW4ueCAtICh5IC0gdGhpcy5vcmlnaW4ueSksIFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSArICh4LXRoaXMub3JpZ2luLngpfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjJ4OiAke3YyLnh9LCB2Mnk6ICR7djIueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjMgPSB7eDogMip0aGlzLm9yaWdpbi54IC0geCwgXHJcbiAgICAgICAgICAgICAgICB5OiAyKnRoaXMub3JpZ2luLnkgLSB5fVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjN4OiAke3YzLnh9LCB2M3k6ICR7djMueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjQgPSB7eDogdGhpcy5vcmlnaW4ueCArICh5IC0gdGhpcy5vcmlnaW4ueSksIFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSAtICh4LXRoaXMub3JpZ2luLngpfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjR4OiAke3Y0Lnh9LCB2NHk6ICR7djQueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gbmV3IFNxdWFyZShcclxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdjEueCwgdjEueSwgdjIueCwgdjIueSwgdjMueCwgdjMueSwgdjQueCwgdjQueSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHNxdWFyZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBDVlBvbHlnb24gZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0NWUG9seWdvbic7XHJcbmltcG9ydCB7IGRlZ1RvUmFkLCBnZXRBbmdsZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi4vLi4vTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1ZQb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgc2NhbGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBERUZBVUxUX1NDQUxFID0gNTA7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50U2NhbGU6IG51bWJlciA9IDUwO1xyXG4gICAgcHJpdmF0ZSBjdlBvbHk6IENWUG9seWdvbjtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmYW5Qb2x5OiBDVlBvbHlnb24sXHJcbiAgICAgICAgYXBwQ2FudmFzOiBBcHBDYW52YXMsXHJcbiAgICAgICAgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZmFuUG9seSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIgPSBjYW52YXNDb250cm9sbGVyO1xyXG5cclxuICAgICAgICB0aGlzLmN2UG9seSA9IGZhblBvbHk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWCcsXHJcbiAgICAgICAgICAgICgpID0+IGZhblBvbHkucG9pbnRMaXN0WzBdLngsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy53aWR0aFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1hTbGlkZXIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFknLFxyXG4gICAgICAgICAgICAoKSA9PiBmYW5Qb2x5LnBvaW50TGlzdFswXS55LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NhbGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1NjYWxlJyxcclxuICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50U2NhbGUuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgMTAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMuc2NhbGVTbGlkZXIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY2FsZShwYXJzZUludCh0aGlzLnNjYWxlU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tVmVydGV4VG9vbGJhcigpIHtcclxuICAgICAgICBjb25zdCBhZGRWdHhCdXR0b24gPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbignQWRkIFZlcnRleCcpO1xyXG4gICAgICAgIGFkZFZ0eEJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIuZWRpdEV4aXN0aW5nQ1ZQb2x5Z29uKHRoaXMuY3ZQb2x5LmlkKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbW92ZVZ0eEJ1dHRvbiA9IHRoaXMuY3JlYXRlVmVydGV4QnV0dG9uKCdSZW1vdmUgVmVydGV4Jyk7XHJcbiAgICAgICAgcmVtb3ZlVnR4QnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3ZQb2x5LnJlbW92ZVZlcnRleChwYXJzZUludCh0aGlzLnNlbGVjdGVkVmVydGV4KSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmN2UG9seSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVmcmVzaFZlcnRleExpc3QgPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbihcIlJlZnJlc2ggVmVydGljZXMgRHJvcGRvd25cIik7XHJcbiAgICAgICAgcmVmcmVzaFZlcnRleExpc3Qub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVZlcnRleEJ1dHRvbih0ZXh0OiBzdHJpbmcpOiBIVE1MQnV0dG9uRWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1ggLSB0aGlzLmN2UG9seS5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3QgPSB0aGlzLmN2UG9seS5wb2ludExpc3QubWFwKCh2dHgpID0+IHtcclxuICAgICAgICAgICAgdnR4LnggKz0gZGlmZjtcclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmN2UG9seS5yZWNhbGMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuY3ZQb2x5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1kgLSB0aGlzLmN2UG9seS5wb2ludExpc3RbMF0ueTtcclxuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3QgPSB0aGlzLmN2UG9seS5wb2ludExpc3QubWFwKCh2dHgsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICB2dHgueSArPSBkaWZmO1xyXG4gICAgICAgICAgICByZXR1cm4gdnR4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnJlY2FsYygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5jdlBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q3VycmVudFNjYWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNjYWxlKG5ld1NjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY2FsZSA9IG5ld1NjYWxlO1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnBvaW50TGlzdCA9IHRoaXMuY3ZQb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKGdldEFuZ2xlKHRoaXMuY3ZQb2x5LmNlbnRlciwgdnR4KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XHJcblxyXG4gICAgICAgICAgICB2dHgueCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN2UG9seS5jZW50ZXIueCArXHJcbiAgICAgICAgICAgICAgICBjb3MgKlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3ZQb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuICAgICAgICAgICAgdnR4LnkgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdlBvbHkuY2VudGVyLnkgLVxyXG4gICAgICAgICAgICAgICAgc2luICpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN2UG9seS5sZW5MaXN0W2lkeF0gKlxyXG4gICAgICAgICAgICAgICAgICAgIChuZXdTY2FsZSAvIHRoaXMuREVGQVVMVF9TQ0FMRSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdnR4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5jdlBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3RbaWR4XS54ID0geDtcclxuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3RbaWR4XS55ID0geTtcclxuICAgICAgICB0aGlzLmN2UG9seS5yZWNhbGMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmN2UG9seSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgRmFuUG9seWdvbiBmcm9tICcuLi8uLi8uLi9TaGFwZXMvRmFuUG9seWdvbic7XHJcbmltcG9ydCB7IGRlZ1RvUmFkLCBnZXRBbmdsZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi4vLi4vTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFuUG9seWdvblRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHNjYWxlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgREVGQVVMVF9TQ0FMRSA9IDUwO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudFNjYWxlOiBudW1iZXIgPSA1MDtcclxuICAgIHByaXZhdGUgZmFuUG9seTogRmFuUG9seWdvbjtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmYW5Qb2x5OiBGYW5Qb2x5Z29uLFxyXG4gICAgICAgIGFwcENhbnZhczogQXBwQ2FudmFzLFxyXG4gICAgICAgIGNhbnZhc0NvbnRyb2xsZXI6IENhbnZhc0NvbnRyb2xsZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKGZhblBvbHksIGFwcENhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250cm9sbGVyID0gY2FudmFzQ29udHJvbGxlcjtcclxuXHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5ID0gZmFuUG9seTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcclxuICAgICAgICAgICAgKCkgPT4gZmFuUG9seS5wb2ludExpc3RbMF0ueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWScsXHJcbiAgICAgICAgICAgICgpID0+IGZhblBvbHkucG9pbnRMaXN0WzBdLnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2FsZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnU2NhbGUnLFxyXG4gICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRTY2FsZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICAxMDBcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5zY2FsZVNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjYWxlKHBhcnNlSW50KHRoaXMuc2NhbGVTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjdXN0b21WZXJ0ZXhUb29sYmFyKCkge1xyXG4gICAgICAgIGNvbnN0IGFkZFZ0eEJ1dHRvbiA9IHRoaXMuY3JlYXRlVmVydGV4QnV0dG9uKCdBZGQgVmVydGV4Jyk7XHJcbiAgICAgICAgYWRkVnR4QnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlci5lZGl0RXhpc3RpbmdGYW5Qb2x5Z29uKHRoaXMuZmFuUG9seS5pZCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCByZW1vdmVWdHhCdXR0b24gPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbignUmVtb3ZlIFZlcnRleCcpO1xyXG4gICAgICAgIHJlbW92ZVZ0eEJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmZhblBvbHkucmVtb3ZlVmVydGV4KHBhcnNlSW50KHRoaXMuc2VsZWN0ZWRWZXJ0ZXgpKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVmcmVzaFZlcnRleExpc3QgPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbihcIlJlZnJlc2ggVmVydGljZXMgRHJvcGRvd25cIik7XHJcbiAgICAgICAgcmVmcmVzaFZlcnRleExpc3Qub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVZlcnRleEJ1dHRvbih0ZXh0OiBzdHJpbmcpOiBIVE1MQnV0dG9uRWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1ggLSB0aGlzLmZhblBvbHkucG9pbnRMaXN0WzBdLng7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnBvaW50TGlzdCA9IHRoaXMuZmFuUG9seS5wb2ludExpc3QubWFwKCh2dHgpID0+IHtcclxuICAgICAgICAgICAgdnR4LnggKz0gZGlmZjtcclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucmVjYWxjKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWSAtIHRoaXMuZmFuUG9seS5wb2ludExpc3RbMF0ueTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIHZ0eC55ICs9IGRpZmY7XHJcbiAgICAgICAgICAgIHJldHVybiB2dHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnJlY2FsYygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5mYW5Qb2x5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEN1cnJlbnRTY2FsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTY2FsZShuZXdTY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSBuZXdTY2FsZTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKGdldEFuZ2xlKHRoaXMuZmFuUG9seS5jZW50ZXIsIHZ0eCkpO1xyXG4gICAgICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWQpO1xyXG4gICAgICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xyXG5cclxuICAgICAgICAgICAgdnR4LnggPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5LmNlbnRlci54ICtcclxuICAgICAgICAgICAgICAgIGNvcyAqXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuICAgICAgICAgICAgdnR4LnkgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5LmNlbnRlci55IC1cclxuICAgICAgICAgICAgICAgIHNpbiAqXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2dHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0W2lkeF0ueCA9IHg7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnBvaW50TGlzdFtpZHhdLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5yZWNhbGMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IExpbmUgZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0xpbmUnO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBsZW5ndGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBsaW5lOiBMaW5lO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxpbmU6IExpbmUsIGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgc3VwZXIobGluZSwgYXBwQ2FudmFzKTtcclxuXHJcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcclxuXHJcbiAgICAgICAgY29uc3QgZGlhZ29uYWwgPSBNYXRoLnNxcnQoXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy53aWR0aCAqIGFwcENhbnZhcy53aWR0aCArXHJcbiAgICAgICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0ICogYXBwQ2FudmFzLmhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ0xlbmd0aCcsXHJcbiAgICAgICAgICAgICgpID0+IGxpbmUubGVuZ3RoLFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBkaWFnb25hbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZW5ndGgocGFyc2VJbnQodGhpcy5sZW5ndGhTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcclxuICAgICAgICAgICAgKCkgPT4gbGluZS5wb2ludExpc3RbMF0ueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFknLFxyXG4gICAgICAgICAgICAoKSA9PiBsaW5lLnBvaW50TGlzdFswXS55LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsIHRoaXMuY3VycmVudEFuZ2xlLmJpbmQodGhpcyksIDAsIDM2MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbihwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTGVuZ3RoKG5ld0xlbjogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgbGluZUxlbiA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLFxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBjb3MgPVxyXG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS54IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS54KSAvIGxpbmVMZW47XHJcbiAgICAgICAgY29uc3Qgc2luID1cclxuICAgICAgICAgICAgKHRoaXMubGluZS5wb2ludExpc3RbMV0ueSAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSkgLyBsaW5lTGVuO1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9IG5ld0xlbiAqIGNvcyArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgPSBuZXdMZW4gKiBzaW4gKyB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnk7XHJcblxyXG4gICAgICAgIHRoaXMubGluZS5sZW5ndGggPSBuZXdMZW47XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMubGluZS5wb2ludExpc3RbMV0ueCAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnggPSBuZXdQb3NYO1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9IG5ld1Bvc1ggKyBkaWZmO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMubGluZS5wb2ludExpc3RbMV0ueSAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueTtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnkgPSBuZXdQb3NZO1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld1Bvc1kgKyBkaWZmO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGN1cnJlbnRBbmdsZSgpIHtcclxuICAgICAgICByZXR1cm4gZ2V0QW5nbGUodGhpcy5saW5lLnBvaW50TGlzdFswXSwgdGhpcy5saW5lLnBvaW50TGlzdFsxXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3Q6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKG5ld1JvdCk7XHJcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MocmFkKTtcclxuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggPVxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnggKyBjb3MgKiB0aGlzLmxpbmUubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9XHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSAtIHNpbiAqIHRoaXMubGluZS5sZW5ndGg7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFtpZHhdLnggPSB4O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbaWR4XS55ID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5saW5lLmxlbmd0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLFxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGN1c3RvbVZlcnRleFRvb2xiYXIoKTogdm9pZCB7fVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IFJlY3RhbmdsZSBmcm9tICcuLi8uLi8uLi9TaGFwZXMvUmVjdGFuZ2xlJztcclxuaW1wb3J0IHsgZGVnVG9SYWQgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgd2lkdGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGxlbmd0aFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgcmVjdGFuZ2xlOiBSZWN0YW5nbGU7XHJcblxyXG4gICAgY29uc3RydWN0b3IocmVjdGFuZ2xlOiBSZWN0YW5nbGUsIGFwcENhbnZhczogQXBwQ2FudmFzKXtcclxuICAgICAgICBzdXBlcihyZWN0YW5nbGUsIGFwcENhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUgPSByZWN0YW5nbGU7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBYJywgKCkgPT4gcGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSwtMC41KmFwcENhbnZhcy53aWR0aCwwLjUqYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUG9zaXRpb24gWScsICgpID0+IChwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKSwtMC41KmFwcENhbnZhcy53aWR0aCwwLjUqYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLmxlbmd0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdMZW5ndGgnLCAoKSA9PiBwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSksIDE1MCw0NTApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5sZW5ndGhTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVMZW5ndGgocGFyc2VJbnQodGhpcy5sZW5ndGhTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMud2lkdGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignV2lkdGgnLCAoKSA9PiBwYXJzZUludCh0aGlzLndpZHRoU2xpZGVyLnZhbHVlKSwgMTUwLDQ1MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLndpZHRoU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlV2lkdGgocGFyc2VJbnQodGhpcy53aWR0aFNsaWRlci52YWx1ZSkpfSlcclxuXHJcbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUm90YXRpb24nLCAoKSA9PiBwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSksIC0zNjAsIDM2MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSl9KVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWChuZXdQb3NYOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUudHJhbnNsYXRpb25bMF0gPSBuZXdQb3NYO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUudHJhbnNsYXRpb25bMV0gPSBuZXdQb3NZO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTGVuZ3RoKG5ld0xlbmd0aDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLnNjYWxlWzBdID0gbmV3TGVuZ3RoLzMwMDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVdpZHRoKG5ld1dpZHRoOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2NhbGVbMV0gPSBuZXdXaWR0aC8zMDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3RhdGlvbiA6bnVtYmVyKXtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKG5ld1JvdGF0aW9uKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInJvdGF0aW9uOiBcIiwgbmV3Um90YXRpb24pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5yZWN0YW5nbGUpO1xyXG4gICAgICAgIGZvcihsZXQgaT0wOyBpPDQ7IGkrKyl7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwieDogXCIsIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS54LCBcInk6XCIsdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ4YXdhbCA6XCIgLCB4KTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ5YXdhbDogXCIgLCB5KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGNlbnRlclggPSAodGhpcy5yZWN0YW5nbGUuaW5pdGlhbFBvaW50WzBdICsgdGhpcy5yZWN0YW5nbGUuZW5kUG9pbnRbMF0pIC8gMjtcclxuICAgICAgICAgICAgY29uc3QgY2VudGVyWSA9ICh0aGlzLnJlY3RhbmdsZS5pbml0aWFsUG9pbnRbMV0gKyB0aGlzLnJlY3RhbmdsZS5lbmRQb2ludFsxXSkgLyAyO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBsZXQgdHJhbnNsYXRlZFggPSB4IC0gY2VudGVyWDtcclxuICAgICAgICAgICAgbGV0IHRyYW5zbGF0ZWRZID0geSAtIGNlbnRlclk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnM7IC8vIEludmVyc2Ugcm90YXRpb24gYW5nbGVcclxuICAgICAgICAgICAgY29uc3QgZHggPSB0cmFuc2xhdGVkWCAqIE1hdGguY29zKGFuZ2xlKSAtIHRyYW5zbGF0ZWRZICogTWF0aC5zaW4oYW5nbGUpO1xyXG4gICAgICAgICAgICBjb25zdCBkeSA9IHRyYW5zbGF0ZWRYICogTWF0aC5zaW4oYW5nbGUpICsgdHJhbnNsYXRlZFkgKiBNYXRoLmNvcyhhbmdsZSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsWCA9IGR4ICsgY2VudGVyWDtcclxuICAgICAgICAgICAgY29uc3Qgb3JpZ2luYWxZID0gZHkgKyBjZW50ZXJZO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgbW92ZW1lbnRYID0gb3JpZ2luYWxYIC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueDtcclxuICAgICAgICAgICAgY29uc3QgbW92ZW1lbnRZID0gb3JpZ2luYWxZIC0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ4OlwiICwgbW92ZW1lbnRYKTtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJ5OlwiICxtb3ZlbWVudFkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaWR4XS54ICs9IG1vdmVtZW50WDtcclxuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2lkeF0ueSArPSBtb3ZlbWVudFk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBhZGphY2VudFZlcnRpY2VzID0gWzAsIDEsIDIsIDNdLmZpbHRlcihpID0+IGkgIT09IGlkeCAmJiBpICE9PSB0aGlzLnJlY3RhbmdsZS5maW5kT3Bwb3NpdGUoaWR4KSk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBwb2ludExpc3QgPSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3Q7XHJcbiAgICAgICAgICAgIGNvbnN0IGN3QWRqYWNlbnRJZHggPSB0aGlzLnJlY3RhbmdsZS5maW5kQ1dBZGphY2VudChpZHgpO1xyXG4gICAgICAgICAgICBjb25zdCBjY3dBZGphY2VudElkeCA9IHRoaXMucmVjdGFuZ2xlLmZpbmRDQ1dBZGphY2VudChpZHgpO1xyXG5cclxuICAgICAgICAgICAgY29uc3Qgb3Bwb3NpdGVJZHggPSB0aGlzLnJlY3RhbmdsZS5maW5kT3Bwb3NpdGUoaWR4KTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IG9wcG9zaXRlUG9pbnRYID0gcG9pbnRMaXN0W29wcG9zaXRlSWR4XS54O1xyXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZVBvaW50WSA9IHBvaW50TGlzdFtvcHBvc2l0ZUlkeF0ueTtcclxuXHJcbiAgICAgICAgICAgIC8vIFRvIGF2b2lkIHN0dWNrXHJcbiAgICAgICAgICAgIGFkamFjZW50VmVydGljZXMuZm9yRWFjaCh2ZXJ0ZXhJZHggPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZlcnRleElkeCA9PT0gY3dBZGphY2VudElkeCB8fCB2ZXJ0ZXhJZHggPT09IGNjd0FkamFjZW50SWR4KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmVydGV4UG9pbnQgPSBwb2ludExpc3RbdmVydGV4SWR4XTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBvaW50LnggPT09IG9wcG9zaXRlUG9pbnRYICYmIHZlcnRleFBvaW50LnkgPT09IG9wcG9zaXRlUG9pbnRZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChNYXRoLmFicyhtb3ZlbWVudFgpID4gTWF0aC5hYnMobW92ZW1lbnRZKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4UG9pbnQueCArPSBtb3ZlbWVudFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC55ICs9IG1vdmVtZW50WTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ZXJ0ZXhQb2ludC54ICE9PSBvcHBvc2l0ZVBvaW50WCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGV4UG9pbnQueCArPSBtb3ZlbWVudFg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHZlcnRleFBvaW50LnkgIT09IG9wcG9zaXRlUG9pbnRZKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0ZXhQb2ludC55ICs9IG1vdmVtZW50WTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGN1c3RvbVZlcnRleFRvb2xiYXIoKTogdm9pZCB7fVxyXG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uLy4uLy4uL0Jhc2UvQmFzZVNoYXBlJztcclxuaW1wb3J0IENvbG9yIGZyb20gJy4uLy4uLy4uL0Jhc2UvQ29sb3InO1xyXG5pbXBvcnQgeyBoZXhUb1JnYiwgcmdiVG9IZXggfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcblxyXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwdWJsaWMgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIHNoYXBlOiBCYXNlU2hhcGU7XHJcblxyXG4gICAgcHJpdmF0ZSB0b29sYmFyQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHB1YmxpYyB2ZXJ0ZXhDb250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgIHB1YmxpYyB2ZXJ0ZXhQaWNrZXI6IEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgcHVibGljIHNlbGVjdGVkVmVydGV4ID0gJzAnO1xyXG5cclxuICAgIHB1YmxpYyB2dHhQb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwdWJsaWMgdnR4UG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHZ0eENvbG9yUGlja2VyOiBIVE1MSW5wdXRFbGVtZW50IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgcHJpdmF0ZSBzbGlkZXJMaXN0OiBIVE1MSW5wdXRFbGVtZW50W10gPSBbXTtcclxuICAgIHByaXZhdGUgZ2V0dGVyTGlzdDogKCgpID0+IG51bWJlcilbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHNoYXBlOiBCYXNlU2hhcGUsIGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5zaGFwZSA9IHNoYXBlO1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3Rvb2xiYXItY29udGFpbmVyJ1xyXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICd2ZXJ0ZXgtY29udGFpbmVyJ1xyXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4UGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICd2ZXJ0ZXgtcGlja2VyJ1xyXG4gICAgICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgbGFiZWw6IHN0cmluZyxcclxuICAgICAgICB2YWx1ZUdldHRlcjogKCkgPT4gbnVtYmVyLFxyXG4gICAgICAgIG1pbjogbnVtYmVyLFxyXG4gICAgICAgIG1heDogbnVtYmVyXHJcbiAgICApOiBIVE1MSW5wdXRFbGVtZW50IHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9vbGJhci1zbGlkZXItY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGxhYmVsRWxtdC50ZXh0Q29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xyXG5cclxuICAgICAgICBjb25zdCBzbGlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICAgICAgc2xpZGVyLnR5cGUgPSAncmFuZ2UnO1xyXG4gICAgICAgIHNsaWRlci5taW4gPSBtaW4udG9TdHJpbmcoKTtcclxuICAgICAgICBzbGlkZXIubWF4ID0gbWF4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgc2xpZGVyLnZhbHVlID0gdmFsdWVHZXR0ZXIoKS50b1N0cmluZygpO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChzbGlkZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgdGhpcy5zbGlkZXJMaXN0LnB1c2goc2xpZGVyKTtcclxuICAgICAgICB0aGlzLmdldHRlckxpc3QucHVzaCh2YWx1ZUdldHRlcik7XHJcblxyXG4gICAgICAgIHJldHVybiBzbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0ZXJTbGlkZXIoc2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50LCBjYjogKGU6IEV2ZW50KSA9PiBhbnkpIHtcclxuICAgICAgICBjb25zdCBuZXdDYiA9IChlOiBFdmVudCkgPT4ge1xyXG4gICAgICAgICAgICBjYihlKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTbGlkZXJzKHNsaWRlcik7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBzbGlkZXIub25jaGFuZ2UgPSBuZXdDYjtcclxuICAgICAgICBzbGlkZXIub25pbnB1dCA9IG5ld0NiO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNoYXBlKG5ld1NoYXBlOiBCYXNlU2hhcGUpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcy5lZGl0U2hhcGUobmV3U2hhcGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNsaWRlcnMoaWdub3JlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50KSB7XHJcbiAgICAgICAgdGhpcy5zbGlkZXJMaXN0LmZvckVhY2goKHNsaWRlciwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpZ25vcmVTbGlkZXIgPT09IHNsaWRlcikgcmV0dXJuO1xyXG4gICAgICAgICAgICBzbGlkZXIudmFsdWUgPSB0aGlzLmdldHRlckxpc3RbaWR4XSgpLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnZ0eFBvc1hTbGlkZXIgJiYgdGhpcy52dHhQb3NZU2xpZGVyKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGlkeCA9IHBhcnNlSW50KHRoaXMudmVydGV4UGlja2VyLnZhbHVlKTtcclxuICAgICAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy5zaGFwZS5wb2ludExpc3RbaWR4XTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudnR4UG9zWFNsaWRlci52YWx1ZSA9IHZlcnRleC54LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIHRoaXMudnR4UG9zWVNsaWRlci52YWx1ZSA9IHZlcnRleC55LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNyZWF0ZVNsaWRlclZlcnRleChcclxuICAgICAgICBsYWJlbDogc3RyaW5nLFxyXG4gICAgICAgIGN1cnJlbnRMZW5ndGg6IG51bWJlcixcclxuICAgICAgICBtaW46IG51bWJlcixcclxuICAgICAgICBtYXg6IG51bWJlclxyXG4gICAgKTogSFRNTElucHV0RWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxFbG10KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgIHNsaWRlci50eXBlID0gJ3JhbmdlJztcclxuICAgICAgICBzbGlkZXIubWluID0gbWluLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgc2xpZGVyLm1heCA9IG1heC50b1N0cmluZygpO1xyXG4gICAgICAgIHNsaWRlci52YWx1ZSA9IGN1cnJlbnRMZW5ndGgudG9TdHJpbmcoKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHNsaWRlcjtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVDb2xvclBpY2tlclZlcnRleChsYWJlbDogc3RyaW5nLCBoZXg6IHN0cmluZyk6IEhUTUxJbnB1dEVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFiZWxFbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGNvbG9yUGlja2VyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgIGNvbG9yUGlja2VyLnR5cGUgPSAnY29sb3InO1xyXG4gICAgICAgIGNvbG9yUGlja2VyLnZhbHVlID0gaGV4O1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb2xvclBpY2tlcik7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIHJldHVybiBjb2xvclBpY2tlcjtcclxuICAgIH1cclxuXHJcbiAgICBkcmF3VmVydGV4VG9vbGJhcigpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy52ZXJ0ZXhDb250YWluZXIuZmlyc3RDaGlsZClcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy52ZXJ0ZXhDb250YWluZXIuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGlkeCA9IHBhcnNlSW50KHRoaXMudmVydGV4UGlja2VyLnZhbHVlKTtcclxuICAgICAgICBjb25zdCB2ZXJ0ZXggPSB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdO1xyXG5cclxuICAgICAgICB0aGlzLnZ0eFBvc1hTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlclZlcnRleChcclxuICAgICAgICAgICAgJ1BvcyBYJyxcclxuICAgICAgICAgICAgdmVydGV4LngsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLndpZHRoXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy52dHhQb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXJWZXJ0ZXgoXHJcbiAgICAgICAgICAgICdQb3MgWScsXHJcbiAgICAgICAgICAgIHZlcnRleC55LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5oZWlnaHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCB1cGRhdGVTbGlkZXIgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZ0eFBvc1hTbGlkZXIgJiYgdGhpcy52dHhQb3NZU2xpZGVyKVxyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVWZXJ0ZXgoXHJcbiAgICAgICAgICAgICAgICAgICAgaWR4LFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHRoaXMudnR4UG9zWFNsaWRlci52YWx1ZSksXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NZU2xpZGVyLnZhbHVlKVxyXG4gICAgICAgICAgICAgICAgKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnZ0eENvbG9yUGlja2VyID0gdGhpcy5jcmVhdGVDb2xvclBpY2tlclZlcnRleChcclxuICAgICAgICAgICAgJ0NvbG9yJyxcclxuICAgICAgICAgICAgcmdiVG9IZXgodmVydGV4LmMuciAqIDI1NSwgdmVydGV4LmMuZyAqIDI1NSwgdmVydGV4LmMuYiAqIDI1NSlcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICBjb25zdCB1cGRhdGVDb2xvciA9ICgpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBoZXhUb1JnYihcclxuICAgICAgICAgICAgICAgIHRoaXMudnR4Q29sb3JQaWNrZXI/LnZhbHVlID8/ICcjMDAwMDAwJ1xyXG4gICAgICAgICAgICApID8/IHsgcjogMCwgZzogMCwgYjogMCB9O1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1KTtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coYHVwZGF0aW5nIGlkeDogJHtpZHh9YCk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdLmMgPSBjb2xvcjtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNoYXBlKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4UG9zWFNsaWRlciwgdXBkYXRlU2xpZGVyKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4UG9zWVNsaWRlciwgdXBkYXRlU2xpZGVyKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMudnR4Q29sb3JQaWNrZXIsIHVwZGF0ZUNvbG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5jdXN0b21WZXJ0ZXhUb29sYmFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaW5pdFZlcnRleFRvb2xiYXIoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMudmVydGV4UGlja2VyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4UGlja2VyLnJlbW92ZUNoaWxkKHRoaXMudmVydGV4UGlja2VyLmZpcnN0Q2hpbGQpO1xyXG5cclxuICAgICAgICB0aGlzLnNoYXBlLnBvaW50TGlzdC5mb3JFYWNoKChfLCBpZHgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICAgIG9wdGlvbi52YWx1ZSA9IGlkeC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICBvcHRpb24ubGFiZWwgPSBgVmVydGV4ICR7aWR4fWA7XHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4UGlja2VyLmFwcGVuZENoaWxkKG9wdGlvbik7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4UGlja2VyLnZhbHVlID0gJzAnO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRWZXJ0ZXggPSB0aGlzLnZlcnRleFBpY2tlci52YWx1ZTtcclxuICAgICAgICB0aGlzLmRyYXdWZXJ0ZXhUb29sYmFyKCk7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4UGlja2VyLm9uY2hhbmdlID0gKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkVmVydGV4ID0gdGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGFic3RyYWN0IGN1c3RvbVZlcnRleFRvb2xiYXIoKTogdm9pZDtcclxuICAgIGFic3RyYWN0IHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkO1xyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IFNxdWFyZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL1NxdWFyZVwiO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCB9IGZyb20gXCIuLi8uLi8uLi91dGlsc1wiO1xyXG5pbXBvcnQgeyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIH0gZnJvbSBcIi4vU2hhcGVUb29sYmFyQ29udHJvbGxlclwiO1xyXG5cclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNxdWFyZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHNpemVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJvdGF0ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIC8vIHByaXZhdGUgcG9pbnRTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBzcXVhcmU6IFNxdWFyZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzcXVhcmU6IFNxdWFyZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpe1xyXG4gICAgICAgIHN1cGVyKHNxdWFyZSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLnNxdWFyZSA9IHNxdWFyZTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFgnLCAoKSA9PiBwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBZJywgKCkgPT4gKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpLC0wLjUqYXBwQ2FudmFzLndpZHRoLDAuNSphcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMuc2l6ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdTaXplJywgKCkgPT4gcGFyc2VJbnQodGhpcy5zaXplU2xpZGVyLnZhbHVlKSwgMTUwLDQ1MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnNpemVTbGlkZXIsIChlKSA9PiB7dGhpcy51cGRhdGVTaXplKHBhcnNlSW50KHRoaXMuc2l6ZVNsaWRlci52YWx1ZSkpfSlcclxuXHJcbiAgICAgICAgdGhpcy5yb3RhdGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignUm90YXRpb24nLCAoKSA9PiBwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSksIC0zNjAsIDM2MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVJvdGF0aW9uKHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKSl9KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuc3F1YXJlLnRyYW5zbGF0aW9uWzBdID0gbmV3UG9zWDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuc3F1YXJlLnRyYW5zbGF0aW9uWzFdID0gbmV3UG9zWTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNpemUobmV3U2l6ZTpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuc3F1YXJlLnNjYWxlWzBdID0gbmV3U2l6ZS8zMDA7XHJcbiAgICAgICAgdGhpcy5zcXVhcmUuc2NhbGVbMV0gPSBuZXdTaXplLzMwMDtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKG5ld1JvdGF0aW9uIDpudW1iZXIpe1xyXG4gICAgICAgIHRoaXMuc3F1YXJlLmFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQobmV3Um90YXRpb24pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zcXVhcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhcInRlc3RpbmdcIik7XHJcblxyXG4gICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc3F1YXJlLmJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdFtpZHhdO1xyXG4gICAgICAgIC8vIGNvbnN0IG9wcG9zaXRlID0gKGlkeCArIDIpICUgNFxyXG4gICAgICAgIC8vIGNvbnN0IG9yaWdpblggPSB0aGlzLnNxdWFyZS5wb2ludExpc3Rbb3Bwb3NpdGVdLng7XHJcbiAgICAgICAgLy8gY29uc3Qgb3JpZ2luWSA9IHRoaXMuc3F1YXJlLnBvaW50TGlzdFtvcHBvc2l0ZV0ueTtcclxuICAgICAgICBcclxuXHJcbiAgICAgICAgLy8gY29uc3QgdHJhbnNsYXRlVG9DZW50ZXIgPSBtMy50cmFuc2xhdGlvbigtb3JpZ2luWCwgLW9yaWdpblkpO1xyXG4gICAgICAgIC8vIGxldCBzY2FsaW5nID0gbTMuc2NhbGluZyh4LCB5KTtcclxuICAgICAgICAvLyBsZXQgdHJhbnNsYXRlQmFjayA9IG0zLnRyYW5zbGF0aW9uKG9yaWdpblgsIG9yaWdpblkpO1xyXG5cclxuICAgICAgICAvLyBsZXQgcmVzU2NhbGUgPSBtMy5tdWx0aXBseShzY2FsaW5nLCB0cmFuc2xhdGVUb0NlbnRlcik7XHJcbiAgICAgICAgLy8gbGV0IHJlc0JhY2sgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGVCYWNrLCByZXNTY2FsZSk7XHJcbiAgICAgICAgLy8gY29uc3QgcmVzVmVydGV4VXBkYXRlID0gbTMubXVsdGlwbHkocmVzQmFjaywgdGhpcy5zcXVhcmUudHJhbnNmb3JtYXRpb25NYXRyaXgpXHJcbiAgICAgICAgLy8gdGhpcy5zcXVhcmUudHJhbnNmb3JtYXRpb25NYXRyaXggPSByZXNWZXJ0ZXhVcGRhdGU7XHJcblxyXG4gICAgICAgIC8vIHRoaXMuc3F1YXJlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgIHZlcnRleC54ID0geDtcclxuICAgICAgICB2ZXJ0ZXgueSA9IHk7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zcXVhcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGN1c3RvbVZlcnRleFRvb2xiYXIoKTogdm9pZCB7fVxyXG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgQ1ZQb2x5Z29uIGZyb20gJy4uLy4uL1NoYXBlcy9DVlBvbHlnb24nO1xyXG5pbXBvcnQgRmFuUG9seWdvbiBmcm9tICcuLi8uLi9TaGFwZXMvRmFuUG9seWdvbic7XHJcbmltcG9ydCBMaW5lIGZyb20gJy4uLy4uL1NoYXBlcy9MaW5lJztcclxuaW1wb3J0IFJlY3RhbmdsZSBmcm9tICcuLi8uLi9TaGFwZXMvUmVjdGFuZ2xlJztcclxuaW1wb3J0IFNxdWFyZSBmcm9tICcuLi8uLi9TaGFwZXMvU3F1YXJlJztcclxuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi4vTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XHJcbmltcG9ydCBDVlBvbHlnb25Ub29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0NWUG9seWdvblRvb2xiYXJDb250cm9sbGVyJztcclxuaW1wb3J0IEZhblBvbHlnb25Ub29sYmFyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0ZhblBvbHlnb25Ub29sYmFyQ29udHJvbGxlcic7XHJcbmltcG9ydCBMaW5lVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9MaW5lVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9SZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9TcXVhcmVUb29sYmFyQ29udHJvbGxlcic7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSB0b29sYmFyQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgaXRlbVBpY2tlcjogSFRNTFNlbGVjdEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHNlbGVjdGVkSWQ6IHN0cmluZyA9ICcnO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRyb2xsZXI6IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcywgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcikge1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzID0gYXBwQ2FudmFzO1xyXG4gICAgICAgIHRoaXMuYXBwQ2FudmFzLnVwZGF0ZVRvb2xiYXIgPSB0aGlzLnVwZGF0ZVNoYXBlTGlzdC5iaW5kKHRoaXMpO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlciA9IGNhbnZhc0NvbnRyb2xsZXI7XHJcblxyXG4gICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndG9vbGJhci1jb250YWluZXInXHJcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICd0b29sYmFyLWl0ZW0tcGlja2VyJ1xyXG4gICAgICAgICkgYXMgSFRNTFNlbGVjdEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlci5vbmNoYW5nZSA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRJZCA9IHRoaXMuaXRlbVBpY2tlci52YWx1ZTtcclxuICAgICAgICAgICAgY29uc3Qgc2hhcGUgPSB0aGlzLmFwcENhbnZhcy5zaGFwZXNbdGhpcy5pdGVtUGlja2VyLnZhbHVlXTtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclRvb2xiYXJFbG10KCk7XHJcblxyXG4gICAgICAgICAgICBpZiAoc2hhcGUgaW5zdGFuY2VvZiBMaW5lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IExpbmVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBMaW5lLCBhcHBDYW52YXMpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgUmVjdGFuZ2xlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFJlY3RhbmdsZSwgYXBwQ2FudmFzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgU3F1YXJlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IFNxdWFyZVRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIFNxdWFyZSwgYXBwQ2FudmFzKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgRmFuUG9seWdvbikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgRmFuUG9seWdvbiwgYXBwQ2FudmFzLCB0aGlzLmNhbnZhc0NvbnRyb2xsZXIpXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoc2hhcGUgaW5zdGFuY2VvZiBDVlBvbHlnb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRyb2xsZXIgPSBuZXcgQ1ZQb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgQ1ZQb2x5Z29uLCBhcHBDYW52YXMsIHRoaXMuY2FudmFzQ29udHJvbGxlcilcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGVMaXN0KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlU2hhcGVMaXN0KCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLml0ZW1QaWNrZXIuZmlyc3RDaGlsZClcclxuICAgICAgICAgICAgdGhpcy5pdGVtUGlja2VyLnJlbW92ZUNoaWxkKHRoaXMuaXRlbVBpY2tlci5maXJzdENoaWxkKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBwbGFjZWhvbGRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xyXG4gICAgICAgIHBsYWNlaG9sZGVyLnRleHQgPSAnQ2hvb3NlIGFuIG9iamVjdCc7XHJcbiAgICAgICAgcGxhY2Vob2xkZXIudmFsdWUgPSAnJztcclxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIuYXBwZW5kQ2hpbGQocGxhY2Vob2xkZXIpO1xyXG5cclxuICAgICAgICBPYmplY3QudmFsdWVzKHRoaXMuYXBwQ2FudmFzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgICAgY2hpbGQudGV4dCA9IHNoYXBlLmlkO1xyXG4gICAgICAgICAgICBjaGlsZC52YWx1ZSA9IHNoYXBlLmlkO1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1QaWNrZXIuYXBwZW5kQ2hpbGQoY2hpbGQpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIudmFsdWUgPSB0aGlzLnNlbGVjdGVkSWQ7XHJcblxyXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5hcHBDYW52YXMuc2hhcGVzKS5pbmNsdWRlcyh0aGlzLnNlbGVjdGVkSWQpKSB7XHJcbiAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRyb2xsZXIgPSBudWxsO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyVG9vbGJhckVsbXQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBjbGVhclRvb2xiYXJFbG10KCkge1xyXG4gICAgICAgIHdoaWxlICh0aGlzLnRvb2xiYXJDb250YWluZXIuZmlyc3RDaGlsZClcclxuICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMudG9vbGJhckNvbnRhaW5lci5maXJzdENoaWxkKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uL0Jhc2UvQmFzZVNoYXBlJztcclxuaW1wb3J0IENvbG9yIGZyb20gJy4uL0Jhc2UvQ29sb3InO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gJy4uL0Jhc2UvVmVydGV4JztcclxuaW1wb3J0IEdyYWhhbVNjYW4gZnJvbSAnLi4vY29udmV4SHVsbFV0aWxzJztcclxuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHggfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDVlBvbHlnb24gZXh0ZW5kcyBCYXNlU2hhcGUge1xyXG4gICAgcHJpdmF0ZSBvcmlnaW46IFZlcnRleDtcclxuICAgIGxlbkxpc3Q6IG51bWJlcltdID0gW107XHJcbiAgICBwcml2YXRlIGdzOiBHcmFoYW1TY2FuID0gbmV3IEdyYWhhbVNjYW4oKTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHZlcnRpY2VzOiBWZXJ0ZXhbXSkge1xyXG4gICAgICAgIHN1cGVyKDYsIGlkLCBjb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdmVydGljZXNbMF07XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0pO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlcnRleChcclxuICAgICAgICAgICAgKHZlcnRpY2VzWzFdLnggKyB2ZXJ0aWNlc1swXS54KSAvIDIsXHJcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS55ICsgdmVydGljZXNbMF0ueSkgLyAyLFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMCwgMCwgMClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB2ZXJ0aWNlcy5mb3JFYWNoKCh2dHgsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaWR4IDwgMikgcmV0dXJuO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInNoYXBlIHNldFwiKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRWZXJ0ZXgodnR4KTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRWZXJ0ZXgodmVydGV4OiBWZXJ0ZXgpIHtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKHZlcnRleCk7XHJcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVtb3ZlVmVydGV4KGlkeDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRMaXN0Lmxlbmd0aCA8PSAzKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ2Fubm90IHJlbW92ZSB2ZXJ0ZXggYW55IGZ1cnRoZXJcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3Quc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLnBvaW50TGlzdFswXTtcclxuICAgICAgICB0aGlzLnJlY2FsYygpO1xyXG4gICAgfVxyXG5cclxuICAgIHJlY2FsYygpIHtcclxuICAgICAgICB0aGlzLmdzLnNldFBvaW50cyh0aGlzLnBvaW50TGlzdCk7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QgPSB0aGlzLmdzLmdldEh1bGwoKTtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMucG9pbnRMaXN0WzBdO1xyXG5cclxuICAgICAgICBsZXQgYW5nbGVzID0gdGhpcy5wb2ludExpc3RcclxuICAgICAgICAgICAgLmZpbHRlcigoXywgaWR4KSA9PiBpZHggPiAwKVxyXG4gICAgICAgICAgICAubWFwKCh2dHgpID0+IHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdnR4LFxyXG4gICAgICAgICAgICAgICAgICAgIGFuZ2xlOiBNYXRoLmF0YW4yKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2dHgueSAtIHRoaXMub3JpZ2luLnksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZ0eC54IC0gdGhpcy5vcmlnaW4ueFxyXG4gICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgYW5nbGVzLnNvcnQoKGEsIGIpID0+IGEuYW5nbGUgLSBiLmFuZ2xlKTtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdCA9IGFuZ2xlcy5tYXAoKGl0ZW0pID0+IGl0ZW0udnR4KTtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdC51bnNoaWZ0KHRoaXMub3JpZ2luKTtcclxuXHJcbiAgICAgICAgdGhpcy5jZW50ZXIueCA9XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0LnJlZHVjZSgodG90YWwsIHZ0eCkgPT4gdG90YWwgKyB2dHgueCwgMCkgL1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIueSA9XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0LnJlZHVjZSgodG90YWwsIHZ0eCkgPT4gdG90YWwgKyB2dHgueSwgMCkgL1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5sZW5ndGg7XHJcbiAgICAgICAgdGhpcy5sZW5MaXN0ID0gdGhpcy5wb2ludExpc3QubWFwKCh2dHgpID0+XHJcbiAgICAgICAgICAgIGV1Y2xpZGVhbkRpc3RhbmNlVnR4KHZ0eCwgdGhpcy5jZW50ZXIpXHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4uL0Jhc2UvQmFzZVNoYXBlJztcclxuaW1wb3J0IENvbG9yIGZyb20gJy4uL0Jhc2UvQ29sb3InO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gJy4uL0Jhc2UvVmVydGV4JztcclxuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHggfSBmcm9tICcuLi91dGlscyc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBGYW5Qb2x5Z29uIGV4dGVuZHMgQmFzZVNoYXBlIHtcclxuICAgIHByaXZhdGUgb3JpZ2luOiBWZXJ0ZXg7XHJcbiAgICBsZW5MaXN0OiBudW1iZXJbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgdmVydGljZXM6IFZlcnRleFtdKSB7XHJcbiAgICAgICAgc3VwZXIoMSwgaWQsIGNvbG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB2ZXJ0aWNlc1swXTtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKHZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1sxXSk7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBuZXcgVmVydGV4KFxyXG4gICAgICAgICAgICAodmVydGljZXNbMV0ueCArIHZlcnRpY2VzWzBdLngpIC8gMixcclxuICAgICAgICAgICAgKHZlcnRpY2VzWzFdLnkgKyB2ZXJ0aWNlc1swXS55KSAvIDIsXHJcbiAgICAgICAgICAgIG5ldyBDb2xvcigwLCAwLCAwKVxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LmZvckVhY2goKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpZHggPCAyKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IDY7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KHZ0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkVmVydGV4KHZlcnRleDogVmVydGV4KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2ZXJ0ZXgpO1xyXG4gICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IDY7XHJcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcclxuICAgIH1cclxuICAgIFxyXG4gICAgcmVtb3ZlVmVydGV4KGlkeDogbnVtYmVyKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRMaXN0Lmxlbmd0aCA8PSAyKSB7XHJcbiAgICAgICAgICAgIGFsZXJ0KFwiQ2Fubm90IHJlbW92ZSB2ZXJ0ZXggYW55IGZ1cnRoZXJcIik7XHJcbiAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3Quc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLnBvaW50TGlzdFswXTtcclxuICAgICAgICBpZiAodGhpcy5wb2ludExpc3QubGVuZ3RoID09IDIpXHJcbiAgICAgICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IDE7XHJcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWNhbGMoKSB7XHJcbiAgICAgICAgbGV0IGFuZ2xlcyA9IHRoaXMucG9pbnRMaXN0XHJcbiAgICAgICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gaWR4ID4gMClcclxuICAgICAgICAgICAgLm1hcCgodnR4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZ0eCxcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogTWF0aC5hdGFuMihcclxuICAgICAgICAgICAgICAgICAgICAgICAgdnR4LnkgLSB0aGlzLm9yaWdpbi55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2dHgueCAtIHRoaXMub3JpZ2luLnhcclxuICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFuZ2xlcy5zb3J0KChhLCBiKSA9PiBhLmFuZ2xlIC0gYi5hbmdsZSk7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QgPSBhbmdsZXMubWFwKChpdGVtKSA9PiBpdGVtLnZ0eCk7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QudW5zaGlmdCh0aGlzLm9yaWdpbik7XHJcblxyXG4gICAgICAgIHRoaXMuY2VudGVyLnggPVxyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5yZWR1Y2UoKHRvdGFsLCB2dHgpID0+IHRvdGFsICsgdnR4LngsIDApIC9cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2VudGVyLnkgPVxyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5yZWR1Y2UoKHRvdGFsLCB2dHgpID0+IHRvdGFsICsgdnR4LnksIDApIC9cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMubGVuTGlzdCA9IHRoaXMucG9pbnRMaXN0Lm1hcCgodnR4KSA9PlxyXG4gICAgICAgICAgICBldWNsaWRlYW5EaXN0YW5jZVZ0eCh2dHgsIHRoaXMuY2VudGVyKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XHJcbmltcG9ydCB7IGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lIGV4dGVuZHMgQmFzZVNoYXBlIHtcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBlbmRYOiBudW1iZXIsIGVuZFk6IG51bWJlciwgcm90YXRpb24gPSAwLCBzY2FsZVggPSAxLCBzY2FsZVkgPSAxKSB7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9IChzdGFydFggKyBlbmRYKSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9IChzdGFydFkgKyBlbmRZKSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XHJcbiAgICAgICAgc3VwZXIoMSwgaWQsIGNvbG9yLCBjZW50ZXIsIHJvdGF0aW9uLCBzY2FsZVgsIHNjYWxlWSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gbmV3IFZlcnRleChzdGFydFgsIHN0YXJ0WSwgY29sb3IpO1xyXG4gICAgICAgIGNvbnN0IGVuZCA9IG5ldyBWZXJ0ZXgoZW5kWCwgZW5kWSwgY29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxyXG4gICAgICAgICAgICBvcmlnaW4sXHJcbiAgICAgICAgICAgIGVuZFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2gob3JpZ2luLCBlbmQpO1xyXG4gICAgICAgIHRoaXMuYnVmZmVyVHJhbnNmb3JtYXRpb25MaXN0ID0gdGhpcy5wb2ludExpc3Q7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcclxuaW1wb3J0IHsgbTMgfSBmcm9tIFwiLi4vdXRpbHNcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZSBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICBcclxuICAgIGxlbmd0aDogbnVtYmVyO1xyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGluaXRpYWxQb2ludDogbnVtYmVyW107XHJcbiAgICBlbmRQb2ludDogbnVtYmVyW107XHJcbiAgICB0YXJnZXRQb2ludDogbnVtYmVyW107XHJcblxyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgc3RhcnRYOiBudW1iZXIsIHN0YXJ0WTogbnVtYmVyLCBlbmRYOiBudW1iZXIsIGVuZFk6IG51bWJlciwgYW5nbGVJblJhZGlhbnM6IG51bWJlciwgc2NhbGVYOiBudW1iZXIgPSAxLCBzY2FsZVk6IG51bWJlciA9IDEsIHRyYW5zZm9ybWF0aW9uOiBudW1iZXJbXSA9IG0zLmlkZW50aXR5KCkpIHtcclxuICAgICAgICBzdXBlcig1LCBpZCwgY29sb3IpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHgxID0gc3RhcnRYO1xyXG4gICAgICAgIGNvbnN0IHkxID0gc3RhcnRZO1xyXG4gICAgICAgIGNvbnN0IHgyID0gZW5kWDtcclxuICAgICAgICBjb25zdCB5MiA9IHN0YXJ0WTtcclxuICAgICAgICBjb25zdCB4MyA9IHN0YXJ0WDtcclxuICAgICAgICBjb25zdCB5MyA9IGVuZFk7XHJcbiAgICAgICAgY29uc3QgeDQgPSBlbmRYO1xyXG4gICAgICAgIGNvbnN0IHk0ID0gZW5kWTtcclxuXHJcbiAgICAgICAgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IHRyYW5zZm9ybWF0aW9uO1xyXG5cclxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gYW5nbGVJblJhZGlhbnM7XHJcbiAgICAgICAgdGhpcy5zY2FsZSA9IFtzY2FsZVgsIHNjYWxlWV07XHJcbiAgICAgICAgdGhpcy5pbml0aWFsUG9pbnQgPSBbc3RhcnRYLCBzdGFydFksIDFdO1xyXG4gICAgICAgIHRoaXMuZW5kUG9pbnQgPSBbZW5kWCwgZW5kWSwgMV07XHJcbiAgICAgICAgdGhpcy50YXJnZXRQb2ludCA9IFswLDAsIDFdO1xyXG4gICAgICAgIHRoaXMubGVuZ3RoID0geDIteDE7XHJcbiAgICAgICAgdGhpcy53aWR0aCA9IHkzLXkxO1xyXG5cclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gKHgxICsgeDQpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHkxICsgeTQpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIGNvbG9yKTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaChuZXcgVmVydGV4KHgxLCB5MSwgY29sb3IpLCBuZXcgVmVydGV4KHgyLCB5MiwgY29sb3IpLCBuZXcgVmVydGV4KHgzLCB5MywgY29sb3IpLCBuZXcgVmVydGV4KHg0LCB5NCwgY29sb3IpKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdCA9IHRoaXMucG9pbnRMaXN0O1xyXG5cclxuICAgICAgICBjb25zb2xlLmxvZyhgcG9pbnQgMDogJHt4MX0sICR7eTF9YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYHBvaW50IDE6ICR7eDJ9LCAke3kyfWApO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKGBwb2ludCAyOiAke3gzfSwgJHt5M31gKTtcclxuICAgICAgICBjb25zb2xlLmxvZyhgcG9pbnQgMzogJHt4NH0sICR7eTR9YCk7XHJcbiAgICAgICAgY29uc29sZS5sb2coYGNlbnRlcjogJHtjZW50ZXIueH0sICR7Y2VudGVyLnl9YCk7XHJcbiAgICB9XHJcblxyXG4gICAgb3ZlcnJpZGUgc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKXtcclxuICAgICAgICBzdXBlci5zZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpO1xyXG5cclxuICAgICAgICAvLyBjb25zdCBwb2ludCA9IFt0aGlzLnBvaW50TGlzdFtpZHhdLngsIHRoaXMucG9pbnRMaXN0W2lkeF0ueSwgMV07XHJcbiAgICAgICAgdGhpcy5lbmRQb2ludCA9IG0zLm11bHRpcGx5M3gxKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMuZW5kUG9pbnQpXHJcbiAgICAgICAgdGhpcy5pbml0aWFsUG9pbnQgPSBtMy5tdWx0aXBseTN4MSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLmluaXRpYWxQb2ludClcclxuICAgIFxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kQ0NXQWRqYWNlbnQocG9pbnRJZHg6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3QgY2N3QWRqYWNlbnQ6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7IDA6IDIsIDE6IDAsIDI6IDMsIDM6IDEgfTtcclxuICAgICAgICByZXR1cm4gY2N3QWRqYWNlbnRbcG9pbnRJZHhdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kQ1dBZGphY2VudChwb2ludElkeDogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCBjd0FkamFjZW50OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0geyAwOiAxLCAxOiAzLCAyOiAwLCAzOiAyIH07XHJcbiAgICAgICAgcmV0dXJuIGN3QWRqYWNlbnRbcG9pbnRJZHhdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kT3Bwb3NpdGUocG9pbnRJZHg6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgb3Bwb3NpdGU6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7IDA6IDMsIDE6IDIsIDI6IDEsIDM6IDAgfTtcclxuICAgICAgICByZXR1cm4gb3Bwb3NpdGVbcG9pbnRJZHhdO1xyXG4gICAgfVxyXG5cclxuXHJcbiAgICAvLyBwdWJsaWMgb3ZlcnJpZGUgc2V0VmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4KCk6IHZvaWQge1xyXG4gICAgICAgIC8vIC8vIFRFU1RcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcImluaXRpYWxcIiwgdGhpcy5pbml0aWFsUG9pbnQpO1xyXG4gICAgICAgIC8vIGNvbnN0IHRhcmdldFBvaW50WCA9IHRoaXMuZW5kUG9pbnRbMF0gKyB0aGlzLnRhcmdldFBvaW50WzBdO1xyXG4gICAgICAgIC8vIGNvbnN0IHRhcmdldFBvaW50WSA9IHRoaXMuZW5kUG9pbnRbMV0gKyB0aGlzLnRhcmdldFBvaW50WzFdO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZW5kUG9pbnQgWDogXCIsIHRoaXMuZW5kUG9pbnRbMF0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiZW5kUG9pbnQgWTogXCIsIHRoaXMuZW5kUG9pbnRbMV0pO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwidGFyZ2V0WDogXCIsIHRhcmdldFBvaW50WCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJ0YXJnZXRZOiBcIiwgdGFyZ2V0UG9pbnRZKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgdHJhbnNsYXRlVG9Jbml0aWFsID0gbTMudHJhbnNsYXRpb24oLXRoaXMuaW5pdGlhbFBvaW50WzBdLCAtdGhpcy5pbml0aWFsUG9pbnRbMV0pO1xyXG4gICAgICAgIC8vIGNvbnN0IHJvdGF0ZVJldmVydCA9IG0zLnJvdGF0aW9uKC10aGlzLmFuZ2xlSW5SYWRpYW5zKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgcmVzUm90YXRlID0gbTMubXVsdGlwbHkocm90YXRlUmV2ZXJ0LCB0cmFuc2xhdGVUb0luaXRpYWwpXHJcbiAgICAgICAgLy8gLy8gY29uc3QgcmVzVHJhbnNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzUm90YXRlKVxyXG5cclxuICAgICAgICAvLyBjb25zdCByb3RhdGVkVGFyZ2V0PSBtMy5tdWx0aXBseTN4MShyZXNSb3RhdGUsIFt0YXJnZXRQb2ludFgsIHRhcmdldFBvaW50WSwgMV0pO1xyXG4gICAgICAgIC8vIGNvbnN0IHJvdGF0ZWRFbmRQb2ludD1tMy5tdWx0aXBseTN4MShyZXNSb3RhdGUsIHRoaXMuZW5kUG9pbnQpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicm90YXRlZCB0YXJnZXRcIiwgcm90YXRlZFRhcmdldCk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coXCJyb3RhdGVkIGVuZHBvaW50XCIsIHJvdGF0ZWRFbmRQb2ludCk7XHJcbiAgICAgICAgLy8gLy8gdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG0zLm11bHRpcGx5KHJlc1JvdGF0ZSwgdGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeClcclxuICAgICAgICBcclxuICAgICAgICAvLyBjb25zdCBjdXJyZW50TGVuZ3RoID0gcm90YXRlZEVuZFBvaW50WzBdO1xyXG4gICAgICAgIC8vIGNvbnN0IGN1cnJlbnRXaWR0aD0gcm90YXRlZEVuZFBvaW50WzFdO1xyXG5cclxuICAgICAgICAvLyBjb25zdCB1cGRhdGVkTGVuZ3RoID0gY3VycmVudExlbmd0aCArIHJvdGF0ZWRUYXJnZXRbMF0gLSByb3RhdGVkRW5kUG9pbnRbMF07XHJcbiAgICAgICAgLy8gY29uc3QgdXBkYXRlZFdpZHRoID0gY3VycmVudFdpZHRoICsgcm90YXRlZFRhcmdldFsxXSAtIHJvdGF0ZWRFbmRQb2ludFsxXTtcclxuXHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHNjYWxlTGVuZ3RoID0gdXBkYXRlZExlbmd0aCAvIGN1cnJlbnRMZW5ndGg7XHJcbiAgICAgICAgLy8gY29uc3Qgc2NhbGVXaWR0aCA9IHVwZGF0ZWRXaWR0aCAvIGN1cnJlbnRXaWR0aDtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNjYWxlIGxlbmd0aDogXCIsIHNjYWxlTGVuZ3RoKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZyhcInNjYWxlIHdpZHRoOiBcIiwgc2NhbGVXaWR0aCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgLy8gY29uc3Qgc2NhbGluZyA9IG0zLnNjYWxpbmcoc2NhbGVMZW5ndGgsIHNjYWxlV2lkdGgpO1xyXG4gICAgICAgIC8vIGNvbnN0IHJvdGF0ZUJhY2sgPSBtMy5yb3RhdGlvbih0aGlzLmFuZ2xlSW5SYWRpYW5zKTtcclxuICAgICAgICAvLyBjb25zdCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24odGhpcy5pbml0aWFsUG9pbnRbMF0sIHRoaXMuaW5pdGlhbFBvaW50WzFdKTtcclxuXHJcbiAgICAgICAgLy8gY29uc3QgcmVzU2NhbGUgPSBtMy5tdWx0aXBseShyb3RhdGVCYWNrLCBzY2FsaW5nKTtcclxuICAgICAgICAvLyBjb25zdCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzU2NhbGUpO1xyXG5cclxuICAgICAgICAvLyBjb25zdCB2aXJ0dWFsVHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5tdWx0aXBseShyZXNCYWNrLCByZXNSb3RhdGUpO1xyXG4gICAgICAgIC8vIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5tdWx0aXBseSh2aXJ0dWFsVHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwicmVzOiBcIiwgbTMubXVsdGlwbHkzeDEodmlydHVhbFRyYW5zZm9ybWF0aW9uTWF0cml4LCB0aGlzLmluaXRpYWxQb2ludCkpXHJcbiAgICAvLyB9XHJcblxyXG4gICAgLy8gc2V0VHJhbnNsYXRpb24oeDogbnVtYmVyLCB5OiBudW1iZXIpIHtcclxuICAgIC8vICAgICB0aGlzLnRyYW5zbGF0aW9uID0gW3gsIHldO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHNldFJvdGF0aW9uKGFuZ2xlSW5EZWdyZWVzOiBudW1iZXIpIHtcclxuICAgIC8vICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQoYW5nbGVJbkRlZ3JlZXMpO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIC8vIHNldFNjYWxlKHNjYWxlWDogbnVtYmVyLCBzY2FsZVk6IG51bWJlcikge1xyXG4gICAgLy8gICAgIHRoaXMuc2NhbGUgPSBbc2NhbGVYLCBzY2FsZVldO1xyXG4gICAgLy8gfVxyXG59XHJcbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xyXG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlIGV4dGVuZHMgQmFzZVNoYXBlIHtcclxuICAgIHYxIDogVmVydGV4O1xyXG4gICAgdjIgOiBWZXJ0ZXg7XHJcbiAgICB2MyA6IFZlcnRleDtcclxuICAgIHY0IDogVmVydGV4O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGlkOiBzdHJpbmcsIGNvbG9yOiBDb2xvciwgeDE6IG51bWJlciwgeTE6IG51bWJlciwgeDI6IG51bWJlciwgeTI6IG51bWJlciwgeDM6IG51bWJlciwgeTM6IG51bWJlciwgeDQ6IG51bWJlciwgeTQ6IG51bWJlciwgcm90YXRpb24gPSAwLCBzY2FsZVggPSAxLCBzY2FsZVkgPSAxKSB7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh4MSArIHgzKSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9ICh5MSArIHkzKSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XHJcbiAgICAgICAgXHJcbiAgICAgICAgc3VwZXIoNiwgaWQsIGNvbG9yLCBjZW50ZXIsIHJvdGF0aW9uLCBzY2FsZVgsIHNjYWxlWSk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgdGhpcy52MSA9IG5ldyBWZXJ0ZXgoeDEsIHkxLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy52MiA9IG5ldyBWZXJ0ZXgoeDIsIHkyLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy52MyA9IG5ldyBWZXJ0ZXgoeDMsIHkzLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy52NCA9IG5ldyBWZXJ0ZXgoeDQsIHk0LCBjb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godGhpcy52MSwgdGhpcy52MiwgdGhpcy52MywgdGhpcy52NCk7XHJcbiAgICAgICAgdGhpcy5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3QgPSB0aGlzLnBvaW50TGlzdDtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgVmVydGV4IGZyb20gXCIuL0Jhc2UvVmVydGV4XCI7XHJcblxyXG5jb25zdCBSRU1PVkVEID0gLTE7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmFoYW1TY2FuIHtcclxuICAgIHByaXZhdGUgcG9pbnRzOiBWZXJ0ZXhbXSA9IFtdO1xyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRzID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0UG9pbnRzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50cztcclxuICAgIH1cclxuXHJcbiAgICBzZXRQb2ludHMocG9pbnRzOiBWZXJ0ZXhbXSkge1xyXG4gICAgICAgIHRoaXMucG9pbnRzID0gcG9pbnRzLnNsaWNlKCk7IFxyXG4gICAgfVxyXG5cclxuICAgIGFkZFBvaW50KHBvaW50OiBWZXJ0ZXgpIHtcclxuICAgICAgICB0aGlzLnBvaW50cy5wdXNoKHBvaW50KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRIdWxsKCkge1xyXG4gICAgICAgIGNvbnN0IHBpdm90ID0gdGhpcy5wcmVwYXJlUGl2b3RQb2ludCgpO1xyXG5cclxuICAgICAgICBsZXQgaW5kZXhlcyA9IEFycmF5LmZyb20odGhpcy5wb2ludHMsIChwb2ludCwgaSkgPT4gaSk7XHJcbiAgICAgICAgY29uc3QgYW5nbGVzID0gQXJyYXkuZnJvbSh0aGlzLnBvaW50cywgKHBvaW50KSA9PiB0aGlzLmdldEFuZ2xlKHBpdm90LCBwb2ludCkpO1xyXG4gICAgICAgIGNvbnN0IGRpc3RhbmNlcyA9IEFycmF5LmZyb20odGhpcy5wb2ludHMsIChwb2ludCkgPT4gdGhpcy5ldWNsaWRlYW5EaXN0YW5jZVNxdWFyZWQocGl2b3QsIHBvaW50KSk7XHJcblxyXG4gICAgICAgIGluZGV4ZXMuc29ydCgoaSwgaikgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBhbmdsZUEgPSBhbmdsZXNbaV07XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlQiA9IGFuZ2xlc1tqXTtcclxuICAgICAgICAgICAgaWYgKGFuZ2xlQSA9PT0gYW5nbGVCKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZUEgPSBkaXN0YW5jZXNbaV07XHJcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZUIgPSBkaXN0YW5jZXNbal07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZGlzdGFuY2VBIC0gZGlzdGFuY2VCO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhbmdsZUEgLSBhbmdsZUI7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgaW5kZXhlcy5sZW5ndGggLSAxOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGFuZ2xlc1tpbmRleGVzW2ldXSA9PT0gYW5nbGVzW2luZGV4ZXNbaSArIDFdXSkgeyBcclxuICAgICAgICAgICAgICAgIGluZGV4ZXNbaV0gPSBSRU1PVkVEO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBodWxsID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRleGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGluZGV4ID0gaW5kZXhlc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c1tpbmRleF07XHJcblxyXG4gICAgICAgICAgICBpZiAoaW5kZXggIT09IFJFTU9WRUQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChodWxsLmxlbmd0aCA8IDMpIHtcclxuICAgICAgICAgICAgICAgICAgICBodWxsLnB1c2gocG9pbnQpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaGVja09yaWVudGF0aW9uKGh1bGxbaHVsbC5sZW5ndGggLSAyXSwgaHVsbFtodWxsLmxlbmd0aCAtIDFdLCBwb2ludCkgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGh1bGwucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGh1bGwucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBodWxsLmxlbmd0aCA8IDMgPyBbXSA6IGh1bGw7XHJcbiAgICB9XHJcblxyXG4gICAgY2hlY2tPcmllbnRhdGlvbihwMTogVmVydGV4LCBwMjogVmVydGV4LCBwMzogVmVydGV4KSB7XHJcbiAgICAgICAgcmV0dXJuIChwMi55IC0gcDEueSkgKiAocDMueCAtIHAyLngpIC0gKHAzLnkgLSBwMi55KSAqIChwMi54IC0gcDEueCk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QW5nbGUoYTogVmVydGV4LCBiOiBWZXJ0ZXgpIHtcclxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMihiLnkgLSBhLnksIGIueCAtIGEueCk7XHJcbiAgICB9XHJcblxyXG4gICAgZXVjbGlkZWFuRGlzdGFuY2VTcXVhcmVkKHAxOiBWZXJ0ZXgsIHAyOiBWZXJ0ZXgpIHtcclxuICAgICAgICBjb25zdCBhID0gcDIueCAtIHAxLng7XHJcbiAgICAgICAgY29uc3QgYiA9IHAyLnkgLSBwMS55O1xyXG4gICAgICAgIHJldHVybiBhICogYSArIGIgKiBiO1xyXG4gICAgfVxyXG5cclxuICAgIHByZXBhcmVQaXZvdFBvaW50KCkge1xyXG4gICAgICAgIGxldCBwaXZvdCA9IHRoaXMucG9pbnRzWzBdO1xyXG4gICAgICAgIGxldCBwaXZvdEluZGV4ID0gMDtcclxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IHRoaXMucG9pbnRzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHBvaW50ID0gdGhpcy5wb2ludHNbaV07XHJcbiAgICAgICAgICAgIGlmIChwb2ludC55IDwgcGl2b3QueSB8fCBwb2ludC55ID09PSBwaXZvdC55ICYmIHBvaW50LnggPCBwaXZvdC54KSB7XHJcbiAgICAgICAgICAgICAgICBwaXZvdCA9IHBvaW50O1xyXG4gICAgICAgICAgICAgICAgcGl2b3RJbmRleCA9IGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHBpdm90O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuL0FwcENhbnZhcyc7XHJcbmltcG9ydCBDYW52YXNDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcnMvTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XHJcbmltcG9ydCBUb29sYmFyQ29udHJvbGxlciBmcm9tICcuL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgaW5pdCBmcm9tICcuL2luaXQnO1xyXG5cclxuY29uc3QgbWFpbiA9ICgpID0+IHtcclxuICAgIGNvbnN0IGluaXRSZXQgPSBpbml0KCk7XHJcbiAgICBpZiAoIWluaXRSZXQpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gaW5pdGlhbGl6ZSBXZWJHTCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7IGdsLCBwcm9ncmFtLCBjb2xvckJ1ZmZlciwgcG9zaXRpb25CdWZmZXIgfSA9IGluaXRSZXQ7XHJcblxyXG4gICAgY29uc3QgYXBwQ2FudmFzID0gbmV3IEFwcENhbnZhcyhnbCwgcHJvZ3JhbSwgcG9zaXRpb25CdWZmZXIsIGNvbG9yQnVmZmVyKTtcclxuICAgIFxyXG4gICAgY29uc3QgY2FudmFzQ29udHJvbGxlciA9IG5ldyBDYW52YXNDb250cm9sbGVyKGFwcENhbnZhcyk7XHJcbiAgICBjYW52YXNDb250cm9sbGVyLnN0YXJ0KCk7XHJcbiAgICBcclxuICAgIG5ldyBUb29sYmFyQ29udHJvbGxlcihhcHBDYW52YXMsIGNhbnZhc0NvbnRyb2xsZXIpO1xyXG5cclxuICAgIC8vIGNvbnN0IHJlZCA9IG5ldyBDb2xvcigyNTUsIDAsIDIwMClcclxuICAgIC8vIC8vIGNvbnN0IHRyaWFuZ2xlID0gbmV3IFRyaWFuZ2xlKCd0cmktMScsIHJlZCwgNTAsIDUwLCAyMCwgNTAwLCAyMDAsIDEwMCk7XHJcbiAgICAvLyAvLyBhcHBDYW52YXMuYWRkU2hhcGUodHJpYW5nbGUpO1xyXG4gICAgXHJcbiAgICAvLyBjb25zdCByZWN0ID0gbmV3IFJlY3RhbmdsZSgncmVjdC0xJywgcmVkLCAwLDAsMTAsMjAsMCwxLDEpO1xyXG4gICAgLy8gcmVjdC5hbmdsZUluUmFkaWFucyA9IC0gTWF0aC5QSSAvIDQ7XHJcbiAgICAvLyAvLyByZWN0LnRhcmdldFBvaW50WzBdID0gNSAqIE1hdGguc3FydCgyKTtcclxuICAgIC8vIC8vIHJlY3Quc2NhbGVYID0gMTA7XHJcbiAgICAvLyAvLyByZWN0LnRyYW5zbGF0aW9uWzBdID0gNTAwO1xyXG4gICAgLy8gLy8gcmVjdC50cmFuc2xhdGlvblsxXSA9IDEwMDA7XHJcbiAgICAvLyAvLyByZWN0LnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUocmVjdCk7XHJcblxyXG4gICAgLy8gY29uc3QgbGluZSA9IG5ldyBMaW5lKCdsaW5lLTEnLCByZWQsIDEwMCwgMTAwLCAxMDAsIDMwMCk7XHJcbiAgICAvLyBjb25zdCBsaW5lMiA9IG5ldyBMaW5lKCdsaW5lLTInLCByZWQsIDEwMCwgMTAwLCAzMDAsIDEwMCk7XHJcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XHJcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUobGluZTIpO1xyXG59O1xyXG5cclxubWFpbigpO1xyXG4iLCJjb25zdCBjcmVhdGVTaGFkZXIgPSAoXHJcbiAgICBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0LFxyXG4gICAgdHlwZTogbnVtYmVyLFxyXG4gICAgc291cmNlOiBzdHJpbmdcclxuKSA9PiB7XHJcbiAgICBjb25zdCBzaGFkZXIgPSBnbC5jcmVhdGVTaGFkZXIodHlwZSk7XHJcbiAgICBpZiAoc2hhZGVyKSB7XHJcbiAgICAgICAgZ2wuc2hhZGVyU291cmNlKHNoYWRlciwgc291cmNlKTtcclxuICAgICAgICBnbC5jb21waWxlU2hhZGVyKHNoYWRlcik7XHJcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKTtcclxuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHNoYWRlcjtcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xyXG4gICAgICAgIGdsLmRlbGV0ZVNoYWRlcihzaGFkZXIpO1xyXG4gICAgfVxyXG59O1xyXG5cclxuY29uc3QgY3JlYXRlUHJvZ3JhbSA9IChcclxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICB2dHhTaGQ6IFdlYkdMU2hhZGVyLFxyXG4gICAgZnJnU2hkOiBXZWJHTFNoYWRlclxyXG4pID0+IHtcclxuICAgIGNvbnN0IHByb2dyYW0gPSBnbC5jcmVhdGVQcm9ncmFtKCk7XHJcbiAgICBpZiAocHJvZ3JhbSkge1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2dHhTaGQpO1xyXG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCBmcmdTaGQpO1xyXG4gICAgICAgIGdsLmxpbmtQcm9ncmFtKHByb2dyYW0pO1xyXG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcclxuICAgICAgICBpZiAoc3VjY2VzcykgcmV0dXJuIHByb2dyYW07XHJcblxyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSkpO1xyXG4gICAgICAgIGdsLmRlbGV0ZVByb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBpbml0ID0gKCkgPT4ge1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2MnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIGNvbnN0IGdsID0gY2FudmFzLmdldENvbnRleHQoJ3dlYmdsJyk7XHJcblxyXG4gICAgaWYgKCFnbCkge1xyXG4gICAgICAgIGFsZXJ0KCdZb3VyIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCB3ZWJHTCcpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBJbml0aWFsaXplIHNoYWRlcnMgYW5kIHByb2dyYW1zXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICBjb25zdCB2dHhTaGFkZXJTb3VyY2UgPSAoXHJcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRleC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxyXG4gICAgKS50ZXh0O1xyXG4gICAgY29uc3QgZnJhZ1NoYWRlclNvdXJjZSA9IChcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJhZ21lbnQtc2hhZGVyLTJkJykgYXMgSFRNTFNjcmlwdEVsZW1lbnRcclxuICAgICkudGV4dDtcclxuXHJcbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBjcmVhdGVTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZ0eFNoYWRlclNvdXJjZSk7XHJcbiAgICBjb25zdCBmcmFnbWVudFNoYWRlciA9IGNyZWF0ZVNoYWRlcihcclxuICAgICAgICBnbCxcclxuICAgICAgICBnbC5GUkFHTUVOVF9TSEFERVIsXHJcbiAgICAgICAgZnJhZ1NoYWRlclNvdXJjZVxyXG4gICAgKTtcclxuICAgIGlmICghdmVydGV4U2hhZGVyIHx8ICFmcmFnbWVudFNoYWRlcikgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IHByb2dyYW0gPSBjcmVhdGVQcm9ncmFtKGdsLCB2ZXJ0ZXhTaGFkZXIsIGZyYWdtZW50U2hhZGVyKTtcclxuICAgIGlmICghcHJvZ3JhbSkgcmV0dXJuO1xyXG5cclxuICAgIGNvbnN0IGRwciA9IHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvO1xyXG4gICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gY2FudmFzLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xyXG4gICAgY29uc3QgZGlzcGxheVdpZHRoICA9IE1hdGgucm91bmQod2lkdGggKiBkcHIpO1xyXG4gICAgY29uc3QgZGlzcGxheUhlaWdodCA9IE1hdGgucm91bmQoaGVpZ2h0ICogZHByKTtcclxuXHJcbiAgICBjb25zdCBuZWVkUmVzaXplID1cclxuICAgICAgICBnbC5jYW52YXMud2lkdGggIT0gZGlzcGxheVdpZHRoIHx8IGdsLmNhbnZhcy5oZWlnaHQgIT0gZGlzcGxheUhlaWdodDtcclxuXHJcbiAgICBpZiAobmVlZFJlc2l6ZSkge1xyXG4gICAgICAgIGdsLmNhbnZhcy53aWR0aCA9IGRpc3BsYXlXaWR0aDtcclxuICAgICAgICBnbC5jYW52YXMuaGVpZ2h0ID0gZGlzcGxheUhlaWdodDtcclxuICAgIH1cclxuXHJcbiAgICBnbC52aWV3cG9ydCgwLCAwLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQpO1xyXG4gICAgZ2wuY2xlYXJDb2xvcigwLCAwLCAwLCAwKTtcclxuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xyXG4gICAgZ2wudXNlUHJvZ3JhbShwcm9ncmFtKTtcclxuXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBFbmFibGUgJiBpbml0aWFsaXplIHVuaWZvcm1zIGFuZCBhdHRyaWJ1dGVzXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBSZXNvbHV0aW9uXHJcbiAgICBjb25zdCBtYXRyaXhVbmlmb3JtTG9jYXRpb24gPSBnbC5nZXRVbmlmb3JtTG9jYXRpb24oXHJcbiAgICAgICAgcHJvZ3JhbSxcclxuICAgICAgICAndV90cmFuc2Zvcm1hdGlvbidcclxuICAgICk7XHJcbiAgICBnbC51bmlmb3JtTWF0cml4M2Z2KG1hdHJpeFVuaWZvcm1Mb2NhdGlvbiwgZmFsc2UsIFsxLDAsMCwwLDEsMCwwLDAsMV0pXHJcblxyXG4gICAgY29uc3QgcmVzb2x1dGlvblVuaWZvcm1Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihcclxuICAgICAgICBwcm9ncmFtLFxyXG4gICAgICAgICd1X3Jlc29sdXRpb24nXHJcbiAgICApO1xyXG4gICAgZ2wudW5pZm9ybTJmKHJlc29sdXRpb25Vbmlmb3JtTG9jYXRpb24sIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XHJcblxyXG4gICAgLy8gQ29sb3JcclxuICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICBpZiAoIWNvbG9yQnVmZmVyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBjb2xvciBidWZmZXInKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcclxuICAgIGNvbnN0IGNvbG9yQXR0cmlidXRlTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihwcm9ncmFtLCAnYV9jb2xvcicpO1xyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoY29sb3JBdHRyaWJ1dGVMb2NhdGlvbik7XHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKGNvbG9yQXR0cmlidXRlTG9jYXRpb24sIDMsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblxyXG4gICAgLy8gUG9zaXRpb25cclxuICAgIGNvbnN0IHBvc2l0aW9uQnVmZmVyID0gZ2wuY3JlYXRlQnVmZmVyKCk7XHJcbiAgICBpZiAoIXBvc2l0aW9uQnVmZmVyKSB7XHJcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBwb3NpdGlvbiBidWZmZXInKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcclxuICAgIGNvbnN0IHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24gPSBnbC5nZXRBdHRyaWJMb2NhdGlvbihcclxuICAgICAgICBwcm9ncmFtLFxyXG4gICAgICAgICdhX3Bvc2l0aW9uJ1xyXG4gICAgKTtcclxuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24pO1xyXG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihwb3NpdGlvbkF0dHJpYnV0ZUxvY2F0aW9uLCAyLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xyXG5cclxuICAgIC8vIERvIG5vdCByZW1vdmUgY29tbWVudHMsIHVzZWQgZm9yIHNhbml0eSBjaGVja1xyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG4gICAgLy8gU2V0IHRoZSB2YWx1ZXMgb2YgdGhlIGJ1ZmZlclxyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxyXG5cclxuICAgIC8vIGNvbnN0IGNvbG9ycyA9IFsxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wLCAxLjAsIDAuMCwgMC4wXTtcclxuICAgIC8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XHJcbiAgICAvLyBnbC5idWZmZXJEYXRhKGdsLkFSUkFZX0JVRkZFUiwgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLCBnbC5TVEFUSUNfRFJBVyk7XHJcblxyXG4gICAgLy8gY29uc3QgcG9zaXRpb25zID0gWzEwMCwgNTAsIDIwLCAxMCwgNTAwLCA1MDBdO1xyXG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIHBvc2l0aW9uQnVmZmVyKTtcclxuICAgIC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KHBvc2l0aW9ucyksIGdsLlNUQVRJQ19EUkFXKTtcclxuXHJcbiAgICAvLyA9PT09XHJcbiAgICAvLyBEcmF3XHJcbiAgICAvLyA9PT09XHJcbiAgICAvLyBnbC5kcmF3QXJyYXlzKGdsLlRSSUFOR0xFUywgMCwgMyk7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBwb3NpdGlvbkJ1ZmZlcixcclxuICAgICAgICBwcm9ncmFtLFxyXG4gICAgICAgIGNvbG9yQnVmZmVyLFxyXG4gICAgICAgIGdsLFxyXG4gICAgfTtcclxufTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGluaXQ7XHJcbiIsImltcG9ydCBWZXJ0ZXggZnJvbSAnLi9CYXNlL1ZlcnRleCc7XHJcblxyXG5leHBvcnQgY29uc3QgZXVjbGlkZWFuRGlzdGFuY2VWdHggPSAoYTogVmVydGV4LCBiOiBWZXJ0ZXgpOiBudW1iZXIgPT4ge1xyXG4gICAgY29uc3QgZHggPSBhLnggLSBiLng7XHJcbiAgICBjb25zdCBkeSA9IGEueSAtIGIueTtcclxuXHJcbiAgICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxufTtcclxuXHJcbmV4cG9ydCBjb25zdCBldWNsaWRlYW5EaXN0YW5jZSA9IChheDogbnVtYmVyLCBheTogbnVtYmVyLCBieDogbnVtYmVyLCBieTogbnVtYmVyKTogbnVtYmVyID0+IHtcclxuICBjb25zdCBkeCA9IGF4IC0gYng7XHJcbiAgY29uc3QgZHkgPSBheSAtIGJ5O1xyXG5cclxuICByZXR1cm4gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcclxufTtcclxuXHJcbi8vIDM2MCBERUdcclxuZXhwb3J0IGNvbnN0IGdldEFuZ2xlID0gKG9yaWdpbjogVmVydGV4LCB0YXJnZXQ6IFZlcnRleCkgPT4ge1xyXG4gICAgY29uc3QgcGx1c01pbnVzRGVnID0gcmFkVG9EZWcoTWF0aC5hdGFuMihvcmlnaW4ueSAtIHRhcmdldC55LCBvcmlnaW4ueCAtIHRhcmdldC54KSk7XHJcbiAgICByZXR1cm4gcGx1c01pbnVzRGVnID49IDAgPyAxODAgLSBwbHVzTWludXNEZWcgOiBNYXRoLmFicyhwbHVzTWludXNEZWcpICsgMTgwO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgcmFkVG9EZWcgPSAocmFkOiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiByYWQgKiAxODAgLyBNYXRoLlBJO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZGVnVG9SYWQgPSAoZGVnOiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBkZWcgKiBNYXRoLlBJIC8gMTgwO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gaGV4VG9SZ2IoaGV4OiBzdHJpbmcpIHtcclxuICB2YXIgcmVzdWx0ID0gL14jPyhbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pKFthLWZcXGRdezJ9KSQvaS5leGVjKGhleCk7XHJcbiAgcmV0dXJuIHJlc3VsdCA/IHtcclxuICAgIHI6IHBhcnNlSW50KHJlc3VsdFsxXSwgMTYpLFxyXG4gICAgZzogcGFyc2VJbnQocmVzdWx0WzJdLCAxNiksXHJcbiAgICBiOiBwYXJzZUludChyZXN1bHRbM10sIDE2KVxyXG4gIH0gOiBudWxsO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gcmdiVG9IZXgocjogbnVtYmVyLCBnOiBudW1iZXIsIGI6IG51bWJlcikge1xyXG4gIHJldHVybiBcIiNcIiArICgxIDw8IDI0IHwgciA8PCAxNiB8IGcgPDwgOCB8IGIpLnRvU3RyaW5nKDE2KS5zbGljZSgxKTtcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IG0zID0ge1xyXG4gICAgaWRlbnRpdHk6IGZ1bmN0aW9uKCkgOiBudW1iZXJbXSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgIDAsIDAsIDEsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgdHJhbnNsYXRpb246IGZ1bmN0aW9uKHR4IDogbnVtYmVyLCB0eSA6IG51bWJlcikgOiBudW1iZXJbXSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgMSwgMCwgMCxcclxuICAgICAgICAwLCAxLCAwLFxyXG4gICAgICAgIHR4LCB0eSwgMSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICByb3RhdGlvbjogZnVuY3Rpb24oYW5nbGVJblJhZGlhbnMgOiBudW1iZXIpIDogbnVtYmVyW10ge1xyXG4gICAgICBjb25zdCBjID0gTWF0aC5jb3MoYW5nbGVJblJhZGlhbnMpO1xyXG4gICAgICBjb25zdCBzID0gTWF0aC5zaW4oYW5nbGVJblJhZGlhbnMpO1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGMsLXMsIDAsXHJcbiAgICAgICAgcywgYywgMCxcclxuICAgICAgICAwLCAwLCAxLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICBcclxuICAgIHNjYWxpbmc6IGZ1bmN0aW9uKHN4IDogbnVtYmVyLCBzeSA6IG51bWJlcikgOiBudW1iZXJbXSB7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgc3gsIDAsIDAsXHJcbiAgICAgICAgMCwgc3ksIDAsXHJcbiAgICAgICAgMCwgMCwgMSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICBtdWx0aXBseTogZnVuY3Rpb24oYSA6IG51bWJlcltdLCBiIDogbnVtYmVyW10pIDogbnVtYmVyW10ge1xyXG4gICAgICBjb25zdCBhMDAgPSBhWzAgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGEwMSA9IGFbMCAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTAyID0gYVswICogMyArIDJdO1xyXG4gICAgICBjb25zdCBhMTAgPSBhWzEgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGExMSA9IGFbMSAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTEyID0gYVsxICogMyArIDJdO1xyXG4gICAgICBjb25zdCBhMjAgPSBhWzIgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGEyMSA9IGFbMiAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTIyID0gYVsyICogMyArIDJdO1xyXG4gICAgICBjb25zdCBiMDAgPSBiWzAgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGIwMSA9IGJbMCAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYjAyID0gYlswICogMyArIDJdO1xyXG4gICAgICBjb25zdCBiMTAgPSBiWzEgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGIxMSA9IGJbMSAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYjEyID0gYlsxICogMyArIDJdO1xyXG4gICAgICBjb25zdCBiMjAgPSBiWzIgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGIyMSA9IGJbMiAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYjIyID0gYlsyICogMyArIDJdO1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMCxcclxuICAgICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXHJcbiAgICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxyXG4gICAgICAgIGIxMCAqIGEwMCArIGIxMSAqIGExMCArIGIxMiAqIGEyMCxcclxuICAgICAgICBiMTAgKiBhMDEgKyBiMTEgKiBhMTEgKyBiMTIgKiBhMjEsXHJcbiAgICAgICAgYjEwICogYTAyICsgYjExICogYTEyICsgYjEyICogYTIyLFxyXG4gICAgICAgIGIyMCAqIGEwMCArIGIyMSAqIGExMCArIGIyMiAqIGEyMCxcclxuICAgICAgICBiMjAgKiBhMDEgKyBiMjEgKiBhMTEgKyBiMjIgKiBhMjEsXHJcbiAgICAgICAgYjIwICogYTAyICsgYjIxICogYTEyICsgYjIyICogYTIyLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuXHJcbiAgICBpbnZlcnNlOiBmdW5jdGlvbihtIDogbnVtYmVyW10pIHtcclxuICAgICAgY29uc3QgZGV0ID0gbVswXSAqIChtWzRdICogbVs4XSAtIG1bN10gKiBtWzVdKSAtXHJcbiAgICAgICAgICAgICAgICAgIG1bMV0gKiAobVszXSAqIG1bOF0gLSBtWzVdICogbVs2XSkgK1xyXG4gICAgICAgICAgICAgICAgICBtWzJdICogKG1bM10gKiBtWzddIC0gbVs0XSAqIG1bNl0pO1xyXG4gIFxyXG4gICAgICBpZiAoZGV0ID09PSAwKSByZXR1cm4gbnVsbDtcclxuICBcclxuICAgICAgY29uc3QgaW52RGV0ID0gMSAvIGRldDtcclxuICBcclxuICAgICAgcmV0dXJuIFsgXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVs0XSAqIG1bOF0gLSBtWzVdICogbVs3XSksIFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMl0gKiBtWzddIC0gbVsxXSAqIG1bOF0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMV0gKiBtWzVdIC0gbVsyXSAqIG1bNF0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bNV0gKiBtWzZdIC0gbVszXSAqIG1bOF0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMF0gKiBtWzhdIC0gbVsyXSAqIG1bNl0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMl0gKiBtWzNdIC0gbVswXSAqIG1bNV0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bM10gKiBtWzddIC0gbVs0XSAqIG1bNl0pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMV0gKiBtWzZdIC0gbVswXSAqIG1bN10pLFxyXG4gICAgICAgICAgaW52RGV0ICogKG1bMF0gKiBtWzRdIC0gbVsxXSAqIG1bM10pXHJcbiAgICAgIF07XHJcbiAgfSxcclxuXHJcbiAgICBtdWx0aXBseTN4MTogZnVuY3Rpb24oYSA6IG51bWJlcltdLCBiIDogbnVtYmVyW10pIDogbnVtYmVyW10ge1xyXG4gICAgICBjb25zdCBhMDAgPSBhWzAgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGEwMSA9IGFbMCAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTAyID0gYVswICogMyArIDJdO1xyXG4gICAgICBjb25zdCBhMTAgPSBhWzEgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGExMSA9IGFbMSAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTEyID0gYVsxICogMyArIDJdO1xyXG4gICAgICBjb25zdCBhMjAgPSBhWzIgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGEyMSA9IGFbMiAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYTIyID0gYVsyICogMyArIDJdO1xyXG4gICAgICBjb25zdCBiMDAgPSBiWzAgKiAzICsgMF07XHJcbiAgICAgIGNvbnN0IGIwMSA9IGJbMCAqIDMgKyAxXTtcclxuICAgICAgY29uc3QgYjAyID0gYlswICogMyArIDJdO1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGIwMCAqIGEwMCArIGIwMSAqIGExMCArIGIwMiAqIGEyMCxcclxuICAgICAgICBiMDAgKiBhMDEgKyBiMDEgKiBhMTEgKyBiMDIgKiBhMjEsXHJcbiAgICAgICAgYjAwICogYTAyICsgYjAxICogYTEyICsgYjAyICogYTIyLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuXHJcbiAgICB0cmFuc2xhdGU6IGZ1bmN0aW9uKG0gOiBudW1iZXJbXSwgdHg6bnVtYmVyLCB0eTpudW1iZXIpIHtcclxuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnRyYW5zbGF0aW9uKHR4LCB0eSkpO1xyXG4gICAgfSxcclxuICBcclxuICAgIHJvdGF0ZTogZnVuY3Rpb24obTpudW1iZXJbXSwgYW5nbGVJblJhZGlhbnM6bnVtYmVyKSB7XHJcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy5yb3RhdGlvbihhbmdsZUluUmFkaWFucykpO1xyXG4gICAgfSxcclxuICBcclxuICAgIHNjYWxlOiBmdW5jdGlvbihtOm51bWJlcltdLCBzeDpudW1iZXIsIHN5Om51bWJlcikge1xyXG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMuc2NhbGluZyhzeCwgc3kpKTtcclxuICAgIH0sXHJcbiAgfTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iLCIiXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=