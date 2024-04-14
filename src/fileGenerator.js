import * as fs from 'fs';

let perf
const templatePaths = "./node_modules/nodisan/templates/"
const flagsPath = "./node_modules/nodisan/templates/flags"
const prompt = "\u001B[1m\u001B[93mnodisan\u001B[39m\u001B[22m: "

export const createFirstTemplates = async () => {
    const json = await new Promise((resolve, reject) => {
        fs.readFile('./node_modules/nodisan/templates/paths.json', 'utf-8', (err, data) => {
            if (err) {
                console.error(prompt + 'Error to read file:', err);
                reject()
            }
            try {
                const jsonContent = JSON.parse(data);
                resolve(jsonContent.paths)
            } catch (parseErr) {
                console.error(prompt + 'Error to parse JSON:', parseErr);
            }
        });
    })
    for (const dir in json) {
        let fileName = json[dir].fileName
        fileName == ".gitignore_safe" ? fileName = ".gitignore" : null
        await copyFile(templatePaths + json[dir].fileName, json[dir].path + fileName)
    }
}

export const copyFile = async (origin, dest, ovrw) => {
    let splited = dest.split("/")
    let fileName = splited[splited.length - 1]
    let destPath = splited.slice(0, splited.length - 1).join("/")
    //Validating the directory  exists or not
    let isCreated = await verificatePath(destPath)
    if (!isCreated) {
        await createDir(destPath)
    }
    //Reading the template to copy              
    let data = await readOriginFile(origin)
    //Verifying if the file already exists
    isCreated = await verificatePath(dest)
    if (isCreated && !ovrw) {
        console.log(prompt + 'The file "' + fileName + '" already exist.')
    } else {
        //Pasting the template  
        perf = performance.now()
        await writeDestinyFile(dest, data, fileName)
    }
}

export const verificatePath = async (path) => {
    return new Promise(resolve => {
        fs.access(path, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        });
    })
}

const createDir = async (path, silent = false) => {
    //Creating the directory if no exists
    if (!silent) console.log(prompt + `The path: "${path}" does not exists. Creating it...`)
    let perf = performance.now()
    return new Promise(resolve => {
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) {
                console.error(prompt + `Error making the directory ${path}`, err);
                return;
            }
            let time = Math.floor((performance.now() - perf) * 100) / 100
            if (!silent) console.log(prompt + `Generate directory "${path}" \u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
            resolve()
        })
    })
}

export const makeFlag = async (name) => {
    //Verifying if the directory exists
    let isCreated = await verificatePath(flagsPath)
    if (!isCreated) {
        await createDir(flagsPath, true)
    }
    //Writting the file
    await writeDestinyFile(flagsPath + "/" + name, "", undefined, true)
}

export const readOriginFile = async (origin) => {
    let promiseData = await new Promise(resolve => {
        fs.readFile(origin, (err, data) => {
            if (err) {
                console.error(prompt + `Error reading the file: ${origin.split("/")[origin.split("/").length - 1]} `, err);
                return;
            }
            resolve(data)
        });
    })
    return promiseData
}

export const writeDestinyFile = async (dest, data, fileName, silent = false) => {
    await new Promise(resolve => {
        fs.writeFile(dest, data, (err) => {
            if (err) {
                console.error(prompt + `Error generating the file: ${fileName}`,
                    "\u001B[2m\u001B[31mERR\u001B[39m\u001B[22m", err);
                return;
            }
            let time = Math.floor((performance.now() - perf) * 100) / 100
            if (!silent) console.log(prompt + `Generating "${fileName}"`, `\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
            resolve()
        })
    })
}
