import * as fs from 'fs';

//Creating nodisan.js
const path = `../../nodisan.js`
const content =
    `import { handleArguments } from "nodisan/src/handleArguments.js";

handleArguments(process.argv)`

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
    parsedData.scripts.dev = 'tsx src/server.ts'
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