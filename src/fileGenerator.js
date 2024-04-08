import * as fs from 'fs';

let perf
const templatePaths = "./node_modules/nodisan/templates/"

const createDir = async (json, dir, templatePaths) => {
    //Creating the directory if no exists

    return new Promise(resolve => {
        fs.mkdir(json[dir].path, { recursive: true }, (err) => {
            if (err) {
                console.error(`Error making the directory ${json[dir].path}`, err);
                return;
            }
            let time = Math.floor((performance.now() - perf) * 100) / 100
            console.log(`Generate directory "${json[dir].path}" \u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
            resolve()
        })
    })
}

const verificateDirectory = async (json, dir) => {
    return new Promise(resolve => {
        fs.access(json[dir].path, fs.constants.F_OK, (err) => {
            if (err) {
                resolve(false)
            } else {
                resolve(true)
            }
        });
    })
}
const copyFile = async (json, templatePaths) => {
    for (const dir in json) {
        let nameAux
        //Validating the directory  exists or not
        let isCreated = await verificateDirectory(json, dir)
        if (!isCreated) {
            perf = performance.now()
            console.log(`Making "${json[dir].path}"`)
            await createDir(json, dir, templatePaths)
        }
        //Reading the template to copy              
        let promiseData = await new Promise(resolve => {
            fs.readFile(templatePaths + json[dir].fileName, (err, data) => {
                if (err) {
                    console.error(`Error reading the file: ${json[dir].fileName} `, err);
                    return;
                }
                json[dir].fileName == ".gitignore_safe" ? nameAux = ".gitignore" : nameAux = json[dir].fileName
                resolve(data)
            });
        })
        //Pasting the template  
        console.log(`Generating  "${nameAux}"`);
        perf = performance.now()
        await new Promise(resolve => {
            fs.writeFile(json[dir].path + nameAux, promiseData, (err) => {
                if (err) {
                    console.error(`Error generating the file: ${json[dir].fileName}`,
                        "\u001B[2m\u001B[31mERR\u001B[39m\u001B[22m", err);
                    return;
                }
                let time = Math.floor((performance.now() - perf) * 100) / 100
                console.log(`Generating  "${json[dir].fileName}"`, `\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
                resolve()
            })
        })
    }
}

export const createFiles = async () => {
    const json = await new Promise(resolve => {
        fs.readFile('./node_modules/nodisan/templates/paths.json', 'utf-8', (err, data) => {
            if (err) {
                console.error('Error to read file:', err);
                return;
            }
            try {
                const jsonContent = JSON.parse(data);
                resolve(jsonContent.paths)
            } catch (parseErr) {
                console.error('Error to parse JSON:', parseErr);
            }
        });
    })
    await copyFile(json, templatePaths)
}
export const copyPrismaSchema = async () => {
    //Reading the template to copy              
    let promiseData = await new Promise(resolve => {
        fs.readFile(templatePaths + "schema.prisma", (err, data) => {
            if (err) {
                console.error(`Error reading the file: ${json[dir].fileName} `, err);
                return;
            }
            resolve(data)
        });
    })
    //Pasting the template  
    console.log(`Replacing "schema.prisma"`);
    perf = performance.now()
    await new Promise(resolve => {
        fs.writeFile("./prisma/schema.prisma", promiseData, (err) => {
            if (err) {
                console.error(`Error generating the file: "schema.prisma"`,
                    "\u001B[2m\u001B[31mERR\u001B[39m\u001B[22m", err);
                return;
            }
            let time = Math.floor((performance.now() - perf) * 100) / 100
            console.log(`Replacing  "schema.prisma"`, `\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`);
            resolve()
        })
    })
}

