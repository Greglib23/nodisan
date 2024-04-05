import * as fs from 'fs';

const createEnv = () => {
    console.log("Creating .env...");
    const content = `
    PORT=
    JWT_SECRET=
    POSTGRES_USER=
    POSTGRES_PASSWORD=
    POSTGRES_DB=
    DATABASE_URL="postgresql://user:pass@localhost:5432/databaseName"
    `;
    const path = './.env';

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
    })
};

const createNodisan = () => {
    console.log("Creating .env...")
    const path = `../../nodisan`
    const content =
        `import { startProject } from "nodisan/src/index.js";

        startProject()`

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
    });
}
const createAppTs = () => {
    console.log("Creating .env...");
    const content =
        `import dotenv from 'dotenv';
dotenv.config()
import express from 'express';
import authRoutes from './routes/authRoutes'
import usersRoutes from './routes/userRoutes'

const app = express()

app.use(express.json())

// Routes
app.use('/auth', authRoutes)
app.use('/users', usersRoutes)

export default app`
    const path = './src/app.ts';

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
    })
}
const createFiles = () => {
    createEnv()
}

export { createEnv, createNodisan, createFiles }
