import { startProject } from "../index.js"
import { runCommand, runVite } from "./commands.js"
import { copyFile, verificatePath, makeFlag, readOriginFile, copyFiles, writeDestinyFile, createDir } from "./fileGenerator.js"
import * as fs from 'fs'
import { join as pathJoin } from 'path';


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
    if (args[2] == "db:seed") {
        await handleDb()
        return
    }

    if (args.length > 2) console.log(prompt + 'Unknow command: "' + args[2] + '"')
}

const handleMigrate = async (args) => {
    if (args.length == 3) {
        if (args[2] == "migrate") {
            await migrateToPrisma()
            await runCommand("npx prisma migrate dev --name '-'",
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
        if (args[2] == "migrate:rollback") {
            await removeMigration(1)
            await runCommand("npx prisma migrate reset --force",
                "Running rollback...")
            return
        }
    }
    if (args.length == 4) {
        if (args[2] == "migrate:rollback" && args[3].split("=")[0] == "--step") {
            await removeMigration(args[3].split("=")[1])
            await runCommand("npx prisma migrate reset --force",
                "Running rollback...")
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
    if (args[2] == "make:migration") {//Validate what the program will make
        if (args[3]) {
            await makeMigration(args[3])
        } else {
            await makeMigration()
        }
        return
    }
    if (args[2] == "make:model") {//Validate what the program will make
        if (args[3]) {
            if (args[4] === "--migration") {
                await makeModel(args[3], true)

            } else {
                await makeModel(args[3])
            }
        } else {
            console.log(prompt + `You have to write a model name. Like: '"node nodisan make:controller controllerName"`)
        }
        return
    }
    if (args[2] == "make:seeder") {//Validate what the program will make
        if (args[3]) {
            await makeSeeder(args[3])
            return
        } else {
            console.log(prompt + `You have to write a seeder name. Like: "node nodisan make:seeder seederName"`)
        }
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

    if (!exists) await replaceInFile(newFilePath, "modelName", modelName)
}
const replaceInFile = async (filePath, toFind, toReplace) => {
    let data = (await readOriginFile(filePath)).toString()
    // Divide the content in lines
    const lines = data.split('\n');

    // Find the line that contains the text
    const index = lines.findIndex(line => line.includes(toFind));

    if (index !== -1) {
        lines[index] = lines[index].replace(toFind, toReplace);
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
                console.log("")
                console.log("")
                console.log(prompt + "I see you installed the frontend in your project! You can run it by doing:")
                console.log("")
                console.log("\u001B[1m\u001B[32mcd client\u001B[39m\u001B[22m")
                console.log("\u001B[1m\u001B[32mnpm run dev\u001B[39m\u001B[22m")
                console.log("")
                console.log("")
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
const makeMigration = async (migName) => {
    let originFile = await readOriginFile("./node_modules/nodisan/templates/voids/create_table_name.json")
    let fileName = await getMigrationName(migName)
    let migPath = "./src/database/migrations"
    let isCreated = await verificatePath(migPath)
    if (isCreated) {
        await writeDestinyFile(migPath + "/" + fileName, originFile)
    } else {
        await createDir(migPath)
        await writeDestinyFile(migPath + "/" + fileName, originFile)
    }
}
const getMigrationName = async (migName) => {
    const currentDate = new Date();
    // Get the components of date
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    const day = currentDate.getDate();
    // Get the components of hour
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const secconds = currentDate.getSeconds();
    // Format date and hour
    const completeDate = `${year}_${month.toString().padStart(2, '0')}_${day.toString().padStart(2, '0')}_`;
    const completeHour = `${hours.toString().padStart(2, '0')}${minutes.toString().padStart(2, '0')}${secconds.toString().padStart(2, '0')}`;
    if (migName) {
        let fileName = completeDate + completeHour + "_" + migName + ".json"
        return fileName
    } else {
        let fileName = completeDate + completeHour + ".json"
        return fileName
    }
}
const makeModel = async (modelName, migration = false) => {
    const modelPath = "./src/models"
    const isCreated = await verificatePath(modelPath + "/" + modelName + ".ts")
    const dataModel = await readOriginFile("./node_modules/nodisan/templates/voids/models.ts")
    const dataInterface = await readOriginFile("./node_modules/nodisan/templates/voids/models.interface.ts")
    if (isCreated) {
        console.log(prompt + `File "${modelName}.ts" alredy exists.`)
        return
    } else {
        await writeDestinyFile(modelPath + "/" + modelName + ".ts", dataModel)
        await replaceInFile(modelPath + "/" + modelName + ".ts", "{ modelName }", modelName)
        await writeDestinyFile(modelPath + "/" + modelName + ".interface.ts", dataInterface)
        await replaceInFile(modelPath + "/" + modelName + ".interface.ts", "{ modelName }", modelName.charAt(0).toUpperCase() + modelName.slice(1))
    }
    if (migration) await makeMigration("create_" + modelName + "s_table")
}
const migrateToPrisma = async () => {
    const migrationsDir = './src/database/migrations/'
    const schemaFile = './prisma/schema.prisma'
    await copyFile(templatePaths + "schema.prisma", "./prisma/schema.prisma", true)
    fs.readdirSync(migrationsDir).forEach(file => {
        if (file.endsWith('.json')) {
            let tableName = file.replace(/\.json$/, '').replace(/_/g, ' ').split(" ")
            if (tableName.length > 4) {
                tableName = tableName[tableName.length - 2].slice(0, -1)
            } else {
                tableName = "default"
            }
            let toExport = `model ${tableName} {\n`
            const migrationPath = pathJoin(migrationsDir, file);
            const migrationContent = fs.readFileSync(migrationPath, 'utf8');
            let data = migrationContent
            data = JSON.parse(data.toString())

            for (const key in data) {
                if (key == "id") {
                    toExport += "  id Int @id @default(autoincrement())\n"
                }
                if (key == "timestamps") {
                    toExport += "  created_at DateTime @default(now())\n"
                    toExport += "  modified_at DateTime @updatedAt\n"
                }
                if (key !== "id" && key !== "timestamps") {
                    let props = ""
                    for (const e in data[key]) {
                        if (data[key][e] == 'string') {
                            props += "String "
                        }
                        if (data[key][e] == 'unique') {
                            props += "@unique "
                        }
                    }
                    toExport += `  ${key} ${props}\n`
                }
            }
            toExport += "}\n"
            toExport += "\n"
            fs.appendFileSync(schemaFile, toExport)
        }
    })
}
const removeMigration = async (cant) => {
    const migrationsDir = './prisma/migrations';
    const migrations = fs.readdirSync(migrationsDir)
        .filter(file => fs.statSync(pathJoin(migrationsDir, file)).isDirectory())
        .sort((a, b) => fs.statSync(pathJoin(migrationsDir, b)).ctime.getTime() - fs.statSync(pathJoin(migrationsDir, a)).ctime.getTime());
    migrations.slice(0, cant).forEach(migracion => {
        const migracionPath = pathJoin(migrationsDir, migracion);
        fs.rmSync(migracionPath, { recursive: true, force: true });
        console.log(`Migración eliminada: ${migracion}`);
    });
}
const makeSeeder = async (fileName) => {
    let isCreated = await verificatePath(`./src/database/seeders/${fileName}.ts`)
    if (isCreated) {
        console.log(prompt + `File "${fileName}.ts" alredy exists.`)
        return
    }
    await copyFile(templatePaths + "voids/seederName.ts", `./src/database/seeders/${fileName}.ts`, true)
    await replaceInFile(`./src/database/seeders/${fileName}.ts`, "{ modelName }", fileName.slice(0, -6))
}
const handleDb = async () => {
    await runCommand("npx tsx src/database/seeders/databaseSeeder.ts", "Running seeder...", "Seeder sended!")
}