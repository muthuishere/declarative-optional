export = Optional;
declare function Optional(input: any): void;
declare class Optional {
    constructor(input: any);
    input: any;
    _functions: any[];
    map: (fn: any) => Optional;
    filter: (fn: any) => Optional;
    peek: (fn: any) => Optional;
    flatmap: (fn: any) => Optional;
    flatten: () => Optional;
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
//# sourceMappingURL=index.d.ts.map