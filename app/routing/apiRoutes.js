module.exports = function (app, fs, friends) {
    //function to write the friends array to the friends.js file
    function saveFriendsToFile(friendArr, callback) {
        fs.writeFile("./app/data/friends.js", JSON.stringify(friendArr), function (err) { });
    }

    //--------------------------------------------------------------------------------------------------------------------------------------------------------------------

    //api links
    //get
    app.get("/api/friends", function (req, res) {
        return res.json(friends);
    });

    //post
    app.post("/api/friends", function (req, res) {
        //Get the reservation and decide what to do with it
        var newfriend = req.body;

        //create an array of the total differences to search through and find the best match
        var totalDifference = [];

        //add the newfriend to the friends array
        friends.push(newfriend);

        //write the friends array to the friends.js file
        saveFriendsToFile(friends, function (err) {
            if (err) {
                res.status(404).send("Friend not saved");
                return;
            }
            res.send("Friend saved");
        });
        
        //if there is more than one friend in the array
        if (friends.length > 1) {
            //loop through the array up to the last item
            for (var i = 0; i < friends.length - 1; i++) {
                totalDifference[i] = 0;
                //calculate the total difference in each question between the new friend the other friends in the array, make sure the difference is always positive
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
            //loop through the total difference array and find the smallest value, save the index.
            for (var i = 1; i < totalDifference.length; i++) {
                if (totalDifference[i] < value) {
                    value = totalDifference[i];
                    index = i;
                }
            }

            //return the friend with the smallest total difference
            return res.json(friends[index]);
        }
        else {
            //there's only 1 friend in the array
            return res.json(false);
        }

    });

}