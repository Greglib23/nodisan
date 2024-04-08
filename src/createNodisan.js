import * as fs from 'fs';

//Creating nodisan.js
console.log("Creating .env...")
const path = `../../nodisan.js`
const content =
    `import { startProject } from "nodisan/index.js";
startProject()`

fs.writeFile(path, content, (err) => {
    if (err) throw err;
});
//Adding "type": "module" to package.json
fs.readFile('../../package.json', (error, data) => {
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

    fs.writeFile('../../package.json', JSON.stringify(parsedData, null, 2), (err) => {
        if (err) {
            console.log('Failed to write updated data to file');
            return;
        }
        console.log('Updated file successfully');
    });
});