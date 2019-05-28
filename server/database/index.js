const Mysql = require('mysql');
const config = require('../config/db');

const pool = Mysql.createPool({
  host     : config.database.HOST,
  user     : config.database.USERNAME,
  password : config.database.PASSWORD,
  database : config.database.DATABASE,
});

const query = function(sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
      }
      else {
        connection.query(sql, values, (error, rows) => {
          if (error) {
            reject(error);
          }
          else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  })
    .catch((error) => {
      console.log(error, 'Promise error');
    });
};

module.exports = query;
