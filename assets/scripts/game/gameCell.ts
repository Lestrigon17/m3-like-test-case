import { EventTarget, _decorator } from "cc";
import { EPhysicLayer } from "./types/ePhysicLayer";
import { GItemBase } from "./game-items/gItemBase";
import { Coords } from "./coords";
import { GameCellView } from "./ui-components/gameCellView";

export class GameCell extends EventTarget {
    protected storage: Map<EPhysicLayer, GItemBase> = new Map();
    protected coords: Coords = new Coords();
    protected view?: GameCellView;
} 