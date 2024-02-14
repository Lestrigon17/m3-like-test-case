import { AtomBase } from "./atomBase";
import { EAtomGravitationEvents } from "./types/eAtomGravitationEvents";
import { EAtomType } from "./types/eAtomType";

/**
 * Events:
 * OnDivingAffectChange (newState, oldState)
 * OnAffectChange (newState, oldState)
 */
export class AtomGravitation extends AtomBase {
    public get isDivingAffect(): boolean { return this.isDivingAffectInternal; }
    public set isDivingAffect(state: boolean) {
        this.emit(EAtomGravitationEvents.OnDivingAffectChange, state, this.isDivingAffectInternal);
        this.isDivingAffectInternal = state;
    }

    public get isAffect(): boolean { return this.isAffectInternal; }
    public set isAffect(state: boolean) {
        this.emit(EAtomGravitationEvents.OnAffectChange, state, this.isAffectInternal);
        this.isAffectInternal = state;
    }

    protected typeInternal: EAtomType = EAtomType.Gravitation;

    private isDivingAffectInternal: boolean = false;
    private isAffectInternal: boolean = true;

    public SetIsAffect(state: boolean): this {
        this.isAffect = state;
        return this;
    }

    public SetIsDivingAffect(state: boolean): this {
        this.isDivingAffect = state;
        return this;
    }
}