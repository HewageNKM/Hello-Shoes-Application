$("#proceedBtn").click(function () {
});

$("#orderIdFld").on('keypress', function (e) {
    if (e.which === 13) {
        if(e.target.value.toString().length < 8) return;
        const orderId = e.target.value.toString().toLowerCase();
        $("#orderIdLoadingAnimation").removeClass("hidden");
        $.ajax({
            url: BASEURL + '/inventory/sales/' + orderId,
            type: 'GET',
            success: function (data) {
                console.log(data);
                $("#orderIdLoadingAnimation").addClass("hidden");
                $("#orderIdConfirmMarkup").removeClass("hidden");
            },
            error: function (err) {
                console.log(err);
                $("#orderIdLoadingAnimation").addClass("hidden");
            }
        });
    }
});
$("#itemIdFld").on('keypress', function (e) {
    if (e.which === 13) {
        if(e.target.value.toString().length < 8) return;
        const itemId = e.target.value.toString().toLowerCase();
        $("#itemIdLoadingAnimation").removeClass("hidden");
        $.ajax({
            url: BASEURL + '/inventory/sales/items/' + itemId,
            type: 'GET',
            success: function (data) {
                console.log(data);
                $("#itemLoadingAnimation").addClass("hidden");
                $("#itemIdConfirmMark").removeClass("hidden");
            },
            error: function (err) {
                console.log(err);
                $("#itemIdLoadingAnimation").addClass("hidden");
            }
        });
    }
});
$("#userVerifyForm").submit(function (e) {
    e.preventDefault();

    const email = e.target.email.value.toString();
    const password = e.target.password.value.toString();

    if (password.trim().length < 8) {
        $("#passwordFld").addClass("border-red-500");
    } else {
        $("#passwordFld").removeClass("border-red-500");
    }

    $.ajax({
        url: BASEURL + '/auth/users/verify',
        type: 'POST',
        data: {
            email: email,
            password: password
        },
        success: function (data) {
            console.log(data);
        },
        error: function (err) {
            console.log(err);
        }
    })
});