var express = require('express');
var perf = require('execution-time-async')();
var router = express.Router();
perf.config();
var User = require('../models/user')

/* GET home page . */
router.get('/', ensureAuthenticated, function(req, res, next) {
  User.find({}, function(err, users) {
    res.render('index', {users:users, title: 'Members'})
  })
});

function ensureAuthenticated(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/users/login')
}
module.exports = router;
