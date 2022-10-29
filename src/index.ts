export default class Optional<Type> {
  map: any;
  filter: any;
  peek: any;
  flatmap: any;
  flatten: any;
  functions: Function[] = [];

  getFunctions(): Function[] {
    return this.functions;
  }
  constructor(private input: Type) {
    this.map = (fn: any) => {
      this.functions.push((arrayedInput: any) =>
        Array.prototype.map.call(arrayedInput, fn)
      );
      return this;
    };
    this.filter = (fn: any) => {
      this.functions.push((arrayedInput: any) =>
        Array.prototype.filter.call(arrayedInput, fn)
      );
      return this;
    };
    this.peek = (fn: any) => {
      this.functions.push((arrayedInput: any) =>
        Array.prototype.map.call(arrayedInput, (data) => {
          fn(data);
          return data;
        })
      );
      return this;
    };

    this.flatmap = (fn: any) => {
      this.functions.push((arrayedInput: any) =>
        Array.prototype.map.call(arrayedInput, fn)
      );
      this.functions.push((arrayedInput: any) =>
        Array.prototype.map.call(arrayedInput, flattenOptional)
      );

      return this;
    };
    this.flatten = () => {
      this.functions.push((arrayedInput: any) =>
        Array.prototype.map.call(arrayedInput, flattenOptional)
      );
      return this;
    };
  }

  public executeAsync() {
    return this.getFunctions().reduce(
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
      Promise.resolve(Promise.all(elementAsArray(this.input)))
    );
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
    const finalOutput = this.getFunctions().reduce(
      (acc: any, currentFunction: Function) => {
        let value = currentFunction(acc);
        return acc.length > 0 ? value : acc;
      },
      elementAsArray(this.input)
    );

    return getResult(finalOutput);
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

  public ifPresent(fn: Function) {
    const result = this.execute();
    if (result) return fn(result);
  }

  public ifPresentOrElse(fn: Function, elseFn: Function) {
    const result = this.execute();
    if (result) return fn(result);
    else return elseFn();
  }

  public stream() {
    const result = this.execute();

    if (null == result) return [];

    if (Array.isArray(result)) return this.input;
    else return elementAsArray(result);
  }

  public static of<Type>(input: Type) {
    return new Optional(input);
  }
}

function elementAsArray(input: any) {
  const arr = [];
  if (!!input) arr.push(input);
  return arr;
}

function getResult(arr: any[]) {
  if (arr.length === 0) return null;
  return arr[0];
}

function flattenOptional(result: any) {
  const isOptional =
    result.hasOwnProperty("input") && result.hasOwnProperty("functions");

  // tslint:disable-next-line: no-console
  console.assert(isOptional, {
    result,
    errorMsg: "flatten should be called with an optional",
  });

  return result.get();
}
