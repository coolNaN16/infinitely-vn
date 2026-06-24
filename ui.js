function toggleSidebarDisplay(id, dir) {

    chosenVolume = document.getElementById("volumeInput").value
    bgMusic.volume = chosenVolume / 100
    const blur = document.getElementById("blur")
    const storage = document.getElementById(id)
    const cpanel = document.getElementById("controlPanel")
    if (storage.style.display == "flex") {
        if (!dir) {
            storage.style.translate = "-100% 0"
        } else {
            storage.style.translate = "100% 0"
        }
        
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

    if (!dir) {
        if (cpanel.style.display == "none") {
            cpanel.style.display = "flex"

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
    } else {

    }

}

function hideSidebarDisplay(id) {
    const blur = document.getElementById("blur")
    const storage = document.getElementById(id)
    const cpanel = document.getElementById("controlPanel")
    if (storage.style.display == "flex") {
        storage.style.translate = "-100% 0"
        blur.style.opacity = 0

        setTimeout(function() {
            storage.style.display = "none"
            blur.style.display = "none"
        }, 500)
        
    } else {
    }

    if (cpanel.style.display == "none") {
        cpanel.style.display = "flex"

        requestAnimationFrame(() => {
            fadeToVolume()
            cpanel.style.translate = "0 0"
        })
    } else {
    }
}

function toggleAudioPerm() {
    const ele = document.getElementById("audioPermission")
    const children = ele.children

    ele.style.opacity = 0
    for (const child of children) {
        child.style.transform = "translateY(100%)"
        setTimeout(function() {
            child.style.display = "none"
        }, 1000)
    }

    setTimeout(function() {
        ele.remove()
    }, 1000)
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
    console.log("fadingtovolume...")
    for (let i = 0; i < 100; i++) {
        setTimeout(function() {
            console.log(bgMusic.volume)
            if (bgMusic.volume < musicVolume) {
                bgMusic.volume += 0.01
            }
        }, 10 * i)
    }
}

async function lockLandscape() {
    // try {
    //     // 1. Request fullscreen mode
    //     if (!document.fullscreenElement) {
    //     await document.documentElement.requestFullscreen();
    //     }
        
    //     // 2. Lock the screen orientation
    //     await screen.orientation.lock("landscape");
    //     console.log("Orientation locked to landscape!");
    // } catch (error) {
    //     console.error("Locking failed: ", error);
    // }
}

// Unlock later if needed
function unlockOrientation() {
    screen.orientation.unlock(); // Removes the orientation lock
    if (document.fullscreenElement) {
        document.exitFullscreen(); // Exits fullscreen mode
    }
}


const hvrBtns = document.querySelectorAll("button")
const hvrSound = new Audio("assets/audio/click3.mp3")
const clkSound = new Audio("assets/audio/click5.mp3")
hvrSound.volume = 0.1

for (const btn of hvrBtns) {
    btn.addEventListener("mouseenter", function() {
        hvrSound.src = `assets/audio/click${3}.mp3`
        hvrSound.currentTime = 0
        hvrSound.play()
    })

    btn.addEventListener("pointerdown", function() {
        // clkSound.currentTime = 0
        // clkSound.play()
    })
}
