const {Pool} = require('pg');



const pool = new Pool ({
    user: 'davidesimone',
    password: 'root',
    host: 'localhost',
    database: 'rosterz_database',
    port: '5000'
})


module.exports = pool