import * as fs from 'fs';

export const createEnv = () => {
    // Contenido del archivo .env
    const contenido = `
PORT=
JWT_SECRET=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
DATABASE_URL="postgresql://user:pass@localhost:5432/databaseName"
`;

    // Ruta del archivo .env (puedes cambiar la ruta según tu necesidad)
    const rutaArchivo = '../../.env';

    // Escribir el contenido en el archivo .env
    fs.writeFile(rutaArchivo, contenido, (err) => {
        if (err) throw err;
        console.log('.env created succesfully.');
    });
}

export const createNodisan = () => {
    const path = `../../nodisan`
    const content = "TODO"

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
        console.log('nodisan created succesfully.');
    });
}

