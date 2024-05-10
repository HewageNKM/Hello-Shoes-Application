const alert = $("#alert");
$('#loginForm').submit(function (e) {
    e.preventDefault();
    const email = e.target.email.value.toString();
    const password = e.target.password.value.toString();

    console.log("Email: " + email, "Password: " + password);
    const passwordFld = $("#passwordFld");
    if (password.trim().length < 8) {
        passwordFld.addClass("border-2 border-red-500");
        return;
    } else {
        passwordFld.removeClass("border-2 border-red-500");
    }
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(email)) {
        $("#emailFld").addClass("border-2 border-red-500");
        return;
    }else {
        $("#emailFld").removeClass("border-2 border-red-500");
    }

    $(".fld").removeClass("hover:border-2");
    passwordFld.removeClass("border-2 border-red-500");
    $("#btnLoadingAnimation").removeClass("hidden");
    $("#btnLoadingAnimation").addClass("flex");
    $(".fld").prop("disabled", true);
    $("#loginBtn").addClass("cursor-not-allowed");


    // Backend API call to login
    $.ajax(BASEURL+"/auth/users/login", {
        method:"POST",
        contentType: "application/json",
        data: JSON.stringify({
            email:email,
            password:password
        }),
        success: function (data) {
            console.log(data);
            $("#btnLoadingAnimation").removeClass("flex");
            $("#btnLoadingAnimation").addClass("hidden");
            $(".fld").prop("disabled", false);
            $("#loginBtn").removeClass("cursor-not-allowed");
            $(".fld").addClass("border-2");
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role[0].authority);
            e.target.reset();
            window.location.replace("/directory/home.html");
        },
        error: function (error) {
            let message = "Error logging in!";
            console.log(error);
            if (error.responseJSON) {
                message = error.responseJSON.message;
            }
            $("#btnLoadingAnimation").removeClass("flex");
            $("#btnLoadingAnimation").addClass("hidden");
            $(".fld").prop("disabled", false);
            $("#loginBtn").removeClass("cursor-not-allowed");
            $(".fld").addClass("border-red-500 border-2 ");

            alert.removeClass("right-[-100%]")
            alert.addClass("right-0")
            $("#alertDescription").text(message);
            console.log(message);

            let countdown = 4;
            //Set the timer to hide the alert after 4 seconds
            const setAlertTimer = setInterval(function () {
                countdown--;
                if(countdown === 0){
                    alert.removeClass("right-0")
                    alert.addClass("right-[-100%]")
                    clearInterval(setAlertTimer);
                }
            }, 1000);
        }
    });

});

$("#alertCloseBtn").click(function () {
    alert.removeClass("right-0")
    alert.addClass("right-[-100%]")
});