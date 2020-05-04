/*
|| function 1
*/
function hideAssignmentForm(){
  //console.log("hiding assignment submisstion form ");
  document.querySelector("#faculty").style.display = "none";
  document.querySelector("#student").style.display = "none";
  document.querySelector("#coursedetails").style.display = "none";
  document.querySelector("#searchOptions").style.display = "none";
}
/*
||function-1 show Error
*/
const showError = (cla,message) =>
{
  console.log(message)
}
/*
|| function 2
*/
const checkStatus = (status) => {
  if(status == 0)
  {
    window.location = 'index';
    return false
  }
  if(status == -1)
  {
    showError("class-danger","Error occured")
    return false
  }
  return true
}

/*
||function-3 ..Delivers the content  of any assignment or notes file for download 
*/
const getContent = (subject,type,filename) =>{
  let a = document.createElement("a")
  let course = subject.replace(/\s/g,'_')
  a.href = `http://localhost:3000/${type}/${course}/${filename}`;
  console.log(`http://localhost:3000/${type}/${course}/${filename}`);

  a.setAttribute("target", "_blank")
  a.click()
 }

/*
|| function 4
*/
function showSubmittedAssignments_student(submitted_assignments,content){
  let sub = document.querySelector("#submitted-assignment-head");
  //console.log(submitted_assignments)  
  child = sub.lastElementChild;  
   while (child) { 
      sub.removeChild(child); 
      child = sub.lastElementChild; 
    }
    let tablerow = document.createElement('tr')
    let th0 = document.createElement('th')
    let th2 = document.createElement('th')
    let th3 = document.createElement('th')
    th0.textContent = '#'
    th2.textContent = 'filename'
    th3.textContent = 'view'
    tablerow.appendChild(th0)
    tablerow.appendChild(th2)
    tablerow.appendChild(th3)

    sub.appendChild(tablerow)

    let sub_body = document.querySelector("#submitted-assignment-body")
    child = sub_body.lastElementChild;  
    while (child) { 
      sub_body.removeChild(child); 
      child = sub_body.lastElementChild; 
    }
    let count = 1
    for(const i of submitted_assignments)
     {
         let tableRow = document.createElement('tr');

         let td0 = document.createElement('th');
         td0.textContent = count;
         tableRow.appendChild(td0);

         let td2 = document.createElement('td');
         td2.textContent = i.name;
         tableRow.appendChild(td2);
         
         let td3 = document.createElement('td');
         let btn = document.createElement('button')
         btn.className += 'btn btn-success'
         btn.textContent = 'download'
         td3.appendChild(btn)
         tableRow.appendChild(td3);

         sub_body.appendChild(tableRow)
         count++;
         btn.addEventListener('click',getContent.bind(null,content,'assignment_submitted',i.name),false);
     }
}

/*
|| function 5
*/
function showSubmittedAssignments_faculty(submitted_assignmnets,content){
  let sub = document.querySelector("#submitted-assignment-head");  
  child = sub.lastElementChild;  
  while (child) { 
    sub.removeChild(child); 
    child = sub.lastElementChild; 
  }
  let tablerow = document.createElement('tr')
  let th0 = document.createElement('th')
  let th1 = document.createElement('th')
  let th2 = document.createElement('th')
  let th3 = document.createElement('th')
  th0.textContent = '#'
  th1.textContent = 'Assignment'
  th2.textContent = 'Scholar'
  th3.textContent = 'view'
  tablerow.appendChild(th0)
  tablerow.appendChild(th1)
  tablerow.appendChild(th2)
  tablerow.appendChild(th3)

  sub.appendChild(tablerow)
  
  let sub_body = document.querySelector("#submitted-assignment-body")
  child = sub_body.lastElementChild;  
  while (child) { 
    sub_body.removeChild(child); 
    child = sub_body.lastElementChild; 
  }
  let count = 1
  for(const i of submitted_assignmnets)
    {
        let tableRow = document.createElement('tr');

        let td0 = document.createElement('th');
        td0.textContent = count;
        tableRow.appendChild(td0);

        let td1 = document.createElement('td');
        td1.textContent = i.assignment_no;
        tableRow.appendChild(td1);

        let td2 = document.createElement('td');
        td2.textContent = i.scholar;
        tableRow.appendChild(td2);
        
        let td3 = document.createElement('td');
        let btn = document.createElement('button')
        btn.className += 'btn btn-success'
        btn.textContent = 'download'
        td3.appendChild(btn)
        tableRow.appendChild(td3);

        sub_body.appendChild(tableRow)
        count++;
        btn.addEventListener('click',getContent.bind(null,content,'assignment_submitted',i.name),false);
    }
}


/*---------------------------------------------------
|| function-6 loads the name of the courses not joned 
-------------------------------------------------
*/
function loadCourses(){
    hideAssignmentForm();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {

    const status = JSON.parse(this.responseText).status
    if(checkStatus(status) == false)
    {
      return 
    }
    let courses = JSON.parse(JSON.parse(this.responseText).result);
    let div = document.querySelector("#searchOptions");
    for(let i of courses)
    {
        let btn = document.createElement('button');
        btn.textContent = i.course_name;
        btn.className += "btn btn-secondary btn-block mr-2";
        btn.addEventListener('click',getCourseDetails.bind(null,btn.textContent),false);
        btn.style.margin = 25;
        div.appendChild(btn);
    }
  }
};
xhttp.open("POST", "/getAllCourses", true);
xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
xhttp.send();
}
/*--------------------------------------------------------------------------------
function - 7
//----------------------------------------------------------------------------------------
*/
window.onload = function loadData() {
  loadCourses();
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
  const status = JSON.parse(this.responseText).status
  if(checkStatus(status) == false)
  {
    return ;
  }
  if(JSON.parse(this.responseText).usertype=='faculty')
  {
      document.getElementById("myBtn").style.display = "block"    
  }
  document.getElementById('placeforusername').textContent = JSON.parse(this.responseText).userid
  const data = JSON.parse(this.responseText).data;
  if(data == undefined)
  return 
  for (var j = 0; j < data.length; j++){
    var btn = document.createElement("button")
    btn.textContent = data[j].course_name
    btn.className += " no-margin btn btn-block btn-primary"
    document.getElementById("joined_courses").appendChild(btn);
    btn.addEventListener('click',coursedata.bind(null,btn.textContent),false) 
    }
  }
};
xhttp.open("POST", "/loadcourses", true);
xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
xhttp.send();
};

//-------------------------------------------------------------
// function-8  FOR STUDENT TO JOIN ANY EXIXTING COURSE NOT JOINED YET
//-------------------------------------------------------------
const joincourse = (course_name) =>{
  hideAssignmentForm()
   var xhttp = new XMLHttpRequest();
   xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
    console.log("joincourse",this.responseText)
    const status = JSON.parse(this.responseText).status
    if(checkStatus(status) == false)
    {
      return ;
    }
    location.reload()
   }
   }
   xhttp.open("POST", "/joinCourse", true);
   xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded")
   xhttp.send(`course_name=${course_name}`)
}

//-------------------------------------------------------------------------------
//funciton-9 ONLY FOR COURSES NOT SUBSCRIED
//----------------------------------------------------------------

const getCourseDetails = (course_name) =>{
  hideAssignmentForm()
   let mainbox = document.getElementById('maincontent')
   let count = mainbox.childElementCount
   while(count >0)
   {
       mainbox.removeChild(mainbox.childNodes[count]);
       count--;
   }
   let xhttp = new XMLHttpRequest();
   let div = document.createElement("div")
   
   xhttp.onreadystatechange = function() {
       if (this.readyState == 4 && this.status == 200) {
          const status = JSON.parse(this.responseText).status
          if(checkStatus(status) == false)
          {
            return ;
          }
           console.log("getCourseDetails",this.responseText)
           let usertype = JSON.parse(this.responseText).usertype;
           const details = JSON.parse(JSON.parse(this.responseText).details)[0];
            
           const heading  = document.createElement("h4");
           heading.textContent = details.COURSE_NAME;
           div.appendChild(heading);

           const mentor = document.createElement('i');
           mentor.textContent = 'Mentor : '+details.MENTOR;
           div.appendChild(mentor);

           const dep = document.createElement('p');
           dep.textContent = 'Department : ' +details.DEPARTMENT;
           div.appendChild(dep);

           if(usertype == 'student')
           {   
               let btn = document.createElement('button');
               btn.textContent = 'Join Course';
               btn.className += 'btn btn-success mr-2';
               btn.addEventListener('click',joincourse.bind(null,details.COURSE_NAME),false);
               div.appendChild(btn);
           }
       }
   };
   mainbox.appendChild(div);
   xhttp.open("POST", "/getCourseDetails", true);
   xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
   xhttp.send(`course_name=${course_name}`);
}



//-----------------------------------------------
//    function-10            load course data (detailed)
//------------------------------------------------
const coursedata = (content) => {
 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
    const status = JSON.parse(this.responseText).status
    if(checkStatus(status) == false)
    {
      return ;
    }
    var data = JSON.parse(this.responseText);
    console.log("coursedata",data);
    let notes = JSON.parse(data.notes);
    let assignment = JSON.parse(data.assignment);
    let submittedAssignment = JSON.parse(data.submittedAssignment)
    let details = JSON.parse(data.details)[0];
    let mainbox = document.getElementById('maincontent')
    let count = mainbox.childElementCount
    while(count >0)
    {
        mainbox.removeChild(mainbox.childNodes[count]);
        count--;
    } 
    const heading  = document.createElement("h4");
    heading.textContent = details.COURSE_NAME;
    mainbox.appendChild(heading);

    const mentor = document.createElement('i');
    mentor.textContent = 'Mentor : '+details.MENTOR;
    mainbox.appendChild(mentor);

    const dep = document.createElement('p');
    dep.textContent = 'Department : ' +details.DEPARTMENT;
    mainbox.appendChild(dep);

    count =1;
    let  e = document.querySelector("#notes-body");  
    let child = e.lastElementChild;  
    while (child) { 
        e.removeChild(child); 
        child = e.lastElementChild; 
      } 
    document.querySelector("#coursedetails").style.display = "block";
    for(const i of notes)
      {
          let tablerow = document.createElement('tr');

          let td0 = document.createElement('th');
          td0.textContent = count;
          tablerow.appendChild(td0);

          let td1 = document.createElement('td');
          td1.textContent = i.path;
          tablerow.appendChild(td1);

          let td2 = document.createElement('td');
          let btn = document.createElement('button')
          btn.className += 'btn btn-success'
          btn.textContent = 'download'
          td2.appendChild(btn) 
          tablerow.appendChild(td2);

          e.appendChild(tablerow)
          count++;
          btn.addEventListener('click',getContent.bind(null,content,'notes',i.path),false);
      }


    count =1;
    let ass = document.querySelector("#assignment-body");  
    child = ass.lastElementChild;  
    while (child) { 
        ass.removeChild(child); 
        child = ass.lastElementChild; 
      } 
    for(const i of assignment)
      {
          let tablerow = document.createElement('tr');

          let td0 = document.createElement('th');
          td0.textContent = count;
          tablerow.appendChild(td0);

          let td1 = document.createElement('td');
          td1.textContent = i.PATH;
          tablerow.appendChild(td1);

          let td2 = document.createElement('td');
          let btn = document.createElement('button')
          
          btn.className += 'btn btn-success'
          btn.textContent = 'download'
          td2.appendChild(btn)
          tablerow.appendChild(td2);

          ass.appendChild(tablerow)
          count++;
          btn.addEventListener('click',getContent.bind(null,content,'assignment',i.PATH),false);
      }
  
      if(data.usertype=='faculty')
      {
          showSubmittedAssignments_faculty(submittedAssignment,content);
          document.querySelector("#faculty").style.display = "block";
          document.getElementById('fc_coursename').value = content;
      }
      if(data.usertype == 'student')
      {
        showSubmittedAssignments_student(submittedAssignment,content);
        document.getElementById('st_coursename').value = content;
        document.getElementById('st_userid').value = data.userid;
        document.querySelector("#student").style.display = "block";
      }
      }
  };
  xhttp.open("POST", "/loadcoursedata", true);
  xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
  xhttp.send(`name=${content}`);
}

/*
| Function-11 to get logged out 

const getLoggedOut = () => {
 var xhttp = new XMLHttpRequest();
 xhttp.onreadystatechange = function() {
   if (this.readyState == 4 && this.status == 200) {
    window.location = 'index.html'  ;
   }
 };
 xhttp.open("POST", "/logout", true);
 xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
 xhttp.send();
}
*/
