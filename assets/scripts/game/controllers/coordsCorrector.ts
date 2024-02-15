import { Component, UITransform, _decorator } from "cc";

const {ccclass, property, requireComponent} = _decorator;

@requireComponent(UITransform)
@ccclass("CoordsCorrector")
export class CoordsCorrector extends Component {
    protected uiTransform!: UITransform;

    protected maxRow: number = 0;
    protected maxColumn: number = 0;

    protected minX: number = 0;
    protected minY: number = 0;

    protected cellSize: number = 100;

    protected onLoad(): void {
        this.uiTransform = this.getComponent(UITransform);
    }

    public SetGridSize(maxRow: number, maxColumn: number): this {
        this.maxRow = maxRow;
        this.maxColumn = maxColumn;

        this.cellSize = this.CalculateCellSize();
        this.UpdateMinimalPositions();

        return this;
    }

    private CalculateCellSize(): number {
        const cellByWidth = Math.floor(this.uiTransform.width / this.maxColumn);
        const cellByHeight = Math.floor(this.uiTransform.height / this.maxRow);

        return Math.min(cellByHeight, cellByWidth);
    }

    private UpdateMinimalPositions(): void {
        const halfCellSize = this.cellSize / 2;
        this.minX = (this.cellSize * this.maxColumn) / 2 * -1 + halfCellSize;
        this.minY = (this.cellSize * this.maxRow) / 2 - halfCellSize;
    }
}