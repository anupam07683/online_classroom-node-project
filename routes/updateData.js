const insertModel = require('../model/insertModel'); 
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
   
  insertModel.addData(request,(error,result) => {
    if(error){
      return response.send({
        "status" : -1,
        "error": 'can not add content to the course'
      });
    }else{
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
    
   insertModel.submitAssignment(request,(error,results) => {
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