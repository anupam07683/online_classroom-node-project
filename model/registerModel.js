const mysql = require('mysql');
const bcrypt = require('bcrypt');


const db_details = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}
exports.register = (request,callback) => {
  const connection = mysql.createConnection(db_details);
  connection.connect((error) => {
    if(error)
    {
      return callback(error.message,null);
    }
  });


  let details;
  let today = new Date();
  if(request.body.role == 'student')
  {
    details = {
      "email"      : request.body.email,
      "Scholar"    : request.body.scholar,
      "first_name" : request.body.first_name,
      "last_name"  : request.body.last_name,
      "semester"   : request.body.semester,
      "department" : request.body.department,
      "gender"     : request.body.gender, 
      "password"   : bcrypt.hashSync(request.body.password,10),
      "role"       : "faculty",
      "created"    : today,
      "modified"   : today
    }
  }
  else if(request.body.role == 'faculty')
  {
    details = {
      "email"      : request.body.email,
      "first_name" : request.body.first_name,
      "last_name"  : request.body.last_name,
      "department" : request.body.department,
      "gender"     : request.body.gender, 
      "password"   : bcrypt.hashSync(request.body.password,10),
      "role"       : "student",
      "created"    : today,
      "modified"   : today
    }
  }
 
  connection.query("insert into user set ? ",details,(error,result) => {
    if(error)
    {
      return callback(error.message,null);
    }
    else{
      return callback(null,result)
    }
  })
  
}