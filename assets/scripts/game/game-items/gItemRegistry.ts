import { GColorItem } from "./gColorItem";
import { GItemPetard } from "./gItemPetard";
import { GItemRainbow } from "./gItemRainbow";
import { GItemHorizontalRocket } from "./gItemRocket";
import { EGItemType } from "./types/eGItemTypes";

export const GItemRegistry = {
    [EGItemType.ColorItem]: GColorItem,
    [EGItemType.PetardItem]: GItemPetard,
    [EGItemType.HorizontalRocketItem]: GItemHorizontalRocket,
    [EGItemType.RainbowItem]: GItemRainbow,
}