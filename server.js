var express = require('express');
var morgan = require('morgan');
var path = require('path');

var app = express();
app.use(morgan('combined'));

var articleOne = {
    title:'article-one',
    heading:'article-one',
    content:`
    <p> this is content of article one</p>  
    `
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









app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/article-one', function (req , res) {
   res.sendFile(path.join(__dirname, 'ui', 'article-one.html')); 
});

app.get('/article-two', function (req , res) {
   res.sendFile(path.join(__dirname, 'ui', 'article-two.html')); 
});

app.get('/article-three', function (req , res) {
   res.sendFile(path.join(__dirname, 'ui', 'article-three.html'));  
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
