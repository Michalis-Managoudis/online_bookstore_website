const express = require('express')
const app = express()
const exphbs = require('express-handlebars');
const session = require('express-session')

//Διαδρομές - Routes
const routes = require('./routes/bookstore-routes');

app.use(express.static('public'));

// ---------- Log in ----------
//app.use(express.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));

app.use(session({
    name: 'Bookstore-user-session',
    secret: process.env.secret || "PynOjAuHetAuWawtinAytVunarAcjeBlybEshkEjVudyelwa",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60,//1 ώρα
        httpOnly: true,
        sameSite: true,
        // secure: true //Το cookie θα σταλεί μόνο μέσω https. Σε απλό http δε θα λειτουργήσει
    },
    // store: new MemoryStore({ checkPeriod: 86400000 })
}))

// app.use((req, res, next) => {
//     res.locals.userId = req.session.loggedUserId;
//     next();
// })

// ---------- END Log in ----------
app.use('/', routes);

app.engine('hbs', exphbs({
    extname: '.hbs'
}));

app.set('view engine', 'hbs');


// Custom handlebars - Helpers
var hbs = exphbs.create({});

hbs.handlebars.registerHelper("splitPriceFinal", function (price, discount) {
    let fprice = (price - (price * discount / 100));
    let rep = fprice.toFixed(1).toString().split(".")

    if (rep[0].length == 1) rep[0] = '0' + rep[0];
    if (rep[1].length == 1) rep[1] = rep[1] + '0';
    let htmlVal = '<span class="low">€</span>' + rep[0] + '<span class="high">' + rep[1] + '</span>'
    return htmlVal;
});

hbs.handlebars.registerHelper("cartSize", function (cart) {
    console.log("cart l", cart.length)
    return cart.length;
});

hbs.handlebars.registerHelper("calculateFinalPrice", function (price, discount) {
    return parseFloat(price - (price * discount / 100)).toFixed(2);
});

hbs.handlebars.registerHelper("allAuthors", function (allBooks) {

    let sig = [];


    for (let i = 0; i < allBooks.length; i++) {
        if (allBooks[i].status) {
            for (let j = 0; j < allBooks[i].authors.length; j++) {
                if (!sig.includes(allBooks[i].authors[j])) {
                    sig.push(allBooks[i].authors[j]);
                }
            }
        }

    }
    sig.sort();
    return sig;
});

hbs.handlebars.registerHelper("allCategories", function (allBooks) {


    let kat = [];


    for (let i = 0; i < allBooks.length; i++) {
        if (allBooks[i].status) {
            for (let j = 0; j < allBooks[i].categories.length; j++) {
                if (!kat.includes(allBooks[i].categories[j])) {
                    kat.push(allBooks[i].categories[j]);
                }
            }
        }
    }
    kat.sort();
    return kat;
});

hbs.handlebars.registerHelper("allYears", function (allBooks) {

    let xrn = [];

    for (let i = 0; i < allBooks.length; i++) {
        if (allBooks[i].status) {
            if (!xrn.includes(allBooks[i].publishedYear)) {
                xrn.push(allBooks[i].publishedYear);
            }
        }
    }
    xrn.sort().reverse();
    return xrn;
});

hbs.handlebars.registerHelper("allCovers", function (allBooks) {

    let cov = [];
    //let tim = [];


    for (let i = 0; i < allBooks.length; i++) {
        if (allBooks[i].status) {
            if (!cov.includes(allBooks[i].cover)) {
                cov.push(allBooks[i].cover);
            }
        }
    }
    cov.sort();
    return cov;
});
hbs.handlebars.registerHelper("bestSeller", function (db) {
    let dbBackUp = db;
    let best = [];

    for (let i = 0; i < dbBackUp.orders.length; i++) {

        for (let j = 0; j < dbBackUp.orders[i].bookid.length; j++) {

            let k = dbBackUp.orders[i].bookid[j];
            let fnd = false;

            for (let l = 0; l < best.length; l++) {
                if (best[l][0] == k) {
                    best[l][1] = best[l][1] + 1;
                    fnd = true;
                    break;
                }
            }
            if (!fnd) {
                best.push([k, 1]);
            }
        }
    }

    best.sort(function (a, b) {
        return b[1] - a[1];
    });
    let bestID = [];
    for (let jj = 0; jj < 7; jj++) {
        bestID.push(best[jj][0]);
    }
    let bestBooks = [];
    for (let i = 0; i < dbBackUp.books.length; i++) {
        if (dbBackUp.books[i].status) {
            if (bestID.includes(dbBackUp.books[i].id)) {
                bestBooks.push(dbBackUp.books[i]);
            }
        }
    }

    return bestBooks;
});
hbs.handlebars.registerHelper("newReleases", function (db) {

    let releases = [];

    let dbBooks = db.books;
    dbBooks.sort(function (a, b) {
       return b.publishedYear - a.publishedYear;
    });

    for (let i = 0; i < 6; i++) {
        if (dbBooks[i].status) {
            releases.push(dbBooks[i]);
        }
    }

    return releases;
});
hbs.handlebars.registerHelper("offers", function (db) {

    let offers = [];
    let dbBooks = db.books;
    dbBooks.sort(function (a, b) {
        return b.discount - a.discount;
    });

    for (let i = 0; i < 6; i++) {
        if (dbBooks[i].status) {
            offers.push(dbBooks[i]);
        }
    }

    return offers;
});

//
module.exports = app;

//Χρήση των views - Using 'views'
//Σημ.: η engine πρέπει να έχει ίδιο όνομα με το extname, αλλιώς δεν θα αναγνωριστεί το extname (αλλιώς τα αρχεία θα πρέπει να τελειώνουν με .handlebars)
//Note: engine name must be the same as extname (hbs) otherwise the handlebars template engine will look for files ending in '.handlebars'





