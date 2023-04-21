'use strict';
const e = require('express');
const fs = require('fs');
const lockFile = require('lockfile');
const { all } = require('../app');

//where tasks are stored
const dbFile = './model/db.json'

const lock = './model/lock-file'

//Προβολή όλων των εργασιών - show all tasks
exports.getProductsPage = function (callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }

                let initSTR = '{"books":[{}], "users":[{}], "orders": [{}]}';

                let dd = JSON.parse(data);
                // Check if empty file
                if (data.length >= initSTR.length) {
                    callback(null, JSON.parse(data))
                }
                else {
                    callback(err);
                    console.log("Completely empty OR false init - file")
                    fs.writeFile(dbFile, initSTR, 'utf8', (err, res) => {
                        if (err) callback(err);
                    });
                    callback(null, JSON.parse(initSTR))
                }
            })
        }
        /*
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                callback(null, JSON.parse(data))
            })
        }*/
    })
}

exports.getDisplayPage = function (bookID, callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                else {

                    const allBooks = JSON.parse(data).books
                    const bb = data;
                    let bookLocation;
                    for (let i = 0; i < allBooks.length; i++) {
                        if (allBooks[i].id == bookID) {
                            bookLocation = allBooks[i];
                            break;
                        }
                    }

                    callback(null, bookLocation)
                }

            })
        }
        /*
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                callback(null, JSON.parse(data))
            })
        }*/
    })
}

exports.findBookPage = function (bookTitle, callback) {
    lockFile.lock(lock, (err, isLocked) => {

        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                else {

                    const allBooks = JSON.parse(data).books
                    let bookID;
                    for (let i = 0; i < allBooks.length; i++) {
                        if (allBooks[i].title == bookTitle) {
                            bookID = allBooks[i].id;
                            break;
                        }
                    }

                    callback(null, bookID)
                }

            })
        }
    })
}


exports.getUserByUsername = (username, callback) => {
    dbFile.users.find({ username: username }, (err, res) => {
        //Αν υπάρχει σφάλμα, κάλεσε τη συνάρτηση επιστροφής και δώστης το σφάλμα
        if (err) {
            callback(err, null);
        }
        else {
            //Αν δεν είχαμε σφάλμα, κάλεσε την callback με (null, true) 
            let user
            if (res.length != 0)
                user = { id: res[0]._id, username: res[0].username, password: res[0].password };

            callback(null, user);
        }
    });
}

// When LogIn
exports.addBookToUserCart = function (bookID, userID, callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                else {

                    const dbData = JSON.parse(data);

                    for (let i = 0; i < dbData.users.length; i++) {
                        if (dbData.users[i].id == userID) {

                            dbData.users[i].cart.push(parseInt(bookID));
                            break;
                        }
                    }
                    fs.writeFile(dbFile, JSON.stringify(dbData), 'utf8', (err, res) => {
                        if (err) callback(err);
                    });
                }

            })
        }
    })
}
exports.delBookFromUserCart = function (bookID, userID, callback) {
    lockFile.lock(lock, { wait: 200 }, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                else {

                    const dbData = JSON.parse(data);

                    for (let i = 0; i < dbData.users.length; i++) {
                        if (dbData.users[i].id == userID) {

                            for (let j = 0; j < dbData.users[i].cart.length; j++) {
                                if (dbData.users[i].cart[j] == bookID) {
                                    dbData.users[i].cart.splice(j, 1);
                                    //console.log("ncart:", ncart);
                                    //newCart.push(dbData.users[i].cart[j]);
                                    // dbData.users[i].cart = dbData.users[i].cart.splice(j, 1);
                                    // console.log("dbcart:", dbData.users[i].cart);
                                    break;
                                }

                            }
                            //dbData.users[i].cart
                            //dbData.users[i].cart = [];
                            break;
                        }
                    }

                    fs.writeFile(dbFile, JSON.stringify(dbData), 'utf8', (err, res) => {
                        if (err) callback(err);
                    });
                    console.log("dbcart after:", dbData.users[6].cart);
                }

            })
        }
    })
}

exports.getUserCart = function (userID, callback) {
    lockFile.lock(lock, { wait: 200 }, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                else {

                    const dbData = JSON.parse(data);
                    let userNbooks = { "books": [], "user": [], "orders": [] };
                    for (let i = 0; i < dbData.users.length; i++) {
                        if (dbData.users[i].id == userID) {

                            userNbooks.user.push(dbData.users[i]);
                            // for (let j = 0; j < dbData.books.length; j++) {
                            //     if (dbData.users[i].cart.includes(dbData.books[j].id)) {
                            //         userNbooks.books.push(dbData.books[j]);
                            //     }
                            // }
                            for (let j = 0; j < dbData.users[i].cart.length; j++) {
                                for (let jj = 0; jj < dbData.books.length; jj++) {
                                    if (dbData.users[i].cart[j] == dbData.books[jj].id) {
                                        userNbooks.books.push(dbData.books[jj]);
                                        break;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    if (userID == 0) {
                        userNbooks.orders = dbData.orders;
                    }
                    else {
                        for (let i = 0; i < dbData.orders.length; i++) {
                            if (dbData.orders[i].userid == userID) {
                                userNbooks.orders.push(dbData.orders[i]);
                            }
                        }
                    }
                    callback(null, userNbooks)
                    //console.log(userNbooks);
                    //console.log(userNbooks.books.length);
                }

            })
        }
    })
}
exports.getOrders = function (userID, callback) {
    lockFile.lock(lock, { wait: 200 }, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                else {

                    const dbData = JSON.parse(data);
                    let userOrders = { "orders": [], "user": [] };
                    dbData.orders.sort(function(a,b){
                        // Turn your strings into dates, and then subtract them
                        // to get a value that is either negative, positive, or zero.
                        return new Date(b.created_at) - new Date(a.created_at);
                      });

                    if (userID == 0) {
                        userOrders.orders = dbData.orders;
                        userOrders.user = dbData.users[0];
                    }
                    else {
                        for (let i = 0; i < dbData.orders.length; i++) {
                            if (dbData.orders[i].userID == userID) {
                                userOrders.orders.push(dbData.orders[i]);
                            }
                        }
                        for (let i = 0; i < dbData.users.length; i++) {
                            if (dbData.users[i].id == userID) {
                                userOrders.user = dbData.users[i];
                            }
                        }

                    }
                    callback(null, userOrders)
                }

            })
        }
    })
}


exports.addOrder = function (orderBody, userID, callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                else {


                    let newOrderID = 0;

                    const dbData = JSON.parse(data);
                    for (let i = 0; i < dbData.orders.length; i++) {

                        if (dbData.orders[i].id > newOrderID) {
                            newOrderID = dbData.orders[i].id;
                        }
                    }

                    newOrderID += 1;
                    // get books id - split
                    let arrayBooksId = [];
                    let splitID = orderBody.products.split('-');
                    for (let k = 0; k < splitID.length - 1; k++) {
                        arrayBooksId.push(parseInt(splitID[k]));
                    }

                    // Order Date
                    let currDate = new Date();

                    // split Date() for json format
                    let ymd = currDate.toISOString().slice(0, 10);
                    let hrs = currDate.toISOString().slice(11, 19);
                    let norderDate = ymd + " " + hrs;

                    // create order obj
                    let newOrder = {
                        "id": newOrderID,
                        "userID": userID,
                        "bookid": arrayBooksId,
                        "finalPrice": orderBody.finalPrice,
                        "pay": orderBody.pay,
                        "created_at": norderDate,

                        "email": orderBody.mail,
                        "firstName": orderBody.first_name,
                        "lastName": orderBody.last_name,
                        "phone": orderBody.tel,
                        "address": orderBody.address,
                        "city": orderBody.city,
                        "postcode": orderBody.postcode

                    };


                    dbData.orders.push(newOrder);
                    // Clean Cart
                    for (let jj = 0; jj < dbData.users.length; jj++) {
                        if (dbData.users[jj].id == userID) {
                            dbData.users[jj].cart = [];
                            dbData.users[jj].orders.push(newOrderID);
                        }

                    }
                    // Update Quantity
                    for (let j = 0; j < arrayBooksId.length; j++) {
                        for (let jj = 0; jj < dbData.books.length; jj++) {
                            if (dbData.books[jj].id == arrayBooksId[j]) {
                                dbData.books[jj].status -= 1;
                            }

                        }
                    }

                    fs.writeFile(dbFile, JSON.stringify(dbData), 'utf8', (err, res) => {
                        if (err) callback(err);
                    });
                }

            })
            console.log("Order added");



        }
    })
}
exports.addBook = function (newBook, callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                else {

                    let newBookID = 0;
                    let alreadyIN = false;
                    const dbData = JSON.parse(data);
                    for (let i = 0; i < dbData.books.length; i++) {

                        if (dbData.books[i].id > newBookID) {
                            newBookID = dbData.books[i].id;
                        }
                        if (dbData.books[i].ISBN == bookBody.ISBN) {
                            console.log("I found match with db", alreadyIN);
                            alreadyIN = true;
                        }
                    }

                    newBookID += 1;
                    console.log(alreadyIN);
                    if (!alreadyIN) {
                        console.log("Adding book...");

                        dbData.books.push(newBook);

                        fs.writeFile(dbFile, JSON.stringify(dbData), 'utf8', (err, res) => {
                            if (err) callback(err);
                        });
                    }
                    else {
                        console.log("Book exists", alreadyIN);
                    }
                }

            })




        }
    })
}

exports.checkBook = function (bookISBN, callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }

                let db = JSON.parse(data);
                let currBook;
                // Check if empty file
                console.log("find book...")
                for (let i = 0; i < db.books.length; i++) {
                    if (db.books[i].ISBN == bookISBN) {
                        console.log("found");
                        currBook = db.books[i];
                        break;

                    }
                }


                callback(null, currBook)

            })
        }
    })
}
exports.updateBook = function (bookData, callback) {
    lockFile.lock(lock, (err, isLocked) => {
        //We open the file ./model/tasks.json, read the content and save it in variable
        //'data'
        if (err) {
            callback(err)
        }
        else {
            fs.readFile(dbFile, (err, data) => {
                lockFile.unlock(lock)
                if (err) {
                    callback(err)
                }
                console.log("Search for:", bookData)
                let db = JSON.parse(data);
                // Check if empty file
                console.log("finding book...")
                for (let i = 0; i < db.books.length; i++) {
                    if (db.books[i].id == bookData.id) {
                        console.log("Found book for update!", bookData);
                        db.books[i] = bookData;
                        break;

                    }
                }
                fs.writeFile(dbFile, JSON.stringify(db), 'utf8', (err, res) => {
                    if (err) callback(err);
                });

            })
        }
    })
}
