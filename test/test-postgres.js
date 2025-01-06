let env = {};

try {
    env = require('../.env.json');
} catch (e) {}

const {R} = require("../dist/redbean-node");
const assert = require('assert');
const knex = require("knex");

let dbName = "test" + Date.now();
let host, user, password, port;
if (env.PG_HOST) {
    console.log("Using Postgres config from env")
    host = env.PG_HOST;
    user = env.PG_USER;
    password = env.PG_PASSWORD;
    port = env.PG_PORT;
}

describe("Prepare Postgres database", function () {
    R.freeze(false);
    R.devDebug = false;
    R.debug(false);
    R._modelList  = {}
    R.useBetterSQLite3 = false;

    it("create database", async () => {

        let k = knex({
            client: "pg",
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

describe("Postgres", () => {

    it("#R.setup()", async () => {

        R.setup("pg", {
            host: host,
            user: user,
            password: password,
            database: dbName,
            port: port,
        });

        assert.equal(R.dbType, "pg");
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

describe("Cleanup Postgres database", () => {
    it("drop database", async () => {
        let k = knex({
            client: "pg",
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
