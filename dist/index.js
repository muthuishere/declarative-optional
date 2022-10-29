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
var Optional = /** @class */ (function () {
    function Optional(input) {
        var _this = this;
        this.input = input;
        this.functions = [];
        this.map = function (fn) {
            _this.functions.push(function (arrayedInput) {
                return Array.prototype.map.call(arrayedInput, fn);
            });
            return _this;
        };
        this.filter = function (fn) {
            _this.functions.push(function (arrayedInput) {
                return Array.prototype.filter.call(arrayedInput, fn);
            });
            return _this;
        };
        this.peek = function (fn) {
            _this.functions.push(function (arrayedInput) {
                return Array.prototype.map.call(arrayedInput, function (data) {
                    fn(data);
                    return data;
                });
            });
            return _this;
        };
        this.flatmap = function (fn) {
            _this.functions.push(function (arrayedInput) {
                return Array.prototype.map.call(arrayedInput, fn);
            });
            _this.functions.push(function (arrayedInput) {
                return Array.prototype.map.call(arrayedInput, flattenOptional);
            });
            return _this;
        };
        this.flatten = function () {
            _this.functions.push(function (arrayedInput) {
                return Array.prototype.map.call(arrayedInput, flattenOptional);
            });
            return _this;
        };
    }
    Optional.prototype.getFunctions = function () {
        return this.functions;
    };
    Optional.prototype.executeAsync = function () {
        return this.getFunctions().reduce(function (p, currentFunction) {
            return p.then(function (item) {
                return new Promise(function (resolve) {
                    return Promise.resolve(item).then(function (val) {
                        var result = val.length > 0 ? currentFunction(val) : val;
                        resolve(Promise.all(result));
                    });
                });
            });
        }, Promise.resolve(Promise.all(elementAsArray(this.input))));
    };
    Optional.prototype.getAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var finalOutput, asyncResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.executeAsync()];
                    case 1:
                        finalOutput = _a.sent();
                        asyncResult = getResult(finalOutput);
                        return [2 /*return*/, asyncResult];
                }
            });
        });
    };
    Optional.prototype.toAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            var asyncResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getAsync()];
                    case 1:
                        asyncResult = _a.sent();
                        return [2 /*return*/, new Optional(asyncResult)];
                }
            });
        });
    };
    Optional.prototype.execute = function () {
        var finalOutput = this.getFunctions().reduce(function (acc, currentFunction) {
            var value = currentFunction(acc);
            return acc.length > 0 ? value : acc;
        }, elementAsArray(this.input));
        return getResult(finalOutput);
    };
    Optional.prototype.get = function () {
        return this.execute();
    };
    Optional.prototype.orElse = function (defaultValue) {
        var result = this.execute();
        return result ? result : defaultValue;
    };
    Optional.prototype.isPresent = function () {
        var result = this.execute();
        return result ? true : false;
    };
    Optional.prototype.ifPresent = function (fn) {
        var result = this.execute();
        if (result)
            return fn(result);
    };
    Optional.prototype.ifPresentOrElse = function (fn, elseFn) {
        var result = this.execute();
        if (result)
            return fn(result);
        else
            return elseFn();
    };
    Optional.prototype.stream = function () {
        var result = this.execute();
        if (null == result)
            return [];
        if (Array.isArray(result))
            return this.input;
        else
            return elementAsArray(result);
    };
    Optional.of = function (input) {
        return new Optional(input);
    };
    return Optional;
}());
exports.default = Optional;
function elementAsArray(input) {
    var arr = [];
    if (!!input)
        arr.push(input);
    return arr;
}
function getResult(arr) {
    if (arr.length === 0)
        return null;
    return arr[0];
}
function flattenOptional(result) {
    var isOptional = result.hasOwnProperty("input") && result.hasOwnProperty("functions");
    // tslint:disable-next-line: no-console
    console.assert(isOptional, {
        result: result,
        errorMsg: "flatten should be called with an optional",
    });
    return result.get();
}
