let env = {};

try {
    env = require('../.env.json');
} catch (e) {}

const {R} = require("../dist/redbean-node");
const assert = require('assert');
const knex = require("knex");

let dbName = "test" + Date.now();
let host, user, password, port;
if (env.MYSQL2_HOST) {
    console.log("Using MySQL2 config from env")
    host = env.MYSQL2_HOST;
    user = env.MYSQL2_USER;
    password = env.MYSQL2_PASSWORD;
    port = env.MYSQL2_PORT;
}

describe("Prepare MySQL2 database", function () {
    R.freeze(false);
    R.devDebug = false;
    R.debug(false);
    R._modelList  = {}
    R.useBetterSQLite3 = false;

    it("create database", async () => {

        let k = knex({
            client: "mysql2",
            connection: {
                host: host,
                user: user,
                password: password,
                port: port,
            }
        });
        await k.raw('CREATE DATABASE ??', [dbName]);
        await k.destroy();
    });
})

describe("MySQL2", () => {

    it("#R.setup()", async () => {

        R.setup("mysql2", {
            host: host,
            user: user,
            password: password,
            database: dbName,
            port: port,
        });

        assert.equal(R.dbType, "mysql");
    });

    it("#R.setup() with mariadb", () => {
        R.setup("mariadb", {
            host: host,
            user: user,
            password: password,
            database: dbName,
            port: port,
        });
        assert.equal(R.dbType, "mysql");
    });

    let commonDir = "common";
    let normalizedPath = require("path").join(__dirname, commonDir);

    require("fs").readdirSync(normalizedPath).forEach(function(file) {
        require(`./${commonDir}/` + file)();
    });


});

describe("Close Connection", () => {
    it("#R.close()", async () => {
        await R.close();
    });
});

describe("Cleanup MySQL2 database", () => {
    it("drop database", async () => {
        let k = knex({
            client: "mysql2",
            connection: {
                host: host,
                user: user,
                password: password,
                port: port,
            }
        });
        await k.raw('DROP DATABASE ??', [dbName]);
        await k.destroy();
    });
})
