'use strict';

var createFirstTemplates = require("./handleArguments.js")
var { generatePrisma, installCommands, runVite, doneStart } = require("./commands.js")
// var generatePrisma = require("./commands.js")
// var installCommands = require("./commands.js")
// var runVite = require("./commands.js")
// var doneStart = require("./commands.js")



const startProject = async () => {
    showLogo()
    await runVite()
    await installCommands()
    await createFirstTemplates()
    await generatePrisma()
    await doneStart()
}

const showLogo = () => {
    console.log("________   ________  ________  ___  ________  ________  ________      ")
    console.log("|\\   ___  \\|\\   __  \\|\\   ___ \\|\\  \\|\\   ____\\|\\   __  \\|\\   ___  \\    ")
    console.log("\\ \\  \\\\ \\  \\ \\  \\|\\  \\ \\  \\_|\\ \\ \\  \\ \\  \\___|\\ \\  \\|\\  \\ \\  \\\\ \\  \\   ")
    console.log(" \\ \\  \\\\ \\  \\ \\  \\\\\\  \\ \\  \\ \\\\ \\ \\  \\ \\_____  \\ \\   __  \\ \\  \\\\ \\  \\  ")
    console.log("  \\ \\  \\\\ \\  \\ \\  \\\\\\  \\ \\  \\_\\\\ \\ \\  \\|____|\\  \\ \\  \\ \\  \\ \\  \\\\ \\  \\ ")
    console.log("   \\ \\__\\\\ \\__\\ \\_______\\ \\_______\\ \\__\\____\\_\\  \\ \\__\\ \\__\\ \\__\\\\ \\__\\")
    console.log("    \\|__| \\|__|\\|_______|\\|_______|\\|__|\\_________\\|__|\\|__|\\|__| \\|__|")
    console.log("                                       \\|_________|                    ")
}

module.exports = { startProject }