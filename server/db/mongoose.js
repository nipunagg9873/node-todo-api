const mongoose=require('mongoose');
mongoose.Promise=global.Promise;
let db={
  localhost:'mongodb://localhost:27017/TodoApp',
  mlab:"mongodb://nipunagg9873:26842684@ds049104.mlab.com:49104/node-todo-api"
}
mongoose.connect(process.env.MONGODB_URI).catch((e)=>{
  console.log(e);
});
// // mongoose.connect(db.localhost).catch((e)=>{
// //   console.log(e);
// });
module.exports={mongoose};
