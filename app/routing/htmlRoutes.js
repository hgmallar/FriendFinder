module.exports = function (app, path) {

    //get the home page
    app.get("/", function (req, res) {
        res.sendFile(path.join(__dirname, "/../public/home.html"));
    });

    //get the survey page
    app.get("/survey", function (req, res) {
        res.sendFile(path.join(__dirname, "/../public/survey.html"));
    });

}