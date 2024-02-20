import { EventTarget } from "cc";
import { CellController } from "./cellController";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { EGItemType } from "../game-items/types/eGItemTypes";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { ItemController } from "./itemController";
import { GameCell } from "../gameCell";
import { EGameCellEvents } from "../types/eGameCellEvents";

export class SpawnController extends EventTarget {
    constructor(
        private spawnType: EGItemType,
        private cellController: CellController,
        private itemController: ItemController,
    ) {
        super();
    }

    private spawnCellStorage: GameCell[] = [];

    public Initialize() {
        this.cellController.EveryCoords((row, column) => {
            const cell = this.cellController.GetCell(row, column);
            if (!cell) return;
            
            const generationAtom = cell.GetAtom(EAtomType.CellGeneration);
            if (!generationAtom) return;

            this.spawnCellStorage.push(cell);

            cell.on(EGameCellEvents.OnDeleteContent, this.TryGenerateItems, this);
            
            // const item = this.itemController.CreateItem(this.spawnType, cell.coords);
            // cell.SetContent(item.physicLayer, item);
        })
    }

    private TryGenerateItems(): void {
        console.log(1231231)
        this.spawnCellStorage.forEach((cell) => {
            if (cell.HasContent(EPhysicLayer.Tiles)) return;

            const item = this.itemController.CreateItem(this.spawnType, cell.coords);
            cell.SetContent(item.physicLayer, item);
        })
    }
}