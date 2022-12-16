const NONE = 'NONE'
const INTRO_ANIMATION = 'INTRO_ANIMATION'
const SHOW_RULES = 'SHOW_RULES'
const SHOW_RULES_CAN_HIDE = 'SHOW_RULES_CAN_HIDE'
const MAIN_PLAY = 'MAIN_PLAY'
const RESULT_MAIN_PLAY = 'RESULT_MAIN_PLAY'
const QUESTIONS_PLAY = 'QESTIONS_PLAY'
const RESULT_QUESTIONS_PLAY = 'RESULT_QUESTIONS_PLAY'
let gameState = NONE

const root = {
    startPortal: null,
    catMessage: null,
    mainMessage: null,
    buttonLeftChoice: null,
    buttonRightChoice: null,
    buttonChioceCenter: null,
    cat: null,
    level: null,
    controlsCat: {
        left: null,
        right: null,
        top: null,
        bottom: null,
    },
}

const pause = t => new Promise(res => setTimeout(res, t))

const animateStartPortal = () => {
    const {startPortal} = root
    const arrElems = startPortal.object3D.children[0].children
    const speeds = []
    for (let i = 0; i < arrElems.length; ++i) {
        speeds.push(Math.random() * 0.1 + 0.15)
    }
    let isAnimate = true
    const animate = () => {
        if (!isAnimate) {
            return
        }
        for (let i = 0; i < arrElems.length; ++i) {
            arrElems[i].position.y += speeds[i]
        }
        requestAnimationFrame(animate)
    }
    animate()

    return new Promise(
        (res) => {
            setTimeout(() => {
                isAnimate = false
                res()
            }, 3000)
        }
    )
}

async function playIntro() {
    const {
        mainMessage,
        startPortal,
        cat,
        buttonLeftChoice,
        buttonRightChoice,
    } = root

    mainMessage.innerText = ''
    startPortal.object3D.visible = true
    await animateStartPortal()
    startPortal.object3D.visible = false
    cat.object3D.visible = true
    console.log(cat.object3D)
    mainMessage.innerText = 'Привет! А у нас праздник - Сбербанку 181 год!'

    buttonLeftChoice.innerText = 'Сыграть в игру о финансовой грамотности'
    buttonRightChoice.innerText = 'Перейти к подаркам'
    buttonLeftChoice.style.display = 'block'
    buttonRightChoice.style.display = 'block'
}

async function preparePlay() {
    const {
        level,
        buttonLeftChoice,
        buttonRightChoice,
        mainMessage,
    } = root

    level.object3D.visible = true
    buttonLeftChoice.innerText = ''
    buttonRightChoice.innerText = ''
    mainMessage.innerText = ''
    await pause(1500)
    mainMessage.innerText = 'Помоги СберКоту забраться на самый верх и получить подарок Прыжок Нажимай на стрелочки, чтобы перемещать кота'
}

const onClick = (e) => {
    if (gameState === NONE) {
        gameState = INTRO_ANIMATION
        playIntro().then()
        return
    }
    if (gameState === INTRO_ANIMATION) {
        if (e.target.id === 'left-choice') {
            gameState = SHOW_RULES
            preparePlay().then(() => {
                gameState = SHOW_RULES_CAN_HIDE
            })
        }
        if (e.target.id === 'right-choice') {
            window.location.replace('https://likevr.ru/')
        }
        return
    }
    if (gameState === SHOW_RULES_CAN_HIDE) {
        gameState = MAIN_PLAY
        root.mainMessage.innerText = ''
    }
}

const gameStateComponent = {
    init() {
        const mainMessage = document.querySelector('#main-message')
        mainMessage.innerText = 'Выбери место на плоскости'
        mainMessage.style.display = 'block'
        root.mainMessage = mainMessage

        const level = document.querySelector('#model')
        level.object3D.visible = false
        root.level = level

        const cat = document.querySelector('#cat')
        cat.object3D.visible = false
        root.cat = cat

        const startPortal = document.querySelector('#gifts')
        startPortal.object3D.visible = false
        root.startPortal = startPortal

        root.buttonLeftChoice = document.querySelector('#left-choice')
        root.buttonRightChoice = document.querySelector('#right-choice')

        document.body.addEventListener('click', onClick)
    },
}
export {gameStateComponent}