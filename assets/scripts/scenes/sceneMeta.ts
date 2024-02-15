import { Button, Component, _decorator } from "cc";
import { Services } from "../services/services";

const {property, ccclass} = _decorator;

@ccclass("SceneMeta")
export class SceneMeta extends Component {
    @property(Button) playButton!: Button;

    protected onEnable(): void {
        this.playButton.node.once(Button.EventType.CLICK, this.OnClickPlayButton, this);
    }

    protected onDisable(): void {
        // this.playButton.node.off(Button.EventType.CLICK, this.OnClickPlayButton, this);
    }

    protected OnClickPlayButton(): void {
        Services.Storage.get(Services.Types.Scene).Run("game")
    }
}