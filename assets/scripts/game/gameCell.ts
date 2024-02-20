import { EventTarget, _decorator } from "cc";
import { EPhysicLayer } from "./types/ePhysicLayer";
import { GItemBase } from "./game-items/gItemBase";
import { Coords } from "./coords";
import { GameCellView } from "./ui-components/gameCellView";
import { AtomContainer } from "./meta-atoms/atomContainer";
import { EAtomType } from "./meta-atoms/types/eAtomType";
import { EAtomDamageableEvents } from "./meta-atoms/types/eAtomDamageableEvents";
import { EBlockType } from "./types/eBlockLayer";
import { EGameCellEvents } from "./types/eGameCellEvents";
import { EGItemBaseEvents } from "./game-items/types/gItemBaseEvents";

export class GameCell extends AtomContainer {
    public get coords(): Coords { return this.coordsInternal; }

    protected storage: Map<EPhysicLayer, GItemBase> = new Map();
    protected coordsInternal: Coords = new Coords();
    protected viewInternal?: GameCellView;

    private dieEvents: Map<EPhysicLayer, () => void | undefined> = new Map();
    private blockEvents: Map<EPhysicLayer, () => void | undefined> = new Map();

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

    public HasContent(physicLayer: EPhysicLayer): boolean {
        return this.storage.has(physicLayer);
    }

    public GetContent(physicLayer: EPhysicLayer): GItemBase | undefined {
        return this.storage.get(physicLayer);
    }

    public SetContent(physicLayer: EPhysicLayer, content: GItemBase): void {
        if (this.HasContent(physicLayer)) throw Error("Can't attach content to duty layer");

        if (!content.IsBlockedBy(EBlockType.Animation)) {
            content.SetCoords(this.coords);
        }

        this.storage.set(physicLayer, content);

        const onDie = () => {
            this.DeleteContent(physicLayer);
        }
        const OnBlockDelete = () => {
            this.emit(EGameCellEvents.OnContentStateChanged);
        }

        this.dieEvents.set(physicLayer, onDie);
        this.blockEvents.set(physicLayer, OnBlockDelete);

        content.GetAtom(EAtomType.Damageable)?.on(EAtomDamageableEvents.OnDie, onDie);
        content.on(EGItemBaseEvents.OnBlockDelete, OnBlockDelete);

        this.emit(EGameCellEvents.OnSetContent, content);
    }

    public DeleteContent(physicLayer: EPhysicLayer): void {
        const content = this.storage.get(physicLayer);
        if (!content) return;

        const dieEvent = this.dieEvents.get(physicLayer);
        if (dieEvent) {
            content.GetAtom(EAtomType.Damageable)?.off(EAtomDamageableEvents.OnDie, dieEvent);
            this.dieEvents.delete(physicLayer);
        }

        const blockEvent = this.blockEvents.get(physicLayer);
        if (blockEvent) {
            content.off(EGItemBaseEvents.OnBlockDelete, blockEvent);
        }


        this.storage.delete(physicLayer);
        this.emit(EGameCellEvents.OnDeleteContent);
    }
} 