import { Button, Component, Label, Node, Vec3, _decorator, instantiate } from "cc";
import { ERenderLayer } from "./types/eRenderLayer";

const {ccclass, property} = _decorator;

const FieldGroup = { group: "Field" };
const UIGroup = { group: "UI" };

@ccclass("ViewConfig")
export class ViewConfig extends Component {
    @property({type: Node, ...FieldGroup}) fieldMainParent!: Node;
    @property({type: Node, ...FieldGroup}) fieldCells!: Node;
    @property({type: Node, ...FieldGroup}) fieldLayers!: Node;
    @property({type: Node, ...FieldGroup}) fieldTutorial!: Node;
    @property({type: Node, ...FieldGroup}) fieldVFX!: Node;

    @property({type: Label, ...UIGroup}) currentScore!: Label;
    @property({type: Label, ...UIGroup}) targetScore!: Label;
    @property({type: Label, ...UIGroup}) movesLeft!: Label;
    @property({type: Button, ...UIGroup}) buttonBoosterSwap!: Button;
    @property({type: Button, ...UIGroup}) buttonExit!: Button;

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