const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'visidata',
    port: 2555
});
db.connect((err) => {
    if (err) {
        console.log(err);;
    }
    console.log('Connected to database');
});

module.exports = db;