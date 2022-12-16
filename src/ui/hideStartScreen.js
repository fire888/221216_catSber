import '../stylesheet/style.css'

const loader = document.querySelector('.progress')
let offsetLoader = -100
let isAnimateLoader = true

const startButton = document.querySelector('.start')
const progressWrapper = document.querySelector('.load-wrapper')

const loaderTimeOut = () => {
    if (!isAnimateLoader) {
        return;
    }
    setTimeout(() => {
        offsetLoader ++;
        if (offsetLoader === 0 ) {
            offsetLoader = -100
        }
        loader.style.marginLeft = offsetLoader + 'px'
        loaderTimeOut()
    }, 14)
}
loaderTimeOut()


const openFullScreen = () => {
    if (document.fullscreenElement) {
        return;
    }
    const cont = document.querySelector('.canvas-wrapper')

    if (cont.requestFullscreen) {
        cont.requestFullscreen()
    } else if (cont.mozRequestFullScreen) {
        cont.mozRequestFullScreen()
    } else if (cont.webkitRequestFullscreen) {
        cont.webkitRequestFullscreen()
    } else if (cont.msRequestFullscreen) {
        cont.msRequestFullscreen()
    }
}

export const hideStartScreen = (root, on) => {
    isAnimateLoader = false
    progressWrapper.classList.add('hidden')
        startButton.style.display = 'flex'
        startButton.classList.remove('hidden')
        startButton.addEventListener('click', () => {
            const startScreen = document.querySelector('.start-screen')
            startScreen.style.display = 'none'
            openFullScreen()
            on()
      })
}