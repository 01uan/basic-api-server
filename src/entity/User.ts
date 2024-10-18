import {IsNotEmpty, IsOptional, Length, Max, MaxLength, Min} from "class-validator"
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    @IsOptional() // optional in our code because the DB will generate the id
    id: number

    //@Column ONLY RUNS ONCE - when creating the DB/tables
    // need to validate before saving to db
    @Column({ type: 'varchar', length: 50, nullable: false})
    @Length(1,50,{message: 'First name must be 1 to 50 characters'})
    firstName: string

    @Column({ type: 'varchar', length: 50, nullable: false})
    @MaxLength(50, {message: 'Last name must be max 50 characters'})
    @IsNotEmpty({message: 'Last name is required'})
    lastName: string

    
    @Column({ type: 'integer', width: 3, nullable: true, default: 29})
    @Min(13, {message: 'Age must be 13 or greater'})
    @Max(150, {message: 'Age must be 150 or less'})
    @IsOptional()
    age: number
}