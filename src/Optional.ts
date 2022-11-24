import {elementAsArray, executeAsyncWith, executeWith, flattenResults, getResult} from "./shared";

export default class Optional<Type> {

    functions: Function[] = [];

    getFunctions(): Function[] {
        return this.functions;
    }
    map<U>(fn: (value:any ) => U) {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.map.call(arrayedInput, fn)
        );
        return this;
    }

    filter(fn:(value: any) => Boolean) {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.filter.call(arrayedInput, fn)
        );
        return this;
    }

    peek(fn: (value:any ) => Type) {
        this.functions.push((arrayedInput: any) =>
            Array.prototype.map.call(arrayedInput, (data) => {
                fn(data);
                return data;
            })
        );
        return this;
    }

    flatmap<U>(fn: (value:any ) => U) {
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


    //TODO fix it
    public stream():any[] {
        const result = this.execute();

        if (null == result) return [];

        if (Array.isArray(result)) return result;
        else return elementAsArray(result);
    }
    public async getAsync() {
        const finalOutput = await this.executeAsync();

        // @ts-ignore
        const asyncResult = getResult(finalOutput);
        return asyncResult;
    }

    public async toAsync() {
        const asyncResult = await this.getAsync();
        return new Optional(asyncResult);
    }

    execute() {

        return executeWith(this.input, this.getFunctions());
    }

    public get() {
        return this.execute();
    }

    public orElse(defaultValue: any) {
        const result = this.execute();
        return result ? result : defaultValue;
    }

    public isPresent() {
        const result = this.execute();
        return result ? true : false;
    }
//(value:any ) => U
    public ifPresent<U>(fn: (value:any ) => U) {
        const result = this.execute();
        if (result) return fn(result);
    }

    public ifPresentOrElse<U>(fn: (value:any ) => U, elseFn: any) {
        const result = this.execute();
        if (result) return fn(result);
        else return elseFn();
    }

    public Optional() {
        const result = this.execute();

        if (null == result) return [];

        if (Array.isArray(result)) return this.input;
        else return elementAsArray(result);
    }

    public static of<Type>(input:Type): Optional<Type> {

        return new Optional(input);
    }
}

