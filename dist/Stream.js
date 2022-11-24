"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var shared_1 = require("./shared");
var Stream = /** @class */ (function () {
    function Stream(input) {
        this.input = input;
        this.functions = [];
    }
    Stream.prototype.getFunctions = function () {
        return this.functions;
    };
    Stream.prototype.map = function (fn) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, fn);
        });
        return this;
    };
    Stream.prototype.filter = function (fn) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.filter.call(arrayedInput, fn);
        });
        return this;
    };
    Stream.prototype.take = function (n) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.filter.call(arrayedInput, function (element, index) { return index < n; });
        });
        return this;
    };
    Stream.prototype.pushFunctionToGetDataAt = function (n) {
        this.functions.push(function (arrayedInput) {
            return arrayedInput.length > n - 1 ? arrayedInput[n - 1] : null;
        });
    };
    Stream.prototype.first = function () {
        this.pushFunctionToGetDataAt(1);
        return this.execute();
    };
    Stream.prototype.next = function () {
        this.pushFunctionToGetDataAt(2);
        return this.execute();
    };
    Stream.prototype.nth = function (n) {
        this.pushFunctionToGetDataAt(n);
        return this.execute();
    };
    Stream.prototype.peek = function (fn) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, function (data) {
                fn(data);
                return data;
            });
        });
        return this;
    };
    Stream.prototype.flatmap = function (fn) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, fn);
        });
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, shared_1.flattenResults);
        });
        return this;
    };
    Stream.prototype.flatten = function () {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, shared_1.flattenResults);
        });
        return this;
    };
    Stream.prototype.executeAsync = function () {
        return (0, shared_1.executeAsyncWith)(this.input, this.getFunctions());
    };
    Stream.prototype.execute = function () {
        return (0, shared_1.executeWith)(this.input, this.getFunctions());
    };
    Stream.prototype.get = function () {
        return this.execute();
    };
    Stream.prototype.toAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var asyncResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAsync()];
                    case 1:
                        asyncResult = _a.sent();
                        return [2 /*return*/, new Stream(asyncResult)];
                }
            });
        });
    };
    Stream.prototype.getAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var finalOutput, asyncResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.executeAsync()];
                    case 1:
                        finalOutput = _a.sent();
                        asyncResult = (0, shared_1.getResult)(finalOutput);
                        return [2 /*return*/, asyncResult];
                }
            });
        });
    };
    Stream.prototype.Stream = function () {
        var result = this.execute();
        if (null == result)
            return [];
        if (Array.isArray(result))
            return this.input;
        else
            return (0, shared_1.elementAsArray)(result);
    };
    Stream.of = function (input) {
        return new Stream(input);
    };
    return Stream;
}());
exports.default = Stream;
