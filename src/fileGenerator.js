import * as fs from 'fs';

const createEnv = () => {
    console.log("Creating .env...");
    const content = `
    PORT=3000
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
    console.log("Creating /src/app.ts...");
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
    fs.mkdirSync('src', { recursive: true });
    const path = './src/app.ts';

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
    })
}
const createServerTs = () => {
    console.log("Creating src/server.ts...");
    const content =
        `import app from './app'

        const PORT = process.env.PORT
        
        app.listen(PORT, () => {
            console.log(\`Server is running on PORT: \${PORT}\`)
        })`
    fs.mkdirSync('src', { recursive: true });
    const path = './src/server.ts';

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
    })
}
const createAuthRoutes = () => {
    console.log("Creating src/routes/server.ts...");
    const content =
        `import express from 'express'
        import { login, register } from '../controllers/authController';
        
        const router = express.Router()
        
        router.post('/register', register)
        router.post('/login', login)
        
        export default router;`
    fs.mkdirSync('src/routes', { recursive: true });
    const path = './src/routes/authRoutes.ts';

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
    })
}
const createUserTs = () => {
    console.log("Creating src/models/user.ts...");
    const content =
        `import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma.user;`
    fs.mkdirSync('src/models', { recursive: true });
    const path = './src/models/user.ts';

    fs.writeFile(path, content, (err) => {
        if (err) throw err;
    })
}
const createFiles = () => {
    createEnv()
    createAppTs()
    createServerTs()
    createAuthRoutes()
    createUserTs()
}

export { createEnv, createNodisan, createFiles }
