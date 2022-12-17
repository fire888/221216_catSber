import * as THREE from 'three'

export const createCat = root => {
    const model = root.assets.catModel.scene
    model.children[0].position.y = 0.34



    const clock = new THREE.Clock();
    const animations = root.assets.catModel.animations;
    const mixer = new THREE.AnimationMixer(model)

    const actions = {}

    for ( let i = 0; i < animations.length; i ++ ) {
        const clip = animations[ i ];
        const action = mixer.clipAction( clip );
        actions[clip.name] = action
    }

    actions['All Animations'].play()

    const mesh = new THREE.Object3D()
    mesh.add(model)

    return {
        mesh,
        animate: key => {

        },
        update: () => {
            const mixerUpdateDelta = clock.getDelta()
            mixer.update( mixerUpdateDelta )
        }
    }
}