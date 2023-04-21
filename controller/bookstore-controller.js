'use strict';
/** You can define other models as well, e.g. postgres */
const model = require('../model/bookstore-model-json-db.js');
// Basic Pages

exports.getHomePage = (req, res) => {
    console.log("render products");
    //console.log('session:', req.session)

    model.getProductsPage((err, books) => {
        if (err) {
            console.log("Sending Error: ");
            res.send(err);
        }

        if (req.session.mySessionName == undefined) {

            res.render('home', {
                'logIn': false,
                db: books,
            });
        }
        else {
            res.render('home', {
                'logIn': true,
                db: books,
                'userEmail': req.session.mySessionName,
                'userID': req.session.mySessionID,
                'userCart': req.session.myCart
            })
        }

    });


}
exports.getProductsPage = (req, res) => {

    if (req.session.mySessionName == undefined) {

        model.getProductsPage((err, books) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }
            // To 'task' to kanei render sto main.hbs(main layout-- default)


            res.render('products', {
                allBooks: books.books,
                'logIn': false
            });

        });
    }
    else {
        model.getProductsPage((err, books) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }
            // To 'task' to kanei render sto main.hbs(main layout-- default)


            res.render('products', {
                allBooks: books.books,
                'logIn': true,
                'userEmail': req.session.mySessionName,
                'userID': req.session.mySessionID,
                'userCart': req.session.myCart
            });

        });

    }

}
exports.getDisplayPage = (req, res) => {

    console.log("Book with ID: " + req.params.bookID);
    model.getDisplayPage(req.params.bookID, (err, book) => {
        if (err) {
            console.log("Sending Error: ");
            res.send(err);
        }
        //console.log("Book:" + req.params )
        //console.log(book)
        // To 'task' to kanei render sto main.hbs(main layout-- default)
        if (req.session.mySessionName == undefined) {

            res.render('disp-product', {
                curBook: book,
                'logIn': false
            });
        }
        else {
            res.render('disp-product', {
                curBook: book,
                'logIn': true,
                'userEmail': req.session.mySessionName,
                'userID': req.session.mySessionID,
                'userCart': req.session.myCart
            })
        }

    });


    //res.render('disp-product', book);

    //res.send('Got a POST request');
};
exports.findBookPage = (req, res) => {

    console.log("Book with Title: " + req.body.bookT);

    model.findBookPage(req.body.bookT, (err, bookID) => {
        if (err) {
            console.log("Sending Error: ");
            res.send(err);
        }
        
        model.getDisplayPage(bookID, (err, book) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }
            if (req.session.mySessionName == undefined) {
    
                res.render('disp-product', {
                    curBook: book,
                    'logIn': false
                });
            }
            else {
                res.render('disp-product', {
                    curBook: book,
                    'logIn': true,
                    'userEmail': req.session.mySessionName,
                    'userID': req.session.mySessionID,
                    'userCart': req.session.myCart
                })
            }
    
        });

    });
    


    //res.render('disp-product', book);

    //res.send('Got a POST request');
};
// User Pages
exports.getLoginPage = (req, res) => {
    //req.session.mySessionName ='gg';
    if (req.session.mySessionName == undefined) {
        console.log("render login");

        res.render('login', { 'correct': true });

    }
    else if(req.session.mySessionName == 'admin'){
        res.redirect('/admin')
    }
    else { res.redirect('/user-account') }

}
exports.getCreateAccountPage = (req, res) => {
    console.log("render create-acc");
    let newUser = { 'isvalid': true };
    res.render('create-account', newUser);

}
exports.getUserCartPage = (req, res) => {
    console.log("render cart");

    if (req.session.mySessionName == undefined) {

        res.redirect('back');
    }
    else {
        console.log(req.session.mySessionID);
        model.getUserCart(req.session.mySessionID, (err, userNbooks) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }
            // To 'task' to kanei render sto main.hbs(main layout-- default)

            //console.log(userNbooks.books);
            //console.log(userNbooks.user[0]);
            res.render('cart', {
                
                userBooks: userNbooks.books,
                userInfo: userNbooks.user[0],
                userOrders:  userNbooks.orders,
                'logIn': true,
                'wrongData': false,
                'userEmail': req.session.mySessionName,
                'userID': req.session.mySessionID,
                'userCart': req.session.myCart
            });

        });

    }

}


exports.getUserAccountPage = (req, res) => {
    if (req.session.mySessionName == undefined) {

        res.render('user-account', { 'logIn': false });
    }
    else {
        model.getOrders(req.session.mySessionID, (err, userOrders) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }

            res.render('user-account', {
                userInfo:  userOrders.user,
                userOrders:  userOrders.orders,
                'logIn': true,
                'userEmail': req.session.mySessionName,
                'userID': req.session.mySessionID,
                'userCart': req.session.myCart
            });

        });
    }

}
exports.getAdminUserPage = (req, res) => {
    if (req.session.mySessionName == 'admin') {
        model.getOrders(req.session.mySessionID, (err, userOrders) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }

            res.render('admin', {
                userOrders:  userOrders.orders,
                'logIn': true,
                'userEmail': req.session.mySessionName,
                'userID': req.session.mySessionID,
                'userCart': req.session.myCart
            })

        });
    }
    else {
        res.render('login', { 'logIn': false });
    }

}
exports.getAdminAddBook = (req, res) => {
    if (req.session.mySessionName == 'admin') {


        res.render('admin-add', {
            'logIn': true,
            'userEmail': req.session.mySessionName,
            'userID': req.session.mySessionID,
            'userCart': req.session.myCart
        })
    }
    else {
        res.render('login', { 'logIn': false });
    }

}
exports.adminAddBook = function (req, res) {
    console.log("new request ")
    console.log("request query: ", req.query) // .....?key=val&key2=val2
    console.log("request params: ", req.params) //http://localhost:3000/users/34/books/8989
    console.log("request method: ", req.method)
    console.log("request body: ", req.body)
    console.log(req.session.mySessionID);
    var fieldsCompleted = true;
    if (req.body.title == '') fieldsCompleted = false;
    //if(req.body.user_password.length < 6) fieldsCompleted=false;
    if (req.body.isbn < 10) fieldsCompleted = false;
    if (req.body.author == '') fieldsCompleted = false;
    if (req.body.price == '') fieldsCompleted = false;
    if (req.body.status == '') fieldsCompleted = false;
    if (req.body.discount == '') fieldsCompleted = false;

    //
    // Split multivalued
    const bookBody = req.body;
    let splitAuthors = bookBody.authors.split(',');
    let splitCategories = bookBody.categories.split(',');

    // create book obj

    let newBook = {
        "id": 0,
        "title": bookBody.title,
        "ISBN": bookBody.ISBN,
        "publishedYear": parseInt(bookBody.year),
        "authors": splitAuthors,
        "pageCount": parseInt(bookBody.pages),
        "description": bookBody.description,
        "categories": splitCategories,
        "language": bookBody.language,
        "imgURL": 0 + ".jpg",
        "publisher": bookBody.publisher,
        "dimensions": bookBody.dimensions,
        "cover": bookBody.cover,
        "status": parseInt(bookBody.status),
        "price": parseFloat(bookBody.price),
        "discount": parseInt(bookBody.discount)
    };

    // procide or alert
    if (fieldsCompleted) {
        console.log("Field OK!")

        model.addBook(newBook, (err, cl) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }
            //console.log("Book:" + req.params )
            //console.log(book)
            // To 'task' to kanei render sto main.hbs(main layout-- default)


            // });
            // req.session.myCart = [];
            // res.redirect('products')
            console.log("Book:" + req.body)
        });
        newBook.exists = false;
        // Redirect
        res.redirect('/admin');
    }
    else {
        console.log("Fields InCorrect!");
        newBook.exists = true;
        res.render('admin-add', {
            newBook: newBook, 'userEmail': req.session.mySessionName,
            'userID': req.session.mySessionID,
            'userCart': req.session.myCart
        });
    }


}

exports.getAdminUpdateBook = (req, res) => {
    if (req.session.mySessionName == 'admin') {


        res.render('admin', {
            'logIn': true,
            'userEmail': req.session.mySessionName,
            'userID': req.session.mySessionID,
            'userCart': req.session.myCart
        })
    }
    else {
        res.render('login', { 'logIn': false });
    }

}

exports.adminCheckBook = function (req, res) {

    console.log("request body: ", req.body)
    const bookISBN = req.body.ISBN;


    model.checkBook(bookISBN, (err, currBook) => {
        if (err) {
            console.log("Sending Error: ");
            res.send(err);
        }
        if (currBook == undefined) { res.redirect('/admin'); }
        else {
            res.render('admin-update', {
                currBook: currBook,
                'logIn': true,
                'userEmail': req.session.mySessionName,
                'userID': req.session.mySessionID,
                'userCart': req.session.myCart
            });
        }
        console.log(currBook);

    });

}

exports.adminUpdateBook = function (req, res) {

    var fieldsCompleted = true;
    if (req.body.title == '') fieldsCompleted = false;
    //if(req.body.user_password.length < 6) fieldsCompleted=false;
    if (req.body.isbn < 10) fieldsCompleted = false;
    if (req.body.author == '') fieldsCompleted = false;
    if (req.body.price == '') fieldsCompleted = false;
    if (req.body.status == '') fieldsCompleted = false;
    if (req.body.discount == '') fieldsCompleted = false;

    //
    // Split multivalued
    const bookBody = req.body;
    let splitAuthors = bookBody.authors.split(',');
    let splitCategories = bookBody.categories.split(',');

    // create book obj

    let updateBook = {
        "id": parseInt(bookBody.id),
        "title": bookBody.title,
        "ISBN": bookBody.ISBN,
        "publishedYear": parseInt(bookBody.year),
        "authors": splitAuthors,
        "pageCount": parseInt(bookBody.pages),
        "description": bookBody.description,
        "categories": splitCategories,
        "language": bookBody.language,
        "imgURL": bookBody.id + ".jpg",
        "publisher": bookBody.publisher,
        "dimensions": bookBody.dimensions,
        "cover": bookBody.cover,
        "status": parseInt(bookBody.status),
        "price": parseFloat(bookBody.price),
        "discount": parseInt(bookBody.discount)
    };

    // procide or alert
    if (fieldsCompleted) {
        console.log("Field OK!")

        model.updateBook(updateBook, (err, cl) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }
            console.log("Book Updated!!!")
        });


        // Redirect
        res.redirect('/admin');
    }
    else {
        console.log("Fields InCorrect!");
        updateBook.wrong = true;
        res.render('admin-update', {
            updateBook: updateBook, 'userEmail': req.session.mySessionName,
            'userID': req.session.mySessionID,
            'userCart': req.session.myCart
        });
    }


}
// Other Pages
exports.getInfoPage = (req, res) => {
    if (req.session.mySessionName == undefined) {

        res.render('info', { 'logIn': false });
    }
    else {
        res.render('info', {
            'logIn': true,
            'userEmail': req.session.mySessionName,
            'userID': req.session.mySessionID,
            'userCart': req.session.myCart
        })
    }

}
exports.getShippingPage = (req, res) => {
    if (req.session.mySessionName == undefined) {

        res.render('shipping', { 'logIn': false });
    }
    else {
        res.render('shipping', {
            'logIn': true,
            'userEmail': req.session.mySessionName,
            'userID': req.session.mySessionID,
            'userCart': req.session.myCart
        })
    }

}
exports.getPaymentPage = (req, res) => {
    if (req.session.mySessionName == undefined) {

        res.render('payment', { 'logIn': false });
    }
    else {
        res.render('payment', {
            'logIn': true,
            'userEmail': req.session.mySessionName,
            'userID': req.session.mySessionID,
            'userCart': req.session.myCart
        })
    }

}
exports.addBookToUserCart = (req, res) => {
    if (req.session.mySessionName == undefined) {
        res.redirect('back');

    }
    else {
        //console.log("request params: ", req.params)
        //console.log("request session: ", req.session.mySessionName, req.session.mySessionID)
        console.log("End ")
        model.addBookToUserCart(req.params.bookID, req.session.mySessionID, (err, book) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }


        });
        (req.session.myCart).push(parseInt(req.params.bookID));
        res.redirect('back');

    }

}

exports.delBookFromUserCart = (req, res) => {

    //console.log("request params: ", req.params)
    console.log("request session: ", req.session.mySessionID, req.session.myCart)
    model.delBookFromUserCart(req.params.bookID, req.session.mySessionID, (err, book) => {
        if (err) {
            console.log("Sending Error: ");
            res.send(err);
        }


    });
    req.session.myCart.pop();
    console.log("Pop ", req.session.mySessionID, req.session.myCart)
    res.redirect('../cart');



}
exports.addOrder = function (req, res) {
    
    var fieldsCompleted = true;
    if (req.body.mail.length < 6) fieldsCompleted = false;
    //if(req.body.user_password.length < 6) fieldsCompleted=false;
    if (req.body.first_name.length < 2) fieldsCompleted = false;
    if (req.body.last_name.length < 2) fieldsCompleted = false;
    if (req.body.tel.length < 10) fieldsCompleted = false;
    if (req.body.address.length < 4) fieldsCompleted = false;
    if (req.body.city == '') fieldsCompleted = false;
    if (req.body.postcode == '') fieldsCompleted = false;
    if (req.body.products == '') fieldsCompleted = false;

    if (fieldsCompleted && req.session.myCart!='') {
        console.log("Field OK!")
        model.addOrder(req.body, req.session.mySessionID, (err, cl) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }
            //console.log("Book:" + req.params )
            //console.log(book)
            // To 'task' to kanei render sto main.hbs(main layout-- default)


        });
        req.session.myCart = [];
        res.redirect('products')
    }
    else {
        model.getUserCart(req.session.mySessionID, (err, userNbooks) => {
            if (err) {
                console.log("Sending Error: ");
                res.send(err);
            }
            // To 'task' to kanei render sto main.hbs(main layout-- default)

            //console.log(userNbooks.books);
            //console.log(userNbooks.user[0]);
            res.render('cart', {
                
                userBooks: userNbooks.books,
                userInfo: userNbooks.user[0],
                userOrders:  userNbooks.orders,
                'logIn': true,
                'wrongData': true,
                'userEmail': req.session.mySessionName,
                'userID': req.session.mySessionID,
                'userCart': req.session.myCart
            });

        });
        console.log("Field InCorrect!");
    }



}

// exports.getLPage= (req, res) => {

//     if (req.session.mySessionName == undefined) {
//         req.session.mySessionName = 'gk802-session'
//         console.log("session started:", req.session)
//         res.send("Successfully logged in, go to <a href='/'>home page</a>")
//     }
//     else {
//         res.send("Already logged in, go to <a href='/'>home page</a>")
//     }
// }


// exports.getSPage= (req, res) => {
//     const name = req.session.mySessionName
//     console.log(req.sessionID)
//     if (name == undefined)
//         res.redirect('/')
//     res.send(name)
// } 
//

/*
exports.getAuthenticationPage =  (req, res, next) => {
        for (const key in req.query){
            console.log(key, ":", req.query[key]);
        res.send("1")
        }

}
*/
//exports.getAuthenticationPage = ;