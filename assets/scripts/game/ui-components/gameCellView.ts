import { Component, Sprite, UITransform, Vec3, _decorator } from "cc";

const {property, ccclass} = _decorator;

@ccclass("GameCellView")
export class GameCellView extends Component {
    @property(UITransform) uiTransform!: UITransform;
    @property(Sprite) background!: Sprite;

    protected referenceSize: number = 0;

    protected onLoad(): void {
        this.referenceSize = this.uiTransform.width;
        this.uiTransform.height = this.uiTransform.width;
    }

    public SetTargetSize(size: number): void {
        const targetScale = size / this.referenceSize;
        this.node.setScale(new Vec3(targetScale, targetScale, 1));
    }
}