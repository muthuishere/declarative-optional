(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Optional = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){


function Optional(input) {
    this.input = input;
    this._functions = []
    this.map = (fn) => {
        this._functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, fn))
        return this;
    }

    this.filter = (fn) => {
        this._functions.push((arrayedInput) => Array.prototype.filter.call(arrayedInput, fn))
        return this;
    }
    this.peek = (fn) => {
        this._functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, (data)=>{
            fn(data)
            return data
        }))
        return this;
    }
    this.flatmap = (fn) => {
        this._functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, fn))
        this._functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, flattenOptional))
        return this;
    }
    this.flatten = () => {
        this._functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, flattenOptional))
        return this;
    }



}

function elementAsArray(input) {
    const arr = []
    if (null != input && undefined != input)
        arr.push(input)
    return arr
}

function getResult(arr) {
    if (arr.length == 0)
        return null
    return arr[0];
}

function flattenOptional(result){
    let isOptional = result.hasOwnProperty("input") && result.hasOwnProperty("_functions");
    console.assert(isOptional, {result: result, errorMsg: "flatten should be called with an optional"});
    return  result.get() ;

}
Optional.prototype.executeAsync = function () {


    return  this._functions.reduce((p, currentFunction) => {
        return p.then((item) => {

            return new Promise(resolve => {
            return  Promise.resolve(item).then(val=>{
                let result = currentFunction(val);
                resolve(Promise.all(result))

            })})



        });
    }, Promise.resolve(Promise.all(elementAsArray(this.input))));
}


Optional.prototype.getAsync = async function () {
    const finalOutput = await this.executeAsync()
    const asyncResult= getResult(finalOutput, this.input)
    return asyncResult;
}


Optional.prototype.toAsync = async function () {
    const asyncResult= await this.getAsync()
    return new Optional(asyncResult);
}

Optional.prototype.execute = function () {

    const finalOutput = this._functions.reduce((acc, currentFunction) => {
        return currentFunction(acc);
    }, elementAsArray(this.input))



    return getResult(finalOutput, this.input)
}

Optional.prototype.get = function () {

    return this.execute()
}



Optional.prototype.orElse = function (defaultValue) {
    const result= this.execute()
    return result?result:defaultValue
}


Optional.prototype.isPresent = function () {
    const result= this.execute()
    return result?true:false;
}

Optional.prototype.ifPresent = function (fn) {
    const result= this.execute()
    if(result)
        return fn(result)

}
Optional.prototype.ifPresentOrElse = function (fn,elseFn) {
    const result= this.execute()
    if(result)
        return fn(result)
    else
        return elseFn()


}

Optional.prototype.stream = function () {
    const result = this.execute()

    if (null == result)
        return []

    if (Array.isArray(result))
        return this.input
    else
        return elementAsArray(result)

}

Optional.of = function (input) {
    return new Optional(input)
}
module.exports = Optional;

},{}]},{},[1])(1)
});
