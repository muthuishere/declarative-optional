
export function elementAsArray(input:any) {
    if (!!input) return [input];
    return [];
}

export  function getResult(arr: any[]) {
    if (arr.length === 0) return null;
    return arr[0];
}

export  function flattenResults(result: any) {
    const isOptional =
        result.hasOwnProperty("input") && result.hasOwnProperty("functions");

    // tslint:disable-next-line: no-console
    console.assert(isOptional, {
        result,
        errorMsg: "flatten should be called with an optional",
    });

    return result.get();
}

export function executeAsyncWith(input:any,functions:Function[] ){
    return functions.reduce(
        (p: Promise<any>, currentFunction: Function) => {
            return p.then((item) => {
                return new Promise((resolve) => {
                    return Promise.resolve(item).then((val) => {
                        const result = val.length > 0 ? currentFunction(val) : val;
                        resolve(Promise.all(result));
                    });
                });
            });
        },
        Promise.resolve(Promise.all(elementAsArray(input)))
    );
}
export function executeWith(input:any,functions:Function[] ){
    const finalOutput = functions.reduce(
        (acc: any, currentFunction: Function) => {
            let value = currentFunction(acc);
            return acc.length > 0 ? value : acc;
        },
        elementAsArray(input)
    );

    return getResult(finalOutput);


}
