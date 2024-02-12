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