import { EventTarget } from "cc";
import { GameCell } from "../gameCell";
import { ECellControllerEvents } from "../types/eCellControllerEvents";
import { EGItemType } from "../game-items/types/eGItemTypes";
import { Coords } from "../coords";

import type { ItemController } from "./itemController";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { GItemBase } from "../game-items/gItemBase";

export class CellController extends EventTarget {
    public get storage(): Array<GameCell[]> { return this.storageInternal; }

    protected storageInternal: Array<GameCell[]> = [];
    protected maxRow: number = 0;
    protected maxColumn: number = 0;

    constructor(
        private itemController: ItemController
    ) {
        super();
    }

    public SetGridSize(maxRow: number, maxColumn: number): this {
        this.maxRow = maxRow;
        this.maxColumn = maxColumn;

        for (let row = 0; row < maxRow; row++) {
            this.storageInternal[row] ??= [];
        }

        return this;
    }

    public CreateCells(): this {
        this.EveryCoords((row, column) => {
            const cell = new GameCell();
            cell.SetCoords(row, column);
            
            this.storageInternal[row][column] = cell;
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

    public FillField(itemType: EGItemType): void {
        this.EveryCoords((row, column) => {
            const item = this.itemController.CreateItem(itemType, new Coords(row, column));

            this.storageInternal[row][column].SetContent(item.physicLayer, item);
        });
    }

    public GetCell(coords_or_row: Coords | number, column?: number): undefined | GameCell {
        if (Coords.IsCoords(coords_or_row)) {
            return this.storageInternal[coords_or_row.row]?.[coords_or_row.column];
        }

        return this.storageInternal[coords_or_row]?.[column ?? 0];
    }
}