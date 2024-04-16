import { createFirstTemplates } from "./src/fileGenerator.js"
import { generatePrisma, installCommands, runVite, doneStart } from "./src/commands.js"


const prompt = "\u001B[1m\u001B[93mnodisan\u001B[39m\u001B[22m: "


export const startProject = async () => {
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
