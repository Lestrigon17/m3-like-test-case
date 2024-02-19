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
import { isAssignType } from "../gameUtils";
import { CursorController } from "./cursorController";

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
    private colorCombinationController: ColorCombinationController;

    protected onLoad(): void {
        const rows = 9, columns = 10;

        // View controller
        this.viewController = new ViewController(
            this.viewPrefabStorage,
            this.viewConfig,
            this.coordsCorrector
        )

        // Item controller
        this.itemController = new ItemController();
        this.itemController.on(EItemControllerEvents.OnCreateItem, this.viewController.OnCreateGameItem, this.viewController);

        // Coords corrector
        this.coordsCorrector.SetGridSize(rows, columns);

        // Cell controller
        this.cellController = new CellController(this.itemController);
        this.cellController.SetGridSize(rows, columns);
        this.cellController.on(ECellControllerEvents.OnCreateCell, this.viewController.OnCreateCell, this.viewController);
        this.cellController.CreateCells();

        // Color combination controller
        this.colorCombinationController = new ColorCombinationController(this.cellController);
        
        // Add generator info for cells
        for (let col = 0; col < columns; col++) {
            this.cellController.storage[0][col].AddAtom(
                new AtomRegistry[EAtomType.CellGeneration]()
                    .SetChanceFor(EGItemType.ColorItem, 1)
            )
        }

        // Prepare field
        this.cellController.FillField(EGItemType.ColorItem);
        
        this.MakeIteration();
    }

    protected onDestroy(): void {
        this.cellController.off(ECellControllerEvents.OnCreateCell, this.viewController.OnCreateCell, this.viewController);
        this.itemController.off(EItemControllerEvents.OnCreateItem, this.viewController.OnCreateGameItem, this.viewController);
    }

    private MakeIteration(): void {
        const combinations = this.colorCombinationController.GetAvailableCombinations();

        combinations.get(EPhysicLayer.Tiles)?.forEach((combination) => {
            combination.forEach(item => {
                if (isAssignType(EGItemType.ColorItem, item)) {
                    item.SetAvailableCombinations(combination.length);
                }
            })
        })
    }
}