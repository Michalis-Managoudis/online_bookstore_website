const activePage = document.querySelectorAll(".top-nav li");
for(let i=0; i<activePage.length;i++){

    activePage[i].addEventListener('click', (li) =>{
        li.target.classList.toggle('active');
    })

}
