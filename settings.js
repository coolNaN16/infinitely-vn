const volumeInput = document.getElementById("volumeInput")
const typingVolInput = document.getElementById("typeVolumeInput")
const volumeLabel = document.getElementById("volumeLabel")
let chosenVolume = volumeInput.value


let settingJSON = {
    "volume" : chosenVolume,
    "typeVolume" : typingVolInput.value
}

if (JSON.parse(localStorage.getItem("settings"))) {
    settingJSON = JSON.parse(localStorage.getItem("settings"))
    typingVolInput.value = settingJSON.typeVolume
    volumeInput.value = settingJSON.volume

    volumeInput.labels[0].innerHTML = `Music volume: ${volumeInput.value}`
    typingVolInput.labels[0].innerHTML = `Dialogue typing volume: ${typingVolInput.value}`
} else {
    localStorage.setItem("settings", JSON.stringify(settingJSON))
}

volumeInput.value = settingJSON.volume
volumeInput.labels[0] = `Music volume: ${settingJSON.volume}`
bgMusic.volume = settingJSON.volume / 100

const sliders = document.querySelectorAll(".volumeSliders")

for (const slider of sliders) {
    slider.addEventListener("input", function(event) {
        settingJSON.typeVolume = typingVolInput.value
        settingJSON.volume = volumeInput.value
        let labelt = ""
        if (slider.id == "volumeInput") {
            labelt = "Music volume: "
        } else if (slider.id = "typeVolumeInput") {
            labelt = "Dialogue typing volume: "
            
        }
        slider.labels[0].innerHTML = `${labelt} ${event.target.value}`
    })
}

volumeInput.addEventListener("input", function(event) {
        chosenVolume = event.target.value
        bgMusic.volume = chosenVolume / 100
    })

function applySettings() {
    musicVolume = chosenVolume / 100
    bgMusic.volume = musicVolume

    settingJSON.volume = chosenVolume

    localStorage.setItem("settings", JSON.stringify(settingJSON))
}


