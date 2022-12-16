export function createKeyBoard (root) {
    const fns = []

    const keys = {
        'up': false,
        'left': false,
        'right': false,
        'down': false,
        's': false,
        'm': false,
        'w': false,
    }

    const keyUpdate = (keyCode, isDown) => {
        switch( keyCode ) {
            case 38:
                keys['up'] = isDown
                break
            case 37:
                keys['left'] = isDown
                break
            case 39:
                keys['right'] = isDown
                break
            case 40:
                keys['down'] = isDown
                break
            case 65:
                keys['left'] = isDown
                break
            case 68:
                keys['right'] = isDown
                break
            case 83:
                keys['down'] = isDown
                break
            case 87:
                keys['up'] = isDown
                break
        }
        for (let i = 0; i < fns.length; ++i) {
            fns[i](keys)
        }
    }

    document.addEventListener( 'keydown', e => keyUpdate(e.keyCode, true))
    document.addEventListener( 'keyup', e => keyUpdate(e.keyCode, false))

    const arr = [
        { domClass: '.arrow-left',  keyCode: 37, domElem: null },
        { domClass: '.arrow-right',  keyCode: 39, domElem: null  },
        { domClass: '.arrow-top',  keyCode: 38, domElem: null },
        { domClass: '.arrow-bottom',  keyCode: 40, domElem: null },
    ]


    for (let i = 0; i < arr.length; ++i) {
        const elem = document.querySelector(arr[i].domClass)
        if (elem) {
            arr[i].domElem = elem
            elem.addEventListener('mousedown', () => keyUpdate(arr[i].keyCode, true))
            elem.addEventListener('mouseup', () => keyUpdate(arr[i].keyCode, false))
            elem.addEventListener('touchstart', () => keyUpdate(arr[i].keyCode, true))
            elem.addEventListener('touchend', () => keyUpdate( arr[i].keyCode, false))
        }
    }

   return {
        on: f => {
            fns.push(f)
        },
        show: () => {
            if (root.device.deviceType === 'desktop') {
                return;
            }
            for (let i = 0; i < arr.length; ++i) {
                arr[i].domElem.classList.remove('hidden')
            }
        }
   }
}