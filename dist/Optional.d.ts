export default class Optional<Type> {
    private input;
    functions: Function[];
    getFunctions(): Function[];
    map(fn: any): this;
    filter(fn: any): this;
    peek(fn: any): this;
    flatmap(fn: any): this;
    flatten(): this;
    constructor(input: Type);
    executeAsync(): Promise<unknown>;
    stream(): any[] | Type;
    getAsync(): Promise<any>;
    toAsync(): Promise<Optional<any>>;
    execute(): any;
    get(): any;
    orElse(defaultValue: any): any;
    isPresent(): boolean;
    ifPresent(fn: Function): any;
    ifPresentOrElse(fn: Function, elseFn: Function): any;
    Optional(): any[] | Type;
    static of<Type>(input: Type): Optional<Type>;
}
