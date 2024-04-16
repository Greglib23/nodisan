import { spawn } from 'child_process';
import * as fs from 'fs';
import { copyFile, makeFlag, verificatePath } from './fileGenerator.js'
import { createInterface } from 'readline';

let perf
const templatePaths = "./node_modules/nodisan/templates/"
const prompt = "\u001B[1m\u001B[93mnodisan\u001B[39m\u001B[22m: "

const addingPropsTs = () => {
    perf = performance.now()
    const tsconfigContent = fs.readFileSync('tsconfig.json', 'utf8');
    const tsconfigContentWithoutComments = tsconfigContent.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

    const tsconfigObject = JSON.parse(tsconfigContentWithoutComments);

    tsconfigObject.exclude = ["node_modules", "dist"];
    tsconfigObject.include = ["src"];
    // tsconfigObject.compilerOptions.module = "es2020"
    tsconfigObject.compilerOptions.jsx = "react-jsx"

    const newTsconfigContent = JSON.stringify(tsconfigObject, null, 2);
    fs.writeFileSync('tsconfig.json', newTsconfigContent);
    let time = Math.floor((performance.now() - perf) * 100) / 100
    console.log(prompt + `File tsconfig.json succesfully modified. \u001B[1m\u001B[32m in ${time}ms\u001B[39m\u001B[22m`);
}
export const runCommand = async (command, msg, msg2) => {
    if (msg) {
        console.log(prompt + msg);
    }
    perf = performance.now()
    const comm = command.split(" ").splice(0, 1).join()
    const args = command.split(" ").splice(1, command.length)
    await new Promise(resolve => {
        const execute = spawn(comm, args, { stdio: 'inherit', shell: true });
        if (execute.stdout) {
            execute.stdout.on('data', (data) => {
                console.log(`stdout: ${data}`);
            });
        }
        if (execute.stderr) {
            execute.stderr.on('data', (data) => {
                console.error(`stderr: ${data}`);
            });
        }
        execute.on('close', (code) => {
            let time = Math.floor((performance.now() - perf) * 100) / 100
            if (msg2) process.stdout.write(msg2 + " ")
            console.log(prompt + `\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`)
            resolve()
        });
    })

}
export const installCommands = async () => {
    const devComm = "npm install tsx ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma --save-dev"
    const depComm = "npm install express jsonwebtoken bcrypt @prisma/client dotenv typescript"
    const tsxComm = "npx tsc --init --outDir dist/ --rootDir src"
    await runCommand(devComm, "Installing dev dependencies...")
    await runCommand(depComm, "Installing dependencies...")
    await runCommand(tsxComm, "Running tsc...")
    addingPropsTs()
}

export const generatePrisma = async () => {
    await runCommand("npx prisma init", "Running prisma init...")
    await copyFile(templatePaths + "schema.prisma", "./prisma/schema.prisma", true)
    await runCommand("npx prisma generate", "Running prisma generate...")
}
export const runVite = async () => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout
    });
    const positives = ['y', 'yes', 'si', 's']
    const negatives = ['n', 'no']
    let create = await new Promise(resolve => {
        rl.question('Would you like to develop the front-end of the project? (y/n) ', (response) => {
            resolve(response)
            rl.close();
        })
    })
    if (positives.includes(create.toLowerCase())) {
        await runCommand("npx create-vite@latest client", "Running Vite, Nodisan will run again automatically when you are done with Vite....")
        await runCommand("npm i --prefix client", "Installing vite dependencies...")
        await makeFlag("front")
    }
    if (!negatives.includes(create.toLowerCase()) && !positives.includes(create.toLowerCase())) {
        console.log('Invalid response. Please answer with "y" or "n".');
        await runVite()
    }
}
export const doneStart = async () => {
    console.log("")
    console.log("")
    console.log(prompt + "You're ready! Now you just need to run:")
    console.log("")
    console.log("\u001B[1m\u001B[32mdocker-compose up\u001B[39m\u001B[22m \u001B[1m\u001B[93mor\u001B[39m\u001B[22m \u001B[1m\u001B[32mdocker-compose up -d\u001B[39m\u001B[22m")
    console.log("\u001B[1m\u001B[32mnode nodisan migrate\u001B[39m\u001B[22m")
    console.log("\u001B[1m\u001B[32mnode nodisan serve\u001B[39m\u001B[22m")
    console.log("")
    let front = await verificatePath(templatePaths + "/flags/front")
    if (front) {
        console.log(prompt + "I see you installed the frontend in your project! You can run it by doing:")
        console.log("")
        console.log("\u001B[1m\u001B[32mcd client\u001B[39m\u001B[22m")
        console.log("\u001B[1m\u001B[32mnpm run dev\u001B[39m\u001B[22m")
        console.log("")
    }
    console.log("")
}