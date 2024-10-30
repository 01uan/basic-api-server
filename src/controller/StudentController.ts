import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import {contains, validate, ValidatorOptions} from "class-validator";
import {Controller} from "../decrorator/Controller";
import {Route} from "../decrorator/Route";
import {Student} from "../entity/Student";
import {Like} from "typeorm";
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
            // WE CAN build the find OPtions (aka, where clauses and order by caluses) from the query string "req.query"
            //
            const findOptions = {where:[], order:{}}
            const existingFields = this.studentRepo.metadata.ownColumns.map((col) => col.propertyName);

            const sortField: string = existingFields.includes(req.query.sort) ? req.query.sort : 'id';
            const sortDirection:string = req.query.reverse? "DESC" : "ASC"
            findOptions.order[sortField] = sortDirection
            console.log('Order clause:\n', findOptions.order);
            // look for query param trouve
            // loop thru all the existingField (aka column names/propeties) and build a where clause

            for (const columnName of existingFields) {
                // syntactic sugar when building a js object with a dynamic property name
                // use [] brackets around the variab le
                findOptions.where.push({[columnName]: Like(`%${req.query.trouve}%`)})
            }
            console.log('Where clause\n', findOptions.where)
            return this.studentRepo.find(findOptions); // reutn all students
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
        // see the delete method in the repo for an alterntaive that does not quire getting the sutdent from db
    }

    @Route('post')
    async create(req: Request, res: Response, next: NextFunction) {
        // get the validations rules (new Student()) and the student data (req.body) and the merge them
        const studnetToInsert = Object.assign(new Student(), req.body)
        const violations = await validate(studnetToInsert, this.validOptions)
        if (!violations.length) {
            res.StatusCode = 201 // CREATED status code
            return this.studentRepo.insert(req.body);
        } else {
            res.statusCode = 422
            return violations;
        }

    }

    //update action
    @Route('put', '/:uuid')
    async update(req: Request, res: Response, next: NextFunction) {

        // check params uuid is the same as the id in the req.body
        // do this simple check before accesing the db, save some processor cycles
        if (req.params.uuid != req.body.id) {
            next()
        }

        const studentExists:boolean = await this.studentRepo.exists({where:{id: req.params.uuid}})


        if (!studentExists) {
            next() // gets caught by umbrella 404 error in index.ts
        } else {
            const studentToUpdate = Object.assign(new Student(), req.body)
            // we have to validate WHENEVER we update save/update ot the db
            const violations = await validate(studentToUpdate, this.validOptions)
            if (!violations.length) {
                res.statusCode = 422 //un processable content
                return violations
            } else {
                res.statusCode = 200 // accepted - but usually updates will respond with 200
                return this.studentRepo.update(req.param.uuid, studentToUpdate)
            }
        }
    }

}