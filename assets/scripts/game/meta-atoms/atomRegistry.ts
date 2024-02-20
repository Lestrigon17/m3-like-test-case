import { AtomAnimation } from "./atomAnimation";
import { AtomCellGeneration } from "./atomCellGeneration";
import { AtomColor } from "./atomColor";
import { AtomDamageable } from "./atomDamageable";
import { AtomExplosive } from "./atomExplosive";
import { AtomGravitation } from "./atomGravitation";
import { AtomInteraction } from "./atomInteraction";
import { AtomScore } from "./atomScore";
import { EAtomType } from "./types/eAtomType";

export const AtomRegistry = {
    [EAtomType.Damageable]: AtomDamageable,
    [EAtomType.Gravitation]: AtomGravitation,
    [EAtomType.CellGeneration]: AtomCellGeneration,
    [EAtomType.Color]: AtomColor,
    [EAtomType.Animation]: AtomAnimation,
    [EAtomType.Explosive]: AtomExplosive,
    [EAtomType.Interaction]: AtomInteraction,
    [EAtomType.Score]: AtomScore,
}