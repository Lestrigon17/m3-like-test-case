import { EventTarget } from "cc";
import { AtomBase } from "./atomBase";
import { AtomRegistry } from "./atomRegistry";
import { EAtomType } from "./types/eAtomType";

type AtomTypeFromEnum<Key, Storage extends Record<string, abstract new (...args: any[]) => any>> = Key extends keyof Storage ? InstanceType<Storage[Key]> : never;

export abstract class AtomContainer extends EventTarget {
	protected atomAttachmentsInternal: Map<EAtomType, AtomBase> = new Map();

    public HasAtom(type: EAtomType): boolean {
        return this.atomAttachmentsInternal.has(type);
    }

    public GetAtom<
        Key extends EAtomType, 
        RType = AtomTypeFromEnum<Key, typeof AtomRegistry>
    >(type: Key): RType {
        if (!type || type in AtomRegistry === false) return undefined;
        
        return this.atomAttachmentsInternal.get(type) as RType;
    }

    public AddAtom(instance: AtomBase): this {
        if (!instance) return undefined; //TODO: Make throw ReferenceError
        if (this.atomAttachmentsInternal.has(instance.type)) return undefined; // TODO: Make throw Error because we have atom in storage

        this.atomAttachmentsInternal.set(instance.type, instance);
        
        return this;
    }
}