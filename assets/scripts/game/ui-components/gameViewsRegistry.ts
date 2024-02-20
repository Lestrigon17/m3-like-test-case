import { EGItemType } from "../game-items/types/eGItemTypes";
import { gItemColorView } from "./gItemColorView";
import { GItemHorizontalRocketView } from "./gItemHorizontalRocketView";
import { GItemPetardView } from "./gItemPetardView";

export const GameViewsRegistry = {
    [EGItemType.ColorItem]: gItemColorView,
    [EGItemType.PetardItem]: GItemPetardView,
    [EGItemType.HorizontalRocketItem]: GItemHorizontalRocketView,
}