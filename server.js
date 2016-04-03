var express = require('express');
var app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Given any URL, first try to match for routes, if none match then go into /public directory and match physical file
// no pattern match inside /public directory, only match physical files
// index.html is a special case, so even if no file specifically mentioned, it gives index.html = default

app.use(express.static(__dirname + '/public'));
var ipaddress = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';
var port = process.env.OPENSHIFT_NODEJS_PORT || 3000;

app.get('/hello', function(req, res){
    res.send('hello world');
});

app.listen(port, ipaddress);
require("./public/assignment/server/app.js")(app);
// make mongoose connection