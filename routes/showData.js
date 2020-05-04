const mysql = require('mysql')

const db_details = {
  host : process.env.HOST,
  database : process.env.DATABASE,
  user : process.env.USER,
  password : process.env.DB_PASSWORD
}

const checkDetails = (request) => {
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
      'error':error
    })
  }
  const connection = mysql.createConnection(db_details)
  connection.connect((error) => {
    if(error){
      return response.send({
        'status':-1,
        'error':error
      })
    }
  
  let usertype = request.body.usertype
  let course = request.body.course
  let scholar = request.body.scholar  
  let query
  if(usertype == "student")
  query = `select assignment_no,name from submitted where scholar = ${scholar} and course_name = ?`

  if(usertype == 'faculty')
  query = 'select scholar,assignment_no,name from submitted where course_name = ?'

  connection.query(query,course,(error,result) => {
    if(error){
      return response.send({
        'status':-1,
        'error':error
      })
    }else{
      return response.send({
        'status':1,
        'result':JSON.stringify(result)
      })
    }
  })
  })
}

