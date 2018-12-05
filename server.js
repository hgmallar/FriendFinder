// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var fs = require('fs');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//initialize a friends array
//get the friends saved in friends.js
var friends = JSON.parse(fs.readFileSync('./app/data/friends.js').toString('utf-8'));

//require the html routes
var htmlRoutes = require('./app/routing/htmlRoutes')(app, path);

//require the api routes
var apiRoutes = require('./app/routing/apiRoutes')(app, fs, friends);

// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
