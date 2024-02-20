import { EventTarget } from "cc";
import { CellController } from "./cellController";
import { everyPhysicLayer } from "../gameUtils";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { GameCell } from "../gameCell";

export class GravitationController extends EventTarget {
    constructor(
        private cellController: CellController,
    ) {
        super();
    }

    public MakeIteration(): void {
        everyPhysicLayer(layer => {
            for (let row = this.cellController.maxRow; row > 0; row--) {
                for (let column = 0; column < this.cellController.maxColumn; column++) {
                    const cell = this.cellController.GetCell(row, column);
                    if (!cell) continue;
                    const content = cell.GetContent(layer);
                    if (content) continue;

                    const topCell = this.FindCellWithContentToTop(layer, row, column);
                    if (!topCell) continue;
                    const targetContent = topCell.GetContent(layer);
                    topCell.DeleteContent(layer);
                    cell.SetContent(layer, targetContent);
                }
            }
        })
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