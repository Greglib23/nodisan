import { startProject } from "../index.js"
import { runCommand, runVite } from "./commands.js"
import { copyFile, verificatePath, makeFlag, readOriginFile, copyFiles } from "./fileGenerator.js"
import * as fs from 'fs'


const templatePaths = "./node_modules/nodisan/templates/"
const flagsPath = "./node_modules/nodisan/templates/flags"
const prompt = "\u001B[1m\u001B[93mnodisan\u001B[39m\u001B[22m: "


export const handleArguments = async (args) => {
    let isCreated = await verificatePath(flagsPath + "/started")
    if (args.length == 2) {
        if (isCreated) {
            console.log(prompt + 'Project already started.')
        } else {
            await startProject()
            await makeFlag("started")
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
    if (args[2] == "-h" || args[2] == "--help") {
        await handleHelp()
        return
    }
    if (args[2] == "-v" || args[2] == "--version") {
        await handleVersion()
        return
    }
    if (args[2].split(":")[0] == "install") {
        await handleInstall(args)
        return
    }
    if (args[2].split(":")[0] == "build") {
        await handleBuild(args)
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
    let data = (await readOriginFile(filePath)).toString()
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
const handleHelp = async () => {
    const packageJsonPath = './node_modules/nodisan/package.json';
    const packageJsonContent = await new Promise(resolve => {
        resolve(fs.readFileSync(packageJsonPath, 'utf8'))
    })
    const packageJson = JSON.parse(packageJsonContent);
    let nodVersion = packageJson.version
    let helpTemp = (await readOriginFile("./node_modules/nodisan/src/help.txt")).toString()

    // Divide the content in lines
    const lines = helpTemp.split('\n');

    // Find the line that contains the text
    const index = lines.findIndex(line => line.includes("{version}"));

    if (index !== -1) {
        lines[index] = lines[index].replace("{version}", nodVersion)

        //Logging the content
        for (const line in lines) {
            console.log(eval('"' + lines[line] + '"'));
        }
    } else {
        console.error("Nothing to change");
    }
}
const handleVersion = async () => {
    const packageJsonPath = './node_modules/nodisan/package.json';
    const packageJsonContent = await new Promise(resolve => {
        resolve(fs.readFileSync(packageJsonPath, 'utf8'))
    })
    const packageJson = JSON.parse(packageJsonContent);
    console.log(`Nodisan \u001B[1m\u001B[32mv${packageJson.version}\u001B[39m\u001B[22m`)
}
const handleInstall = async (args) => {
    if (args[2].split(":")[1] === "vite") {
        let isCreated = await verificatePath("./client")
        if (isCreated) {
            console.log(prompt + "Vite already installed.")
            return
        } else {
            await runVite()
            let front = await verificatePath(templatePaths + "/flags/front")
            if (front) {
                console.log(prompt + "I see you installed the frontend in your project! You can run it by doing:")
                console.log("       cd client")
                console.log("       npm run dev")
            }
            return
        }
    }
    console.log(prompt + "Unknow command: " + args[2])
}
const handleBuild = async (args) => {
    let option = args[3]
    let backDist = await verificatePath("./dist")
    let frontDist = await verificatePath("./client/dist")
    let client = await verificatePath("./client")
    if (option) {
        if (client) {
            if (option === '--frontend' || option === '--front') {
                if (frontDist) {
                    console.log(prompt + "Client folder already have a " + '"dist" folder.')
                    return
                }
                await runCommand("npm run build --prefix client", "Building frontend...")
                await copyFiles("./client/dist", "./dist/client", "Copying files from front dist to backend dist...")
                return
            }

        } else {
            console.log(prompt + "There are no frontend files on your project")
        }
        if (option === '--backend' || option === '--back') {
            if (backDist) {
                console.log(prompt + "Root folder already have a " + '"dist" folder.')
                return
            }
            await runCommand("npm run build", "Building backend...")
            return
        }
    } else {
        if (backDist) {
            console.log(prompt + "Root folder already have a " + '"dist" folder.')
            return
        }
        if (frontDist) {
            console.log(prompt + "Client folder already have a " + '"dist" folder.')
            return
        }
        await runCommand("npm run build", "Building backend...")
        if (client) {
            await runCommand("npm run build --prefix client", "Building frontend...")
            await copyFiles("./client/dist", "./dist/client", "Copying files from front dist to backend dist...")
        }
    }
}