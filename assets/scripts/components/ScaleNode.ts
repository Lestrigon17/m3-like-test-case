import { _decorator, Component, Node, isValid, UITransform, view, Size, Vec3, Vec2, Enum } from 'cc'; 
const { ccclass, property, executionOrder, executeInEditMode, boolean, integer} = _decorator;

export enum AlignType {
    NONE,
    IN_HORIZONTAL_ORIENTATION,
    IN_VERTICAL_ORIENTATION,
    IN_BOTH_ORIENTATION
}
const ccAlignType = Enum(AlignType);

@ccclass("ScaleNode")
@executionOrder(-9999)
@executeInEditMode(true)
export class ScaleNode extends Component { 
	@property(UITransform) targetUITransform!: UITransform;
    @property(Size) targetViewSize: Size = new Size();
    @property({type: ccAlignType}) alignHeight: AlignType = AlignType.NONE;
    @property(Vec2) alignMarginHorizontal: Vec2 = new Vec2();

    private uiTransformInternal!: UITransform;
    private originalScale!: Vec3;

    public onLoad() {
        this.uiTransformInternal = this.getComponent(UITransform);
        this.originalScale = this.node.scale.clone();
    }

    public onEnable() {
		if (!this.targetUITransform) return;

		this.targetUITransform.node.on(Node.EventType.SIZE_CHANGED, this.onResize, this);
        this.resizeNode();
    }

	public onDisable() {
		if (!this.targetUITransform) return;
		this.targetUITransform.node.off(Node.EventType.SIZE_CHANGED, this.onResize, this);
	}

    public onResize() {
        this.resizeNode();
    }

    private resizeNode() {
		if (!this.targetUITransform) return;
        const selfWidth = (this.targetViewSize.width * this.originalScale.x);
        const selfHeight = (this.targetViewSize.height * this.originalScale.y);
        const ratio = this.targetUITransform.width / this.targetUITransform.height;

        let newScale = this.originalScale;
		
        if (this.targetUITransform.width < selfWidth) {
            newScale = this.originalScale.clone().multiplyScalar(this.targetUITransform.width / selfWidth);
        }

        if (this.targetUITransform.height < selfHeight) {
            newScale = this.originalScale.clone().multiplyScalar(this.targetUITransform.height / selfHeight);
        }

        if (this.alignHeight === AlignType.IN_HORIZONTAL_ORIENTATION && ratio > 1) {
            if (selfHeight + this.alignMarginHorizontal.y < this.targetUITransform.height) {
                const requireScale = Math.min(
                    this.targetUITransform.height / (selfHeight + this.alignMarginHorizontal.y),
                    this.targetUITransform.width / (selfWidth + this.alignMarginHorizontal.x)
                )
                newScale = this.originalScale.clone().multiplyScalar(requireScale);
            }
        }

        if (!this.node.scale.equals(newScale)) {
            this.node.scale = newScale;
        }
    }
}
