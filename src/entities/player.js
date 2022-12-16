import * as THREE from 'three'
import { SEGMENT_SIZE } from '../constants/constants_assetsToLoad'
import { helper_CollisionsItems_v02 } from '../helpers/CollisionsHelper'

export const createPlayer = root => {
    let keys = null
    let isOn = true
    let speed = .3

    const mainObj = new THREE.Object3D()
    const { startCarPoint } = root.appData
    mainObj.position.set(
        startCarPoint.toArray()[0] + (SEGMENT_SIZE[0] * 4),
        startCarPoint.toArray()[1],
        startCarPoint.toArray()[2],
    )
    mainObj.rotation.y = Math.PI / 2

    const camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 1.8, 0)
    mainObj.add(camera)

    const collisionBox = new THREE.Mesh(
        new THREE.BoxGeometry(15, 10, 15),
        new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
    )
    collisionBox.visible = false
    root.studio.addToScene(collisionBox)

    const frontObj = new THREE.Object3D()
    frontObj.position.set(0, 1.8, -1)
    mainObj.add(frontObj)

    const backObj = new THREE.Object3D()
    backObj.position.set(0, 1.8, 1)
    mainObj.add(backObj)

    const light = new THREE.PointLight(0xffffff, 1, 100)
    light.position.set(0, 2, 0)
    mainObj.add(light)


    root.studio.addToScene(mainObj)

    const collisions = new helper_CollisionsItems_v02()
    let savedPlayerSegmentKey = null

    root.keyboard.on(data => keys = data)
    const dirKeys = {
        'up': frontObj,
        'down': backObj,
    }
    const checkSegmentAndCollision = direction => {
        const keyX = Math.floor(mainObj.position.x / SEGMENT_SIZE[0])
        const keyZ = Math.abs(Math.floor((mainObj.position.z) / SEGMENT_SIZE[1]))

        const k = keyX + '_' + keyZ
        if (savedPlayerSegmentKey !== k) {
            savedPlayerSegmentKey = k

            collisions.clearArrCollisions()

            const keys = generateKeysTown(keyX, keyZ)
            for (let i = 0; i < keys.length; ++i) {
                root.appData.town[keys[i]] && collisions.setItemToCollision(root.appData.town[keys[i]].bCollision)
            }
            root.cyberTruck && collisions.setItemToCollision(root.cyberTruck.getCollBox())
        }

        const [is] = collisions.checkCollisions(camera, dirKeys[direction], 3)
        return is
    }

    return {
        update: n => {
            if ( !keys || !isOn ) {
                return;
            }

            if (keys['up']) {
                if (checkSegmentAndCollision('up')) {
                    return;
                }

                mainObj.translateZ(-speed * n)
                root.studio.light.position.z = mainObj.position.z
                collisionBox.position.x = mainObj.position.x
                collisionBox.position.z = mainObj.position.z
            }
            if (keys['down']) {
                if (checkSegmentAndCollision('down')) {
                    return;
                }

                mainObj.translateZ(speed * n)
                root.studio.light.position.z = mainObj.position.z
                collisionBox.position.x = mainObj.position.x
                collisionBox.position.z = mainObj.position.z
            }
            if (keys['left']) {
                 mainObj.rotation.y += 0.02 * n
            }
            if (keys['right']) {
                mainObj.rotation.y -= 0.02 * n
            }
        },
        getCamera: () => camera,
        getCollisionMesh: () => collisionBox
    }
}



const generateKeysTown = (kX, kZ) => {
    const arr = []
    for (let i = kX - 1; i < kX + 2; ++ i) {
        for(let j = kZ - 1; j < kZ + 2; ++j) {
            arr.push(`${i}_${j}`)
        }
    }
    return arr
}  