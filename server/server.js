var express=require('express');
var bodyParser=require('body-parser');

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

app.listen(3000,()=>{
  console.log('listning on port 3000');
});
