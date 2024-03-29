import { CCObject, Node } from "cc";
import { Coords } from "../coords";
import { EBlockType } from "../types/eBlockLayer";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { ERenderLayer } from "../types/eRenderLayer";
import { EGItemBaseEvents } from "./types/gItemBaseEvents";
import { EGItemType } from "./types/eGItemTypes";
import { AtomContainer } from "../meta-atoms/atomContainer";
import { GItemBaseView } from "../ui-components/gItemBaseView";

/**
 * Events:
 * OnChangeCoords (oldCoordsClone, newCoordsClone)
 * OnBlockSet (blockType)
 * OnBlockDelete (blockType)
 */
export abstract class GItemBase extends AtomContainer {
    public get renderLayer(): ERenderLayer  { return this.renderLayerInternal;  }
    public get physicLayer(): EPhysicLayer  { return this.physicLayerInternal;  }

	public get isBlocked(): boolean 		{ return this.blockFlags !== EBlockType.None; 	}
	public get block(): EBlockType 			{ return this.blockFlags; 		    }
    public get type(): EGItemType           { return this.typeInternal;         }
    public get coords(): Coords             { return this.coordsInternal;       }
    public get view(): undefined | GItemBaseView { return this.viewInternal as GItemBaseView;         }

    protected renderLayerInternal: ERenderLayer = ERenderLayer.Base;
    protected physicLayerInternal: EPhysicLayer = EPhysicLayer.Base;

    protected blockFlags: EBlockType = EBlockType.None;
    protected coordsInternal: Coords = new Coords();

    protected viewInternal?: CCObject;

    protected typeInternal: EGItemType = EGItemType.BaseItem;

    constructor() {
        super();
    }

    public Destroy(): void {
        this.emit(EGItemBaseEvents.OnDestroy);
        this.OnDestroy();
    }

    public AttachView(view: CCObject) {
        this.viewInternal = view;
        this.OnAttachView();
    }

    public DeAttachView() {
        this.viewInternal = undefined;
        this.OnDeAttachView();
    }

	public IsBlockedBy(blockType: EBlockType): boolean {
		return !!(this.blockFlags & blockType);
	}

	public SetBlockBy(blockType: EBlockType): this {
		if (this.IsBlockedBy(blockType)) return this;

		this.blockFlags = this.blockFlags | blockType;
        this.emit(EGItemBaseEvents.OnBlockSet, blockType);

        return this;
	}

	public DeleteBlockBy(blockType: EBlockType): this {
		if (!this.IsBlockedBy(blockType)) return this;

		this.blockFlags = this.blockFlags ^ blockType;
        this.emit(EGItemBaseEvents.OnBlockDelete, blockType);

        return this;
	}

    public GetCoords(): Coords {
        return this.coordsInternal;
    }

    public SetCoords(coords: Coords): this {
        this.emit(EGItemBaseEvents.OnChangeCoords, this.coordsInternal.Clone(), coords.Clone());

        this.coordsInternal.row = coords.row;
        this.coordsInternal.column = coords.column;

        return this;
    }

    public MoveTo(coords: Coords): this {
        return this;
    }

    protected OnDestroy(): void {}
    protected OnAttachView(): void {}
    protected OnDeAttachView(): void {}
}
