const otpSendBtn = $("#otpSendBtn");
let isEmailVerified = false;
otpSendBtn.prop("disabled", true)
otpSendBtn.removeClass("hover:bg-red-500")

$("#registerForm").submit(function (event) {
    event.preventDefault();
    const email = event.target.email.value.toString().trim().toLocaleLowerCase();
    const password1 = event.target.password1.value.toString().trim();
    const password2 = event.target.password2.value.toString().trim();
    const  role = event.target.role.value.toString().trim();

    console.log("Email: " + email, "Password1: " + password1, "Password2: " + password2);

    if (isEmailVerified) {
        if ((password1.length > 8) && (password2.length > 8) && (password1 === password2)) {
            $("#password1Fld").removeClass("border-2 border-red-500")
            $("#password2Fld").removeClass("border-2 border-red-500")
            $("#btnLoadingAnimation").removeClass("hidden");
            $("#btnLoadingAnimation").addClass("flex");
            $(".fld").prop("disabled", true);
            $("#registerBtn").addClass("cursor-not-allowed");
            $.ajax(BASEURL + "/auth/users", {
                method: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    email: email,
                    password: password1,
                    role: role

                }),
                success: function (response) {
                    console.log(response);
                    event.target.reset();
                    $("#btnLoadingAnimation").removeClass("flex");
                    $("#btnLoadingAnimation").addClass("hidden");
                    $(".fld").prop("disabled", false);
                    $("#registerBtn").removeClass("cursor-not-allowed");

                    const alert = $("#success");
                    alert.removeClass("right-[-100%]")
                    alert.addClass("right-0")
                    $("#successDescription").text("User registered successfully")
                    let countdown = 4;
                    const setAlertTimer = setInterval(function () {
                        countdown--;
                        if (countdown === 0) {
                            alert.removeClass("right-0")
                            alert.addClass("right-[-100%]")
                            clearInterval(setAlertTimer);
                        }
                    }, 1000);
                },
                error: function (error) {
                    console.log(error.responseJSON);
                    const alert = $("#alert");
                    $("#btnLoadingAnimation").removeClass("flex");
                    $("#btnLoadingAnimation").addClass("hidden");
                    $(".fld").prop("disabled", false);
                    $("#registerBtn").removeClass("cursor-not-allowed");
                    if (error.responseJSON) {
                        alert.removeClass("right-[-100%]")
                        alert.addClass("right-0")
                        $("#alertDescription").text(error.responseJSON.message)

                        let countdown = 4;
                        const setAlertTimer = setInterval(function () {
                            countdown--;
                            if (countdown === 0) {
                                alert.removeClass("right-0")
                                alert.addClass("right-[-100%]")
                                clearInterval(setAlertTimer);
                            }
                        }, 1000);
                    } else {
                        alert.removeClass("right-[-100%]")
                        alert.addClass("right-0")
                        $("#alertDescription").text("Something went wrong. Please try again.")
                        let countdown = 4;
                        const setAlertTimer = setInterval(function () {
                            countdown--;
                            if (countdown === 0) {
                                alert.removeClass("right-0")
                                alert.addClass("right-[-100%]")
                                clearInterval(setAlertTimer);
                            }
                        }, 1000);

                    }
                }
            });
        } else {
            $("#password1Fld").addClass("border-2 border-red-500")
            $("#password2Fld").addClass("border-2 border-red-500")

            const alert = $("#alert");
            alert.removeClass("right-[-100%]")
            alert.addClass("right-0")
            $("#alertDescription").text("Passwords do not match or less than 8 characters")

            let countdown = 4;
            const setAlertTimer = setInterval(function () {
                countdown--;
                if (countdown === 0) {
                    alert.removeClass("right-0")
                    alert.addClass("right-[-100%]")
                    clearInterval(setAlertTimer);
                }
            }, 1000);
        }
    } else {
        const alert = $("#alert");
        alert.removeClass("right-[-100%]")
        alert.addClass("right-0")
        $("#alertDescription").text("Email not verified yet. Please verify your email first.")
        let countdown = 4;
        const setAlertTimer = setInterval(function () {
            countdown--;
            if (countdown === 0) {
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
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]+$/.test(emailFld.val().trim())) {
        return;
    }
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
        } else if (countdown === 0 && isEmailVerified === true) {
            otpSendBtn.prop("disabled", true)
            $("#otpFld").prop("disabled", true)
            $("#otpFld").removeClass("hover:border-2")
            otpSendBtn.removeClass("hover:bg-red-500")
            otpSendBtn.text("Verified");
            clearInterval(interval);
        } else if (countdown > 0 && isEmailVerified === false) {
            $("#otpFld").prop("disabled", false)
            otpSendBtn.prop("disabled", false);
            otpSendBtn.text("Wait " + countdown + " seconds");
        } else if (countdown > 0 && isEmailVerified === true) {
            otpSendBtn.prop("disabled", true)
            $("#otpFld").prop("disabled", true)
            $("#otpFld").removeClass("hover:border-2")
            otpSendBtn.removeClass("hover:bg-red-500")
            otpSendBtn.text("Verified");
            clearInterval(interval);
        } else if (countdown > 0) {
            otpSendBtn.prop("disabled", false);
            otpSendBtn.text("Wait " + countdown + " seconds");
        }
    }, 1000);

    $.ajax(BASEURL + "/auth/mail/otp/send/" + emailFld.val().trim(), {
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
                if (countdown === 0) {
                    $("#success").removeClass("right-0")
                    $("#success").addClass("right-[-100%]")
                    clearInterval(setAlertTimer);
                }
            }, 1000);
        },
        error: function (error) {
            console.log(error)
            const alert = $("#alert");
            $(this).prop("disabled", false);
            // Remove hover effect
            $(this).addClass("hover:bg-red-500")
            alert.removeClass("right-[-100%]")
            alert.addClass("right-0")
            $("#alertDescription").text("Something went wrong. Please try again.")
            let countdown = 4;
            //Set the timer to hide the alert after 4 seconds
            const setAlertTimer = setInterval(function () {
                countdown--;
                if (countdown === 0) {
                    alert.removeClass("right-0")
                    alert.addClass("right-[-100%]")
                    clearInterval(setAlertTimer);
                }
            }, 1000);
        }
    })
});

$("#otpFld").keyup(function (event) {
    const otp = event.target.value.toString().trim();
    console.log("OTP: " + otp);
    if (/^\d{4}$/.test(otp)) {
        $(this).prop("disabled", true)
        $.ajax(BASEURL + "/auth/mail/otp/verify/" + otp, {
            method: "GET",
            success: function (response) {
                if (response === "verified") {
                    isEmailVerified = true;
                    console.log(response)
                } else {
                    isEmailVerified = false;
                    console.log(response)
                }
            },
            error: function (error) {
                $(this).prop("disabled", false)
                console.log(error)
                const alert = $("#alert");
                alert.removeClass("right-[-100%]")
                alert.addClass("right-0")
                $("#alertDescription").text("Something went wrong. Please try again.")
                let countdown = 4;
                //Set the timer to hide the alert after 4 seconds
                const setAlertTimer = setInterval(function () {
                    countdown--;
                    if (countdown === 0) {
                        alert.removeClass("right-0")
                        alert.addClass("right-[-100%]")
                        clearInterval(setAlertTimer);
                    }
                }, 1000);
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