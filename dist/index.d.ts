export default class Optional<Type> {
    private input;
    map: any;
    filter: any;
    peek: any;
    flatmap: any;
    flatten: any;
    functions: Function[];
    getFunctions(): Function[];
    constructor(input: Type);
    executeAsync(): Promise<unknown>;
    getAsync(): Promise<any>;
    toAsync(): Promise<Optional<any>>;
    execute(): any;
    get(): any;
    orElse(defaultValue: any): any;
    isPresent(): boolean;
    ifPresent(fn: Function): any;
    ifPresentOrElse(fn: Function, elseFn: Function): any;
    stream(): any[] | Type;
    static of<Type>(input: Type): Optional<Type>;
}
