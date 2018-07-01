const _=require("lodash");
const express=require('express');
const bodyParser=require('body-parser');
const ObjectId=require('mongodb').ObjectID;

var {mongoose}=require('./db/mongoose');
var {todo}=require('./models/todo');
var {user}=require('./models/user');


var app=express();
var port=process.env.PORT||3000;
app.use(bodyParser.json());

app.post('/todos',(req,res)=>{
  var newtodo=new todo({
    text:req.body.text
  });
  newtodo.save().then((doc)=>{
    res.send(doc);
  },(e)=>{
    res.status(400).send(e);
  });
});

app.get('/todos',(req,res)=>{
  todo.find().then((todos)=>{
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
      todo.findById(id).then((todo)=>{
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
    todo.findByIdAndRemove(id).then((todo)=>{
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
  todo.findByIdAndUpdate(id,{ $set :body},{new: true}).then((todo)=>{
    if(!todo)
    {
      res.status(404).send();
    }
    res.send(todo);

  }).catch((e)=>{
    return res.status(400).send();
  });
});
app.listen(port,()=>{
  console.log(`started on port ${port}`);
});

module.exports={app};
