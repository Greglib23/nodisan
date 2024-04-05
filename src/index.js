import { createNodisan, createFiles } from "./fileGenerator.js"
import { installCommands } from "./commands.js"

export const startProject = () => {
    installCommands()
    createFiles()
}