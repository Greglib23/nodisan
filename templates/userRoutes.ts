import express, { NextFunction, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import * as crudUser from '../controllers/userController'
import { resource } from 'nodisan/src/resource.js'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

//Middleware of JWT to see if we are authenticated

const authToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (!token) {
        return res.status(401).json({ error: 'No autorizado' })
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error('Error en la autenticación: ', err)
            return res.status(403).json({ error: 'No tienes acceso a este recurso' })
        }
        next();
    })
}

resource(authToken, crudUser)
// router.post('/', authToken, createUser)
// router.get('/', authToken, getAllUsers)
// router.get('/:id', authToken, getUserById)
// router.put('/:id', authToken, updateUser)
// router.delete('/:id', authToken, deleteUser)


export default router;