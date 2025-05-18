import * as THREE from 'three'

import { FacetNames } from '../CONSTANTS/FASETS'
import { createSide } from './side'
import { createFace } from "../Helpers/mathHelpers";
import { createTopPr } from './topProfile'
import type { IV3 } from '../Helpers/mathHelpers';
//import { createInner } from "./inner";

export interface IDataBox {
    w: number,
    d: number,
    h: number,
    facetS: { type: FacetNames },
    facetT: { type: FacetNames, offsetX: number, offsetZ: number },
    facetInner: { type: FacetNames, count: number, rotationY: number },
}

export interface IDataTopProfile {
    v: number[],
    wso: IV3,
    wno: IV3,
    eso: IV3,
    eno: IV3,
    wsi: IV3,
    wni: IV3,
    esi: IV3,
    eni: IV3,
}


export class Box {
    mesh: THREE.Mesh
    constructor(material: THREE.MeshPhongMaterial) {

        const boxData: IDataBox = { 
            w: 300,
            d: 700,
            h: 100,
            facetS: {
                type: FacetNames.FACET11,
            },
            facetT: {
                type: FacetNames.FACET22,
                offsetX: 57, 
                offsetZ: 57, 
            },
            facetInner: {
                type: FacetNames.FACET44,
                count: 3,
                rotationY: 0,
            },
        }

        const v: number[] = []
        const s = createSide(boxData)
        v.push(...s.v)
        

        const t = createTopPr(boxData)
        v.push(...t.v)

        v.push(...createFace(s.wst, s.est, t.eso, t.wso))
        v.push(...createFace(s.wnt, s.wst, t.wso, t.wno))
        v.push(...createFace(t.eso, s.est, s.ent, t.eno))
        v.push(...createFace(t.wno, t.eno, s.ent, s.wnt))

        

        const geometry = new THREE.BufferGeometry()
        const vF32 = new Float32Array(v)
        geometry.setAttribute('position', new THREE.BufferAttribute(vF32, 3))
        geometry.computeVertexNormals()

        this.mesh = new THREE.Mesh(geometry, material)
    }
}