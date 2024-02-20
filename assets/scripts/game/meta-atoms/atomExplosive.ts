import { EGItemColorTypes } from "../game-items/types/eGItemColorTypes";
import { AtomBase } from "./atomBase"
import { AtomDamageable } from "./atomDamageable";
import { EAtomDamageableEvents } from "./types/eAtomDamageableEvents";
import { EAtomExplosiveDamagePattern } from "./types/eAtomExplosiveDamagePattern";
import { EAtomExplosiveEvents } from "./types/eAtomExplosiveEvents";
import { EAtomType } from "./types/eAtomType"

export class AtomExplosive extends AtomBase {
    public get damagePattern(): undefined | EAtomExplosiveDamagePattern {
        return this.damagePatternInternal;
    }
    public get damageColorFilter(): undefined | EGItemColorTypes {
        return this.damageColorFilterInternal;
    }

    protected typeInternal: EAtomType = EAtomType.Explosive;

    private damagePatternInternal?: EAtomExplosiveDamagePattern;
    private damageColorFilterInternal?: EGItemColorTypes;
    private atomDamageable?: AtomDamageable;

    SetDamageColorFilter(color: EGItemColorTypes): this {
        this.damageColorFilterInternal = color;
        return this;
    }

    SetDamagePattern(pattern: EAtomExplosiveDamagePattern): this {
        this.damagePatternInternal = pattern;
        return this;
    }

    AttachAtomDamageable(atom: AtomDamageable): this {
        this.atomDamageable = atom;
        atom.on(EAtomDamageableEvents.OnDie, this.Explode, this);
        return this;
    }

    public Explode(): void {
        this.isActive = false;
        
        if (this.atomDamageable) {
            this.atomDamageable.off(EAtomDamageableEvents.OnDie, this.Explode, this);
        }

        this.emit(EAtomExplosiveEvents.OnExplode);
    }
}