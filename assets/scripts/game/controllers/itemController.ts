import { EventTarget } from "cc";
import { EGItemType } from "../game-items/types/eGItemTypes";
import { GItemRegistry } from "../game-items/gItemRegistry";
import { EItemControllerEvents } from "../types/eItemControllerEvents";
import { GItemBase } from "../game-items/gItemBase";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { Coords } from "../coords";
import { AnimationController } from "./animationController";

type ItemTypeFromEnum<Key, Storage extends Record<string, abstract new (...args: any[]) => any>> = Key extends keyof Storage ? InstanceType<Storage[Key]> : never;
/**
 * Events
 * OnCreateItem (item)
 */
export class ItemController extends EventTarget {
    constructor(
        private animationController: AnimationController,
    ) {
        super()
    }
    
    CreateItem<
        Key extends EGItemType, 
        RType = ItemTypeFromEnum<Key, typeof GItemRegistry>
    >(type: Key, coords: Coords): RType {
        if (!type || type in GItemRegistry === false) return;

        // @ts-ignore // TODO: Type error? Need review & fix
        const item: GItemBase = new GItemRegistry[type]();

        item.SetCoords(coords);

        if (item.HasAtom(EAtomType.Color)) {
            item.GetAtom(EAtomType.Color).RandomizeColor();
        }

        this.emit(EItemControllerEvents.OnCreateItem, item);

        this.animationController.TryAnimateSpawn(item);

        return item as RType;
    }
}