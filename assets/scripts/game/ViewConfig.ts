import { Component, Node, Vec3, _decorator, instantiate } from "cc";
import { ERenderLayer } from "./types/eRenderLayer";

const {ccclass, property} = _decorator;

const FieldGroup = { group: "Field" };

@ccclass("ViewConfig")
export class ViewConfig extends Component {
    @property({type: Node, ...FieldGroup}) fieldMainParent!: Node;
    @property({type: Node, ...FieldGroup}) fieldCells!: Node;
    @property({type: Node, ...FieldGroup}) fieldLayers!: Node;
    @property({type: Node, ...FieldGroup}) fieldTutorial!: Node;
    @property({type: Node, ...FieldGroup}) fieldVFX!: Node;

    private layers: Map<ERenderLayer, Node> = new Map();

    public GetLayerFor(layerLevel: ERenderLayer): Node {
        if (!this.layers.has(layerLevel)) this.CreateLayerFor(layerLevel);
        return this.layers.get(layerLevel)!;
    }

    private CreateLayerFor(layerLevel: ERenderLayer): void {
        const layer = instantiate(new Node(`Layer${layerLevel}`));
        layer.setParent(this.fieldLayers);
        layer.setPosition(Vec3.ZERO);
        layer.setSiblingIndex(layerLevel);
        
        this.layers.set(layerLevel, layer);
    }
}