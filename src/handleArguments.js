import { startProject } from "../index.js"
import { runCommand } from "./commands.js"
export const handleArguments = async (args) => {
    if (args.length == 2) {
        return await startProject()
    }
    if (args[2].split(":")[0] == "migrate") {
        await handleMigrate(args)
    } else {
        console.log("Invalid command")
    }

    if (args.length == 4) {
        return console.log(`There are two arguments: ${args[2]}, ${args[3]}`)
    }
    if (args.length >= 5) {
        return console.log(`There are too many arguments, see the valid commands with "node nodisan -h" or "node nodisan --help"`)
    }
}

const handleMigrate = async (args) => {
    if (args.length == 3) {
        if (args[2] == "migrate") {
            runCommand("npx prisma migrate dev",
                "Running migrations...",
                "Migrations sended!")
            return
        }
        if (args[2] == "migrate:reset") {
            runCommand("npx prisma migrate reset",
                "Running reset...",
                "Migrations restarted!")
            return
        }
        if (args[2] == "migrate:status") {
            runCommand("npx prisma migrate status",
                "Running status...")
            return
        }
    }
}