/*
var button = document.getElementById('counter');
button.onclick = function() {
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200 ){
            var counter=request.responseText;
            var span=document.getElementById('count');
            span.innerHTML=counter.toString();
        }  
    };

    //Make the request
    request.open('GET', 'http://rkvithlani.imad.hasura-app.io/counter',true);
    request.send(null);
};

var submit = document.getElementById('submit_btn');
submit.onclick = function() {
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE && request.status === 200 ){
            var names=request.responseText;
            names=JSON.parse(names);
            var list='';
            for(var i=0;i<names.length;i++){
                list += "<li>" + names[i] + "</li>";
                }
            var ul=document.getElementById('namelist');
            ul.innerHTML=list;
        }  
    };

    //Make the request
    var nameInput = document.getElementById('name');
    var name = nameInput.value;
    request.open('GET', 'http://rkvithlani.imad.hasura-app.io/submit-name?name=' + name ,true);
    request.send(null);
};*/

var submit = document.getElementById('submit_btn');
submit.onclick = function() {
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE){
          if(request.status === 200 ){
              alert('logged in successfully');
          }else if (request.status === 403  ){
              alert('incorrect username/password');
          }else if (request.status === 500 ){
              alert('something went wrong with server');
          }
        }
    };

    //Make the request
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    request.open('POST', 'http://rkvithlani.imad.hasura-app.io/login' ,true);
    request.setRequestHeader('Content-Type','application/json');
    request.send(JSON.stringify({username:username,password:password}));
};