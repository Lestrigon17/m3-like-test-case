import { CCObject, Node } from "cc";
import { Coords } from "../coords";
import { EBlockType } from "../types/eBlockLayer";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { ERenderLayer } from "../types/eRenderLayer";
import { EGItemBaseEvents } from "./types/gItemBaseEvents";
import { EGItemType } from "./types/eGItemTypes";
import { AtomContainer } from "../meta-atoms/atomContainer";

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
        this.OnDestroy();
    }

    public AttachView(view: CCObject) {
        this.viewInternal = view;
        this.OnAttachView();
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

    protected OnDestroy(): void {}
    protected OnAttachView(): void {}
}
