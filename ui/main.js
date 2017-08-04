console.log('Loaded!');

//index.html text modification by js
element=document.getElementById('index-text');
element.innerHTML='This text is modified by js';

//index.html image modification by js

img=document.getElementById('imad-img');
var marginLeft = 0;
img.onclick = function () {
    var interval = setInterval(moveRight,50);
};

function moveRight() {
    marginLeft = marginLeft + 1;
    img.style.marginLeft = marginLeft + 'px';
}