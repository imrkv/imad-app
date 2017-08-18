var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool = require('pg').Pool;

var app = express();
app.use(morgan('combined'));

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
};

function createTemplate(data){
  var title=data.title ;
  var heading = data.heading ;
  var content=data.content ;
  
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

var names=[];
app.get('/submit-name',function(req,res){
   var name=req.query.name;
   names.push(name);
   res.send(JSON.stringify(names));
});

/*app.get('/:articleName', function (req , res) {
    var articleName=req.params.articleName;
   res.send(createTemplate(articles[articleName])); 
});*/

app.get('/articles/:articleName', function (req , res) {
    pool.query("SELECT * FROM article WHERE title ='" + req.params.articleName + "'" , function(err,result){
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
