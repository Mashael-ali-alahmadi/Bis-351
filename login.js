const loginForm =
document.getElementById("loginForm");

const emailInput =
document.getElementById("email");

const passwordInput =
document.getElementById("password");

const successMessage =
document.getElementById("successMessage");


// POPUP

const popupOverlay =
document.getElementById("popupOverlay");

const openPopup =
document.getElementById("openPopup");

const closePopup =
document.getElementById("closePopup");

const signupForm =
document.getElementById("signupForm");


// PASSWORD TOGGLE

const toggleLoginPassword =
document.getElementById("toggleLoginPassword");

const toggleSignupPassword =
document.getElementById("toggleSignupPassword");


// SIGNUP INPUTS

const signupEmail =
document.getElementById("signupEmail");

const confirmEmail =
document.getElementById("confirmEmail");

const signupPassword =
document.getElementById("signupPassword");


// ===========================
// VALIDATION FUNCTIONS
// ===========================

function validateEmail(email){

    if(email.trim() === ""){
        return "Email is required";
    }

    const pattern =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!pattern.test(email)){
        return "Please enter a valid email";
    }

    return "";
}


function validateSignupPassword(password){

    if(password.trim() === ""){
        return "Password is required";
    }

    if(password.length < 8){
        return "Password must be at least 8 characters";
    }

    if(!/[A-Z]/.test(password)){
        return "Password must contain uppercase letter";
    }

    if(!/[0-9]/.test(password)){
        return "Password must contain a number";
    }

    return "";
}


// ===========================
// ERROR FUNCTIONS
// ===========================

function showError(inputId, message){

    const input =
    document.getElementById(inputId);

    const error =
    document.getElementById(inputId + "Error");

    error.textContent = message;

    input.classList.remove("input-valid");

    input.classList.add("input-error");

}


function clearError(inputId){

    const input =
    document.getElementById(inputId);

    const error =
    document.getElementById(inputId + "Error");

    error.textContent = "";

    input.classList.remove("input-error");

    input.classList.add("input-valid");

}


// ===========================
// LOGIN VALIDATION
// ===========================

emailInput.addEventListener("blur", function(){

    const error =
    validateEmail(emailInput.value);

    if(error){

        showError("email", error);

    }
    else{

        clearError("email");

    }

});


// LOGIN PASSWORD ONLY REQUIRED

passwordInput.addEventListener("input", function(){

    if(passwordInput.value.trim() === ""){

        showError(
            "password",
            "Password is required"
        );

    }

    else{

        clearError("password");

    }

});


// ===========================
// LOGIN
// ===========================

loginForm.addEventListener("submit", function(event){

    event.preventDefault();

    let isValid = true;


    const emailError =
    validateEmail(emailInput.value);

    if(emailError){

        showError("email", emailError);

        isValid = false;

    }
    else{

        clearError("email");

    }


    // PASSWORD REQUIRED ONLY

    if(passwordInput.value.trim() === ""){

        showError(
            "password",
            "Password is required"
        );

        isValid = false;

    }

    else{

        clearError("password");

    }


    if(isValid){

        const user = {

            email: emailInput.value,

            password: passwordInput.value

        };


        const savedUser =
        JSON.parse(localStorage.getItem("user"));


        if(
            savedUser &&
            user.email === savedUser.email &&
            user.password === savedUser.password
        ){

            successMessage.textContent =
            "Login successful";

            successMessage.style.color =
            "#16a34a";


            setTimeout(function(){

                window.location.href =
                "home.html";

            }, 1000);

        }

        else{

            successMessage.textContent =
            "Incorrect email or password";

            successMessage.style.color =
            "#dc2626";

        }

    }

});


// ===========================
// OPEN POPUP
// ===========================

openPopup.addEventListener("click", function(){

    popupOverlay.classList.add("active");

});


// ===========================
// CLOSE POPUP
// ===========================

closePopup.addEventListener("click", function(){

    popupOverlay.classList.remove("active");

});


// ===========================
// CLOSE OUTSIDE
// ===========================

popupOverlay.addEventListener("click", function(event){

    if(event.target === popupOverlay){

        popupOverlay.classList.remove("active");

    }

});


// ===========================
// SIGNUP VALIDATION
// ===========================

signupEmail.addEventListener("blur", function(){

    const error =
    validateEmail(signupEmail.value);

    if(error){

        showError("signupEmail", error);

    }
    else{

        clearError("signupEmail");

    }

});


confirmEmail.addEventListener("blur", function(){

    if(confirmEmail.value !== signupEmail.value){

        showError(
            "confirmEmail",
            "Emails do not match"
        );

    }

    else{

        clearError("confirmEmail");

    }

});


signupPassword.addEventListener("input", function(){

    const error =
    validateSignupPassword(
        signupPassword.value
    );

    if(error){

        showError(
            "signupPassword",
            error
        );

    }

    else{

        clearError("signupPassword");

    }

});


// ===========================
// SIGNUP
// ===========================

signupForm.addEventListener("submit", function(event){

    event.preventDefault();

    let isValid = true;


    const emailError =
    validateEmail(signupEmail.value);

    if(emailError){

        showError(
            "signupEmail",
            emailError
        );

        isValid = false;

    }

    else{

        clearError("signupEmail");

    }


    // CONFIRM EMAIL

    if(confirmEmail.value !== signupEmail.value){

        showError(
            "confirmEmail",
            "Emails do not match"
        );

        isValid = false;

    }

    else{

        clearError("confirmEmail");

    }


    // PASSWORD VALIDATION

    const passwordError =
    validateSignupPassword(
        signupPassword.value
    );

    if(passwordError){

        showError(
            "signupPassword",
            passwordError
        );

        isValid = false;

    }

    else{

        clearError("signupPassword");

    }


    if(isValid){

        const user = {

            email: signupEmail.value,

            password: signupPassword.value

        };


        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        successMessage.textContent =
        "Account created successfully";

        successMessage.style.color =
        "#16a34a";


        popupOverlay.classList.remove("active");


        setTimeout(function(){

            window.location.href =
            "home.html";

        }, 1000);

    }

});


// ===========================
// SHOW / HIDE PASSWORD
// ===========================

toggleLoginPassword.addEventListener("click", function(){

    if(passwordInput.type === "password"){

        passwordInput.type = "text";

    }

    else{

        passwordInput.type = "password";

    }

});


toggleSignupPassword.addEventListener("click", function(){

    if(signupPassword.type === "password"){

        signupPassword.type = "text";

    }

    else{

        signupPassword.type = "password";

    }

});
