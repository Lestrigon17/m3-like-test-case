import { EventTarget } from "cc";
import { CellController } from "./cellController";
import { Coords } from "../coords";
import { EDamageType } from "../meta-atoms/types/eDamageType";
import { everyPhysicLayer } from "../gameUtils";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { GameModel } from "../gameModel";

export class DamageController extends EventTarget {
    constructor(
        private cellController: CellController,
        private gameModel: GameModel,
    ) {
        super();
    }

    public TakeDamage(coords: Coords, damageType: EDamageType, amount: number) {
        const cell = this.cellController.GetCell(coords);
        if (!cell) return; // TODO: error exception

        let damageLeft = amount;

        everyPhysicLayer(layer => {
            if (damageLeft === 0) return;

            const content = cell.GetContent(layer);
            if (!content) return;
            if (content.isBlocked) return;

            const damageableAtom = content.GetAtom(EAtomType.Damageable);
            if (!damageableAtom) return;
            if (!damageableAtom.IsAllowedDamage(damageType)) {
                if (!damageableAtom.IsDivingDamage(damageType)) {
                    damageLeft = 0;
                }
                return;
            }

            let originalDamageLeft = damageLeft;
            if (damageableAtom.health < damageLeft) {
                damageLeft -= damageableAtom.health;
            }

            damageableAtom.TakeDamage(damageType, originalDamageLeft);

            if (!damageableAtom.isAlive) {
                if (content.HasAtom(EAtomType.Score)) {
                    this.gameModel.currentScore += content.GetAtom(EAtomType.Score).points;
                }
            }
        })
    }
}