const otpSendBtn = $("#otpSendBtn");
let isEmailVerified = false;
otpSendBtn.prop("disabled", true)
otpSendBtn.removeClass("hover:bg-red-500")

$("#registerForm").submit(function (event) {
    event.preventDefault();
    const email = event.target.email.value.toString().trim().toLocaleLowerCase();
    const password1 = event.target.password1.value.toString().trim();
    const password2 = event.target.password2.value.toString().trim();

    console.log("Email: " + email, "Password1: " + password1, "Password2: " + password2);

    if(isEmailVerified){
        if((password1.length > 8) && (password2.length > 8) && (password1===password2)){
            $.ajax("http://localhost:8080/api/v1/auth/users", {
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({email:email,password:password1}),
                success: function (response) {
                    console.log(response);
                    event.target.reset();
                    window.location.href = "http://localhost:8080/login";
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }else {
            $("#password1Fld").addClass("border-2 border-red-500")
            $("#password2Fld").addClass("border-2 border-red-500")

            const alert = $("#alert");
            alert.removeClass("right-[-100%]")
            alert.addClass("right-0")
            $("#alertDescription").text("Passwords do not match or less than 8 characters")

            let countdown = 4;
            const setAlertTimer = setInterval(function () {
                countdown--;
                if(countdown === 0){
                    alert.removeClass("right-0")
                    alert.addClass("right-[-100%]")
                    clearInterval(setAlertTimer);
                }
            }, 1000);
        }
    }else {
        const alert = $("#alert");
        alert.removeClass("right-[-100%]")
        alert.addClass("right-0")
        $("#alertDescription").text("Email not verified yet. Please verify your email first.")
        let countdown = 4;
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

$("#emailFld").keyup(function (event) {
    const email = event.target.value;
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        otpSendBtn.removeAttr("disabled")
        otpSendBtn.addClass("hover:bg-red-500")
    } else {
        otpSendBtn.attr("disabled", "disabled")
        otpSendBtn.removeClass("hover:bg-red-500")
    }
});

otpSendBtn.click(function (event) {
    const emailFld = $("#emailFld");
    emailFld.attr("disabled", "disabled")
    emailFld.removeClass("hover:border-2")
    // Disable the button
    $(this).prop("disabled", true);


    let countdown = 60;

    // Remove hover effect
    $(this).removeClass("hover:bg-red-500")
    // Update the button text with the remaining time
    $("#otpSendBtn").text("Wait " + countdown + " seconds");


    const interval = setInterval(function () {
        countdown--;

        // Update the button text

        // Check if countdown is finished
        if (countdown === 0 && isEmailVerified === false) {
            otpSendBtn.prop("disabled", false);
            $("#otpFld").prop("disabled", false)
            otpSendBtn.text("Resend OTP");
            otpSendBtn.addClass("hover:bg-red-500")
            clearInterval(interval);
        }else if(countdown === 0 && isEmailVerified === true){
            otpSendBtn.prop("disabled", true)
            $("#otpFld").prop("disabled", true)
            $("#otpFld").removeClass("hover:border-2")
            otpSendBtn.removeClass("hover:bg-red-500")
            otpSendBtn.text("Verified");
            clearInterval(interval);
        }
        else if(countdown > 0 && isEmailVerified === false) {
            $("#otpFld").prop("disabled", false)
            otpSendBtn.prop("disabled", false);
            otpSendBtn.text("Wait " + countdown + " seconds");
        }else if(countdown > 0 && isEmailVerified === true){
            otpSendBtn.prop("disabled", true)
            $("#otpFld").prop("disabled", true)
            $("#otpFld").removeClass("hover:border-2")
            otpSendBtn.removeClass("hover:bg-red-500")
            otpSendBtn.text("Verified");
            clearInterval(interval);
        }else if(countdown > 0) {
            otpSendBtn.prop("disabled", false);
            otpSendBtn.text("Wait " + countdown + " seconds");
        }
    }, 1000);

    $.ajax("http://localhost:8080/api/v1/auth/mail/otp/send/"+emailFld.val().trim(),{
        method: "GET",
        success: function (response) {
            $("#success").removeClass("right-[-100%]")
            $("#success").addClass("right-0")
            $("#successDescription").text("OTP sent to your email")
            console.log(response)

            let countdown = 4;
            //Set the timer to hide the alert after 4 seconds
            const setAlertTimer = setInterval(function () {
                countdown--;
                if(countdown === 0){
                    $("#success").removeClass("right-0")
                    $("#success").addClass("right-[-100%]")
                    clearInterval(setAlertTimer);
                }
            }, 1000);
        },
        error: function (error) {
            console.log(error)
        }
    })
});

$("#otpFld").keyup(function (event) {
    const otp = event.target.value.toString().trim();
    console.log("OTP: " + otp);
    if (/^\d{4}$/.test(otp)) {
        $(this).prop("disabled", true)
        $.ajax("http://localhost:8080/api/v1/auth/mail/otp/verify/"+otp,{
            method: "GET",
            success: function (response) {
                if(response === "verified"){
                    isEmailVerified = true;
                    console.log(response)
                }else {
                    isEmailVerified = false;
                    console.log(response)
                }
            },
            error: function (error) {
                $(this).prop("disabled", false)
                console.log(error)
            }
        })
    } else {
        $(this).prop("disabled", false)
    }
});

$("#alertCloseBtn").click(function () {
    $("#alert").removeClass("right-0")
    $("#alert").addClass("right-[-100%]")
})

$("#successCloseBtn").click(function () {
    $("#success").removeClass("right-0")
    $("#success").addClass("right-[-100%]")
})