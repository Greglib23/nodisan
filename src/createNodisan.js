import { createNodisan } from "./fileGenerator.js"
import * as fs from 'fs';

const path = '../../package.json';

createNodisan()
fs.readFile(path, (error, data) => {
    if (error) {
        console.log(error);
        return;
    }
    const parsedData = JSON.parse(data);
    parsedData.type = "module";
    parsedData.scripts.dev = "tsnd --respawn --clear src/server.ts"
    parsedData.scripts.build = "rimraf ./dist && tsc"
    parsedData.scripts.start = "node dist/server.js"
    delete parsedData.scripts.install
    delete parsedData.scripts.test

    fs.writeFile(path, JSON.stringify(parsedData, null, 2), (err) => {
        if (err) {
            console.log('Failed to write updated data to file');
            return;
        }
        console.log('Updated file successfully');
    });
});