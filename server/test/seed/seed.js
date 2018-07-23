const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');

const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');

const todos=[{
  _id: new ObjectID(),
  text: 'first test todo'
}, {
  _id: new ObjectID(),
  text: 'second test todo'
}];

var populateTodos = (done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos);
  }).then(()=>done(),(e)=>{
    console.log(e);
    done(e);
});
};

var userOneId=new ObjectID();
var userTwoId=new ObjectID();

const users=[{
  _id:userOneId,
  email:"userOne@example.com",
  password:"userOnePass",
  tokens:[
    {
      access:'auth',
      token:jwt.sign({_id:userOneId.toHexString(),access:'auth'},'abc123').toString()
    }
  ]},
  {
    _id:userTwoId,
    email:"userTwo@example.com",
    password:"userTwoPass",
}];

var populateUsers = (done)=>{
  User.remove({}).then(()=>{
    var userOne=new User(users[0]).save();
    var userTwo=new User(users[1]).save();
    // return userOne;
    return Promise.all([userOne,userTwo]);
  }).then(()=> done());
};
module.exports={todos,populateTodos,users,populateUsers};
