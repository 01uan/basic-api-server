import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsNotEmpty, IsOptional, Length, Matches, Max, MaxLength, Min} from "class-validator"


@Entity()
export class Student {
    @PrimaryGeneratedColumn('uuid')
    @IsOptional()
    id: string;

    @Column({type: 'integer', width: 3, nullable: true})
    @IsOptional()
    @Max(100, { message: "Stress over 100 kills you" })
    stressLevel:number

    @Column({type: 'integer', width: 2, nullable: false})
    @Max(99, {message: 'Pay attention!'})
    @IsNotEmpty({message: 'Attention Span is required.'})
    attentionSpan:number;

    @Column({type: 'varchar', length: 8, nullable: false})
    @IsNotEmpty({message: 'faveCourseCode is required.'})
    @Matches(/^[A-Z]{3,4}\s?\d{3}$/, {message: 'Need to be Saskpolytech course code format'})
    @Length(1,8,{message: 'faveCourseCode must have a maximum of 8 characters.'})
    faveCourseCode:string;

    @Column({type: 'varchar', length: 150, nullable: false})
    @IsNotEmpty({message: 'Email is required.'})
    @Length(1,150,{message: 'Email must have a maximum length of 150 characters.'})
    email:string

    @Column({type: 'nvarchar', length: 40, nullable: true})
    @IsOptional()
    @Length(1,40,{message: 'discord Alias has a maximum length of 40 characters'})
    discordAlias:string;
}

