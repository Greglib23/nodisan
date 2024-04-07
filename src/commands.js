import { exec } from 'child_process';
import * as fs from 'fs';

let perf

const addingPropsTs = () => {
    const tsconfigContent = fs.readFileSync('tsconfig.json', 'utf8');
    const tsconfigContentWithoutComments = tsconfigContent.replace(/\/\/.*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');

    const tsconfigObject = JSON.parse(tsconfigContentWithoutComments);

    tsconfigObject.exclude = ["node_modules", "dist"];
    tsconfigObject.include = ["src"];

    const newTsconfigContent = JSON.stringify(tsconfigObject, null, 2);
    fs.writeFileSync('tsconfig.json', newTsconfigContent);
    console.log("File tsconfig.json succesfully modified.");
}
const installCommands = async () => {
    const comm1 = "npm install ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma --save-dev"
    const comm2 = "npm install express jsonwebtoken bcrypt @prisma/client dotenv typescript"
    const comm3 = "npx tsc --init --outDir dist/ --rootDir src"


    const runCommand = async (command) => {
        await new Promise(resolve => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error running dependencies: ${error}`);
                    return;
                }
                let time = Math.floor((performance.now() - perf) * 100) / 100
                console.log(`\u001B[1m\u001B[32mDONE in ${time}ms\u001B[39m\u001B[22m`)
                resolve()
            });
        })

    }
    console.log("Installing dev dependencies...")
    perf = performance.now()
    await runCommand(comm1)

    console.log("Installing dependencies...")
    perf = performance.now()
    await runCommand(comm2)

    console.log("Running tsc...")
    perf = performance.now()
    await runCommand(comm3)

    addingPropsTs()
}
export { installCommands }