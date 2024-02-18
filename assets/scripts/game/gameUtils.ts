import { GColorItem } from "./game-items/gColorItem";
import { GItemBase } from "./game-items/gItemBase";
import { GItemRegistry } from "./game-items/gItemRegistry";
import { EGItemType } from "./game-items/types/eGItemTypes";
import { EPhysicLayer } from "./types/ePhysicLayer";

//@ts-ignore //TODO: Type error?
export function isAssignType<Key extends EGItemType>(key: Key, item: GItemBase): item is InstanceType<typeof GItemRegistry[Key]> {
    return item.type === key;
}

export function everyPhysicLayer(callback: (layer: EPhysicLayer) => void): void {
    const keys = Object.values(EPhysicLayer).filter((v) => !isNaN(Number(v))) as EPhysicLayer[];
    keys.forEach(key => callback(key))
}