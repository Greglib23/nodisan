import express from 'express'

const router = express.Router()

export const resource = (authToken, crudMethods) => {
    if (crudMethods.index) router.get('/', authToken, crudMethods.index)
    if (crudMethods.create) router.get('/create', authToken, crudMethods.create)
    if (crudMethods.store) router.post('/', authToken, crudMethods.store)
    if (crudMethods.show) router.get('/:id', authToken, crudMethods.show)
    if (crudMethods.create) router.get('/create', authToken, crudMethods.create)
    if (crudMethods.update) router.put('/:id', authToken, crudMethods.update)
    if (crudMethods.destroy) router.delete('/:id', authToken, crudMethods.destroy)
}