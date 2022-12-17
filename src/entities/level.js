import * as THREE from 'three'

const scheme = [
    { posIndex: [0, 0, 0] },
    { posIndex: [1, 0, 0] },
    { posIndex: [2, 0, 0] },
    { posIndex: [1, 0, -1] },
    { posIndex: [2, 0, -1] },
    { posIndex: [1, 1, -1] },
    { posIndex: [2, 1, -1] },
    { posIndex: [2, 2, -1] },
]
const SIZE = .7



export const createLevel = root => {
    const mesh = new THREE.Mesh(
        new THREE.BoxGeometry(SIZE, SIZE, SIZE),
        new THREE.MeshPhongMaterial({ color: 0xFF0000 })
    )

    const mesh2 = new THREE.Mesh(
        new THREE.BoxGeometry(SIZE, SIZE, SIZE),
        new THREE.MeshPhongMaterial({ color: 0xFFFF00 })
    )

    // for (let i = 0; i < scheme.length; ++i) {
    //     const m = mesh.clone()
    //     const { posIndex } = scheme[i]
    //     m.position.set(
    //         posIndex[0] * SIZE,
    //         posIndex[1] * SIZE,
    //         posIndex[2] * SIZE,
    //     )
    //     root.studio.addToScene(m)
    // }

    return {
        createLevel: scheme => {
            for (let i = 0; i < scheme.length; ++i) {
                let m
                if (scheme[i].isGeom) {
                    m = mesh.clone()
                } else {
                    m = mesh2.clone()
                }
                const { posIndex } = scheme[i]
                m.position.set(
                    posIndex[0] * SIZE,
                    posIndex[1] * SIZE,
                    posIndex[2] * SIZE,
                )
                root.studio.addToScene(m)
            }
        }
    }
}