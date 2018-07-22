var env=process.env.NODE_ENV||'developement'

console.log("env ****" +env)

if(env==='developement'){
  process.env.PORT=3000;
  process.env.MONGODB_URI="mongodb://localhost:27017/TodpApp"
}
else if(env==='test') {
  process.env.PORT=3000;
  process.env.MONGODB_URI="mongodb://localhost:27017/TodoAppTest"
}
else {
  process.env.MONGODB_URI="mongodb://nipunagg9873:26842684@ds049104.mlab.com:49104/node-todo-api"
}
