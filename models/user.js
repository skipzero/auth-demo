var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost/login_database')
    .then(() => console.log('Connection Established'))
    .catch((err) => console.error(`MONGOOSE:::ERROR::: ${err}`))

var db = mongoose.connection;
var userSchema=mongoose.Schema({
    name:{
        type:String,
        index:true
    },
    password:{
        type:String
    },
    email:{
        type:String
    },
    profileimage:{
        type:String,
        default: 'noimage.jpg',
    },
    uname:{
        type:String
    },
    contact:{
        type:Number
    }
});

var User = module.exports = mongoose.model('user',userSchema);

module.exports.getUserById = async function(id, callback){
  try {
    User.findById(id, callback);
  }

  catch(err) {
    console.error(err)
  }
};

module.exports.getUserByUsername = function(username, callback){
  var query = {uname:username}
  console.log('QUERY::', query)
  return User.findOne(query, callback)
};

module.exports.comparePassword = function(candidatepassword,hash,callback) {
  bcrypt.compare(candidatepassword, hash, function(err, isMatch) {
    callback(null,isMatch);
  }); 
};

module.exports.createUser = function(newUser, callback){
  bcrypt.genSalt(10,function(err,salt){
    bcrypt.hash(newUser.password,salt,function(err,hash){
      newUser.password = hash
        try {
          newUser.save()
        }
        catch(err) {
          console.error(err)
        }
    });
  });
}
 