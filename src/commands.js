import { exec } from 'child_process';
import * as fs from 'fs';

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
const installCommands = () => {
    const comm1 = "npm install ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma --save-dev"
    const comm2 = "npm install express jsonwebtoken bcrypt @prisma/client dotenv typescript"
    const comm3 = "npx tsc --init --outDir dist/ --rootDir src"


    const runCommand = (command) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error running dependencies: ${error}`);
                return;
            }
        });
    }
    console.log("Installing dev dependencies...")
    runCommand(comm1)

    console.log("Installing dependencies...")
    runCommand(comm2)

    console.log("Running tsc...")
    exec(comm3, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running dependencies: ${error}`);
            return;
        }
        addingPropsTs()
    });
}
export { installCommands }