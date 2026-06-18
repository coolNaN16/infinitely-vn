function toggleStorageDisplay() {
    const blur = document.getElementById("blur")
    const storage = document.getElementById("storageUI")
    const cpanel = document.getElementById("controlPanel")
    if (storage.style.display == "flex") {
        storage.style.translate = "-100% 0"
        blur.style.opacity = 0

        setTimeout(function() {
            storage.style.display = "none"
            blur.style.display = "none"
        }, 500)
        
    } else {
        fadeToHalf()
        storage.style.display = "flex"
        blur.style.display = "block"
        
        requestAnimationFrame(() => {
            storage.style.translate = "0 0"
            blur.style.opacity = 1
        })
    }

    if (cpanel.style.display == "none") {
        cpanel.style.display = "block"

        requestAnimationFrame(() => {
            fadeToVolume()
            cpanel.style.translate = "0 0"
        })
    } else {
        cpanel.style.translate = "0 100%"
        setTimeout(function() {
            cpanel.style.display = "none"
        }, 200)
    }
}

// window.toggleStorageDisplay = toggleStorageDisplay()

function fadeToMute(callback) {
    let interval = setInterval(() => {
        bgMusic.volume = Math.max(0, bgMusic.volume - 0.01)

        if (bgMusic.volume <= 0) {
            clearInterval(interval)

            if (callback) {
                callback()
            }
        }
    }, 10)
}

function fadeToHalf(callback) {
    let interval = setInterval(() => {
        bgMusic.volume = Math.max(0, bgMusic.volume - 0.01)

        if (bgMusic.volume <= 0.05) {
            clearInterval(interval)

            if (callback) {
                callback()
            }
        }
    }, 10)
}


function fadeToVolume() {
    for (let i = 0; i < 100; i++) {
        setTimeout(function() {
            console.log(bgMusic.volume)
            if (bgMusic.volume < musicVolume) {
                bgMusic.volume += 0.01
            }
        }, 10 * i)
    }
}
