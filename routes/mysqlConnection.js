var mysql = require('mysql');
exports.getConnection = function(){
  
  var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'anupam',
  database : 'cloudprint'
});

connection.connect(function(err){
if(!err) {
    console.log("Database is connected ... nn");
} else {
    return connection;
}
});};