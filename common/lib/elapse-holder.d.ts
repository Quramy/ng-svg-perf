export declare class ElapseHolder {
    private _referenceValue;
    private _elapses;
    constructor();
    reset(): void;
    start(): this;
    end(): this;
    average(): number;
}
