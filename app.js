var BooksJSON = '{"books":[{"id":"book1","name":"The Image-Guided Surgical Toolkit","price":"0.99","url":"http://www.igstk.org/IGSTK/help/documentation.html"},{"id":"book2","name":"Abraham Lincoln","price":"19.95","url":"http://www.learnlibrary.com/abraham-lincoln/lincoln.htm"},{"id":"book3","name":"Adventures of Tom Sawyer","price":"10.50","url":"http://www.pagebypagebooks.com/Mark_Twain/Tom_Sawyer/"},{"id":"book4","name":"Catcher in the Rye","price":"22.95","url":"https://www.goodreads.com/book/show/5107.The_Catcher_in_the_Rye"},{"id":"book5","name":"The Legend of Sleepy Hollow","price":"15.99","url":"http://www.learnlibrary.com/sleepy-hollow/sleepy-hollow.htm"},{"id":"book6","name":"Moby Dick","price":"24.45","url":"https://www.amazon.com/Moby-Dick-Herman-Melville/dp/1503280780"},{"id":"book7","name":"Java Programming 101","price":"1.99","url":"https://www.javaworld.com/blog/java-101/"},{"id":"book8","name":"Robinson Crusoe","price":"11.99","url":"http://www.learnlibrary.com/rob-crusoe/"},{"id":"book9","name":"The Odyssey","price":"32.00","url":"http://classics.mit.edu/Homer/odyssey.html"}]}';

//-------------------------------------------------------------------------------

var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var cookieParser = require('cookie-parser');
var session = require('express-session');
var expressValidator = require('express-validator');

app.set("view engine", "ejs");
app.use(cookieParser());
app.use(session({
  secret: 'MAGICALEXPRESSKEY',
  resave: true,
  saveUninitialized: true
}));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(expressValidator());
var bookList = JSON.parse(BooksJSON);
app.locals.books = bookList.books;

app.locals.isLoginFailed = false;


//--------------------------------------------------------------------------------
app.get('/landing', function (req, res) {
  res.render("landing");
});

// Route to Login
app.get('/login', function (req, res) {
  var errors = req.validationErrors();
  res.render("login",{errors:errors});
});

// Route to Login
app.post("/login", function (req, res) {
  console.log("login hit !!!!!!!");
  var responseString = '<html><head><title>Bookstore: Logged in</title></head><body><h1>Bookstore: Logged in</h1><br/><br/>Welcome ' + req.body.name + ', you have successfully logged in! Click <a href="/list">here</a> to order some books! </body> </html>'

  //santization and validation
  req.sanitize('name').escape();
  req.sanitize('name').trim();
  req.checkBody('name','Name is required').notEmpty();
  req.checkBody('name','Name must be only alpha numeric').isAlphanumeric();
  req.checkBody('pwd','Password is required').notEmpty();

  var errors = req.validationErrors();

  if(errors){
      res.render("login",{errors:errors});
  }else{
    if (req.body.name === req.body.pwd) {
      app.locals.isLoginFailed = false;
      req.session.username = req.body.name;
      res.send(responseString);
    } else {
      app.locals.isLoginFailed = true;
      res.redirect("login");
    }
  }
  
});

app.get("/list", restrict, function (req, res) {
  var errors = req.validationErrors();
  res.render("list", {
    currentUser: req.session.username,
    errors:errors
  });
});

app.post("/purchase", restrict, function (req, res) {
  console.log(req.body);
  var quantity = parseInt(req.body.Quantity);
  //santize and validate quantity field
  req.checkBody('Quantity','quantity is required').notEmpty();
  req.checkBody('Quantity','quantity should be integer').isInt();
  
  var errors = req.validationErrors();
  console.log(req.body)
  var list = req.body.selectedBoxBooks;
  console.log(list);
  if(typeof(list) === "string"){
    list = [list]
  }
  var mainList = JSON.parse(JSON.stringify(app.locals.books));
  var selectedBooks = [];
  var totalCost = 0;

  if(!req.body.hasOwnProperty('selectedBoxBooks')){
    if(!errors){
      errors=[]
    }
    errors.push({
      location: 'body',
      param: 'selectedBoxBooks',
      msg: 'please select some books',
      value: '0'
    });
  }  

  if(errors){
    res.render("list", {
      currentUser: req.session.username,
      errors:errors
    });
  }else{

    list.forEach(function (item) {
      mainList.forEach(function (element) {
        if (element.id === item) {
          element.quantity = quantity;
          element.selectedCost = quantity * parseFloat(element.price);
          selectedBooks.push(element);
          totalCost += quantity * parseFloat(element.price);
        }
      });
    });

    res.render("purchase", {
      currentUser: req.session.username,
      cartBooks : selectedBooks,
      totalCost : totalCost.toFixed(2)
    });
  }
 
});
 
app.post("/confirm",restrict,function(req,res){
  //console.log(req.body);
  var purchaseDetails = req.body;
  res.render("confirm",{
    currentUser: req.session.username,
    purchase:purchaseDetails
  });
});

app.get('/logout', function (req, res) {
  console.log("LOGOUT HIT !!!!!!!!!")
  //req.session.username = null;
  req.session.destroy();
  // destroy once entire flow is done else store in memory... 
  res.redirect('/landing');
});


//Middleware-------------------
function restrict (req, res, next){
  if (!req.session.username) {
      res.redirect("landing");
      //
  } else {
      next();
  }
};


//Handle unimplemented methods------
app.all("/purchase", function(req, res) {
  res.sendStatus(501);
});
app.all("/confirm",function(req,res){
  res.sendStatus(501);
});
app.all("/login",function(req,res){
  res.sendStatus(501);
});
app.all("/landing",function(req,res){
  res.sendStatus(501);
});
app.all("/list",function(req,res){
  res.sendStatus(501);
});

//Invalid URLs------------------
app.all('*', function(req, res) {
  res.sendStatus(404);
});





app.listen(8080, process.env.IP, function () {
  console.log("Server started...");
});