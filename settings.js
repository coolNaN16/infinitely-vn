const volumeInput = document.getElementById("volumeInput")
const volumeLabel = document.getElementById("volumeLabel")
let chosenVolume = volumeInput.value


let settingJSON = {
    "volume" : chosenVolume 
}

if (JSON.parse(localStorage.getItem("settings"))) {
    settingJSON = JSON.parse(localStorage.getItem("settings"))
} else {
    localStorage.setItem("settings", JSON.stringify(settingJSON))
}

volumeInput.value = settingJSON.volume
volumeLabel.innerHTML = `Music volume: ${volumeInput.value}`
bgMusic.volume = settingJSON.volume / 100

volumeInput.addEventListener("input", function(event) {
    volumeLabel.innerHTML = `Music volume: ${event.target.value}`

    chosenVolume = event.target.value
    bgMusic.volume = chosenVolume / 100
})


function applySettings() {
    musicVolume = chosenVolume / 100
    bgMusic.volume = musicVolume

    settingJSON.volume = chosenVolume

    localStorage.setItem("settings", JSON.stringify(settingJSON))
}


