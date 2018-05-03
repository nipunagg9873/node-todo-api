const mongoose=require('./../server/db/mongoose')
const  Todo=require('./../server/models/todo').todo;
const User=require('./../server/models/user').user;

var user_id = '5adfc1edd45a3a00dc8c4fc9';
var todo_id = '5aeb6d380b09211f20c9b64d';

// Todo.find({_id: todo_id}).then((todo)=>{
//   console.log(todo);
// });

// console.log(User);
User.findById(user_id).then((user)=>{
  if(!user)
  {
    console.log('user not found');
  }
  else {
    console.log('user found',JSON.stringify(user,undefined,2));
  }
}).catch((e)=>{
  console.log(e);
});
