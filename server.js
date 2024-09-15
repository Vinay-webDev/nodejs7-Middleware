const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
//const logEvents = require('./middleware/logEvents');
const { logger } = require('./middleware/logEvents');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

// middle = is really anything between request and response
// there are 3 types of middlewares 
//1. built-in middleware
//2. custom middleware
//3. middlewares from third-parties
//==========2.custom middleware===================//
// custom middleware logger👇
//👉if you here we have next which was not there when had built-in middleware because the next is automatically provided by built-in middleware but in custom middleware we need to have it on our own ****
/*
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
})
*/
// we can actually log these to the console to check to see if it's working 
// but really we would like to have it in log text file so to do that👇
//👉 create a middleware directory or folder 
//👉 then drag the logEvents.js in middleware folder
//👉 you might need to change the path for logs folder ( use '..' to go up one step ***);
/*
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    next();
})
*/
///////////////////
// let's make it more cleaner and clear 
// I'm gonna have this handler inside the logEvents function.

app.use(logger);
// we don't just want to log req methods to the console, instead we need to log it to the logEvents file*****
//////////////////////////////////////////////////////
//////////////Let's request data from another domain/////////////////////////////
// so as you can notice we got undefined in the request origin is because we are requesting data from localhost 
// Let's try to request data from another domain******
/* we got CORS err in the console and this will lead us to a third-party middleware 'CORS'
CORS === cross origin resource sharing 
so now we need to install cors as dependency to do that just write 
npm i cors
*/
// now import cors above👆
//Let's place this cors middleware as soon as but just below the logger***
//3. middlewares from third-party👇
//app.use(cors());
/////////////////////////////////////////////////////////
////let's go little deeper into the cors/////////////////////////
//app.use(cors()); // this is public which means this available for any domain** also any domain can request our data from our server
// however this is not that we always need. most of the times we need to have only the selected domains to request the data. we can actually do that👇
// Let's create a whitelist which will have the list selected domains
const whitelist = ['https://www.yoursite.com', 'http://127.0.0.1:5500', 'http://localhost:3500'];

// then we'll need to have a function that will allow these selected sites to request data
// 👉👉👉remember origin parameter inside the function which is same as the origin property of the object (corsOptions) here the origin parameter inside the function is the origin of the site that is requesting data ==>> ( origin ===>>  the domain or the url of the site that is requesting the data )👈👈👈
const corsOptions = {
    origin: (origin, callback) => {
        // now we need to check if the domain or url or origin that is present inside our whitelist
        //if ( whitelist.indexOf(origin) !== -1 ) // if whitelist.indexOf(origin) is strictly not equal to -1  means is not present in the whitelist
        if ( whitelist.indexOf(origin) !== -1 ) {
            callback(null, true); // here null is error**
        } else {
            callback(new Error('not allowed by the CORS'));
        }
    }
}

app.use(cors(corsOptions));

//1.====>>> we got CORS error again because we don't have www.google.com in our whitelist 













//==========1.built-in middleware=================//
/* built-in middleware to handle urlencoded data
 in other words, form data;
 // 'content-type: application/x-www-form-urlencoded'
 */
// syntax ==========>>>>>> app.use()
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
// to handle static types or static files
// the files must be in public folder inorder route
app.use(express.static(path.join(__dirname, 'public')));
// like routes middlewares also handles down like a water fall
// which means the above all middlewares are applied to each of these routes******* (you can check in the web though);
app.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
})
app.get('/new-page(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'new-page.html'));
})
app.get('/old-page(.html)?', (req, res) => {
    res.redirect(301, '/new-page.html'); 
})
// Route handlers
app.get('/hello(.html)?', (req, res, next) => {
    console.log('attemped to load hello.html!');
    next();
}, (req, res) => {
    res.send('hello bro!');
})
// the another way of chaining these functions (handlers)***
const one = (req, res, next) => {
    console.log('one');
    next();
}
const two = (req, res, next) => {
    console.log('two');
    next();
}
const three = (req, res, next) => {
    console.log('three');
    res.send('finished!');
}
app.get('/chain(.html)?', [one, two, three]);

app.get('/*', (req, res) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html')); 
})
app.listen(PORT, () => {
    console.log(`server is running on port: ${PORT}`);
})
















