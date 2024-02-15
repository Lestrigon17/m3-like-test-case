import { EventTarget } from "cc";
import { GameCell } from "../gameCell";
import { ECellControllerEvents } from "../types/eCellControllerEvents";

export class CellController extends EventTarget {
    protected storage: Array<GameCell[]> = [];
    protected maxRow: number = 0;
    protected maxColumn: number = 0;

    public SetGridSize(maxRow: number, maxColumn: number): this {
        this.maxRow = maxRow;
        this.maxColumn = maxColumn;

        for (let row = 0; row < maxRow; row++) {
            this.storage[row] ??= [];
        }

        return this;
    }

    public CreateCells(): this {
        this.EveryCoords((row, column) => {
            const cell = new GameCell();
            cell.SetCoords(row, column);
            
            this.storage[row][column] = cell;
            this.emit(ECellControllerEvents.OnCreateCell, cell, row, column);
        })
        return this;
    }

    public EveryCoords(callback: (row: number, column: number) => void): void {
        for (let row = 0; row < this.maxRow; row++) {
            for (let column = 0; column < this.maxColumn; column++) {
                callback(row, column);
            }
        }
    }
}