'use strict';

var createFirstTemplates = require("createFirstTemplates")
var generatePrisma = require("generatePrisma")
var installCommands = require("installCommands")
var runVite = require("runVite")
var doneStart = require("doneStart")

exports = module.exports = startProject

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