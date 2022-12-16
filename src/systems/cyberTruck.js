import { SEGMENT_SIZE } from '../constants/constants_assetsToLoad'
import * as THREE from 'three'
import { helper_CollisionsItems_v02 } from '../helpers/CollisionsHelper'

export const createCyberTruck = (root) => {
    const arrPointsMeshes = []

    let test = null

    root.assets.town.traverse(item => {
        if (item.name.includes('p_')) {
            arrPointsMeshes.push(item)
        }
        if (item.name.includes('test')) {
            test = item
        }
    })


    const arrPoints = []

    for (let i = 0; i < arrPointsMeshes.length; ++i) {
        const { cityLen } = root.appData
        arrPointsMeshes[i].geometry.computeBoundingSphere()
        const v = new THREE.Vector3(
            arrPointsMeshes[i].geometry.boundingSphere.center.x + Math.floor((cityLen / 2)) * SEGMENT_SIZE[0],
            arrPointsMeshes[i].geometry.boundingSphere.center.y,
            arrPointsMeshes[i].geometry.boundingSphere.center.z + Math.floor((cityLen / 2)) * SEGMENT_SIZE[1],
        )
        arrPoints.push(v)

        if (i === 0) {
            root.appData.startCarPoint = v
        }
    }

    const tr = new THREE.Group()

    const spotLight = new THREE.SpotLight( 0xffffff, 3)
    spotLight.position.set(-.5,1.5,5 )
    spotLight.angle = 0.7
    spotLight.penumbra = 0.4
    spotLight.distance = 300
    const target = new THREE.Object3D()
    target.position.set(-.5, 1, 10)
    tr.add(target)
    spotLight.target = target
    tr.add(spotLight)

    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 12),
        new THREE.MeshBasicMaterial({
            color: 0x0000,
            alphaMap: root.assets.truckShadowMap,
            transparent: true,
        })
    )
    shadow.position.x = -.4
    shadow.position.y = -1.3
    shadow.position.z = -3
    shadow.rotation.x = -Math.PI / 2
    tr.add(shadow)


    root.studio.addToScene(tr)
    if (test) {
        //tr.add(test)
    }

    const truck = root.assets.cyberTruck.scene.children[0]
    truck.scale.set(.01, .01, .01)
    truck.position.y = -2.4
    truck.position.z = 2
    truck.rotation.z = Math.PI / 2
    tr.add(truck)

    const t1 = truck.children[0].children[0].children[0].children[0].children[5]
    t1.material.reflectivity = 50
    t1.material.shininess = 50

    const t2 = truck.children[0].children[0].children[0].children[0].children[3]
    t2.material.reflectivity = 50
    t2.material.shininess = 50




    const collBox = new THREE.Mesh(
        new THREE.BoxGeometry(4, 5, 6),
        new THREE.MeshBasicMaterial()
    )
    collBox.position.z = -3
    collBox.visible = false
    tr.add(collBox)

    const frontObj = new THREE.Object3D()
    frontObj.position.set(0, 1, -3)
    tr.add(frontObj)

    const centerObj = new THREE.Object3D()
    centerObj.position.set(0, 1, 0)
    tr.add(centerObj)

    const collision = new helper_CollisionsItems_v02()




    let currentIndexPath = 0
    let nextIndexPath = 1
    let spdX = 0
    let spdZ = 0
    let numsToUpdate = 0
    let currentNumUpdate = 0
    let spd = 0.4


    const generateDataForMove = () => {
        ++currentIndexPath
        if (!arrPoints[currentIndexPath]) {
            currentIndexPath = 0
        }
        ++nextIndexPath
        if (!arrPoints[nextIndexPath]) {
            nextIndexPath = 0
        }


        const currentPos = arrPoints[currentIndexPath]
        const nextPos = arrPoints[nextIndexPath]

        tr.position.copy(currentPos)

        const d = nextPos.distanceTo(currentPos)
        numsToUpdate = d / spd
        currentNumUpdate = 0

        spdX = (nextPos.x - currentPos.x) / numsToUpdate
        spdZ = (nextPos.z - currentPos.z) / numsToUpdate
    }

    generateDataForMove()
    tr.position.copy(arrPoints[currentIndexPath])
    tr.lookAt(arrPoints[nextIndexPath])




    const savePos = new THREE.Vector3()
    const oldQ = new THREE.Quaternion()
    const newQ = new THREE.Quaternion()
    let spdRot = 0.05
    let phaseRot = 1

    const generateDataForRot = () => {
        let nextNextPos
        if (!arrPoints[nextIndexPath + 1]) {
            nextNextPos = arrPoints[0]
        } else {
            nextNextPos = arrPoints[nextIndexPath + 1]
        }

        savePos.copy(tr.position)
        tr.position.copy(arrPoints[nextIndexPath])
        oldQ.copy(tr.quaternion)
        tr.lookAt(nextNextPos)
        newQ.copy(tr.quaternion)
        tr.quaternion.copy(oldQ)
        tr.position.copy(savePos)

        phaseRot = 0
    }


    return {
        update: n => {
            spotLight.rotation.y += 0.01
            const [is] = collision.checkCollisions(centerObj, frontObj, 10)
            if (is) {
                return;
            }

            if (phaseRot < 1) {
                phaseRot += (spdRot * n)
                tr.quaternion.slerpQuaternions(oldQ, newQ, Math.min(1, phaseRot))
            } else {
                phaseRot = 1
            }
            tr.position.x += (spdX * n)
            tr.position.z += (spdZ * n)
            currentNumUpdate += (1 * n)
            if (currentNumUpdate > numsToUpdate) {
                generateDataForMove()
            }
            if (phaseRot === 1 && currentNumUpdate + 5 > numsToUpdate) {
                generateDataForRot()
            }
        },
        setPlayerToCollisions: (mesh) => {
            collision.setItemToCollision(mesh)
        },
        getCollBox: () => collBox,
    }
}