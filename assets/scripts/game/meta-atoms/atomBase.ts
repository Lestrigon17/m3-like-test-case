import { EventTarget } from "cc";
import { EAtomType } from "./types/eAtomType";

export abstract class AtomBase extends EventTarget {
    public get isActive(): boolean      { return this.isActiveInternal;     }
    public set isActive(value: boolean) { this.isActiveInternal = value;    }
    
    public get type(): EAtomType        { return this.typeInternal;         }

    protected typeInternal: EAtomType;
    protected isActiveInternal: boolean = true;
}