var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload=(multer({dest:'./uploads'}));
var User=require('../models/user');
var passport =require('passport');
var LocalStrategy = require('passport-local').Strategy;
var nodeMailer=require('nodemailer');
require('dotenv').config();
const {check, validationResult} = require('express-validator/check');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/register', function(req, res, next) {
  res.render('register',{title:'Register'});
});

router.get('/login', function(req, res, next) {
  res.render('login',{title:'Login'});
});

router.post('/login',
  passport.authenticate('local',{failureRedirect:'/users/login',failureFlash:'Invalid Credentials'}),
  function(req,res){
    req.flash('success','You are now logged in');
    res.redirect('/');
});

passport.serializeUser(function(user,done){
  done(null,user.id);
});

passport.deserializeUser(function(id,done){
  User.getUserById(id,function(err,user){
    done(err,user);
  });
}); 

passport.use(new LocalStrategy(function(username,password,done){
  User.getUserByUsername(username,function(err,user){
    if(err) throw err;
    if(!user){
      return done(null,false,{message:'unknown user'});
    }

    User.comparePassword(password,user.password,function(err,isMatch){
      if(err) return done(err);
      if(isMatch){
        return done(null,user);
      }
      else{
        return done(null,false,{message:'Invalid Password'});
      }
    });
  });
}));

router.post('/register',upload.single('profile'),[
  check('name','Name is empty!! Required').not().isEmpty(),
  check('email', 'Email required').not().isEmpty(),
  check('contact','contact length should be 10').not().isEmpty().isLength({max:10})
  ],function(req,res,next){
    const {name, email, contact,username, password} = req.body;
    var form = {
      person:name,
      email:email,
      contact:contact,
      uname:username,
      pass:password
    };
    console.log(form)
    const errr = validationResult(req);

      if (!errr.isEmpty()) {
        console.log(errr);
        res.render('register',{errors:errr.errors,form:form});
      } else {
        name,
        email,
        uname=username,
        password,
        contact
        
        if(req.file) {
          var profileimage=req.file.filename;
        } else {
          var profileimage='noimage.jpg';
        }

        var newUser=new User({
          name,
          email,
          password,
          profileimage,
          uname,
          contact
        });

        User.createUser(newUser,function(){
          console.log('newUser', newUser);
        });

        var transporter = nodeMailer.createTransport({
          service:'Gmail',
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth:{
              user:'bfalcon510@gmail.com',
              pass: process.env.GMAIL_PW
          }
      });

      var mailOptions={
          from:'Deepankur Lohiya<ankurlohiya3@gmail.com>',
          to:`${email}`,
          subject:'Confirmation Email',
          text:'You have been sucessfully registered with us',
          html:`<ul><li>Name:${name}</li><li>Mobile No.:${contact}</li><li>Profile:${profileimage}</li></ul>`
      }

      transporter.sendMail(mailOptions,(err,info)=>{
          if (err){
              console.log(err);
          } else {
              console.log(`Mail Sent at ${req.body.email}`);
          }
      });

      res.location('/');
      res.redirect('./login');
    }
});

router.get('/logout',function(req,res){
  req.logout();
  req.flash('success','You are now logged out');
  res.redirect('/users/login');
});

module.exports = router;