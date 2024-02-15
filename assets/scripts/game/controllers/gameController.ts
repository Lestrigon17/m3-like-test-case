import { Component, _decorator } from "cc";
import { ViewPrefabStorage } from "../ViewPrefabStorage";
import { CellController } from "./cellController";
import { ViewConfig } from "../ViewConfig";

const {ccclass, property} = _decorator;

@ccclass("GameController")
export class GameController extends Component {
    @property(ViewPrefabStorage) viewPrefabStorage!: ViewPrefabStorage;
    @property(ViewConfig) viewConfig!: ViewConfig;

    private cellController: CellController;

    protected onLoad(): void {
        // Cell controller
        this.cellController = new CellController();
        this.cellController.SetGridSize(10, 10);
        this.cellController.CreateCells();
    }
}