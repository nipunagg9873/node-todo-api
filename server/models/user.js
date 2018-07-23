const mongoose=require('mongoose');
const validator=require('validator');
const _=require('lodash');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');

var Userschema=mongoose.Schema({
  email:{
    type:String,
    required:true,
    minlength: 1,
    trim: true,
    unique: true,
    validate:{
      validator: validator.isEmail,
      message:"{VALUE} is invalid"
    }
  },
  password:{
    type:String,
    required:true,
    minlength: 6,
  },
  tokens:[{
    access:{
      type:String,
      required:true
    }
    ,
    token:{
      type:String,
      required:true
    }
  }]
});

Userschema.methods.toJSON= function() {
  var user=this;
  return _.pick(user.toObject(),['_id','email']);
}

Userschema.methods.generateAuthToken= function() {
  var user=this;
  var access='auth';
  var token=jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
  user.tokens.concat([{access,token}]);
  return user.save().then(()=>{
    return token;
  });
};

Userschema.statics.findByToken= function(token) {
  var User=this;
  var decoded;

  try {
    decoded=jwt.verify(token, 'abc123');
  } catch(e)
  {
    console.log(e);
    return Promise.reject();
  }
  // console.log(decoded);
  return User.findOne({
    "_id":decoded._id,
    "tokens.token":token,
    "tokens.access":'auth'
  });

};

Userschema.statics.findByCredentials= function(email,password) {
  var User=this;
  return User.findOne({email}).then((user)=>{
    if(!user)
    return Promise.reject();

    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,res)=>{
        if(res)
        resolve(user);
        else
        reject();
        });
    });
  })
};

Userschema.pre('save',function (next) {
  var user=this;
  if(user.isModified('password')) {
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password=hash;
        next();
      });
    });
  }
  else {
    next();
  }
});

var User=mongoose.model('user',Userschema);

module.exports={User};
