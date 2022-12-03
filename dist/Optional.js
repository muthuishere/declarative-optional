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
var Optional = /** @class */ (function () {
    function Optional(input) {
        this.input = input;
        this.functions = [];
    }
    Optional.prototype.getFunctions = function () {
        return this.functions;
    };
    Optional.prototype.map = function (fn) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, fn);
        });
        return this;
    };
    Optional.prototype.filter = function (fn) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.filter.call(arrayedInput, fn);
        });
        return this;
    };
    Optional.prototype.peek = function (fn) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, function (data) {
                fn(data);
                return data;
            });
        });
        return this;
    };
    Optional.prototype.flatmap = function (fn) {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, fn);
        });
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, shared_1.flattenResults);
        });
        return this;
    };
    Optional.prototype.flatten = function () {
        this.functions.push(function (arrayedInput) {
            return Array.prototype.map.call(arrayedInput, shared_1.flattenResults);
        });
        return this;
    };
    Optional.prototype.stream = function () {
        // tslint:disable-next-line: no-console
        console.warn("stream deprecated , will be removed in 3.x");
        var result = this.execute();
        if (undefined === result || null === result)
            return [];
        if (Array.isArray(result))
            return result;
        else
            return formatInput(result);
    };
    Optional.prototype.getAsync = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.toPromise()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Optional.prototype.toPromise = function () {
        return __awaiter(this, void 0, void 0, function () {
            var finalOutput, asyncResult;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, (0, shared_1.executeAsyncWith)(formatInput(this.input), this.getFunctions())];
                    case 1:
                        finalOutput = _a.sent();
                        asyncResult = getSingleResult(finalOutput);
                        return [2 /*return*/, asyncResult];
                }
            });
        });
    };
    Optional.prototype.orElseAsync = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var asyncResult, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.getAsync()];
                    case 1:
                        asyncResult = _a.sent();
                        return [2 /*return*/, asyncResult];
                    case 2:
                        e_1 = _a.sent();
                        return [2 /*return*/, data];
                    case 3: return [2 /*return*/];
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
        var result = (0, shared_1.executeWith)(formatInput(this.input), this.getFunctions());
        return getSingleResult(result);
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
    Optional.of = function (input) {
        return new Optional(input);
    };
    return Optional;
}());
exports.default = Optional;
function formatInput(input) {
    if (!!input)
        return [input];
    return [];
}
function getSingleResult(arr) {
    if (arr.length === 0)
        return null;
    return arr[0];
}
