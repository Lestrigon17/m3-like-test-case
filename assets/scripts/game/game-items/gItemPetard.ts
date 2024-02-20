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

export class GItemPetard extends GItemBase {
    protected renderLayerInternal: ERenderLayer = ERenderLayer.Tiles;
    protected physicLayerInternal: EPhysicLayer = EPhysicLayer.Tiles;

    protected typeInternal: EGItemType = EGItemType.PetardItem;

    protected declare viewInternal?: gItemColorView;

    constructor() {
        super();

        this.AddAtom(
            new AtomRegistry[EAtomType.Damageable]()
                .SetHealth(1)
                .SetFilterDamage(EDamageType.Booster, true)
        )

        this.GetAtom(EAtomType.Damageable)
            .on(EAtomDamageableEvents.OnDie, this.Destroy, this);

        this.AddAtom(
            new AtomRegistry[EAtomType.Gravitation]()
                .SetIsAffect(true)
                .SetIsDivingAffect(true)
        )

        this.AddAtom(
            new AtomRegistry[EAtomType.Animation]()
        )
    }

    protected OnDestroy(): void {
        this.GetAtom(EAtomType.Damageable).off(EAtomDamageableEvents.OnDie, this.Destroy, this);

        this.viewInternal?.node.destroy();
    }
    
    protected OnAttachView(): void {
        console.log(this.viewInternal)
    }
}