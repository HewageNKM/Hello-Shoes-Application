const otpSendBtn = $("#otpSendBtn");
const alertMessage = $("#alert")
const successMessage = $("#success")
const btnLoadingAnimation = $("#btnLoadingAnimation")
const fld = $(".fld")
const otpFld = $("#otpFld")
const emailFld = $("#emailFld")
let isEmailVerified = false;
otpSendBtn.prop("disabled", true)
otpSendBtn.removeClass("hover:bg-red-500")


$("#registerForm").submit(function (event) {
    event.preventDefault();
    const email = event.target.email.value.toString().trim().toLocaleLowerCase();
    const password1 = event.target.password1.value.toString().trim();
    const password2 = event.target.password2.value.toString().trim();

    console.log("Email: " + email, "Password1: " + password1, "Password2: " + password2);

    if (isEmailVerified) {
        if ((password1.length > 8) && (password2.length > 8) && (password1 === password2)) {

            $("#password1Fld").removeClass("border-2 border-red-500")
            $("#password2Fld").removeClass("border-2 border-red-500")
            btnLoadingAnimation.removeClass("hidden")
            btnLoadingAnimation.addClass("flex")
            fld.prop("disabled", true)
            fld.removeClass("hover:border-2");
            $("#registerBtn").addClass("cursor-not-allowed")

            $.ajax(BASEURL + "/auth/users", {
                method: "PUT",
                contentType: "application/json",
                data: JSON.stringify({email: email, password: password1}),
                success: function (response) {
                    console.log(response);
                    event.target.reset();
                    btnLoadingAnimation.removeClass("flex")
                    btnLoadingAnimation.addClass("hidden")
                    fld.prop("disabled", false)
                    fld.addClass("hover:border-2");
                    $("#registerBtn").removeClass("cursor-not-allowed")
                    otpFld.addClass("hover:border-2")
                    otpSendBtn.prop("disabled", false)
                    isEmailVerified = false;
                    otpSendBtn.text("Send OTP")

                    alertMessage.removeClass("right-[-100%]")
                    alertMessage.addClass("right-0")
                    $("#successDescription").text("Password update successfully")

                    let count = 4;
                    const setAlertTimer = setInterval(function () {
                        count--;
                        if (count === 0) {
                            alertMessage.removeClass("right-0")
                            alertMessage.addClass("right-[-100%]")
                            clearInterval(setAlertTimer);
                        }
                    }, 1000);

                },
                error: function (error) {
                    console.log(error);
                    let message = "Error updating password!"
                    if (error.responseJSON) {
                        message = error.responseJSON.message;
                    }

                    btnLoadingAnimation.removeClass("flex")
                    btnLoadingAnimation.addClass("hidden")
                    fld.prop("disabled", false)
                    fld.addClass("hover:border-2");
                    $("#registerBtn").removeClass("cursor-not-allowed")
                    otpFld.prop("disabled", false)
                    otpFld.addClass("hover:border-2")
                    otpSendBtn.prop("disabled", false)
                    isEmailVerified = false;
                    otpSendBtn.text("Send OTP")

                    alertMessage.removeClass("right-[-100%]")
                    alertMessage.addClass("right-0")
                    $("#alertDescription").text(message)

                    let count = 4;
                    const setAlertTimer = setInterval(function () {
                        count--;
                        if (count === 0) {
                            alertMessage.removeClass("right-0")
                            alertMessage.addClass("right-[-100%]")
                            clearInterval(setAlertTimer);
                        }
                    }, 1000);
                }
            });
        } else {
            $("#password1Fld").addClass("border-2 border-red-500")
            $("#password2Fld").addClass("border-2 border-red-500")

            alertMessage.removeClass("right-[-100%]")
            alertMessage.addClass("right-0")
            $("#alertDescription").text("Passwords do not match or less than 8 characters")

            let count = 4;
            const setAlertTimer = setInterval(function () {
                count--;
                if (count === 0) {
                    alertMessage.removeClass("right-0")
                    alertMessage.addClass("right-[-100%]")
                    clearInterval(setAlertTimer);
                }
            }, 1000);
        }
    } else {
        alertMessage.removeClass("right-[-100%]")
        alertMessage.addClass("right-0")
        $("#alertDescription").text("Email not verified yet. Please verify your email first.")
        let count = 4;
        const setAlertTimer = setInterval(function () {
            count--;
            if (count === 0) {
                alertMessage.removeClass("right-0")
                alertMessage.addClass("right-[-100%]")
                clearInterval(setAlertTimer);
            }
        }, 1000);
    }
});

emailFld.keyup(function (event) {
    const email = event.target.value;
    if (/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        otpSendBtn.removeAttr("disabled")
        otpSendBtn.addClass("hover:bg-red-500")
    } else {
        otpSendBtn.attr("disabled", "disabled")
        otpSendBtn.removeClass("hover:bg-red-500")
    }
});

otpSendBtn.click(function () {
    if (!/^[\w-.]+@([\w-]+\.)+[\w-]+$/.test(emailFld.val().trim())) {
        return;
    }
    emailFld.attr("disabled", "disabled")
    emailFld.removeClass("hover:border-2")
    $(this).prop("disabled", true);
    $(this).removeClass("hover:bg-red-500")

    let countdown = 60;


    $.ajax(BASEURL + "/auth/users/forgot-password/" + emailFld.val().trim(), {
        method: "GET",
        success: function (response) {
            successMessage.removeClass("right-[-100%]")
            successMessage.addClass("right-0")
            $("#successDescription").text("OTP sent to your email")
            console.log(response)

            let count = 4;
            const setAlertTimer = setInterval(function () {
                count--;
                if (count === 0) {
                    successMessage.removeClass("right-0")
                    successMessage.addClass("right-[-100%]")
                    clearInterval(setAlertTimer);
                }
            }, 1000);

           otpSendBtn.text("Wait " + countdown + " seconds");

            const interval = setInterval(function () {
                countdown--;

                if (countdown === 0 && isEmailVerified === false) {
                    otpSendBtn.prop("disabled", false);
                    $("#otpFld").prop("disabled", false)
                    otpSendBtn.text("Resend OTP");
                    otpSendBtn.addClass("hover:bg-red-500")
                    clearInterval(interval);
                } else if (countdown === 0 && isEmailVerified === true) {
                    otpSendBtn.prop("disabled", true)
                    otpFld.prop("disabled", true)
                    otpFld.removeClass("hover:border-2")
                    otpSendBtn.removeClass("hover:bg-red-500")
                    otpSendBtn.text("Verified");
                    clearInterval(interval);
                } else if (countdown > 0 && isEmailVerified === false) {
                    otpFld.prop("disabled", false)
                    otpSendBtn.prop("disabled", false);
                    otpSendBtn.text("Wait " + countdown + " seconds");
                } else if (countdown > 0 && isEmailVerified === true) {
                    otpSendBtn.prop("disabled", true)
                    otpFld.prop("disabled", true)
                    otpFld.removeClass("hover:border-2")
                    otpSendBtn.removeClass("hover:bg-red-500")
                    otpSendBtn.text("Verified");
                    clearInterval(interval);
                } else if (countdown > 0) {
                    otpSendBtn.prop("disabled", false);
                    otpSendBtn.text("Wait " + countdown + " seconds");
                }
            }, 1000);
        },
        error: function (error) {
            $(this).prop("disabled", false);
            $(this).addClass("hover:bg-red-500")
            emailFld.prop("disabled", false)
            emailFld.addClass("hover:border-2")
            console.log(error.responseJSON)
            if (error.responseJSON) {
                alertMessage.removeClass("right-[-100%]")
                alertMessage.addClass("right-0")
                $("#alertDescription").text(error.responseJSON.message)
                let count = 4;
                const setAlertTimer = setInterval(function () {
                    count--;
                    if (count === 0) {
                        alertMessage.removeClass("right-0")
                        alertMessage.addClass("right-[-100%]")
                        clearInterval(setAlertTimer);
                    }
                }, 1000);
            } else {
                alertMessage.removeClass("right-[-100%]")
                alertMessage.addClass("right-0")
                $("#alertDescription").text("Email not found.")
                let count = 4;
                const setAlertTimer = setInterval(function () {
                    count--;
                    if (count === 0) {
                        alertMessage.removeClass("right-0")
                        alertMessage.addClass("right-[-100%]")
                        clearInterval(setAlertTimer);
                    }
                }, 1000);
            }
        }
    })
});

otpFld.keyup(function (event) {
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
                let count = 4;
                const setAlertTimer = setInterval(function () {
                    count--;
                    if (count === 0) {
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
    alertMessage.removeClass("right-0");
    alertMessage.addClass("right-[-100%]");
})

$("#successCloseBtn").click(function () {
    successMessage.removeClass("right-0");
    successMessage.addClass("right-[-100%]");
})