'use strict';

const express = require('express');
//const session = require('express-session')
const router = express.Router();

const bookstoreController = require('../controller/bookstore-controller');

const logInController = require('../controller/log-in-controller');
//const MemoryStore = require('memorystore')(session);

//when the client requests a URI, the corresponding controller function will be called
router.get('/', (req, res) => {res.redirect('/home')});
// Basic Pages
router.get('/home', bookstoreController.getHomePage);
router.get('/products', bookstoreController.getProductsPage);
router.get('/disp-product/:bookID', bookstoreController.getDisplayPage);// + Attributes
// User Pages
router.get('/login', bookstoreController.getLoginPage);
router.post('/login', logInController.userLogin);
router.get('/logout', logInController.userLogout);
// 
router.get('/create-account', bookstoreController.getCreateAccountPage);
router.post('/create-account', logInController.addNewUser);
// personal

router.get('/cart', bookstoreController.getUserCartPage);
router.get('/cart/:bookID', bookstoreController.addBookToUserCart);

router.get('/delete/:bookID', bookstoreController.delBookFromUserCart);
router.post('/order', bookstoreController.addOrder);


router.get('/user-account', bookstoreController.getUserAccountPage);
router.post('/find', bookstoreController.findBookPage);

//router.get('/user-account/:userID', bookstoreController.getUserAccountPage);

// admin page
router.get('/admin', bookstoreController.getAdminUserPage);
// Add
router.get('/admin-add', bookstoreController.getAdminAddBook);
router.post('/admin-add', bookstoreController.adminAddBook);
// Update
router.get('/admin-update', bookstoreController.getAdminUpdateBook);
router.post('/admin-update', bookstoreController.adminCheckBook);
router.post('/admin', bookstoreController.adminUpdateBook);
// Other Pages
router.get('/info', bookstoreController.getInfoPage);
router.get('/shipping', bookstoreController.getShippingPage);
router.get('/payment', bookstoreController.getPaymentPage);

//router.get('/login/authorize', logInController.checkAuthenticated);

//router.post('login', logInController.doLogin)
// Data
/*
router.get('/login/authentication', (req, res, next) => {
    for (const key in req.query){
        console.log(key, ":", req.query[key]);
        next()
    }
    },
    (req, res, next) => {console.log('2'); next()},
    (req, res, next) => {console.log('3'); res.send('3')}
);
*/
//router.get('/login/authentication', (req, res){})
//router.get('/login/authentication', bookstoreController.getAuthentication);
//router.use(express.urlencoded({ extended: true }));
// router.post('/login/authentication', (req, res) => {
//     console.log("new request ")
//     console.log("request query: ", req.query) // .....?key=val&key2=val2
//     console.log("request params: ", req.params) //http://localhost:3000/users/34/books/8989
//     console.log("request method: ", req.method)
//     console.log("request body: ", req.body)
//     //console.log("request headers: ", req.headers)
//     res.end('ok user')
// });
// router.get('/cart/:userID',  (req, res) => {
//     console.log("new request ")
//     console.log("request query: ", req.query) // .....?key=val&key2=val2
//     console.log("request params: ", req.params) //http://localhost:3000/users/34/books/8989
//     console.log("request method: ", req.method)
//     console.log("request body: ", req.body)
//     console.log("request headers: ", req.headers)
//     res.end('ok')
// });

// Session Middleware
// router.use(session({
//     secret: process.env.secret || "PynOjAuHetAuWawtinAytVunarAcjeBlybEshkEjVudyelwa",
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         httpOnly: true,
//         sameSite: true,
//         maxAge: 600000 // Time is in miliseconds
//     },
//     // store: new MemoryStore({ checkPeriod: 86400000 })
// }))

// router.get('/loginNow', function (req, res) {
//     console.log(req.headers)
//     if (req.session.mySessionName == undefined) {
//         console.log("not logged in")
//         res.send("session not started, please <a href='/login'>login here</a>")
//     }
//     else {
//         console.log("is logged in")
//         res.send("<b>session has started</b>, please <a href='/logout'>logout here</a>")
//     }
// })

// router.get("/loginned",(req, res) => {
//     console.log('session:', req.session)
//     if (req.session.mySessionName == undefined) {
//         req.session.mySessionName = 'gk802-session'
//         console.log("session started:", req.session)
//         res.send("Successfully logged in, go to <a href='/'>home page</a>")
//     }
//     else {
//         res.send("Already logged in, go to <a href='/'>home page</a>")
//     }
// })
// router.get("/session", (req, res) => {
//     const name = req.session.mySessionName
//     console.log(req.sessionID)
//     if (name == undefined)
//         res.redirect('/')
//     res.send(name)
// });

module.exports = router;