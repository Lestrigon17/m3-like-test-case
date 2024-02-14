import { AtomDamageable } from "./atomDamageable";
import { AtomGravitation } from "./atomGravitation";
import { EAtomType } from "./types/eAtomType";

export const AtomRegistry = {
    [EAtomType.Damageable]: AtomDamageable,
    [EAtomType.Gravitation]: AtomGravitation,
}