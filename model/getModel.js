const mysql = require('mysql')

const db_details = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}


exports.getsubmittedAssignment = (request,callback) =>{
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error){
      return callback(err.message,null)
    }
  })

  let usertype = request.session.usertype
  let email = request.session.userid  
  const course_name = request.body.name 
  let query
  if(usertype == "student")
  {
    query = `select assignment_no,name from submitted where  course_name = ? and email = ? `
    connection.query(query,[course_name,email],(error,result) => {
      if(error){
        return callback(error.message,null)
      }else{
         return callback(null,result)
      }
    })
  }
  
  if(usertype == 'faculty'){
    query = 'select scholar,assignment_no,name from submitted inner join user on submitted.EMAIL = user.EMAIL where course_name = ?'
    connection.query(query,[course_name],(error,result) => {
      if(error){
        return callback(error.message,null)
      }else{
         return callback(null,result)
      }
    })
  }
}


exports.getuserDetails  = (req,callback) => {
  const connection  = mysql.createConnection(db_details);
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  }) 
  const email= req.body.username
  connection.query('select * from user where email=?',[email],(error,result)=>{
    if(error)
    {
      callback(error.message,null);
    }else{
      callback(null,result);
    }
  })
}

exports.getnotes = (request,callback) => {
  const connection  = mysql.createConnection(db_details);
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  })
  const course_name = request.body.name
  connection.query('select path from notes where course_name=?',course_name,(err,result) => {
    if(err)
    {
      return callback(error.message,null);
    }
    else {
      return callback(null,result);
    }
  })
}

exports.getassignments = (request,callback) => {
  const connection  = mysql.createConnection(db_details);
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  })
  const course_name = request.body.name
  connection.query('select PATH from assignment where COURSE_NAME=?',course_name,(err,result) => {
    if(err)
    {
      return callback(error.message,null);
    }
    else {
      return callback(null,result);
    }
  })
}

exports.getcoursenames = (request,callback) => {
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  })
  if(request.session.usertype == 'student'){
    const username = request.session.userid
    connection.query('select course_name from courses where course_name not in (select course_name from joined where email = ?)',[username],(error,result) =>{
      if(error){
        return callback(error.message,null);
      }else{
       return callback(null,result);
      }
    })
  }else if(request.session.usertype == 'faculty'){
    connection.query(`select course_name from courses where email  !=?`,request.session.userid,(error,result) =>{
      if(error){
        return callback(error.message,null)
      }else{
        callback(null,result)
      }
    })
  } 
}



exports.getcourseDetails = (request,callback) => {
  const connection  = mysql.createConnection(db_details);
  connection.connect((error) => {
    if(error){
      return callback(error.message,null)
    }  
  })
  console.log(request.body)
  const course_name = request.body.name || request.body.course_name;
  connection.query('select * from courses where course_name = ?',course_name,(error,result)=>{
    if(error)
    {
      return callback(error.message,null)
    }
    else {
      return callback(null,result)
    }
  })
}


exports.getcoursejoined = (request,callback) => {
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  })
  let query
  if(request.session.usertype == 'student')
  query =  `select course_name from joined where email = ?`
  else if(request.session.usertype == 'faculty')
  query = `select course_name from courses where email= ?`

  connection.query(query,request.session.userid,(error,result)=>{
    if(error)
    {
      callback(error.message,null);
    }else{
      callback(null,result);
    }
  })
}

exports.getemail = (request,callback) => {
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  })
  const query = "select email from user where email = ?" 
  connection.query(query,request.body.email,(error,result) => {
    if( error )
    {
      return callback(error.message,null);
    }
    else {
      return callback(null,result);
    }
  })
}

exports.getotp = (request,callback) => {
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  })
  let query = "select otp,time from resetpassword where email = ?";
  connection.query(query,request.session.forgot,(error,result) => {
    if( error )
    {
      return callback(error.message,null);
    }
    else {
      return callback(null,result);
    }
  })
}