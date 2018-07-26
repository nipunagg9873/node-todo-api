const {ObjectID}=require('mongodb');
const jwt=require('jsonwebtoken');

const {Todo}=require('./../../models/todo');
const {User}=require('./../../models/user');

var userOneId=new ObjectID();
var userTwoId=new ObjectID();

const todos=[{
  _id: new ObjectID(),
  text: 'first test todo',
  _creator:userOneId
}, {
  _id: new ObjectID(),
  text: 'second test todo',
  _creator:userTwoId
}];

var populateTodos = (done)=>{
  Todo.remove({}).then(()=>{
    Todo.insertMany(todos);
  }).then(()=>done(),(e)=>{
    console.log(e);
    done(e);
});
};

const users=[{
  _id:userOneId,
  email:"userOne@example.com",
  password:"userOnePass",
  tokens:[
    {
      access:'auth',
      token:jwt.sign({_id:userOneId.toHexString(),access:'auth'},process.env.JWT_SECRET).toString()
    }
  ]},
  {
    _id:userTwoId,
    email:"userTwo@example.com",
    password:"userTwoPass",
    tokens:[
      {
        access:'auth',
        token:jwt.sign({_id:userTwoId.toHexString(),access:'auth'},process.env.JWT_SECRET).toString()
      }
    ]
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
