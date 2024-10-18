import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import {contains, validate, ValidatorOptions} from "class-validator";
import {Route} from "../decrorator/Route";

export class UserController {

    private userRepository = AppDataSource.getRepository(User)

    @Route('get')
    async all(request: Request, response: Response, next: NextFunction) {
        return this.userRepository.find()
    }

    @Route('get', '/:id')
    async one(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)


        const user = await this.userRepository.findOne({
            where: { id }
        })

        if (!user) {
            return "unregistered user"
        }
        return user
    }

     validationOptions: ValidatorOptions = {
        skipMissingProperties: false,
         whitelist: true,
         forbidNonWhitelisted: true,
        validationError: {
            target: false,
            value: false
        },
        forbidUnknownValues: true, // this not working so do not rely on this option
        stopAtFirstError: true
    }

    @Route('post')
    async save(request: Request, response: Response, next: NextFunction) {
        // WE need the validation rules from the User entity that is why we copy the data from req.body into a new User object
        const user = Object.assign(new User(), request.body)
        // NEED to enforce the validation rules before we try to save to the DB .... to be continued

        const knowKeys = ['id', 'firstname', 'lastname', 'age']
        const postedKeys = Object.keys(request.body)
        let containsUnknownKey = false

        for (const bodyKey of postedKeys) {
            if (knowKeys.indexOf(bodyKey)) {
                containsUnknownKey = true
                // return `Unknown key of ${bodyKey}`
            }
        }

        const violations = await validate(user, this.validationOptions)
        console.log("class-validator violations", violations)

        //TODO prevent posts that have unknown values i.e. coolnessfactor

        if (violations.length) {
            //RECOMMEND FOR FINAL PROJECT TAHT YOU CONVERRT THE VIOLATIONS
            // the same errorMessage structure we did with the from validation
            return violations // dump out all the rules our requ.body broke
        } else if (containsUnknownKey) {
            return `Contains Unknown key`
        }
        return this.userRepository.save(user)
    }

    @Route('delete', '/:id')
    async remove(request: Request, response: Response, next: NextFunction) {
        const id = parseInt(request.params.id)

        let userToRemove = await this.userRepository.findOneBy({ id })

        if (!userToRemove) {
            next();
            return "this user not exist"
        }

        await this.userRepository.remove(userToRemove)

        return "user has been removed"
    }

}