import { EventTarget, _decorator } from "cc";
import { EPhysicLayer } from "./types/ePhysicLayer";
import { GItemBase } from "./game-items/gItemBase";
import { Coords } from "./coords";
import { GameCellView } from "./ui-components/gameCellView";
import { AtomContainer } from "./meta-atoms/atomContainer";
import { EAtomType } from "./meta-atoms/types/eAtomType";
import { EAtomDamageableEvents } from "./meta-atoms/types/eAtomDamageableEvents";

export class GameCell extends AtomContainer {
    public get coords(): Coords { return this.coordsInternal; }

    protected storage: Map<EPhysicLayer, GItemBase> = new Map();
    protected coordsInternal: Coords = new Coords();
    protected viewInternal?: GameCellView;

    private dieEvents: Map<EPhysicLayer, () => void | undefined> = new Map();

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

        this.storage.set(physicLayer, content);

        const onDie = () => {
            this.DeleteContent(physicLayer);
        }

        this.dieEvents.set(physicLayer, onDie);
        content.GetAtom(EAtomType.Damageable)?.on(EAtomDamageableEvents.OnDie, onDie);
    }

    public DeleteContent(physicLayer: EPhysicLayer): void {
        const content = this.storage.get(physicLayer);
        if (!content) return;

        const dieEvent = this.dieEvents.get(physicLayer);
        if (dieEvent) {
            content.GetAtom(EAtomType.Damageable)?.off(EAtomDamageableEvents.OnDie, dieEvent);
            this.dieEvents.delete(physicLayer);
        }

        this.storage.delete(physicLayer);
    }
} 