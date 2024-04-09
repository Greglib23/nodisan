import { startProject } from "../index.js"
import { runCommand } from "./commands.js"
import * as fs from 'fs'

const templatePaths = "./node_modules/nodisan/templates/"
let perf

export const handleArguments = async (args) => {
    if (args.length == 2) {
        return await startProject()
    }
    if (args[2].split(":")[0] == "migrate") {
        await handleMigrate(args)
    }
    if (args[2].split(":")[0] == "make") {
        await handleMake(args)
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
    if (args[3]) {
        if (args[2] == "make:controller" && !args[4]) {
            await makeController(args[3])
        }
        if (args[2] == "make:controller" && args[4] == '--resource') {
            console.log("Enter")
            await makeController(args[3], true)
        }
    }
}
const makeController = async (contName, isResource = false) => {
    const modelName = contName.split(/(?=[A-Z])/)[0]
    if (isResource) {
        //Reading the template to copy              
        let promiseData = await new Promise(resolve => {
            fs.readFile(templatePaths + "voids/controller-with-resources.ts", (err, data) => {
                if (err) {
                    console.error(`Error reading the file: "controller-with-resources.ts" `, err);
                    return;
                }
                resolve(data)
            });
        })
        //Pasting the template  
        perf = performance.now()
        await new Promise(resolve => {
            fs.writeFile("./src/controllers/" + contName + ".ts", promiseData, (err) => {
                if (err) {
                    console.error(`Error generating the file: ${contName}.ts`,
                        "\u001B[2m\u001B[31mERR\u001B[39m\u001B[22m", err);
                    return;
                }
                let time = Math.floor((performance.now() - perf) * 100) / 100
                console.log(`Generating  "${contName}.ts"`, `\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
                resolve()
            })
        })
    } else {
        //Reading the template to copy              
        let promiseData = await new Promise(resolve => {
            fs.readFile(templatePaths + "voids/controller.ts", (err, data) => {
                if (err) {
                    console.error(`Error reading the file: "controller.ts" `, err);
                    return;
                }
                resolve(data)
            });
        })
        //Pasting the template  
        console.log(`Generating  "${contName}.ts"`);
        perf = performance.now()
        await new Promise(resolve => {
            fs.writeFile("./src/controllers/" + contName + ".ts", promiseData, (err) => {
                if (err) {
                    console.error(`Error generating the file: "${contName}.ts"`,
                        "\u001B[2m\u001B[31mERR\u001B[39m\u001B[22m", err);
                    return;
                }
                let time = Math.floor((performance.now() - perf) * 100) / 100
                console.log(`Generating  "${contName}.ts"`, `\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
                resolve()
            })
        })
    }
}