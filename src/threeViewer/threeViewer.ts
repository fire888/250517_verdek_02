import * as THREE from 'three'

import { Studio } from './Studio'
import { Ticker } from './Ticker'
import { LoadManager } from './LoadManager'
import { MaterialsManager } from './MaterialsManager'
import { Box } from './Box/Box'

export type Root = {
    studio: Studio,
    ticker: Ticker,
    loadManager: LoadManager,
    materialsManager: MaterialsManager
}

let root: Root | null = null

const createRoot = async (divWrapper: HTMLElement) => {
    const studio = new Studio()
    studio.setDomParent(divWrapper)
    const ticker = new Ticker()
    ticker.on(() => {
        studio.render()
    })
    const loadManager = new LoadManager()
    await loadManager.loadAllAssets()
    console.log(loadManager.assets)

    const materialsManager = new MaterialsManager(loadManager.assets)

    // const box = new THREE.BoxGeometry(50, 50, 50)
    // const m = materialsManager.simple
    // const mesh = new THREE.Mesh(box, m)
    // studio.add(mesh)
    // studio.render()

    // ticker.on(() => {
    //     //mesh.rotation.y += 0.1
    // })

    ticker.start()

    const box2 = new Box(materialsManager.wood)
    studio.add(box2.mesh)



    return  {
      studio,
      loadManager,
      ticker
    }
} 





export const createThreeViewer = async (divWrapper: HTMLElement) => {
    if (root === null) { 
        root = await createRoot(divWrapper)
    }
    return () => {
        root?.studio.removeDomParent()
    }
}