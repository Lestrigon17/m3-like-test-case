import { Component, Sprite, UITransform, _decorator } from "cc";

const {property, ccclass} = _decorator;

@ccclass("GameCellView")
export class GameCellView extends Component {
    @property(UITransform) uiTransform!: UITransform;
    @property(Sprite) background!: Sprite;
}