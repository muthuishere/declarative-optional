export default class Stream<Type> {
    private input;
    functions: Function[];
    getFunctions(): Function[];
    filter(fn: (value: any) => Boolean): this;
    peek(fn: (value: any) => Type): this;
    flatmap<U>(fn: (value: any) => U): this;
    flatten(): this;
    getAsync(): Promise<unknown>;
    toAsync(): Promise<Stream<unknown>>;
    take(n: number): this;
    skip(n: number): this;
    private pushFunctionToGetDataAt;
    first(): this;
    last(): this;
    nth(n: number): this;
    static of(input: any[]): Stream<unknown>;
    constructor(input: any[]);
    map<U>(fn: (value: any) => U): this;
    execute(): any;
    get(): any;
}
