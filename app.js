var BooksJSON = '{"books":[{"id":"book1","name":"The Image-Guided Surgical Toolkit","price":"0.99","url":"http://www.igstk.org/IGSTK/help/documentation.html"},{"id":"book2","name":"Abraham Lincoln","price":"19.95","url":"http://www.learnlibrary.com/abraham-lincoln/lincoln.htm"},{"id":"book3","name":"Adventures of Tom Sawyer","price":"10.50","url":"http://www.pagebypagebooks.com/Mark_Twain/Tom_Sawyer/"},{"id":"book4","name":"Catcher in the Rye","price":"22.95","url":"https://www.goodreads.com/book/show/5107.The_Catcher_in_the_Rye"},{"id":"book5","name":"The Legend of Sleepy Hollow","price":"15.99","url":"http://www.learnlibrary.com/sleepy-hollow/sleepy-hollow.htm"},{"id":"book6","name":"Moby Dick","price":"24.45","url":"https://www.amazon.com/Moby-Dick-Herman-Melville/dp/1503280780"},{"id":"book7","name":"Java Programming 101","price":"1.99","url":"https://www.javaworld.com/blog/java-101/"},{"id":"book8","name":"Robinson Crusoe","price":"11.99","url":"http://www.learnlibrary.com/rob-crusoe/"},{"id":"book9","name":"The Odyssey","price":"32.00","url":"http://classics.mit.edu/Homer/odyssey.html"}]}';

//-------------------------------------------------------------------------------

var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({
    extended: true
}));
var bookList = JSON.parse(BooksJSON);
app.locals.books = bookList.books;

app.locals.isLoginFailed = false;


//--------------------------------------------------------------------------------

app.get('/landing', function (req, res) {
    res.render("landing");
});

// Route to Login
app.get('/login', function (req, res) {
    res.render("login");
});

// Route to Login
app.post("/login", function (req, res) {

    var responseString = '<html><head><title>Bookstore: Logged in</title></head><body><h1>Bookstore: Logged in</h1><br/><br/>Welcome ' + req.body.name + ', you have successfully logged in! Click <a href="/list">here</a> to order some books! </body> </html>'

    if (req.body.name === req.body.pwd) {
        app.locals.isLoginFailed = false;
        res.send(responseString);
    }else{
        app.locals.isLoginFailed = true;
        res.redirect("login");
    }


});


app.listen(8080, process.env.IP, function () {
    console.log("Server started...");
});