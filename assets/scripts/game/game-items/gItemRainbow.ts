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
import { GItemRainbowView } from "../ui-components/gItemRainbowView";
import { EAtomColorEvents } from "../meta-atoms/types/eAtomColorEvents";
import { EGItemColorTypes } from "./types/eGItemColorTypes";

export class GItemRainbow extends GItemBase {
    protected renderLayerInternal: ERenderLayer = ERenderLayer.Tiles;
    protected physicLayerInternal: EPhysicLayer = EPhysicLayer.Tiles;

    protected typeInternal: EGItemType = EGItemType.RainbowItem;

    protected declare viewInternal?: GItemRainbowView;

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
            new AtomRegistry[EAtomType.Color]()
        )

        this.AddAtom(
            new AtomRegistry[EAtomType.Animation]()
        )

        this.AddAtom(
            new AtomRegistry[EAtomType.Explosive]()
                .SetDamagePattern(EAtomExplosiveDamagePattern.Rainbow)
                .AttachAtomDamageable(this.GetAtom(EAtomType.Damageable))
        )

        this.AddAtom(
            new AtomRegistry[EAtomType.Interaction]()
        )

        this.GetAtom(EAtomType.Interaction).on(EAtomInteractionEvents.OnDoInteract, this.OnInteract, this);
        this.GetAtom(EAtomType.Color).on(EAtomColorEvents.OnChangeColor, this.OnChangeColor, this);
    }

    protected OnDestroy(): void {
        this.GetAtom(EAtomType.Color).off(EAtomColorEvents.OnChangeColor, this.OnChangeColor, this);
        this.GetAtom(EAtomType.Damageable).off(EAtomDamageableEvents.OnDie, this.Destroy, this);
        this.GetAtom(EAtomType.Interaction).off(EAtomInteractionEvents.OnDoInteract, this.OnInteract, this);

        this.viewInternal?.node.destroy();
    }

    private OnChangeColor(newColor: EGItemColorTypes, oldColor: EGItemColorTypes): void {
        if (this.HasAtom(EAtomType.Explosive)) {
            this.GetAtom(EAtomType.Explosive).SetDamageColorFilter(newColor);
        }

        if (!this.viewInternal) return;

        this.viewInternal.SetViewColor(newColor);
    }

    protected OnAttachView(): void {
        const colorAtom = this.GetAtom(EAtomType.Color);
        if (colorAtom.color === EGItemColorTypes.Base) return;

        this.viewInternal.SetViewColor(colorAtom.color);
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