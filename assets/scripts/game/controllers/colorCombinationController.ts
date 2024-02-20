import { Coords } from "../coords";
import type { GItemBase } from "../game-items/gItemBase";
import { everyPhysicLayer } from "../gameUtils";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { EPhysicLayer } from "../types/ePhysicLayer";
import type { CellController } from "./cellController";

const coordsDirections = [
    Coords.LEFT,
    Coords.RIGHT,
    Coords.TOP,
    Coords.BOTTOM
];

export class ColorCombinationController extends EventTarget {
    constructor(
        private cellController: CellController
    ) {
        super();
    }

    public GetAvailableCombinations(): Map<EPhysicLayer, Array<GItemBase[]>> {
        const checkedCells: Array<Array<Boolean[]>> = [];
        const combinations: Map<EPhysicLayer, Array<GItemBase[]>> = new Map();

        everyPhysicLayer((layer) => {
            checkedCells[layer] ??= [];
            combinations.set(layer, []);

            this.cellController.EveryCoords((row, column) => {
                if (checkedCells[layer]?.[row]?.[column]) return;

                const comb = this.GetAvailableCombinationFor(layer, row, column) ?? [];

                comb.forEach((item) => {
                    const {row, column} = item.coords;
                    checkedCells[layer][row] ??= [];
                    checkedCells[layer][row][column] = true;
                })
                
                combinations.get(layer).push(comb);
            })
        });

        return combinations;
    }

    public GetAvailableCombinationFor(layer: EPhysicLayer, row: number, column: number): GItemBase[] {
        const cell = this.cellController.GetCell(row, column);
        if (!cell) return [];

        const content = cell.GetContent(layer);
        if (!content) return [];
        if (!content.HasAtom(EAtomType.Color)) return [];

        const requireColor = content.GetAtom(EAtomType.Color).color;
        const combination = [content];
        const checkedCoords: Array<boolean[]> = [];
        
        checkedCoords[row] ??= [];
        checkedCoords[row][column] = true;
        
        let checkCoords = (coords: Coords) => {
            checkedCoords[coords.row] ??= [];
            if (checkedCoords[coords.row][coords.column]) return;
            checkedCoords[coords.row][coords.column] = true;

            const cell = this.cellController.GetCell(coords.row, coords.column);
            if (!cell) return;

            const content = cell.GetContent(layer);
            if (!content) return;
            if (!content.HasAtom(EAtomType.Color)) return;

            const color = content.GetAtom(EAtomType.Color).color;
            if (color !== requireColor) return;

            if (content.isBlocked) return;

            combination.push(content);

            coordsDirections.forEach((coord) => {
                const offsetCoords = content.coords.Clone().Add(coord);
                if (checkedCoords[offsetCoords.row]?.[offsetCoords.column]) return;
                checkCoords(offsetCoords);
            })
        }

        coordsDirections.forEach((coord) => {
            checkCoords(content.coords.Clone().Add(coord));
        })

        return combination;
    }
}