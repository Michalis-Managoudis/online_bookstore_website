const data2 = [{ "_id" : 1, "title" : "Unlocking ",
    "author" :  "Johny" ,
    "img_src": "image04"
},
{
    "_id" : 2, "title" : " Android",
    "author" :  "Depp",
    "img_src": "image05" 
}
]
const productsLocation = document.querySelector(".products ul");
for(let i=1; i<9; i++){
    let newLi = document.createElement('li');
    let productDIV_1 = '<div class="product"><a href="#" class="info"><span class="holder"><img src="images/image0'+i.toString()+'.jpg" alt="" />'
    let productDIV_2 = '<span class="book-name"> '+ 'MY NOOK IS ' +'</span><span class="author">by'+ 'MY AUTHOR IS ' +'</span> <span class="description">Maecenas vehicula ante eu enim pharetra<br />'
    let productDIV_3 = 'scelerisque dignissim <br />sollicitudin nisi</span> </span></a> <a href="#" class="buy-btn">ΠΡΟΣΘΗΚΗ<span class="price">'
    let productDIV_4 = '<span class="low">€</span>2'+i.toString()+'<span class="high">00</span></span></a> </div>'
    newLi.innerHTML = productDIV_1+productDIV_2+productDIV_3+productDIV_4;  
    console.log(newLi.innerHTML);
    productsLocation.appendChild(newLi)
}
for(let i=0; i<data2.length; i++){
    let newLi = document.createElement('li');
    let productDIV_1 = '<div class="product"><a href="#" class="info"><span class="holder"><img src="images/'+data2[i].img_src +'.jpg" alt="" />'
    let productDIV_2 = '<span class="book-name"> '+ data2[i].title +'</span><span class="author">by'+ data2[i].author +'</span> '
    let productDIV_3 = ' </span></a> <a href="#" class="buy-btn">ΠΡΟΣΘΗΚΗ<span class="price">'
    let productDIV_4 = '<span class="low">€</span>2'+i.toString()+'<span class="high">00</span></span></a> </div>'
    newLi.innerHTML = productDIV_1+productDIV_2+productDIV_3+productDIV_4;  
    console.log(newLi.innerHTML);
    productsLocation.appendChild(newLi)
}

for(let i=1; i<9; i=i+2){
    let newLi = document.createElement('li');
    let productDIV_1 = '<div class="product"><a href="#" class="info"><span class="holder"><img src="images/image0'+i.toString()+'.jpg" alt="" />'
    let productDIV_2 = '<span class="book-name"> '+ 'MY NOOK IS ' +'</span><span class="author">by'+ 'MY AUTHOR IS ' +'</span> '
    let productDIV_3 = '</span></a> <a href="#" class="buy-btn">ΠΡΟΣΘΗΚΗ<span class="price">'
    let productDIV_4 = '<span class="low">€</span>2'+i.toString()+'<span class="high">00</span></span></a> </div>'
    newLi.innerHTML = productDIV_1+productDIV_2+productDIV_3+productDIV_4;  
    console.log(newLi.innerHTML);
    productsLocation.appendChild(newLi)
}

for(let i=1; i<9; i=i+2){
    let newLi = document.createElement('li');
    let productDIV_1 = '<div class="product"><a href="#" class="info"><span class="holder"><img src="images/image05'+'.jpg" alt="" />'
    let productDIV_2 = '<span class="book-name"> '+ 'MY NOOK IS ' +'</span><span class="author">by'+ 'MY AUTHOR IS ' +'</span> '
    let productDIV_3 = ' </span></a> <a href="#" class="buy-btn">ΠΡΟΣΘΗΚΗ<span class="price">'
    let productDIV_4 = '<span class="low">€</span>2'+i.toString()+'<span class="high">00</span></span></a> </div>'
    newLi.innerHTML = productDIV_1+productDIV_2+productDIV_3+productDIV_4;  
    console.log(newLi.innerHTML);
    productsLocation.appendChild(newLi)
}

for(let i=1; i<9; i=i+2){
    let newLi = document.createElement('li');
    let productDIV_1 = '<div class="product"><a href="#" class="info"><span class="holder"><img src="images/image08'+'.jpg" alt="" />'
    let productDIV_2 = '<span class="book-name"> '+ 'MY NOOK IS ' +'</span><span class="author">by'+ 'MY AUTHOR IS ' +'</span> '
    let productDIV_3 = ' </span></a> <a href="#" class="buy-btn">ΠΡΟΣΘΗΚΗ<span class="price">'
    let productDIV_4 = '<span class="low">€</span>2'+i.toString()+'<span class="high">00</span></span></a> </div>'
    newLi.innerHTML = productDIV_1+productDIV_2+productDIV_3+productDIV_4;  
    console.log(newLi.innerHTML);
    productsLocation.appendChild(newLi)
}
/*
let newDiv = document.createElement('div');
newDiv.setAttribute("class", "product");
let newSpan = document.createElement('span');
newSpan.setAttribute("class", "holder");

let newAbig = document.createElement('a');
newAbig.setAttribute('href', 'display-product.html');
newAbig.setAttribute('class', 'info');

let newImg = document.createElement('img');
newImg.src = "images/image02.jpg"

newSpan.appendChild(newImg);
newAbig.appendChild(newSpan);
newDiv.appendChild(newAbig);

newLi.appendChild(newDiv);
productsLocation.appendChild(newLi)
*/