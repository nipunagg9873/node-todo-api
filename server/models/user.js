const mongoose=require('mongoose');
const validator=require('validator');
const _=require('lodash')
const jwt=require('jsonwebtoken')

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
  user.tokens.push({access,token});
  return user.save().then(()=>{
    return token;
  });
};

var User=mongoose.model('User',Userschema);

module.exports={User};
