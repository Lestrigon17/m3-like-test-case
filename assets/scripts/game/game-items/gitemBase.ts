import { EventTarget, Node } from "cc";
import { Coords } from "../coords";
import { EBlockType } from "../types/eBlockLayer";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { ERenderLayer } from "../types/eRenderLayer";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { AtomBase } from "../meta-atoms/atomBase";
import { AtomRegistry } from "../meta-atoms/atomRegistry";
import { EGItemBaseEvents } from "./types/gItemBaseEvents";
import { EGItemType } from "./types/eGItemTypes";

type AtomTypeFromEnum<Key, Storage extends Record<string, abstract new (...args: any[]) => any>> = Key extends keyof Storage ? InstanceType<Storage[Key]> : never;

/**
 * Events:
 * OnChangeCoords (oldCoordsClone, newCoordsClone)
 * OnBlockSet (blockType)
 * OnBlockDelete (blockType)
 */
export abstract class GItemBase extends EventTarget {
    public get renderLayer(): ERenderLayer  { return this.renderLayerInternal;  }
    public get physicLayer(): EPhysicLayer  { return this.physicLayerInternal;  }

	public get isBlocked(): boolean 		{ return this.blockFlags !== EBlockType.None; 	}
	public get block(): EBlockType 			{ return this.blockFlags; 		    }
    public get type(): EGItemType            { return this.typeInternal;         }

    protected renderLayerInternal: ERenderLayer = ERenderLayer.Base;
    protected physicLayerInternal: EPhysicLayer = EPhysicLayer.Base;

    protected blockFlags: EBlockType = EBlockType.None;
    protected coordsInternal: Coords = new Coords();

	protected atomAttachmentsInternal: Map<EAtomType, AtomBase> = new Map();
    protected viewInternal?: Node;

    protected typeInternal: EGItemType = EGItemType.BaseItem;

    constructor() {
        super();
    }

    public AttachView(view: Node) {
        this.viewInternal = view;
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

    public HasAtom(type: EAtomType): boolean {
        return this.atomAttachmentsInternal.has(type);
    }

    public GetAtom<
        Key extends EAtomType, 
        RType = AtomTypeFromEnum<Key, typeof AtomRegistry>
    >(type: Key): RType {
        if (!type || type in AtomRegistry === false) return undefined;
        
        return this.atomAttachmentsInternal.get(type) as RType;
    }

    public AddAtom(instance: AtomBase): this {
        if (!instance) return undefined; //TODO: Make throw ReferenceError
        if (this.atomAttachmentsInternal.has(instance.type)) return undefined; // TODO: Make throw Error because we have atom in storage

        this.atomAttachmentsInternal.set(instance.type, instance);
        
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
}
