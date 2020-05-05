const fs = require('fs');
const path = require('path');

const getModel = require('../model/getModel');
const insertModel = require('../model/insertModel');

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

  getModel.getcoursejoined(request,(error,result) => {
    if(error)
    {
      return response.send({
        'status' : -1,
        'usertype':request.session.usertype,
        'error':err
      })
    }else{
      return response.send({
        'status':200,
        'usertype' : request.session.usertype,
        'userid' : request.session.userid,
        "data":result
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
  console.log(request.body);
   
  getModel.getcourseDetails(request,(error,coursedetails) => {
    if(error)
    {
      return response.send({
        'status':-1,
        'error':error
      });
    }else{
      getModel.getassignments(request,(error,assignment) => {
        if(error){
          return response.send({
            'status':-1,
            'error':error
          })
        }else{
          getModel.getnotes(request,(error,notes) => {
            if(error){
              return response.send({
                'status':-1,
                'error':error
              })
            }else{
              
              getModel.getsubmittedAssignment(request,(error,submittedAssignment) =>{
                if(error){
                  return response.send({
                    'status':-1,
                    'error':error
                  })
                }else{
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
          })
        }
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
  {
    return response.redirect('/')
  }
  const validate = validateCourseDetails(request)
  if(validate == false)
  {
    return response.render('home',{data:{class:'alert-danger',message:'incomplete or incorrect details'}})
  }
  insertModel.addcourse(request, (error,result)=>{
    if(error){
      return response.send({
        'status':-1,
        "error":error
      })
    }
    else {
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
  if(!request.session.usertype || !request.session.userid)
  {
    return response.send({
      "status" : -1,
      "error":  "incorrect details"
    })
  }
  getModel.getcoursenames(request,(error,result) => {
    if(error)
    {
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
  insertModel.joincourse(request,(error,result) => {
    if(error)
    {
      return  response.send({
        'status':-1,
        'error': error
      })
    }
    else{
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
  getModel.getcourseDetails(request,(error,result) => {
    if(error)
    {
      console.log("getcoursedetails" ,error)
      return response.send({
        "status":-1,
        "error":error
      })
    }else{
      console.log("course details" ,result)
      return response.send({
        'status':200,
        'usertype':request.session.usertype,
        'details':JSON.stringify(result)
      })
    }
  })
}