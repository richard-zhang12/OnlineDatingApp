//jshint esversion:6
const express = require("express");
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser");
const _ = require("lodash");
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//Load models
const Message = require('./models/message');
const User = require('./models/user');
const app = express();
//load keys file
const Keys = require('./config/keys');
//Load Helpers
const {requireLogin, ensureGuest} = require('./helpers/auth');
//use body parser middleware
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
//configuration for authentication
app.use(cookieParser());
app.use(session({
  secret: 'mysecret',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
// Make user global object
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
})
//load facebook strategy
require('./passport/facebook');
// connect to MongoDB
mongoose.connect(Keys.MongoDB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: false
  }).then(() => {
  console.log('Server is connected to MongoDB');
}).catch((err) => {
  console.log(err);
});

const port = process.env.PORT || 3000;
// setup view engine
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');

app.get("/", ensureGuest, function(req, res) {
    res.render('home', {
      title: 'Home'
    });
});

app.get("/about", ensureGuest, function(req, res) {
    res.render('about', {
      title: 'About'
    });
});

app.get("/contact", ensureGuest, function(req, res) {
    res.render('contact', {
      title: 'Contact'
    });
});

app.get('/auth/facebook', passport.authenticate('facebook',{
  scope: ['email']
}));
app.get('/auth/facebook/callback', passport.authenticate('facebook',{
  successRedirect: '/profile',
  failureRedirect: '/'
}));

app.get('/profile', requireLogin, function(req, res) {
  User.findById({_id: req.user._id}).then((user) => {
    if (user) {
      const userFound = {
        image: user.image,
        fullname: user.fullname,
        email: user.email
      };
      user.online = true;
      user.save((err, user) => {
        if (err) {
          throw err;
        } else {
          res.render('profile', {
            title: 'Profile',
            user: userFound
          });
    
        }
      })
    }
  });
});

app.get('/logout', (req, res) => {
  User.findById({_id: req.user._id}).then((user) => {
    user.online = false;
    user.save((err, user) => {
      if (err) {
        throw err
      } 
      if (user) {
        req.logOut();
        res.redirect('/');
      
      }
    })
  })
});

app.post("/contactus", function(req, res) {
  const newMessage = {
    fullname: req.body.fullname,
    email: req.body.email,
    message: req.body.message,
    date: new Date()
  };
  new Message(newMessage).save((err, message) => {
    if (err) {
      throw err;
    } else {
      Message.find(function(err, messages) {
        if (err) {
          res.render('noMessage', {
            title: 'Not found'
          });
        } else {
            const usersMessages = messages.map(e => {
              return {
                fullname: e.fullname,
                email: e.email,
                message: e.message,
                date: e.date
              }
            })
          
          res.render('newmessage', {
            title: 'Sent',
            messages: usersMessages
          });
        }
      });
    }
  });
});

app.listen(port, function() {
  console.log(`Server is running on port ${port}`);
});
