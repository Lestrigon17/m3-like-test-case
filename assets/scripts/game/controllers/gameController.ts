import { Component, _decorator } from "cc";
import { ViewPrefabStorage } from "../ViewPrefabStorage";
import { CellController } from "./cellController";
import { ViewConfig } from "../ViewConfig";
import { CoordsCorrector } from "./coordsCorrector";
import { ECellControllerEvents } from "../types/eCellControllerEvents";
import { ViewController } from "./viewController";
import { AtomRegistry } from "../meta-atoms/atomRegistry";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { EGItemType } from "../game-items/types/eGItemTypes";
import { ItemController } from "./itemController";
import { EItemControllerEvents } from "../types/eItemControllerEvents";
import { ColorCombinationController } from "./colorCombinationController";
import { EPhysicLayer } from "../types/ePhysicLayer";
import { everyPhysicLayer, getColorCombination, isAssignType } from "../gameUtils";
import { CursorController } from "./cursorController";
import { ECursorControllerEvents } from "../types/eCursorControllerEvents";
import { Coords } from "../coords";
import { DamageController } from "./damageController";
import { EDamageType } from "../meta-atoms/types/eDamageType";
import { GItemBase } from "../game-items/gItemBase";
import { EColorCombinationType } from "../types/eColorCombinationType";
import { GravitationController } from "./gravitationController";
import { SpawnController } from "./spawnController";
import { AnimationController } from "./animationController";
import { EGameCellEvents } from "../types/eGameCellEvents";
import { ExplosionController } from "./explosionsController";
import { EGItemColorTypes } from "../game-items/types/eGItemColorTypes";
import { GameModel } from "../gameModel";
import { EGameModelEvents } from "../types/eGameModeEvents";
import { EViewControllerEvents } from "../types/eViewControllerEvents";
import { Services } from "../../services/services";
import { GameCell } from "../gameCell";

const {ccclass, property} = _decorator;

@ccclass("GameController")
export class GameController extends Component {
    @property(ViewPrefabStorage) viewPrefabStorage!: ViewPrefabStorage;
    @property(ViewConfig) viewConfig!: ViewConfig;
    @property(CoordsCorrector) coordsCorrector!: CoordsCorrector;
    @property(CursorController) cursorController!: CursorController;

    private gameModel: GameModel;
    private cellController: CellController;
    private viewController: ViewController;
    private itemController: ItemController;
    private spawnController: SpawnController;
    private damageController: DamageController;
    private explosionController: ExplosionController;
    private animationController: AnimationController;
    private gravitationController: GravitationController;
    private colorCombinationController: ColorCombinationController;

    private isRequireIteration: boolean = false;
    private isGameFinished: boolean = false;
    private isBoosterEnabled: boolean = false;

    private attackerContentForBooster?: GItemBase;

    protected onLoad(): void {
        const rows = 10, columns = 10;

        this.gameModel = new GameModel(
            200,
            20
        )

        // Coords corrector
        this.coordsCorrector.SetGridSize(rows, columns);

        // Animation controller
        this.animationController = new AnimationController(this.coordsCorrector);

        // View controller
        this.viewController = new ViewController(
            this.viewPrefabStorage,
            this.viewConfig,
            this.coordsCorrector,
            this.animationController,
            this.gameModel,
        )

        // Item controller
        this.itemController = new ItemController(this.animationController);
        this.itemController.on(EItemControllerEvents.OnCreateItem, this.viewController.OnCreateGameItem, this.viewController);

        // Cell controller
        this.cellController = new CellController(this.itemController);
        this.cellController.SetGridSize(rows, columns);
        this.cellController.on(ECellControllerEvents.OnCreateCell, this.viewController.OnCreateCell, this.viewController);
        this.cellController.CreateCells();

        // Color combination controller
        this.colorCombinationController = new ColorCombinationController(this.cellController);

        // Damage controller
        this.damageController = new DamageController(
            this.cellController,
            this.gameModel
        );

        // Explosion controller
        this.explosionController = new ExplosionController(
            this.itemController,
            this.damageController,
            this.cellController,
        )

        // cursor Controller
        this.cursorController.node.on(ECursorControllerEvents.OnCursorClick, this.OnCursorClick, this);

        // gravitation controller
        this.gravitationController = new GravitationController(
            this.cellController,
            this.animationController,
        );

        // spawn controller
        this.spawnController = new SpawnController(
            EGItemType.ColorItem,
            this.cellController,
            this.itemController
        );
        
        // Add generator info for cells 
        for (let col = 0; col < columns; col++) {
            this.cellController.storage[0][col].AddAtom(
                new AtomRegistry[EAtomType.CellGeneration]()
                    .SetChanceFor(EGItemType.ColorItem, 1)
            )
        }

        // Prepare field
        this.cellController.FillField(EGItemType.ColorItem);
        this.spawnController.Initialize();

        this.cellController.EveryCoords((row, column) => {
            this.cellController.GetCell(row, column)?.on(EGameCellEvents.OnContentStateChanged, this.OnCellContentChanged, this)
        })
        
        this.isRequireIteration = true;

        this.gameModel.on(EGameModelEvents.OnMovesOver, this.OnMovesOver, this);
        this.gameModel.on(EGameModelEvents.OnScoreGot, this.OnScoreGot, this);

        this.viewController.on(EViewControllerEvents.OnClickExit, this.OnClickExit, this);
        this.viewController.on(EViewControllerEvents.OnClickRestartGame, this.OnClickRestartGame, this);
        this.viewController.on(EViewControllerEvents.OnClickSwapBooster, this.OnClickSwapBooster, this);
    }

    protected onDestroy(): void {
        this.cellController.off(ECellControllerEvents.OnCreateCell, this.viewController.OnCreateCell, this.viewController);
        this.itemController.off(EItemControllerEvents.OnCreateItem, this.viewController.OnCreateGameItem, this.viewController);
        this.cursorController.node?.off(ECursorControllerEvents.OnCursorClick, this.OnCursorClick, this);

        this.gameModel.off(EGameModelEvents.OnMovesOver, this.OnMovesOver, this);
        this.gameModel.off(EGameModelEvents.OnScoreGot, this.OnScoreGot, this);

        this.cellController.EveryCoords((row, column) => {
            this.cellController.GetCell(row, column)?.off(EGameCellEvents.OnContentStateChanged, this.OnCellContentChanged, this)
        })

        this.viewController.off(EViewControllerEvents.OnClickExit, this.OnClickExit, this);
        this.viewController.off(EViewControllerEvents.OnClickRestartGame, this.OnClickRestartGame, this);
        this.viewController.off(EViewControllerEvents.OnClickSwapBooster, this.OnClickSwapBooster, this);

        this.viewController.Destroy();
    }

    protected lateUpdate(dt: number): void {
        if (this.isRequireIteration) {
            this.MakeIteration()
            this.isRequireIteration = false;
        }
    }

    private MakeIteration(): void {
        if (this.isGameFinished) return;
        this.gravitationController.MakeIteration();

        const combinations = this.colorCombinationController.GetAvailableCombinations();

        combinations.get(EPhysicLayer.Tiles)?.forEach((combination) => {
            combination.forEach(item => {
                if (isAssignType(EGItemType.ColorItem, item)) {
                    item.SetAvailableCombinations(combination.length);
                }
            })
        })

        // if (this.gravitationController.IsRequireNextIteration()) {
        //     this.MakeIteration();
        // }
    }

    private OnCursorClick(targetCoords: Coords): void {
        if (this.isGameFinished) return;
        const cell = this.cellController.GetCell(targetCoords);

        if (this.isBoosterEnabled) {
            if (!cell.HasContent(EPhysicLayer.Tiles)) return;
            const targetItem = cell.GetContent(EPhysicLayer.Tiles);
            if (targetItem.isBlocked) return;

            if (!this.attackerContentForBooster) {
                this.attackerContentForBooster = targetItem;
                return;
            }
            if (this.attackerContentForBooster.isBlocked) return;

            const cellAttacker = this.cellController.GetCell(this.attackerContentForBooster.coords);
            const cellTarget = cell;

            cellTarget.ReplaceContent(EPhysicLayer.Tiles, this.attackerContentForBooster);
            cellAttacker.ReplaceContent(EPhysicLayer.Tiles, targetItem);
            this.attackerContentForBooster = undefined;
            
            this.isBoosterEnabled = false;
            // TODO: replace to method
            this.viewController.UpdateBoosterStatus(this.isBoosterEnabled);
            this.MakeIteration();

            return;
        }

        let isRequireTakeMove = false;

        everyPhysicLayer(layer => {
            const content = cell.GetContent(layer);
            if (!content) return;
            if (content.isBlocked) return;

            if (content.HasAtom(EAtomType.Interaction)) {
                const atomInteraction = content.GetAtom(EAtomType.Interaction);
                if (atomInteraction.isActive) {
                    atomInteraction.DoInteract();
                    return;
                }
            }

            const combination = this.colorCombinationController.GetAvailableCombinationFor(layer, targetCoords.row, targetCoords.column);
            const availableCombination = getColorCombination(combination.length);
            if (availableCombination === EColorCombinationType.None) return;

            isRequireTakeMove = true;

            combination.forEach(item => {
                this.damageController.TakeDamage(item.coords, EDamageType.Combination, 1);
            })

            // TODO: refactor this:
            switch (availableCombination) {
                case EColorCombinationType.Petard: {
                    const cell = this.cellController.GetCell(targetCoords);
                    const item = this.itemController.CreateItem(EGItemType.PetardItem, targetCoords);
                    cell.ReplaceContent(layer, item);

                    break;
                }
                case EColorCombinationType.Rocket: {
                    const cell = this.cellController.GetCell(targetCoords);
                    const item = this.itemController.CreateItem(EGItemType.HorizontalRocketItem, targetCoords);
                    cell.ReplaceContent(layer, item);

                    break;
                }
                case EColorCombinationType.Rainbow: {
                    const cell = this.cellController.GetCell(targetCoords);
                    const item = this.itemController.CreateItem(EGItemType.RainbowItem, targetCoords);
                    cell.ReplaceContent(layer, item);

                    if (item.HasAtom(EAtomType.Color)) {
                        item.GetAtom(EAtomType.Color).color = content.GetAtom(EAtomType.Color)?.color ?? EGItemColorTypes.Yellow;
                    }

                    break;
                }
            }
        })

        if (isRequireTakeMove) {
            this.gameModel.movesLeft -= 1;
        }

        this.MakeIteration();
    }

    private OnCellContentChanged() {
        this.isRequireIteration = true;
    }

    private OnMovesOver(): void {
        this.EndGame(false);
    }

    private OnScoreGot(): void {
        this.EndGame(true);        
    }

    private EndGame(isWin: boolean): void {
        if (this.isGameFinished) return;
        this.isGameFinished = true;
        this.viewController.ShowEndGameOverlay(isWin);
        // this.viewConfig
    }

    private OnClickExit(): void {
        this.isGameFinished = true;
        Services.Storage.get(Services.Types.Scene).Run("meta");
    }
    private OnClickRestartGame(): void {
        this.isGameFinished = true;
        Services.Storage.get(Services.Types.Scene).Run("game")
    }
    private OnClickSwapBooster(): void {
        this.isBoosterEnabled = !this.isBoosterEnabled;
        this.viewController.UpdateBoosterStatus(this.isBoosterEnabled);
    }
}