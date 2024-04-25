$('#loginForm').submit(function (e) {
    e.preventDefault();
    const email = e.target.email.value.toString();
    const password = e.target.password.value.toString();

    console.log("Email: " + email, "Password: " + password);

    if (password.trim().length < 8) {
        $("#passwordFld").addClass("border-2 border-red-500");
        return;
    } else {
        $("#passwordFld").removeClass("border-2 border-red-500");
    }

    $.ajax("http://localhost:8080/api/v1/auth/users/login", {
        method:"POST",
        contentType: "application/json",
        data: JSON.stringify({
            email:email,
            password:password
        }),
        success: function (data) {
            console.log(data);
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role[0].authority);
        },
        error: function (error) {
            console.log(error);
        }
    });

});