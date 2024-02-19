import { Component, EventTouch, Node, UITransform, Vec3, _decorator } from "cc";
import { CoordsCorrector } from "./coordsCorrector";
import { Coords } from "../coords";
import { ECursorControllerEvents } from "../types/eCursorControllerEvents";

const {ccclass, property, requireComponent} = _decorator;

/**
 * Events
 * OnCursorClick (targetCoords)
 */
@ccclass("CursorController")
@requireComponent(UITransform)
export class CursorController extends Component {
    @property(CoordsCorrector) coordsCorrector!: CoordsCorrector;

    private uiTransform!: UITransform;

    protected onLoad(): void {
        this.uiTransform = this.getComponent(UITransform);
    }

    protected onEnable(): void {
        this.node.on(Node.EventType.TOUCH_END, this.OnCursorClick, this);
    }

    protected onDisable(): void {
        this.node.off(Node.EventType.TOUCH_END, this.OnCursorClick, this);
    }

    private OnCursorClick(ev: EventTouch): void {
        const location = ev.getUILocation();
        const localPos = this.uiTransform.convertToNodeSpaceAR(new Vec3(location.x, location.y, 0));
        const targetCoords = this.coordsCorrector.ConvertFromPosition(localPos);

        this.node.emit(ECursorControllerEvents.OnCursorClick, targetCoords);
    }
}