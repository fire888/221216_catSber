import * as THREE from 'three'

export const createCat = root => {
    const model = root.assets.catModel.scene
    model.children[0].position.y = 0.34

    const clock = new THREE.Clock();
    const animations = root.assets.catModel.animations;
    const mixer = new THREE.AnimationMixer(model)
    mixer.timeScale = 2.5

    const actions = {}

    for ( let i = 0; i < animations.length; i ++ ) {
        const clip = animations[ i ];
        const action = mixer.clipAction( clip )
        actions[clip.name] = action
    }

    const mesh = new THREE.Object3D()
    mesh.add(model)

    let moverXYZ = null

    return {
        mesh,
        update: () => {
            const mixerUpdateDelta = clock.getDelta()
            mixer.update( mixerUpdateDelta )
        },
        moveTo: (x, y, z, rot) => {
            return new Promise((res, rej) => {
                if (moverXYZ) {
                    moverXYZ.stop()
                    moverXYZ = null
                }
                actions['All Animations'].play()
                moverXYZ = moveToXYZ(mesh, [x, y, z], rot)
                moverXYZ.start().then(() => {
                    moverXYZ = null
                    setTimeout(() => {
                        !moverXYZ && actions['All Animations'].stop()
                    }, 30)
                    res()
                }, rej)
            })
        },
        rotateTo: (r) => {
            if (r === null) {
                return;
            }
            let alpha = 0
            let qTarget = new THREE.Quaternion().setFromAxisAngle( new THREE.Vector3( 0, 1, 0 ), r)
            let qCurrent = new THREE.Quaternion().copy(mesh.quaternion)

            const update = () => {
                alpha += 0.05
                if (alpha > 1) {
                    alpha = 1
                }
                mesh.quaternion.slerpQuaternions(qCurrent, qTarget, Math.min(alpha * 2, 1))
                if (alpha < 1) {
                    setTimeout(() => update(), 15)
                }
            }
            update()
        }
    }
}


const moveToXYZ = (mesh, targetCoords, rot) => {
    let isStop = false
    let onComplete = () => {}
    let onStop = () => {}

    const targetVec = new THREE.Vector3(...targetCoords)
    const currentVec = new THREE.Vector3().copy(mesh.position)
    const spd = 0.05
    let alpha = 0


    const update = () => {
        if (isStop) {
            onStop()
            return;
        }

        mesh.position.lerpVectors(currentVec, targetVec, alpha)
        alpha += spd
        if (alpha > 1) {
            mesh.position.copy(targetVec)
            onComplete()
        } else {
            setTimeout(update, 15)
        }
    }


    return {
        start: () => {
            return new Promise((res, rej) => {
                onComplete = res
                onStop = rej
                update()
            })
        },
        stop: () => isStop = true,
    }
}
