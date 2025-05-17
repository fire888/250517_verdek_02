import * as THREE from 'three'
import { ASSETS_KEYS, LoadManager } from "./LoadManager";

export class MaterialsManager {
    public redMirrorr: THREE.MeshPhongMaterial 
    public wood: THREE.MeshPhongMaterial
    public simple: THREE.MeshPhongMaterial

    constructor (assets: LoadManager['assets']) {
        this.wood = new THREE.MeshPhongMaterial({
            color: 0x333333,
            lightMap: assets[ASSETS_KEYS.W_AO_MAP],
            lightMapIntensity: .35,
            normalMap: assets[ASSETS_KEYS.W_NORMAL_MAP],
            normalScale: new THREE.Vector2(.2, .2),
            envMap: assets[ASSETS_KEYS.SKY],
            map: assets[ASSETS_KEYS.W_MAP],
            reflectivity: .002,
            shininess: 100,
            specular: 0x333333,
            flatShading: true,
        })
        this.redMirrorr = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            envMap: assets[ASSETS_KEYS.SKY],
            reflectivity: 1,
            shininess: 50,
            specular: 0xffffff,
            flatShading: true,
        })
        this.simple = new THREE.MeshPhongMaterial({
            color: 0x111111,
        })
    }
}