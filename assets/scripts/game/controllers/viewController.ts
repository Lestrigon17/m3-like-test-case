import { Button, EventTarget, instantiate } from "cc";
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
import { GameModel } from "../gameModel";
import { EGameModelEvents } from "../types/eGameModeEvents";
import { EViewControllerEvents } from "../types/eViewControllerEvents";


export class ViewController extends EventTarget {
    constructor(
        private viewPrefabStorage: ViewPrefabStorage,
        private viewConfig: ViewConfig,
        private coordsCorrector: CoordsCorrector,
        private animationController: AnimationController,
        private gameModel: GameModel,
    ) {
        super();

        gameModel.on(EGameModelEvents.OnChangeMoves, this.OnChangeMoves, this);
        gameModel.on(EGameModelEvents.OnChangeScore, this.OnChangeScore, this);

        this.viewConfig.movesLeft.string = String(gameModel.movesLeft);
        this.viewConfig.targetScore.string = String(gameModel.targetScore);
        this.viewConfig.currentScore.string = String(gameModel.currentScore);

        this.viewConfig.buttonExit.node.on(Button.EventType.CLICK, this.OnClickExit, this);
        this.viewConfig.buttonBoosterSwap.node.on(Button.EventType.CLICK, this.OnClickBoosterSwap, this);
        this.viewConfig.endGameOverlay.buttonExit.node.on(Button.EventType.CLICK, this.OnClickExit, this);
        this.viewConfig.endGameOverlay.buttonRestart.node.on(Button.EventType.CLICK, this.OnClickRestart, this);
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

    public ShowEndGameOverlay(isWin: boolean): void {
        this.viewConfig.endGameOverlay.UpdateStatus(isWin);
        this.viewConfig.endGameOverlay.node.active = true;
    }


    public Destroy(): void {
        this.gameModel.off(EGameModelEvents.OnChangeMoves, this.OnChangeMoves, this);
        this.gameModel.off(EGameModelEvents.OnChangeScore, this.OnChangeScore, this);

        this.viewConfig.buttonExit?.node.off(Button.EventType.CLICK, this.OnClickExit, this);
        this.viewConfig.buttonBoosterSwap?.node.off(Button.EventType.CLICK, this.OnClickBoosterSwap, this);
        this.viewConfig.endGameOverlay?.buttonExit?.node.off(Button.EventType.CLICK, this.OnClickExit, this);
        this.viewConfig.endGameOverlay?.buttonRestart?.node.off(Button.EventType.CLICK, this.OnClickRestart, this);
    }

    private OnChangeMoves(value: number): void {
        this.viewConfig.movesLeft.string = String(value);
    }
    
    private OnChangeScore(value: number): void {
        this.viewConfig.currentScore.string = String(value);
    }

    private OnClickExit(): void {
        this.emit(EViewControllerEvents.OnClickExit);
    }
    private OnClickBoosterSwap(): void {
        this.emit(EViewControllerEvents.OnClickSwapBooster);
    }
    private OnClickRestart(): void {
        this.emit(EViewControllerEvents.OnClickRestartGame);
    }
}