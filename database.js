const mysql = require("mysql2");

const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Kamla@0511",
    database: "myntra"
})

connection.connect(function (err) {
    if (err) throw err
    console.log("Database connected")
})

module.exports = connection;