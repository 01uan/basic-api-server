import * as express from "express"
import * as bodyParser from "body-parser"
import {Request, Response} from "express"
import {AppDataSource} from "./data-source"
import {User} from "./entity/User"
import {UserController} from "./controller/UserController";
import {RouteDefinition} from "./decrorator/RouteDefinition";
import * as createError from "http-errors";
import * as cors from "cors";

const corsOptions = {
    origin: /localhost:\d{4,5}$/i,
    credentials: true, // allow cookie to be sent IF NEEDED
    allowHeaders: 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    methods: 'GET,POST,DELETE,OPTIONS'
}
AppDataSource.initialize().then(async () => {

    // create express app
    const app = express()
    app.use(bodyParser.json())
    app.use(cors(corsOptions))
    // You can add even more CORS restrictions for a super secure server
    app.use((req, res, next) => {
        // add more header limitations here
        next()
    })
    app.options('*', cors(corsOptions)) // failsafe to ensure the browser pre-flight check succeeds

    // register express routes from defined application routes
    /*    Routes.forEach(route => {
            (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
                const result = (new (route.controller as any))[route.action](req, res, next)
                if (result instanceof Promise) {
                    result.then(result => result !== null && result !== undefined ? res.send(result) : undefined)

                } else if (result !== null && result !== undefined) {
                    res.json(result)
                }
            })
        })*/

    // setup express app here
    // ...
// Iterate over all our controllers and register our routes
    const controllers = [
        UserController
// Add other controllers here
    ];
    controllers.forEach((controller) => {
// This is our instantiated class
// eslint-disable-next-line new-cap
        const instance = new controller();
// The prefix saved to our controller
        const path = Reflect.getMetadata('path', controller);
// Our `routes` array containing all our routes for this controller
        const routes: Array<RouteDefinition> = Reflect.getMetadata('routes', controller);
// Iterate over all routes and register them to our express application
        routes.forEach((route) => {
            app[route.method](path + route.param, (req: express.Request, res: express.Response,
                                                   next: express.NextFunction) => {
                const result = instance[route.action](req, res, next);
                if (result instanceof Promise) {
                    result.then((result) => result !== null && result !== undefined ? res.send(result) :
                        next())
                        .catch((err) => /*next(createError(500, err))*/false);
                } else if (result !== null && result !== undefined) res.json(result);
            });
        });
    });

    app.use((res, req, next) => {
        next(createError(404))
    })
    app.use((err, req, res, next) => {
        res.status(err.status || 500);
        res.json({error: err.message, status:err.status, stack:err.stack.split(/\s{4,}/)});
    })
    // start express server
    const port = process.env.PORT || 3004
    app.listen(port)

    // insert new users for test
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Timber",
    //         lastName: "Saw",
    //         age: 27
    //     })
    // )
    //
    // await AppDataSource.manager.save(
    //     AppDataSource.manager.create(User, {
    //         firstName: "Phantom",
    //         lastName: "Assassin",
    //         age: 24
    //     })
    // )

    console.log(`Open http://localhost:${port}/users to see results`)

}).catch(error => console.log(error))