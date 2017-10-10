var express         = require("express");
var bodyParser      = require("body-parser");
var app             = express();

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));

app.get('/',function(req,res){
    res.send("Hi from server");
});

//===============================================================
app.listen(8000, function(){
    console.log("Server started...");
});