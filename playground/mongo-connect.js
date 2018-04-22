const MongoClient= require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,client)=>{
  if(err)
  {
    return console.log('cannot connect to mongo server');
  }
  console.log('connected to database');

  const db=client.db('TodoApp');

  // db.collection('todos').insertOne({
  //   text:"something here",
  //   completed:false
  // },(error,result)=>{
  //   if(error)
  //   {
  //     return console.log("couldn't insert data");
  //   }
  //   console.log(JSON.stringify(result.ops,undefined,2));
  // });

  db.collection('users').insertOne({
    name:"nipun",
    age:20,
    location:"long island"
  },(error,result)=>{
    if(error)
      {
        return console.log("couldn't insert data",error);
      }
      console.log(JSON.stringify(result.ops,undefined,2));
      console.log('created on ', result.ops[0]._id.getTimestamp());
  });
client.close();
});
