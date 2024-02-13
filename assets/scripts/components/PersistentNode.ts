import { _decorator, Component, Node, game, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('PersistentNode')
export class PersistentNode extends Component {
    start() {
        director.addPersistRootNode(this.node);
        console.debug("[PERSIST] Added", this.node.name, "node");
    }
}
