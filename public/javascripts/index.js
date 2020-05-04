function validate(){

}
function gotoLogin(){
  document.querySelector("#loginbox").style.display = "block";
  document.querySelector("#registerbox").style.display = "none"; 
}
function gotoRegister(){
  document.querySelector("#registerbox").style.display = "block";
  document.querySelector("#loginbox").style.display = "none"; 
}
function selected_faculty(){
  document.querySelector("#scholar").style.display = "none";
   document.querySelector("#semester").style.display = "none";   
}
function selected_student(){
  document.querySelector("#scholar").style.display = "block";
   document.querySelector("#semester").style.display = "block";   
}