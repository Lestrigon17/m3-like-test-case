import { Component, Sprite, _decorator } from "cc";
import { ColorSpriteFrameData } from "./ColorSpriteFrameData";
import { EGItemColorTypes } from "../game-items/types/eGItemColorTypes";
import { GItemBaseView } from "./gItemBaseView";
import { EColorCombinationType } from "../types/eColorCombinationType";

const {ccclass, property} = _decorator;

@ccclass("gItemColorView")
export class gItemColorView extends GItemBaseView {
    @property(Sprite) background!: Sprite;
    @property(Sprite) iconDestroy!: Sprite;
    @property(Sprite) iconBomb!: Sprite;
    @property(Sprite) iconPetard!: Sprite;
    @property(Sprite) iconRocket!: Sprite;
    @property(Sprite) iconRainbow!: Sprite;

    @property([ColorSpriteFrameData]) backgroundColors: ColorSpriteFrameData[] = [];
    @property([ColorSpriteFrameData]) iconDestroyColors: ColorSpriteFrameData[] = [];

    protected color: EGItemColorTypes;

    public SetViewColor(color: EGItemColorTypes): this {
        this.color = color;

        // Possible error if wrong config in cocos prefab
        this.background.spriteFrame = 
            this.backgroundColors.find(item => item.type === color)?.spriteFrame ?? this.background.spriteFrame;
        // Possible error if wrong config in cocos prefab
        this.iconDestroy.spriteFrame = 
            this.iconDestroyColors.find(item => item.type === color)?.spriteFrame ?? this.iconDestroy.spriteFrame;

        return this;
    }

    // TODO: Вынести в ENUM, не считать тут
    public SetAvailableCombinationState(type: EColorCombinationType): void {
        this.iconDestroy.node.active = type === EColorCombinationType.Destroy;
        this.iconPetard.node.active = type === EColorCombinationType.Petard;
        this.iconRocket.node.active = type === EColorCombinationType.Rocket;
        this.iconRainbow.node.active = type === EColorCombinationType.Rainbow;
    }

    protected onLoad(): void {
        super.onLoad();
        this.iconDestroy.node.active = false;
        this.iconBomb.node.active = false;
        this.iconPetard.node.active = false;
        this.iconRocket.node.active = false;
        this.iconRainbow.node.active = false;
    }
}