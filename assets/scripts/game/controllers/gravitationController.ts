import { EventTarget } from "cc";
import { CellController } from "./cellController";
import { everyPhysicLayer } from "../gameUtils";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { GameCell } from "../gameCell";
import { AnimationController } from "./animationController";

export class GravitationController extends EventTarget {
    constructor(
        private cellController: CellController,
        private animationController: AnimationController,
    ) {
        super();
    }

    public MakeIteration(): void {
        everyPhysicLayer(layer => {
            for (let row = this.cellController.maxRow; row > 0; row--) {
                for (let column = 0; column < this.cellController.maxColumn; column++) {
                    const targetCell = this.cellController.GetCell(row, column);
                    if (!targetCell) continue;
                    const content = targetCell.GetContent(layer);
                    if (content) continue;

                    const attackerCell = this.FindCellWithContentToTop(layer, row, column);
                    if (!attackerCell) continue;
                    const targetContent = attackerCell.GetContent(layer);
                    attackerCell.DeleteContent(layer);

                    this.animationController.TryAnimateMoveTo(targetContent, attackerCell, targetCell);

                    targetCell.SetContent(layer, targetContent);
                }
            }
        })
    }

    public IsRequireNextIteration(): boolean {
        const layer = EPhysicLayer.Tiles;
        
        for (let row = this.cellController.maxRow; row > 0; row--) {
            for (let column = 0; column < this.cellController.maxColumn; column++) {
                const cell = this.cellController.GetCell(row, column);
                if (!cell) continue;
                const content = cell.GetContent(layer);
                if (content) continue;
                
                const attackerCell = this.FindCellWithContentToTop(layer, row, column);
                if (!attackerCell) continue;

                return true;
            }
        }

        return false;
    }

    private FindCellWithContentToTop(layer: EPhysicLayer, fromRow: number, fromColumn: number): GameCell | undefined {
        for (let row = (fromRow - 1); row >= 0; row--) {
            const cell = this.cellController.GetCell(row, fromColumn);
            if (!cell) return;
            
            const content = cell.GetContent(layer);
            if (!content) continue;
            if (content.isBlocked) return;
            return cell;
        }

        return;
    }
}