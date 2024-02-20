import { EventTarget } from "cc";
import { ItemController } from "./itemController";
import { EItemControllerEvents } from "../types/eItemControllerEvents";
import { GItemBase } from "../game-items/gItemBase";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { DamageController } from "./damageController";
import { EGItemBaseEvents } from "../game-items/types/gItemBaseEvents";
import { EAtomExplosiveEvents } from "../meta-atoms/types/eAtomExplosiveEvents";
import { EAtomExplosiveDamagePattern } from "../meta-atoms/types/eAtomExplosiveDamagePattern";
import { Coords } from "../coords";
import { EDamageType } from "../meta-atoms/types/eDamageType";
import { CellController } from "./cellController";

// todo: Вынести в отдельный файл
const patterns = {
    [EAtomExplosiveDamagePattern.Petard]: [
        Coords.ZERO,
        Coords.LEFT,
        Coords.RIGHT,
        Coords.TOP,
        Coords.BOTTOM,
    ]
}

export class ExplosionController extends EventTarget {
    constructor(
        private itemController: ItemController,
        private damageController: DamageController,
        private cellController: CellController,
    ) {
        super();

        this.itemController.on(EItemControllerEvents.OnCreateItem, this.OnCreateItem, this);
    }

    private OnCreateItem(item: GItemBase): void {
        if (!item.HasAtom(EAtomType.Explosive)) return;

        const callback = () => {
            this.OnExplosion(item);
        }

        const atomExplosive = item.GetAtom(EAtomType.Explosive);
        atomExplosive.on(EAtomExplosiveEvents.OnExplode, callback);
        
        item.once(EGItemBaseEvents.OnDestroy, () => {
            if (!atomExplosive) return;
            atomExplosive.off(EAtomExplosiveEvents.OnExplode, callback);
            
            if (atomExplosive.isActive) {
                atomExplosive.isActive = false;
                callback();
            }
        })
    }

    private OnExplosion(item: GItemBase): void {
        if (!item.HasAtom(EAtomType.Explosive)) return;
        const atomExplosive = item.GetAtom(EAtomType.Explosive);

        const {damagePattern, damageColorFilter} = atomExplosive;

        if (damagePattern === undefined) throw new Error("No damage pattern for explosion");

        const pattern = patterns[damagePattern];
        if (pattern) {
            if (Array.isArray(pattern)) {
                for (let offsetCoords of pattern) {
                    const targetCoords = item.coords.Clone().Add(offsetCoords);
                    this.damageController.TakeDamage(targetCoords, EDamageType.Booster, 1);
                }
            }
            return;
        }

        switch(damagePattern) {
            case EAtomExplosiveDamagePattern.RocketHorizontal: {
                const maxColumn = this.cellController.maxColumn;

                // destroy booster
                const targetCoords = item.coords;
                this.damageController.TakeDamage(targetCoords, EDamageType.Booster, 1);

                // destroy right
                for (let column = item.coords.column + 1; column < maxColumn; column++) {
                    const targetCoords = new Coords(item.coords.row, column);
                    this.damageController.TakeDamage(targetCoords, EDamageType.Booster, 1);
                }

                // destroy left
                for (let column = item.coords.column - 1; column >= 0; column--) {
                    const targetCoords = new Coords(item.coords.row, column);
                    this.damageController.TakeDamage(targetCoords, EDamageType.Booster, 1);
                }
                break;
            }
        }
    }
}