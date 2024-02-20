import { instantiate } from "cc";
import { GameCell } from "../gameCell";
import type { ViewPrefabStorage } from "../ViewPrefabStorage";
import { GameCellView } from "../ui-components/gameCellView";
import { ViewConfig } from "../ViewConfig";
import { CoordsCorrector } from "./coordsCorrector";
import { GItemBase } from "../game-items/gItemBase";
import { GameViewsRegistry } from "../ui-components/gameViewsRegistry";
import { GItemBaseView } from "../ui-components/gItemBaseView";
import { EGItemBaseEvents } from "../game-items/types/gItemBaseEvents";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { EAtomDamageableEvents } from "../meta-atoms/types/eAtomDamageableEvents";
import { AnimationController } from "./animationController";


export class ViewController extends EventTarget {
    constructor(
        private viewPrefabStorage: ViewPrefabStorage,
        private viewConfig: ViewConfig,
        private coordsCorrector: CoordsCorrector,
        private animationController: AnimationController,
    ) {
        super();
    }

    public OnCreateCell(cell: GameCell): void {
        const prefab = this.viewPrefabStorage.cellPrefab;
        if (!prefab) throw new ReferenceError("Can't find prefab for cell!");
        
        const node = instantiate(prefab);
        if (!node) throw new Error("Can't instantiate prefab for cell");

        const component = node.getComponent(GameCellView);
        if (!component) throw new ReferenceError("Can't find component gameCellView in cell node");

        node.setParent(this.viewConfig.fieldCells);
        node.setPosition(this.coordsCorrector.ConvertToPosition(cell.coords));

        component.SetTargetSize(this.coordsCorrector.cellSize);
        cell.AttachView(component);
    }

    public OnCreateGameItem(item: GItemBase): void {
        if (item.type in GameViewsRegistry === false) return;
        
        const prefab = this.viewPrefabStorage.prefabs.find(data => data.type === item.type)?.prefab;
        if (!prefab) throw new ReferenceError(`Can't find prefab for ${item.type}!`);
        
        const node = instantiate(prefab);
        if (!node) throw new Error(`Can't instantiate prefab for ${item.type}!`);
        
        const component: GItemBaseView = node.getComponent(GameViewsRegistry[item.type]);
        if (!component) throw new ReferenceError(`Can't find target component for ${item.type}`);

        node.setParent(this.viewConfig.GetLayerFor(item.renderLayer));
        node.setPosition(this.coordsCorrector.ConvertToPosition(item.coords));

        component.SetTargetSize(this.coordsCorrector.cellSize);
        item.AttachView(component);

        const onChangeCoords = (oldCoords, newCoords) => {
            node.setPosition(this.coordsCorrector.ConvertToPosition(newCoords));
        }
        item.on(EGItemBaseEvents.OnChangeCoords, onChangeCoords);

        if (item.HasAtom(EAtomType.Damageable)) {
            item.GetAtom(EAtomType.Damageable).once(EAtomDamageableEvents.OnDie, () => {
                const isHaveAnimation = this.animationController.TryAnimateDestroy(item);
                if (isHaveAnimation) {
                    item.once(EGItemBaseEvents.OnBlockDelete, () => {
                        item.view?.node.destroy();
                        item.DeAttachView();
                    })
                } else {
                    item.view?.node.destroy();
                    item.DeAttachView();
                }
                item.off(EGItemBaseEvents.OnChangeCoords, onChangeCoords);
            })
        }
    }
}