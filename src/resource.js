const resource = (router, crudMethods, middleware) => {
    if (middleware) {
        if (crudMethods.index) router.get('/', middleware, crudMethods.index)
        if (crudMethods.create) router.get('/create', middleware, crudMethods.create)
        if (crudMethods.store) router.post('/', middleware, crudMethods.store)
        if (crudMethods.show) router.get('/:id', middleware, crudMethods.show)
        if (crudMethods.create) router.get('/create', middleware, crudMethods.create)
        if (crudMethods.update) router.put('/:id', middleware, crudMethods.update)
        if (crudMethods.destroy) router.delete('/:id', middleware, crudMethods.destroy)
    } else {
        if (crudMethods.index) router.get('/', crudMethods.index)
        if (crudMethods.create) router.get('/create', crudMethods.create)
        if (crudMethods.store) router.post('/', crudMethods.store)
        if (crudMethods.show) router.get('/:id', crudMethods.show)
        if (crudMethods.create) router.get('/create', crudMethods.create)
        if (crudMethods.update) router.put('/:id', crudMethods.update)
        if (crudMethods.destroy) router.delete('/:id', crudMethods.destroy)
    }
}
export default resource