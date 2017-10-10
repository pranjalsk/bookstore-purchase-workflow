var express         = require("express");
var bodyParser      = require("body-parser");
var app             = express();

app.set("view engine","ejs");

app.get('/',function(req,res){
    res.render("landing");
});

//===============================================================
app.listen(8080, process.env.IP, function(){
    console.log("Server started...");
});

app.get('/', function (req, res) {
    var response = '<html><head><title>Simple Send</title></head>' +
                   '<body><h1>Hello from Express</h1></body></html>';
    res.status(200);
    res.set({
      'Content-Type': 'text/html',
      'Content-Length': response.length
    });
    res.send(response);
    console.log('Response Finished? ' + res.finished);
    console.log('\nHeaders Sent: ');
    console.log(res.headersSent);
  });
  app.get('/error', function (req, res) {
    res.status(400);
    res.send("This is a bad request.");
  });