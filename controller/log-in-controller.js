'use strict';

const model = require('../model/bookstore-model-json-db.js');
/*
const bcrypt = require('bcrypt');
const passport = require('passport');*/
const fs = require('fs');
const lockFile = require('lockfile');
const { all } = require('../app');

const dbFile = './model/db.json'
const lock = './model/lock-file'

exports.addNewUser = function (req, res) {
    // console.log("new request ")
    // console.log("request query: ", req.query) // .....?key=val&key2=val2
    // console.log("request params: ", req.params) //http://localhost:3000/users/34/books/8989
    // console.log("request method: ", req.method)
    // console.log("request body: ", req.body)
    // //console.log("request headers: ", req.headers)
    // console.log("request params: ", typeof req.body.user_email);
    let newUser = {
        "id": 0,
        "email": req.body.user_email,
        "firstName": req.body.user_fname,
        "lastName": req.body.user_lname,
        "phone": req.body.user_phone,
        "password": req.body.user_password,
        "address": req.body.user_address,
        "city": req.body.user_city,
        "postcode": req.body.user_postcode,
        "cart": [""]
    };
    var fieldsCompleted = true;
    if (req.body.user_email.length < 6) fieldsCompleted = false;
    //if(req.body.user_password.length < 6) fieldsCompleted=false;
    if (req.body.user_fname.length < 2) fieldsCompleted = false;
    if (req.body.user_lname.length < 2) fieldsCompleted = false;
    if (req.body.user_phone.length < 10) fieldsCompleted = false;
    if (req.body.user_password.length < 6) fieldsCompleted = false;

    var checkIfExist = false;// newUser.email;
    if (fieldsCompleted) {
        console.log("Field OK!")
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


                        let newID = 0;

                        const dbData = JSON.parse(data);
                        for (let i = 0; i < dbData.users.length; i++) {
                            if (dbData.users[i].email == newUser.email) {
                                checkIfExist = true;
                                break;
                            }
                            if (dbData.users[i].id > newID) {
                                newID = dbData.users[i].id;
                            }
                        }
                        newID += 1;
                        newUser.id = newID;
                        dbData.users.push(newUser);

                        console.log("Existance!", checkIfExist);
                        if (!checkIfExist) {
                            console.log('ADD')
                            // Convert to Write
                            fs.writeFile(dbFile, JSON.stringify(dbData), 'utf8', (err, res) => {
                                if (err) callback(err);
                            });
                        }
                        else { newUser.isvalid = false; }

                    }

                })
                console.log("Existance!", checkIfExist);
                if (checkIfExist) { res.redirect('/user-account'); }
                else { res.render('create-account', newUser); }



            }
        })
    }
    else {
        console.log("Field InCorrect!")
        newUser.isvalid = false;
        res.render('create-account', newUser);
    }



}

exports.userLogin = function (req, res) {
    

    let newUser = {
        "email": req.body.email,
        "password": req.body.password
    }
    lockFile.lock(lock,{wait:200}, (err, isLocked) => {
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
                    let checkIfExist = false;
                    for (let i = 0; i < dbData.users.length; i++) {
                        if (dbData.users[i].email == newUser.email && dbData.users[i].password == newUser.password) {
                            checkIfExist = true;
                            newUser.id = dbData.users[i].id;
                            newUser.cart =  dbData.users[i].cart;
                            break;
                        }
                    }
                        
                        req.session.isValid = checkIfExist;

                    if (checkIfExist && newUser.email=='admin') {
                        req.session.mySessionName = newUser.email;
                        req.session.mySessionID = newUser.id;
                        req.session.myCart = newUser.cart;
                        console.log("Found Admin in db- Giving Permissions", checkIfExist, newUser, req.session);
                        res.redirect('/admin');
                        
                    }
                    else if(checkIfExist && newUser.email !='admin') {
                        req.session.mySessionName = newUser.email;
                        req.session.mySessionID = newUser.id;
                        req.session.myCart = newUser.cart;
                        console.log("Found User in db- Giving Permissions", checkIfExist, newUser, req.sessionID);
                        res.redirect('/user-account');
                        
                    }
                    else{
                        //res.redirect('/home');
                        res.render('login', {'correct': false});
                    }

                }

            })



        }
    })
    //console.log("check", requestedUser)
    // model.getUserByUsername((err, books) => {
    //     if (err) {
    //         console.log("Sending Error: ");
    //         res.send(err);
    //     }
    // })

}

exports.userLogout = function (req, res) {
    // console.log("new request ")
    // console.log("request query: ", req.query) 
    // console.log("request params: ", req.params) 
    // console.log("request method: ", req.method)
    // console.log("request body: ", req.body)

    if (req.session.mySessionName == undefined) {
        res.redirect("/")
    }
    else {
        req.session.destroy((err) => { console.log("session destroyed") })
        res.redirect("/login")
    }    

}


