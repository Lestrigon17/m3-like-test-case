import { AtomRegistry } from "../meta-atoms/atomRegistry";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { EDamageType } from "../meta-atoms/types/eDamageType";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { ERenderLayer } from "../types/eRenderLayer";
import { GItemBase } from "./gItemBase";
import { EGItemType } from "./types/eGItemTypes";
import { gItemColorView } from "../ui-components/gItemColorView";
import { EAtomDamageableEvents } from "../meta-atoms/types/eAtomDamageableEvents";
import { EAtomExplosiveDamagePattern } from "../meta-atoms/types/eAtomExplosiveDamagePattern";
import { EAtomInteractionEvents } from "../meta-atoms/types/eAtomInteractionEvents";
import { GItemHorizontalRocketView } from "../ui-components/gItemHorizontalRocketView";

export class GItemHorizontalRocket extends GItemBase {
    protected renderLayerInternal: ERenderLayer = ERenderLayer.Tiles;
    protected physicLayerInternal: EPhysicLayer = EPhysicLayer.Tiles;

    protected typeInternal: EGItemType = EGItemType.HorizontalRocketItem;

    protected declare viewInternal?: GItemHorizontalRocketView;

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

        this.AddAtom(
            new AtomRegistry[EAtomType.Explosive]()
                .SetDamagePattern(EAtomExplosiveDamagePattern.RocketHorizontal)
                .AttachAtomDamageable(this.GetAtom(EAtomType.Damageable))
        )

        this.AddAtom(
            new AtomRegistry[EAtomType.Interaction]()
        )

        this.GetAtom(EAtomType.Interaction).on(EAtomInteractionEvents.OnDoInteract, this.OnInteract, this);
    }

    protected OnDestroy(): void {
        this.GetAtom(EAtomType.Damageable).off(EAtomDamageableEvents.OnDie, this.Destroy, this);
        this.GetAtom(EAtomType.Interaction).off(EAtomInteractionEvents.OnDoInteract, this.OnInteract, this);

        this.viewInternal?.node.destroy();
    }
    
    private OnInteract(): void {
        if (this.HasAtom(EAtomType.Interaction)) {
            const atomInteraction = this.GetAtom(EAtomType.Interaction)
            atomInteraction.off(EAtomInteractionEvents.OnDoInteract, this.OnInteract, this);
            atomInteraction.isActive = false;
        }

        if (this.HasAtom(EAtomType.Explosive)) {
            this.GetAtom(EAtomType.Explosive).Explode();
        }
    }
}