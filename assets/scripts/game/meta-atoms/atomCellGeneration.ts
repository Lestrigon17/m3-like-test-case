import { EGItemType } from "../game-items/types/eGItemTypes";
import { AtomBase } from "./atomBase";
import { EAtomType } from "./types/eAtomType";

export class AtomCellGeneration extends AtomBase {
    protected typeInternal: EAtomType = EAtomType.CellGeneration;

    private chanceRules: Map<EGItemType, number> = new Map();

    /**
     * Chance for generation item
     * @param itemType 
     * @param chance Value must be between 0 and 1
     */
    public SetChanceFor(itemType: EGItemType, chance: number): void {
        chance = Math.min(Math.max(chance, 0), 1);
        this.chanceRules.set(itemType, chance);
    }

    public GetChanceFor(itemType: EGItemType): number {
        if (!this.chanceRules.has(itemType)) return 0;
        return this.chanceRules.get(itemType);
    }
}