import { GColorItem } from "./gColorItem";
import { GItemBase } from "./gItemBase";
import { GItemRegistry } from "./gItemRegistry";
import { EGItemType } from "./types/eGItemTypes";

//@ts-ignore //TODO: Type error?
export function isAssignType<Key extends EGItemType>(key: Key, item: GItemBase): item is InstanceType<typeof GItemRegistry[Key]> {
    return item.type === key;
}