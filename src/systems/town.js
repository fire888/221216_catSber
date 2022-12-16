import * as THREE from 'three'
import { SEGMENT_SIZE } from '../constants/constants_assetsToLoad'

const MODEL_KEYS = [
    'build_01',
    'build_02',
    'build_03',
    'build_04',
]

const TOWN = []
for (let i = 0; i < 200; ++i) {
    TOWN.push(Math.floor(Math.random() * MODEL_KEYS.length))
}
const L = Math.sqrt(TOWN.length)


export const createTown = root => {
    root.appData.cityLen  = L
    const mats = {
        'build_01': new THREE.MeshPhongMaterial({
            map: root.assets.b01Map,
            color: 0x0000FF,
        }),
        'build_02': new THREE.MeshPhongMaterial({
            map: root.assets.b02Map,
            color: 0x003388,
        }),
        'build_03': new THREE.MeshPhongMaterial({
            map: root.assets.b02Map,
            color: 0x9900FF,
        }),
        'build_04': new THREE.MeshPhongMaterial({
            color: 0x77FF00,
        }),
        'walkRoad': new THREE.MeshPhongMaterial({
            color: 0x333399,
        }),
        'lamp': new THREE.MeshBasicMaterial({
            color: 0xFFFFFF,
            fog: false,
        }),
        'default': new THREE.MeshPhongMaterial({
            color: 0x6666FF,
            envMap: root.assets.skyBox,
            reflectivity: .1,
            shininess: 50,
            bumpMap: root.assets.bumpMap,
            bumpScale: .1,

        }),
    }


    const instItems = {}
    root.assets.town.traverse(item => {
        if (item.geometry) {
            instItems[item.name] = item
        }
    })


    const ground = new THREE.Mesh(
        instItems['ground'].geometry,
        mats['default']
    )
    root.studio.addToScene(ground)



    const items = {}

    for (let i = 0; i < TOWN.length; ++i) {
        if (!instItems[MODEL_KEYS[TOWN[i]]]) {
            continue;
        }


        const numX = Math.floor(i % L )
        const numZ = Math.floor(i / L )
        const x = numX * SEGMENT_SIZE[0]
        const z = -numZ * SEGMENT_SIZE[1]


        const walkRoad = new THREE.Mesh(
            instItems['walk_road'].geometry,
            mats['walkRoad']
        )
        walkRoad.position.x = x
        walkRoad.position.z = -z
        root.studio.addToScene(walkRoad)

        const lamp = new THREE.Mesh(
            instItems['lamp'].geometry,
            mats['lamp']
        )
        lamp.position.x = x
        lamp.position.z = -z
        root.studio.addToScene(lamp)

        const b = new THREE.Mesh(
            instItems[MODEL_KEYS[TOWN[i]]].geometry,
            mats[MODEL_KEYS[TOWN[i]]] || mats['default']
        )
        b.position.x = x
        b.position.z = -z
        root.studio.addToScene(b)

        const bCollision = new THREE.Mesh(
            instItems['collision_b_01'].geometry,
            mats['default']
        )
        bCollision.position.x = x
        bCollision.position.z = -z
        bCollision.visible = false
        root.studio.addToScene(bCollision)

        items[`${numX}_${numZ}`] = {
            w: walkRoad,
            b: b,
            bCollision: bCollision,
            numX,
            numZ,
        }
    }

    root.appData.town = items

    return {}
}