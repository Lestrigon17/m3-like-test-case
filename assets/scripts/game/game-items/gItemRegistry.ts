import { GColorItem } from "./gColorItem";
import { GItemPetard } from "./gItemPetard";
import { EGItemType } from "./types/eGItemTypes";

export const GItemRegistry = {
    [EGItemType.ColorItem]: GColorItem,
    [EGItemType.PetardItem]: GItemPetard,
}