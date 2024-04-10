import * as fs from 'fs';

let perf
const templatePaths = "./node_modules/nodisan/templates/"

export const createFirstTemplates = async () => {
    const json = await new Promise((resolve, reject) => {
        fs.readFile('./node_modules/nodisan/templates/paths.json', 'utf-8', (err, data) => {
            if (err) {
                console.error('Error to read file:', err);
                reject()
            }
            try {
                const jsonContent = JSON.parse(data);
                resolve(jsonContent.paths)
            } catch (parseErr) {
                console.error('Error to parse JSON:', parseErr);
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
    let promiseData = await new Promise(resolve => {
        fs.readFile(origin, (err, data) => {
            if (err) {
                console.error(`Error reading the file: ${origin.split("/")[origin.split("/").length - 1]} `, err);
                return;
            }
            resolve(data)
        });
    })
    isCreated = await verificatePath(dest)
    if (isCreated && !ovrw) {
        console.log('The file "' + fileName + '" already exist.')
    } else {
        //Pasting the template  
        perf = performance.now()
        await new Promise(resolve => {
            fs.writeFile(dest, promiseData, (err) => {
                if (err) {
                    console.error(`Error generating the file: ${fileName}`,
                        "\u001B[2m\u001B[31mERR\u001B[39m\u001B[22m", err);
                    return;
                }
                let time = Math.floor((performance.now() - perf) * 100) / 100
                console.log(`Generating "${fileName}"`, `\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
                resolve()
            })
        })
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

const createDir = async (path) => {
    //Creating the directory if no exists
    console.log(`The path: "${path}" does not exists. Creating it...`)
    let perf = performance.now()
    return new Promise(resolve => {
        fs.mkdir(path, { recursive: true }, (err) => {
            if (err) {
                console.error(`Error making the directory ${path}`, err);
                return;
            }
            let time = Math.floor((performance.now() - perf) * 100) / 100
            console.log(`Generate directory "${path}" \u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
            resolve()
        })
    })
}

