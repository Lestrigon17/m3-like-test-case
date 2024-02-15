import { Component, _decorator, instantiate } from "cc";
import { GameCell } from "../gameCell";
import type { ViewPrefabStorage } from "../ViewPrefabStorage";
import { EGItemType } from "../game-items/types/eGItemTypes";
import { GameCellView } from "../ui-components/gameCellView";
import { ViewConfig } from "../ViewConfig";
import { CoordsCorrector } from "./coordsCorrector";

const {ccclass, property} = _decorator;

export class ViewController extends EventTarget {
    constructor(
        private viewPrefabStorage: ViewPrefabStorage,
        private viewConfig: ViewConfig,
        private coordsCorrector: CoordsCorrector,
    ) {
        super();
    }

    public OnCreateCell(cell: GameCell): void {
        const prefab = this.viewPrefabStorage.cellPrefab;
        if (!prefab) throw new ReferenceError("Can't find prefab for cell!");
        
        const node = instantiate(prefab);
        if (!node) throw new Error("Can't instantiate prefab for cell");

        const component = node.getComponent(GameCellView);
        if (!component) throw new ReferenceError("Can't find component gameCellView in cell node");

        node.setParent(this.viewConfig.fieldCells);
        node.setPosition(this.coordsCorrector.ConvertToPosition(cell.coords));

        component.SetTargetSize(this.coordsCorrector.cellSize);
        cell.AttachView(component);
    }
}