import { spawn } from 'child_process';
import * as fs from 'fs';
import { copyPrismaSchema } from './fileGenerator.js';

let perf

const addingPropsTs = () => {
    perf = performance.now()
    const tsconfigContent = fs.readFileSync('tsconfig.json', 'utf8');
    const tsconfigContentWithoutComments = tsconfigContent.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

    const tsconfigObject = JSON.parse(tsconfigContentWithoutComments);

    tsconfigObject.exclude = ["node_modules", "dist"];
    tsconfigObject.include = ["src"];

    const newTsconfigContent = JSON.stringify(tsconfigObject, null, 2);
    fs.writeFileSync('tsconfig.json', newTsconfigContent);
    let time = Math.floor((performance.now() - perf) * 100) / 100
    console.log(`File tsconfig.json succesfully modified. \u001B[1m\u001B[32m in ${time}ms\u001B[39m\u001B[22m`);
}
export const runCommand = async (command, msg, msg2) => {
    if (msg) {
        console.log(msg);
    }
    perf = performance.now()
    const comm = command.split(" ").splice(0, 1).join()
    const args = command.split(" ").splice(1, command.length)
    await new Promise(resolve => {
        const execute = spawn(comm, args, { stdio: 'inherit' });
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
            console.log(`\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`)
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
    await copyPrismaSchema()
    await runCommand("npx prisma generate", "Running prisma generate...")
}