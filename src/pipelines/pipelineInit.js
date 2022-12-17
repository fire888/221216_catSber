import {checkDevice} from "../helpers/checkDevice";
import {createStudio} from "../entities/studio";
import {createUiEvents} from "../helpers/createUiEvents";
import {createLoadManager} from "../helpers/loadManager";
import {ASSETS_TO_LOAD} from "../constants/constants_assetsToLoad";
import {createCat} from "../entities/cat";
import {createLevel} from "../entities/level";
import {startFrameUpdater} from "../helpers/createFrameUpater";
import {hideStartScreen} from "../ui/hideStartScreen";
import {gamePlay} from './gamePlay'

const root = {}

export const initApp = () => {
    root.device = checkDevice()
    root.studio = createStudio(root)
    root.uiEvents = createUiEvents(root)
    root.loadManager = createLoadManager()

    root.loadManager.startLoad(ASSETS_TO_LOAD).then(assets => {
        root.assets = assets
        root.cat = createCat(root)
        root.level = createLevel(root)
        root.studio.addToScene(root.cat.mesh)
        root.studio.setBack(assets.skyBox)

        root.frameUpdater = startFrameUpdater(root)
        root.frameUpdater.on(n => {
            root.cat.update()
            root.studio.render()
        })
        hideStartScreen(root, root.uiEvents.show)
        gamePlay(root)
    })
}