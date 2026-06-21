const background = document.getElementById("bg")
const foreground = document.getElementById("fg")
const dialogueLabel = document.getElementById("dialogueLabel")
const nameLabel = document.getElementById("nameLabel")
const overlay = document.getElementById("overlay")
const choiceBox = document.getElementById("choiceBox")
const nextBtn = document.getElementById("nextBtn")
const mainMenu = document.getElementById("mainMenu")

const dialogueCD = 0.3
let lastDialogue = Date.now()
let dialogueTypeFinished = true
let dialogueTypeSkip = false
let canContinue = true

function getInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled);
}


const clickAudios = [
    new Audio("assets/audio/click.mp3"),
    new Audio("assets/audio/click2.mp3")
]

class Choice {
    constructor(choices) {
        this.choices = choices
        /* STRUCTURE
        {
            "text" : "yes",
            "outcome" : changeNextScene(scene)
        } */
    }

    // chosen() {
    //     currentDialogues.push()
    // }

    displayChoice() {
        choiceBox.style.display = "flex"
        choiceBox.innerHTML = ""
        canContinue = false
        for (const choice of this.choices) {
            const btn = document.createElement("button")
            btn.innerText = choice.text
            btn.addEventListener("click", () => {
                choiceBox.style.display = "none"
                choice.outcome()
            })

            choiceBox.append(btn)
        }
    }

    removeOption(option) {
        this.choices[option].remove()
    }
}

let typingSpeed = 30
class Dialogue {
    constructor(char, text, choices, emotion, nextScene, func) {
        this.char = char
        this.text = text
        this.choices = null
        if (choices) {
            this.choices = choices
        }

        this.nextScene = null
        if (nextScene) {
            this.nextScene = nextScene
        }

        this.func = null
        if (func) {
            this.func = func
        }

        this.emotion = emotion

    }

    display() {
        const thisDialogueIndex = cDialogueIndex
        const thisScene = currentScene
        dialogueLabel.innerHTML = ""

        dialogueTypeFinished = false
        dialogueTypeSkip = false
        nextBtn.style.display = "none"

        if (this.func) {
            this.func()
        }

        for (let i = 0; i < this.text.length; i++) {
            setTimeout(() => {
                if (cDialogueIndex == thisDialogueIndex && currentScene == thisScene && dialogueTypeSkip == false) {
                    dialogueLabel.innerHTML += this.text.charAt(i)
                    if (i < this.text.length - 1) {
                        dialogueLabel.innerHTML = this.text.slice(0, i)
                    } else {dialogueLabel.innerHTML = this.text}
                    for (const audio of clickAudios) {
                        audio.volume = document.getElementById("typeVolumeInput").value / 100
                    }
                    clickAudios[getInt(0, 1)].play()
                    // clickAudios[0].play()
                }
                if (i == this.text.length - 1 && cDialogueIndex == thisDialogueIndex && currentScene == thisScene) {
                    dialogueTypeFinished = true
                    nextBtn.style.display = "block"
                    nextBtn.offsetHeight

                    if (this.nextScene) {
                        currentScene = this.nextScene
                        cDialogueIndex = 0
                        slidein()
                        canContinue = false

                        setTimeout(() => {
                            currentScene = this.nextScene
                            cDialogueIndex = 0

                            scenes[currentScene].changeScene()

                            slideout()

                            setTimeout(() => {
                                canContinue = true
                                next()
                            }, 500)

                        }, 1500)
                    }
                }
                
            }, typingSpeed * i)
        }
        if (this.choices) {
            this.choices.displayChoice()
        } else {
            choiceBox.style.display = "none"
        }


        nameLabel.innerHTML = this.char.name

        for (const char of scenes[currentScene].characters) {
            if (!char) {
                continue
            }
            char.char.img.style.animationName = ""
            char.char.listen()
        }
        this.char.talk()
        this.char.bounce()
        this.char.img.src = `${this.char.sprites}/${this.emotion}.webp`
    }
}

class Character {
    constructor(name, sprites) {
        this.name = name
        this.sprites = sprites

        this.state = "listening"

        this.img = document.createElement("img")
        this.img.src = `${this.sprites}/neutral.webp`
        this.img.className = "standing"
        this.img.offsetWidth
    }

    appear(x, y) {
        this.img.classList.add("character")
        this.img.style.left = x + "%"
        this.img.style.bottom = y + "%"
        foreground.append(this.img)
        requestAnimationFrame(() => {
            this.bounce()
        })
    }

    moveTo(x, y) {
        this.img.style.left = x + "%"
        this.img.style.bottom = y + "%"
    }

    removeOtherStates() {
        this.img.classList.remove("talking", "hidden", "listening" ,"standing")
    }

    talk() {this.removeOtherStates(); this.img.classList.add("talking")}
    hide() {this.removeOtherStates(); this.img.classList.add("hidden"); this.img.style.animationName = ""}
    listen() {this.removeOtherStates(); this.img.classList.add("listening"); this.img.style.animationName = ""}
    normal() {this.removeOtherStates(); this.img.classList.add("standing"); this.img.style.animationName = ""}
    bounce() {
        this.img.style.animationName = ""
        this.img.style.animationDuration = ""
        this.img.offsetWidth
        this.img.style.animationName = "bounce"
        this.img.style.animationDuration = "200ms"
        this.img.offsetWidth
    }
}

let musicChanging = false
let currentBgMusic = ""
let musicVolume = document.getElementById("volumeInput").value / 100
let bgMusic = new Audio()
bgMusic.id = "bgm"

bgMusic.volume = musicVolume
bgMusic.loop = true

function getPermission() {
    currentBgMusic = "assets/audio/chill.mp3"
    bgMusic.src = currentBgMusic
    bgMusic.currentTime = 0
    bgMusic.play()
}

function changeMusic(source) {
    fadeToMute()
    setTimeout(function() {
        currentBgMusic = source
        bgMusic.src = source
        bgMusic.currentTime = 0
        bgMusic.play()
        fadeToVolume()
    }, 1000)
}

// function fadeToMute(callback) {
//     let interval = setInterval(() => {
//         bgMusic.volume = Math.max(0, bgMusic.volume - 0.01)

//         if (bgMusic.volume <= 0) {
//             clearInterval(interval)

//             if (callback) {
//                 callback()
//             }
//         }
//     }, 10)
// }

// function fadeToHalf(callback) {
//     let interval = setInterval(() => {
//         bgMusic.volume = Math.max(0, bgMusic.volume - 0.01)

//         if (bgMusic.volume <= bgMusic.volume / 2) {
//             clearInterval(interval)

//             if (callback) {
//                 callback()
//             }
//         }
//     }, 10)
// }

// function fadeToVolume() {
//     for (let i = 0; i < 100; i++) {
//         setTimeout(function() {
//             if (bgMusic.volume < musicVolume) {
//                 bgMusic.volume += 0.01
//             }
//         }, 10 * i)
//     }
// }

class Scene {
    constructor(bg, music, characters, dialogues) {
        this.bg = `url(${bg})`
        this.characters = characters
        this.dialogues = dialogues
        this.music = music
    }

    draw() {
        if (currentBgMusic != this.music) {
            if (musicChanging == false) {
                currentBgMusic = this.music
                musicChanging = true
                fadeToMute(() => {
                    bgMusic.src = this.music
                    currentBgMusic = this.music

                    bgMusic.currentTime = 0
                    console.log("MUSIC STARTS: ", currentBgMusic)
                    bgMusic.play()

                    fadeToVolume()
                    musicChanging = false
                })
            }
            
        }
        background.style.backgroundImage = this.bg
        console.log(this.bg)
        // foreground.innerHTML = ""
        for(let i = 0; i < this.characters.length; i++) {
            if (this.characters[i] == null) {
                continue
            }
            const cChar = this.characters[i]
            if (cDialogueIndex <= 1) {
                 this.characters[i].char.appear(cChar.x, cChar.y)
            }   
           
        }

        this.dialogues[cDialogueIndex - 1].display()
    }

    loadChars() {
        for(let i = 0; i < this.characters.length; i++) {
            if (this.characters[i] == null) {
                continue
            }
            const cChar = this.characters[i]

            this.characters[i].char.appear(cChar.x, cChar.y)
        }
    }

    changeScene() {
        background.style.backgroundImage = this.bg
        foreground.innerHTML = ""
        dialogueLabel.innerHTML = ""
        if (currentBgMusic != this.music) {
            fadeToMute(() => {
                bgMusic.src = this.music
                currentBgMusic = this.music

                bgMusic.currentTime = 0
                bgMusic.play()

                fadeToVolume()
            })
        }
    }
}


const haibara = new Character("Haibara Ai", "assets/chars/haibara")

const conan = new Character("Edogawa Conan", "assets/chars/conan")


const scenes = {
    "start" : new Scene("assets/bg/police.jpg", "assets/audio/chill.mp3", [
        {
            "char" : haibara,
            "x" : 50,
            "y" : -5
        }
    ], [
        new Dialogue(haibara, "Hello there, welcome to <b>Beika!</b>", null, "neutral"),
        new Dialogue(haibara, "My name is <b>Haibara Ai</b>!", null, "neutral"),
        new Dialogue(haibara, "And im gonna be your tour guide for the day!", null, "neutral"),
        new Dialogue(haibara, "Let's get started!, ", null, "neutral"),
        new Dialogue(haibara, "Follow me!", null, "neutral"),
        new Dialogue(haibara, " ", null, "neutral", "MouriAgency"),
    ]),
    "MouriAgency" : new Scene("assets/bg/mouri2.png", "assets/audio/chill.mp3", [
        {
            "char" : haibara,
            "x" : 20,
            "y" : -10
        }
    ],[
        new Dialogue(haibara, "This is <b>Detective Mouri's Agency</b>!", null, "neutral"),
        new Dialogue(haibara, "<b>Detective Mouri</b> works and lives here along with his daughter <b>Ran</b>, ", null, "neutral"),
        new Dialogue(haibara, "Oh yeah, <b>Conan</b> also lives here!", null, "neutral"),
        new Dialogue(conan, "Hi!, ", null, "neutral", null, () => {addCharToScene(conan, 80, -10)}),
        new Dialogue(haibara, "Oh, hello!, ", null, "neutral"),
        new Dialogue(haibara, "People usually go here to resolve their <b>problems</b>, ", null, "neutral", null, () => {removeChar(conan)}),
        new Dialogue(haibara, "Like seriously, sometimes it's not even a case!, ", null, "neutral"),
        new Dialogue(haibara, "Anyways... lets continue! ", null, "neutral"),
        new Dialogue(haibara, "Soo, where do you wanna go now?, ", 
            new Choice([{
                "text" : "Agasa's House",
                "outcome" : () => {changeNextScene("AgasaHouse")}
            }, {
                "text" : "Say that again?",
                "outcome" : () => {changeNextScene("MouriAgency")}
            }]
        ), "neutral", null, () => {haibara.moveTo(50, -10)}),
        new Dialogue(haibara, "Alright!", null, "neutral"),
        new Dialogue(haibara, " ", null, "neutral", "start"),
    ]),
    "AgasaHouse" : new Scene("assets/bg/agasa.jpg", "assets/audio/chill.mp3", [
        {
            "char" : haibara,
            "x" : 20,
            "y" : -10
        }
    ],[
        new Dialogue(haibara, "Here it is!", null, "neutral"),
        new Dialogue(haibara, "The <b>myth</b>, ", null, "neutral"),
        new Dialogue(haibara, "The <b>legend</b>, ", null, "neutral"),
        new Dialogue(haibara, "<b>My House!!!!!</b>, ", null, "neutral", null, () => {haibara.moveTo(50, -10)}),
        new Dialogue(haibara, "Well, not really my house i guess, it's <b>Professor Agasa's House!!!</b>", null, "neutral", null, () => {haibara.moveTo(20, -10)}),
        new Dialogue(haibara, "Located at <b>2-22, Beika Town, Beika City,</b>", null, "neutral"),
        new Dialogue(haibara, "This is where I live after i shrunk into <b>Haibara.</b>", null, "neutral"),
        new Dialogue(haibara, "Alright then, where do you wanna go now? ", 
            new Choice([{
                "text" : "Back to Kogoro pls",
                "outcome" : () => {changeNextScene("MouriAgency")}
            }, {
                "text" : "Say that again?",
                "outcome" : () => {changeNextScene("AgasaHouse")}
            }]
        ), "neutral", null, () => {haibara.moveTo(50, -10)}),
        new Dialogue(haibara, "Alright!", null, "neutral"),
        new Dialogue(haibara, " ", null, "neutral", "start"),
    ])
}

let currentScene = "start"
let cDialogueIndex = 0
let currentDialogues = []

function slidein() {
    overlay.style.display = "block"
    overlay.style.animationName = "fade-in"
    overlay.offsetWidth
    for (let i = 0; i < 100; i++) {
        setTimeout(function() {
            if (bgMusic.volume > musicVolume / 2) {
                bgMusic.volume -= 0.01
            }
        }, 10 * i)
    }
}

function slideout() {
    
    overlay.style.animationName = "fade-out"
    overlay.offsetWidth
    musicVolume = document.getElementById("volumeInput").value / 100
    for (let i = 0; i < 100; i++) {
        setTimeout(function() {
            
            if (bgMusic.volume < musicVolume) {
                console.log(bgMusic.volume, " VOL")
                bgMusic.volume += 0.01
            }
        }, 10 * i)
    }
    setTimeout(function() {
        overlay.style.display = "none"
    }, 1000)
}

function insertDialogue(array) {
    canContinue = true
    for (const dialogue of array) {
        currentDialogues.push(dialogue)
    }
    next()
}

function addCharToScene(char, x, y) {
    scenes[currentScene].characters.push({
        "char" : char,
        "x" : x,
        "y" : y
    })
    char.appear(x, y)
    
}

// function moveChar(char, x, y) {
//     let chChar
//     for (const character of scenes[currentScene].characters) {
//         if (character.char == char) {
//             chChar = character
//         }
//     }

//     chChar.x = x
//     chChar.y = y
//     chChar.char.appear(x, y)
// }

function removeChar(char) {
    scenes[currentScene].characters = scenes[currentScene].characters.filter(character => character.char !== char)

    char.bounce()
    setTimeout(function() {
        char.img.remove()
    }, 200)
}

function changeNextScene(scene) {
    console.log(currentDialogues)
    console.log(scenes[currentScene].dialogues)
    console.log("clicked", scene)

    scenes[currentScene]
        .dialogues[scenes[currentScene].dialogues.length - 1]
        .nextScene = scene

    canContinue = true

    lastDialogue = 0
    // cDialogueIndex += 1
    next()
    // slidein()
    // canContinue = false
    // cDialogueIndex = 0
    // setTimeout(function() {
    //     slideout()
    //     scenes[currentScene].changeScene()
    //     setTimeout(function() {
    //         canContinue = true
    //         next()
    //     }, 500)
    // }, 1500)
}

function next() {
    saveRun('CSlot')
    inMenu = false
    if (scenes[currentScene] && canContinue == true) {
        if (Date.now() - lastDialogue >= dialogueCD * 1000 && dialogueTypeFinished == true) {
            lastDialogue = Date.now()
            currentDialogues = scenes[currentScene].dialogues
            console.log(cDialogueIndex)
            console.log(currentDialogues.length)
            if (cDialogueIndex < currentDialogues.length) {
                cDialogueIndex += 1 
            } else {
                // slidein()
                // canContinue = false
                // cDialogueIndex = 0
                // setTimeout(function() {
                //     slideout()
                //     scenes[currentScene].changeScene()
                //     setTimeout(function() {
                //         canContinue = true
                //         next()
                //     }, 500)
                // }, 1500)
            }
            if (canContinue == true) {
                scenes[currentScene].draw()
            }
            
        } else if (dialogueTypeFinished == false) {
            dialogueTypeSkip = true
            dialogueTypeFinished = true
            lastDialogue = Date.now()
            dialogueLabel.innerHTML = currentDialogues[cDialogueIndex - 1].text
            nextBtn.style.display = "block"
            nextBtn.offsetHeight
        }
    }
}

document.getElementById("dialogueBox").addEventListener("pointerdown", function(event) {
    next()
})

window.addEventListener("keydown", function(event) {
    if (event.repeat) return
    if (event.code == "Space" || event.key == "w") {
        next()
        typingSpeed = 1
    }
})

window.addEventListener("keyup", function(event) {
    if (event.code == "Space" || event.key == "w") {
        typingSpeed = 30
    }
})




let saves = {// Scene - Dialogue - Date
    "Slot-1" : ["", 0, ""],
    "Slot-2" : ["", 0, ""],
    "Slot-3" : ["", 0, ""],
    "Slot-4" : ["", 0, ""],
    "CSlot"  : ["start", 0, "now"]
}

if (localStorage.getItem('saves')) {
    saves = JSON.parse(localStorage.getItem('saves'))
} else {
    localStorage.setItem("saves", saves)
}

for (let i = 1; i <= 4; i++) {
    console.log(i)
    document.getElementById(`Slot-${i}`).value = saves[`Slot-${i}`][2]
}


function saveRun(slot) {
    if (!saves[slot]) {
        saves[slot] = [currentScene, cDialogueIndex, 0]
    }

    if (!dialogueTypeFinished && slot != "CSlot") {

        dialogueTypeSkip = true
        dialogueTypeFinished = true

        dialogueLabel.innerHTML = currentDialogues[cDialogueIndex - 1].text
    }

    const now = new Date()

    const year = now.getFullYear()
    const month = now.getMonth() + 1
    const date = now.getDate()

    const hour = now.getHours()
    const minutes = now.getMinutes()
    const sec = now.getSeconds()

    function pad(num) {
    return String(num).padStart(2, "0")
    }

    const stringDate =
    `${pad(date)}-${pad(month)}-${year}, ` +
    `${pad(hour)}:${pad(minutes)}:${pad(sec)}`

    console.log(stringDate)

    saves[slot][0] = currentScene
    saves[slot][1] = cDialogueIndex - 1
    saves[slot][2] = stringDate

    if (document.getElementById(slot)) {
        document.getElementById(slot).value = stringDate
    }   
    
    localStorage.setItem("saves", JSON.stringify(saves))
}

function loadRun(slot) {

    hideSidebarDisplay(`storageUI`)

    currentScene = saves[slot][0]
    cDialogueIndex = saves[slot][1]
    
    if (cDialogueIndex <= 0) {
        cDialogueIndex = 1
    }

    currentDialogues = scenes[currentScene].dialogues
    
    slidein()
    mainMenu.style.transform = "translateX(-100%)"
    setTimeout(function() {
        scenes[currentScene].changeScene()
        
        slideout()
        mainMenu.style.display = "none"
        document.getElementById("menuBg").style.display = "none"

        setTimeout(function() {
            // scenes[currentScene].draw()

            canContinue = true
            lastDialogue = 0
            scenes[currentScene].loadChars()
            bgMusic.currentTime = 0
            next()
        }, 500)
    }, 1500)

    document.getElementById("blocker").style.display = "none"
}

function newGame() {
    currentScene = "start"
    cDialogueIndex = 0
    currentDialogues = []
    canContinue = true
    dialogueTypeFinished = true

    mainMenu.style.transform = "translateX(-100%)"
    slidein()
    fadeToMute()
    setTimeout(function() {
        
        bgMusic.currentTime = 0
        mainMenu.style.display = "none"
        document.getElementById("menuBg").style.display = "none"
        
    }, 1000)

    setTimeout(function() {
        slideout()
        scenes[currentScene].changeScene()
        setTimeout(function() {
            fadeToVolume()
            next()
        }, 500)
    }, 1500)
    
    document.getElementById("blocker").style.display = "none"
    



}

let inMenu = true
function returnToMenu() {
    if (inMenu) return

    saveRun("CSlot")
    slidein()
    fadeToMute()
    
    setTimeout(function() {
        mainMenu.style.display = "flex"
        mainMenu.style.transform = "translateX(0)"
        changeMusic("assets/audio/chill.mp3")

        document.getElementById("menuBg").style.display = "block"
        
    }, 1000)

    setTimeout(function() {
        slideout()
        setTimeout(function() {
            fadeToVolume()
        }, 500)
    }, 2000)
    
    document.getElementById("blocker").style.display = "block"
}