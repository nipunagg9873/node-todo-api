const {MongoClient,ObjectId}= require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
  if(err)
  {
    return console.log('cannot connect to mongo server');
  }
  console.log('connected to database');

  const db=client.db('TodoApp');

  db.collection('users').findOneAndUpdate({
    name:"jen"
  },{
  $set:{
    name:"nipun"
  },
  $inc:{
    age:1
  }
  },{
  returnOriginal:false
}).then((result)=>{
  console.log(result);
});
client.close();
});
