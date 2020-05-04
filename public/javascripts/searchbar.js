function hideSearchOptions(){
  document.querySelector("#searchOptions").style.display = "none";
}
function showSearchOptions(){
  document.querySelector("#searchOptions").style.display = "block";
}

function filter() {
  showSearchOptions();
  var input, filter, ul, li, a, i;
  input = document.getElementById("searchInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("searchOptions");
  a = div.getElementsByTagName("button");
  for (i = 0; i < a.length; i++) {
    let txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}

window.addEventListener('click', function(e){   
  if (document.getElementById("searchbar").contains(e.target)){
    // Clicked in box
  } else{
    hideSearchOptions();
  }
});