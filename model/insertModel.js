const mysql = require('mysql')

const db_details = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}

exports.addcourse = (request,callback) => {
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error)
    {
      callback(error.message,null);
    }
  })
  const date = new Date()
  const coursedata = {
    "course_name": request.body.course_name,
    "mentor":request.body.mentor,
    "department" : request.body.department,
    "email" : request.body.email,
    "created":date

  }
  connection.query('INSERT INTO COURSES SET ?', coursedata,(error,result) => {
    if(error)
    {
      return callback(error.message,null)
    }
    else{
      return callback(null,result)
    }
  })
}

exports.joincourse = (request,callback) => {
  const connection = mysql.createConnection(db_details)
  connection.connect((error)=>{
    if(error){
      return callback(error.message,null)
    }
  })

  let values = {
    "email" : request.session.userid,
    "course_name" : request.body.course_name
  }
  connection.query('insert into joined SET ?',values,(error,result)=>{
    if(error){
      return callback(error.message,null);
    }else {
      return callback(result,null);
    }
  })
}

exports.addData = (request,callback) => {
  const connection = mysql.createConnection(db_details)
  connection.connect((error)=>{
    if(error)
    return callback(error.message,null)
  })

  const values = {
    'course_name':request.body.course,
    'path'  :request.file.originalname
  }
  let query
  if(request.body.contentType == 'notes')
  query = 'insert into notes SET  ?'

  if(request.body.contentType == 'assignment')
  query = 'insert into assignment SET ?'

  connection.query(query,[values],(error,result) =>{
    if(error)
    {
      return callback(error.message,null)
    }
    else{
      return callback(null,result)
    }
  })
}

exports.submitAssignment = (request,callback) => {
  const connection = mysql.createConnection(db_details)
   const values = {
     'course_name':request.body.course,
     'assignment_no': request.body.serial,
     'name' : request.file.filename,
     'email':request.body.userid
   }
   connection.connect((error) => {
     if(error){
       return callback(error.message,null);
     }
   })
   let query = 'insert into submitted set ?'
   connection.query(query,[values],(error,result) => {
     if(error){
      return callback(error.message,null);
     }
     else{
      return callback(null,result)
     }
   })
}