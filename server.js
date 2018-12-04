// Dependencies
// =============================================================
var express = require("express");
var path = require("path");
var friends = require("./app/data/friends");
var fs = require('fs');

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var friends = [];

app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "app", "public", "home.html"));
});

app.get("/survey", function (req, res) {
    res.sendFile(path.join(__dirname, "app", "public", "survey.html"));
});

// api links
app.get("/api/friends", function (req, res) {
    return res.json(friends);
});

//Get the reservation and decide what to do with it
app.post("/api/friends", function (req, res) {
    var newfriend = req.body;

    var totalDifference = [];

    if (friends.length > 0) {
        //determine which friend is the closest match
        for (var i = 0; i < friends.length; i++) {
            totalDifference[i] = 0;
            for (var j = 0; j < friends[i].scores.length; j++) {
                if (newfriend.scores[j] > friends[i].scores[j]) {
                    totalDifference[i] += newfriend.scores[j] - friends[i].scores[j];
                }
                else {
                    totalDifference[i] += friends[i].scores[j] - newfriend.scores[j];
                }
            }
        }
        var index = 0;
        var value = totalDifference[0];
        for (var i = 1; i < totalDifference.length; i++) {
            if (totalDifference[i] < value) {
                value = totalDifference[i];
                index = i;
            }
        }

        console.log(friends[index].name + " is the best matched friend");
    }
    else {
        console.log("No friends yet");
    }

    friends.push(newfriend);
    saveFriendsToFile(friends, function (err) {
        if (err) {
            res.status(404).send("Friend not saved");
            return;
        }
        res.send("Friend saved");
    });
    console.log(req.body);
    res.json(newfriend);



});

function saveFriendsToFile(friendArr, callback) {
    fs.writeFile("./app/data/friends.js", JSON.stringify(friendArr), function (err) { });
}

// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
