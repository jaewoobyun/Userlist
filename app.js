var express = require('express');
var bodyParser = require('body-parser');
const mysql = require('mysql');
require('dotenv').config()

const app = express()

app.set('views', __dirname+'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile)
app.use(bodyParser.urlencoded({extended: false}))


const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
    
})

db.connect()

//!!! Post 조회
app.get('/topic/add', (req, res) => {
    var sql = 'SELECT * FROM topic'
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error")
        }
        console.log(result)
        // res.send(result)
        res.render('add.ejs', {topics : result}) //result data 를 add.ejs 파일로 전달한다.
        
    })
})

//!!! CREATE post 저장
app.post('/topic/add', (req, res) => {
    console.log(res.body);
    var title = req.body.title;
    var description = req.body.description;
    var author = req.body.author;
    //var sql = 'INSERT INTO topic (title, description, author) VALUES('+ title +',' + description + ','+ 'author)';
    // var sql = `INSERT INTO topic (title, description, author) VALUES(${title}, ${description}, ${author})`;
    var sql = `INSERT INTO topic (title, description, author) VALUES(?, ?, ?)`;
    var params = [title, description, author]

    db.query(sql, params, (err, result) => {
        if (err) {
            console.log(err)
            res.status(500).send("Internal Server Error")
        }

        console.log("성공적으로 저장 되었습니다. ")
        res.redirect(`/topic/${result.insertId}`)
        
        
        
    })
})

//!!! UPDATE 수정
app.get(['/topic/:id/edit'], function(req, res){// 수정기능
    var sql = 'SELECT id,title FROM topic';    // 일단, 글 목록을 불러온다.(edit페이지에도 글목록은 항상 존재)
    db.query(sql, function(err, topics, fields){
      var id = req.params.id; // request받은 id값
      if(id){
        var sql = 'SELECT * FROM topic WHERE id=?';// id값을 통하여 수정하려고 하는 특정 데이터만 불러온다.
        db.query(sql, [id], function(err, topic, fields){//[id] : 사용자로부터 받은 id
          if(err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.render('edit', {topics : topics, topic : topic[0] });//topic은 배열안에 담긴 객체로 들어오기 때문에, topic[0]으로 데이터를 객체만 전달한다.(전달한 데이터를 통해서 현재 수정하려고 하는 데이터를 화면에 뿌려준다.)
          }
        });
      } else {//id가 없을 경우 반환한다.
        console.log(err);
        res.send('There is no id.');
      }
    });
 });
 
 //!!!UPDATE 
 app.post('/topic/:id/edit', function(req, res){
    var sql = 'UPDATE topic SET title=?, description=?, author=? WHERE id=?';//수정하는 쿼리문(where가 매우 중요! 없으면, 다 똑같이 수정됨 큰일남.)
    var title = req.body.title; // 사용자가 다시 입력한 title. req객체의 body객체의 title키로 접근가능
    var description = req.body.description;
    var author = req.body.author;
    var id = req.params.id;//url의 파라미터로 id 값을 얻을 수 있다.
    db.query(sql, [title, description, author, id], function(err, result, fields){
      if(err) {
        console.log(err);
        res.status(500).send('Internal Server Error');
      } else {
        // res.redirect('/topic/'+id)// 수정한 페이지로 이동
        res.redirect(`/topic/add`)
      }
    });
 });

 

// const router = require('./routes')(app)

const urlPort = process.env.PORT || 5000;
app.listen(urlPort, ()=>{
    console.log(`server is starting : http://localhost:${urlPort}`)
})