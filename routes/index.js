require('dotenv').config();

const mysql = require('mysql');
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    
})//.connect() (var db = ... 일때)

db.connect()

// db.connect({
//     host: process.env.DB_HOST,
//     username: process.env.DB_USER,
//     password: process.env.DB_PASSWORD
//   }); //DB 연결 예제 코드
  
//   app.listen(process.env.SERVER_PORT, () => {
//       console.log('sample server is listening to port ' + process.env.SERVER_PORT);
//   }); //서버 포트 예제 코드

