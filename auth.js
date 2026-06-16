// REGISTER

const registerForm =
document.getElementById("registerForm");

if(registerForm){

    registerForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const fullName =
            document.getElementById("fullName").value;

            const email =
            document.getElementById("email").value;

            const password =
            document.getElementById("password").value;

            const confirmPassword =
            document.getElementById("confirmPassword").value;

            if(password !== confirmPassword){
                alert("Passwords do not match");
                return;
            }

            let users =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];

            const exists =
            users.find(
                user => user.email === email
            );

            if(exists){
                alert("User already exists");
                return;
            }

            users.push({
                fullName,
                email,
                password
            });

            localStorage.setItem(
                "users",
                JSON.stringify(users)
            );

            alert("Registration Successful");

            window.location.href =
            "login.html";
        }
    );
}


// LOGIN

const loginForm =
document.getElementById("loginForm");

if(loginForm){

    loginForm.addEventListener(
        "submit",
        function(e){

            e.preventDefault();

            const email =
            document.getElementById("loginEmail").value;

            const password =
            document.getElementById("loginPassword").value;

            const users =
            JSON.parse(
                localStorage.getItem("users")
            ) || [];

            const user =
            users.find(
                user =>
                user.email === email &&
                user.password === password
            );

            if(!user){
                alert(
                    "Invalid Email or Password"
                );
                return;
            }

            localStorage.setItem(
                "loggedInUser",
                JSON.stringify(user)
            );

            alert("Login Successful");

            window.location.href =
            "dashboard.html";
        }
    );
}