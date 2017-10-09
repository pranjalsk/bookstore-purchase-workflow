var express         = require("express");
var bodyParser      = require("body-parser");
var app             = express();


//===============================================================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Server started...");
});