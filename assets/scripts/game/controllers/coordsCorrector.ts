import { Component, UITransform, Vec3, _decorator } from "cc";
import { Coords } from "../coords";

const {ccclass, property, requireComponent} = _decorator;

@requireComponent(UITransform)
@ccclass("CoordsCorrector")
export class CoordsCorrector extends Component {
    public get cellSize(): number { return this.cellSizeInternal; }
    protected uiTransform!: UITransform;

    protected maxRow: number = 0;
    protected maxColumn: number = 0;

    protected minX: number = 0;
    protected minY: number = 0;

    protected cellSizeInternal: number = 100;

    protected onLoad(): void {
        this.uiTransform = this.getComponent(UITransform);
    }

    public SetGridSize(maxRow: number, maxColumn: number): this {
        this.maxRow = maxRow;
        this.maxColumn = maxColumn;

        this.cellSizeInternal = this.CalculateCellSize();
        this.UpdateMinimalPositions();

        return this;
    }

    // Надо оптимизировать вычесления и вынести в статику
	public ConvertToPosition(coords: Coords, toWorldSpace?: boolean): Vec3 {
		let currentX: number = 	this.minX
								+ coords.column * this.cellSizeInternal;
		let currentY: number = 	this.minY
								- coords.row * this.cellSizeInternal;

		const relativePos = new Vec3(
			currentX,
			currentY,
			0
		);
		
		if (!toWorldSpace) return relativePos;
		
		return this.uiTransform.convertToWorldSpaceAR(relativePos);
	}

	public ConvertFromPosition(position: Vec3): Coords | null {
		let coordinateRow: number = 
			Math.abs( Math.floor( (position.y - this.minY) / this.cellSizeInternal ) );

		let coordinateColumn: number = 
			Math.abs( Math.floor( ( position.x - this.minX )  / this.cellSizeInternal ) );

		return new Coords(coordinateRow, coordinateColumn);
	}


    private CalculateCellSize(): number {
        const cellByWidth = Math.floor(this.uiTransform.width / this.maxColumn);
        const cellByHeight = Math.floor(this.uiTransform.height / this.maxRow);

        return Math.min(cellByHeight, cellByWidth);
    }

    private UpdateMinimalPositions(): void {
        const halfCellSize = this.cellSizeInternal / 2;
        this.minX = (this.cellSizeInternal * this.maxColumn) / 2 * -1 + halfCellSize;
        this.minY = (this.cellSizeInternal * this.maxRow) / 2 - halfCellSize;
    }
    
}