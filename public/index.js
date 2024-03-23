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
        this._shapes = {};
        this.gl = gl;
        this.positionBuffer = positionBuffer;
        this.colorBuffer = colorBuffer;
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
        },
        enumerable: false,
        configurable: true
    });
    AppCanvas.prototype.generateIdFromTag = function (tag) {
        var withSameTag = Object.keys(this.shapes).filter(function (id) { return id.startsWith(tag + '-'); });
        return "".concat(tag, "-").concat(withSameTag.length + 1);
    };
    AppCanvas.prototype.addShape = function (shape) {
        if (shape.id in Object.keys(this.shapes)) {
            console.error('Shape ID already used');
            return;
        }
        var newShapes = __assign({}, this.shapes);
        newShapes[shape.id] = shape;
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
var AVAIL_SHAPES;
(function (AVAIL_SHAPES) {
    AVAIL_SHAPES["Line"] = "Line";
    AVAIL_SHAPES["Rectangle"] = "Rectangle";
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
            (_a = _this.shapeController) === null || _a === void 0 ? void 0 : _a.handleClick(e.offsetX, e.offsetY);
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
                (_a = _this.shapeController) === null || _a === void 0 ? void 0 : _a.handleClick(e.offsetX, e.offsetY);
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
var Line = /** @class */ (function (_super) {
    __extends(Line, _super);
    function Line(id, color, startX, startY, endX, endY) {
        var _this = _super.call(this, 1, id, color) || this;
        var origin = new Vertex_1.default(startX, startY);
        var end = new Vertex_1.default(endX, endY);
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
        _this.pointList.push(v1, v2, v3, v4);
        return _this;
    }
    return Rectangle;
}(BaseShape_1.default));
exports["default"] = Rectangle;


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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7O1VFdEJBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0FwcENhbnZhcy50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvQmFzZS9CYXNlU2hhcGUudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvQ29sb3IudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL0Jhc2UvVmVydGV4LnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9DYW52YXNDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9MaW5lTWFrZXJDb250cm9sbGVyLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9Db250cm9sbGVycy9NYWtlci9TaGFwZS9SZWN0YW5nbGVNYWtlckNvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vc2lza29tLy4vc3JjL1NoYXBlcy9MaW5lLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9TaGFwZXMvUmVjdGFuZ2xlLnRzIiwid2VicGFjazovL3Npc2tvbS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9zaXNrb20vLi9zcmMvaW5pdC50cyIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svYmVmb3JlLXN0YXJ0dXAiLCJ3ZWJwYWNrOi8vc2lza29tL3dlYnBhY2svc3RhcnR1cCIsIndlYnBhY2s6Ly9zaXNrb20vd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlU2hhcGUgZnJvbSAnLi9CYXNlL0Jhc2VTaGFwZSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFwcENhbnZhcyB7XG4gICAgcHJpdmF0ZSBnbDogV2ViR0xSZW5kZXJpbmdDb250ZXh0O1xuICAgIHByaXZhdGUgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyO1xuICAgIHByaXZhdGUgY29sb3JCdWZmZXI6IFdlYkdMQnVmZmVyO1xuXG4gICAgcHJpdmF0ZSBfc2hhcGVzOiBSZWNvcmQ8c3RyaW5nLCBCYXNlU2hhcGU+ID0ge307XG5cbiAgICBjb25zdHJ1Y3RvcihcbiAgICAgICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgICAgICAgcG9zaXRpb25CdWZmZXI6IFdlYkdMQnVmZmVyLFxuICAgICAgICBjb2xvckJ1ZmZlcjogV2ViR0xCdWZmZXJcbiAgICApIHtcbiAgICAgICAgdGhpcy5nbCA9IGdsO1xuICAgICAgICB0aGlzLnBvc2l0aW9uQnVmZmVyID0gcG9zaXRpb25CdWZmZXI7XG4gICAgICAgIHRoaXMuY29sb3JCdWZmZXIgPSBjb2xvckJ1ZmZlcjtcblxuICAgICAgICB0aGlzLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHByaXZhdGUgcmVuZGVyKCkge1xuICAgICAgICBjb25zdCBnbCA9IHRoaXMuZ2w7XG4gICAgICAgIGNvbnN0IHBvc2l0aW9uQnVmZmVyID0gdGhpcy5wb3NpdGlvbkJ1ZmZlcjtcbiAgICAgICAgY29uc3QgY29sb3JCdWZmZXIgPSB0aGlzLmNvbG9yQnVmZmVyO1xuXG4gICAgICAgIE9iamVjdC52YWx1ZXModGhpcy5zaGFwZXMpLmZvckVhY2goKHNoYXBlKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSBzaGFwZS5wb2ludExpc3QuZmxhdE1hcCgocG9pbnQpID0+IFtcbiAgICAgICAgICAgICAgICBwb2ludC54LFxuICAgICAgICAgICAgICAgIHBvaW50LnksXG4gICAgICAgICAgICBdKTtcblxuICAgICAgICAgICAgY29uc3QgYmFzZUNvbG9yVmVjdCA9IFtzaGFwZS5jb2xvci5yLCBzaGFwZS5jb2xvci5nLCBzaGFwZS5jb2xvci5iXTtcbiAgICAgICAgICAgIGxldCBjb2xvcnM6IG51bWJlcltdID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNoYXBlLnBvaW50TGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGNvbG9ycyA9IGNvbG9ycy5jb25jYXQoYmFzZUNvbG9yVmVjdCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIEJpbmQgY29sb3IgZGF0YVxuICAgICAgICAgICAgZ2wuYmluZEJ1ZmZlcihnbC5BUlJBWV9CVUZGRVIsIGNvbG9yQnVmZmVyKTtcbiAgICAgICAgICAgIGdsLmJ1ZmZlckRhdGEoXG4gICAgICAgICAgICAgICAgZ2wuQVJSQVlfQlVGRkVSLFxuICAgICAgICAgICAgICAgIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSxcbiAgICAgICAgICAgICAgICBnbC5TVEFUSUNfRFJBV1xuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgLy8gQmluZCBwb3NpdGlvbiBkYXRhXG4gICAgICAgICAgICBnbC5iaW5kQnVmZmVyKGdsLkFSUkFZX0JVRkZFUiwgcG9zaXRpb25CdWZmZXIpO1xuICAgICAgICAgICAgZ2wuYnVmZmVyRGF0YShcbiAgICAgICAgICAgICAgICBnbC5BUlJBWV9CVUZGRVIsXG4gICAgICAgICAgICAgICAgbmV3IEZsb2F0MzJBcnJheShwb3NpdGlvbnMpLFxuICAgICAgICAgICAgICAgIGdsLlNUQVRJQ19EUkFXXG4gICAgICAgICAgICApO1xuXG4gICAgICAgICAgICBnbC5kcmF3QXJyYXlzKHNoYXBlLmdsRHJhd1R5cGUsIDAsIHNoYXBlLnBvaW50TGlzdC5sZW5ndGgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwdWJsaWMgZ2V0IHNoYXBlcygpOiBSZWNvcmQ8c3RyaW5nLCBCYXNlU2hhcGU+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NoYXBlcztcbiAgICB9XG5cbiAgICBwdWJsaWMgc2V0IHNoYXBlcyh2OiBSZWNvcmQ8c3RyaW5nLCBCYXNlU2hhcGU+KSB7XG4gICAgICAgIHRoaXMuX3NoYXBlcyA9IHY7XG4gICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgfVxuXG4gICAgcHVibGljIGdlbmVyYXRlSWRGcm9tVGFnKHRhZzogc3RyaW5nKSB7XG4gICAgICAgIGNvbnN0IHdpdGhTYW1lVGFnID0gT2JqZWN0LmtleXModGhpcy5zaGFwZXMpLmZpbHRlcigoaWQpID0+IGlkLnN0YXJ0c1dpdGgodGFnICsgJy0nKSk7XG4gICAgICAgIHJldHVybiBgJHt0YWd9LSR7d2l0aFNhbWVUYWcubGVuZ3RoICsgMX1gXG4gICAgfVxuXG4gICAgcHVibGljIGFkZFNoYXBlKHNoYXBlOiBCYXNlU2hhcGUpIHtcbiAgICAgICAgaWYgKHNoYXBlLmlkIGluIE9iamVjdC5rZXlzKHRoaXMuc2hhcGVzKSkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcignU2hhcGUgSUQgYWxyZWFkeSB1c2VkJyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZXdTaGFwZXMgPSB7IC4uLnRoaXMuc2hhcGVzIH07XG4gICAgICAgIG5ld1NoYXBlc1tzaGFwZS5pZF0gPSBzaGFwZTtcbiAgICAgICAgdGhpcy5zaGFwZXMgPSBuZXdTaGFwZXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IENvbG9yIGZyb20gXCIuL0NvbG9yXCI7XG5pbXBvcnQgVmVydGV4IGZyb20gXCIuL1ZlcnRleFwiO1xuXG5leHBvcnQgZGVmYXVsdCBhYnN0cmFjdCBjbGFzcyBCYXNlU2hhcGUge1xuICAgIHBvaW50TGlzdDogVmVydGV4W10gPSBbXTtcbiAgICBpZDogc3RyaW5nO1xuICAgIGNvbG9yOiBDb2xvcjtcbiAgICBnbERyYXdUeXBlOiBudW1iZXJcblxuICAgIGNvbnN0cnVjdG9yKGdsRHJhd1R5cGU6IG51bWJlciwgaWQ6IHN0cmluZywgY29sb3I6IENvbG9yKSB7XG4gICAgICAgIHRoaXMuZ2xEcmF3VHlwZSA9IGdsRHJhd1R5cGU7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jb2xvciA9IGNvbG9yO1xuICAgIH1cbn0iLCJleHBvcnQgZGVmYXVsdCBjbGFzcyBDb2xvciB7XG4gICAgcjogbnVtYmVyO1xuICAgIGc6IG51bWJlcjtcbiAgICBiOiBudW1iZXI7XG5cbiAgICBjb25zdHJ1Y3RvcihyOiBudW1iZXIsIGc6IG51bWJlciwgYjogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuciA9IHI7XG4gICAgICAgIHRoaXMuZyA9IGc7XG4gICAgICAgIHRoaXMuYiA9IGI7XG4gICAgfVxufVxuIiwiZXhwb3J0IGRlZmF1bHQgY2xhc3MgVmVydGV4IHtcbiAgICB4OiBudW1iZXI7XG4gICAgeTogbnVtYmVyO1xuICAgIGNvbnN0cnVjdG9yKHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgfVxufSIsImltcG9ydCBBcHBDYW52YXMgZnJvbSAnLi4vLi4vQXBwQ2FudmFzJztcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gJy4vU2hhcGUvSVNoYXBlTWFrZXJDb250cm9sbGVyJztcbmltcG9ydCBMaW5lTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvTGluZU1ha2VyQ29udHJvbGxlcic7XG5pbXBvcnQgUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyIGZyb20gJy4vU2hhcGUvUmVjdGFuZ2xlTWFrZXJDb250cm9sbGVyJztcblxuZW51bSBBVkFJTF9TSEFQRVMge1xuICAgIExpbmUgPSBcIkxpbmVcIixcbiAgICBSZWN0YW5nbGUgPSBcIlJlY3RhbmdsZVwiXG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhc0NvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgX3NoYXBlQ29udHJvbGxlcjogSVNoYXBlTWFrZXJDb250cm9sbGVyO1xuICAgIHByaXZhdGUgY2FudmFzRWxtdDogSFRNTENhbnZhc0VsZW1lbnQ7XG4gICAgcHJpdmF0ZSBidXR0b25Db250YWluZXI6IEhUTUxEaXZFbGVtZW50O1xuICAgIHByaXZhdGUgYXBwQ2FudmFzOiBBcHBDYW52YXM7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcblxuICAgICAgICBjb25zdCBjYW52YXNFbG10ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2MnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICAgICAgY29uc3QgYnV0dG9uQ29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXG4gICAgICAgICAgICAnc2hhcGUtYnV0dG9uLWNvbnRhaW5lcidcbiAgICAgICAgKSBhcyBIVE1MRGl2RWxlbWVudDtcblxuICAgICAgICB0aGlzLmNhbnZhc0VsbXQgPSBjYW52YXNFbG10O1xuICAgICAgICB0aGlzLmJ1dHRvbkNvbnRhaW5lciA9IGJ1dHRvbkNvbnRhaW5lcjtcblxuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSBuZXcgTGluZU1ha2VyQ29udHJvbGxlcihhcHBDYW52YXMpO1xuXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhlLm9mZnNldFgsIGUub2Zmc2V0WSk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXQgc2hhcGVDb250cm9sbGVyKCk6IElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaGFwZUNvbnRyb2xsZXI7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBzZXQgc2hhcGVDb250cm9sbGVyKHY6IElTaGFwZU1ha2VyQ29udHJvbGxlcikge1xuICAgICAgICB0aGlzLl9zaGFwZUNvbnRyb2xsZXIgPSB2O1xuXG4gICAgICAgIHRoaXMuY2FudmFzRWxtdC5vbmNsaWNrID0gKGUpID0+IHtcbiAgICAgICAgICAgIHRoaXMuc2hhcGVDb250cm9sbGVyPy5oYW5kbGVDbGljayhlLm9mZnNldFgsIGUub2Zmc2V0WSk7XG4gICAgICAgIH07XG4gICAgfVxuICAgIFxuICAgIHByaXZhdGUgaW5pdENvbnRyb2xsZXIoc2hhcGVTdHI6IEFWQUlMX1NIQVBFUyk6IElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgICAgIHN3aXRjaCAoc2hhcGVTdHIpIHtcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLkxpbmU6XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBMaW5lTWFrZXJDb250cm9sbGVyKHRoaXMuYXBwQ2FudmFzKTtcbiAgICAgICAgICAgIGNhc2UgQVZBSUxfU0hBUEVTLlJlY3RhbmdsZTpcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlcih0aGlzLmFwcENhbnZhcyk7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW5jb3JyZWN0IHNoYXBlIHN0cmluZycpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgc3RhcnQoKSB7XG4gICAgICAgIGZvciAoY29uc3Qgc2hhcGVTdHIgaW4gQVZBSUxfU0hBUEVTKSB7XG4gICAgICAgICAgICBjb25zdCBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdidXR0b24nKTtcbiAgICAgICAgICAgIGJ1dHRvbi5jbGFzc0xpc3QuYWRkKCdzaGFwZS1idXR0b24nKTtcbiAgICAgICAgICAgIGJ1dHRvbi50ZXh0Q29udGVudCA9IHNoYXBlU3RyO1xuICAgICAgICAgICAgYnV0dG9uLm9uY2xpY2sgPSAoKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5zaGFwZUNvbnRyb2xsZXIgPSB0aGlzLmluaXRDb250cm9sbGVyKHNoYXBlU3RyIGFzIEFWQUlMX1NIQVBFUyk7XG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgdGhpcy5idXR0b25Db250YWluZXIuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBBcHBDYW52YXMgZnJvbSBcIi4uLy4uLy4uL0FwcENhbnZhc1wiO1xuaW1wb3J0IENvbG9yIGZyb20gXCIuLi8uLi8uLi9CYXNlL0NvbG9yXCI7XG5pbXBvcnQgTGluZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL0xpbmVcIjtcbmltcG9ydCB7IElTaGFwZU1ha2VyQ29udHJvbGxlciB9IGZyb20gXCIuL0lTaGFwZU1ha2VyQ29udHJvbGxlclwiO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaW5lTWFrZXJDb250cm9sbGVyIGltcGxlbWVudHMgSVNoYXBlTWFrZXJDb250cm9sbGVyIHtcbiAgICBwcml2YXRlIGFwcENhbnZhczogQXBwQ2FudmFzO1xuICAgIHByaXZhdGUgb3JpZ2luOiB7eDogbnVtYmVyLCB5OiBudW1iZXJ9IHwgbnVsbCA9IG51bGw7XG5cbiAgICBjb25zdHJ1Y3RvcihhcHBDYW52YXM6IEFwcENhbnZhcykge1xuICAgICAgICB0aGlzLmFwcENhbnZhcyA9IGFwcENhbnZhcztcbiAgICB9XG5cbiAgICBoYW5kbGVDbGljayh4OiBudW1iZXIsIHk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5vcmlnaW4gPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMub3JpZ2luID0ge3gsIHl9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3QgcmVkID0gbmV3IENvbG9yKDEsIDAsIDApO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygnbGluZScpO1xuICAgICAgICAgICAgY29uc3QgbGluZSA9IG5ldyBMaW5lKGlkLCByZWQsIHRoaXMub3JpZ2luLngsIHRoaXMub3JpZ2luLnksIHgsIHkpO1xuICAgICAgICAgICAgdGhpcy5hcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEFwcENhbnZhcyBmcm9tIFwiLi4vLi4vLi4vQXBwQ2FudmFzXCI7XG5pbXBvcnQgQ29sb3IgZnJvbSBcIi4uLy4uLy4uL0Jhc2UvQ29sb3JcIjtcbmltcG9ydCBMaW5lIGZyb20gXCIuLi8uLi8uLi9TaGFwZXMvTGluZVwiO1xuaW1wb3J0IFJlY3RhbmdsZSBmcm9tIFwiLi4vLi4vLi4vU2hhcGVzL1JlY3RhbmdsZVwiO1xuaW1wb3J0IHsgSVNoYXBlTWFrZXJDb250cm9sbGVyIH0gZnJvbSBcIi4vSVNoYXBlTWFrZXJDb250cm9sbGVyXCI7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJlY3RhbmdsZU1ha2VyQ29udHJvbGxlciBpbXBsZW1lbnRzIElTaGFwZU1ha2VyQ29udHJvbGxlciB7XG4gICAgcHJpdmF0ZSBhcHBDYW52YXM6IEFwcENhbnZhcztcbiAgICBwcml2YXRlIG9yaWdpbjoge3g6IG51bWJlciwgeTogbnVtYmVyfSB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3IoYXBwQ2FudmFzOiBBcHBDYW52YXMpIHtcbiAgICAgICAgdGhpcy5hcHBDYW52YXMgPSBhcHBDYW52YXM7XG4gICAgfVxuXG4gICAgaGFuZGxlQ2xpY2soeDogbnVtYmVyLCB5OiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IHt4LCB5fTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnN0IGJsYWNrID0gbmV3IENvbG9yKDAsIDAsIDApO1xuICAgICAgICAgICAgY29uc3QgaWQgPSB0aGlzLmFwcENhbnZhcy5nZW5lcmF0ZUlkRnJvbVRhZygncmVjdGFuZ2xlJyk7XG4gICAgICAgICAgICBjb25zdCByZWN0YW5nbGUgPSBuZXcgUmVjdGFuZ2xlKFxuICAgICAgICAgICAgICAgIGlkLCBibGFjaywgdGhpcy5vcmlnaW4ueCwgdGhpcy5vcmlnaW4ueSx0aGlzLm9yaWdpbi54LCB5LCB4LCB0aGlzLm9yaWdpbi55LCB4LCB5KTtcbiAgICAgICAgICAgIHRoaXMuYXBwQ2FudmFzLmFkZFNoYXBlKHJlY3RhbmdsZSk7XG4gICAgICAgICAgICB0aGlzLm9yaWdpbiA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG59IiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgTGluZSBleHRlbmRzIEJhc2VTaGFwZSB7XG4gICAgY29uc3RydWN0b3IoaWQ6IHN0cmluZywgY29sb3I6IENvbG9yLCBzdGFydFg6IG51bWJlciwgc3RhcnRZOiBudW1iZXIsIGVuZFg6IG51bWJlciwgZW5kWTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKDEsIGlkLCBjb2xvcik7XG4gICAgICAgIFxuICAgICAgICBjb25zdCBvcmlnaW4gPSBuZXcgVmVydGV4KHN0YXJ0WCwgc3RhcnRZKTtcbiAgICAgICAgY29uc3QgZW5kID0gbmV3IFZlcnRleChlbmRYLCBlbmRZKTtcblxuICAgICAgICB0aGlzLnBvaW50TGlzdC5wdXNoKG9yaWdpbiwgZW5kKTtcbiAgICB9XG59IiwiaW1wb3J0IEJhc2VTaGFwZSBmcm9tIFwiLi4vQmFzZS9CYXNlU2hhcGVcIjtcbmltcG9ydCBDb2xvciBmcm9tIFwiLi4vQmFzZS9Db2xvclwiO1xuaW1wb3J0IFZlcnRleCBmcm9tIFwiLi4vQmFzZS9WZXJ0ZXhcIjtcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdGFuZ2xlIGV4dGVuZHMgQmFzZVNoYXBlIHtcbiAgICBjb25zdHJ1Y3RvcihpZDogc3RyaW5nLCBjb2xvcjogQ29sb3IsIHgxOiBudW1iZXIsIHkxOiBudW1iZXIsIHgyOiBudW1iZXIsIHkyOiBudW1iZXIsIHgzOiBudW1iZXIsIHkzOiBudW1iZXIsIHg0OiBudW1iZXIsIHk0OiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoNSAsaWQsIGNvbG9yKTtcbiAgICAgICAgXG4gICAgICAgIGNvbnN0IHYxID0gbmV3IFZlcnRleCh4MSwgeTEpO1xuICAgICAgICBjb25zdCB2MiA9IG5ldyBWZXJ0ZXgoeDIsIHkyKTtcbiAgICAgICAgY29uc3QgdjMgPSBuZXcgVmVydGV4KHgzLCB5Myk7XG4gICAgICAgIGNvbnN0IHY0ID0gbmV3IFZlcnRleCh4NCwgeTQpO1xuXG4gICAgICAgIHRoaXMucG9pbnRMaXN0LnB1c2godjEsIHYyLCB2MywgdjQpO1xuICAgIH1cbn0iLCJpbXBvcnQgQXBwQ2FudmFzIGZyb20gJy4vQXBwQ2FudmFzJztcbmltcG9ydCBDYW52YXNDb250cm9sbGVyIGZyb20gJy4vQ29udHJvbGxlcnMvTWFrZXIvQ2FudmFzQ29udHJvbGxlcic7XG5pbXBvcnQgaW5pdCBmcm9tICcuL2luaXQnO1xuXG5jb25zdCBtYWluID0gKCkgPT4ge1xuICAgIGNvbnN0IGluaXRSZXQgPSBpbml0KCk7XG4gICAgaWYgKCFpbml0UmV0KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBpbml0aWFsaXplIFdlYkdMJyk7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB7IGdsLCBjb2xvckJ1ZmZlciwgcG9zaXRpb25CdWZmZXIgfSA9IGluaXRSZXQ7XG5cbiAgICBjb25zdCBhcHBDYW52YXMgPSBuZXcgQXBwQ2FudmFzKGdsLCBwb3NpdGlvbkJ1ZmZlciwgY29sb3JCdWZmZXIpO1xuICAgIGNvbnN0IGNhbnZhc0NvbnRyb2xsZXIgPSBuZXcgQ2FudmFzQ29udHJvbGxlcihhcHBDYW52YXMpO1xuICAgIGNhbnZhc0NvbnRyb2xsZXIuc3RhcnQoKTtcblxuICAgIC8vIGNvbnN0IHJlZCA9IG5ldyBDb2xvcigyNTUsIDAsIDIwMClcbiAgICAvLyBjb25zdCB0cmlhbmdsZSA9IG5ldyBUcmlhbmdsZSgndHJpLTEnLCByZWQsIDUwLCA1MCwgMjAsIDUwMCwgMjAwLCAxMDApO1xuICAgIC8vIGFwcENhbnZhcy5hZGRTaGFwZSh0cmlhbmdsZSk7XG5cbiAgICAvLyBjb25zdCBsaW5lID0gbmV3IExpbmUoJ2xpbmUtMScsIHJlZCwgMjAwLCAxMDAsIDMwMCwgMTAwKTtcbiAgICAvLyBhcHBDYW52YXMuYWRkU2hhcGUobGluZSk7XG59O1xuXG5tYWluKCk7XG4iLCJjb25zdCBjcmVhdGVTaGFkZXIgPSAoXG4gICAgZ2w6IFdlYkdMUmVuZGVyaW5nQ29udGV4dCxcbiAgICB0eXBlOiBudW1iZXIsXG4gICAgc291cmNlOiBzdHJpbmdcbikgPT4ge1xuICAgIGNvbnN0IHNoYWRlciA9IGdsLmNyZWF0ZVNoYWRlcih0eXBlKTtcbiAgICBpZiAoc2hhZGVyKSB7XG4gICAgICAgIGdsLnNoYWRlclNvdXJjZShzaGFkZXIsIHNvdXJjZSk7XG4gICAgICAgIGdsLmNvbXBpbGVTaGFkZXIoc2hhZGVyKTtcbiAgICAgICAgY29uc3Qgc3VjY2VzcyA9IGdsLmdldFNoYWRlclBhcmFtZXRlcihzaGFkZXIsIGdsLkNPTVBJTEVfU1RBVFVTKTtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHJldHVybiBzaGFkZXI7XG5cbiAgICAgICAgY29uc29sZS5lcnJvcihnbC5nZXRTaGFkZXJJbmZvTG9nKHNoYWRlcikpO1xuICAgICAgICBnbC5kZWxldGVTaGFkZXIoc2hhZGVyKTtcbiAgICB9XG59O1xuXG5jb25zdCBjcmVhdGVQcm9ncmFtID0gKFxuICAgIGdsOiBXZWJHTFJlbmRlcmluZ0NvbnRleHQsXG4gICAgdnR4U2hkOiBXZWJHTFNoYWRlcixcbiAgICBmcmdTaGQ6IFdlYkdMU2hhZGVyXG4pID0+IHtcbiAgICBjb25zdCBwcm9ncmFtID0gZ2wuY3JlYXRlUHJvZ3JhbSgpO1xuICAgIGlmIChwcm9ncmFtKSB7XG4gICAgICAgIGdsLmF0dGFjaFNoYWRlcihwcm9ncmFtLCB2dHhTaGQpO1xuICAgICAgICBnbC5hdHRhY2hTaGFkZXIocHJvZ3JhbSwgZnJnU2hkKTtcbiAgICAgICAgZ2wubGlua1Byb2dyYW0ocHJvZ3JhbSk7XG4gICAgICAgIGNvbnN0IHN1Y2Nlc3MgPSBnbC5nZXRQcm9ncmFtUGFyYW1ldGVyKHByb2dyYW0sIGdsLkxJTktfU1RBVFVTKTtcbiAgICAgICAgaWYgKHN1Y2Nlc3MpIHJldHVybiBwcm9ncmFtO1xuXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZ2wuZ2V0UHJvZ3JhbUluZm9Mb2cocHJvZ3JhbSkpO1xuICAgICAgICBnbC5kZWxldGVQcm9ncmFtKHByb2dyYW0pO1xuICAgIH1cbn07XG5cbmNvbnN0IGluaXQgPSAoKSA9PiB7XG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2MnKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbiAgICBjb25zdCBnbCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJnbCcpO1xuXG4gICAgaWYgKCFnbCkge1xuICAgICAgICBhbGVydCgnWW91ciBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgd2ViR0wnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBJbml0aWFsaXplIHNoYWRlcnMgYW5kIHByb2dyYW1zXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuICAgIGNvbnN0IHZ0eFNoYWRlclNvdXJjZSA9IChcbiAgICAgICAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3ZlcnRleC1zaGFkZXItMmQnKSBhcyBIVE1MU2NyaXB0RWxlbWVudFxuICAgICkudGV4dDtcbiAgICBjb25zdCBmcmFnU2hhZGVyU291cmNlID0gKFxuICAgICAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZnJhZ21lbnQtc2hhZGVyLTJkJykgYXMgSFRNTFNjcmlwdEVsZW1lbnRcbiAgICApLnRleHQ7XG5cbiAgICBjb25zdCB2ZXJ0ZXhTaGFkZXIgPSBjcmVhdGVTaGFkZXIoZ2wsIGdsLlZFUlRFWF9TSEFERVIsIHZ0eFNoYWRlclNvdXJjZSk7XG4gICAgY29uc3QgZnJhZ21lbnRTaGFkZXIgPSBjcmVhdGVTaGFkZXIoXG4gICAgICAgIGdsLFxuICAgICAgICBnbC5GUkFHTUVOVF9TSEFERVIsXG4gICAgICAgIGZyYWdTaGFkZXJTb3VyY2VcbiAgICApO1xuICAgIGlmICghdmVydGV4U2hhZGVyIHx8ICFmcmFnbWVudFNoYWRlcikgcmV0dXJuO1xuXG4gICAgY29uc3QgcHJvZ3JhbSA9IGNyZWF0ZVByb2dyYW0oZ2wsIHZlcnRleFNoYWRlciwgZnJhZ21lbnRTaGFkZXIpO1xuICAgIGlmICghcHJvZ3JhbSkgcmV0dXJuO1xuXG4gICAgZ2wudmlld3BvcnQoMCwgMCwgZ2wuY2FudmFzLndpZHRoLCBnbC5jYW52YXMuaGVpZ2h0KTtcbiAgICBnbC5jbGVhckNvbG9yKDAsIDAsIDAsIDApO1xuICAgIGdsLmNsZWFyKGdsLkNPTE9SX0JVRkZFUl9CSVQpO1xuICAgIGdsLnVzZVByb2dyYW0ocHJvZ3JhbSk7XG5cbiAgICAvLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09XG4gICAgLy8gRW5hYmxlICYgaW5pdGlhbGl6ZSB1bmlmb3JtcyBhbmQgYXR0cmlidXRlc1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBSZXNvbHV0aW9uXG4gICAgY29uc3QgcmVzb2x1dGlvblVuaWZvcm1Mb2NhdGlvbiA9IGdsLmdldFVuaWZvcm1Mb2NhdGlvbihcbiAgICAgICAgcHJvZ3JhbSxcbiAgICAgICAgJ3VfcmVzb2x1dGlvbidcbiAgICApO1xuICAgIGdsLnVuaWZvcm0yZihyZXNvbHV0aW9uVW5pZm9ybUxvY2F0aW9uLCBnbC5jYW52YXMud2lkdGgsIGdsLmNhbnZhcy5oZWlnaHQpO1xuXG4gICAgLy8gQ29sb3JcbiAgICBjb25zdCBjb2xvckJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIGlmICghY29sb3JCdWZmZXIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBjb2xvciBidWZmZXInKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XG4gICAgY29uc3QgY29sb3JBdHRyaWJ1dGVMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKHByb2dyYW0sICdhX2NvbG9yJyk7XG4gICAgZ2wuZW5hYmxlVmVydGV4QXR0cmliQXJyYXkoY29sb3JBdHRyaWJ1dGVMb2NhdGlvbik7XG4gICAgZ2wudmVydGV4QXR0cmliUG9pbnRlcihjb2xvckF0dHJpYnV0ZUxvY2F0aW9uLCAzLCBnbC5GTE9BVCwgZmFsc2UsIDAsIDApO1xuXG4gICAgLy8gUG9zaXRpb25cbiAgICBjb25zdCBwb3NpdGlvbkJ1ZmZlciA9IGdsLmNyZWF0ZUJ1ZmZlcigpO1xuICAgIGlmICghcG9zaXRpb25CdWZmZXIpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGNyZWF0ZSBwb3NpdGlvbiBidWZmZXInKTtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XG4gICAgY29uc3QgcG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbiA9IGdsLmdldEF0dHJpYkxvY2F0aW9uKFxuICAgICAgICBwcm9ncmFtLFxuICAgICAgICAnYV9wb3NpdGlvbidcbiAgICApO1xuICAgIGdsLmVuYWJsZVZlcnRleEF0dHJpYkFycmF5KHBvc2l0aW9uQXR0cmlidXRlTG9jYXRpb24pO1xuICAgIGdsLnZlcnRleEF0dHJpYlBvaW50ZXIocG9zaXRpb25BdHRyaWJ1dGVMb2NhdGlvbiwgMiwgZ2wuRkxPQVQsIGZhbHNlLCAwLCAwKTtcblxuICAgIC8vIERvIG5vdCByZW1vdmUgY29tbWVudHMsIHVzZWQgZm9yIHNhbml0eSBjaGVja1xuICAgIC8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT1cbiAgICAvLyBTZXQgdGhlIHZhbHVlcyBvZiB0aGUgYnVmZmVyXG4gICAgLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG4gICAgLy8gY29uc3QgY29sb3JzID0gWzEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjAsIDEuMCwgMC4wLCAwLjBdO1xuICAgIC8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBjb2xvckJ1ZmZlcik7XG4gICAgLy8gZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkoY29sb3JzKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgLy8gY29uc3QgcG9zaXRpb25zID0gWzEwMCwgNTAsIDIwLCAxMCwgNTAwLCA1MDBdO1xuICAgIC8vIGdsLmJpbmRCdWZmZXIoZ2wuQVJSQVlfQlVGRkVSLCBwb3NpdGlvbkJ1ZmZlcik7XG4gICAgLy8gZ2wuYnVmZmVyRGF0YShnbC5BUlJBWV9CVUZGRVIsIG5ldyBGbG9hdDMyQXJyYXkocG9zaXRpb25zKSwgZ2wuU1RBVElDX0RSQVcpO1xuXG4gICAgLy8gPT09PVxuICAgIC8vIERyYXdcbiAgICAvLyA9PT09XG4gICAgLy8gZ2wuZHJhd0FycmF5cyhnbC5UUklBTkdMRVMsIDAsIDMpO1xuXG4gICAgcmV0dXJuIHtcbiAgICAgICAgcG9zaXRpb25CdWZmZXIsXG4gICAgICAgIGNvbG9yQnVmZmVyLFxuICAgICAgICBnbCxcbiAgICB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgaW5pdDtcbiIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCIiLCIvLyBzdGFydHVwXG4vLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbi8vIFRoaXMgZW50cnkgbW9kdWxlIGlzIHJlZmVyZW5jZWQgYnkgb3RoZXIgbW9kdWxlcyBzbyBpdCBjYW4ndCBiZSBpbmxpbmVkXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IF9fd2VicGFja19yZXF1aXJlX18oXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIiJdLCJuYW1lcyI6W10sInNvdXJjZVJvb3QiOiIifQ==