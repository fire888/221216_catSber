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
    let keyDir = 'bottom'

    let currentPosIndexCat = [...START_CAT_POS_INDEX]
    let isMovieComplete = true



    let data = {
        down: false,
        left: false,
        right: false,
        up: false,
    }
    root.uiEvents.on(dataK => {
        data = dataK
    })



    let isCatMove = false
    const moveCat = () => {
        let isChanged = false
        const newPosIndexCat = [...currentPosIndexCat]
        let rotation = null
        if (data.down) {
            isChanged = true
            keyDir = 'down'
            rotation = 0
            //cat.mesh.rotation.y = 0
            ++newPosIndexCat[2]
        }
        if (data.up) {
            isChanged = true
            keyDir = 'up'
            rotation = Math.PI
            //cat.mesh.rotation.y = Math.PI
            --newPosIndexCat[2]
        }
        if (data.left) {
            isChanged = true
            keyDir = 'left'
            rotation = Math.PI * 1.5
            //cat.mesh.rotation.y =
            --newPosIndexCat[0]
        }
        if (data.right) {
            isChanged = true
            keyDir = 'right'
            rotation = Math.PI * 0.5
            //cat.mesh.rotation.y =
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

        rotation !== null && cat.rotateTo(rotation)

        if (!isChanged) {
            return;
        }
        const dataScheme = compare(SCHEME, newPosIndexCat)
        if (dataScheme) {
            isCatMove = true
            cat.moveTo(
                dataScheme.posIndex[0] * SIZE,
                dataScheme.posIndex[1] * SIZE,
                dataScheme.posIndex[2] * SIZE,
            ).then(() => {
                isCatMove = false
                currentPosIndexCat = [...dataScheme.posIndex]
            }, () => {
                isCatMove = false
                console.log('rej')
                currentPosIndexCat = [...dataScheme.posIndex]
            })
        }
    }


    root.frameUpdater.on(n => {
        if (isCatMove) {
            return;
        }
        moveCat()

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