var button = document.getElementById('counter');
button.onclick = function() {
    //Create a Request to counter Endpoint
    var request = new XMLHttpRequest();
    
    //capture response and store it in variable
    request.onreadystatechange = function() {
      if(request.readyState === XMLHttpRequest.DONE ){
            if(request.status === 200){
                var counter=request.responseText;
                var span=document.getElementById('count');
                span.innerHTML=counter.toString();
            }   
      }  
    };

    //Make the request
    request.open('GET', 'http://rkvithlani.imad.hasura-app.io/counter',true);
    request.send(null);
};