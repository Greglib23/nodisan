import * as fs from 'fs';

export const createEnv = () => {
    const startTime = performance.now()
    console.log("Creating .env...")
    const content = `
    PORT=
    JWT_SECRET=
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_DB=
    DATABASE_URL="postgresql://user:pass@localhost:5432/databaseName"
    `;
    const path = './.env';
    fs.writeFile(rutaArchivo, content, (err) => {
        if (err) throw err;
        console.log(`Ended in ${performance.now - startTime}ms`);
    });
}

export const createNodisan = () => {
    const startTime = performance.now()
    console.log("Creating .env...")
    const path = `../../nodisan`
    const content = "console.log('Hello World')"

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
        console.log(`Ended in ${performance.now - startTime}ms`);
    });
}
export const createFiles = () => {
    createEnv()
    createNodisan()
}

