type GetRegistryType<TypesRegistry, isAsString = false> = {
    [K in keyof TypesRegistry]?: isAsString extends true ? K : TypesRegistry[K] extends new (...args: any) => any ? InstanceType<TypesRegistry[K]> : never;
};

type GetRegistryInstance<TypesRegistry, K extends keyof TypesRegistry> = TypesRegistry[K] extends new (...args: any) => any
    ? InstanceType<TypesRegistry[K]>
    : never;

class MetaStorageController<
    TypesRegistry extends object,
> {
    public keys: GetRegistryType<TypesRegistry, true> = {};
    
    private instanceStorage: GetRegistryType<TypesRegistry> = {};
    private waitList: Map<keyof TypesRegistry, Array<Function>> = new Map();

    public defineKey<Key extends keyof TypesRegistry>(key: Key) {
        if (!key) throw new ReferenceError("Storage:Controller - Empty key received!");
        
        // @ts-ignore // TODO: Что то с типизацией не так, надо пофиксить
        this.keys[key] = key;

        console.debug("Storage:Controller", "Defined key for some entry, key:", key);
    }

    public reg<Key extends keyof TypesRegistry>(key: Key, instance: GetRegistryInstance<TypesRegistry, Key>) {
        if (!key) throw new ReferenceError("Storage:Controller - Empty regKey received, when try reg entry!");
        if (!instance) throw new ReferenceError("Storage:Controller - Empty instance received, when try reg entry!");
        if (this.instanceStorage[key])
            throw new Error("Storage:Controller - Entry with key " + String(key) + " already registered in store!");

        // @ts-ignore // TODO: Что то с типизацией не так, надо пофиксить
        this.keys[key] = key;

        this.instanceStorage[key] = instance;

        console.debug("Storage:Controller -", "Registered new entry with key,", key);

        const regList = this.waitList.get(key);
        if (regList && regList.length > 0) {
            console.log("Storage:Controller -", "Wait list with key", key, "has", regList.length, "entries");
            regList.forEach((callback, i) => {
                console.log("Storage:Controller -", "Wait list [", key, "] resolve #", i);
                callback(instance);
            });

            console.log("Storage:Controller -", "All wait list callbacks resolved!");
            this.waitList.delete(key);
        }
    }

    public get<Key extends keyof TypesRegistry>(key?: Key): GetRegistryInstance<TypesRegistry, Key> | undefined {
        if (!key) throw new ReferenceError("Storage:Controller - Empty key received, when try get entry!");
        if (!this.instanceStorage[key]) return;

        return this.instanceStorage[key];
    }

    public async wait<Key extends keyof TypesRegistry>(key: Key): Promise<GetRegistryInstance<TypesRegistry, Key>> {
        if (this.instanceStorage[key]) return this.instanceStorage[key]!;

        let promise, callback;
        promise = new Promise((resolve) => {
            callback = resolve;
        });

        if (!this.waitList.has(key)) {
            this.waitList.set(key, []);
        }

        // @ts-ignore - проверка на существование выше
        this.waitList.get(key).push(callback);

        return promise;
    }
}


export function createMetaStorage<
    TypesRegistry extends Object,
>(): {
    Types: GetRegistryType<TypesRegistry, true>,
    Storage: MetaStorageController<TypesRegistry>
} {
    const controller = new MetaStorageController<TypesRegistry>();

    return {
        Types: controller.keys,
        Storage: controller
    }
}