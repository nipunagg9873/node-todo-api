const mongoose=require('./../server/db/mongoose')
const  Todo=require('./../server/models/todo').todo;
const User=require('./../server/models/user').user;

// Todo.remove({}).then((result)=>{
//   console.log(result);
// });

Todo.findByIdAndRemove('5b316a9fc617f40014db63af').then((todo)=>{
  console.log(todo);
});
