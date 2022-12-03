export default class Optional<Type> {
    private input;
    functions: Function[];
    getFunctions(): Function[];
    map<U>(fn: (value: any) => U): this;
    filter(fn: (value: any) => Boolean): this;
    peek(fn: (value: any) => Type): this;
    flatmap<U>(fn: (value: any) => U): this;
    flatten(): this;
    constructor(input: Type);
    stream(): any[];
    getAsync(): Promise<any>;
    toPromise(): Promise<any>;
    orElseAsync(data: any): Promise<any>;
    toAsync(): Promise<Optional<any>>;
    execute(): any;
    get(): any;
    orElse(defaultValue: any): any;
    isPresent(): boolean;
    ifPresent<U>(fn: (value: any) => U): U;
    ifPresentOrElse<U>(fn: (value: any) => U, elseFn: any): any;
    static of<Type>(input: Type): Optional<Type>;
}
