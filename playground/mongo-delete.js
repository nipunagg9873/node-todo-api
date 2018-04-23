const {MongoClient,ObjectId}= require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
  if(err)
  {
    return console.log('cannot connect to mongo server');
  }
  console.log('connected to database');

  const db=client.db('TodoApp');

  db.collection('users').findOneAndDelete({_id: new ObjectId("5adce9f8902dae2978458570")}).then((result)=>{
    console.log(result);
  });

client.close();
});
