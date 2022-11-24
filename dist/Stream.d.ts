export default class Stream<Type> {
    private input;
    functions: Function[];
    getFunctions(): Function[];
    map(fn: any): this;
    filter(fn: any): this;
    take(n: number): this;
    private pushFunctionToGetDataAt;
    first(): any;
    next(): any;
    nth(n: number): any;
    peek(fn: any): this;
    flatmap(fn: any): this;
    flatten(): this;
    constructor(input: Type);
    executeAsync(): Promise<unknown>;
    execute(): any;
    get(): any;
    toAsync(): Promise<Stream<any>>;
    getAsync(): Promise<any>;
    Stream(): any[] | Type;
    static of<Type>(input: Type): Stream<Type>;
}
