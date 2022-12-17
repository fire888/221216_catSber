import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


export const createStudio = () => {
    const renderer = new THREE.WebGLRenderer({
        canvas: document.getElementById( 'webgl-canvas' ),
        antialias: true,
    })
    renderer.setClearColor(0x000000)
    renderer.setPixelRatio( window.devicePixelRatio)
    renderer.setSize( window.innerWidth, window.innerHeight )

    //let camera
    const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
    camera.position.set( 5, 2, 8 );

    const controls = new OrbitControls( camera, renderer.domElement );
    controls.target.set( 0, 0.5, 0 );
    controls.update();
    //controls.enablePan = false;
    controls.enableDamping = true;

    const scene = new THREE.Scene()

    const lightA = new THREE.AmbientLight( 0x4c1200, 1 )
    lightA.position.set( 5, 5, 5 )
    scene.add( lightA )

    const light = new THREE.PointLight( 0x5b7558, 2, 10000)
    light.position.set( -100, 100, 200)
    scene.add( light )
    scene.fog = new THREE.Fog(0x000000, 0, 200)


    const resize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight)
        if (camera) {
            camera.aspect = window.innerWidth / window.innerHeight
            camera.updateProjectionMatrix()
        }
    }
    window.addEventListener('resize', resize)


    return {
        light,
        render: () => {
            if (!camera ) {
                return;
            }
            controls.update();
            renderer.render(scene, camera)
        },
        addToScene: mesh => {
            scene.add(mesh)
        },
        setBack: back => {
            scene.background = back
        }
    }
}