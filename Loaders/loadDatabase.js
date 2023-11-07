const mysql = require("mysql2");
const config = require("../config");

// module.exports = async () => {

//     let db = mysql.createConnection({
//         host: config.hostDB,
//         user: config.userDB,
//         password: config.passwordDB,
//         database: config.database
//     })

//     return db;
// }

module.exports = () => {
    
    return new Promise((resolve, reject) => {
        const db = mysql.createConnection({
            host: config.hostDB,
            user: config.userDB,
            password: config.passwordDB,
            database: config.database
        });

        db.connect((err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Base de donnée connecté !");
                resolve(db);
            }
        })
    })
}