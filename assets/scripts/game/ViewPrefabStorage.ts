import { Component, Enum, Prefab, _decorator } from "cc";
import { EGItemType } from "./game-items/types/eGItemTypes";

const {ccclass, property} = _decorator;

const gameItemsEnum = Enum(EGItemType);

@ccclass("ViewPrefabStorageData")
class ViewPrefabStorageData {
    @property({type: gameItemsEnum}) type: EGItemType = EGItemType.BaseItem;
    @property(Prefab) prefab!: Prefab;
}

@ccclass("ViewPrefabStorage")
export class ViewPrefabStorage extends Component {
    @property([ViewPrefabStorageData]) prefabs: ViewPrefabStorageData[] = [];
    @property(Prefab) cellPrefab!: Prefab;
}