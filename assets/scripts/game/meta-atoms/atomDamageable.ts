import { AtomBase } from "./atomBase";
import { EAtomDamageableEvents } from "./types/eAtomDamageableEvents";
import { EDamageType } from "./types/eDamageType";
/**
 * Events:
 * OnHeal ( healValue, lastHealth, newHealth)
 * OnDamageTaken ( damage, lastHealth, newHealth)
 */
export class AtomDamageable extends AtomBase {
    public get isAlive(): boolean { return this.healthInternal > 0; }
    public get health(): number { return this.healthInternal; }
    public set health(value: number) { this.healthInternal = value; }

    private healthInternal: number = 0;
    private damageFilters: Map<EDamageType, boolean> = new Map();
    private divingDamageRules: Map<EDamageType, boolean> = new Map();

    public Heal( value: number ): this {
        value = Math.ceil(Math.max(value, 0));

        this.emit(EAtomDamageableEvents.OnHeal, value, this.healthInternal, this.healthInternal + value);

        this.healthInternal += value;

        return this;
    }

    public SetFilterDamage(damageType: EDamageType, isAllowed: boolean): this {
        this.damageFilters.set(damageType, isAllowed);
        return this;
    }

    public SetDivingDamage(damageType: EDamageType, isAllowed: boolean): this {
        this.divingDamageRules.set(damageType, isAllowed);
        return this;
    }

    public IsDivingDamage(damageType: EDamageType): boolean {
        if (damageType === EDamageType.Root) return true;
        return !!this.divingDamageRules.get(damageType);
    }

    public IsAllowedDamage( damageType: EDamageType ): boolean {
        if (damageType === EDamageType.Root) return true;
        return !!this.damageFilters.get(damageType);
    }

    public TakeDamage( damageType: EDamageType, value: number): void {
        if (!this.IsAllowedDamage(damageType)) return;
        if (value < 0) return;
        
        const lastHealth = this.healthInternal;
        value = Math.ceil(value);
        this.healthInternal = Math.max(this.healthInternal - value, 0);

        this.emit(EAtomDamageableEvents.OnDamageTaken, value, lastHealth, this.healthInternal);

        if (this.isAlive === false) {
            this.emit(EAtomDamageableEvents.OnDie);
        }
    }

}