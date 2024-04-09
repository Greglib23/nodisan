import { createFirstTemplates } from "./src/fileGenerator.js"
import { generatePrisma, installCommands } from "./src/commands.js"


export const startProject = async () => {
    await installCommands()
    await createFirstTemplates()
    await generatePrisma()
}