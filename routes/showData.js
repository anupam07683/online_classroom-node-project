const getassignmentModel = require('../model/getModel')
 
const checkDetails = (request) => {
  //console.log(request.body)
  if(!request.body.usertype || !request.body.course || !request.body.scholar)
  return false
  return true
}

//not using right now 
//show submitted assignments
exports.showSubmissionStudent = (request,response) => {
  const validate = checkDetails(request)
  if(validate == false)
  {
    return response.send({
      'status':-1,
      'error':"error"
    })
  }
  getassignmentModel.getassignmentModel(request,(err,res)=>{
    if(err)
    {
      return response.send({
        'status' :-1,
        'error' : err
      })
    }
    else{
      response.send({
        'status' : 200,
        'result':res
      })
    }
  }) 
  
}


const getDetailsModel = require('../model/getModel')
exports.showdetails = (request,response) => {
  getDetailsModel.getuserDetailsModel( (result) => {
    console.log(result[0].first_name)
    response.send({"detials":result[0].first_name})
 });
  
 }
 

