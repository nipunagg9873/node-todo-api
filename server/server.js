var express=require('express');
var bodyParser=require('body-parser');
var ObjectId=require('mongodb').ObjectID;

var {mongoose}=require('./db/mongoose');
var {todo}=require('./models/todo');
var {user}=require('./models/user');

var app=express();
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

app.listen(3000,()=>{
  console.log('listning on port 3000');
});

module.exports={app};
