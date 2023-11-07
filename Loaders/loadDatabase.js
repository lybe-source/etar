const mysql = require("mysql");
const config = require("../config");

module.exports = async () => {

    let db = mysql.createConnection({
        host: config.hostDB,
        user: config.userDB,
        password: config.passwordDB,
        database: config.database
    })

    return db;
}