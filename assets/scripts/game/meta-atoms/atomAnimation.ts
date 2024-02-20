import { AtomBase } from "./atomBase";
import { EAtomType } from "./types/eAtomType";

export class AtomAnimation extends AtomBase {
    protected typeInternal: EAtomType = EAtomType.Animation;
}