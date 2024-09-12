const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3500;

// middle = is really anything between request and response
// there are 3 types of middlewares 
//1. built-in middleware
//2. custom middleware
//3. middlewares from third-parties

//==========built-in middleware=================//
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
    console.log(`server is running on ${PORT}`);
})
















