const mysql = require('mysql')
const multer= require('multer')
 
const db_details = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}


/* 
Assignment and notes added by faculties
Also update the corresponding data in the database
*/
exports.addData = (request,response) => {
  if(!request.file.originalname || !request.body.course || !request.body.contentType)
  {
    return response.send({
      "status":-1,
      "error":'can not add content'
    })
  }
  console.log(request.body)
  console.log(request.file.originalname)
   
  const connection = mysql.createConnection(db_details)
  connection.connect((error)=>{
    if(error)
    return response.send({
      "status":error
    })
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

  connection.query(query,[values],(error,results) =>{
    if(error)
    {
      return response.send({
        'status':-1,
        'error':error
      })
    }
    else{
      return response.redirect('/home')
    }
  }) 
}

//This function is used to store file uploaded by student as assignment and also update the database
exports.submitAssignment = (request,response) => {
 
   if(!request.body.course || !request.body.serial || !request.file.filename || !request.body.userid)
   {
     return response.send({
      'status':-1,
      'error':"can not submit assignment"
    })
   }
   const connection = mysql.createConnection(db_details)
   const values = {
     'course_name':request.body.course,
     'assignment_no': request.body.serial,
     'name' : request.file.filename,
     'email':request.body.userid
   }
   connection.connect((error) => {
     if(error){
       return response.send({
         'status':-1,
         'error':error
       })
     }
   })
   let query = 'insert into submitted set ?'
   connection.query(query,[values],(error,results) => {
     if(error){
      return response.send({
        'status':-1,
        'error':error
      })
     }
     else{
      return response.redirect('/home')
     }
   })
}