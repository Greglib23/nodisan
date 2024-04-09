import { Request, Response } from "express";
import { hash } from "../services/password.service";
import prisma from '../models/user'


export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body
        if (!email) {
            res.status(400).json({ message: 'Email is required!' })
            return
        }
        if (!password) {
            res.status(400).json({ message: 'Password is required!' })
            return
        }
        const hashedPassword = await hash(password)
        const user = await prisma.create(
            {
                data: {
                    email,
                    password: hashedPassword
                }
            }
        )
        res.status(201).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ message: 'The input mail does not exists' })
        }
        console.log(error)
        res.status(500).json({ error: 'An error occurred, try again later' })
    }
}

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await prisma.findMany()
        res.status(200).json(users);
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred, try again later' })
    }
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        const user = await prisma.findUnique({
            where: {
                id: userId
            }
        })
        if (!user) {
            res.status(404).json({ error: 'User not found' })
            return
        }
        res.status(200).json(user)
    } catch (error: any) {
        console.log(error)
        res.status(500).json({ error: 'An error occurred, try again later' })
    }
}

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = parseInt(req.params.id)
        const { email, password } = req.body
        let dataToUpdate: any = { ...req.body }

        if (password) {
            const hashedPassword = await hash(password)
            dataToUpdate.password = hashedPassword
        }

        if (email) {
            dataToUpdate.email = email
        }

        const user = await prisma.update({
            where: {
                id: userId
            },
            data: dataToUpdate
        })

        res.status(200).json(user)
    } catch (error: any) {
        if (error?.code === 'P2002' && error?.meta?.target?.includes('email')) {
            res.status(400).json({ error: 'Email already exists' })
        } else if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'An error occurred, try again later' })
        }
    }
}

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    const userId = parseInt(req.params.id)
    try {
        await prisma.delete({
            where: {
                id: userId
            }
        })

        res.status(200).json({
            message: `El usuario ${userId} ha sido eliminado`
        }).end()

    } catch (error: any) {
        if (error?.code == 'P2025') {
            res.status(404).json('Usuario no encontrado')
        } else {
            console.log(error)
            res.status(500).json({ error: 'Hubo un error, pruebe más tarde' })
        }
    }

}