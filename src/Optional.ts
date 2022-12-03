import { executeAsyncWith, executeWith, flattenResults } from "./shared";

export default class Optional<Type> {
  functions: Function[] = [];

  getFunctions(): Function[] {
    return this.functions;
  }
  map<U>(fn: (value: any) => U) {
    this.functions.push((arrayedInput: any) =>
      Array.prototype.map.call(arrayedInput, fn)
    );
    return this;
  }

  filter(fn: (value: any) => Boolean) {
    this.functions.push((arrayedInput: any) =>
      Array.prototype.filter.call(arrayedInput, fn)
    );
    return this;
  }

  peek(fn: (value: any) => void) {
    this.functions.push((arrayedInput: any) =>
      Array.prototype.map.call(arrayedInput, (data) => {
        fn(data);
        return data;
      })
    );
    return this;
  }

  flatmap<U>(fn: (value: any) => U) {
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
  constructor(private input: Type) {}
  public stream(): any[] {
    // tslint:disable-next-line: no-console
    console.warn("stream deprecated , will be removed in 3.x");
    const result = this.execute();

    if (undefined === result || null === result) return [];

    if (Array.isArray(result)) return result;
    else return formatInput(result);
  }
  public async getAsync() {
    return await this.toPromise();
  }
  public async toPromise() {
    const finalOutput = await executeAsyncWith(
      formatInput(this.input),
      this.getFunctions()
    );

    // @ts-ignore
    const asyncResult = getSingleResult(finalOutput);
    return asyncResult;
  }

  public async orElseAsync(data: any) {
    try {
      const asyncResult = await this.getAsync();
      return asyncResult;
    } catch (e) {
      return data;
    }
  }

  public async toAsync() {
    const asyncResult = await this.getAsync();
    return new Optional(asyncResult);
  }

  execute() {
    const result = executeWith(formatInput(this.input), this.getFunctions());
    return getSingleResult(result);
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

  public ifPresent<U>(fn: (value: any) => U) {
    const result = this.execute();
    if (result) return fn(result);
  }

  public ifPresentOrElse<U>(fn: (value: any) => U, elseFn: any) {
    const result = this.execute();
    if (result) return fn(result);
    else return elseFn();
  }

  public static of<Type>(input: Type): Optional<Type> {
    return new Optional(input);
  }
}

function formatInput(input: any) {
  if (!!input) return [input];
  return [];
}
function getSingleResult(arr: any[]) {
  if (arr.length === 0) return null;
  return arr[0];
}
