import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import {contains, validate, ValidatorOptions} from "class-validator";
import {Controller} from "../decrorator/Controller";
import {Route} from "../decrorator/Route";
import {Student} from "../entity/Student";
@Controller('/op')

export default class StudentController {
    // get the sweet sweet repo methods (90+)
    private studentRepo = AppDataSource.getRepository(Student)

    private validOptions = {
        stopAtFirstError: true,
        skipMissingProperties: false,
        validationError: {target: false, value: false},
        whitelist: true,
        forbidNonWhitelisted: true
    }

    // named methods after CRUD - create, read, update, delete
    @Route('get', '/:uuid*?') // '*?' makes the param optional
    async read(req: Request, res: Response, next: NextFunction) {
        if (req.params.uuid) {
            return this.studentRepo.findOneBy({id: req.params.uuid})
        } else {
            return this.studentRepo.find()
        }
    }

    //TODO add the second most simplest action to the controller
    @Route('delete', '/:uuid')
    async delete(req: Request, res: Response, next: NextFunction) {
        if (!(await this.studentRepo.findOneBy({id: req.params.uuid}))) {
            next(); // let next middleware handle it which is error
        }
        // we usually want to pass in the whole object and not just the uuid
        return this.studentRepo.delete({id: req.params.uuid})
    }

}