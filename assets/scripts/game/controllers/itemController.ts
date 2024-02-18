import { EventTarget } from "cc";
import { EGItemType } from "../game-items/types/eGItemTypes";
import { GItemRegistry } from "../game-items/gItemRegistry";
import { EItemControllerEvents } from "../types/eItemControllerEvents";

type ItemTypeFromEnum<Key, Storage extends Record<string, abstract new (...args: any[]) => any>> = Key extends keyof Storage ? InstanceType<Storage[Key]> : never;
/**
 * Events
 * OnCreateItem (item)
 */
export class ItemController extends EventTarget {
    CreateItem<
        Key extends EGItemType, 
        RType = ItemTypeFromEnum<Key, typeof GItemRegistry>
    >(type: Key): RType {
        if (!type || type in GItemRegistry === false) return;

        // @ts-ignore // TODO: Type error? Need review & fix
        const item: RType = new GItemRegistry[type]();

        this.emit(EItemControllerEvents.OnCreateItem, item);

        return item;
    }
}