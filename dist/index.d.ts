export = Optional;
declare function Optional(input: any): void;
declare class Optional {
    constructor(input: any);
    input: any;
    functionChainer: FunctionChainer;
    getFunctions: () => any[];
    executeAsync(): any;
    getAsync(): Promise<any>;
    toAsync(): Promise<Optional>;
    execute(): any;
    get(): any;
    orElse(defaultValue: any): any;
    isPresent(): boolean;
    ifPresent(fn: any): any;
    ifPresentOrElse(fn: any, elseFn: any): any;
    stream(): any;
}
declare namespace Optional {
    function of(input: any): Optional;
}
declare function FunctionChainer(obj: any): void;
declare class FunctionChainer {
    constructor(obj: any);
    functions: any[];
}
//# sourceMappingURL=index.d.ts.map