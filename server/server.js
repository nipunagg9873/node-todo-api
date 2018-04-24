const mongoose=require('mongoose');
mongoose.Promise=global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');
var todo=mongoose.model('todo',{
  text: {
    type:String
  },
  completed:{
    type:Boolean
  },
  completedAt:{
    type:Number
  }
});
var newtodo=new todo({
  text:"eat dinner",
  completed:true,
  completedAt:1840
});

newtodo.save().then((doc)=>{
  console.log('saved result is :',JSON.stringify(doc,undefined,2));
},(error)=>{
  console.log(error);
});
