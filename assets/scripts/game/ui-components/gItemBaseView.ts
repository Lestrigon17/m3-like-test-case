import { Component, UITransform, Vec3, _decorator } from "cc";

const {ccclass, property} = _decorator;

@ccclass("GItemBaseView")
export class GItemBaseView extends Component {
    @property(UITransform) uiTransform!: UITransform;

    public get targetScale(): number { return this.targetScaleInternal; }

    protected targetScaleInternal: number = 0;
    protected referenceSize: number = 0;

    protected onLoad(): void {
        this.referenceSize = this.uiTransform.width;
        this.uiTransform.height = this.uiTransform.width;
    }

    public SetTargetSize(size: number): void {
        const targetScale = size / this.referenceSize;
        this.targetScaleInternal = targetScale;
        this.node.setScale(new Vec3(targetScale, targetScale, 1));
    }
}