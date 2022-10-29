
function FunctionChainer(obj){
    this.functions = []
    obj.map = (fn) => {
        this.functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, fn))
        return obj;
    }

    obj.filter = (fn) => {
        this.functions.push((arrayedInput) => Array.prototype.filter.call(arrayedInput, fn))
        return obj;
    }
    obj.peek = (fn) => {
        this.functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, (data)=>{
            fn(data)
            return data
        }))
        return obj;
    }
    obj.flatmap = (fn) => {
        this.functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, fn))
        this.functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, flattenOptional))
        return obj;
    }
    obj.flatten = () => {
        this.functions.push((arrayedInput) => Array.prototype.map.call(arrayedInput, flattenOptional))
        return obj;
    }

}


function Optional(input) {
    this.input = input;
    this.functionChainer =new FunctionChainer(this)
    this.getFunctions = ()=>{
        return this.functionChainer.functions;
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


    return  this.getFunctions().reduce((p, currentFunction) => {
        return p.then((item) => {

            return new Promise(resolve => {
                return  Promise.resolve(item).then(val=>{

                    let result =  val.length >0 ?currentFunction(val):val;
                    resolve(Promise.all(result))

                })}

            )



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

    const finalOutput = this.getFunctions().reduce((acc, currentFunction) => {
        return acc.length >0 ?currentFunction(acc):acc;
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
