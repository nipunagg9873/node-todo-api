const mongoose=require('mongoose');

var user=mongoose.model('users',{
  email:{
    type:String,
    required:true,
    minlength: 1,
    trim: true
  }
});

module.exports={user};
