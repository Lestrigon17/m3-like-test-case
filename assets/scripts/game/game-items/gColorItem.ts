import { AtomRegistry } from "../meta-atoms/atomRegistry";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { EDamageType } from "../meta-atoms/types/eDamageType";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { ERenderLayer } from "../types/eRenderLayer";
import { GItemBase } from "./gItemBase";
import { EGItemType } from "./types/eGItemTypes";

export class GColorItem extends GItemBase {
    protected renderLayerInternal: ERenderLayer = ERenderLayer.Tiles;
    protected physicLayerInternal: EPhysicLayer = EPhysicLayer.Tiles;

    protected typeInternal: EGItemType = EGItemType.ColorItem;

    constructor() {
        super();

        this.AddAtom(
            new AtomRegistry[EAtomType.Damageable]()
                .SetHealth(1)
                .SetFilterDamage(EDamageType.Booster, true)
                .SetFilterDamage(EDamageType.Combination, true)
        )

        this.AddAtom(
            new AtomRegistry[EAtomType.Gravitation]()
                .SetIsAffect(true)
                .SetIsDivingAffect(true)
        )
    }
}