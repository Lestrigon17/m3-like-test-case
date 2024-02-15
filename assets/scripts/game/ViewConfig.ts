import { Component, Node, _decorator } from "cc";

const {ccclass, property} = _decorator;

const FieldGroup = { group: "Field" };

@ccclass("ViewConfig")
export class ViewConfig extends Component {
    @property({type: Node, ...FieldGroup}) fieldMainParent!: Node;
    @property({type: Node, ...FieldGroup}) fieldCells!: Node;
    @property({type: Node, ...FieldGroup}) fieldLayers!: Node;
    @property({type: Node, ...FieldGroup}) fieldTutorial!: Node;
    @property({type: Node, ...FieldGroup}) fieldVFX!: Node;
        
}