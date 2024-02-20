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

const {ccclass, property} = _decorator;

@ccclass("GameController")
export class GameController extends Component {
    @property(ViewPrefabStorage) viewPrefabStorage!: ViewPrefabStorage;
    @property(ViewConfig) viewConfig!: ViewConfig;
    @property(CoordsCorrector) coordsCorrector!: CoordsCorrector;
    @property(CursorController) cursorController!: CursorController;

    private cellController: CellController;
    private viewController: ViewController;
    private itemController: ItemController;
    private spawnController: SpawnController;
    private damageController: DamageController;
    private animationController: AnimationController;
    private gravitationController: GravitationController;
    private colorCombinationController: ColorCombinationController;

    private isRequireIteration: boolean = false;

    protected onLoad(): void {
        const rows = 9, columns = 10;

        // View controller
        this.viewController = new ViewController(
            this.viewPrefabStorage,
            this.viewConfig,
            this.coordsCorrector
        )

        // Coords corrector
        this.coordsCorrector.SetGridSize(rows, columns);

        // Animation controller
        this.animationController = new AnimationController(this.coordsCorrector);

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
        this.damageController = new DamageController(this.cellController);

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
    }

    protected onDestroy(): void {
        this.cellController.off(ECellControllerEvents.OnCreateCell, this.viewController.OnCreateCell, this.viewController);
        this.itemController.off(EItemControllerEvents.OnCreateItem, this.viewController.OnCreateGameItem, this.viewController);
        this.cursorController.node.off(ECursorControllerEvents.OnCursorClick, this.OnCursorClick, this);

        this.cellController.EveryCoords((row, column) => {
            this.cellController.GetCell(row, column)?.off(EGameCellEvents.OnContentStateChanged, this.OnCellContentChanged, this)
        })
    }

    private MakeIteration(): void {
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
        everyPhysicLayer(layer => {
            const combination = this.colorCombinationController.GetAvailableCombinationFor(layer, targetCoords.row, targetCoords.column);
            const availableCombination = getColorCombination(combination.length);
            if (availableCombination === EColorCombinationType.None) return;

            combination.forEach(item => {
                this.damageController.TakeDamage(item.coords, EDamageType.Combination, 1);
            })
        })

        this.MakeIteration();
    }

    private OnCellContentChanged() {
        this.isRequireIteration = true;
    }

    protected lateUpdate(dt: number): void {
        if (this.isRequireIteration) {
            this.MakeIteration()
            this.isRequireIteration = false;
        }
    }
}