import {AppDataSource} from "../data-source"
import {NextFunction, Request, Response} from "express"
import {User} from "../entity/User"
import {validate, ValidatorOptions} from "class-validator";
import {Controller} from "../decrorator/Controller";
import {Route} from "../decrorator/Route";

@Controller("/users")
export class UserController {
// Inside controllers methods/functions are called 'ACTIONS' -- still the same thing
    private userRepository = AppDataSource.getRepository(User)

    @Route()
    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    @Route('get', '/:id')
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        const user = await this.userRepository.findOne({
            where: {id}
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }


    validOptions: ValidatorOptions = {

        skipMissingProperties: false,
        /*            whitelist: true,
                    forbidNonWhitelisted: true,*/
        validationError: {
            target: false,
            value: false
        },
        forbidUnknownValues: true, // does not work as expected - Do not rely on this options
        // only whitelist work
        stopAtFirstError: true
    }


    @Route('post')
    async save(request: Request, response: Response, next: NextFunction) {
        const {firstName, lastName, age, id} = request.body;
        //TODO ensure unknown properties are not allowed in the posted values i.e. request.body
        // assume whitelist options did not exist
        const postedKeys: string[] = Object.keys(request.body)
        const knownKeys: string[] = ['firstName', 'lastName', 'age', 'id']
        let unKnownKeys: string = ""

        for (const bodyKey of postedKeys) {
            if (!knownKeys.includes(bodyKey)) {
                unKnownKeys = bodyKey
            }
        }

        if (unKnownKeys.length) {
            // throw new Error('this is an error')
            return `Posted body contains an unknown property: ${unKnownKeys}`
        } else {
            const user = Object.assign(new User(), request.body) //copy req.body data into a new User object - it has rules
            // so lower cannot use request.body
// validate the user object BEFORE we try to save to the database AND to have a user-friendly error message
            const violations = await validate(user, this.validOptions) // user now has both data and rules
            console.log("class-validator violations", violations)
            if (violations.length) {
                //recommend you change the structure to be like the errorMessage from form validation example

                return violations; // this is just for debug - dump the violations structure to the browser
            } else {
                return this.userRepository.save(user)
            }
        }


    }

    @Route('delete', '/:id')
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({id})

        if (!userToRemove) {
            // return "this user not exist"
            next() // skip out of this methods and trickle down to the createError(404)
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}