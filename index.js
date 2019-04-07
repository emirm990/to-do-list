let list = domSelect("#list");//document.getElementById("list");
let remove = domSelect(".remove"); //document.getElementsByClassName("remove");
let key = domSelect(".key"); //document.getElementsByClassName("key");
let login = domSelect("#login"); //document.getElementById("login");
let logout = domSelect("#logout"); //document.getElementById("logout");
let addItem = domSelect("#confirm_item"); //document.getElementById("confirm_item");
let loginContainer = domSelect("#login-container"); //document.getElementById("login-container");
let logoutContainer = domSelect("#logout-container"); //document.getElementById("logout-container");
let usernameContainer = domSelect("#username-container");//document.getElementById("username-container");
let modal = domSelect("#register-container"); //document.getElementById("register-container");
let signUp = domSelect("#signup"); //document.getElementById("signup");
let span = domSelect(".close")[1]; //document.getElementsByClassName("close")[1];
let helpClose = domSelect(".close")[0]; //document.getElementsByClassName("close")[0];
let help = domSelect("#help"); //document.getElementById("help");
let helpContainer = domSelect("#help-container"); //document.getElementById("help-container");
let register = domSelect("#register"); //document.getElementById("register");
let emailRegister = domSelect("#email-register"); //document.getElementById("email-register");
let passwordRegister = domSelect("#password-register"); //document.getElementById("password-register");
let passwordCheck = domSelect("#password-check"); //document.getElementById("password-check");
let verifyEmail = domSelect("#verify"); //document.getElementById("verify");
let changePassword = domSelect("#changePassword");
let emailVerificationMessage = domSelect("#email-verification-message"); //document.getElementById("email-verification-message");
function domSelect(element){
    if (element.startsWith("#")){
        return document.querySelector(element);
    }else {
        return document.querySelectorAll(element);
    }
}
let checkedOrNot;
let uid;
let color = "black";
let date = new Date();
let currentdate = date;
let formatedDate =
  currentdate.getDate() +
  "." +
  Number(currentdate.getMonth() + 1) +
  "." +
  currentdate.getFullYear();
signUp.addEventListener("click", function(){
    modal.style.display = "block";
})
help.addEventListener("click", function(){
    helpContainer.style.display = "block";
})
helpClose.addEventListener("click", function(){
    helpContainer.style.display = "none";
})
span.addEventListener("click", function(){
    modal.style.display = "none";
})
window.addEventListener("click", function(event){
    if (event.target == modal || event.target == helpContainer){
        modal.style.display = "none";
        helpContainer.style.display = "none";
    }
})
register.addEventListener("click", function(){
    if (passwordCheck.value === passwordRegister.value){
        firebase.auth().createUserWithEmailAndPassword(emailRegister.value, passwordRegister.value).catch(function(error) {
            // Handle Errors here.
            var errorCode = error.code;
            var errorMessage = error.message;
            alert("Error: " + errorMessage);
            // ...
          });
        modal.style.display = "none";
    }else{
        alert("Your entered passwords must match!");
    }
      
})
function getItems(){
    console.log("getItems");
    list.innerHTML = "";
    fetch("https://to-do-5b78c.firebaseio.com/list/" + uid + ".json")
            .then(response => {return response.json()})
            .then(data => {
                console.log(data);
                let items = [];
                for(const identifier in data){
                    if (data[identifier].checked==true){
                        checkedOrNot = "checked";
                        color = "green";
                    }else {
                        checkedOrNot = " ";
                        color = "black";
                    }
                    list.innerHTML += `<li style = "color:${color}"></>
                    <span class="email-field">${data[identifier].username}</span>
                    <span class="text-field">${data[identifier].item}</span>
                    <span class="date-field">${data[identifier].date}</span>
                    <span class="key">${identifier}</span>
                    <input type="checkbox" class="remove" ${checkedOrNot} input>
                    </li>`
                }
            })
}
function postToDoItem(username){
    console.log(username);
    let item = document.getElementById("todo_item");
    let checked = false;
    console.log("clicked");
    list.innerHTML = "";
    fetch("https://to-do-5b78c.firebaseio.com/list/" + uid + ".json",{
    method: "POST",
    body: JSON.stringify({
        username: username,
        item: item.value,
        date: formatedDate,
        checked: checked
        })
    }).then (function(response){
        if(response.status == 200){
            item.value = "";
        }
    })
    
    getItems();
    checkedColor();
}
function infoMessage(message){
    emailVerificationMessage.innerText = message;
    emailVerificationMessage.style.color = "green";
    setTimeout(function(){
        emailVerificationMessage.innerText = "";
    }, 10000);
}
login.addEventListener("click", function(){
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        alert("Error: " + errorMessage);
        // ...
    });
})
logout.addEventListener("click", function(){
    firebase.auth().signOut().then(function() {
          // Sign-out successful.
            location.reload();
            list.innerText = "";
            username = null;
        }).catch(function(error) {
            alert("Error: " +error);
        });
})

firebase.auth().onAuthStateChanged(function(user) {
    console.log("signed in: ", user);
    if (user) {
        // User is signed in.
        var displayName = user.displayName;
        //var email = user.email;
        var emailVerified = user.emailVerified;
        var photoURL = user.photoURL;
        var isAnonymous = user.isAnonymous;
        uid = user.uid;
        var providerData = user.providerData;
        let username = user.email;
        logoutContainer.style.display = "block";
        loginContainer.style.display = "none";
        usernameContainer.innerText = username;
        addItem.disabled = false;
        list.innerHTML = "";
        console.log("email verified: ", emailVerified);
        if (emailVerified){
            verifyEmail.style.display = "none";
            addItem.innerText = "Post";
            addItem.disabled = false;
            addItem.addEventListener("click", function(){
                postToDoItem(username)
            });
            changePassword.style.display = "inline-block";
            changePassword.addEventListener("click", function(){
                passwordChange(username);
                infoMessage("Email sent, please check your junk/spam folder");
                });
        }else{
            verifyEmail.style.display = "inline-block";
            addItem.disabled = true;
            addItem.innerText = "Verify email first";
            addItem.style.color = "black";
        }
        var actionCodeSettings = {
            url: 'https://emirm990.github.io/vjezbe/to-to-list/index.html?email='
            + firebase.auth().currentUser.email
        }
        verifyEmail.addEventListener("click", function(){
            user.sendEmailVerification(actionCodeSettings).then(function() {
                infoMessage("Email sent, please check your junk/spam folder");
              }).catch(function(error) {
                // An error happened.
                alert("Error: ", error);
              });
        })
        getItems();
        checkedColor();
        
        list.addEventListener("click", (event) => {
            console.log(event.target);
            if(event.target.classList.contains("remove")){
                let target = event.target.previousElementSibling;
                console.log(target);
                function writeUserData(target) {
                    if (event.target.checked){
                        firebase.database().ref('list/' + uid + "/" + target.innerText).update({
                        checked: true
                    });
                    event.target.parentElement.style.color = "green";
                    }else {
                        firebase.database().ref('list/' + uid + "/" + target.innerText).update({
                            checked: false
                        });
                        event.target.parentElement.style.color = "black";
                    }
                }
                writeUserData(target);
            }
        })
          // ...
    } else {
      // User is signed out.
      // ...
        //firebase.auth().signOut().then(function() {
        //  // Sign-out successful.
        //    list.innerText = "";
        //    username = null;
        //    logoutContainer.style.display = "none";
        //    loginContainer.style.display = "block";
        //    list.innerText = "";
        //    addItem.disabled = true;
        //}).catch(function(error) {
        //    alert("Error: " +error);
        //});
        
        console.log("signed out: ", user);
        logoutContainer.style.display = "none";
        loginContainer.style.display = "block";
        list.innerText = "";
        addItem.disabled = true;
        username = null;
        console.log(username);
    }
  });
function checkedColor(){
    let checkedBox = document.getElementsByClassName("remove");
    if (checkedBox.checked){
        checkedBox.parentElement.style.color = "green";
    }
}


