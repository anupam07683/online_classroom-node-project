const mysql = require('mysql')
const db_details = {
  host : "localhost",
  database : "college",
  user : "root",
  password : "anupam" 
}


//provides course_name of courses  joined by this specific student student
// provides course_name those courses which created by this specefic faculty
exports.loadcourses =  ((request,response) =>{
  
  console.log(request.session.userid)
  console.log(request.session.usertype)

  if(!request.session.userid)
   return response.send({
     "status":0,
    "error":"unauthorized access"
  })

  var connection = mysql.createConnection(db_details);
  connection.connect( (err)=>{
      if(err)
      {
        console.log("error connecting database")
        return response.send({
          'status' : -1,
          'usertype':request.session.usertype,
          'error':'error connecting database'
        })
      }
 
  })

  let query
  if(request.session.usertype == 'student')
  query =  `select course_name from joined where email = ?`
  else if(request.session.usertype == 'faculty')
  query = `select course_name from courses where email= ?`

  connection.query(query,request.session.userid,(err,results) => {
    if(err){
      return response.send({
        'status' : -1,
        'usertype':request.session.usertype,
        'error':err
      })
    }
    else{
      //console.log(results)
      return response.send({
        'status':200,
        'usertype' : request.session.usertype,
        'userid' : request.session.userid,
        "data":results
      });
    } 
  })
})


/*
provides complete data of course   which are  created by this specific faculty(notes,assignments,submitted assignments)
provides compplete data of the course  which are joined by this this current logged in  student (notes,assignment,assignment submitted by this student )
*/
exports.loadcoursedata = (request,response) => {
  if(!request.session.userid)
  {
    return response.send({
      "status" : 0,
      "error":"unauthorized user"
    })
  }
  console.log(request.body)
  const course_name = request.body.name
  let connection  = mysql.createConnection(db_details)
  connection.connect((err) => {
    if(err){
      return response.send({
        "status":-1,
        "error" : error
      })
    }
  })
  var coursedetails
  connection.query('select * from courses where course_name = ?',course_name,(error,results)=>{
    if(error)
    {
      return response.send({
        'status':-1,
        'error':error
      })
    }
    else {
      coursedetails = results
      //console.log(JSON.stringify(results))
    }
  })

  let usertype = request.session.usertype
  let email = request.session.userid 
  let submittedAssignment;
  let query
  if(usertype == "student")
  {
    query = `select assignment_no,name from submitted where  course_name = ? and email = ? `
    connection.query(query,[course_name,email],(error,result) => {
      if(error){
        return response.send({
          'status':-1,
          'error':error
        })
      }else{
         submittedAssignment = result
      }
    })
  }
  
  if(usertype == 'faculty'){
    query = 'select scholar,assignment_no,name from submitted inner join user on submitted.EMAIL = user.EMAIL where course_name = ?'
    connection.query(query,[course_name],(error,result) => {
      if(error){
        return response.send({
          'status':-1,
          'error':error
        })
      }else{
         submittedAssignment = result
      }
    })
  }
  
  var assignment 
  connection.query('select PATH from assignment where COURSE_NAME=?',course_name,(err,results) => {
    if(err)
    {
      return request.send({"status" : 'cannot fetch data'})
    }
    else {
      assignment = results
      //response.send(JSON.stringify(results))
    }
  })
  var notes 
  connection.query('select path from notes where course_name=?',course_name,(err,results) => {
    if(err)
    {
      return request.send({"status" : 'cannot fetch data'})
    }
    else { 
      notes = results
      //console.log(results)
      return response.send({
        'status':200,
        'usertype' : request.session.usertype,
        'userid'   : request.session.userid,
        "notes"    : JSON.stringify(notes),
        "assignment":JSON.stringify(assignment),
        "details"  :JSON.stringify(coursedetails),
        "submittedAssignment":JSON.stringify(submittedAssignment)
      })       
    }
  })  
}

const validateCourseDetails = (request) => {
   const pattern_email = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
   const pattern_name = /^[a-zA-Z \.]{2,30}$/
   const pattern_course = /^[a-zA-Z ]{2,50}$/

   if(!request.body.course_name || !pattern_course.test(request.body.course_name))
   return false

   if(!request.body.mentor || !pattern_name.test(request.body.mentor))
   return false

   if(!request.body.email || !pattern_email.test(request.body.email))
   return false

   return true
}

//add a new course this feature is only available for the faculties
exports.addCourse = (request,response) => {

  if(!request.session.userid)
  return response.redirect('/')

  const validate = validateCourseDetails(request)
  if(validate == false)
  {
    return response.render('home',{data:{class:'alert-danger',message:'incomplete or incorrect details'}})
  }
  const connection = mysql.createConnection(db_details)
  connection.connect((err)=>{
    if(err)
    return response.send({
        'status':-1,
        "error":error
    })
  })
  const date = new Date()
  const coursedata = {
    "course_name": request.body.course_name,
    "mentor":request.body.mentor,
    "department" : request.body.department,
    "email" : request.body.email,
    "created":date

  }
  //console.log(request.body)
  connection.query('INSERT INTO COURSES SET ?', coursedata,(error,results)=>{
    if(error){
      return response.send({
        'status':-1,
        "error":error
      })
    }
    else {
      const fs = require('fs')
      const path = require('path')
      const course_name = (request.body.course_name).replace(/\s/g,"_")
      fs.mkdir(path.join('./data/notes',course_name),(err) => { 
        if (err) { 
            return console.error(err); 
        } 
      })
      fs.mkdir(path.join('./data/assignment',course_name),(err) => { 
        if (err) { 
            return console.error(err); 
        }  
    })
      fs.mkdir(path.join('./data/assignment_submitted',course_name),(err) => { 
        if (err) { 
            return console.error(err); 
        } 
    }) 
       return response.redirect('home');
    }
  })
}


//provides the list of all the courses except those which are created by this specific faculty
//provides the list of all the courses except those which are joined by this specific faculty
exports.getAllCourses = (request,response) => {
  console.log('request received getAllCourses')
  if(!request.session.usertype || !request.session.userid)
  {
    return response.send({
      "status" : -1,
      "error":  "incorrect details"
    })
  }
  const connection = mysql.createConnection(db_details)
  connection.connect((error)=>{
    if(error)
    {
      return  response.send({
        "status":-1,
        'error':'connection error'
      })
    }
  })
  if(request.session.usertype == 'student'){
    const username = request.session.userid
    connection.query('select course_name from courses where course_name not in (select course_name from joined where email = ?)',[username],(error,result) =>{
      if(error){
        return response.send({
          "status":-1,
          "error":error,
        })
      }else{
       // console.log(result)
        return response.send({
          'status' : 200,
          'result':JSON.stringify(result)
        })
      }
    })
  }else if(request.session.usertype == 'faculty'){
    connection.query(`select course_name from courses where email  !=?`,request.session.userid,(error,result) =>{
      if(error){
        return response.send({
          "status":-1,
          'error':'erros executing query'
        })
      }else{
        return response.send({
          'status':200,
          'result':JSON.stringify(result)
        })
      }
    })
  } 
  else{
    return response.send({
      'status':200,
      'result':JSON.stringify(result)
    })
  } 
}



//this features allows a student to join a new course which he has not joined yet
exports.joinCourse = (request,response)=>{
  if(!request.session.usertype || !request.session.userid || !request.body.course_name)
  {
    return response.send({
      "status" :-1,
      "error" : "can not fulfill this request"
    })
  }

  const usertype = request.session.usertype
  if(!usertype || usertype == 'faculty'){
    return request.send({
      "status" :-1,
      "error" : "join a course in not facilitate for faculty"
    })
  }
  const connection = mysql.createConnection(db_details)
  connection.connect((error)=>{
    if(error){
      return  response.send({
        'status':-1,
        'error':'error connecting database'
      })
    }
  })
  let values = {
    "email" : request.session.userid,
    "course_name" : request.body.course_name
  }
  console.log(values)
  connection.query('insert into joined SET ?',values,(error,result)=>{
    if(error){
      return  response.send({
        'status':-1,
        'error': error
      })
    }else {
      console.log('course joined successfully')
      return response.send({
        'status':200,
        'success':'joined successfully'
      })
    }
  })
  }



//It provides details of courses not joined by student yet
//It provides details of courses not created by this currenlty logged faculty
exports.getCourseDetails = (request,response) => {
  if(!request.body.course_name)
  {
    return response.send({
      "status":-1,
      "error":'course_name not defined'
    })
  }
  let query = 'select * from courses where course_name = ?'
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error)
    {
      return response.send({
        "status":-1,
        "error":error
      })
    }
  })
  connection.query(query,request.body.course_name,(error,results) => {
    if(error){
      return response.send({
        "status":-1,
        "error":error
      })
    }else{
      return response.send({
        'status':200,
        'usertype':request.session.usertype,
        'details':JSON.stringify(results)
      })
    }
  })

}