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
        var _this = this;
        this._updateToolbar = null;
        this._shapes = {};
        this.gl = gl;
        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;
        this.program = program;
        this.width = gl.canvas.width;
        this.height = gl.canvas.height;
        this.saveBtn = document.getElementById('save-btn');
        this.saveBtn.onclick = function () {
            console.log('saveing');
            _this.saveToJSON();
        };
        this.render();
    }
    AppCanvas.prototype.saveToJSON = function () {
        var jsonData = JSON.stringify(this._shapes, null, 2);
        var blob = new Blob([jsonData], { type: 'application/json' });
        var a = document.createElement('a');
        var url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = 'canvas.json';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    };
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
                throw new Error('Position buffer is not a valid WebGLBuffer');
            }
            if (!(_this.colorBuffer instanceof WebGLBuffer)) {
                throw new Error('Color buffer is not a valid WebGLBuffer');
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
        var withSameTag = Object.keys(this.shapes).filter(function (id) {
            return id.startsWith(tag + '-');
        });
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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LFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUM1RyxDQUFDLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztJQUN2QixDQUFDO0lBRU0sK0JBQVcsR0FBbEI7UUFDSSxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzFJLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFFekksSUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FB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LEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxnQkFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUcsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdkIsQ0FBQztJQUVNLDRCQUFXLEdBQWxCO1FBQ0ksSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUMxSSxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ3hJLElBQU0sT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFB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QUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLElBQU0sR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pCLE9BQU87WUFDTCxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7WUFDakMsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztTQUNsQyxDQUFDO0lBQ0osQ0FBQztJQUVELE9BQU8sRUFBRSxVQUFTLENBQVk7UUFDNUIsSUFBTSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUUvQyxJQUFJLEdBQUcsS0FBSyxDQUFDO1lBQUUsT0FBTyxJQUFJLENBQUM7UUFFM0IsSUFBTSxNQUFNLEdBQUcsQ0FBQyxHQUFHLEdBQUcsQ0FBQztRQUV2QixPQUFPO1lBQ0gsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDcEMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNwQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkMsQ0FBQztJQUNOLENBQUM7SUFFQyxXQUFXLEVBQUUsVUFBUyxDQUFZLEVBQUUsQ0FBWTtRQUM5QyxJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixJQUFNLEdBQUcsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUN6QixPQUFPO1lBQ0wsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHO1lBQ2pDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRztZQUNqQyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUc7U0FDbEMsQ0FBQztJQUNKLENBQUM7SUFFRCxTQUFTLEVBQUUsVUFBUyxDQUFZLEVBQUUsRUFBUyxFQUFFLEVBQVM7UUFDcEQsT0FBTyxVQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFFRCxNQUFNLEVBQUUsVUFBUyxDQUFVLEVBQUUsY0FBcUI7UUFDaEQsT0FBTyxVQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsRUFBRSxVQUFFLENBQUMsUUFBUSxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDckQsQ0FBQztJQUVELEtBQUssRUFBRSxVQUFTLENBQVUsRUFBRSxFQUFTLEVBQUUsRUFBUztRQUM5QyxPQUFPLFVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLFVBQUUsQ0FBQyxPQUFPLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztDQUNGLENBQUM7Ozs7Ozs7VUNuS0o7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7OztVRXRCQTtVQUNBO1VBQ0E7VUFDQSIsInNvdXJjZXMiOlsid2VicGFjazovL3Npc2tvbS8uL3NyYy9BcHBDYW52YXMudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQmFzZVNoYXBlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL0NvbG9yLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9CYXNlL1ZlcnRleC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvQ2FudmFzQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvTWFrZXIvU2hhcGUvQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9GYW5Qb2x5Z29uTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9MaW5lTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9SZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL01ha2VyL1NoYXBlL1NxdWFyZU1ha2VyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9DVlBvbHlnb25Ub29sYmFyQ29udHJvbGxlci50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQ29udHJvbGxlcnMvVG9vbGJhci9TaGFwZS9GYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1JlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9Ub29sYmFyL1NoYXBlL1NoYXBlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvU2hhcGUvU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0NvbnRyb2xsZXJzL1Rvb2xiYXIvVG9vbGJhckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9DVlBvbHlnb24udHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9GYW5Qb2x5Z29uLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvTGluZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1JlY3RhbmdsZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvU2hhcGVzL1NxdWFyZS50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvY29udmV4SHVsbFV0aWxzLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvaW5pdC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvdXRpbHMudHMiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL3Npc2tvbS93ZWJwYWNrL3N0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYWZ0ZXItc3RhcnR1cCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZVNoYXBlIGZyb20gJy4vQmFzZS9CYXNlU2hhcGUnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXBwQ2FudmFzIHtcclxuICAgIHByaXZhdGUgcHJvZ3JhbTogV2ViR0xQcm9ncmFtO1xyXG4gICAgcHJpdmF0ZSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xyXG4gICAgcHJpdmF0ZSBwb3NpdGlvbkJ1ZmZlcjogV2ViR0xCdWZmZXI7XHJcbiAgICBwcml2YXRlIGNvbG9yQnVmZmVyOiBXZWJHTEJ1ZmZlcjtcclxuICAgIHByaXZhdGUgX3VwZGF0ZVRvb2xiYXI6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgc2F2ZUJ0bjogSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBfc2hhcGVzOiBSZWNvcmQ8c3RyaW5nLCBCYXNlU2hhcGU+ID0ge307XHJcblxyXG4gICAgd2lkdGg6IG51bWJlcjtcclxuICAgIGhlaWdodDogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICAgICAgcHJvZ3JhbTogV2ViR0xQcm9ncmFtLFxyXG4gICAgICAgIHBvc2l0aW9uQnVmZmVyOiBXZWJHTEJ1ZmZlcixcclxuICAgICAgICBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXJcclxuICAgICkge1xyXG4gICAgICAgIHRoaXMuZ2wgPSBnbDtcclxuICAgICAgICB0aGlzLnBvc2l0aW9uQnVmZmVyID0gcG9zaXRpb25CdWZmZXI7XHJcbiAgICAgICAgdGhpcy5jb2xvckJ1ZmZlciA9IGNvbG9yQnVmZmVyO1xyXG4gICAgICAgIHRoaXMucHJvZ3JhbSA9IHByb2dyYW07XHJcblxyXG4gICAgICAgIHRoaXMud2lkdGggPSBnbC5jYW52YXMud2lkdGg7XHJcbiAgICAgICAgdGhpcy5oZWlnaHQgPSBnbC5jYW52YXMuaGVpZ2h0O1xyXG5cclxuICAgICAgICB0aGlzLnNhdmVCdG4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3NhdmUtYnRuJ1xyXG4gICAgICAgICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgdGhpcy5zYXZlQnRuLm9uY2xpY2sgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzYXZlaW5nJyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNhdmVUb0pTT04oKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2F2ZVRvSlNPTigpIHtcclxuICAgICAgICBsZXQganNvbkRhdGEgPSBKU09OLnN0cmluZ2lmeSh0aGlzLl9zaGFwZXMsIG51bGwsIDIpO1xyXG4gICAgICAgIGxldCBibG9iID0gbmV3IEJsb2IoW2pzb25EYXRhXSwgeyB0eXBlOiAnYXBwbGljYXRpb24vanNvbicgfSk7XHJcbiAgICBcclxuICAgICAgICBsZXQgYSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2EnKTtcclxuICAgICAgICBsZXQgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XHJcbiAgICAgICAgYS5ocmVmID0gdXJsO1xyXG4gICAgICAgIGEuZG93bmxvYWQgPSAnY2FudmFzLmpzb24nO1xyXG4gICAgXHJcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhKTtcclxuICAgICAgICBhLmNsaWNrKCk7XHJcbiAgICBcclxuICAgICAgICB3aW5kb3cuVVJMLnJldm9rZU9iamVjdFVSTCh1cmwpO1xyXG4gICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQoYSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XHJcbiAgICAgICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSB0aGlzLnBvc2l0aW9uQnVmZmVyO1xyXG4gICAgICAgIGNvbnN0IGNvbG9yQnVmZmVyID0gdGhpcy5jb2xvckJ1ZmZlcjtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLnNoYXBlcykuZm9yRWFjaCgoc2hhcGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgcG9zaXRpb25zID0gc2hhcGUucG9pbnRMaXN0LmZsYXRNYXAoKHBvaW50KSA9PiBbXHJcbiAgICAgICAgICAgICAgICBwb2ludC54LFxyXG4gICAgICAgICAgICAgICAgcG9pbnQueSxcclxuICAgICAgICAgICAgXSk7XHJcblxyXG4gICAgICAgICAgICBsZXQgY29sb3JzOiBudW1iZXJbXSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYXBlLnBvaW50TGlzdC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgY29sb3JzLnB1c2goXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhcGUucG9pbnRMaXN0W2ldLmMucixcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZS5wb2ludExpc3RbaV0uYy5nLFxyXG4gICAgICAgICAgICAgICAgICAgIHNoYXBlLnBvaW50TGlzdFtpXS5jLmJcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIEJpbmQgY29sb3IgZGF0YVxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShjb2xvcnMpLFxyXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIC8vIEJpbmQgcG9zaXRpb24gZGF0YVxyXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgICAgICAgICBnbC5idWZmZXJEYXRhKFxyXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxyXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgZ2wuU1RBVElDX0RSQVdcclxuICAgICAgICAgICAgKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghKHRoaXMucG9zaXRpb25CdWZmZXIgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUG9zaXRpb24gYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghKHRoaXMuY29sb3JCdWZmZXIgaW5zdGFuY2VvZiBXZWJHTEJ1ZmZlcikpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ29sb3IgYnVmZmVyIGlzIG5vdCBhIHZhbGlkIFdlYkdMQnVmZmVyJyk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFNldCB0cmFuc2Zvcm1hdGlvbiBtYXRyaXhcclxuICAgICAgICAgICAgLy8gc2hhcGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuXHJcbiAgICAgICAgICAgIGdsLmRyYXdBcnJheXMoc2hhcGUuZ2xEcmF3VHlwZSwgMCwgc2hhcGUucG9pbnRMaXN0Lmxlbmd0aCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldCBzaGFwZXMoKTogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPiB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHNldCBzaGFwZXModjogUmVjb3JkPHN0cmluZywgQmFzZVNoYXBlPikge1xyXG4gICAgICAgIHRoaXMuX3NoYXBlcyA9IHY7XHJcbiAgICAgICAgdGhpcy5yZW5kZXIoKTtcclxuICAgICAgICBpZiAodGhpcy5fdXBkYXRlVG9vbGJhcikgdGhpcy5fdXBkYXRlVG9vbGJhci5jYWxsKHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXQgdXBkYXRlVG9vbGJhcih2OiAoKSA9PiB2b2lkKSB7XHJcbiAgICAgICAgdGhpcy5fdXBkYXRlVG9vbGJhciA9IHY7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdlbmVyYXRlSWRGcm9tVGFnKHRhZzogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgd2l0aFNhbWVUYWcgPSBPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuZmlsdGVyKChpZCkgPT5cclxuICAgICAgICAgICAgaWQuc3RhcnRzV2l0aCh0YWcgKyAnLScpXHJcbiAgICAgICAgKTtcclxuICAgICAgICByZXR1cm4gYCR7dGFnfS0ke3dpdGhTYW1lVGFnLmxlbmd0aCArIDF9YDtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkU2hhcGUoc2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIGlmIChPYmplY3Qua2V5cyh0aGlzLnNoYXBlcykuaW5jbHVkZXMoc2hhcGUuaWQpKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ1NoYXBlIElEIGFscmVhZHkgdXNlZCcpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdTaGFwZXMgPSB7IC4uLnRoaXMuc2hhcGVzIH07XHJcbiAgICAgICAgbmV3U2hhcGVzW3NoYXBlLmlkXSA9IHNoYXBlO1xyXG4gICAgICAgIHRoaXMuc2hhcGVzID0gbmV3U2hhcGVzO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBlZGl0U2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKG5ld1NoYXBlLmlkKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBub3QgZm91bmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xyXG4gICAgICAgIG5ld1NoYXBlc1tuZXdTaGFwZS5pZF0gPSBuZXdTaGFwZTtcclxuICAgICAgICB0aGlzLnNoYXBlcyA9IG5ld1NoYXBlcztcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgZGVsZXRlU2hhcGUobmV3U2hhcGU6IEJhc2VTaGFwZSkge1xyXG4gICAgICAgIGlmICghT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmluY2x1ZGVzKG5ld1NoYXBlLmlkKSkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdTaGFwZSBJRCBub3QgZm91bmQnKTtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3U2hhcGVzID0geyAuLi50aGlzLnNoYXBlcyB9O1xyXG4gICAgICAgIGRlbGV0ZSBuZXdTaGFwZXNbbmV3U2hhcGUuaWRdO1xyXG4gICAgICAgIHRoaXMuc2hhcGVzID0gbmV3U2hhcGVzO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCB7IG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuL1ZlcnRleFwiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgYWJzdHJhY3QgY2xhc3MgQmFzZVNoYXBlIHtcclxuXHJcbiAgICBwb2ludExpc3Q6IFZlcnRleFtdID0gW107XHJcbiAgICBidWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3Q6IFZlcnRleFtdID0gW107XHJcbiAgICBpZDogc3RyaW5nO1xyXG4gICAgY29sb3I6IENvbG9yO1xyXG4gICAgZ2xEcmF3VHlwZTogbnVtYmVyO1xyXG4gICAgY2VudGVyOiBWZXJ0ZXg7XHJcblxyXG4gICAgdHJhbnNsYXRpb246IFtudW1iZXIsIG51bWJlcl0gPSBbMCwgMF07XHJcbiAgICBhbmdsZUluUmFkaWFuczogbnVtYmVyID0gMDtcclxuICAgIHNjYWxlOiBbbnVtYmVyLCBudW1iZXJdID0gWzEsIDFdO1xyXG5cclxuICAgIHRyYW5zZm9ybWF0aW9uTWF0cml4OiBudW1iZXJbXSA9IG0zLmlkZW50aXR5KCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoZ2xEcmF3VHlwZTogbnVtYmVyLCBpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIGNlbnRlcjogVmVydGV4ID0gbmV3IFZlcnRleCgwLCAwLCBjb2xvciksIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IGdsRHJhd1R5cGU7XHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgICAgIHRoaXMuY29sb3IgPSBjb2xvcjtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IGNlbnRlcjtcclxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gcm90YXRpb247XHJcbiAgICAgICAgdGhpcy5zY2FsZVswXSA9IHNjYWxlWDtcclxuICAgICAgICB0aGlzLnNjYWxlWzFdID0gc2NhbGVZO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSBtMy5pZGVudGl0eSgpXHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlVG9DZW50ZXIgPSBtMy50cmFuc2xhdGlvbigtdGhpcy5jZW50ZXIueCwgLXRoaXMuY2VudGVyLnkpO1xyXG4gICAgICAgIGNvbnN0IHJvdGF0aW9uID0gbTMucm90YXRpb24odGhpcy5hbmdsZUluUmFkaWFucyk7XHJcbiAgICAgICAgbGV0IHNjYWxpbmcgPSBtMy5zY2FsaW5nKHRoaXMuc2NhbGVbMF0sIHRoaXMuc2NhbGVbMV0pO1xyXG4gICAgICAgIGxldCB0cmFuc2xhdGVCYWNrID0gbTMudHJhbnNsYXRpb24odGhpcy5jZW50ZXIueCwgdGhpcy5jZW50ZXIueSk7XHJcbiAgICAgICAgY29uc3QgdHJhbnNsYXRlID0gbTMudHJhbnNsYXRpb24odGhpcy50cmFuc2xhdGlvblswXSwgdGhpcy50cmFuc2xhdGlvblsxXSk7XHJcblxyXG4gICAgICAgIGxldCByZXNTY2FsZSA9IG0zLm11bHRpcGx5KHNjYWxpbmcsIHRyYW5zbGF0ZVRvQ2VudGVyKTtcclxuICAgICAgICBsZXQgcmVzUm90YXRlID0gbTMubXVsdGlwbHkocm90YXRpb24scmVzU2NhbGUpO1xyXG4gICAgICAgIGxldCByZXNCYWNrID0gbTMubXVsdGlwbHkodHJhbnNsYXRlQmFjaywgcmVzUm90YXRlKTtcclxuICAgICAgICBjb25zdCByZXNUcmFuc2xhdGUgPSBtMy5tdWx0aXBseSh0cmFuc2xhdGUsIHJlc0JhY2spO1xyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSByZXNUcmFuc2xhdGU7XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sb3Ige1xyXG4gICAgcjogbnVtYmVyO1xyXG4gICAgZzogbnVtYmVyO1xyXG4gICAgYjogbnVtYmVyO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHI6IG51bWJlciwgZzogbnVtYmVyLCBiOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLnIgPSByO1xyXG4gICAgICAgIHRoaXMuZyA9IGc7XHJcbiAgICAgICAgdGhpcy5iID0gYjtcclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQ29sb3IgZnJvbSBcIi4vQ29sb3JcIjtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlcnRleCB7XHJcbiAgICB4OiBudW1iZXI7XHJcbiAgICB5OiBudW1iZXI7XHJcbiAgICBjOiBDb2xvcjtcclxuICAgIFxyXG4gICAgY29uc3RydWN0b3IoeDogbnVtYmVyLCB5OiBudW1iZXIsIGM6IENvbG9yKSB7XHJcbiAgICAgICAgdGhpcy54ID0geDtcclxuICAgICAgICB0aGlzLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuYyA9IGM7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBDVlBvbHlnb25NYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9DVlBvbHlnb25NYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlciBmcm9tICcuL1NoYXBlL0ZhblBvbHlnb25NYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBJU2hhcGVNYWtlckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlL0lTaGFwZU1ha2VyQ29udHJvbGxlcic7XHJcbmltcG9ydCBMaW5lTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZU1ha2VyQ29udHJvbGxlcic7XHJcbmltcG9ydCBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9SZWN0YW5nbGVNYWtlckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgU3F1YXJlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvU3F1YXJlTWFrZXJDb250cm9sbGVyJztcclxuXHJcbmVudW0gQVZBSUxfU0hBUEVTIHtcclxuICAgIExpbmUgPSAnTGluZScsXHJcbiAgICBSZWN0YW5nbGUgPSAnUmVjdGFuZ2xlJyxcclxuICAgIFNxdWFyZSA9ICdTcXVhcmUnLFxyXG4gICAgRmFuUG9seSA9ICdGYW5Qb2x5JyxcclxuICAgIENWUG9seSA9ICdDVlBvbHknLFxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgX3NoYXBlQ29udHJvbGxlcjogSVNoYXBlTWFrZXJDb250cm9sbGVyO1xyXG4gICAgcHJpdmF0ZSBjYW52YXNFbG10OiBIVE1MQ2FudmFzRWxlbWVudDtcclxuICAgIHByaXZhdGUgYnV0dG9uQ29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuICAgIHByaXZhdGUgY29sb3JQaWNrZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBzZXRQb2x5Z29uQnV0dG9uOiBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgIHRvb2xiYXJPbkNsaWNrQ2I6ICgoKSA9PiB2b2lkKSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIGNvbnN0IGNhbnZhc0VsbXQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgICAgIGNvbnN0IGJ1dHRvbkNvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2hhcGUtYnV0dG9uLWNvbnRhaW5lcidcclxuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3NldC1wb2x5Z29uJ1xyXG4gICAgICAgICkgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdCA9IGNhbnZhc0VsbXQ7XHJcbiAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIgPSBidXR0b25Db250YWluZXI7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdoaWRkZW4nKTtcclxuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSBuZXcgQ1ZQb2x5Z29uTWFrZXJDb250cm9sbGVyKGFwcENhbnZhcyk7XHJcblxyXG4gICAgICAgIHRoaXMuY29sb3JQaWNrZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3NoYXBlLWNvbG9yLXBpY2tlcidcclxuICAgICAgICApIGFzIEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdC5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgY29uc3QgY29ycmVjdFggPSBlLm9mZnNldFggKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgY29uc3QgY29ycmVjdFkgPSBlLm9mZnNldFkgKiB3aW5kb3cuZGV2aWNlUGl4ZWxSYXRpbztcclxuICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXI/LmhhbmRsZUNsaWNrKFxyXG4gICAgICAgICAgICAgICAgY29ycmVjdFgsXHJcbiAgICAgICAgICAgICAgICBjb3JyZWN0WSxcclxuICAgICAgICAgICAgICAgIHRoaXMuY29sb3JQaWNrZXIudmFsdWVcclxuICAgICAgICAgICAgKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudG9vbGJhck9uQ2xpY2tDYilcclxuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhck9uQ2xpY2tDYigpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldCBzaGFwZUNvbnRyb2xsZXIoKTogSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fc2hhcGVDb250cm9sbGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgc2V0IHNoYXBlQ29udHJvbGxlcih2OiBJU2hhcGVNYWtlckNvbnRyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSB2O1xyXG5cclxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQub25jbGljayA9IChlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RYID0gZS5vZmZzZXRYICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcnJlY3RZID0gZS5vZmZzZXRZICogd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhcclxuICAgICAgICAgICAgICAgIGNvcnJlY3RYLFxyXG4gICAgICAgICAgICAgICAgY29ycmVjdFksXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNvbG9yUGlja2VyLnZhbHVlXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRvb2xiYXJPbkNsaWNrQ2IpXHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJPbkNsaWNrQ2IoKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBpbml0Q29udHJvbGxlcihzaGFwZVN0cjogQVZBSUxfU0hBUEVTKTogSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24uY2xhc3NMaXN0LmFkZCgnaGlkZGVuJyk7XHJcbiAgICAgICAgc3dpdGNoIChzaGFwZVN0cikge1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5MaW5lOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5lTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcclxuICAgICAgICAgICAgY2FzZSBBVkFJTF9TSEFQRVMuUmVjdGFuZ2xlOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5TcXVhcmU6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFNxdWFyZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLkZhblBvbHk6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIodGhpcy5hcHBDYW52YXMpO1xyXG4gICAgICAgICAgICBjYXNlIEFWQUlMX1NIQVBFUy5DVlBvbHk6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IENWUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0luY29ycmVjdCBzaGFwZSBzdHJpbmcnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZWRpdEV4aXN0aW5nRmFuUG9seWdvbihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSBuZXcgRmFuUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgKHRoaXMuc2hhcGVDb250cm9sbGVyIGFzIEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXIpLnNldEN1cnJlbnRQb2x5Z29uKGlkKTtcclxuICAgIH1cclxuXHJcbiAgICBlZGl0RXhpc3RpbmdDVlBvbHlnb24oaWQ6IHN0cmluZykge1xyXG4gICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyID0gbmV3IENWUG9seWdvbk1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XHJcbiAgICAgICAgKHRoaXMuc2hhcGVDb250cm9sbGVyIGFzIENWUG9seWdvbk1ha2VyQ29udHJvbGxlcikuc2V0Q3VycmVudFBvbHlnb24oaWQpO1xyXG4gICAgfVxyXG5cclxuICAgIHN0YXJ0KCkge1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2hhcGVTdHIgaW4gQVZBSUxfU0hBUEVTKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2J1dHRvbicpO1xyXG4gICAgICAgICAgICBidXR0b24uY2xhc3NMaXN0LmFkZCgnc2hhcGUtYnV0dG9uJyk7XHJcbiAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHNoYXBlU3RyO1xyXG4gICAgICAgICAgICBidXR0b24ub25jbGljayA9ICgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyID0gdGhpcy5pbml0Q29udHJvbGxlcihcclxuICAgICAgICAgICAgICAgICAgICBzaGFwZVN0ciBhcyBBVkFJTF9TSEFQRVNcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMuYnV0dG9uQ29udGFpbmVyLmFwcGVuZENoaWxkKGJ1dHRvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IENvbG9yIGZyb20gJy4uLy4uLy4uL0Jhc2UvQ29sb3InO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gJy4uLy4uLy4uL0Jhc2UvVmVydGV4JztcclxuaW1wb3J0IENWUG9seWdvbiBmcm9tICcuLi8uLi8uLi9TaGFwZXMvQ1ZQb2x5Z29uJztcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vSVNoYXBlTWFrZXJDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENWUG9seWdvbk1ha2VyQ29udHJvbGxlclxyXG4gICAgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXJcclxue1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiBWZXJ0ZXggfCBudWxsID0gbnVsbDtcclxuICAgIHByaXZhdGUgc2Vjb25kUG9pbnQ6IFZlcnRleCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHJpdmF0ZSBjdXJyZW50UG9seTogQ1ZQb2x5Z29uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2V0LXBvbHlnb24nXHJcbiAgICAgICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRQb2ludCAhPT0gbnVsbFxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZWNvbmRQb2ludCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNldEN1cnJlbnRQb2x5Z29uKGlkOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gdGhpcy5hcHBDYW52YXMuc2hhcGVzW2lkXSBhcyBDVlBvbHlnb247XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLmN1cnJlbnRQb2x5LnBvaW50TGlzdFswXTtcclxuICAgICAgICB0aGlzLnNlY29uZFBvaW50ID0gdGhpcy5jdXJyZW50UG9seS5wb2ludExpc3RbMV07XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgY29uc3QgeyByLCBnLCBiIH0gPSBoZXhUb1JnYihoZXgpID8/IHsgcjogMCwgZzogMCwgYjogMCB9O1xyXG4gICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIgLyAyNTUsIGcgLyAyNTUsIGIgLyAyNTUpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ29yaWdpbiBzZXQnKTtcclxuICAgICAgICAgICAgXHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLnNlY29uZFBvaW50ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdzZWNvbmQgc2V0Jyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlY29uZFBvaW50ID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLnNlY29uZFBvaW50ICE9PSBudWxsICYmIHRoaXMuY3VycmVudFBvbHkgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ3NoYXBlIHNldCcpO1xyXG4gICAgICAgICAgICBjb25zdCBuZXdWZXJ0ZXggPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygncG9seWN2Jyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gbmV3IENWUG9seWdvbihpZCwgY29sb3IsIFt0aGlzLm9yaWdpbiwgdGhpcy5zZWNvbmRQb2ludCwgbmV3VmVydGV4XSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHRoaXMuY3VycmVudFBvbHkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UG9seSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seS5hZGRWZXJ0ZXgobmV3VmVydGV4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmVkaXRTaGFwZSh0aGlzLmN1cnJlbnRQb2x5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi8uLi8uLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IFZlcnRleCBmcm9tICcuLi8uLi8uLi9CYXNlL1ZlcnRleCc7XHJcbmltcG9ydCBGYW5Qb2x5Z29uIGZyb20gJy4uLy4uLy4uL1NoYXBlcy9GYW5Qb2x5Z29uJztcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tICcuLi8uLi8uLi91dGlscyc7XHJcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vSVNoYXBlTWFrZXJDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEZhblBvbHlnb25NYWtlckNvbnRyb2xsZXJcclxuICAgIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyXHJcbntcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIG9yaWdpbjogVmVydGV4IHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIGN1cnJlbnRQb2x5OiBGYW5Qb2x5Z29uIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIHNldFBvbHlnb25CdXR0b246IEhUTUxCdXR0b25FbGVtZW50O1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAnc2V0LXBvbHlnb24nXHJcbiAgICAgICAgKSBhcyBIVE1MQnV0dG9uRWxlbWVudDtcclxuICAgICAgICB0aGlzLnNldFBvbHlnb25CdXR0b24uY2xhc3NMaXN0LnJlbW92ZSgnaGlkZGVuJyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0UG9seWdvbkJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seSAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UG9seS5wb2ludExpc3QubGVuZ3RoID4gMlxyXG4gICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRDdXJyZW50UG9seWdvbihpZDogc3RyaW5nKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50UG9seSA9IHRoaXMuYXBwQ2FudmFzLnNoYXBlc1tpZF0gYXMgRmFuUG9seWdvbjtcclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHRoaXMuY3VycmVudFBvbHkucG9pbnRMaXN0WzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGhhbmRsZUNsaWNrKHg6IG51bWJlciwgeTogbnVtYmVyLCBoZXg6IHN0cmluZyk6IHZvaWQge1xyXG4gICAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyIC8gMjU1LCBnIC8gMjU1LCBiIC8gMjU1KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbmV3IFZlcnRleCh4LCB5LCBjb2xvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmICh0aGlzLm9yaWdpbiAhPT0gbnVsbCAmJiB0aGlzLmN1cnJlbnRQb2x5ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IG5ld1ZlcnRleCA9IG5ldyBWZXJ0ZXgoeCwgeSwgY29sb3IpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdwb2x5ZmFuJyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQb2x5ID0gbmV3IEZhblBvbHlnb24oaWQsIGNvbG9yLCBbdGhpcy5vcmlnaW4sIG5ld1ZlcnRleF0pO1xyXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5hZGRTaGFwZSh0aGlzLmN1cnJlbnRQb2x5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCBuZXdWZXJ0ZXggPSBuZXcgVmVydGV4KHgsIHksIGNvbG9yKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBvbHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBvbHkuYWRkVmVydGV4KG5ld1ZlcnRleCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFwcENhbnZhcy5lZGl0U2hhcGUodGhpcy5jdXJyZW50UG9seSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vLi4vLi4vQmFzZS9Db2xvclwiO1xyXG5pbXBvcnQgTGluZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL0xpbmVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XHJcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIsIGhleDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0ge3gsIHl9O1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHtyLCBnLCBifSA9IGhleFRvUmdiKGhleCkgPz8ge3I6IDAsIGc6IDAsIGI6IDB9O1xyXG4gICAgICAgICAgICBjb25zdCBjb2xvciA9IG5ldyBDb2xvcihyLzI1NSwgZy8yNTUsIGIvMjU1KTtcclxuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygnbGluZScpO1xyXG4gICAgICAgICAgICBjb25zdCBsaW5lID0gbmV3IExpbmUoaWQsIGNvbG9yLCB0aGlzLm9yaWdpbi54LCB0aGlzLm9yaWdpbi55LCB4LCB5KTtcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9SZWN0YW5nbGVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdyZWN0YW5nbGUnKTtcclxuICAgICAgICAgICAgY29uc3QgcmVjdGFuZ2xlID0gbmV3IFJlY3RhbmdsZShcclxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdGhpcy5vcmlnaW4ueCwgdGhpcy5vcmlnaW4ueSwgeCwgeSwwLDEsMSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHJlY3RhbmdsZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gXCIuLi8uLi8uLi9BcHBDYW52YXNcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSBcIi4uLy4uLy4uL1NoYXBlcy9TcXVhcmVcIjtcclxuaW1wb3J0IHsgaGV4VG9SZ2IgfSBmcm9tIFwiLi4vLi4vLi4vdXRpbHNcIjtcclxuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmVNYWtlckNvbnRyb2xsZXIgaW1wbGVtZW50cyBJU2hhcGVNYWtlckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlciwgaGV4OiBzdHJpbmcpOiB2b2lkIHtcclxuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5vcmlnaW4gPSB7eCwgeX07XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3Qge3IsIGcsIGJ9ID0gaGV4VG9SZ2IoaGV4KSA/PyB7cjogMCwgZzogMCwgYjogMH07XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbG9yID0gbmV3IENvbG9yKHIvMjU1LCBnLzI1NSwgYi8yNTUpO1xyXG4gICAgICAgICAgICBjb25zdCBpZCA9IHRoaXMuYXBwQ2FudmFzLmdlbmVyYXRlSWRGcm9tVGFnKCdzcXVhcmUnKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IHYxID0ge3g6IHgsIHk6IHl9O1xyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjF4OiAke3YxLnh9LCB2MXk6ICR7djEueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjIgPSB7eDogdGhpcy5vcmlnaW4ueCAtICh5IC0gdGhpcy5vcmlnaW4ueSksIFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSArICh4LXRoaXMub3JpZ2luLngpfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjJ4OiAke3YyLnh9LCB2Mnk6ICR7djIueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjMgPSB7eDogMip0aGlzLm9yaWdpbi54IC0geCwgXHJcbiAgICAgICAgICAgICAgICB5OiAyKnRoaXMub3JpZ2luLnkgLSB5fVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjN4OiAke3YzLnh9LCB2M3k6ICR7djMueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3QgdjQgPSB7eDogdGhpcy5vcmlnaW4ueCArICh5IC0gdGhpcy5vcmlnaW4ueSksIFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5vcmlnaW4ueSAtICh4LXRoaXMub3JpZ2luLngpfVxyXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhgdjR4OiAke3Y0Lnh9LCB2NHk6ICR7djQueX1gKVxyXG5cclxuICAgICAgICAgICAgY29uc3Qgc3F1YXJlID0gbmV3IFNxdWFyZShcclxuICAgICAgICAgICAgICAgIGlkLCBjb2xvciwgdjEueCwgdjEueSwgdjIueCwgdjIueSwgdjMueCwgdjMueSwgdjQueCwgdjQueSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHNxdWFyZSk7XHJcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4uLy4uLy4uL0FwcENhbnZhcyc7XHJcbmltcG9ydCBDVlBvbHlnb24gZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0NWUG9seWdvbic7XHJcbmltcG9ydCB7IGRlZ1RvUmFkLCBnZXRBbmdsZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi4vLi4vTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1ZQb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgc2NhbGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBERUZBVUxUX1NDQUxFID0gNTA7XHJcblxyXG4gICAgcHJpdmF0ZSBjdXJyZW50U2NhbGU6IG51bWJlciA9IDUwO1xyXG4gICAgcHJpdmF0ZSBjdlBvbHk6IENWUG9seWdvbjtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmYW5Qb2x5OiBDVlBvbHlnb24sXHJcbiAgICAgICAgYXBwQ2FudmFzOiBBcHBDYW52YXMsXHJcbiAgICAgICAgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlclxyXG4gICAgKSB7XHJcbiAgICAgICAgc3VwZXIoZmFuUG9seSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIgPSBjYW52YXNDb250cm9sbGVyO1xyXG4gICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlci50b29sYmFyT25DbGlja0NiID0gdGhpcy5pbml0VmVydGV4VG9vbGJhci5iaW5kKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLmN2UG9seSA9IGZhblBvbHk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWCcsXHJcbiAgICAgICAgICAgICgpID0+IGZhblBvbHkucG9pbnRMaXN0WzBdLngsXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy53aWR0aFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnBvc1hTbGlkZXIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFknLFxyXG4gICAgICAgICAgICAoKSA9PiBmYW5Qb2x5LnBvaW50TGlzdFswXS55LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2NhbGVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1NjYWxlJyxcclxuICAgICAgICAgICAgdGhpcy5nZXRDdXJyZW50U2NhbGUuYmluZCh0aGlzKSxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgMTAwXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMuc2NhbGVTbGlkZXIsICgpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTY2FsZShwYXJzZUludCh0aGlzLnNjYWxlU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY3VzdG9tVmVydGV4VG9vbGJhcigpIHtcclxuICAgICAgICBjb25zdCBhZGRWdHhCdXR0b24gPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbignQWRkIFZlcnRleCcpO1xyXG4gICAgICAgIGFkZFZ0eEJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIuZWRpdEV4aXN0aW5nQ1ZQb2x5Z29uKHRoaXMuY3ZQb2x5LmlkKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGNvbnN0IHJlbW92ZVZ0eEJ1dHRvbiA9IHRoaXMuY3JlYXRlVmVydGV4QnV0dG9uKCdSZW1vdmUgVmVydGV4Jyk7XHJcbiAgICAgICAgcmVtb3ZlVnR4QnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY3ZQb2x5LnJlbW92ZVZlcnRleChwYXJzZUludCh0aGlzLnNlbGVjdGVkVmVydGV4KSk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmN2UG9seSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVZlcnRleEJ1dHRvbih0ZXh0OiBzdHJpbmcpOiBIVE1MQnV0dG9uRWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1ggLSB0aGlzLmN2UG9seS5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3QgPSB0aGlzLmN2UG9seS5wb2ludExpc3QubWFwKCh2dHgpID0+IHtcclxuICAgICAgICAgICAgdnR4LnggKz0gZGlmZjtcclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmN2UG9seS5yZWNhbGMoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuY3ZQb2x5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1kgLSB0aGlzLmN2UG9seS5wb2ludExpc3RbMF0ueTtcclxuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3QgPSB0aGlzLmN2UG9seS5wb2ludExpc3QubWFwKCh2dHgsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICB2dHgueSArPSBkaWZmO1xyXG4gICAgICAgICAgICByZXR1cm4gdnR4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnJlY2FsYygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5jdlBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgZ2V0Q3VycmVudFNjYWxlKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRTY2FsZTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNjYWxlKG5ld1NjYWxlOiBudW1iZXIpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRTY2FsZSA9IG5ld1NjYWxlO1xyXG4gICAgICAgIHRoaXMuY3ZQb2x5LnBvaW50TGlzdCA9IHRoaXMuY3ZQb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKGdldEFuZ2xlKHRoaXMuY3ZQb2x5LmNlbnRlciwgdnR4KSk7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKHJhZCk7XHJcbiAgICAgICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKHJhZCk7XHJcblxyXG4gICAgICAgICAgICB2dHgueCA9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN2UG9seS5jZW50ZXIueCArXHJcbiAgICAgICAgICAgICAgICBjb3MgKlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3ZQb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuICAgICAgICAgICAgdnR4LnkgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5jdlBvbHkuY2VudGVyLnkgLVxyXG4gICAgICAgICAgICAgICAgc2luICpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN2UG9seS5sZW5MaXN0W2lkeF0gKlxyXG4gICAgICAgICAgICAgICAgICAgIChuZXdTY2FsZSAvIHRoaXMuREVGQVVMVF9TQ0FMRSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdnR4O1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5jdlBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3RbaWR4XS54ID0geDtcclxuICAgICAgICB0aGlzLmN2UG9seS5wb2ludExpc3RbaWR4XS55ID0geTtcclxuICAgICAgICB0aGlzLmN2UG9seS5yZWNhbGMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmN2UG9seSk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgRmFuUG9seWdvbiBmcm9tICcuLi8uLi8uLi9TaGFwZXMvRmFuUG9seWdvbic7XHJcbmltcG9ydCB7IGRlZ1RvUmFkLCBnZXRBbmdsZSB9IGZyb20gJy4uLy4uLy4uL3V0aWxzJztcclxuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi4vLi4vTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tICcuL1NoYXBlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFuUG9seWdvblRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHNjYWxlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG5cclxuICAgIHByaXZhdGUgREVGQVVMVF9TQ0FMRSA9IDUwO1xyXG5cclxuICAgIHByaXZhdGUgY3VycmVudFNjYWxlOiBudW1iZXIgPSA1MDtcclxuICAgIHByaXZhdGUgZmFuUG9seTogRmFuUG9seWdvbjtcclxuICAgIHByaXZhdGUgY2FudmFzQ29udHJvbGxlcjogQ2FudmFzQ29udHJvbGxlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihcclxuICAgICAgICBmYW5Qb2x5OiBGYW5Qb2x5Z29uLFxyXG4gICAgICAgIGFwcENhbnZhczogQXBwQ2FudmFzLFxyXG4gICAgICAgIGNhbnZhc0NvbnRyb2xsZXI6IENhbnZhc0NvbnRyb2xsZXJcclxuICAgICkge1xyXG4gICAgICAgIHN1cGVyKGZhblBvbHksIGFwcENhbnZhcyk7XHJcbiAgICAgICAgdGhpcy5jYW52YXNDb250cm9sbGVyID0gY2FudmFzQ29udHJvbGxlcjtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIudG9vbGJhck9uQ2xpY2tDYiA9IHRoaXMuaW5pdFZlcnRleFRvb2xiYXIuYmluZCh0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5ID0gZmFuUG9seTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcclxuICAgICAgICAgICAgKCkgPT4gZmFuUG9seS5wb2ludExpc3RbMF0ueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnUG9zaXRpb24gWScsXHJcbiAgICAgICAgICAgICgpID0+IGZhblBvbHkucG9pbnRMaXN0WzBdLnksXHJcbiAgICAgICAgICAgIDEsXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy5oZWlnaHRcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zY2FsZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgICAgICAnU2NhbGUnLFxyXG4gICAgICAgICAgICB0aGlzLmdldEN1cnJlbnRTY2FsZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICAxMDBcclxuICAgICAgICApO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5zY2FsZVNsaWRlciwgKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNjYWxlKHBhcnNlSW50KHRoaXMuc2NhbGVTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjdXN0b21WZXJ0ZXhUb29sYmFyKCkge1xyXG4gICAgICAgIGNvbnN0IGFkZFZ0eEJ1dHRvbiA9IHRoaXMuY3JlYXRlVmVydGV4QnV0dG9uKCdBZGQgVmVydGV4Jyk7XHJcbiAgICAgICAgYWRkVnR4QnV0dG9uLm9uY2xpY2sgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2FudmFzQ29udHJvbGxlci5lZGl0RXhpc3RpbmdGYW5Qb2x5Z29uKHRoaXMuZmFuUG9seS5pZCk7XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFZlcnRleFRvb2xiYXIoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBjb25zdCByZW1vdmVWdHhCdXR0b24gPSB0aGlzLmNyZWF0ZVZlcnRleEJ1dHRvbignUmVtb3ZlIFZlcnRleCcpO1xyXG4gICAgICAgIHJlbW92ZVZ0eEJ1dHRvbi5vbmNsaWNrID0gKGUpID0+IHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmZhblBvbHkucmVtb3ZlVmVydGV4KHBhcnNlSW50KHRoaXMuc2VsZWN0ZWRWZXJ0ZXgpKTtcclxuICAgICAgICAgICAgdGhpcy5pbml0VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuZmFuUG9seSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGNyZWF0ZVZlcnRleEJ1dHRvbih0ZXh0OiBzdHJpbmcpOiBIVE1MQnV0dG9uRWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgYnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYnV0dG9uJykgYXMgSFRNTEJ1dHRvbkVsZW1lbnQ7XHJcbiAgICAgICAgYnV0dG9uLnRleHRDb250ZW50ID0gdGV4dDtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhDb250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIGJ1dHRvbjtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IG5ld1Bvc1ggLSB0aGlzLmZhblBvbHkucG9pbnRMaXN0WzBdLng7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnBvaW50TGlzdCA9IHRoaXMuZmFuUG9seS5wb2ludExpc3QubWFwKCh2dHgpID0+IHtcclxuICAgICAgICAgICAgdnR4LnggKz0gZGlmZjtcclxuICAgICAgICAgICAgcmV0dXJuIHZ0eDtcclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucmVjYWxjKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlUG9zWShuZXdQb3NZOiBudW1iZXIpIHtcclxuICAgICAgICBjb25zdCBkaWZmID0gbmV3UG9zWSAtIHRoaXMuZmFuUG9seS5wb2ludExpc3RbMF0ueTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIHZ0eC55ICs9IGRpZmY7XHJcbiAgICAgICAgICAgIHJldHVybiB2dHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnJlY2FsYygpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5mYW5Qb2x5KTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGdldEN1cnJlbnRTY2FsZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50U2NhbGU7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVTY2FsZShuZXdTY2FsZTogbnVtYmVyKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50U2NhbGUgPSBuZXdTY2FsZTtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0ID0gdGhpcy5mYW5Qb2x5LnBvaW50TGlzdC5tYXAoKHZ0eCwgaWR4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKGdldEFuZ2xlKHRoaXMuZmFuUG9seS5jZW50ZXIsIHZ0eCkpO1xyXG4gICAgICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhyYWQpO1xyXG4gICAgICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xyXG5cclxuICAgICAgICAgICAgdnR4LnggPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5LmNlbnRlci54ICtcclxuICAgICAgICAgICAgICAgIGNvcyAqXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuICAgICAgICAgICAgdnR4LnkgPVxyXG4gICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5LmNlbnRlci55IC1cclxuICAgICAgICAgICAgICAgIHNpbiAqXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5mYW5Qb2x5Lmxlbkxpc3RbaWR4XSAqXHJcbiAgICAgICAgICAgICAgICAgICAgKG5ld1NjYWxlIC8gdGhpcy5ERUZBVUxUX1NDQUxFKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiB2dHg7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVZlcnRleChpZHg6IG51bWJlciwgeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcclxuICAgICAgICB0aGlzLmZhblBvbHkucG9pbnRMaXN0W2lkeF0ueCA9IHg7XHJcbiAgICAgICAgdGhpcy5mYW5Qb2x5LnBvaW50TGlzdFtpZHhdLnkgPSB5O1xyXG4gICAgICAgIHRoaXMuZmFuUG9seS5yZWNhbGMoKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmZhblBvbHkpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IExpbmUgZnJvbSAnLi4vLi4vLi4vU2hhcGVzL0xpbmUnO1xyXG5pbXBvcnQgeyBkZWdUb1JhZCwgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIGdldEFuZ2xlIH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIExpbmVUb29sYmFyQ29udHJvbGxlciBleHRlbmRzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBsZW5ndGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBwb3NYU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBwb3NZU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSByb3RhdGVTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcblxyXG4gICAgcHJpdmF0ZSBsaW5lOiBMaW5lO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKGxpbmU6IExpbmUsIGFwcENhbnZhczogQXBwQ2FudmFzKSB7XHJcbiAgICAgICAgc3VwZXIobGluZSwgYXBwQ2FudmFzKTtcclxuXHJcbiAgICAgICAgdGhpcy5saW5lID0gbGluZTtcclxuXHJcbiAgICAgICAgY29uc3QgZGlhZ29uYWwgPSBNYXRoLnNxcnQoXHJcbiAgICAgICAgICAgIGFwcENhbnZhcy53aWR0aCAqIGFwcENhbnZhcy53aWR0aCArXHJcbiAgICAgICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0ICogYXBwQ2FudmFzLmhlaWdodFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5sZW5ndGhTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ0xlbmd0aCcsXHJcbiAgICAgICAgICAgICgpID0+IGxpbmUubGVuZ3RoLFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBkaWFnb25hbFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVMZW5ndGgocGFyc2VJbnQodGhpcy5sZW5ndGhTbGlkZXIudmFsdWUpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoXHJcbiAgICAgICAgICAgICdQb3NpdGlvbiBYJyxcclxuICAgICAgICAgICAgKCkgPT4gbGluZS5wb2ludExpc3RbMF0ueCxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgYXBwQ2FudmFzLndpZHRoXHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NYKHBhcnNlSW50KHRoaXMucG9zWFNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnBvc1lTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcihcclxuICAgICAgICAgICAgJ1Bvc2l0aW9uIFknLFxyXG4gICAgICAgICAgICAoKSA9PiBsaW5lLnBvaW50TGlzdFswXS55LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICBhcHBDYW52YXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQb3NZKHBhcnNlSW50KHRoaXMucG9zWVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdSb3RhdGlvbicsIHRoaXMuY3VycmVudEFuZ2xlLmJpbmQodGhpcyksIDAsIDM2MCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLnJvdGF0ZVNsaWRlciwgKGUpID0+IHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbihwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgdXBkYXRlTGVuZ3RoKG5ld0xlbjogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgbGluZUxlbiA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLFxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdXHJcbiAgICAgICAgKTtcclxuICAgICAgICBjb25zdCBjb3MgPVxyXG4gICAgICAgICAgICAodGhpcy5saW5lLnBvaW50TGlzdFsxXS54IC0gdGhpcy5saW5lLnBvaW50TGlzdFswXS54KSAvIGxpbmVMZW47XHJcbiAgICAgICAgY29uc3Qgc2luID1cclxuICAgICAgICAgICAgKHRoaXMubGluZS5wb2ludExpc3RbMV0ueSAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSkgLyBsaW5lTGVuO1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9IG5ld0xlbiAqIGNvcyArIHRoaXMubGluZS5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnkgPSBuZXdMZW4gKiBzaW4gKyB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnk7XHJcblxyXG4gICAgICAgIHRoaXMubGluZS5sZW5ndGggPSBuZXdMZW47XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMubGluZS5wb2ludExpc3RbMV0ueCAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnggPSBuZXdQb3NYO1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueCA9IG5ld1Bvc1ggKyBkaWZmO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgZGlmZiA9IHRoaXMubGluZS5wb2ludExpc3RbMV0ueSAtIHRoaXMubGluZS5wb2ludExpc3RbMF0ueTtcclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnkgPSBuZXdQb3NZO1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9IG5ld1Bvc1kgKyBkaWZmO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGN1cnJlbnRBbmdsZSgpIHtcclxuICAgICAgICByZXR1cm4gZ2V0QW5nbGUodGhpcy5saW5lLnBvaW50TGlzdFswXSwgdGhpcy5saW5lLnBvaW50TGlzdFsxXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihuZXdSb3Q6IG51bWJlcikge1xyXG4gICAgICAgIGNvbnN0IHJhZCA9IGRlZ1RvUmFkKG5ld1JvdCk7XHJcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MocmFkKTtcclxuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihyYWQpO1xyXG5cclxuICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdLnggPVxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLnggKyBjb3MgKiB0aGlzLmxpbmUubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMV0ueSA9XHJcbiAgICAgICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbMF0ueSAtIHNpbiAqIHRoaXMubGluZS5sZW5ndGg7XHJcblxyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5saW5lKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XHJcbiAgICAgICAgdGhpcy5saW5lLnBvaW50TGlzdFtpZHhdLnggPSB4O1xyXG4gICAgICAgIHRoaXMubGluZS5wb2ludExpc3RbaWR4XS55ID0geTtcclxuXHJcbiAgICAgICAgdGhpcy5saW5lLmxlbmd0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KFxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzBdLFxyXG4gICAgICAgICAgICB0aGlzLmxpbmUucG9pbnRMaXN0WzFdXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLmxpbmUpO1xyXG4gICAgfVxyXG5cclxuICAgIGN1c3RvbVZlcnRleFRvb2xiYXIoKTogdm9pZCB7fVxyXG59XHJcbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IFJlY3RhbmdsZSBmcm9tICcuLi8uLi8uLi9TaGFwZXMvUmVjdGFuZ2xlJztcclxuaW1wb3J0IHsgZGVnVG9SYWQsIGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5pbXBvcnQgeyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyIGV4dGVuZHMgU2hhcGVUb29sYmFyQ29udHJvbGxlciB7XHJcbiAgICBwcml2YXRlIHBvc1hTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHdpZHRoU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBsZW5ndGhTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIHJvdGF0ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuXHJcbiAgICBwcml2YXRlIHJlY3RhbmdsZTogUmVjdGFuZ2xlO1xyXG4gICAgcHJpdmF0ZSBpbml0aWFsUm90YXRpb25WYWx1ZTogbnVtYmVyID0gMDtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihyZWN0YW5nbGU6IFJlY3RhbmdsZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpe1xyXG4gICAgICAgIHN1cGVyKHJlY3RhbmdsZSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZSA9IHJlY3RhbmdsZTtcclxuXHJcbiAgICAgICAgLy8gWCBQb3NpdGlvblxyXG4gICAgICAgIHRoaXMucG9zWFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBYJywgKCkgPT4gcmVjdGFuZ2xlLmNlbnRlci54LDEsYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1gocGFyc2VJbnQodGhpcy5wb3NYU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICAvLyBZIFBvc2l0aW9uXHJcbiAgICAgICAgdGhpcy5wb3NZU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFknLCAoKSA9PiByZWN0YW5nbGUuY2VudGVyLnksMSxhcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NZU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWShwYXJzZUludCh0aGlzLnBvc1lTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMubGVuZ3RoU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ0xlbmd0aCcsICgpID0+IHJlY3RhbmdsZS5sZW5ndGgsIDEsIGFwcENhbnZhcy53aWR0aCk7XHJcbiAgICAgICAgdGhpcy5yZWdpc3RlclNsaWRlcih0aGlzLmxlbmd0aFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZUxlbmd0aChwYXJzZUludCh0aGlzLmxlbmd0aFNsaWRlci52YWx1ZSkpfSlcclxuXHJcbiAgICAgICAgdGhpcy53aWR0aFNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdXaWR0aCcsICgpID0+IHRoaXMucmVjdGFuZ2xlLndpZHRoLCAxLCBhcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy53aWR0aFNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVdpZHRoKHBhcnNlSW50KHRoaXMud2lkdGhTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgKCkgPT4gMCwgLTE4MCwgMTgwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge3RoaXMuaGFuZGxlUm90YXRpb25FbmR9KVxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlUm90YXRpb25TdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVSb3RhdGlvblN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZVJvdGF0aW9uRW5kLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5oYW5kbGVSb3RhdGlvbkVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDpudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NYIC0gdGhpcy5yZWN0YW5nbGUuY2VudGVyLng7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnggKz0gZGlmZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUucmVjYWxjdWxhdGUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTpudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NZIC0gdGhpcy5yZWN0YW5nbGUuY2VudGVyLnk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnkgKz0gZGlmZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUucmVjYWxjdWxhdGUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZUxlbmd0aChuZXdMZW5ndGg6bnVtYmVyKXtcclxuXHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSAtdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnM7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS51cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKTtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudExlbmd0aCA9IGV1Y2xpZGVhbkRpc3RhbmNlVnR4KHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFswXSwgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0WzFdKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCBzY2FsZUZhY3RvciA9IG5ld0xlbmd0aCAvIGN1cnJlbnRMZW5ndGg7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7IGk8NDsgaSsrKXtcclxuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnggPSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbMF0ueCArICh0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbaV0ueCAtIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFswXS54KSAqIHNjYWxlRmFjdG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSAtdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnM7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS51cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKTtcclxuXHJcbiAgICAgICAgLy8gdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSAwO1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVdpZHRoKG5ld1dpZHRoOm51bWJlcil7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSAtdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnM7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS51cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKTtcclxuXHJcbiAgICAgICAgY29uc3QgY3VycmVudFdpZHRoID0gZXVjbGlkZWFuRGlzdGFuY2VWdHgodGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0WzFdLCB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbM10pO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IHNjYWxlRmFjdG9yID0gbmV3V2lkdGggLyBjdXJyZW50V2lkdGg7XHJcbiAgICAgICAgZm9yKGxldCBpPTE7IGk8NDsgaSsrKXtcclxuICAgICAgICAgICAgaWYgKGkgIT0gMSlcclxuICAgICAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpXS55ID0gdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0WzFdLnkgKyAodGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2ldLnkgLSB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbMV0ueSkgKiBzY2FsZUZhY3RvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnMgPSAtdGhpcy5yZWN0YW5nbGUuYW5nbGVJblJhZGlhbnM7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS51cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKTtcclxuICAgICAgICAvLyB0aGlzLnJlY3RhbmdsZS5hbmdsZUluUmFkaWFucyA9IDA7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVSb3RhdGlvblN0YXJ0KGU6IEV2ZW50KSB7XHJcbiAgICAgICAgdGhpcy5pbml0aWFsUm90YXRpb25WYWx1ZSA9IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIGhhbmRsZVJvdGF0aW9uRW5kKGU6IEV2ZW50KSB7XHJcbiAgICAgICAgbGV0IGZpbmFsUm90YXRpb25WYWx1ZSA9IHBhcnNlSW50KHRoaXMucm90YXRlU2xpZGVyLnZhbHVlKTtcclxuICAgICAgICBsZXQgZGVsdGFSb3RhdGlvbiA9IGZpbmFsUm90YXRpb25WYWx1ZSAtIHRoaXMuaW5pdGlhbFJvdGF0aW9uVmFsdWU7XHJcbiAgICAgICAgdGhpcy51cGRhdGVSb3RhdGlvbih0aGlzLmluaXRpYWxSb3RhdGlvblZhbHVlLCBkZWx0YVJvdGF0aW9uKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVJvdGF0aW9uKGluaXRpYWxSb3RhdGlvbjogbnVtYmVyLCBkZWx0YVJvdGF0aW9uOiBudW1iZXIpe1xyXG4gICAgICAgIHRoaXMucmVjdGFuZ2xlLmFuZ2xlSW5SYWRpYW5zID0gZGVnVG9SYWQoZGVsdGFSb3RhdGlvbik7XHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuICAgICAgICB0aGlzLnJlY3RhbmdsZS51cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMucmVjdGFuZ2xlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVWZXJ0ZXgoaWR4OiBudW1iZXIsIHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZHtcclxuICAgICAgICBjb25zdCBtb3ZlZFZlcnRleCA9IHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtpZHhdO1xyXG4gICAgICAgIGNvbnN0IGR4ID0geCAtIG1vdmVkVmVydGV4Lng7XHJcbiAgICAgICAgY29uc3QgZHkgPSB5IC0gbW92ZWRWZXJ0ZXgueTtcclxuXHJcbiAgICAgICAgbW92ZWRWZXJ0ZXgueCA9IHg7XHJcbiAgICAgICAgbW92ZWRWZXJ0ZXgueSA9IHk7XHJcbiAgICAgICAgY29uc3QgY3dBZGphY2VudElkeCA9IHRoaXMucmVjdGFuZ2xlLmZpbmRDV0FkamFjZW50KGlkeCk7XHJcbiAgICAgICAgY29uc3QgY2N3QWRqYWNlbnRJZHggPSB0aGlzLnJlY3RhbmdsZS5maW5kQ0NXQWRqYWNlbnQoaWR4KTtcclxuXHJcbiAgICAgICAgaWYgKGlkeCAlIDIgPT09IDApIHtcclxuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2N3QWRqYWNlbnRJZHhdLnggKz0gZHg7XHJcbiAgICAgICAgICAgIHRoaXMucmVjdGFuZ2xlLnBvaW50TGlzdFtjY3dBZGphY2VudElkeF0ueSArPSBkeTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB0aGlzLnJlY3RhbmdsZS5wb2ludExpc3RbY3dBZGphY2VudElkeF0ueSArPSBkeTtcclxuICAgICAgICAgICAgdGhpcy5yZWN0YW5nbGUucG9pbnRMaXN0W2Njd0FkamFjZW50SWR4XS54ICs9IGR4O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5yZWN0YW5nbGUucmVjYWxjdWxhdGUoKVxyXG4gICAgICAgXHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnJlY3RhbmdsZSk7XHJcbiAgICB9XHJcbiAgICBjdXN0b21WZXJ0ZXhUb29sYmFyKCk6IHZvaWQge31cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi8uLi8uLi9CYXNlL0Jhc2VTaGFwZSc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi8uLi8uLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IHsgaGV4VG9SZ2IsIHJnYlRvSGV4IH0gZnJvbSAnLi4vLi4vLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNoYXBlVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHVibGljIGFwcENhbnZhczogQXBwQ2FudmFzO1xyXG4gICAgcHJpdmF0ZSBzaGFwZTogQmFzZVNoYXBlO1xyXG5cclxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwdWJsaWMgdmVydGV4Q29udGFpbmVyOiBIVE1MRGl2RWxlbWVudDtcclxuXHJcbiAgICBwdWJsaWMgdmVydGV4UGlja2VyOiBIVE1MU2VsZWN0RWxlbWVudDtcclxuICAgIHB1YmxpYyBzZWxlY3RlZFZlcnRleCA9ICcwJztcclxuXHJcbiAgICBwdWJsaWMgdnR4UG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG4gICAgcHVibGljIHZ0eFBvc1lTbGlkZXI6IEhUTUxJbnB1dEVsZW1lbnQgfCBudWxsID0gbnVsbDtcclxuICAgIHB1YmxpYyB2dHhDb2xvclBpY2tlcjogSFRNTElucHV0RWxlbWVudCB8IG51bGwgPSBudWxsO1xyXG5cclxuICAgIHByaXZhdGUgc2xpZGVyTGlzdDogSFRNTElucHV0RWxlbWVudFtdID0gW107XHJcbiAgICBwcml2YXRlIGdldHRlckxpc3Q6ICgoKSA9PiBudW1iZXIpW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzaGFwZTogQmFzZVNoYXBlLCBhcHBDYW52YXM6IEFwcENhbnZhcykge1xyXG4gICAgICAgIHRoaXMuc2hhcGUgPSBzaGFwZTtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuXHJcbiAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXHJcbiAgICAgICAgICAgICd0b29sYmFyLWNvbnRhaW5lcidcclxuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndmVydGV4LWNvbnRhaW5lcidcclxuICAgICAgICApIGFzIEhUTUxEaXZFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleFBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndmVydGV4LXBpY2tlcidcclxuICAgICAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLmluaXRWZXJ0ZXhUb29sYmFyKCk7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlU2xpZGVyKFxyXG4gICAgICAgIGxhYmVsOiBzdHJpbmcsXHJcbiAgICAgICAgdmFsdWVHZXR0ZXI6ICgpID0+IG51bWJlcixcclxuICAgICAgICBtaW46IG51bWJlcixcclxuICAgICAgICBtYXg6IG51bWJlclxyXG4gICAgKTogSFRNTElucHV0RWxlbWVudCB7XHJcbiAgICAgICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgY29udGFpbmVyLmNsYXNzTGlzdC5hZGQoJ3Rvb2xiYXItc2xpZGVyLWNvbnRhaW5lcicpO1xyXG5cclxuICAgICAgICBjb25zdCBsYWJlbEVsbXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBsYWJlbEVsbXQudGV4dENvbnRlbnQgPSBsYWJlbDtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQobGFiZWxFbG10KTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2xpZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKSBhcyBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgICAgIHNsaWRlci50eXBlID0gJ3JhbmdlJztcclxuICAgICAgICBzbGlkZXIubWluID0gbWluLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgc2xpZGVyLm1heCA9IG1heC50b1N0cmluZygpO1xyXG4gICAgICAgIHNsaWRlci52YWx1ZSA9IHZhbHVlR2V0dGVyKCkudG9TdHJpbmcoKTtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoc2xpZGVyKTtcclxuXHJcbiAgICAgICAgdGhpcy50b29sYmFyQ29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIHRoaXMuc2xpZGVyTGlzdC5wdXNoKHNsaWRlcik7XHJcbiAgICAgICAgdGhpcy5nZXR0ZXJMaXN0LnB1c2godmFsdWVHZXR0ZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gc2xpZGVyO1xyXG4gICAgfVxyXG5cclxuICAgIHJlZ2lzdGVyU2xpZGVyKHNsaWRlcjogSFRNTElucHV0RWxlbWVudCwgY2I6IChlOiBFdmVudCkgPT4gYW55KSB7XHJcbiAgICAgICAgY29uc3QgbmV3Q2IgPSAoZTogRXZlbnQpID0+IHtcclxuICAgICAgICAgICAgY2IoZSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlU2xpZGVycyhzbGlkZXIpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgc2xpZGVyLm9uY2hhbmdlID0gbmV3Q2I7XHJcbiAgICAgICAgc2xpZGVyLm9uaW5wdXQgPSBuZXdDYjtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTaGFwZShuZXdTaGFwZTogQmFzZVNoYXBlKSB7XHJcbiAgICAgICAgdGhpcy5hcHBDYW52YXMuZWRpdFNoYXBlKG5ld1NoYXBlKTtcclxuICAgIH1cclxuXHJcbiAgICB1cGRhdGVTbGlkZXJzKGlnbm9yZVNsaWRlcjogSFRNTElucHV0RWxlbWVudCkge1xyXG4gICAgICAgIHRoaXMuc2xpZGVyTGlzdC5mb3JFYWNoKChzbGlkZXIsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaWdub3JlU2xpZGVyID09PSBzbGlkZXIpIHJldHVybjtcclxuICAgICAgICAgICAgc2xpZGVyLnZhbHVlID0gdGhpcy5nZXR0ZXJMaXN0W2lkeF0oKS50b1N0cmluZygpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy52dHhQb3NYU2xpZGVyICYmIHRoaXMudnR4UG9zWVNsaWRlcikge1xyXG4gICAgICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludCh0aGlzLnZlcnRleFBpY2tlci52YWx1ZSk7XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleCA9IHRoaXMuc2hhcGUucG9pbnRMaXN0W2lkeF07XHJcblxyXG4gICAgICAgICAgICB0aGlzLnZ0eFBvc1hTbGlkZXIudmFsdWUgPSB2ZXJ0ZXgueC50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB0aGlzLnZ0eFBvc1lTbGlkZXIudmFsdWUgPSB2ZXJ0ZXgueS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVTbGlkZXJWZXJ0ZXgoXHJcbiAgICAgICAgbGFiZWw6IHN0cmluZyxcclxuICAgICAgICBjdXJyZW50TGVuZ3RoOiBudW1iZXIsXHJcbiAgICAgICAgbWluOiBudW1iZXIsXHJcbiAgICAgICAgbWF4OiBudW1iZXJcclxuICAgICk6IEhUTUxJbnB1dEVsZW1lbnQge1xyXG4gICAgICAgIGNvbnN0IGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGNvbnRhaW5lci5jbGFzc0xpc3QuYWRkKCd0b29sYmFyLXNsaWRlci1jb250YWluZXInKTtcclxuXHJcbiAgICAgICAgY29uc3QgbGFiZWxFbG10ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICAgICAgbGFiZWxFbG10LnRleHRDb250ZW50ID0gbGFiZWw7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKGxhYmVsRWxtdCk7XHJcblxyXG4gICAgICAgIGNvbnN0IHNsaWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBzbGlkZXIudHlwZSA9ICdyYW5nZSc7XHJcbiAgICAgICAgc2xpZGVyLm1pbiA9IG1pbi50b1N0cmluZygpO1xyXG4gICAgICAgIHNsaWRlci5tYXggPSBtYXgudG9TdHJpbmcoKTtcclxuICAgICAgICBzbGlkZXIudmFsdWUgPSBjdXJyZW50TGVuZ3RoLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgY29udGFpbmVyLmFwcGVuZENoaWxkKHNsaWRlcik7XHJcblxyXG4gICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgIHJldHVybiBzbGlkZXI7XHJcbiAgICB9XHJcblxyXG4gICAgY3JlYXRlQ29sb3JQaWNrZXJWZXJ0ZXgobGFiZWw6IHN0cmluZywgaGV4OiBzdHJpbmcpOiBIVE1MSW5wdXRFbGVtZW50IHtcclxuICAgICAgICBjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBjb250YWluZXIuY2xhc3NMaXN0LmFkZCgndG9vbGJhci1zbGlkZXItY29udGFpbmVyJyk7XHJcblxyXG4gICAgICAgIGNvbnN0IGxhYmVsRWxtdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgICAgIGxhYmVsRWxtdC50ZXh0Q29udGVudCA9IGxhYmVsO1xyXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmRDaGlsZChsYWJlbEVsbXQpO1xyXG5cclxuICAgICAgICBjb25zdCBjb2xvclBpY2tlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0JykgYXMgSFRNTElucHV0RWxlbWVudDtcclxuICAgICAgICBjb2xvclBpY2tlci50eXBlID0gJ2NvbG9yJztcclxuICAgICAgICBjb2xvclBpY2tlci52YWx1ZSA9IGhleDtcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoY29sb3JQaWNrZXIpO1xyXG5cclxuICAgICAgICB0aGlzLnZlcnRleENvbnRhaW5lci5hcHBlbmRDaGlsZChjb250YWluZXIpO1xyXG5cclxuICAgICAgICByZXR1cm4gY29sb3JQaWNrZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZHJhd1ZlcnRleFRvb2xiYXIoKSB7XHJcbiAgICAgICAgd2hpbGUgKHRoaXMudmVydGV4Q29udGFpbmVyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMudmVydGV4Q29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMudmVydGV4Q29udGFpbmVyLmZpcnN0Q2hpbGQpO1xyXG5cclxuICAgICAgICBjb25zdCBpZHggPSBwYXJzZUludCh0aGlzLnZlcnRleFBpY2tlci52YWx1ZSk7XHJcbiAgICAgICAgY29uc3QgdmVydGV4ID0gdGhpcy5zaGFwZS5wb2ludExpc3RbaWR4XTtcclxuXHJcbiAgICAgICAgdGhpcy52dHhQb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXJWZXJ0ZXgoXHJcbiAgICAgICAgICAgICdQb3MgWCcsXHJcbiAgICAgICAgICAgIHZlcnRleC54LFxyXG4gICAgICAgICAgICAxLFxyXG4gICAgICAgICAgICB0aGlzLmFwcENhbnZhcy53aWR0aFxyXG4gICAgICAgICk7XHJcblxyXG4gICAgICAgIHRoaXMudnR4UG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyVmVydGV4KFxyXG4gICAgICAgICAgICAnUG9zIFknLFxyXG4gICAgICAgICAgICB2ZXJ0ZXgueSxcclxuICAgICAgICAgICAgMSxcclxuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuaGVpZ2h0XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXBkYXRlU2xpZGVyID0gKCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52dHhQb3NYU2xpZGVyICYmIHRoaXMudnR4UG9zWVNsaWRlcilcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlVmVydGV4KFxyXG4gICAgICAgICAgICAgICAgICAgIGlkeCxcclxuICAgICAgICAgICAgICAgICAgICBwYXJzZUludCh0aGlzLnZ0eFBvc1hTbGlkZXIudmFsdWUpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcnNlSW50KHRoaXMudnR4UG9zWVNsaWRlci52YWx1ZSlcclxuICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgdGhpcy52dHhDb2xvclBpY2tlciA9IHRoaXMuY3JlYXRlQ29sb3JQaWNrZXJWZXJ0ZXgoXHJcbiAgICAgICAgICAgICdDb2xvcicsXHJcbiAgICAgICAgICAgIHJnYlRvSGV4KHZlcnRleC5jLnIgKiAyNTUsIHZlcnRleC5jLmcgKiAyNTUsIHZlcnRleC5jLmIgKiAyNTUpXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgY29uc3QgdXBkYXRlQ29sb3IgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgciwgZywgYiB9ID0gaGV4VG9SZ2IoXHJcbiAgICAgICAgICAgICAgICB0aGlzLnZ0eENvbG9yUGlja2VyPy52YWx1ZSA/PyAnIzAwMDAwMCdcclxuICAgICAgICAgICAgKSA/PyB7IHI6IDAsIGc6IDAsIGI6IDAgfTtcclxuICAgICAgICAgICAgY29uc3QgY29sb3IgPSBuZXcgQ29sb3IociAvIDI1NSwgZyAvIDI1NSwgYiAvIDI1NSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLnNoYXBlLnBvaW50TGlzdFtpZHhdLmMgPSBjb2xvcjtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWZXJ0ZXgoXHJcbiAgICAgICAgICAgICAgICBpZHgsXHJcbiAgICAgICAgICAgICAgICBwYXJzZUludCh0aGlzLnZ0eFBvc1hTbGlkZXI/LnZhbHVlID8/IHZlcnRleC54LnRvU3RyaW5nKCkpLFxyXG4gICAgICAgICAgICAgICAgcGFyc2VJbnQodGhpcy52dHhQb3NZU2xpZGVyPy52YWx1ZSA/PyB2ZXJ0ZXgueS50b1N0cmluZygpKVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhQb3NYU2xpZGVyLCB1cGRhdGVTbGlkZXIpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhQb3NZU2xpZGVyLCB1cGRhdGVTbGlkZXIpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy52dHhDb2xvclBpY2tlciwgdXBkYXRlQ29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLmN1c3RvbVZlcnRleFRvb2xiYXIoKTtcclxuICAgIH1cclxuXHJcbiAgICBpbml0VmVydGV4VG9vbGJhcigpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy52ZXJ0ZXhQaWNrZXIuZmlyc3RDaGlsZClcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIucmVtb3ZlQ2hpbGQodGhpcy52ZXJ0ZXhQaWNrZXIuZmlyc3RDaGlsZCk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hhcGUucG9pbnRMaXN0LmZvckVhY2goKF8sIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICAgICAgb3B0aW9uLnZhbHVlID0gaWR4LnRvU3RyaW5nKCk7XHJcbiAgICAgICAgICAgIG9wdGlvbi5sYWJlbCA9IGBWZXJ0ZXggJHtpZHh9YDtcclxuICAgICAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIuYXBwZW5kQ2hpbGQob3B0aW9uKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIudmFsdWUgPSAnMCc7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFZlcnRleCA9IHRoaXMudmVydGV4UGlja2VyLnZhbHVlO1xyXG4gICAgICAgIHRoaXMuZHJhd1ZlcnRleFRvb2xiYXIoKTtcclxuXHJcbiAgICAgICAgdGhpcy52ZXJ0ZXhQaWNrZXIub25jaGFuZ2UgPSAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRWZXJ0ZXggPSB0aGlzLnZlcnRleFBpY2tlci52YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kcmF3VmVydGV4VG9vbGJhcigpO1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgYWJzdHJhY3QgY3VzdG9tVmVydGV4VG9vbGJhcigpOiB2b2lkO1xyXG4gICAgYWJzdHJhY3QgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQ7XHJcbn1cclxuIiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tICcuLi8uLi8uLi9BcHBDYW52YXMnO1xyXG5pbXBvcnQgU3F1YXJlIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvU3F1YXJlXCI7XHJcbmltcG9ydCB7IGRlZ1RvUmFkIH0gZnJvbSBcIi4uLy4uLy4uL3V0aWxzXCI7XHJcbmltcG9ydCB7IFNoYXBlVG9vbGJhckNvbnRyb2xsZXIgfSBmcm9tIFwiLi9TaGFwZVRvb2xiYXJDb250cm9sbGVyXCI7XHJcblxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3F1YXJlVG9vbGJhckNvbnRyb2xsZXIgZXh0ZW5kcyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHtcclxuICAgIHByaXZhdGUgcG9zWFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcG9zWVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgc2l6ZVNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgcm90YXRlU2xpZGVyOiBIVE1MSW5wdXRFbGVtZW50O1xyXG4gICAgLy8gcHJpdmF0ZSBwb2ludFNsaWRlcjogSFRNTElucHV0RWxlbWVudDtcclxuICAgIHByaXZhdGUgaW5pdGlhbFJvdGF0aW9uVmFsdWU6IG51bWJlciA9IDA7XHJcblxyXG4gICAgcHJpdmF0ZSBzcXVhcmU6IFNxdWFyZTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihzcXVhcmU6IFNxdWFyZSwgYXBwQ2FudmFzOiBBcHBDYW52YXMpe1xyXG4gICAgICAgIHN1cGVyKHNxdWFyZSwgYXBwQ2FudmFzKTtcclxuICAgICAgICB0aGlzLnNxdWFyZSA9IHNxdWFyZTtcclxuXHJcbiAgICAgICAgdGhpcy5wb3NYU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1Bvc2l0aW9uIFgnLCAoKSA9PiBzcXVhcmUuY2VudGVyLngsMSxhcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5wb3NYU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlUG9zWChwYXJzZUludCh0aGlzLnBvc1hTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMucG9zWVNsaWRlciA9IHRoaXMuY3JlYXRlU2xpZGVyKCdQb3NpdGlvbiBZJywgKCkgPT4gc3F1YXJlLmNlbnRlci55LDEsYXBwQ2FudmFzLndpZHRoKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucG9zWVNsaWRlciwgKGUpID0+IHt0aGlzLnVwZGF0ZVBvc1kocGFyc2VJbnQodGhpcy5wb3NZU2xpZGVyLnZhbHVlKSl9KVxyXG5cclxuICAgICAgICB0aGlzLnNpemVTbGlkZXIgPSB0aGlzLmNyZWF0ZVNsaWRlcignU2l6ZScsICgpID0+IHNxdWFyZS5zaXplLCAxLCBhcHBDYW52YXMud2lkdGgpO1xyXG4gICAgICAgIHRoaXMucmVnaXN0ZXJTbGlkZXIodGhpcy5zaXplU2xpZGVyLCAoZSkgPT4ge3RoaXMudXBkYXRlU2l6ZShwYXJzZUludCh0aGlzLnNpemVTbGlkZXIudmFsdWUpKX0pXHJcblxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyID0gdGhpcy5jcmVhdGVTbGlkZXIoJ1JvdGF0aW9uJywgKCkgPT4gMCwgLTE4MCwgMTgwKTtcclxuICAgICAgICB0aGlzLnJlZ2lzdGVyU2xpZGVyKHRoaXMucm90YXRlU2xpZGVyLCAoZSkgPT4ge3RoaXMuaGFuZGxlUm90YXRpb25FbmR9KVxyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHRoaXMuaGFuZGxlUm90YXRpb25TdGFydC5iaW5kKHRoaXMpKTtcclxuICAgICAgICB0aGlzLnJvdGF0ZVNsaWRlci5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgdGhpcy5oYW5kbGVSb3RhdGlvblN0YXJ0LmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLmhhbmRsZVJvdGF0aW9uRW5kLmJpbmQodGhpcykpO1xyXG4gICAgICAgIHRoaXMucm90YXRlU2xpZGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3RvdWNoZW5kJywgdGhpcy5oYW5kbGVSb3RhdGlvbkVuZC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1gobmV3UG9zWDpudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NYIC0gdGhpcy5zcXVhcmUuY2VudGVyLng7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnggKz0gZGlmZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zcXVhcmUucmVjYWxjdWxhdGUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVBvc1kobmV3UG9zWTpudW1iZXIpe1xyXG4gICAgICAgIGNvbnN0IGRpZmYgPSBuZXdQb3NZIC0gdGhpcy5zcXVhcmUuY2VudGVyLnk7XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgdGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnkgKz0gZGlmZjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5zcXVhcmUucmVjYWxjdWxhdGUoKTtcclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIHVwZGF0ZVNpemUobmV3U2l6ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgY29uc3QgaGFsZk5ld1NpemUgPSBuZXdTaXplIC8gMjtcclxuICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMuc3F1YXJlLmFuZ2xlSW5SYWRpYW5zO1xyXG5cclxuICAgICAgICBjb25zdCBvZmZzZXRzID0gW1xyXG4gICAgICAgICAgICB7IHg6IC1oYWxmTmV3U2l6ZSwgeTogLWhhbGZOZXdTaXplIH0sIC8vIFRvcCBsZWZ0XHJcbiAgICAgICAgICAgIHsgeDogaGFsZk5ld1NpemUsIHk6IC1oYWxmTmV3U2l6ZSB9LCAgLy8gVG9wIHJpZ2h0XHJcbiAgICAgICAgICAgIHsgeDogaGFsZk5ld1NpemUsIHk6IGhhbGZOZXdTaXplIH0sICAgLy8gQm90dG9tIHJpZ2h0XHJcbiAgICAgICAgICAgIHsgeDogLWhhbGZOZXdTaXplLCB5OiBoYWxmTmV3U2l6ZSB9LCAgLy8gQm90dG9tIGxlZnRcclxuICAgICAgICBdO1xyXG4gICAgXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCA0OyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3Qgb2Zmc2V0ID0gb2Zmc2V0c1tpXTtcclxuICAgICAgICAgICAgdGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldID0ge1xyXG4gICAgICAgICAgICAgICAgeDogdGhpcy5zcXVhcmUuY2VudGVyLnggKyBvZmZzZXQueCAqIE1hdGguY29zKGFuZ2xlKSAtIG9mZnNldC55ICogTWF0aC5zaW4oYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgeTogdGhpcy5zcXVhcmUuY2VudGVyLnkgKyBvZmZzZXQueCAqIE1hdGguc2luKGFuZ2xlKSArIG9mZnNldC55ICogTWF0aC5jb3MoYW5nbGUpLFxyXG4gICAgICAgICAgICAgICAgYzogdGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLmNcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICBcclxuICAgICAgICB0aGlzLnNxdWFyZS5zaXplID0gbmV3U2l6ZTtcclxuICAgICAgICB0aGlzLnNxdWFyZS5yZWNhbGN1bGF0ZSgpO1xyXG4gICAgICAgIHRoaXMudXBkYXRlU2hhcGUodGhpcy5zcXVhcmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgaGFuZGxlUm90YXRpb25TdGFydChlOiBFdmVudCkge1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFJvdGF0aW9uVmFsdWUgPSBwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBoYW5kbGVSb3RhdGlvbkVuZChlOiBFdmVudCkge1xyXG4gICAgICAgIGxldCBmaW5hbFJvdGF0aW9uVmFsdWUgPSBwYXJzZUludCh0aGlzLnJvdGF0ZVNsaWRlci52YWx1ZSk7XHJcbiAgICAgICAgbGV0IGRlbHRhUm90YXRpb24gPSBmaW5hbFJvdGF0aW9uVmFsdWUgLSB0aGlzLmluaXRpYWxSb3RhdGlvblZhbHVlO1xyXG4gICAgICAgIHRoaXMudXBkYXRlUm90YXRpb24odGhpcy5pbml0aWFsUm90YXRpb25WYWx1ZSwgZGVsdGFSb3RhdGlvbik7XHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSB1cGRhdGVSb3RhdGlvbihpbml0aWFsUm90YXRpb246IG51bWJlciwgZGVsdGFSb3RhdGlvbjogbnVtYmVyKXtcclxuICAgICAgICB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IGRlZ1RvUmFkKGRlbHRhUm90YXRpb24pO1xyXG4gICAgICAgIHRoaXMuc3F1YXJlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcbiAgICAgICAgdGhpcy5zcXVhcmUudXBkYXRlUG9pbnRMaXN0V2l0aFRyYW5zZm9ybWF0aW9uKCk7XHJcbiAgICAgICAgdGhpcy51cGRhdGVTaGFwZSh0aGlzLnNxdWFyZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdXBkYXRlVmVydGV4KGlkeDogbnVtYmVyLCB4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xyXG5cclxuICAgICAgICAgICAgLy8gRmluZCB0aGUgaW5kaWNlcyBvZiB0aGUgYWRqYWNlbnQgdmVydGljZXNcclxuICAgICAgICAgICAgY29uc3QgbmV4dElkeCA9IChpZHggKyAxKSAlIDQ7XHJcbiAgICAgICAgICAgIGNvbnN0IHByZXZJZHggPSAoaWR4ICsgMykgJSA0O1xyXG4gICAgICAgICAgICBjb25zdCBvcHBvc2l0ZSA9IChpZHggKzIpICUgNDtcclxuICAgICAgICAgICAgdGhpcy5zcXVhcmUucmVjYWxjdWxhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWSA9IHRoaXMuc3F1YXJlLnBvaW50TGlzdFsxXS55IC0gdGhpcy5zcXVhcmUucG9pbnRMaXN0WzBdLnk7XHJcbiAgICAgICAgICAgIGNvbnN0IGRlbHRhWCA9IHRoaXMuc3F1YXJlLnBvaW50TGlzdFsxXS54IC0gdGhpcy5zcXVhcmUucG9pbnRMaXN0WzBdLng7XHJcbiAgICAgICAgICAgIHRoaXMuc3F1YXJlLmFuZ2xlSW5SYWRpYW5zID0gTWF0aC5hdGFuMihkZWx0YVksIGRlbHRhWCk7XHJcblxyXG5cclxuICAgICAgICAgICAgdGhpcy5zcXVhcmUudHJhbnNsYXRpb25bMF0gPSAtdGhpcy5zcXVhcmUuY2VudGVyLng7XHJcbiAgICAgICAgICAgIHRoaXMuc3F1YXJlLnRyYW5zbGF0aW9uWzFdID0gLXRoaXMuc3F1YXJlLmNlbnRlci55O1xyXG4gICAgICAgICAgICB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IC0gdGhpcy5zcXVhcmUuYW5nbGVJblJhZGlhbnM7XHJcbiAgICAgICAgICAgIHRoaXMuc3F1YXJlLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4O1xyXG4gICAgICAgICAgICB0aGlzLnNxdWFyZS51cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKTtcclxuXHJcbiAgICAgICAgICAgIC8vIC8vIENhbGN1bGF0ZSB0aGUgZGlmZmVyZW5jZSBpbiBwb3NpdGlvblxyXG4gICAgICAgICAgICAvLyBjb25zdCBkeCA9IHggLSB0aGlzLnNxdWFyZS5wb2ludExpc3RbaWR4XS54O1xyXG4gICAgICAgICAgICAvLyBjb25zdCBkeSA9IHkgLSB0aGlzLnNxdWFyZS5wb2ludExpc3RbaWR4XS55O1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyAvLyBVcGRhdGUgdGhlIHNlbGVjdGVkIHZlcnRleFxyXG4gICAgICAgICAgICAvLyB0aGlzLnNxdWFyZS5wb2ludExpc3RbaWR4XS54ICs9IGR4O1xyXG4gICAgICAgICAgICAvLyB0aGlzLnNxdWFyZS5wb2ludExpc3RbaWR4XS55ICs9IGR5O1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coaWR4KTtcclxuICAgICAgICAgICAgLy8gZm9yKGxldCBpPTA7IGk8NDtpKyspe1xyXG4gICAgICAgICAgICAvLyAgICAgaWYoaSAhPSBpZHggJiYgaSE9IG9wcG9zaXRlKXtcclxuICAgICAgICAgICAgLy8gICAgICAgICBpZiAodGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnggPT0gdGhpcy5zcXVhcmUucG9pbnRMaXN0W29wcG9zaXRlXS54ICYmIHRoaXMuc3F1YXJlLnBvaW50TGlzdFtpXS55ID09IHRoaXMuc3F1YXJlLnBvaW50TGlzdFtvcHBvc2l0ZV0ueSkge1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICBpZiAoTWF0aC5hYnMoZHgpID4gTWF0aC5hYnMoZHkpKSB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnNxdWFyZS5wb2ludExpc3RbaV0ueCArPSBkeDtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIHRoaXMuc3F1YXJlLnBvaW50TGlzdFtpXS55ICs9IGR5O1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYgKHRoaXMuc3F1YXJlLnBvaW50TGlzdFtpXS54ID09IHRoaXMuc3F1YXJlLnBvaW50TGlzdFtvcHBvc2l0ZV0ueCl7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICB0aGlzLnNxdWFyZS5wb2ludExpc3RbaV0ueSArPSBkeTtcclxuICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSBpZih0aGlzLnNxdWFyZS5wb2ludExpc3RbaV0ueSA9PSB0aGlzLnNxdWFyZS5wb2ludExpc3Rbb3Bwb3NpdGVdLnkpe1xyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgdGhpcy5zcXVhcmUucG9pbnRMaXN0W2ldLnggKz0gZHg7IFxyXG4gICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgLy8gdGhpcy5zcXVhcmUudHJhbnNsYXRpb25bMF0gPSAtdGhpcy5zcXVhcmUuY2VudGVyLng7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc3F1YXJlLnRyYW5zbGF0aW9uWzFdID0gLXRoaXMuc3F1YXJlLmNlbnRlci55O1xyXG4gICAgICAgICAgICAvLyB0aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucyA9IC10aGlzLnNxdWFyZS5hbmdsZUluUmFkaWFucztcclxuICAgICAgICAgICAgLy8gdGhpcy5zcXVhcmUuc2V0VHJhbnNmb3JtYXRpb25NYXRyaXg7XHJcbiAgICAgICAgICAgIC8vIHRoaXMuc3F1YXJlLnVwZGF0ZVBvaW50TGlzdFdpdGhUcmFuc2Zvcm1hdGlvbigpO1xyXG4gICAgICAgIFxyXG4gICAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSB0aGUgc3F1YXJlIHByb3BlcnRpZXMgdG8gcmVmbGVjdCB0aGUgY2hhbmdlc1xyXG4gICAgICAgICAgICB0aGlzLnNxdWFyZS5yZWNhbGN1bGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlKHRoaXMuc3F1YXJlKTtcclxuICAgICAgICBcclxuICAgIH1cclxuXHJcbiAgICBjdXN0b21WZXJ0ZXhUb29sYmFyKCk6IHZvaWQge31cclxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcclxuaW1wb3J0IENWUG9seWdvbiBmcm9tICcuLi8uLi9TaGFwZXMvQ1ZQb2x5Z29uJztcclxuaW1wb3J0IEZhblBvbHlnb24gZnJvbSAnLi4vLi4vU2hhcGVzL0ZhblBvbHlnb24nO1xyXG5pbXBvcnQgTGluZSBmcm9tICcuLi8uLi9TaGFwZXMvTGluZSc7XHJcbmltcG9ydCBSZWN0YW5nbGUgZnJvbSAnLi4vLi4vU2hhcGVzL1JlY3RhbmdsZSc7XHJcbmltcG9ydCBTcXVhcmUgZnJvbSAnLi4vLi4vU2hhcGVzL1NxdWFyZSc7XHJcbmltcG9ydCBDYW52YXNDb250cm9sbGVyIGZyb20gJy4uL01ha2VyL0NhbnZhc0NvbnRyb2xsZXInO1xyXG5pbXBvcnQgQ1ZQb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9DVlBvbHlnb25Ub29sYmFyQ29udHJvbGxlcic7XHJcbmltcG9ydCBGYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXIgZnJvbSAnLi9TaGFwZS9GYW5Qb2x5Z29uVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgTGluZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZVRvb2xiYXJDb250cm9sbGVyJztcclxuaW1wb3J0IFJlY3RhbmdsZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5pbXBvcnQgeyBTaGFwZVRvb2xiYXJDb250cm9sbGVyIH0gZnJvbSAnLi9TaGFwZS9TaGFwZVRvb2xiYXJDb250cm9sbGVyJztcclxuaW1wb3J0IFNxdWFyZVRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvU3F1YXJlVG9vbGJhckNvbnRyb2xsZXInO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVG9vbGJhckNvbnRyb2xsZXIge1xyXG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcclxuICAgIHByaXZhdGUgdG9vbGJhckNvbnRhaW5lcjogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICBwcml2YXRlIGl0ZW1QaWNrZXI6IEhUTUxTZWxlY3RFbGVtZW50O1xyXG4gICAgcHJpdmF0ZSBzZWxlY3RlZElkOiBzdHJpbmcgPSAnJztcclxuXHJcbiAgICBwcml2YXRlIHRvb2xiYXJDb250cm9sbGVyOiBTaGFwZVRvb2xiYXJDb250cm9sbGVyIHwgbnVsbCA9IG51bGw7XHJcbiAgICBwcml2YXRlIGNhbnZhc0NvbnRyb2xsZXI6IENhbnZhc0NvbnRyb2xsZXI7XHJcblxyXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMsIGNhbnZhc0NvbnRyb2xsZXI6IENhbnZhc0NvbnRyb2xsZXIpIHtcclxuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcclxuICAgICAgICB0aGlzLmFwcENhbnZhcy51cGRhdGVUb29sYmFyID0gdGhpcy51cGRhdGVTaGFwZUxpc3QuYmluZCh0aGlzKTtcclxuICAgICAgICB0aGlzLmNhbnZhc0NvbnRyb2xsZXIgPSBjYW52YXNDb250cm9sbGVyO1xyXG5cclxuICAgICAgICB0aGlzLnRvb2xiYXJDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcclxuICAgICAgICAgICAgJ3Rvb2xiYXItY29udGFpbmVyJ1xyXG4gICAgICAgICkgYXMgSFRNTERpdkVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHRoaXMuaXRlbVBpY2tlciA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFxyXG4gICAgICAgICAgICAndG9vbGJhci1pdGVtLXBpY2tlcidcclxuICAgICAgICApIGFzIEhUTUxTZWxlY3RFbGVtZW50O1xyXG5cclxuICAgICAgICB0aGlzLml0ZW1QaWNrZXIub25jaGFuZ2UgPSAoZSkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkSWQgPSB0aGlzLml0ZW1QaWNrZXIudmFsdWU7XHJcbiAgICAgICAgICAgIGNvbnN0IHNoYXBlID0gdGhpcy5hcHBDYW52YXMuc2hhcGVzW3RoaXMuaXRlbVBpY2tlci52YWx1ZV07XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJUb29sYmFyRWxtdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHNoYXBlIGluc3RhbmNlb2YgTGluZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBMaW5lVG9vbGJhckNvbnRyb2xsZXIoc2hhcGUgYXMgTGluZSwgYXBwQ2FudmFzKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSBpbnN0YW5jZW9mIFJlY3RhbmdsZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBSZWN0YW5nbGVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBSZWN0YW5nbGUsIGFwcENhbnZhcylcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSBpbnN0YW5jZW9mIFNxdWFyZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b29sYmFyQ29udHJvbGxlciA9IG5ldyBTcXVhcmVUb29sYmFyQ29udHJvbGxlcihzaGFwZSBhcyBTcXVhcmUsIGFwcENhbnZhcylcclxuICAgICAgICAgICAgfSBlbHNlIGlmIChzaGFwZSBpbnN0YW5jZW9mIEZhblBvbHlnb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRyb2xsZXIgPSBuZXcgRmFuUG9seWdvblRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIEZhblBvbHlnb24sIGFwcENhbnZhcywgdGhpcy5jYW52YXNDb250cm9sbGVyKVxyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHNoYXBlIGluc3RhbmNlb2YgQ1ZQb2x5Z29uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbmV3IENWUG9seWdvblRvb2xiYXJDb250cm9sbGVyKHNoYXBlIGFzIENWUG9seWdvbiwgYXBwQ2FudmFzLCB0aGlzLmNhbnZhc0NvbnRyb2xsZXIpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB0aGlzLnVwZGF0ZVNoYXBlTGlzdCgpO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZVNoYXBlTGlzdCgpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy5pdGVtUGlja2VyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVBpY2tlci5yZW1vdmVDaGlsZCh0aGlzLml0ZW1QaWNrZXIuZmlyc3RDaGlsZCk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3QgcGxhY2Vob2xkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcclxuICAgICAgICBwbGFjZWhvbGRlci50ZXh0ID0gJ0Nob29zZSBhbiBvYmplY3QnO1xyXG4gICAgICAgIHBsYWNlaG9sZGVyLnZhbHVlID0gJyc7XHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKHBsYWNlaG9sZGVyKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LnZhbHVlcyh0aGlzLmFwcENhbnZhcy5zaGFwZXMpLmZvckVhY2goKHNoYXBlKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNoaWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICAgICAgICAgIGNoaWxkLnRleHQgPSBzaGFwZS5pZDtcclxuICAgICAgICAgICAgY2hpbGQudmFsdWUgPSBzaGFwZS5pZDtcclxuICAgICAgICAgICAgdGhpcy5pdGVtUGlja2VyLmFwcGVuZENoaWxkKGNoaWxkKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5pdGVtUGlja2VyLnZhbHVlID0gdGhpcy5zZWxlY3RlZElkO1xyXG5cclxuICAgICAgICBpZiAoIU9iamVjdC5rZXlzKHRoaXMuYXBwQ2FudmFzLnNoYXBlcykuaW5jbHVkZXModGhpcy5zZWxlY3RlZElkKSkge1xyXG4gICAgICAgICAgICB0aGlzLnRvb2xiYXJDb250cm9sbGVyID0gbnVsbDtcclxuICAgICAgICAgICAgdGhpcy5jbGVhclRvb2xiYXJFbG10KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHByaXZhdGUgY2xlYXJUb29sYmFyRWxtdCgpIHtcclxuICAgICAgICB3aGlsZSAodGhpcy50b29sYmFyQ29udGFpbmVyLmZpcnN0Q2hpbGQpXHJcbiAgICAgICAgICAgIHRoaXMudG9vbGJhckNvbnRhaW5lci5yZW1vdmVDaGlsZCh0aGlzLnRvb2xiYXJDb250YWluZXIuZmlyc3RDaGlsZCk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi9CYXNlL0Jhc2VTaGFwZSc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IFZlcnRleCBmcm9tICcuLi9CYXNlL1ZlcnRleCc7XHJcbmltcG9ydCBHcmFoYW1TY2FuIGZyb20gJy4uL2NvbnZleEh1bGxVdGlscyc7XHJcbmltcG9ydCB7IGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ1ZQb2x5Z29uIGV4dGVuZHMgQmFzZVNoYXBlIHtcclxuICAgIHByaXZhdGUgb3JpZ2luOiBWZXJ0ZXg7XHJcbiAgICBsZW5MaXN0OiBudW1iZXJbXSA9IFtdO1xyXG4gICAgcHJpdmF0ZSBnczogR3JhaGFtU2NhbiA9IG5ldyBHcmFoYW1TY2FuKCk7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB2ZXJ0aWNlczogVmVydGV4W10pIHtcclxuICAgICAgICBzdXBlcig2LCBpZCwgY29sb3IpO1xyXG5cclxuICAgICAgICB0aGlzLm9yaWdpbiA9IHZlcnRpY2VzWzBdO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godmVydGljZXNbMF0sIHZlcnRpY2VzWzFdKTtcclxuICAgICAgICB0aGlzLmNlbnRlciA9IG5ldyBWZXJ0ZXgoXHJcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS54ICsgdmVydGljZXNbMF0ueCkgLyAyLFxyXG4gICAgICAgICAgICAodmVydGljZXNbMV0ueSArIHZlcnRpY2VzWzBdLnkpIC8gMixcclxuICAgICAgICAgICAgbmV3IENvbG9yKDAsIDAsIDApXHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgdmVydGljZXMuZm9yRWFjaCgodnR4LCBpZHgpID0+IHtcclxuICAgICAgICAgICAgaWYgKGlkeCA8IDIpIHJldHVybjtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJzaGFwZSBzZXRcIik7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkVmVydGV4KHZ0eCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkVmVydGV4KHZlcnRleDogVmVydGV4KSB7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2ZXJ0ZXgpO1xyXG4gICAgICAgIHRoaXMucmVjYWxjKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbW92ZVZlcnRleChpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50TGlzdC5sZW5ndGggPD0gMykge1xyXG4gICAgICAgICAgICBhbGVydChcIkNhbm5vdCByZW1vdmUgdmVydGV4IGFueSBmdXJ0aGVyXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5wb2ludExpc3RbMF07XHJcbiAgICAgICAgdGhpcy5yZWNhbGMoKTtcclxuICAgIH1cclxuXHJcbiAgICByZWNhbGMoKSB7XHJcbiAgICAgICAgdGhpcy5ncy5zZXRQb2ludHModGhpcy5wb2ludExpc3QpO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0ID0gdGhpcy5ncy5nZXRIdWxsKCk7XHJcbiAgICAgICAgdGhpcy5vcmlnaW4gPSB0aGlzLnBvaW50TGlzdFswXTtcclxuXHJcbiAgICAgICAgbGV0IGFuZ2xlcyA9IHRoaXMucG9pbnRMaXN0XHJcbiAgICAgICAgICAgIC5maWx0ZXIoKF8sIGlkeCkgPT4gaWR4ID4gMClcclxuICAgICAgICAgICAgLm1hcCgodnR4KSA9PiB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZ0eCxcclxuICAgICAgICAgICAgICAgICAgICBhbmdsZTogTWF0aC5hdGFuMihcclxuICAgICAgICAgICAgICAgICAgICAgICAgdnR4LnkgLSB0aGlzLm9yaWdpbi55LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2dHgueCAtIHRoaXMub3JpZ2luLnhcclxuICAgICAgICAgICAgICAgICAgICApLFxyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGFuZ2xlcy5zb3J0KChhLCBiKSA9PiBhLmFuZ2xlIC0gYi5hbmdsZSk7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QgPSBhbmdsZXMubWFwKChpdGVtKSA9PiBpdGVtLnZ0eCk7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QudW5zaGlmdCh0aGlzLm9yaWdpbik7XHJcblxyXG4gICAgICAgIHRoaXMuY2VudGVyLnggPVxyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5yZWR1Y2UoKHRvdGFsLCB2dHgpID0+IHRvdGFsICsgdnR4LngsIDApIC9cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMuY2VudGVyLnkgPVxyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdC5yZWR1Y2UoKHRvdGFsLCB2dHgpID0+IHRvdGFsICsgdnR4LnksIDApIC9cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMubGVuTGlzdCA9IHRoaXMucG9pbnRMaXN0Lm1hcCgodnR4KSA9PlxyXG4gICAgICAgICAgICBldWNsaWRlYW5EaXN0YW5jZVZ0eCh2dHgsIHRoaXMuY2VudGVyKVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuIiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tICcuLi9CYXNlL0Jhc2VTaGFwZSc7XHJcbmltcG9ydCBDb2xvciBmcm9tICcuLi9CYXNlL0NvbG9yJztcclxuaW1wb3J0IFZlcnRleCBmcm9tICcuLi9CYXNlL1ZlcnRleCc7XHJcbmltcG9ydCB7IGV1Y2xpZGVhbkRpc3RhbmNlVnR4IH0gZnJvbSAnLi4vdXRpbHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRmFuUG9seWdvbiBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICBwcml2YXRlIG9yaWdpbjogVmVydGV4O1xyXG4gICAgbGVuTGlzdDogbnVtYmVyW10gPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHZlcnRpY2VzOiBWZXJ0ZXhbXSkge1xyXG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvcik7XHJcblxyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdmVydGljZXNbMF07XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh2ZXJ0aWNlc1swXSwgdmVydGljZXNbMV0pO1xyXG4gICAgICAgIHRoaXMuY2VudGVyID0gbmV3IFZlcnRleChcclxuICAgICAgICAgICAgKHZlcnRpY2VzWzFdLnggKyB2ZXJ0aWNlc1swXS54KSAvIDIsXHJcbiAgICAgICAgICAgICh2ZXJ0aWNlc1sxXS55ICsgdmVydGljZXNbMF0ueSkgLyAyLFxyXG4gICAgICAgICAgICBuZXcgQ29sb3IoMCwgMCwgMClcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5mb3JFYWNoKCh2dHgsIGlkeCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaWR4IDwgMikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSA2O1xyXG4gICAgICAgICAgICB0aGlzLmFkZFZlcnRleCh2dHgpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZFZlcnRleCh2ZXJ0ZXg6IFZlcnRleCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godmVydGV4KTtcclxuICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSA2O1xyXG4gICAgICAgIHRoaXMucmVjYWxjKCk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHJlbW92ZVZlcnRleChpZHg6IG51bWJlcikge1xyXG4gICAgICAgIGlmICh0aGlzLnBvaW50TGlzdC5sZW5ndGggPD0gMikge1xyXG4gICAgICAgICAgICBhbGVydChcIkNhbm5vdCByZW1vdmUgdmVydGV4IGFueSBmdXJ0aGVyXCIpO1xyXG4gICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnNwbGljZShpZHgsIDEpO1xyXG4gICAgICAgIHRoaXMub3JpZ2luID0gdGhpcy5wb2ludExpc3RbMF07XHJcbiAgICAgICAgaWYgKHRoaXMucG9pbnRMaXN0Lmxlbmd0aCA9PSAyKVxyXG4gICAgICAgICAgICB0aGlzLmdsRHJhd1R5cGUgPSAxO1xyXG4gICAgICAgIHRoaXMucmVjYWxjKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVjYWxjKCkge1xyXG4gICAgICAgIGxldCBhbmdsZXMgPSB0aGlzLnBvaW50TGlzdFxyXG4gICAgICAgICAgICAuZmlsdGVyKChfLCBpZHgpID0+IGlkeCA+IDApXHJcbiAgICAgICAgICAgIC5tYXAoKHZ0eCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgICAgICB2dHgsXHJcbiAgICAgICAgICAgICAgICAgICAgYW5nbGU6IE1hdGguYXRhbjIoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZ0eC55IC0gdGhpcy5vcmlnaW4ueSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdnR4LnggLSB0aGlzLm9yaWdpbi54XHJcbiAgICAgICAgICAgICAgICAgICAgKSxcclxuICAgICAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICBhbmdsZXMuc29ydCgoYSwgYikgPT4gYS5hbmdsZSAtIGIuYW5nbGUpO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0ID0gYW5nbGVzLm1hcCgoaXRlbSkgPT4gaXRlbS52dHgpO1xyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnVuc2hpZnQodGhpcy5vcmlnaW4pO1xyXG5cclxuICAgICAgICB0aGlzLmNlbnRlci54ID1cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QucmVkdWNlKCh0b3RhbCwgdnR4KSA9PiB0b3RhbCArIHZ0eC54LCAwKSAvXHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0Lmxlbmd0aDtcclxuICAgICAgICB0aGlzLmNlbnRlci55ID1cclxuICAgICAgICAgICAgdGhpcy5wb2ludExpc3QucmVkdWNlKCh0b3RhbCwgdnR4KSA9PiB0b3RhbCArIHZ0eC55LCAwKSAvXHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0Lmxlbmd0aDtcclxuICAgICAgICB0aGlzLmxlbkxpc3QgPSB0aGlzLnBvaW50TGlzdC5tYXAoKHZ0eCkgPT5cclxuICAgICAgICAgICAgZXVjbGlkZWFuRGlzdGFuY2VWdHgodnR4LCB0aGlzLmNlbnRlcilcclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBCYXNlU2hhcGUgZnJvbSBcIi4uL0Jhc2UvQmFzZVNoYXBlXCI7XHJcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xyXG5pbXBvcnQgVmVydGV4IGZyb20gXCIuLi9CYXNlL1ZlcnRleFwiO1xyXG5pbXBvcnQgeyBldWNsaWRlYW5EaXN0YW5jZVZ0eCB9IGZyb20gXCIuLi91dGlsc1wiO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgZW5kWDogbnVtYmVyLCBlbmRZOiBudW1iZXIsIHJvdGF0aW9uID0gMCwgc2NhbGVYID0gMSwgc2NhbGVZID0gMSkge1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclggPSAoc3RhcnRYICsgZW5kWCkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlclkgPSAoc3RhcnRZICsgZW5kWSkgLyAyO1xyXG4gICAgICAgIGNvbnN0IGNlbnRlciA9IG5ldyBWZXJ0ZXgoY2VudGVyWCwgY2VudGVyWSwgY29sb3IpO1xyXG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvciwgY2VudGVyLCByb3RhdGlvbiwgc2NhbGVYLCBzY2FsZVkpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IG5ldyBWZXJ0ZXgoc3RhcnRYLCBzdGFydFksIGNvbG9yKTtcclxuICAgICAgICBjb25zdCBlbmQgPSBuZXcgVmVydGV4KGVuZFgsIGVuZFksIGNvbG9yKTtcclxuXHJcbiAgICAgICAgdGhpcy5sZW5ndGggPSBldWNsaWRlYW5EaXN0YW5jZVZ0eChcclxuICAgICAgICAgICAgb3JpZ2luLFxyXG4gICAgICAgICAgICBlbmRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKG9yaWdpbiwgZW5kKTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdCA9IHRoaXMucG9pbnRMaXN0O1xyXG4gICAgfVxyXG59IiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcclxuaW1wb3J0IENvbG9yIGZyb20gXCIuLi9CYXNlL0NvbG9yXCI7XHJcbmltcG9ydCBWZXJ0ZXggZnJvbSBcIi4uL0Jhc2UvVmVydGV4XCI7XHJcbmltcG9ydCB7IG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBCYXNlU2hhcGUge1xyXG4gICAgXHJcbiAgICBsZW5ndGg6IG51bWJlcjtcclxuICAgIHdpZHRoOiBudW1iZXI7XHJcbiAgICBpbml0aWFsUG9pbnQ6IG51bWJlcltdO1xyXG4gICAgZW5kUG9pbnQ6IG51bWJlcltdO1xyXG4gICAgdGFyZ2V0UG9pbnQ6IG51bWJlcltdO1xyXG5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHN0YXJ0WDogbnVtYmVyLCBzdGFydFk6IG51bWJlciwgZW5kWDogbnVtYmVyLCBlbmRZOiBudW1iZXIsIGFuZ2xlSW5SYWRpYW5zOiBudW1iZXIsIHNjYWxlWDogbnVtYmVyID0gMSwgc2NhbGVZOiBudW1iZXIgPSAxLCB0cmFuc2Zvcm1hdGlvbjogbnVtYmVyW10gPSBtMy5pZGVudGl0eSgpKSB7XHJcbiAgICAgICAgc3VwZXIoNSwgaWQsIGNvbG9yKTtcclxuICAgICAgICBcclxuICAgICAgICBjb25zdCB4MSA9IHN0YXJ0WDtcclxuICAgICAgICBjb25zdCB5MSA9IHN0YXJ0WTtcclxuICAgICAgICBjb25zdCB4MiA9IGVuZFg7XHJcbiAgICAgICAgY29uc3QgeTIgPSBzdGFydFk7XHJcbiAgICAgICAgY29uc3QgeDMgPSBzdGFydFg7XHJcbiAgICAgICAgY29uc3QgeTMgPSBlbmRZO1xyXG4gICAgICAgIGNvbnN0IHg0ID0gZW5kWDtcclxuICAgICAgICBjb25zdCB5NCA9IGVuZFk7XHJcblxyXG4gICAgICAgIHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXggPSB0cmFuc2Zvcm1hdGlvbjtcclxuXHJcbiAgICAgICAgdGhpcy5hbmdsZUluUmFkaWFucyA9IGFuZ2xlSW5SYWRpYW5zO1xyXG4gICAgICAgIHRoaXMuc2NhbGUgPSBbc2NhbGVYLCBzY2FsZVldO1xyXG4gICAgICAgIHRoaXMuaW5pdGlhbFBvaW50ID0gW3N0YXJ0WCwgc3RhcnRZLCAxXTtcclxuICAgICAgICB0aGlzLmVuZFBvaW50ID0gW2VuZFgsIGVuZFksIDFdO1xyXG4gICAgICAgIHRoaXMudGFyZ2V0UG9pbnQgPSBbMCwwLCAxXTtcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IHgyLXgxO1xyXG4gICAgICAgIHRoaXMud2lkdGggPSB5My15MTtcclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh4MSArIHg0KSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9ICh5MSArIHk0KSAvIDI7XHJcbiAgICAgICAgY29uc3QgY2VudGVyID0gbmV3IFZlcnRleChjZW50ZXJYLCBjZW50ZXJZLCBjb2xvcik7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBjZW50ZXI7XHJcblxyXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2gobmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKSwgbmV3IFZlcnRleCh4MiwgeTIsIGNvbG9yKSwgbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKSwgbmV3IFZlcnRleCh4NCwgeTQsIGNvbG9yKSk7XHJcbiAgICAgICAgdGhpcy5idWZmZXJUcmFuc2Zvcm1hdGlvbkxpc3QgPSB0aGlzLnBvaW50TGlzdDtcclxuICAgIH1cclxuXHJcbiAgICBvdmVycmlkZSBzZXRUcmFuc2Zvcm1hdGlvbk1hdHJpeCgpe1xyXG4gICAgICAgIHN1cGVyLnNldFRyYW5zZm9ybWF0aW9uTWF0cml4KCk7XHJcblxyXG4gICAgICAgIC8vIGNvbnN0IHBvaW50ID0gW3RoaXMucG9pbnRMaXN0W2lkeF0ueCwgdGhpcy5wb2ludExpc3RbaWR4XS55LCAxXTtcclxuICAgICAgICB0aGlzLmVuZFBvaW50ID0gbTMubXVsdGlwbHkzeDEodGhpcy50cmFuc2Zvcm1hdGlvbk1hdHJpeCwgdGhpcy5lbmRQb2ludClcclxuICAgICAgICB0aGlzLmluaXRpYWxQb2ludCA9IG0zLm11bHRpcGx5M3gxKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHRoaXMuaW5pdGlhbFBvaW50KVxyXG4gICAgXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHVwZGF0ZVBvaW50TGlzdFdpdGhUcmFuc2Zvcm1hdGlvbigpIHtcclxuICAgICAgICB0aGlzLnBvaW50TGlzdC5mb3JFYWNoKCh2ZXJ0ZXgsIGluZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHZlcnRleE1hdHJpeCA9IFt2ZXJ0ZXgueCwgdmVydGV4LnksIDFdO1xyXG4gICAgICAgICAgICBjb25zdCB0cmFuc2Zvcm1lZFZlcnRleCA9IG0zLm11bHRpcGx5M3gxKHRoaXMudHJhbnNmb3JtYXRpb25NYXRyaXgsIHZlcnRleE1hdHJpeCk7XHJcbiAgICAgICAgICAgIHRoaXMucG9pbnRMaXN0W2luZGV4XSA9IG5ldyBWZXJ0ZXgodHJhbnNmb3JtZWRWZXJ0ZXhbMF0sIHRyYW5zZm9ybWVkVmVydGV4WzFdLCB0aGlzLnBvaW50TGlzdFtpbmRleF0uYyk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucmVjYWxjdWxhdGUoKTtcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVjYWxjdWxhdGUoKSB7XHJcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gTWF0aC5zcXJ0KE1hdGgucG93KHRoaXMucG9pbnRMaXN0WzFdLnggLSB0aGlzLnBvaW50TGlzdFswXS54LCAyKSArIE1hdGgucG93KHRoaXMucG9pbnRMaXN0WzFdLnkgLSB0aGlzLnBvaW50TGlzdFswXS55LCAyKSk7XHJcbiAgICAgICAgY29uc3Qgd2lkdGggPSBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy5wb2ludExpc3RbM10ueCAtIHRoaXMucG9pbnRMaXN0WzFdLngsIDIpICsgTWF0aC5wb3codGhpcy5wb2ludExpc3RbM10ueSAtIHRoaXMucG9pbnRMaXN0WzFdLnksIDIpKTtcclxuXHJcbiAgICAgICAgY29uc3QgY2VudGVyWCA9ICh0aGlzLnBvaW50TGlzdFswXS54ICsgdGhpcy5wb2ludExpc3RbMV0ueCArIHRoaXMucG9pbnRMaXN0WzNdLnggKyB0aGlzLnBvaW50TGlzdFsyXS54KSAvIDQ7XHJcbiAgICAgICAgY29uc3QgY2VudGVyWSA9ICh0aGlzLnBvaW50TGlzdFswXS55ICsgdGhpcy5wb2ludExpc3RbMV0ueSArIHRoaXMucG9pbnRMaXN0WzNdLnkgKyB0aGlzLnBvaW50TGlzdFsyXS55KSAvIDQ7XHJcbiAgICBcclxuICAgICAgICB0aGlzLmxlbmd0aCA9IGxlbmd0aDtcclxuICAgICAgICB0aGlzLndpZHRoID0gd2lkdGg7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIHRoaXMuY29sb3IpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kT3Bwb3NpdGUocG9pbnRJZHg6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3Qgb3Bwb3NpdGU6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7IDA6IDMsIDE6IDIsIDI6IDEsIDM6IDAgfTtcclxuICAgICAgICByZXR1cm4gb3Bwb3NpdGVbcG9pbnRJZHhdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kQ0NXQWRqYWNlbnQocG9pbnRJZHg6IG51bWJlcil7XHJcbiAgICAgICAgY29uc3QgY2N3QWRqYWNlbnQ6IHsgW2tleTogbnVtYmVyXTogbnVtYmVyIH0gPSB7IDA6IDIsIDE6IDAsIDI6IDMsIDM6IDEgfTtcclxuICAgICAgICByZXR1cm4gY2N3QWRqYWNlbnRbcG9pbnRJZHhdO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBmaW5kQ1dBZGphY2VudChwb2ludElkeDogbnVtYmVyKXtcclxuICAgICAgICBjb25zdCBjd0FkamFjZW50OiB7IFtrZXk6IG51bWJlcl06IG51bWJlciB9ID0geyAwOiAxLCAxOiAzLCAyOiAwLCAzOiAyIH07XHJcbiAgICAgICAgcmV0dXJuIGN3QWRqYWNlbnRbcG9pbnRJZHhdO1xyXG4gICAgfVxyXG5cclxufVxyXG4iLCJpbXBvcnQgQmFzZVNoYXBlIGZyb20gXCIuLi9CYXNlL0Jhc2VTaGFwZVwiO1xyXG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uL0Jhc2UvQ29sb3JcIjtcclxuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcclxuaW1wb3J0IHsgZXVjbGlkZWFuRGlzdGFuY2VWdHgsIG0zIH0gZnJvbSBcIi4uL3V0aWxzXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTcXVhcmUgZXh0ZW5kcyBCYXNlU2hhcGUge1xyXG4gICAgc2l6ZTogbnVtYmVyO1xyXG4gICAgdjEgOiBWZXJ0ZXg7XHJcbiAgICB2MiA6IFZlcnRleDtcclxuICAgIHYzIDogVmVydGV4O1xyXG4gICAgdjQgOiBWZXJ0ZXg7XHJcblxyXG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCB4MTogbnVtYmVyLCB5MTogbnVtYmVyLCB4MjogbnVtYmVyLCB5MjogbnVtYmVyLCB4MzogbnVtYmVyLCB5MzogbnVtYmVyLCB4NDogbnVtYmVyLCB5NDogbnVtYmVyLCByb3RhdGlvbiA9IDAsIHNjYWxlWCA9IDEsIHNjYWxlWSA9IDEpIHtcclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gKHgxICsgeDMpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHkxICsgeTMpIC8gMjtcclxuICAgICAgICBjb25zdCBjZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIGNvbG9yKTtcclxuICAgICAgICBcclxuICAgICAgICBzdXBlcig2LCBpZCwgY29sb3IsIGNlbnRlciwgcm90YXRpb24sIHNjYWxlWCwgc2NhbGVZKTtcclxuICAgICAgICBcclxuICAgICAgICB0aGlzLnYxID0gbmV3IFZlcnRleCh4MSwgeTEsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnYyID0gbmV3IFZlcnRleCh4MiwgeTIsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnYzID0gbmV3IFZlcnRleCh4MywgeTMsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnY0ID0gbmV3IFZlcnRleCh4NCwgeTQsIGNvbG9yKTtcclxuICAgICAgICB0aGlzLnNpemUgPSBldWNsaWRlYW5EaXN0YW5jZVZ0eCh0aGlzLnYxLCB0aGlzLnYzKTtcclxuXHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QucHVzaCh0aGlzLnYxLCB0aGlzLnYyLCB0aGlzLnYzLCB0aGlzLnY0KTtcclxuICAgICAgICB0aGlzLmJ1ZmZlclRyYW5zZm9ybWF0aW9uTGlzdCA9IHRoaXMucG9pbnRMaXN0O1xyXG5cclxuICAgICAgICBjb25zdCBkZWx0YVkgPSB0aGlzLnBvaW50TGlzdFsxXS55IC0gdGhpcy5wb2ludExpc3RbMF0ueTtcclxuICAgICAgICBjb25zdCBkZWx0YVggPSB0aGlzLnBvaW50TGlzdFsxXS54IC0gdGhpcy5wb2ludExpc3RbMF0ueDtcclxuICAgICAgICB0aGlzLmFuZ2xlSW5SYWRpYW5zID0gTWF0aC5hdGFuMihkZWx0YVksIGRlbHRhWCk7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyB1cGRhdGVQb2ludExpc3RXaXRoVHJhbnNmb3JtYXRpb24oKSB7XHJcbiAgICAgICAgdGhpcy5wb2ludExpc3QuZm9yRWFjaCgodmVydGV4LCBpbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB2ZXJ0ZXhNYXRyaXggPSBbdmVydGV4LngsIHZlcnRleC55LCAxXTtcclxuICAgICAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRWZXJ0ZXggPSBtMy5tdWx0aXBseTN4MSh0aGlzLnRyYW5zZm9ybWF0aW9uTWF0cml4LCB2ZXJ0ZXhNYXRyaXgpO1xyXG4gICAgICAgICAgICB0aGlzLnBvaW50TGlzdFtpbmRleF0gPSBuZXcgVmVydGV4KHRyYW5zZm9ybWVkVmVydGV4WzBdLCB0cmFuc2Zvcm1lZFZlcnRleFsxXSwgdGhpcy5wb2ludExpc3RbaW5kZXhdLmMpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnJlY2FsY3VsYXRlKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlY2FsY3VsYXRlKCkge1xyXG4gICAgICAgIGNvbnN0IGxlbmd0aCA9IE1hdGguc3FydChNYXRoLnBvdyh0aGlzLnBvaW50TGlzdFsxXS54IC0gdGhpcy5wb2ludExpc3RbMF0ueCwgMikgKyBNYXRoLnBvdyh0aGlzLnBvaW50TGlzdFsxXS55IC0gdGhpcy5wb2ludExpc3RbMF0ueSwgMikpO1xyXG4gICAgICAgIGNvbnN0IHNpemUgPSBNYXRoLnNxcnQoTWF0aC5wb3codGhpcy5wb2ludExpc3RbM10ueCAtIHRoaXMucG9pbnRMaXN0WzFdLngsIDIpICsgTWF0aC5wb3codGhpcy5wb2ludExpc3RbM10ueSAtIHRoaXMucG9pbnRMaXN0WzFdLnksIDIpKTtcclxuICAgICAgICBjb25zdCBjZW50ZXJYID0gKHRoaXMucG9pbnRMaXN0WzBdLnggKyB0aGlzLnBvaW50TGlzdFsxXS54ICsgdGhpcy5wb2ludExpc3RbM10ueCArIHRoaXMucG9pbnRMaXN0WzJdLngpIC8gNDtcclxuICAgICAgICBjb25zdCBjZW50ZXJZID0gKHRoaXMucG9pbnRMaXN0WzBdLnkgKyB0aGlzLnBvaW50TGlzdFsxXS55ICsgdGhpcy5wb2ludExpc3RbM10ueSArIHRoaXMucG9pbnRMaXN0WzJdLnkpIC8gNDtcclxuXHJcbiAgICAgICAgY29uc3QgZGVsdGFZID0gdGhpcy5wb2ludExpc3RbMV0ueSAtIHRoaXMucG9pbnRMaXN0WzBdLnk7XHJcbiAgICAgICAgY29uc3QgZGVsdGFYID0gdGhpcy5wb2ludExpc3RbMV0ueCAtIHRoaXMucG9pbnRMaXN0WzBdLng7XHJcbiAgICAgICAgdGhpcy5hbmdsZUluUmFkaWFucyA9IE1hdGguYXRhbjIoZGVsdGFZLCBkZWx0YVgpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIHRoaXMuc2l6ZSA9IHNpemU7XHJcbiAgICAgICAgdGhpcy5jZW50ZXIgPSBuZXcgVmVydGV4KGNlbnRlclgsIGNlbnRlclksIHRoaXMuY29sb3IpO1xyXG4gICAgfVxyXG59XHJcbiIsImltcG9ydCBWZXJ0ZXggZnJvbSBcIi4vQmFzZS9WZXJ0ZXhcIjtcclxuXHJcbmNvbnN0IFJFTU9WRUQgPSAtMTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEdyYWhhbVNjYW4ge1xyXG4gICAgcHJpdmF0ZSBwb2ludHM6IFZlcnRleFtdID0gW107XHJcblxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSBbXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRQb2ludHMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucG9pbnRzO1xyXG4gICAgfVxyXG5cclxuICAgIHNldFBvaW50cyhwb2ludHM6IFZlcnRleFtdKSB7XHJcbiAgICAgICAgdGhpcy5wb2ludHMgPSBwb2ludHMuc2xpY2UoKTsgXHJcbiAgICB9XHJcblxyXG4gICAgYWRkUG9pbnQocG9pbnQ6IFZlcnRleCkge1xyXG4gICAgICAgIHRoaXMucG9pbnRzLnB1c2gocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEh1bGwoKSB7XHJcbiAgICAgICAgY29uc3QgcGl2b3QgPSB0aGlzLnByZXBhcmVQaXZvdFBvaW50KCk7XHJcblxyXG4gICAgICAgIGxldCBpbmRleGVzID0gQXJyYXkuZnJvbSh0aGlzLnBvaW50cywgKHBvaW50LCBpKSA9PiBpKTtcclxuICAgICAgICBjb25zdCBhbmdsZXMgPSBBcnJheS5mcm9tKHRoaXMucG9pbnRzLCAocG9pbnQpID0+IHRoaXMuZ2V0QW5nbGUocGl2b3QsIHBvaW50KSk7XHJcbiAgICAgICAgY29uc3QgZGlzdGFuY2VzID0gQXJyYXkuZnJvbSh0aGlzLnBvaW50cywgKHBvaW50KSA9PiB0aGlzLmV1Y2xpZGVhbkRpc3RhbmNlU3F1YXJlZChwaXZvdCwgcG9pbnQpKTtcclxuXHJcbiAgICAgICAgaW5kZXhlcy5zb3J0KChpLCBqKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGFuZ2xlQSA9IGFuZ2xlc1tpXTtcclxuICAgICAgICAgICAgY29uc3QgYW5nbGVCID0gYW5nbGVzW2pdO1xyXG4gICAgICAgICAgICBpZiAoYW5nbGVBID09PSBhbmdsZUIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlQSA9IGRpc3RhbmNlc1tpXTtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlQiA9IGRpc3RhbmNlc1tqXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBkaXN0YW5jZUEgLSBkaXN0YW5jZUI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFuZ2xlQSAtIGFuZ2xlQjtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBpbmRleGVzLmxlbmd0aCAtIDE7IGkrKykge1xyXG4gICAgICAgICAgICBpZiAoYW5nbGVzW2luZGV4ZXNbaV1dID09PSBhbmdsZXNbaW5kZXhlc1tpICsgMV1dKSB7IFxyXG4gICAgICAgICAgICAgICAgaW5kZXhlc1tpXSA9IFJFTU9WRUQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGh1bGwgPSBbXTtcclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluZGV4ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgaW5kZXggPSBpbmRleGVzW2ldO1xyXG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IHRoaXMucG9pbnRzW2luZGV4XTtcclxuXHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gUkVNT1ZFRCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGh1bGwubGVuZ3RoIDwgMykge1xyXG4gICAgICAgICAgICAgICAgICAgIGh1bGwucHVzaChwb2ludCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoZWNrT3JpZW50YXRpb24oaHVsbFtodWxsLmxlbmd0aCAtIDJdLCBodWxsW2h1bGwubGVuZ3RoIC0gMV0sIHBvaW50KSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaHVsbC5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaHVsbC5wdXNoKHBvaW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIGh1bGwubGVuZ3RoIDwgMyA/IFtdIDogaHVsbDtcclxuICAgIH1cclxuXHJcbiAgICBjaGVja09yaWVudGF0aW9uKHAxOiBWZXJ0ZXgsIHAyOiBWZXJ0ZXgsIHAzOiBWZXJ0ZXgpIHtcclxuICAgICAgICByZXR1cm4gKHAyLnkgLSBwMS55KSAqIChwMy54IC0gcDIueCkgLSAocDMueSAtIHAyLnkpICogKHAyLnggLSBwMS54KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBbmdsZShhOiBWZXJ0ZXgsIGI6IFZlcnRleCkge1xyXG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKGIueSAtIGEueSwgYi54IC0gYS54KTtcclxuICAgIH1cclxuXHJcbiAgICBldWNsaWRlYW5EaXN0YW5jZVNxdWFyZWQocDE6IFZlcnRleCwgcDI6IFZlcnRleCkge1xyXG4gICAgICAgIGNvbnN0IGEgPSBwMi54IC0gcDEueDtcclxuICAgICAgICBjb25zdCBiID0gcDIueSAtIHAxLnk7XHJcbiAgICAgICAgcmV0dXJuIGEgKiBhICsgYiAqIGI7XHJcbiAgICB9XHJcblxyXG4gICAgcHJlcGFyZVBpdm90UG9pbnQoKSB7XHJcbiAgICAgICAgbGV0IHBpdm90ID0gdGhpcy5wb2ludHNbMF07XHJcbiAgICAgICAgbGV0IHBpdm90SW5kZXggPSAwO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAxOyBpIDwgdGhpcy5wb2ludHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgY29uc3QgcG9pbnQgPSB0aGlzLnBvaW50c1tpXTtcclxuICAgICAgICAgICAgaWYgKHBvaW50LnkgPCBwaXZvdC55IHx8IHBvaW50LnkgPT09IHBpdm90LnkgJiYgcG9pbnQueCA8IHBpdm90LngpIHtcclxuICAgICAgICAgICAgICAgIHBpdm90ID0gcG9pbnQ7XHJcbiAgICAgICAgICAgICAgICBwaXZvdEluZGV4ID0gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gcGl2b3Q7XHJcbiAgICB9XHJcbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4vQXBwQ2FudmFzJztcclxuaW1wb3J0IENhbnZhc0NvbnRyb2xsZXIgZnJvbSAnLi9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyJztcclxuaW1wb3J0IFRvb2xiYXJDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcnMvVG9vbGJhci9Ub29sYmFyQ29udHJvbGxlcic7XHJcbmltcG9ydCBpbml0IGZyb20gJy4vaW5pdCc7XHJcblxyXG5jb25zdCBtYWluID0gKCkgPT4ge1xyXG4gICAgY29uc3QgaW5pdFJldCA9IGluaXQoKTtcclxuICAgIGlmICghaW5pdFJldCkge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIFdlYkdMJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHsgZ2wsIHByb2dyYW0sIGNvbG9yQnVmZmVyLCBwb3NpdGlvbkJ1ZmZlciB9ID0gaW5pdFJldDtcclxuXHJcbiAgICBjb25zdCBhcHBDYW52YXMgPSBuZXcgQXBwQ2FudmFzKGdsLCBwcm9ncmFtLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xyXG4gICAgXHJcbiAgICBjb25zdCBjYW52YXNDb250cm9sbGVyID0gbmV3IENhbnZhc0NvbnRyb2xsZXIoYXBwQ2FudmFzKTtcclxuICAgIGNhbnZhc0NvbnRyb2xsZXIuc3RhcnQoKTtcclxuICAgIFxyXG4gICAgbmV3IFRvb2xiYXJDb250cm9sbGVyKGFwcENhbnZhcywgY2FudmFzQ29udHJvbGxlcik7XHJcblxyXG4gICAgLy8gY29uc3QgcmVkID0gbmV3IENvbG9yKDI1NSwgMCwgMjAwKVxyXG4gICAgLy8gLy8gY29uc3QgdHJpYW5nbGUgPSBuZXcgVHJpYW5nbGUoJ3RyaS0xJywgcmVkLCA1MCwgNTAsIDIwLCA1MDAsIDIwMCwgMTAwKTtcclxuICAgIC8vIC8vIGFwcENhbnZhcy5hZGRTaGFwZSh0cmlhbmdsZSk7XHJcbiAgICBcclxuICAgIC8vIGNvbnN0IHJlY3QgPSBuZXcgUmVjdGFuZ2xlKCdyZWN0LTEnLCByZWQsIDAsMCwxMCwyMCwwLDEsMSk7XHJcbiAgICAvLyByZWN0LmFuZ2xlSW5SYWRpYW5zID0gLSBNYXRoLlBJIC8gNDtcclxuICAgIC8vIC8vIHJlY3QudGFyZ2V0UG9pbnRbMF0gPSA1ICogTWF0aC5zcXJ0KDIpO1xyXG4gICAgLy8gLy8gcmVjdC5zY2FsZVggPSAxMDtcclxuICAgIC8vIC8vIHJlY3QudHJhbnNsYXRpb25bMF0gPSA1MDA7XHJcbiAgICAvLyAvLyByZWN0LnRyYW5zbGF0aW9uWzFdID0gMTAwMDtcclxuICAgIC8vIC8vIHJlY3Quc2V0VHJhbnNmb3JtYXRpb25NYXRyaXgoKTtcclxuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShyZWN0KTtcclxuXHJcbiAgICAvLyBjb25zdCBsaW5lID0gbmV3IExpbmUoJ2xpbmUtMScsIHJlZCwgMTAwLCAxMDAsIDEwMCwgMzAwKTtcclxuICAgIC8vIGNvbnN0IGxpbmUyID0gbmV3IExpbmUoJ2xpbmUtMicsIHJlZCwgMTAwLCAxMDAsIDMwMCwgMTAwKTtcclxuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShsaW5lKTtcclxuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZShsaW5lMik7XHJcbn07XHJcblxyXG5tYWluKCk7XHJcbiIsImNvbnN0IGNyZWF0ZVNoYWRlciA9IChcclxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXHJcbiAgICB0eXBlOiBudW1iZXIsXHJcbiAgICBzb3VyY2U6IHN0cmluZ1xyXG4pID0+IHtcclxuICAgIGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcclxuICAgIGlmIChzaGFkZXIpIHtcclxuICAgICAgICBnbC5zaGFkZXJTb3VyY2Uoc2hhZGVyLCBzb3VyY2UpO1xyXG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcclxuICAgICAgICBjb25zdCBzdWNjZXNzID0gZ2wuZ2V0U2hhZGVyUGFyYW1ldGVyKHNoYWRlciwgZ2wuQ09NUElMRV9TVEFUVVMpO1xyXG4gICAgICAgIGlmIChzdWNjZXNzKSByZXR1cm4gc2hhZGVyO1xyXG5cclxuICAgICAgICBjb25zb2xlLmVycm9yKGdsLmdldFNoYWRlckluZm9Mb2coc2hhZGVyKSk7XHJcbiAgICAgICAgZ2wuZGVsZXRlU2hhZGVyKHNoYWRlcik7XHJcbiAgICB9XHJcbn07XHJcblxyXG5jb25zdCBjcmVhdGVQcm9ncmFtID0gKFxyXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcclxuICAgIHZ0eFNoZDogV2ViR0xTaGFkZXIsXHJcbiAgICBmcmdTaGQ6IFdlYkdMU2hhZGVyXHJcbikgPT4ge1xyXG4gICAgY29uc3QgcHJvZ3JhbSA9IGdsLmNyZWF0ZVByb2dyYW0oKTtcclxuICAgIGlmIChwcm9ncmFtKSB7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIHZ0eFNoZCk7XHJcbiAgICAgICAgZ2wuYXR0YWNoU2hhZGVyKHByb2dyYW0sIGZyZ1NoZCk7XHJcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XHJcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFByb2dyYW1QYXJhbWV0ZXIocHJvZ3JhbSwgZ2wuTElOS19TVEFUVVMpO1xyXG4gICAgICAgIGlmIChzdWNjZXNzKSByZXR1cm4gcHJvZ3JhbTtcclxuXHJcbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRQcm9ncmFtSW5mb0xvZyhwcm9ncmFtKSk7XHJcbiAgICAgICAgZ2wuZGVsZXRlUHJvZ3JhbShwcm9ncmFtKTtcclxuICAgIH1cclxufTtcclxuXHJcbmNvbnN0IGluaXQgPSAoKSA9PiB7XHJcbiAgICBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYycpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xyXG4gICAgY29uc3QgZ2wgPSBjYW52YXMuZ2V0Q29udGV4dCgnd2ViZ2wnKTtcclxuXHJcbiAgICBpZiAoIWdsKSB7XHJcbiAgICAgICAgYWxlcnQoJ1lvdXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IHdlYkdMJyk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIEluaXRpYWxpemUgc2hhZGVycyBhbmQgcHJvZ3JhbXNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIGNvbnN0IHZ0eFNoYWRlclNvdXJjZSA9IChcclxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndmVydGV4LXNoYWRlci0yZCcpIGFzIEhUTUxTY3JpcHRFbGVtZW50XHJcbiAgICApLnRleHQ7XHJcbiAgICBjb25zdCBmcmFnU2hhZGVyU291cmNlID0gKFxyXG4gICAgICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdmcmFnbWVudC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxyXG4gICAgKS50ZXh0O1xyXG5cclxuICAgIGNvbnN0IHZlcnRleFNoYWRlciA9IGNyZWF0ZVNoYWRlcihnbCwgZ2wuVkVSVEVYX1NIQURFUiwgdnR4U2hhZGVyU291cmNlKTtcclxuICAgIGNvbnN0IGZyYWdtZW50U2hhZGVyID0gY3JlYXRlU2hhZGVyKFxyXG4gICAgICAgIGdsLFxyXG4gICAgICAgIGdsLkZSQUdNRU5UX1NIQURFUixcclxuICAgICAgICBmcmFnU2hhZGVyU291cmNlXHJcbiAgICApO1xyXG4gICAgaWYgKCF2ZXJ0ZXhTaGFkZXIgfHwgIWZyYWdtZW50U2hhZGVyKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZlcnRleFNoYWRlciwgZnJhZ21lbnRTaGFkZXIpO1xyXG4gICAgaWYgKCFwcm9ncmFtKSByZXR1cm47XHJcblxyXG4gICAgY29uc3QgZHByID0gd2luZG93LmRldmljZVBpeGVsUmF0aW87XHJcbiAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBjYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICBjb25zdCBkaXNwbGF5V2lkdGggID0gTWF0aC5yb3VuZCh3aWR0aCAqIGRwcik7XHJcbiAgICBjb25zdCBkaXNwbGF5SGVpZ2h0ID0gTWF0aC5yb3VuZChoZWlnaHQgKiBkcHIpO1xyXG5cclxuICAgIGNvbnN0IG5lZWRSZXNpemUgPVxyXG4gICAgICAgIGdsLmNhbnZhcy53aWR0aCAhPSBkaXNwbGF5V2lkdGggfHwgZ2wuY2FudmFzLmhlaWdodCAhPSBkaXNwbGF5SGVpZ2h0O1xyXG5cclxuICAgIGlmIChuZWVkUmVzaXplKSB7XHJcbiAgICAgICAgZ2wuY2FudmFzLndpZHRoID0gZGlzcGxheVdpZHRoO1xyXG4gICAgICAgIGdsLmNhbnZhcy5oZWlnaHQgPSBkaXNwbGF5SGVpZ2h0O1xyXG4gICAgfVxyXG5cclxuICAgIGdsLnZpZXdwb3J0KDAsIDAsIGdsLmNhbnZhcy53aWR0aCwgZ2wuY2FudmFzLmhlaWdodCk7XHJcbiAgICBnbC5jbGVhckNvbG9yKDAsIDAsIDAsIDApO1xyXG4gICAgZ2wuY2xlYXIoZ2wuQ09MT1JfQlVGRkVSX0JJVCk7XHJcbiAgICBnbC51c2VQcm9ncmFtKHByb2dyYW0pO1xyXG5cclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIEVuYWJsZSAmIGluaXRpYWxpemUgdW5pZm9ybXMgYW5kIGF0dHJpYnV0ZXNcclxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cclxuICAgIC8vIFJlc29sdXRpb25cclxuICAgIGNvbnN0IG1hdHJpeFVuaWZvcm1Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihcclxuICAgICAgICBwcm9ncmFtLFxyXG4gICAgICAgICd1X3RyYW5zZm9ybWF0aW9uJ1xyXG4gICAgKTtcclxuICAgIGdsLnVuaWZvcm1NYXRyaXgzZnYobWF0cml4VW5pZm9ybUxvY2F0aW9uLCBmYWxzZSwgWzEsMCwwLDAsMSwwLDAsMCwxXSlcclxuXHJcbiAgICBjb25zdCByZXNvbHV0aW9uVW5pZm9ybUxvY2F0aW9uID0gZ2wuZ2V0VW5pZm9ybUxvY2F0aW9uKFxyXG4gICAgICAgIHByb2dyYW0sXHJcbiAgICAgICAgJ3VfcmVzb2x1dGlvbidcclxuICAgICk7XHJcbiAgICBnbC51bmlmb3JtMmYocmVzb2x1dGlvblVuaWZvcm1Mb2NhdGlvbiwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTtcclxuXHJcbiAgICAvLyBDb2xvclxyXG4gICAgY29uc3QgY29sb3JCdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgIGlmICghY29sb3JCdWZmZXIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIGNvbG9yIGJ1ZmZlcicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgY29sb3JCdWZmZXIpO1xyXG4gICAgY29uc3QgY29sb3JBdHRyaWJ1dGVMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sICdhX2NvbG9yJyk7XHJcbiAgICBnbC5lbmFibGVWZXJ0ZXhBdHRyaWJBcnJheShjb2xvckF0dHJpYnV0ZUxvY2F0aW9uKTtcclxuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIoY29sb3JBdHRyaWJ1dGVMb2NhdGlvbiwgMywgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcclxuXHJcbiAgICAvLyBQb3NpdGlvblxyXG4gICAgY29uc3QgcG9zaXRpb25CdWZmZXIgPSBnbC5jcmVhdGVCdWZmZXIoKTtcclxuICAgIGlmICghcG9zaXRpb25CdWZmZXIpIHtcclxuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gY3JlYXRlIHBvc2l0aW9uIGJ1ZmZlcicpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgY29uc3QgcG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKFxyXG4gICAgICAgIHByb2dyYW0sXHJcbiAgICAgICAgJ2FfcG9zaXRpb24nXHJcbiAgICApO1xyXG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkocG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbik7XHJcbiAgICBnbC52ZXJ0ZXhBdHRyaWJQb2ludGVyKHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24sIDIsIGdsLkZMT0FULCBmYWxzZSwgMCwgMCk7XHJcblxyXG4gICAgLy8gRG8gbm90IHJlbW92ZSBjb21tZW50cywgdXNlZCBmb3Igc2FuaXR5IGNoZWNrXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcbiAgICAvLyBTZXQgdGhlIHZhbHVlcyBvZiB0aGUgYnVmZmVyXHJcbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09XHJcblxyXG4gICAgLy8gY29uc3QgY29sb3JzID0gWzEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjBdO1xyXG4gICAgLy8gZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcclxuICAgIC8vIGdsLmJ1ZmZlckRhdGEoZ2wuQVJSQVlfQlVGRkVSLCBuZXcgRmxvYXQzMkFycmF5KGNvbG9ycyksIGdsLlNUQVRJQ19EUkFXKTtcclxuXHJcbiAgICAvLyBjb25zdCBwb3NpdGlvbnMgPSBbMTAwLCA1MCwgMjAsIDEwLCA1MDAsIDUwMF07XHJcbiAgICAvLyBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xyXG4gICAgLy8gZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKSwgZ2wuU1RBVElDX0RSQVcpO1xyXG5cclxuICAgIC8vID09PT1cclxuICAgIC8vIERyYXdcclxuICAgIC8vID09PT1cclxuICAgIC8vIGdsLmRyYXdBcnJheXMoZ2wuVFJJQU5HTEVTLCAwLCAzKTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIHBvc2l0aW9uQnVmZmVyLFxyXG4gICAgICAgIHByb2dyYW0sXHJcbiAgICAgICAgY29sb3JCdWZmZXIsXHJcbiAgICAgICAgZ2wsXHJcbiAgICB9O1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgaW5pdDtcclxuIiwiaW1wb3J0IFZlcnRleCBmcm9tICcuL0Jhc2UvVmVydGV4JztcclxuXHJcbmV4cG9ydCBjb25zdCBldWNsaWRlYW5EaXN0YW5jZVZ0eCA9IChhOiBWZXJ0ZXgsIGI6IFZlcnRleCk6IG51bWJlciA9PiB7XHJcbiAgICBjb25zdCBkeCA9IGEueCAtIGIueDtcclxuICAgIGNvbnN0IGR5ID0gYS55IC0gYi55O1xyXG5cclxuICAgIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG59O1xyXG5cclxuZXhwb3J0IGNvbnN0IGV1Y2xpZGVhbkRpc3RhbmNlID0gKGF4OiBudW1iZXIsIGF5OiBudW1iZXIsIGJ4OiBudW1iZXIsIGJ5OiBudW1iZXIpOiBudW1iZXIgPT4ge1xyXG4gIGNvbnN0IGR4ID0gYXggLSBieDtcclxuICBjb25zdCBkeSA9IGF5IC0gYnk7XHJcblxyXG4gIHJldHVybiBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xyXG59O1xyXG5cclxuLy8gMzYwIERFR1xyXG5leHBvcnQgY29uc3QgZ2V0QW5nbGUgPSAob3JpZ2luOiBWZXJ0ZXgsIHRhcmdldDogVmVydGV4KSA9PiB7XHJcbiAgICBjb25zdCBwbHVzTWludXNEZWcgPSByYWRUb0RlZyhNYXRoLmF0YW4yKG9yaWdpbi55IC0gdGFyZ2V0LnksIG9yaWdpbi54IC0gdGFyZ2V0LngpKTtcclxuICAgIHJldHVybiBwbHVzTWludXNEZWcgPj0gMCA/IDE4MCAtIHBsdXNNaW51c0RlZyA6IE1hdGguYWJzKHBsdXNNaW51c0RlZykgKyAxODA7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCByYWRUb0RlZyA9IChyYWQ6IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIHJhZCAqIDE4MCAvIE1hdGguUEk7XHJcbn1cclxuXHJcbmV4cG9ydCBjb25zdCBkZWdUb1JhZCA9IChkZWc6IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIGRlZyAqIE1hdGguUEkgLyAxODA7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBoZXhUb1JnYihoZXg6IHN0cmluZykge1xyXG4gIHZhciByZXN1bHQgPSAvXiM/KFthLWZcXGRdezJ9KShbYS1mXFxkXXsyfSkoW2EtZlxcZF17Mn0pJC9pLmV4ZWMoaGV4KTtcclxuICByZXR1cm4gcmVzdWx0ID8ge1xyXG4gICAgcjogcGFyc2VJbnQocmVzdWx0WzFdLCAxNiksXHJcbiAgICBnOiBwYXJzZUludChyZXN1bHRbMl0sIDE2KSxcclxuICAgIGI6IHBhcnNlSW50KHJlc3VsdFszXSwgMTYpXHJcbiAgfSA6IG51bGw7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiByZ2JUb0hleChyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XHJcbiAgcmV0dXJuIFwiI1wiICsgKDEgPDwgMjQgfCByIDw8IDE2IHwgZyA8PCA4IHwgYikudG9TdHJpbmcoMTYpLnNsaWNlKDEpO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgbTMgPSB7XHJcbiAgICBpZGVudGl0eTogZnVuY3Rpb24oKSA6IG51bWJlcltdIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgMCwgMCwgMSxcclxuICAgICAgXTtcclxuICAgIH0sXHJcbiAgXHJcbiAgICB0cmFuc2xhdGlvbjogZnVuY3Rpb24odHggOiBudW1iZXIsIHR5IDogbnVtYmVyKSA6IG51bWJlcltdIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICAxLCAwLCAwLFxyXG4gICAgICAgIDAsIDEsIDAsXHJcbiAgICAgICAgdHgsIHR5LCAxLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICBcclxuICAgIHJvdGF0aW9uOiBmdW5jdGlvbihhbmdsZUluUmFkaWFucyA6IG51bWJlcikgOiBudW1iZXJbXSB7XHJcbiAgICAgIGNvbnN0IGMgPSBNYXRoLmNvcyhhbmdsZUluUmFkaWFucyk7XHJcbiAgICAgIGNvbnN0IHMgPSBNYXRoLnNpbihhbmdsZUluUmFkaWFucyk7XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgYywtcywgMCxcclxuICAgICAgICBzLCBjLCAwLFxyXG4gICAgICAgIDAsIDAsIDEsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgc2NhbGluZzogZnVuY3Rpb24oc3ggOiBudW1iZXIsIHN5IDogbnVtYmVyKSA6IG51bWJlcltdIHtcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBzeCwgMCwgMCxcclxuICAgICAgICAwLCBzeSwgMCxcclxuICAgICAgICAwLCAwLCAxLFxyXG4gICAgICBdO1xyXG4gICAgfSxcclxuICBcclxuICAgIG11bHRpcGx5OiBmdW5jdGlvbihhIDogbnVtYmVyW10sIGIgOiBudW1iZXJbXSkgOiBudW1iZXJbXSB7XHJcbiAgICAgIGNvbnN0IGEwMCA9IGFbMCAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTAxID0gYVswICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMDIgPSBhWzAgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGExMCA9IGFbMSAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTExID0gYVsxICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMTIgPSBhWzEgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGEyMCA9IGFbMiAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTIxID0gYVsyICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMjIgPSBhWzIgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGIwMCA9IGJbMCAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYjAxID0gYlswICogMyArIDFdO1xyXG4gICAgICBjb25zdCBiMDIgPSBiWzAgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGIxMCA9IGJbMSAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYjExID0gYlsxICogMyArIDFdO1xyXG4gICAgICBjb25zdCBiMTIgPSBiWzEgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGIyMCA9IGJbMiAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYjIxID0gYlsyICogMyArIDFdO1xyXG4gICAgICBjb25zdCBiMjIgPSBiWzIgKiAzICsgMl07XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxyXG4gICAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcclxuICAgICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXHJcbiAgICAgICAgYjEwICogYTAwICsgYjExICogYTEwICsgYjEyICogYTIwLFxyXG4gICAgICAgIGIxMCAqIGEwMSArIGIxMSAqIGExMSArIGIxMiAqIGEyMSxcclxuICAgICAgICBiMTAgKiBhMDIgKyBiMTEgKiBhMTIgKyBiMTIgKiBhMjIsXHJcbiAgICAgICAgYjIwICogYTAwICsgYjIxICogYTEwICsgYjIyICogYTIwLFxyXG4gICAgICAgIGIyMCAqIGEwMSArIGIyMSAqIGExMSArIGIyMiAqIGEyMSxcclxuICAgICAgICBiMjAgKiBhMDIgKyBiMjEgKiBhMTIgKyBiMjIgKiBhMjIsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIGludmVyc2U6IGZ1bmN0aW9uKG0gOiBudW1iZXJbXSkge1xyXG4gICAgICBjb25zdCBkZXQgPSBtWzBdICogKG1bNF0gKiBtWzhdIC0gbVs3XSAqIG1bNV0pIC1cclxuICAgICAgICAgICAgICAgICAgbVsxXSAqIChtWzNdICogbVs4XSAtIG1bNV0gKiBtWzZdKSArXHJcbiAgICAgICAgICAgICAgICAgIG1bMl0gKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSk7XHJcbiAgXHJcbiAgICAgIGlmIChkZXQgPT09IDApIHJldHVybiBudWxsO1xyXG4gIFxyXG4gICAgICBjb25zdCBpbnZEZXQgPSAxIC8gZGV0O1xyXG4gIFxyXG4gICAgICByZXR1cm4gWyBcclxuICAgICAgICAgIGludkRldCAqIChtWzRdICogbVs4XSAtIG1bNV0gKiBtWzddKSwgXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVsyXSAqIG1bN10gLSBtWzFdICogbVs4XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVsxXSAqIG1bNV0gLSBtWzJdICogbVs0XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVs1XSAqIG1bNl0gLSBtWzNdICogbVs4XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVswXSAqIG1bOF0gLSBtWzJdICogbVs2XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVsyXSAqIG1bM10gLSBtWzBdICogbVs1XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVszXSAqIG1bN10gLSBtWzRdICogbVs2XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVsxXSAqIG1bNl0gLSBtWzBdICogbVs3XSksXHJcbiAgICAgICAgICBpbnZEZXQgKiAobVswXSAqIG1bNF0gLSBtWzFdICogbVszXSlcclxuICAgICAgXTtcclxuICB9LFxyXG5cclxuICAgIG11bHRpcGx5M3gxOiBmdW5jdGlvbihhIDogbnVtYmVyW10sIGIgOiBudW1iZXJbXSkgOiBudW1iZXJbXSB7XHJcbiAgICAgIGNvbnN0IGEwMCA9IGFbMCAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTAxID0gYVswICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMDIgPSBhWzAgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGExMCA9IGFbMSAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTExID0gYVsxICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMTIgPSBhWzEgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGEyMCA9IGFbMiAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYTIxID0gYVsyICogMyArIDFdO1xyXG4gICAgICBjb25zdCBhMjIgPSBhWzIgKiAzICsgMl07XHJcbiAgICAgIGNvbnN0IGIwMCA9IGJbMCAqIDMgKyAwXTtcclxuICAgICAgY29uc3QgYjAxID0gYlswICogMyArIDFdO1xyXG4gICAgICBjb25zdCBiMDIgPSBiWzAgKiAzICsgMl07XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgYjAwICogYTAwICsgYjAxICogYTEwICsgYjAyICogYTIwLFxyXG4gICAgICAgIGIwMCAqIGEwMSArIGIwMSAqIGExMSArIGIwMiAqIGEyMSxcclxuICAgICAgICBiMDAgKiBhMDIgKyBiMDEgKiBhMTIgKyBiMDIgKiBhMjIsXHJcbiAgICAgIF07XHJcbiAgICB9LFxyXG5cclxuICAgIHRyYW5zbGF0ZTogZnVuY3Rpb24obSA6IG51bWJlcltdLCB0eDpudW1iZXIsIHR5Om51bWJlcikge1xyXG4gICAgICByZXR1cm4gbTMubXVsdGlwbHkobSwgbTMudHJhbnNsYXRpb24odHgsIHR5KSk7XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgcm90YXRlOiBmdW5jdGlvbihtOm51bWJlcltdLCBhbmdsZUluUmFkaWFuczpudW1iZXIpIHtcclxuICAgICAgcmV0dXJuIG0zLm11bHRpcGx5KG0sIG0zLnJvdGF0aW9uKGFuZ2xlSW5SYWRpYW5zKSk7XHJcbiAgICB9LFxyXG4gIFxyXG4gICAgc2NhbGU6IGZ1bmN0aW9uKG06bnVtYmVyW10sIHN4Om51bWJlciwgc3k6bnVtYmVyKSB7XHJcbiAgICAgIHJldHVybiBtMy5tdWx0aXBseShtLCBtMy5zY2FsaW5nKHN4LCBzeSkpO1xyXG4gICAgfSxcclxuICB9OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==