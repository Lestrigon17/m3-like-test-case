import { Component, Sprite, _decorator } from "cc";
import { GItemBaseView } from "./gItemBaseView";
import { ColorSpriteFrameData } from "./ColorSpriteFrameData";
import { EGItemColorTypes } from "../game-items/types/eGItemColorTypes";


const {ccclass, property} = _decorator;

@ccclass("GItemRainbowView")
export class GItemRainbowView extends GItemBaseView {
    @property(Sprite) icon!: Sprite;
    @property([ColorSpriteFrameData]) iconColors: ColorSpriteFrameData[] = [];
    
    protected color: EGItemColorTypes;

    public SetViewColor(color: EGItemColorTypes): this {
        this.color = color;

        this.icon.spriteFrame = 
            this.iconColors.find(item => item.type === color)?.spriteFrame ?? this.icon.spriteFrame;

        return this;
    }
}