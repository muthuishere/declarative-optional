import {elementAsArray, executeAsyncWith, executeWith, flattenResults, getResult} from "./shared";


export  default class Stream<Type> {

    functions: Function[] = [];

    getFunctions(): Function[] {
        return this.functions;
    }
    map(fn: any) {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.map.call(arrayedInput, fn)
        );
        return this;
    }

    filter(fn: any) {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.filter.call(arrayedInput, fn)
        );
        return this;
    }
    take(n:number) {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.filter.call(arrayedInput, (element,index)=>index<n)
        );
        return this;
    }

    private pushFunctionToGetDataAt(n:number){
        this.functions.push((arrayedInput: any) =>
            arrayedInput.length > n-1 ? arrayedInput[n-1] : null
        );
    }
    public first() {
        this.pushFunctionToGetDataAt(1);
        return this.execute();
    }
    public next() {
        this.pushFunctionToGetDataAt(2);
        return this.execute();
    }
    public nth(n:number) {
        this.pushFunctionToGetDataAt(n);
        return this.execute();
    }
    public peek(fn: any) {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.map.call(arrayedInput, (data) => {
                fn(data);
                return data;
            })
        );
        return this;
    }

    flatmap(fn: any) {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.map.call(arrayedInput, fn)
        );
        this.functions.push((arrayedInput: any) =>
            Array.prototype.map.call(arrayedInput, flattenResults)
        );

        return this;
    }

    flatten() {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.map.call(arrayedInput, flattenResults)
        );
        return this;
    }
    constructor(private input: Type) {

    }

    public executeAsync() {
        return executeAsyncWith(this.input, this.getFunctions());
    }





    execute() {

        return executeWith(this.input, this.getFunctions());
    }




    public get() {
        return this.execute();
    }
    public async toAsync() {
        const asyncResult = await this.getAsync();
        return new Stream(asyncResult);
    }
    public async getAsync() {
        const finalOutput = await this.executeAsync();
        // @ts-ignore
        const asyncResult = getResult(finalOutput);
        return asyncResult;
    }
    public Stream() {
        const result = this.execute();

        if (null == result) return [];

        if (Array.isArray(result)) return this.input;
        else return elementAsArray(result);
    }

    public static of<Type>(input: Type) {
        return new Stream(input);
    }
}
