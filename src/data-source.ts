import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"

export const AppDataSource = new DataSource({
    type: 'sqlite', // postgress, localdb, mysql, mariadb
    database: './sqlite.db', // setting the location of the db
    synchronize: true,
    logging: false,
    entities: [User], // Entity is a data class that represents a table in the database (User.ts)
    // The properties map to the columns in the table
    migrations: [],
    subscribers: [],
})
