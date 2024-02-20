import { randomRangeInt } from "cc";
import { EGItemColorTypes } from "../game-items/types/eGItemColorTypes";
import { AtomBase } from "./atomBase";
import { EAtomType } from "./types/eAtomType";
import { EAtomColorEvents } from "./types/eAtomColorEvents";

// Table make special for random colors, we exclude some colors from random
const colorsForRandom = [
    EGItemColorTypes.Blue,
    EGItemColorTypes.Green,
    EGItemColorTypes.Purple,
    EGItemColorTypes.Red,
]

/**
 * Events:
 * OnChangeColor (newColor, oldColor)
 */
export class AtomColor extends AtomBase {
    public get color(): EGItemColorTypes        { return this.colorInternal;    }
    public set color(value: EGItemColorTypes)   { 
        this.emit(EAtomColorEvents.OnChangeColor, value, this.colorInternal);
        this.colorInternal = value;
    }

    protected typeInternal: EAtomType = EAtomType.Color;

    private colorInternal: EGItemColorTypes = EGItemColorTypes.Base;

    public RandomizeColor(): void {
        this.color = colorsForRandom[randomRangeInt(0, colorsForRandom.length)];
    }
}