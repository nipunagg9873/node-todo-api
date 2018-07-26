var env=process.env.NODE_ENV||'developement'

console.log("env **** " +env)

if(env==="test"||env=="developement")
{
  var config=require('./config.json');
  var envConfig=config[env];
  Object.keys(envConfig).forEach((key)=>{
  process.env[key]=envConfig[key];
});
}
