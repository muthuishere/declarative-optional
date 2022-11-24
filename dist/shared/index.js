"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeWith = exports.executeAsyncWith = exports.flattenResults = void 0;
function flattenResults(result) {
    var isOptional = result.hasOwnProperty("input") && result.hasOwnProperty("functions");
    // tslint:disable-next-line: no-console
    console.assert(isOptional, {
        result: result,
        errorMsg: "flatten should be called with an optional",
    });
    return result.get();
}
exports.flattenResults = flattenResults;
function executeAsyncWith(input, functions) {
    return functions.reduce(function (p, currentFunction) {
        return p.then(function (item) {
            return new Promise(function (resolve) {
                return Promise.resolve(item).then(function (val) {
                    var result = val.length > 0 ? currentFunction(val) : val;
                    resolve(Promise.all(result));
                });
            });
        });
    }, Promise.resolve(Promise.all(input)));
}
exports.executeAsyncWith = executeAsyncWith;
function executeWith(input, functions) {
    var finalOutput = functions.reduce(function (acc, currentFunction) {
        var value = currentFunction(acc);
        return acc.length > 0 ? value : acc;
    }, input);
    return finalOutput;
}
exports.executeWith = executeWith;
