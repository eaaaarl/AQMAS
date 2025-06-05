"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config = {
    development: {
        client: "mysql2",
        connection: {
            host: "localhost",
            port: 3306,
            user: "root",
            password: "",
            database: "acmas",
        },
        migrations: {
            tableName: "knex_migrations",
            directory: "./migrations",
        },
        seeds: {
            directory: "./seeds",
        },
    },
};
exports.default = config;
