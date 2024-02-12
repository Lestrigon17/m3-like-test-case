import { Coords } from "../coords";
import { EBlockType } from "./types/eBlockLayer";
import { EPhysicLayer } from "./types/ePhysicLayer";
import { ERenderLayer } from "./types/eRenderLayer";

export abstract class GItemBase extends EventTarget {
    public get renderLayer(): ERenderLayer { return this.renderLayerInternal; }
    public get physicLayer(): EPhysicLayer { return this.physicLayerInternal; }

    public coords: Coords = new Coords();

    protected renderLayerInternal: ERenderLayer = ERenderLayer.Base;
    protected physicLayerInternal: EPhysicLayer = EPhysicLayer.Base;
    protected blockFlags: EBlockType = EBlockType.None;
}