import { createNodisan } from "./fileGenerator.js"
import { exec } from 'child_process';

createNodisan()

const comm1 = "cd .. && cd .."
const comm2 = "npm install ts-node-dev @types/express @types/jsonwebtoken @types/bcrypt @types/node rimraf prisma --save-dev"
const comm3 = "npm install express jsonwebtoken bcrypt @prisma/client dotenv typescript"
const comm4 = "npx tsc --init --outDir dist/ --rootDir src"


const runCommand = (command) => {
    console.log("Running the install of dependencies on your project, this take a while and have no animation, so don't worry if you think your computer is forzen")
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running dependencies: ${error}`);
            return;
        }
        console.log(`Dependencies installed:\n${stdout}`);
    });
}

runCommand(comm1 + " && " + comm2 + " && " + comm3 + " && " + comm4)