import { EventTarget, _decorator } from "cc";
import { EPhysicLayer } from "./types/ePhysicLayer";
import { GItemBase } from "./game-items/gItemBase";
import { Coords } from "./coords";
import { GameCellView } from "./ui-components/gameCellView";

export class GameCell extends EventTarget {
    public get coords(): Coords { return this.coordsInternal; }

    protected storage: Map<EPhysicLayer, GItemBase> = new Map();
    protected coordsInternal: Coords = new Coords();
    protected viewInternal?: GameCellView;

    public AttachView(view: GameCellView) {
        this.viewInternal = view;
    }

    public GetCoords(): Coords {
        return this.coordsInternal;
    }

    public SetCoords(coords_or_row: Coords | number, column?: number): this {
        if (Coords.IsCoords(coords_or_row)) {
            this.coordsInternal.row = coords_or_row.row;
            this.coordsInternal.column = coords_or_row.column;
        } else {
            this.coordsInternal.row = coords_or_row;
            this.coordsInternal.column = column;
        }

        return this;
    }
} 