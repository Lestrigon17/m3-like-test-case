import { Enum, SpriteFrame, _decorator } from "cc";
import { EGItemColorTypes } from "../game-items/types/eGItemColorTypes";

const {ccclass, property} = _decorator;

const colorEnum = Enum(EGItemColorTypes)

@ccclass("ColorSpriteFrameData")
export class ColorSpriteFrameData {
    @property({type: colorEnum}) type: EGItemColorTypes = EGItemColorTypes.Blue;
    @property(SpriteFrame) spriteFrame!: SpriteFrame;
}