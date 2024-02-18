import { EGItemType } from "../game-items/types/eGItemTypes";
import { gItemColorView } from "./gItemColorView";

export const GameViewsRegistry = {
    [EGItemType.ColorItem]: gItemColorView
}