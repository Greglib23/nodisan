import { createFirstTemplates } from "./src/fileGenerator.js"
import { generatePrisma, installCommands, runVite, doneStart } from "./src/commands.js"


const prompt = "\u001B[1m\u001B[93mnodisan\u001B[39m\u001B[22m: "


export const startProject = async () => {
    await runVite()
    await installCommands()
    await createFirstTemplates()
    await generatePrisma()
    await doneStart()
}