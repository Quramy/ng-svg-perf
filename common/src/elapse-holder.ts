export class ElapseHolder {
  private _referenceValue: number;
  private _elapses: number[] = [];
  constructor(private ignoreCount: number = 10) { }

  reset() {
    this._elapses = [];
  }

  start() {
    this._referenceValue = Date.now();
    return this;
  }

  end() {
    if(!this._referenceValue) return this;
    const elapse = Date.now() - this._referenceValue;
    this._elapses.push(elapse);
    return this;
  }

  average(): number {
    if(this._elapses.length < this.ignoreCount) return NaN;
    return this._elapses
    .filter((e, i) => i >= this.ignoreCount)
    .reduce((s, e) => {
      return s + e;
    }, 0) / (this._elapses.length - this.ignoreCount);
  }
}

