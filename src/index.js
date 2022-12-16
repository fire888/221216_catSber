import { checkDevice } from './utils/checkDevice'
import { hideStartScreen } from './ui/hideStartScreen'
import { createStudio } from './entities/studio'
import { createKeyBoard } from './utils/createKeyBoard'
import { createLoadManager } from './helpers/loadManager'
import { createPlayer } from './entities/player'
import { startFrameUpdater  } from './utils/createFrameUpater'
import { ASSETS_TO_LOAD } from './constants/constants_assetsToLoad'
import { createCyberTruck } from  './systems/cyberTruck'
import { createTown } from './systems/town'


const root = {
    appData: {}
}


const initApp = () => {
    root.device = checkDevice()
    root.studio = createStudio(root)
    root.keyboard = createKeyBoard(root)
    root.loadManager = createLoadManager()

    root.loadManager.startLoad(ASSETS_TO_LOAD).then(assets => {
        root.studio.setBack(assets.skyBox)
        root.assets = assets
        root.town = createTown(root)
        root.cyberTruck = createCyberTruck(root)
        root.player = createPlayer(root)
        root.studio.setCamera(root.player.getCamera())
        root.cyberTruck.setPlayerToCollisions(root.player.getCollisionMesh())


        root.frameUpdater = startFrameUpdater(root)
        root.frameUpdater.on(n => {
            root.player.update(n)
            root.cyberTruck.update(n)
            root.studio.render()
        })
        hideStartScreen(root, root.keyboard.show)
    })
}


window.addEventListener('load', initApp)
