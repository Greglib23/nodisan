import { createFiles } from "./src/fileGenerator.js"
import { generatePrisma, installCommands } from "./src/commands.js"


export const startProject = async () => {
    await installCommands()
    await createFiles()
    await generatePrisma()
}