const logCol = document.getElementById("logsColumn")

let currentSceneLog = [
    {
        "name" : "Name",
        "dialogue" : "Dialogue"
    }
]

function addToLog(name, dialogue) {

    const cS = scenes[currentScene]
    const cDs = cS.dialogues

    currentSceneLog = []
    for (let i = 0; i < cDialogueIndex + 1; i++) {
        const cd = cDs[i]

        if (cd.text == "" || cd.text == " ") {
            continue
        }

        let log = {
            "name" : cd.char.name,
            "dialogue" : cd.text
        }
        


        currentSceneLog.push(log)
    }

    
    // let log = {
    //     "name" : name,
    //     "dialogue" : dialogue
    // }
    // currentSceneLog.push(log)

}

function addToLogDisplay() {
    logCol.innerHTML = ""
    for (const log of currentSceneLog) {
        const name = log.name
        const dialogue = log.dialogue

        logCol.innerHTML += `<div class="logsRows" style="margin-bottom: 10px; width: 100%; border-radius: 5px; display: flex; flex-direction: row; justify-content: flex-start; align-items: center; background-color: rgba(138, 115, 146, 0.9); color: white; font-family: 'Commissioner';">
                                <label style="border-radius: 3px; padding: 0; margin: 5px; width: 30%; background-color: rgb(116, 98, 122);"> ${name}: </label> 
                                <p style="padding: 0; margin: 5px; width: 70%;"> ${dialogue} </p>
                            </div>`
    }
    
}

function clearLog() {
    currentSceneLog = []
    logCol.innerHTML = ""
}