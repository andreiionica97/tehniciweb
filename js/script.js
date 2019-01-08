function toggleMenu() {
  var x = document.getElementById("nav");
  if (x.style.display === "none") {
    x.style.display = "block";
  } else {
    x.style.display = "none";
  }
}

var btnSubmit = document.getElementById("submit");
if(btnSubmit)
  btnSubmit.addEventListener("click",function(){
    var data = {};
    data.name = document.getElementById("name").value;
    data.email = document.getElementById("email").value;
    data.message = document.getElementById("message").value;
    var msg = JSON.stringify(data);
    if ( data.name != "" && data.email != "" && data.message != "") {
      var ourRequest = new XMLHttpRequest();
      ourRequest.open("POST",'http://localhost:3000/messages',true);
      ourRequest.setRequestHeader('Content-type','application/json; charset=utf-8');
      ourRequest.send(msg);
      document.getElementById("name").value="";
      document.getElementById("email").value="";
      document.getElementById("message").value="";
      alert("Success!");
      location.reload();
    } else {
      alert("All fields are required!");
      return;
    }
  });

var showMessages = document.getElementById("show-all");
var btnShow = document.getElementById("show");
var msgId = [];
var msgName = [];
var msgEmail = [];
var msgMessage = [];
if(btnShow)
  btnShow.addEventListener("click",function(){
    var ourRequest1 = new XMLHttpRequest();
    ourRequest1.open('GET','http://localhost:3000/messages');
    ourRequest1.onload = function() {
    var ourData = JSON.parse(ourRequest1.responseText);
    render(ourData);
  };
    ourRequest1.send();
    document.getElementById("show-delete").style.display="block";
    document.getElementById("show-edit").style.display="block";
  });

var btnRefresh = document.getElementById("refresh");
if(btnRefresh)
  btnRefresh.addEventListener("click",function(){
    var ourRequest1 = new XMLHttpRequest();
    ourRequest1.open('GET','http://localhost:3000/messages');
    ourRequest1.onload = function() {
    var ourData = JSON.parse(ourRequest1.responseText);
    render(ourData);
  };
    ourRequest1.send();
    document.getElementById("show-delete").style.display="block";
    document.getElementById("show-edit").style.display="block";
  });

var maxId;
function render(data){
  var htmlString = "<h2>All Messages:</h2>";
  msgId = [];
  msgName = [];
  msgEmail = [];
  msgMessage = [];
  for ( i = 0; i < data.length; i++){
    htmlString += "<span class='toggle-results'>Message #"+ data[i].id +":<br>Name: " + data[i].name + "<br>Email: " + data[i].email +"<br>Message: "+ data[i].message + "</span><br><br>";
	  msgId[i] = data[i].id;
    msgName[i] = data[i].name;
    msgEmail[i] = data[i].email;
    msgMessage[i] = data[i].message;
    maxId = msgId[i];
    }
	while(showMessages.childElementCount)
	showMessages.removeChild(showMessages.childNodes[0]);
	showMessages.insertAdjacentHTML('beforeend',htmlString);
}

var btnDelete = document.getElementById("delete");
if(btnDelete)
  btnDelete.addEventListener("click",function(){
    var value = document.getElementById("delete-val").value;
    if(isNaN(value) || value < 1 || value > maxId)
      alert ("Not a valid ID");
    else {
      var answer = confirm("Delete message?");
      if ( answer == true) {
        var ourRequest2 = new XMLHttpRequest();
        ourRequest2.open("DELETE", 'http://localhost:3000/messages/' + value, true);
        ourRequest2.send(null);
      }
    }
  });

var btnEdit = document.getElementById("edit");
if(btnEdit)
  btnEdit.addEventListener("click",function(){
    var value = document.getElementById("edit-val").value;
    if(isNaN(value) || value < 1 || value > maxId)
      alert ("Not a valid ID");
    else {
      var newMsg = document.getElementById("new-message").value;
      if(newMsg == "") {
        alert("Message can't pe empty!");
        return;
      }
      var answer = confirm("Edit message?");
      if(answer == true){
        var data={};
        var ourRequest3 = new XMLHttpRequest();
        ourRequest3.open("PUT", 'http://localhost:3000/messages/'+ value.toString(), true);
        ourRequest3.setRequestHeader('Content-type','application/json; charset=utf-8');
        data.name = msgName[value - 1];
        data.email = msgEmail[value - 1];
        data.message = newMsg;
        var update = JSON.stringify(data);
        ourRequest3.send(update);
      }
    }
  });