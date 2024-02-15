import { Component, _decorator } from "cc";
import { Services } from "../services/services";

const {property, ccclass} = _decorator;

@ccclass("SceneStart")
export class SceneStart extends Component {
    protected onEnable(): void {
        console.log(Services.Storage.get(Services.Types.Scene))

        Services.Storage.get(Services.Types.Scene).Run("meta")
    }
}