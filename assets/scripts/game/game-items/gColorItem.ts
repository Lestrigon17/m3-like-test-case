import { Node } from "cc";
import { AtomRegistry } from "../meta-atoms/atomRegistry";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { EDamageType } from "../meta-atoms/types/eDamageType";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { ERenderLayer } from "../types/eRenderLayer";
import { GItemBase } from "./gItemBase";
import { EGItemType } from "./types/eGItemTypes";
import { gItemColorView } from "../ui-components/gItemColorView";
import { EAtomColorEvents } from "../meta-atoms/types/eAtomColorEvents";
import { EGItemColorTypes } from "./types/eGItemColorTypes";
import { getColorCombination } from "../gameUtils";
import { EAtomDamageableEvents } from "../meta-atoms/types/eAtomDamageableEvents";

export class GColorItem extends GItemBase {
    protected renderLayerInternal: ERenderLayer = ERenderLayer.Tiles;
    protected physicLayerInternal: EPhysicLayer = EPhysicLayer.Tiles;

    protected typeInternal: EGItemType = EGItemType.ColorItem;

    protected declare viewInternal?: gItemColorView;

    constructor() {
        super();

        this.AddAtom(
            new AtomRegistry[EAtomType.Damageable]()
                .SetHealth(1)
                .SetFilterDamage(EDamageType.Booster, true)
                .SetFilterDamage(EDamageType.Combination, true)
        )

        this.GetAtom(EAtomType.Damageable)
            .on(EAtomDamageableEvents.OnDie, this.Destroy, this);

        this.AddAtom(
            new AtomRegistry[EAtomType.Gravitation]()
                .SetIsAffect(true)
                .SetIsDivingAffect(true)
        )

        this.AddAtom(
            new AtomRegistry[EAtomType.Color]()
        )

        this.GetAtom(EAtomType.Color).on(EAtomColorEvents.OnChangeColor, this.OnChangeColor, this);
    }

    public SetAvailableCombinations(count: number): void {
        if (!this.viewInternal) return;
        this.viewInternal.SetAvailableCombinationState(getColorCombination(count));
    }

    protected OnDestroy(): void {
        this.GetAtom(EAtomType.Color).off(EAtomColorEvents.OnChangeColor, this.OnChangeColor, this);
        this.GetAtom(EAtomType.Damageable).off(EAtomDamageableEvents.OnDie, this.Destroy, this);

        this.viewInternal?.node.destroy();
    }

    private OnChangeColor(newColor: EGItemColorTypes, oldColor: EGItemColorTypes): void {
        if (!this.viewInternal) return;

        this.viewInternal.SetViewColor(newColor);
    }

    protected OnAttachView(): void {
        const colorAtom = this.GetAtom(EAtomType.Color);
        if (colorAtom.color === EGItemColorTypes.Base) return;

        this.viewInternal.SetViewColor(colorAtom.color);
    }


}