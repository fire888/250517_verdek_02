// import { FACET11 } from '../../schemes/schemeFacet11'
// import { FACET12 } from '../../schemes/schemeFacet12';
// import { FACET13 } from '../../schemes/schemeFacet13';
// import { FACET14 } from '../../schemes/schemeFacet14';
import { 
    FACETS,
    FacetNames
} from '../CONSTANTS/FASETS'
import { rotateArrY, translateArr } from "../Helpers/mathHelpers";
import type { IV3 } from "../Helpers/mathHelpers";
import type { IDataBox } from "./Box";


export const createSide = (params: IDataBox) => {
    const v = []

    const { w, d, h, facetS } = params

    //const { points } = FACET11
    const { points } = FACETS[facetS.type]
    const profile = [0, 0, 0]
    for (let i = 0; i < points.length; ++i) {
        profile.push(points[i][0], h - FACETS[facetS.type].h + points[i][1], 0,)
    }

    const profileWS = [...profile]
    rotateArrY(profileWS, Math.PI / 4)

    const profileWN = [...profile]
    rotateArrY(profileWN, -Math.PI / 4)
    translateArr(profileWN, 0, 0, -d)

    const profileES = [...profile]
    rotateArrY(profileES, Math.PI * 0.75)
    translateArr(profileES, w, 0, 0)

    const profileEN = [...profile]
    rotateArrY(profileEN, -Math.PI * 0.75)
    translateArr(profileEN, w, 0, -d)

    const arrProfiles = [
        profileWN,
        profileWS,
        profileES,
        profileEN,
        profileWN,
    ]

    for (let p = 1; p < arrProfiles.length; ++p) {
        const pPrev = arrProfiles[p - 1]
        const pNext = arrProfiles[p]

        for (let i = 3; i < pPrev.length; i += 3) {
            v.push(
                pPrev[i - 3], pPrev[i - 2], pPrev[i - 1],
                pNext[i - 3], pNext[i - 2], pNext[i - 1],
                pNext[i], pNext[i + 1], pNext[i + 2],
                pPrev[i - 3], pPrev[i - 2], pPrev[i - 1],
                pNext[i], pNext[i + 1], pNext[i + 2],
                pPrev[i], pPrev[i + 1], pPrev[i + 2],
            )
        }

    }

    const n = profileWS.length - 3

    const wst: IV3 = [profileWS[n], profileWS[n + 1], profileWS[n + 2]]
    const est: IV3 = [profileES[n], profileES[n + 1], profileES[n + 2]]
    const ent: IV3 = [profileEN[n], profileEN[n + 1], profileEN[n + 2]]
    const wnt: IV3 = [profileWN[n],profileWN[n + 1], profileWN[n + 2],]

    return {
        v,
        wst,
        est,
        ent,
        wnt,
    }
}
