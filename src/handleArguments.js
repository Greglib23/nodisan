import { startProject } from "../index.js"
import { runCommand } from "./commands.js"
import { copyFile, verificatePath, makeStartedFlag } from "./fileGenerator.js"
import * as fs from 'fs'

const templatePaths = "./node_modules/nodisan/templates/"
const flagsPath = "./node_modules/nodisan/templates/flags"
const prompt = "\u001B[1m\u001B[93mnodisan\u001B[39m\u001B[22m: "


export const handleArguments = async (args) => {
    let isCreated = await verificatePath(flagsPath + "started")
    if (args.length == 2) {
        if (isCreated) {
            console.log(prompt + 'Project already started.')
        } else {
            await startProject()
            await makeStartedFlag()
        }
        return
    }
    if (!isCreated && args.length > 2) {
        console.log(prompt + 'Project is' + "'" + 'nt started, please run "node nodisan".')
        return
    }
    if (args[2].split(":")[0] == "migrate") {
        await handleMigrate(args)
        return
    }
    if (args[2].split(":")[0] == "make") {
        await handleMake(args)
        return
    }
    if (args[2].split(":")[0] == "serve") {
        await runCommand("npx tsx src/server.ts")
        return
    }
    if (args.length > 2) console.log(prompt + 'Unknow command: "' + args[2] + '"')
}

const handleMigrate = async (args) => {
    if (args.length == 3) {
        if (args[2] == "migrate") {
            await runCommand("npx prisma migrate dev",
                "Running migrations...",
                "Migrations sended!")
            return
        }
        if (args[2] == "migrate:reset") {
            await runCommand("npx prisma migrate reset",
                "Running reset...",
                "Migrations restarted!")
            return
        }
        if (args[2] == "migrate:status") {
            await runCommand("npx prisma migrate status",
                "Running status...")
            return
        }
    }
}
const handleMake = async (args) => {
    if (args[2] == "make") {
        console.log(prompt + 'You must to specify what you will make. I.e: "node nodisan make:controller controllerName"')
        return
    }
    if (args[2] == "make:controller") {//Validate what the program will make
        if (args[3]) {
            if (args[4]) {//Validate to create a void template
                if (args[4] == '--resource') {//Validate if is a resource
                    await makeController(args[3], true) //Create a resource
                } else {
                    console.log(prompt + "Unknow command: '" + args[4])
                }
            } else {
                await makeController(args[3]) //Create void template
            }
        } else {
            console.log(prompt + "You have to write a controller name. Like: " + '"node nodisan make:controller controllerName"')
        }
        return
    }
    console.log(prompt + 'Unknow command: ' + args[2])
    return
}
const makeController = async (contName, isResource = false) => {
    const modelName = contName.split(/(?=[A-Z])/)[0]
    const newFilePath = "./src/controllers/" + contName + ".ts"
    let exists = await verificatePath(newFilePath)

    if (isResource) await copyFile(templatePaths + "voids/controller-with-resources.ts", newFilePath)
    else await copyFile(templatePaths + "voids/controller.ts", newFilePath)

    if (!exists) await replaceInFile(newFilePath, "../models/modelName", `import prisma from '../models/${modelName}'`)
}
const replaceInFile = async (filePath, toFind, toReplace) => {
    let data = await new Promise(resolve => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                console.error(err);
                return;
            }
            resolve(data)
        });
    })
    // Divide the content in lines
    const lines = data.split('\n');

    // Find the line that contains the text
    const index = lines.findIndex(line => line.includes(toFind));

    if (index !== -1) {
        lines[index] = toReplace;
        const modifiedContent = lines.join('\n');

        // Writting the file modified
        await new Promise(resolve => {
            fs.writeFile(filePath, modifiedContent, 'utf8', (err) => {
                if (err) {
                    console.error(err);
                    return;
                }
                resolve()
            });
        })
    } else {
        console.error("Nothing to change");
    }
}