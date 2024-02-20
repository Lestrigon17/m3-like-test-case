import { Button, Component, Node, _decorator } from "cc";

const {ccclass, property} = _decorator;

@ccclass("EndGameOverlay")
export class EndGameOverlay extends Component {
    @property(Node) statusWin!: Node;
    @property(Node) statusLose!: Node;
    @property(Button) buttonRestart!: Button;
    @property(Button) buttonExit!: Button;

    protected onLoad(): void {
        this.node.active = false;
    }

    UpdateStatus(isWin: boolean) {
        this.statusWin.active = isWin;
        this.statusLose.active = !isWin;
    }
}