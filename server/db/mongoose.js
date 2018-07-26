const mongoose=require('mongoose');
mongoose.Promise=global.Promise;

mongoose.connect(process.env.MONGODB_URI).catch((e)=>{
  console.log(e);
});
// // mongoose.connect(db.localhost).catch((e)=>{
// //   console.log(e);
// });
module.exports={mongoose};
