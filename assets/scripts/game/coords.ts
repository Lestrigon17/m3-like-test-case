export class Coords {
	public static get ZERO(): Coords 	{ return this.zeroInternal		}
	public static get TOP(): Coords 	{ return this.topInternal		}
	public static get BOTTOM(): Coords 	{ return this.bottomInternal	}
	public static get LEFT(): Coords 	{ return this.leftInternal		}
	public static get RIGHT(): Coords 	{ return this.rightInternal 	}

	private static zeroInternal = new Coords(0, 0, true);
	private static topInternal = new Coords(-1, 0, true);
	private static bottomInternal = new Coords(1, 0, true);
	private static leftInternal = new Coords(0, -1, true);
	private static rightInternal = new Coords(0, 1, true);

	public static IsCoords(item: any): item is Coords {
		return item instanceof Coords;
	}

	private static cacheRangeInternal: Map<string, Coords[]> = new Map();

	public static GetOffsetCoords(from: Coords, to: Coords): Coords {
		let offsetRow = from.row === to.row ? 0 : from.row < to.row ? 1 : -1;
		let offsetColumn = from.column === to.column ? 0 : from.column < to.column ? 1 : -1;

		return new Coords(offsetRow, offsetColumn);
	}
    
	public static GetRange(from: Coords, to: Coords, ignoreCache?: boolean): Coords[] {
		let cacheID = `${from.row}:${from.column}-${to.row}${to.column}`;

		if (!ignoreCache && Coords.cacheRangeInternal.has(cacheID)) return Coords.cacheRangeInternal.get(cacheID)!;

		let coordsList: Coords[] = [];
		
		let minRow: number = from.row <= to.row ? from.row : to.row;
		let maxRow: number = from.row <= to.row ? to.row : from.row;

		let minColumn: number = from.column <= to.column ? from.column : to.column;
		let maxColumn: number = from.column <= to.column ? to.column : from.column;

		for (let row = minRow; row <= maxRow; row++) {
			for (let column = minColumn; column <= maxColumn; column++) {
				coordsList.push(new Coords(row, column));
			}	
		}

		Coords.cacheRangeInternal.set(cacheID, coordsList);
		return coordsList;
	}
	public static GetDistance(from: Coords, to: Coords): number {
		let distanceRow = Math.abs(from.row - to.row);
		let distanceColumn = Math.abs(from.column - to.column);

		return Math.sqrt(distanceRow ^ 2 + distanceColumn ^ 2);
	}

    public get column(): number { return this.columnInternal; }
    public set column(value: number) {
        if (this.isDisableMutation) return;
        this.columnInternal = value;
    }

    public get row(): number { return this.rowInternal; }
    public set row(value: number) {
        if (this.isDisableMutation) return;
        this.rowInternal = value;
    }

    private columnInternal: number = 0;
    private rowInternal: number = 0;
    private isDisableMutation: boolean = false;

    constructor(row: number = 0, column: number = 0, isDisableMutation: boolean = false) {
        this.rowInternal = row;
        this.columnInternal = column;
        this.isDisableMutation = isDisableMutation;
    }

    public Clone(): Coords {
        return new Coords(this.rowInternal, this.columnInternal);
    }

    public Add(coords_or_row: Coords | number, column?: number): this {
        if (typeof coords_or_row === "number") {
            this.rowInternal += coords_or_row;

            if (column !== undefined) {
                this.columnInternal += column
            }

            return this;
        } 

        this.columnInternal += coords_or_row.column;
        this.rowInternal += coords_or_row.row;

        return this;
    }

	public ToString(): string {
		return `\n:: Coords - row [${this.rowInternal}] & column [${this.columnInternal}] \n`;
	}
    
    public isEqual(coords: Coords): boolean {
        return this.row === coords.row && this.column === coords.column;
    }
}