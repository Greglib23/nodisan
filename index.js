import { createFiles } from "./src/fileGenerator.js"
import { installCommands } from "./src/commands.js"

export const startProject = () => {
    installCommands()
    createFiles()
}