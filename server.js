//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const _ = require("lodash");
const exphbs = require('express-handlebars');
const app = express();
const port = process.env.PORT || 3000;

// setup view engine
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

//app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false
});

app.get("/", function(req, res) {
    res.render('home', {
      title: 'Home'
    });
});

app.get("/about", function(req, res) {
    res.render('about', {
      title: 'About'
    });
});

app.get("/contact", function(req, res) {
    res.render('contact', {
      title: 'Contact'
    });
});

app.post("/", function(req, res) {

});

app.listen(port, function() {
  console.log(`Server is running on port ${port}`);
});
