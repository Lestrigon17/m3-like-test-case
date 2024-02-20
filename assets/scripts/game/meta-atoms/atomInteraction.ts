import { AtomBase } from "./atomBase";
import { EAtomInteractionEvents } from "./types/eAtomInteractionEvents";
import { EAtomType } from "./types/eAtomType";

export class AtomInteraction extends AtomBase {
    protected typeInternal: EAtomType = EAtomType.Interaction;

    public DoInteract(): void {
        this.emit(EAtomInteractionEvents.OnDoInteract);
    }
}