var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');
var session = require('express-session');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());
app.use(session({
    secret:'someRandomSecretValue',
    cookie: {maxAge : 1000 * 60 * 60 * 24 * 30 },
    proxy: true,
    resave: true,
    saveUninitialized: true
}));
var counter=0;
app.get('/counter', function (req , res) {
    counter = counter + 1;
    res.send(counter.toString());
});

var config = {
    host: 'db.imad.hasura-app.io',
    user:'rkvithlani',
    database:'rkvithlani',
    port: '5432',
    password: process.env.DB_PASSWORD
};
/*
var articles = {
    'article-one': {
        title:'article-one',
        heading:'article-one',
        content:`
        <p> this is content of article one</p>  
        `},
    'article-two': {
        title:'article-two',
        heading:'article-two',
        content:`
        <p> this is content of article two</p>  
        `},
    'article-three': {
        title:'article-three',
        heading:'article-three',
        content:`
        <p> this is content of article three</p>  
        `}
};*/

function createTemplate(data){
  var title=data.title ;
  var heading = data.heading ;
  var content=data.content ;
  var date = data.date;
  var htmlTemplate = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>
            ${title}
        </title>
        <meta name="viewpart" content="width=device-width initial-scale=1" />
     <link href="/ui/style.css" rel="stylesheet" />    
      </head>
      <body>
        <div class="container">
        <a href='/'>Home</a>
        <hr>
        <div>
          <h1>
            ${heading}
           </h1>
        </div>
        <div>
            ${date.toDateString()}
        </div>
        <div>
          <p>
            ${content}
          </p>
        </div>
        </div>
      </body>
    </html>
  `;
  return htmlTemplate;
}

function hash(input,salt){
    var hashed = crypto.pbkdf2Sync(input, 'salt', 10000, 512, 'sha512');
    return ["pbkdf2","10000",salt,hashed.toString('HEX')].join('$');
}

app.get('/hash/:input',function(req,res){
   var hashedString = hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
});

app.post('/create-user', function(req,res){
   var username = req.body.username;
   var password = req.body.password;
   var salt = crypto.randomBytes(128).toString('HEX');
   var dbString = hash(password,salt);
   pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString], function(err,result){
       if(err) {
          res.status(500).send(err.toString());
      }else {
          res.status(200).send("user Successfully Created" + username);
          
      }
   });
});

app.post('/login', function(req,res){
    var username = req.body.username;
    var password = req.body.password;
    pool.query('SELECT * FROM "user" WHERE username = $1',[username], function(err,result){
       if(err) {
          res.status(500).send(err.toString());
      }else {
          if(result.rows.length === 0){
              res.status(403).send('invalid username/password');
          }
          else{
              var dbString = result.rows[0].password;
              var salt = dbString.split('$')[2];
              var hashedPassword = hash(password,salt);
              if(hashedPassword === dbString){
                  
                  req.session.auth = {userId: result.rows[0].id};
                  res.status(200).send('Credential Correct');
              }
              else{
                  res.status(403).send('invalid username/password');
              }
          }
      }
   });
});

app.get('/check-login', function(req,res){
   
   if(req.session && req.session.auth && req.session.auth.userId){
       res.send('You are logged in: ' + req.session.auth.userId.toString());
   } else{
       res.send("You are not logged in");
   }
});

app.get('/logout', function(req,res){
   delete req.session.auth;
   res.send('You are logged out');
});

var pool = new Pool(config);
app.get('/test-db',function(req,res) {
   pool.query('SELECT * FROM test',function(err,result){
      if(err) {
          res.status(500).send(err.toString());
      }else {
          res.send(JSON.stringify(result.rows));
      }
   }); 
});
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

/*
var names=[];
app.get('/submit-name',function(req,res){
   var name=req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
});

app.get('/:articleName', function (req , res) {
    var articleName=req.params.articleName;
   res.send(createTemplate(articles[articleName])); 
});*/

app.get('/articles/:articleName', function (req , res) {
    pool.query("SELECT * FROM article WHERE title = $1", [req.params.articleName] , function(err,result){
        if(err) {
          res.status(500).send(err.toString());
        }else {
            if(result.rows.length === 0) {
                res.status(404).send('Article Not found');
            }else{
                var articleData = result.rows[0];
                res.send(createTemplate(articleData));
            }
        }
    });
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

app.get('/favicon.ico', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'favicon.ico'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});