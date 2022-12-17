import * as THREE from 'three'

const SCHEME = []
const SCHEME_BOX = [
    { posIndex: [0, 1, 0], isGeom: true, isCanStay: true },
    { posIndex: [1, 1, 0], isGeom: true, isCanStay: true },
    { posIndex: [2, 1, 0], isGeom: true, isCanStay: true },
    { posIndex: [1, 1, -1], isGeom: true },
    { posIndex: [2, 1, -1], isGeom: true },
    { posIndex: [1, 2, -1], isGeom: true, isCanStay: true },
    { posIndex: [2, 2, -1], isGeom: true },
    { posIndex: [2, 3, -1], isGeom: true, isCanStay: true },
]




for (let i = -5; i < 5; ++i) {
    for (let j = 5; j > -2; --j) {
        if (j === 0) {
            if (i === 0 || i === 1 || i === 2) {
                continue;
            }
        }
        if (j === -1) {
            if (i === 1 || i === 2) {
                continue;
            }
        }
        SCHEME.push({ posIndex: [i, 0, j], isCanStay: true })
    }
}
SCHEME.push(...SCHEME_BOX)

const SIZE = .7
const START_CAT_POS_INDEX = [0, 0, 1]





export const gamePlay = root => {
    const { level, cat } = root
    cat.mesh.position.set(
        START_CAT_POS_INDEX[0] * SIZE,
        START_CAT_POS_INDEX[1] * SIZE,
        START_CAT_POS_INDEX[2] * SIZE,
    )
    root.level.createLevel(SCHEME)

    const vecCatLookAt = new THREE.Vector3()
    let keyDir = 'bottom'

    let currentPosIndexCat = [...START_CAT_POS_INDEX]
    root.uiEvents.on(data => {
        let isChanged = false
        const newPosIndexCat = [...currentPosIndexCat]
        if (data.down) {
            isChanged = true
            keyDir = 'down'
            cat.mesh.rotation.y = 0
            ++newPosIndexCat[2]
        }
        if (data.up) {
            isChanged = true
            keyDir = 'up'
            cat.mesh.rotation.y = Math.PI
            --newPosIndexCat[2]
        }
        if (data.left) {
            isChanged = true
            keyDir = 'left'
            cat.mesh.rotation.y = Math.PI * 1.5
            --newPosIndexCat[0]
        }
        if (data.right) {
            isChanged = true
            keyDir = 'right'
            cat.mesh.rotation.y = Math.PI * 0.5
            ++newPosIndexCat[0]
        }

        if (data.jump) {
            isChanged = true
            ++newPosIndexCat[1]
            if (keyDir === 'down') {
                ++newPosIndexCat[2]
            }
            if (keyDir === 'up') {
                --newPosIndexCat[2]
            }
            if (keyDir === 'left') {
                --newPosIndexCat[0]
            }
            if (keyDir === 'right') {
                ++newPosIndexCat[0]
            }
        }

        if (!isChanged) {
            return;
        }

        vecCatLookAt.x = newPosIndexCat[0] * SIZE
        vecCatLookAt.y = newPosIndexCat[1] * SIZE
        vecCatLookAt.z = newPosIndexCat[2] * SIZE

        const dataScheme = compare(SCHEME, newPosIndexCat)
        if (dataScheme) {
            currentPosIndexCat = [...dataScheme.posIndex]
            cat.mesh.position.set(
                currentPosIndexCat[0] * SIZE,
                currentPosIndexCat[1] * SIZE,
                currentPosIndexCat[2] * SIZE,
            )
        }
    })
}


const compare = (arr, val) => {
    for (let i = 0; i < arr.length; ++i) {
        if (
            arr[i].posIndex[0] === val[0] &&
            arr[i].posIndex[1] === val[1] &&
            arr[i].posIndex[2] === val[2]
        ) {
            if (arr[i].isCanStay) {
                return arr[i];
            } else {
                return false;
            }
        }
    }
    for (let i = 0; i < arr.length; ++i) {
        if (
            arr[i].posIndex[0] === val[0] &&
            arr[i].posIndex[1] === val[1] - 1 &&
            arr[i].posIndex[2] === val[2]
        ) {
            if (arr[i].isCanStay) {
                return arr[i];
            } else {
                return false;
            }
        }
    }
    for (let i = 0; i < arr.length; ++i) {
        if (
            arr[i].posIndex[0] === val[0] &&
            arr[i].posIndex[1] === val[1] - 2 &&
            arr[i].posIndex[2] === val[2]
        ) {
            if (arr[i].isCanStay) {
                return arr[i];
            } else {
                return false;
            }
        }
    }
    for (let i = 0; i < arr.length; ++i) {
        if (
            arr[i].posIndex[0] === val[0] &&
            arr[i].posIndex[1] === val[1] - 3 &&
            arr[i].posIndex[2] === val[2]
        ) {
            if (arr[i].isCanStay) {
                return arr[i];
            } else {
                return false;
            }
        }
    }
    return false
}