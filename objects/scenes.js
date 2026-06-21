const scenes = {

    // ======================Start========================== //

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

    // ===================Mouri Agency===================== //

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

    // ====================Agasa House====================== //

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