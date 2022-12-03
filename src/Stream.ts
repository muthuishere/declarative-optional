import { executeAsyncWith, executeWith, flattenResults } from "./shared";

export default class Stream<Type> {
  functions: Function[] = [];

  getFunctions(): Function[] {
    return this.functions;
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
  public async getAsync() {
    const finalOutput = await executeAsyncWith(
      formatInput(this.input),
      this.getFunctions()
    );
    // result should always be array
    return finalOutput;
  }

  public async toAsync() {
    const asyncResult = await this.getAsync();
    // @ts-ignore
    return new Stream(formatInput(asyncResult));
  }

  take(n: number) {
    this.functions.push((arrayedInput: any) =>
      Array.prototype.filter.call(arrayedInput, (element, index) => index < n)
    );
    return this;
  }

  skip(n: number) {
    this.functions.push((arrayedInput: any) =>
      Array.prototype.filter.call(
        arrayedInput,
        (element, index) => index > n - 1
      )
    );
    return this;
  }

  private pushFunctionToGetDataAt(n: number) {
    this.functions.push((arrayedInput: any) =>
      Array.prototype.filter.call(
        arrayedInput,
        (element, index) => index === n - 1
      )
    );
  }
  public first() {
    this.pushFunctionToGetDataAt(1);
    return this;
  }
  public last() {
    this.functions.push((arrayedInput: any) =>
      Array.prototype.filter.call(
        arrayedInput,
        (element, index, arr) => index === arr.length - 1
      )
    );
    return this;
  }
  public nth(n: number) {
    this.pushFunctionToGetDataAt(n);
    return this;
  }

  public static of(input: any[]) {
    return new Stream(input);
  }
  constructor(private input: any[]) {}
  map<U>(fn: (value: any) => U) {
    this.functions.push((arrayedInput: any) =>
      Array.prototype.map.call(arrayedInput, fn)
    );
    return this;
  }
  execute() {
    return executeWith(formatInput(this.input), this.getFunctions());
  }

  public get() {
    return this.execute();
  }
}
function formatInput(input: any) {
  if (undefined === input || null === input) return [];

  if (Array.isArray(input) === false) {
    // tslint:disable-next-line: no-console
    console.warn("input is not an array,converting as array");
    return [input];
  }
  return input;
}
