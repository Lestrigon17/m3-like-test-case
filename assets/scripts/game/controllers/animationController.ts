import { EventTarget, Node, Vec3, tween } from "cc";
import { GItemBase } from "../game-items/gItemBase";
import { Coords } from "../coords";
import { CoordsCorrector } from "./coordsCorrector";
import { EAtomType } from "../meta-atoms/types/eAtomType";
import { EBlockType } from "../types/eBlockLayer";
import { GameCell } from "../gameCell";

export class AnimationController extends EventTarget {
    constructor(
        private coordsCorrector: CoordsCorrector,
    ) {
        super();
    }

    TryAnimateSpawn(item: GItemBase) {
        if (!item.HasAtom(EAtomType.Animation)) return;
        if (!item.view) return;

        const time = 0.2;

        item.SetBlockBy(EBlockType.Animation);
        // @ts-ignore
        tween(item.view.node)
            .set({scale: Vec3.ZERO})
            .to(time, {scale: new Vec3(item.view.targetScale, item.view.targetScale, 1)})
            .call(() => item.DeleteBlockBy(EBlockType.Animation))
            .start();

    }

    TryAnimateDestroy(item: GItemBase): boolean {
        if (!item.HasAtom(EAtomType.Animation)) return;
        if (!item.view) return;

        const time = 0.2;

        item.SetBlockBy(EBlockType.Animation);
        // @ts-ignore
        tween(item.view.node)
            .to(time, {scale: Vec3.ZERO})
            .call(() => item.DeleteBlockBy(EBlockType.Animation))
            .start();

            return true;
    }

    TryAnimateMoveTo(item: GItemBase, startCell: GameCell, targetCell: GameCell) {
        if (!item.HasAtom(EAtomType.Animation)) return;
        if (!item.view) return;

        const startPosition = this.coordsCorrector.ConvertToPosition(startCell.coords);
        const endPosition = this.coordsCorrector.ConvertToPosition(targetCell.coords);
        const distance = Coords.GetDistance(startCell.coords, targetCell.coords);
        const time = 0.2 * distance;

        item.SetBlockBy(EBlockType.Animation);
        // @ts-ignore
        tween(item.view.node as Node)
            .set({position: startPosition})
            .to(time, {position: endPosition})
            .call(() => item.DeleteBlockBy(EBlockType.Animation))
            .call(() => item.SetCoords(targetCell.coords))
            .start();
    }
}