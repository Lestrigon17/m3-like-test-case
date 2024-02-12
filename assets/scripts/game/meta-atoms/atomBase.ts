import { EventTarget } from "cc";
import { EAtomType } from "./types/eAtomType";

export abstract class AtomBase extends EventTarget {
    public get type(): EAtomType { return this.typeInternal; }

    protected typeInternal: EAtomType;
}