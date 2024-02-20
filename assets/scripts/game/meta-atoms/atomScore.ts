import { AtomBase } from "./atomBase"
import { EAtomType } from "./types/eAtomType";

export class AtomScore extends AtomBase {
    public get points(): number { return this.pointsInternal; }
    
    protected typeInternal: EAtomType = EAtomType.Score;

    private pointsInternal: number = 1;

    public SetPoints(value: number): this {
        this.pointsInternal = value;
        return this;
    }
}