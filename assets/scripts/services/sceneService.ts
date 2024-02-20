import { Component, Scene, SceneAsset, _decorator, assetManager, director } from "cc";
import { Services } from "./services";


const {ccclass, property} = _decorator;
// Pre define key
Services.Storage.defineKey("Scene");

type OnProgressCallback = (current: number, total: number) => void;
enum EStateStatus {
    InProgress,
    Complete,
    Error
}

@ccclass("SceneService")
export class SceneService extends Component {
    private loadSceneCache: Map<string, SceneAsset> = new Map();
    private preloadSceneCache: Map<string, EStateStatus> = new Map();
    private inProgress: boolean = false;

    protected onLoad(): void {
        Services.Storage.reg(Services.Types.Scene, this);
    }

    public Preload(name: string, onProgress?: OnProgressCallback): Promise<void> {
        return new Promise((resolve, reject) => {
            const state = this.preloadSceneCache.get(name);
            
            if (state === EStateStatus.InProgress) return reject(`Preload scene ${name} already in progress`);
            if (state === EStateStatus.Complete) return resolve();

            this.preloadSceneCache.set(name, EStateStatus.InProgress);
            assetManager.main.preloadScene(name, (current, total) => {
                if (onProgress) {
                    onProgress(current, total)
                }
            }, (err) => {
                if (err) {
                    this.preloadSceneCache.set(name, EStateStatus.Error);
                    return reject(err);
                }

                this.preloadSceneCache.set(name, EStateStatus.Complete);
                resolve();
            })
        })
    }

    public Load(name: string, onProgress?: OnProgressCallback): Promise<SceneAsset> {
        return new Promise((resolve, reject) => {
            if (this.loadSceneCache.has(name)) {
                return resolve(this.loadSceneCache.get(name)!);
            }

            assetManager.main.loadScene(name, (current, total) => {
                if (onProgress) {
                    onProgress(current, total)
                }
            }, (err: null | Error, resource?: SceneAsset) => {
                if (err || !resource) {
                    return reject(err);
                }

                // this.loadSceneCache.set(name, resource);
                resolve(resource);
            });
        })
    }

    public async Run(name: string, onProgress?: OnProgressCallback): Promise<Scene> {
        if (this.inProgress) throw new Error("Already in progress");

        try {
            await this.Preload(name, onProgress);
        } catch(e) {
            console.error(e);
            throw e;
        }

        let resource: SceneAsset;

        try { 
            resource = await this.Load(name, onProgress);
        } catch(e) {
            console.error(e);
            throw e;
        }

        return new Promise((resolve, reject) => {
            director.runScene(
                resource,
                () => {},
                (err?: null | Error, scene?: Scene) => {
                    if (err) {
                        return reject(err);
                    }

                    resolve(scene);
                }
            );
        })
    }
}