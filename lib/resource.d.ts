import express from 'express';
declare module 'nodisan/src/resource' {
    interface CrudMethods {
        index?: express.RequestHandler;
        create?: express.RequestHandler;
        store?: express.RequestHandler;
        show?: express.RequestHandler;
        edit?: express.RequestHandler;
        update?: express.RequestHandler;
        destroy?: express.RequestHandler;
    }

    type MiddlewareFunction = express.RequestHandler;

    function resource(
        router: express.Router,
        crudMethods: CrudMethods,
        middleware?: MiddlewareFunction
    ): void;

    export default resource;
}
