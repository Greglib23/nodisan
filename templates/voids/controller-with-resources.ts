import { Request, Response } from "express";
import prisma from '../models/modelName'

export const index = async (): Promise<void> => {
    //Show the view for all the instances and basic crud
}

export const create = async (): Promise<void> => {
    //Return the view to create a new instance
}

export const store = async (req: Request, res: Response): Promise<void> => {
    //Store a new instance
    try {
        const { elements } = req.body
    } catch (error) {
        console.error(error)
    }
}

export const show = async (req: Request, res: Response): Promise<void> => {
    //Return the specified instance
    try {
        const id = parseInt(req.params.id)
    } catch (error) {
        console.error(error)
    }
}

export const edit = async (req: Request, res: Response): Promise<void> => {
    //Return the view to  edit the specified instance
}

export const update = async (req: Request, res: Response): Promise<void> => {
    //Update the instance in the database
    try {
        const id = parseInt(req.params.id)
        const { elements } = req.body
    } catch (error) {
        console.error(error)
    }
}

export const destroy = async (req: Request, res: Response): Promise<void> => {
    //Delete an element from database
    try {
        const id = parseInt(req.params.id)
    } catch (error) {
        console.error(error)
    }

}

