const background = document.getElementById("bg")
const foreground = document.getElementById("fg")
const dialogueLabel = document.getElementById("dialogueLabel")
const nameLabel = document.getElementById("nameLabel")
const overlay = document.getElementById("overlay")
const choiceBox = document.getElementById("choiceBox")
const nextBtn = document.getElementById("nextBtn")

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
    constructor(char, text, choices, emotion, nextScene) {
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

        this.emotion = emotion

    }

    display() {
        const thisDialogueIndex = cDialogueIndex
        const thisScene = currentScene
        dialogueLabel.innerHTML = ""

        dialogueTypeFinished = false
        dialogueTypeSkip = false
        nextBtn.style.display = "none"
        for (let i = 0; i < this.text.length; i++) {
            setTimeout(() => {
                if (cDialogueIndex == thisDialogueIndex && currentScene == thisScene && dialogueTypeSkip == false) {
                    dialogueLabel.innerHTML += this.text.charAt(i)
                    if (i < this.text.length - 1) {
                        dialogueLabel.innerHTML = this.text.slice(0, i)
                    } else {dialogueLabel.innerHTML = this.text}
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
        }


        nameLabel.innerHTML = this.char.name

        for (const char of scenes[currentScene].characters) {
            if (!char) {
                continue
            }
            this.char.img.style.animationName = ""
            char.listen()
        }
        this.char.talk()
        this.char.bounce()
        this.char.img.src = this.char.sprites[this.emotion]
    }
}

class Character {
    constructor(name, sprites) {
        this.name = name
        this.sprites = sprites

        this.state = "listening"

        this.img = document.createElement("img")
        this.img.src = this.sprites.neutral
        this.img.className = "standing"
        this.img.offsetWidth
    }

    appear(order) {
        this.img.id = `character-${order}`
        foreground.append(this.img)
    }

    talk() {this.img.className = "talking"}
    hide() {this.img.className = "hidden"; this.img.style.animationName = ""}
    listen() {this.img.className = "listening"; this.img.style.animationName = ""}
    normal() {this.img.className = "standing"; this.img.style.animationName = ""}
    bounce() {
        this.img.style.animationName = "bounce"
        this.img.style.animationDuration = "200ms"
        this.img.offsetWidth
    }
}

let musicChanging = false
let currentBgMusic = ""
let musicVolume = 0.3
let bgMusic = new Audio()

bgMusic.volume = musicVolume
bgMusic.loop = true


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
        foreground.innerHTML = ""
        for(let i = 0; i < this.characters.length; i++) {
            if (this.characters[i] == null) {
                continue
            }
            this.characters[i].appear(i + 1)
        }

        this.dialogues[cDialogueIndex - 1].display()
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


const haibara = new Character("Haibara Ai", {
    "neutral"   : "assets/chars/haibara.webp",
    "angry"     : "assets/bg/autumn.webp"   
})

const haibara2 = new Character("Haibarae", {
    "neutral"   : "assets/chars/haibara.webp",
    "angry"     : "assets/bg/autumn.webp"   
})


const scenes = {
    "start" : new Scene("assets/bg/beika.jpg", "assets/audio/chill.mp3", [
        null,
        null,
        null,
        null,
        haibara
    ], [
        new Dialogue(haibara, "Hello there, welcome to <b>Beika!</b>", null, "neutral"),
        new Dialogue(haibara, "My name is <b>Haibara Ai</b>!", null, "neutral"),
        new Dialogue(haibara, "And im gonna be your tour guide for the day!", null, "neutral"),
        new Dialogue(haibara, "Let's get started!, ", null, "neutral"),
        new Dialogue(haibara, "Follow me!", null, "neutral"),
        new Dialogue(haibara, " ", null, "neutral", "MouriAgency"),
    ]),
    "MouriAgency" : new Scene("assets/bg/mouri2.png", "assets/audio/chill.mp3", [
        haibara,
        null,
        null,
        null
    ],[
        new Dialogue(haibara, "This is <b>Detective Mouri's Detective Agency</b>!", null, "neutral"),
        new Dialogue(haibara, "<b>Detective Mouri</b> works and lives here along with his daughter <b>Ran</b>, ", null, "neutral"),
        new Dialogue(haibara, "Oh yeah, <b>Conan</b> also lives here!", null, "neutral"),
        new Dialogue(haibara, "People usually go here to resolve their <b>problems</b>, ", null, "neutral"),
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
        ), "neutral"),
        new Dialogue(haibara, "Alright!", null, "neutral"),
        new Dialogue(haibara, " ", null, "neutral", "start"),
    ]),
    "AgasaHouse" : new Scene("assets/bg/agasa.jpg", "assets/audio/chill.mp3", [
        haibara,
        null,
        null,
        null
    ],[
        new Dialogue(haibara, "Here it is!", null, "neutral"),
        new Dialogue(haibara, "The <b>myth</b>, ", null, "neutral"),
        new Dialogue(haibara, "The <b>legend</b>, ", null, "neutral"),
        new Dialogue(haibara, "<b>My House!!!!!</b>, ", null, "neutral"),
        new Dialogue(haibara, "Well, not really my house i guess, it's <b>Professor Agasa's House!!!</b>", null, "neutral"),
        new Dialogue(haibara, "Located at <b>2-22, Beika Town, Beika City,</b>", null, "neutral"),
        new Dialogue(haibara, "This is where I live after i shrunk into <b>Haibara.</b>", null, "neutral"),
        new Dialogue(haibara, "Alr then where do you wanna go now? ", 
            new Choice([{
                "text" : "Back to Kogoro pls",
                "outcome" : () => {changeNextScene("MouriAgency")}
            }, {
                "text" : "Say that again?",
                "outcome" : () => {changeNextScene("AgasaHouse")}
            }]
        ), "neutral"),
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
    for (let i = 0; i < 100; i++) {
        setTimeout(function() {
            console.log(bgMusic.volume)
            if (bgMusic.volume < musicVolume) {
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