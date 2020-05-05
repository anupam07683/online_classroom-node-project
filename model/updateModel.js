const mysql = require('mysql');
const bcrypt = require('bcrypt');

const db_details = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}


exports.updatepassword = (request,callback) => {
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  })
  const pwd = bcrypt.hashSync(request.body.password,10)
  const email = request.session.forgot
  connection.query('update user set password = ? where email = ?',[pwd,email],(error,result) => {
    if( error )
    {
      return callback(error.message,null);
    }
    else {
      return callback(null,result);
    }
  })
}

exports.updateotp = (request,otp,callback) => {
  const connection = mysql.createConnection(db_details);
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  });

  const time = Date.now()+5*60*1000;
  const email = request.body.email;

  let query = "insert into resetpassword values(?,?,?) on duplicate key update otp = ?, time = ?"
  connection.query(query,[email,otp,time,otp,time],(error,result) => {
    if(error)
    {
      console.log(error)
      return 
    }
    else{
      console.log("inserted")
      return
    } 
  });  
}