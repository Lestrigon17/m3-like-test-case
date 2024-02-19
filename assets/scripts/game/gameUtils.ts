import { GColorItem } from "./game-items/gColorItem";
import { GItemBase } from "./game-items/gItemBase";
import { GItemRegistry } from "./game-items/gItemRegistry";
import { EGItemType } from "./game-items/types/eGItemTypes";
import { EColorCombinationType } from "./types/eColorCombinationType";
import { EPhysicLayer } from "./types/ePhysicLayer";

//@ts-ignore //TODO: Type error?
export function isAssignType<Key extends EGItemType>(key: Key, item: GItemBase): item is InstanceType<typeof GItemRegistry[Key]> {
    return item.type === key;
}

const layers = Object.values(EPhysicLayer).filter((v) => !isNaN(Number(v))).reverse() as EPhysicLayer[];
export function everyPhysicLayer(callback: (layer: EPhysicLayer) => void): void {
    layers.forEach(key => callback(key))
}


export function getColorCombination(count: number): EColorCombinationType {
    if (count < 3) return EColorCombinationType.None;
    if (count === 3) return EColorCombinationType.Destroy;
    if (count === 4) return EColorCombinationType.Petard;
    if (count === 5) return EColorCombinationType.Rocket;
    
    return EColorCombinationType.Rainbow;
}