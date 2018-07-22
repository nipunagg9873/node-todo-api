require('./config/config')

const _=require("lodash");
const express=require('express');
const bodyParser=require('body-parser');
const ObjectId=require('mongodb').ObjectID;

var {mongoose}=require('./db/mongoose');
var {Todo}=require('./models/todo');
var {User}=require('./models/user');
var {authenticate}=require('./middleware/authenticate')


var app=express();
var port=process.env.PORT||3000;
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var newtodo=new Todo({
    text:req.body.text
  });
  newtodo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos',(req,res)=>{
  Todo.find().then((todos)=>{
    res.send({todos});
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos/:id',(req,res)=>{
  var id=req.params.id;
  // res.send(id);
  if(ObjectId.isValid(id))
  {
      Todo.findById(id).then((todo)=>{
        if(todo)
        {
          res.send({todo});
        }
        else {
            res.status(404).send();
        }
      },(e)=>{
        res.status(400).send();
      });
  }
  else {
    res.status(400).send();
  }
});

app.delete('/todos/:id',(req,res)=>{
  var id=req.params.id;
  if(ObjectId.isValid(id))
  {
    Todo.findByIdAndRemove(id).then((todo)=>{
      if(todo)
      {
        res.status(200).send({todo});
      }
      else {
        res.status(404).send();
      }
    },(e)=>{
      res.status(400).send();
    });
  }
  else {
    res.status(404).send();
  }
});
app.patch('/todos/:id',(req,res)=>{
  var id=req.params.id;
  var body=_.pick(req.body,['text','completed']);
  if(_.isBoolean(body.completed)&&body.completed)
  {
    body.completedAt=new Date().getTime();
  }
  else {
    body.completed=false;
    body.completedAt=null;
  }
  Todo.findByIdAndUpdate(id,{ $set :body},{new: true}).then((todo)=>{
    if(!todo)
    {
      res.status(404).send();
    }
    res.send(todo);

  }).catch((e)=>{
    return res.status(400).send();
  });
});

app.post('/user',(req,res)=>{
  var body=_.pick(req.body,['email','password']);
  var user=new User(body);
  user.save().then(()=>{
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>{
    res.status(400).send(e);
  });
});


app.get('/users/me',authenticate,(req,res)=>{
res.send(req.user);
});

app.listen(port,()=>{
  console.log(`started on port ${port}`);
});

module.exports={app};
